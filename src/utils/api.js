import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  return 'https://api.reachskyline.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // Matching 30s server timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor to dynamically attach JWT tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('erp_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for automatic retry with exponential backoff and auth verification
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response } = error;
    
    // Check if network error (no response) or server 5xx error on idempotent GET requests
    const isGetRequest = config?.method?.toLowerCase() === 'get';
    const isNetworkError = !response;
    const isServerError = response && response.status >= 500;
    
    if (config && isGetRequest && (isNetworkError || isServerError)) {
      config.__retryCount = config.__retryCount || 0;
      config.__maxRetries = config.__maxRetries || 3;
      config.__backoff = config.__backoff || 1000; // Start with 1 second

      if (config.__retryCount < config.__maxRetries) {
        config.__retryCount += 1;
        
        // Exponential backoff delay
        const delay = config.__backoff * Math.pow(2, config.__retryCount - 1);
        
        // Notify retry listener if defined
        if (config.onRetry) {
          config.onRetry(config.__retryCount, delay);
        }

        console.warn(`API call failed: ${error.message}. Retrying request (Attempt ${config.__retryCount}/${config.__maxRetries}) in ${delay}ms...`);
        
        await new Promise((resolve) => setTimeout(resolve, delay));
        
        // Re-execute the request with the updated config
        return api(config);
      }
    }

    // Session invalidated or unauthorized access
    const isSessionExpired = response && (
      response.status === 401 ||
      (response.status === 403 && (
        (response.data?.message && /session expired|invalid token|jwt expired/i.test(response.data.message)) ||
        (response.data?.errors && response.data.errors.some(e => /jwt expired|invalid signature|jwt malformed/i.test(String(e))))
      ))
    );

    if (isSessionExpired) {
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');
      
      // Auto redirect to login page (avoiding loops if already there)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
