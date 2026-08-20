import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.get('/notifications');
      if (response.data && response.data.success) {
        const list = response.data.data.notifications;
        setNotifications(list);
        
        // Count unread notifications
        const unread = list.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
    }
  }, [isAuthenticated]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      // Update local state instantly
      setNotifications(prev =>
        prev.map(n => (n.id === parseInt(id) ? { ...n, is_read: 1 } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err.message);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err.message);
    }
  };

  // Poll for notifications if user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // 30 seconds polling
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      notifications: [],
      unreadCount: 0,
      fetchNotifications: async () => {},
      markAsRead: async () => {},
      markAllRead: async () => {}
    };
  }
  return context;
};
