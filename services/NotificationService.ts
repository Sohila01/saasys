
import { api } from './api';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  time: string;
  isRead: boolean;
}

const STORAGE_KEY = 'nexus_notifications_store';

export const notificationService = {
  getNotifications(): AppNotification[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [
      { id: 'init', title: 'System Online', message: 'Nexus kernel v4.2.0 initialized successfully.', type: 'success', time: 'Just now', isRead: false }
    ];
  },

  notify(title: string, message: string, type: AppNotification['type'] = 'info') {
    const current = this.getNotifications();
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    const updated = [newNotif, ...current].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('nexus_notification'));
  },

  markAsRead(id: string) {
    const updated = this.getNotifications().map(n => n.id === id ? { ...n, isRead: true } : n);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('nexus_notification'));
  },

  clearAll() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event('nexus_notification'));
  }
};
