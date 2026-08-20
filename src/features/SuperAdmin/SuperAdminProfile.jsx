import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, ShieldCheck, ShieldAlert, Save, RefreshCw, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';

const SuperAdminProfile = () => {
  const { user, updateCurrentUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Keep local username updated if user object changes
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    if (!username.trim()) {
      setFeedback({ type: 'danger', text: 'Username is required.' });
      return;
    }

    if (password) {
      if (password.length < 6) {
        setFeedback({ type: 'danger', text: 'Password must be at least 6 characters long.' });
        return;
      }
      if (password !== confirmPassword) {
        setFeedback({ type: 'danger', text: 'Passwords do not match.' });
        return;
      }
    }

    setLoading(true);
    try {
      const res = await api.put('/super-admin/profile', {
        username: username.trim(),
        password: password ? password : undefined
      });

      if (res.data.success) {
        updateCurrentUser({ username: username.trim() });
        setFeedback({ type: 'success', text: 'Profile credentials updated successfully!' });
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setFeedback({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to update profile credentials.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={26} style={{ color: 'var(--primary)' }} />
          Super Admin Profile
        </h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
          Review, verify, and update your root administrator authentication credentials.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '30px' }}>
        
        {/* Left Column: Profile Card */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Profile Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={30} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{user?.username}</h3>
                <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', marginTop: '2px' }}>
                  <ShieldCheck size={14} /> Root Super Administrator
                </span>
              </div>
            </div>

            {/* Details List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Username account</span>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{user?.username}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Email address</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{user?.email}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Role context</span>
                <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)' }}>{user?.role}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Account status</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase' }}>{user?.status}</span>
              </div>
            </div>
          </div>

          {/* Caution Warning Box */}
          <div style={{ marginTop: '30px', padding: '16px', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '6px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <ShieldAlert size={20} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 800, color: '#b45309' }}>System Access Warning</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#b45309', lineHeight: 1.4 }}>
                As a root super administrator, you have complete read, write, update, and delete access across all corporate offices, databases, and operational division configurations. Handle administrative CRUD actions with caution.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Update Credentials Card */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 800, color: 'var(--text-color)' }}>Update Credentials</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: 'var(--text-muted)' }}>Modify your root administrative username and security access password.</p>

          {feedback.text && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: feedback.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
              color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `4px solid ${feedback.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
            }}>
              {feedback.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-color)' }}>
                Super Admin Username
              </label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter new username..."
                style={{ width: '100%', padding: '10px' }}
                required
              />
            </div>

             <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-color)' }}>
                New Password <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Leave blank to keep current)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '10px', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: 'var(--text-color)' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '10px', paddingRight: '40px' }}
                  required={password !== ''}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Updating Credentials...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Profile Changes
                </>
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default SuperAdminProfile;
