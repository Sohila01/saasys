
import { useState, useCallback } from 'react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  time: string;
  isRead: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: '1', title: 'Welcome to Nexus', message: 'Explore your new multi-tenant dashboard.', type: 'info', time: 'Just now', isRead: false },
  ]);

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'time' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      time: 'Just now',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return { notifications, addNotification, markAsRead, markAllAsRead, unreadCount };
};
