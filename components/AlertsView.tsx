
import React from 'react';
import { Notification, Theme } from '../types';

interface AlertsViewProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  theme: Theme;
}

const AlertsView: React.FC<AlertsViewProps> = ({ notifications, onMarkAsRead, onClearAll, theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Notifications
        </h2>
        {notifications.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-sm font-medium text-blue-500 hover:text-blue-600"
          >
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <span className={`material-symbols-outlined text-4xl ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              notifications_off
            </span>
          </div>
          <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            All caught up!
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            No new alerts for your area at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              onClick={() => onMarkAsRead(notification.id)}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                notification.isRead 
                  ? (isDark ? 'bg-slate-800/50 border-slate-700/50 opacity-70' : 'bg-white border-slate-100 opacity-70')
                  : (isDark ? 'bg-slate-800 border-blue-500/30' : 'bg-white border-blue-100 shadow-sm')
              }`}
            >
              {!notification.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
              
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'alert' ? 'bg-red-100 text-red-500' :
                  notification.type === 'warning' ? 'bg-orange-100 text-orange-500' :
                  'bg-blue-100 text-blue-500'
                }`}>
                  <span className="material-symbols-outlined text-lg">
                    {notification.type === 'alert' ? 'error' : 
                     notification.type === 'warning' ? 'warning' : 'info'}
                  </span>
                </div>
                
                <div className="flex-grow">
                  <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {notification.title}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {notification.message}
                  </p>
                  <span className={`text-[10px] mt-2 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notification.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`mt-8 p-4 rounded-2xl border border-dashed ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'}`}>
        <h5 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Pro Tip
        </h5>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Enable push notifications in your system settings to get real-time alerts even when the app is closed.
        </p>
      </div>
    </div>
  );
};

export default AlertsView;
