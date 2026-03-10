
import React, { useState, useCallback, useEffect } from 'react';
import { Screen, Message, Theme, UserProfile, Notification } from './types';
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';
import ScannerView from './components/ScannerView';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';
import LoginView from './components/LoginView';
import AlertsView from './components/AlertsView';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('app_theme') as Theme) || 'colorful';
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem('user_profile');
    return stored ? JSON.parse(stored) : { name: 'Admin', role: 'Admin' };
  });
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('app_notifications');
    return stored ? JSON.parse(stored) : [];
  });
  
  // Initialize from localStorage with expiration check
  const getStoredValue = (key: string, defaultValue: string) => {
    const stored = localStorage.getItem(key);
    const timestamp = localStorage.getItem(`${key}_timestamp`);
    
    if (stored && timestamp) {
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      if (now - parseInt(timestamp) < oneHour) {
        return stored;
      }
    }
    return defaultValue;
  };

  const [address, setAddress] = useState<string>(() => getStoredValue('nyc_address', ''));
  const [borough, setBorough] = useState<string>(() => getStoredValue('nyc_borough', 'Manhattan'));

  // Update localStorage and timestamp on change
  useEffect(() => {
    if (address) {
      localStorage.setItem('nyc_address', address);
      localStorage.setItem('nyc_address_timestamp', Date.now().toString());
      
      // Update frequency list
      const freqList = JSON.parse(localStorage.getItem('nyc_address_freq') || '[]');
      const existing = freqList.find((item: any) => item.address === address);
      if (existing) {
        existing.count += 1;
      } else {
        freqList.push({ address, count: 1 });
      }
      // Sort by count and keep top 10
      const top10 = freqList.sort((a: any, b: any) => b.count - a.count).slice(0, 10);
      localStorage.setItem('nyc_address_freq', JSON.stringify(top10));
    } else {
      localStorage.removeItem('nyc_address');
      localStorage.removeItem('nyc_address_timestamp');
    }
  }, [address]);

  useEffect(() => {
    localStorage.setItem('nyc_borough', borough);
    localStorage.setItem('nyc_borough_timestamp', Date.now().toString());
  }, [borough]);

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Simulate upcoming street cleaning alerts when address changes
  useEffect(() => {
    if (address && address.length > 5) {
      const timer = setTimeout(() => {
        const newAlert: Notification = {
          id: `alert-${Date.now()}`,
          title: 'Upcoming Street Cleaning',
          message: `Street cleaning is scheduled for ${address} tomorrow between 8:30 AM and 10:00 AM. Please move your vehicle.`,
          type: 'alert',
          timestamp: Date.now(),
          isRead: false
        };
        
        setNotifications(prev => {
          // Check if we already have a similar alert to avoid spamming
          const exists = prev.some(n => n.title === newAlert.title && n.message === newAlert.message);
          if (exists) return prev;
          return [newAlert, ...prev].slice(0, 20); // Keep last 20
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [address]);

  // Inactivity check
  useEffect(() => {
    const handleActivity = () => {
      if (address) {
        localStorage.setItem('nyc_address_timestamp', Date.now().toString());
        localStorage.setItem('nyc_borough_timestamp', Date.now().toString());
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    const interval = setInterval(() => {
      const timestamp = localStorage.getItem('nyc_address_timestamp');
      if (timestamp) {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        if (now - parseInt(timestamp) >= oneHour) {
          setAddress('');
          localStorage.removeItem('nyc_address');
          localStorage.removeItem('nyc_address_timestamp');
        }
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [address]);

  const navigateTo = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
    if (screen !== 'chat') {
      setInitialPrompt('');
    }
    window.scrollTo(0, 0);
  }, []);

  const startChat = useCallback((prompt?: string) => {
    if (prompt) {
      setInitialPrompt(prompt);
      setChatHistory([]); // Clear history for new search
    }
    navigateTo('chat');
  }, [navigateTo]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setAddress('');
    localStorage.removeItem('nyc_address');
    localStorage.removeItem('nyc_address_timestamp');
    setCurrentScreen('home');
  };

  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeView onStartChat={startChat} onStartScan={() => navigateTo('scanner')} locationContext={`${borough}, ${address}`} theme={theme} />;
      case 'chat':
        return <ChatView initialPrompt={initialPrompt} history={chatHistory} setHistory={setChatHistory} onBack={() => navigateTo('home')} locationContext={`${borough}, ${address}`} theme={theme} />;
      case 'scanner':
        return <ScannerView onBack={() => navigateTo('home')} theme={theme} onAnalysisResult={(res) => {
          setChatHistory([{ id: Date.now().toString(), role: 'assistant', content: `Analysis of your scanned sign:\n\n${res}` }]);
          navigateTo('chat');
        }} />;
      case 'map':
        return <div className="p-10 text-center font-bold text-slate-400">Map feature coming soon!</div>;
      case 'saved':
        return <div className="p-10 text-center font-bold text-slate-400">Your saved rules will appear here.</div>;
      case 'alerts':
        return (
          <AlertsView 
            notifications={notifications} 
            onMarkAsRead={handleMarkAsRead} 
            onClearAll={handleClearAll} 
            theme={theme} 
          />
        );
      default:
        return <HomeView onStartChat={startChat} onStartScan={() => navigateTo('scanner')} theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col max-w-md mx-auto shadow-xl transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-900 text-white' : 
      theme === 'colorful' ? 'bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50' : 
      'bg-background-light'
    }`}>
      {currentScreen !== 'chat' && currentScreen !== 'scanner' && (
        <TopBar 
          address={address} 
          borough={borough} 
          onAddressChange={setAddress} 
          onBoroughChange={setBorough}
          theme={theme}
          onThemeChange={setTheme}
          userProfile={userProfile}
          onProfileChange={setUserProfile}
          onLogout={handleLogout}
        />
      )}
      
      <main className="flex-grow pb-24">
        {renderScreen()}
      </main>

      <BottomNav currentScreen={currentScreen} onNavigate={navigateTo} theme={theme} unreadCount={unreadCount} />
    </div>
  );
};

export default App;
