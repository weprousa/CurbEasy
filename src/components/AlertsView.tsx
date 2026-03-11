import React from 'react';
import { Notification, Theme } from '../types';

interface AlertsViewProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  theme: Theme;
}

const AlertsView: React.FC<AlertsViewProps> = ({ notifications, onMarkAsRead, onClearAll, theme }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Notifications</h2>
        {notifications.length > 0 && (
          <button 
            onClick={onClearAll}
            className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-primary'}`}
          >
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
            <span className="material-symbols-outlined text-4xl">notifications_off</span>
          </div>
          <div>
            <p className={`font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-900'}`}>All caught up!</p>
            <p className="text-sm text-slate-500">No new alerts for your area.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => onMarkAsRead(notif.id)}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                notif.isRead 
                  ? theme === 'dark' ? 'bg-slate-800/50 border-slate-700 opacity-60' : 'bg-slate-50 border-slate-100 opacity-60'
                  : theme === 'dark' ? 'bg-slate-800 border-slate-700 shadow-sm' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {!notif.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
              <div className="flex gap-4">
                <div className={`flex-none w-10 h-10 rounded-xl flex items-center justify-center ${
                  notif.type === 'alert' ? 'bg-red-100 text-red-600' : 
                  notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                  'bg-blue-100 text-blue-600'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {notif.type === 'alert' ? 'emergency_home' : notif.type === 'warning' ? 'warning' : 'info'}
                  </span>
                </div>
                <div className="flex-grow space-y-1">
                  <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{notif.title}</h3>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{notif.message}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pt-1">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsView;
