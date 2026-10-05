import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, User, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import reachskylineLogo from '../../../assets/reachskyline-logo.webp';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryStatus, setRetryStatus] = useState('');

  // Check if redirected due to expired token
  const isExpired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      const msg = 'Username and password are required.';
      setError(msg);
      return;
    }

    setError('');
    setRetryStatus('');
    setLoading(true);
    
    try {
      const result = await login(cleanUsername, cleanPassword, (attempt, delay) => {
        setRetryStatus(`Connecting to server... (Attempt ${attempt}/3)`);
      });

      console.log('[Login] login result:', result);

      if (result && result.success) {
        const storedUser = localStorage.getItem('erp_user');
        let user = null;
        try {
          user = storedUser ? JSON.parse(storedUser) : null;
        } catch (_) {}

        if (user && (user.role === 'client' || user.user_type === 'client')) {
          window.location.href = '/client/dashboard';
          return;
        } else if (user && user.role === 'super_admin') {
          window.location.href = '/super-admin/dashboard';
        } else if (user && user.role === 'manager') {
          window.location.href = '/manager/dashboard';
        } else if (user && user.role === 'employee') {
          window.location.href = '/employee/dashboard';
        } else {
          window.location.href = '/admin/dashboard';
        }
      } else {
        const errMsg = result?.message || 'Wrong credentials! Invalid email/username or password.';
        setError(errMsg);
      }
    } catch (err) {
      console.error('[Login] Error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Wrong credentials! Invalid email/username or password.';
      setError(errMsg);
    } finally {
      setLoading(false);
      setRetryStatus('');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-main-wrapper">
        {/* Left Side: Large Animated Logo with Strong #DAA618 Spreading Gradient Glow */}
        <div className="login-left-section">
          <div className="reachskyline-logo-wrapper">
            <div className="reachskyline-logo-glow"></div>
            <img 
              src={reachskylineLogo} 
              alt="ReachSkyline Logo" 
              className="reachskyline-brand-logo"
            />
          </div>
        </div>

        {/* Right Side: Sign In Form Alone in a Card */}
        <div className="login-right-section">
          <div className="login-form-card">
            <div className="login-form-header">
              <h2 className="login-form-title">Sign In</h2>
              <p className="login-form-subtitle">Enter your credentials to access your account</p>
            </div>

            {/* Global Warnings / Errors */}
            {error && (
              <div className="login-alert login-alert-danger">
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Retry/Reconnecting status banner */}
            {retryStatus && (
              <div className="login-alert login-alert-info">
                <Loader2 size={18} className="animate-spin" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
                <span>{retryStatus}</span>
              </div>
            )}

            {isExpired && !error && !retryStatus && (
              <div className="login-alert login-alert-warning">
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>Session expired. Please log in again.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Username Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="username">Username or Email</label>
                <div className="input-with-icon">
                  <User 
                    size={18} 
                    className="input-icon"
                  />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="form-control"
                    placeholder="Enter your username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock 
                    size={18} 
                    className="input-icon"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    style={{ paddingRight: '44px' }}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
