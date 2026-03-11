import React from 'react';
import { Screen, Theme } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  theme: Theme;
  unreadCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, theme, unreadCount }) => {
  const isNavVisible = ['home', 'map', 'saved', 'alerts'].includes(currentScreen);
  if (!isNavVisible) return null;

  const NavItem = ({ screen, icon, label, badge }: { screen: Screen, icon: string, label: string, badge?: number }) => {
    const isActive = currentScreen === screen;
    return (
      <button 
        onClick={() => onNavigate(screen)}
        className="flex flex-col items-center justify-center w-16 gap-1 group relative"
      >
        <span className={`material-symbols-outlined text-[26px] transition-colors ${
          isActive 
            ? theme === 'dark' ? 'text-blue-400' : 'text-primary' 
            : theme === 'dark' ? 'text-slate-500 group-hover:text-slate-400' : 'text-slate-400 group-hover:text-slate-600'
        }`}>
          {icon}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
          isActive 
            ? theme === 'dark' ? 'text-blue-400' : 'text-primary' 
            : theme === 'dark' ? 'text-slate-500 group-hover:text-slate-400' : 'text-slate-400 group-hover:text-slate-600'
        }`}>
          {label}
        </span>
        {badge !== undefined && badge > 0 && (
          <div className="absolute top-0 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
            {badge}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className={`fixed bottom-0 w-full max-w-md backdrop-blur-lg border-t pb-safe pt-2 z-50 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-900/95 border-slate-800' : 'bg-white/90 border-slate-200'
    }`}>
      <div className="flex justify-around items-center h-16">
        <NavItem screen="home" icon="home" label="Home" />
        <NavItem screen="map" icon="map" label="Map" />
        <NavItem screen="saved" icon="bookmark" label="Saved" />
        <NavItem screen="alerts" icon="notifications" label="Alerts" badge={unreadCount} />
      </div>
      <div className="h-4 w-full"></div>
    </div>
  );
};

export default BottomNav;
