
import React, { useState, useEffect } from 'react';
import { XMarkIcon, BellIcon, TrashIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { notificationService, AppNotification } from '../services/NotificationService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const load = () => setNotifications(notificationService.getNotifications());

  useEffect(() => {
    load();
    window.addEventListener('nexus_notification', load);
    return () => window.removeEventListener('nexus_notification', load);
  }, []);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />;
      case 'error': return <XMarkIcon className="h-5 w-5 text-rose-500" />;
      default: return <InformationCircleIcon className="h-5 w-5 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 border-l border-slate-100">
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl">
                <BellIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Feed</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time ecosystem events</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
              <XMarkIcon className="h-6 w-6 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => notificationService.markAsRead(n.id)}
                className={`p-6 rounded-[2rem] border transition-all cursor-pointer relative group overflow-hidden ${
                  n.isRead ? 'bg-slate-50/50 border-slate-100 opacity-60' : 'bg-white border-indigo-100 shadow-xl shadow-indigo-500/5'
                }`}
              >
                {!n.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600" />
                )}
                <div className="flex items-start space-x-4">
                  <div className="mt-1 shrink-0">{getIcon(n.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-black tracking-tight ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</p>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {notifications.length === 0 && (
              <div className="text-center py-32 border-2 border-dashed border-slate-100 rounded-[3rem]">
                <BellIcon className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 font-bold text-sm tracking-tight uppercase tracking-widest">Feed is currently dormant.</p>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex space-x-4">
            <button 
              onClick={() => notificationService.clearAll()}
              className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-all flex items-center justify-center space-x-2"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Purge All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
