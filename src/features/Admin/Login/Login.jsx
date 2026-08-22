import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, User, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

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
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      const msg = 'Wrong credentials! Username and password are required.';
      setError(msg);
      alert(msg);
      return;
    }

    setError('');
    setRetryStatus('');
    setLoading(true);
    
    try {
      const result = await login(username, password, (attempt, delay) => {
        setRetryStatus(`Server is starting... Trying again (Attempt ${attempt}/3)...`);
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
        alert(errMsg);
      }
    } catch (err) {
      console.error('[Login] Error:', err);
      const errMsg = err.response?.data?.message || 'Wrong credentials! Invalid email/username or password.';
      setError(errMsg);
      alert(errMsg);
    } finally {
      setLoading(false);
      setRetryStatus('');
    }
  };

  return (
    <div className="login-layout">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img src="https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns" alt="ReachSkyline Logo" />
          </div>
          <h2 className="login-title">ReachSkyline ERP</h2>
          
        </div>

        {/* Global Warnings / Errors */}
        {error && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Retry/Reconnecting status banner */}
        {retryStatus && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px'
            }}
          >
            <Loader2 size={18} className="animate-spin" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
            <span>{retryStatus}</span>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {isExpired && !error && !retryStatus && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              backgroundColor: 'var(--warning-light)',
              color: 'var(--warning)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>Session expired. Please log in again.</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} 
              />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '44px' }}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} 
              />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-light)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button - disabled while loading */}
          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginTop: '10px', 
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
