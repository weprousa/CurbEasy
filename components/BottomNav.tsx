
import React from 'react';
import { Screen, Theme } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  theme: Theme;
  unreadCount?: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, theme, unreadCount = 0 }) => {
  const isNavVisible = ['home', 'map', 'saved', 'alerts'].includes(currentScreen);
  if (!isNavVisible) return null;

  const NavItem = ({ screen, icon, label, badge }: { screen: Screen, icon: string, label: string, badge?: number }) => {
    const isActive = currentScreen === screen;
    const activeColor = theme === 'dark' ? 'text-blue-400' : 'text-primary';
    const inactiveColor = theme === 'dark' ? 'text-slate-600' : 'text-slate-400';

    return (
      <button 
        onClick={() => onNavigate(screen)}
        className="flex flex-col items-center justify-center w-16 gap-1 group relative"
      >
        <span className={`material-symbols-outlined text-[26px] transition-colors ${isActive ? `${activeColor} fill-[1]` : `${inactiveColor} group-hover:text-slate-400`}`}>
          {icon}
        </span>
        {badge > 0 && (
          <span className="absolute top-0 right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
        <span className={`text-[10px] font-medium transition-colors ${isActive ? activeColor : inactiveColor}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className={`fixed bottom-0 w-full max-w-md backdrop-blur-lg border-t pb-safe pt-2 z-50 transition-colors ${
      theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
    }`}>
      <div className="flex justify-around items-center h-16">
        <NavItem screen="home" icon="home" label="Dashboard" />
        <NavItem screen="map" icon="map" label="Map" />
        <NavItem screen="saved" icon="bookmark" label="Saved" />
        <NavItem screen="alerts" icon="notifications" label="Alerts" badge={unreadCount} />
      </div>
      <div className="h-4 w-full"></div>
    </div>
  );
};

export default BottomNav;
