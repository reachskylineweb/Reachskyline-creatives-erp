/**
 * Format relative image path from backend (/public/uploads/...) to full URL
 * Works seamlessly across local development (port 5050) and production.
 */
export const getImageUrl = (path) => {
  if (!path || typeof path !== 'string') return '';
  
  // Return untouched if already a full URL or blob or data URI
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl) {
    const base = envUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
    return `${base}${cleanPath}`;
  }

  // Fallback if no VITE_API_URL defined
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `http://localhost:5050${cleanPath}`;
  }

  return cleanPath;
};

export default getImageUrl;
