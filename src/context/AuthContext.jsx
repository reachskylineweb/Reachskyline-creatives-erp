import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('erp_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (_) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Helper to initialize OneSignal Web Push safely
  const setupOneSignal = (loggedUser) => {
    if (!loggedUser) return;

    try {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(function(OneSignal) {
        const registerSubscription = async () => {
          try {
            const subscriptionId = OneSignal.User?.PushSubscription?.id;
            if (subscriptionId) {
              await api.post('/notifications/subscribe', { subscriptionId }).catch(() => {});
            }
          } catch (_) {}
        };

        if (!window.__oneSignalInitialized) {
          try {
            OneSignal.init({
              appId: "ca3c1c80-3492-4268-a200-3be5586be352",
              allowLocalhostAsSecureOrigin: true,
            }).catch((err) => {
              console.warn('[OneSignal] Domain initialization deferred:', err?.message || err);
            });
            window.__oneSignalInitialized = true;
          } catch (e) {
            console.warn('[OneSignal] Init warning:', e.message);
          }
        }

        registerSubscription();

        try {
          OneSignal.User?.PushSubscription?.addEventListener("change", function(event) {
            if (event?.current?.optedIn) {
              registerSubscription();
            }
          });
        } catch (_) {}
      });
    } catch (_) {}
  };

  // Initialize and check session in background on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('erp_token');
      const savedUserRaw = localStorage.getItem('erp_user');
      let savedUser = null;
      try {
        savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null;
      } catch (_) {}

      if (!token) {
        if (savedUser && savedUser.role === 'client') {
          localStorage.setItem('erp_token', 'client-session-token');
          setUser(savedUser);
          setLoading(false);
          return;
        }
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/session');
        if (response.data && response.data.success) {
          const freshUser = response.data.data.user;
          setUser(freshUser);
          localStorage.setItem('erp_user', JSON.stringify(freshUser));
        } else if (savedUser && savedUser.role === 'client') {
          setUser(savedUser);
        } else {
          localStorage.removeItem('erp_token');
          localStorage.removeItem('erp_user');
          setUser(null);
        }
      } catch (err) {
        if (savedUser && savedUser.role === 'client') {
          setUser(savedUser);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Initialize OneSignal when a valid user logs in or session is verified
  useEffect(() => {
    if (user) {
      setupOneSignal(user);
    }
  }, [user]);

  const login = async (username, password, onRetry) => {
    try {
      const response = await api.post('/auth/login', 
        { username, password }, 
        { onRetry }
      );
      
      if (response.data && response.data.success) {
        const { token, user: loggedUser } = response.data.data;
        
        localStorage.setItem('erp_token', token || 'client-session-token');
        localStorage.setItem('erp_user', JSON.stringify(loggedUser));
        
        setUser(loggedUser);
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Wrong credentials! Invalid username or password.';
      const errors = err.response && err.response.data && err.response.data.errors
        ? err.response.data.errors
        : [];
      return { success: false, message: errMsg, errors };
    }
  };

  const logout = async () => {
    try {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignal) {
        try {
          const subscriptionId = OneSignal.User?.PushSubscription?.id;
          if (subscriptionId) {
            await api.post('/notifications/unsubscribe', { subscriptionId }).catch(() => {});
          }
        } catch (_) {}
      });
    } catch (_) {}

    localStorage.removeItem('erp_token');
    localStorage.removeItem('erp_user');
    setUser(null);
    setLoading(false);
  };

  const updateCurrentUser = (updatedFields) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('erp_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    loading,
    login,
    logout,
    updateCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      login: async () => ({ success: false }),
      logout: async () => {},
      updateCurrentUser: () => {}
    };
  }
  return context;
};
