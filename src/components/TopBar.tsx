import React, { useState, useRef } from 'react';
import { Theme, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TopBarProps {
  address: string;
  borough: string;
  onAddressChange: (val: string) => void;
  onBoroughChange: (val: string) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  userProfile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  address, 
  borough, 
  onAddressChange, 
  onBoroughChange,
  theme,
  onThemeChange,
  userProfile,
  onProfileChange,
  onLogout
}) => {
  const [localAddress, setLocalAddress] = useState(address);
  const [localBorough, setLocalBorough] = useState(borough);
  const [isLocating, setIsLocating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local state with props when props change externally
  React.useEffect(() => {
    setLocalAddress(address);
  }, [address]);

  React.useEffect(() => {
    setLocalBorough(borough);
  }, [borough]);

  const handleAddressChange = (val: string) => {
    setLocalAddress(val);
    onAddressChange(val);

    if (val.trim().length > 0) {
      const freqList = JSON.parse(localStorage.getItem('nyc_address_freq') || '[]');
      const matches = freqList
        .filter((item: any) => item.address.toLowerCase().includes(val.toLowerCase()))
        .map((item: any) => item.address);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setLocalAddress(suggestion);
    onAddressChange(suggestion);
    setShowSuggestions(false);
  };

  const handleBoroughChange = (val: string) => {
    setLocalBorough(val);
    onBoroughChange(val);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onProfileChange({ ...userProfile, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using OpenStreetMap's Nominatim API for free reverse geocoding
          // Added email for better API compliance and reliability
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&email=wepros.info@gmail.com`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const addr = data.address;
            
            // More robust street name detection
            const street = addr.road || addr.pedestrian || addr.path || addr.cycleway || addr.suburb || addr.neighbourhood || "Unknown Street";
            const houseNumber = addr.house_number || "";
            const fullStreet = houseNumber ? `${houseNumber} ${street}` : street;
            
            // Map borough more accurately using multiple fields
            const city = addr.city || "";
            const county = addr.county || "";
            const suburb = addr.suburb || "";
            const neighbourhood = addr.neighbourhood || "";
            const locationInfo = `${city} ${county} ${suburb} ${neighbourhood}`.toLowerCase();
            
            let detectedBorough = "Manhattan"; // Default fallback
            
            if (locationInfo.includes("brooklyn") || locationInfo.includes("kings")) {
              detectedBorough = "Brooklyn";
            } else if (locationInfo.includes("queens")) {
              detectedBorough = "Queens";
            } else if (locationInfo.includes("bronx")) {
              detectedBorough = "Bronx";
            } else if (locationInfo.includes("staten island") || locationInfo.includes("richmond")) {
              detectedBorough = "Staten Island";
            } else if (locationInfo.includes("manhattan") || locationInfo.includes("new york county")) {
              detectedBorough = "Manhattan";
            }

            handleBoroughChange(detectedBorough);
            handleAddressChange(fullStreet);
          } else {
            alert("Could not find an address for this location.");
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          alert("Could not determine your street address. Please enter it manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === 1) errorMsg = "Location access denied. Please enable permissions.";
        else if (error.code === 2) errorMsg = "Location unavailable.";
        else if (error.code === 3) errorMsg = "Location request timed out.";
        alert(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-900/95 border-slate-800' : 
      theme === 'colorful' ? 'bg-white/80 border-purple-200' : 
      'bg-background-light/95 border-gray-200'
    }`}>
      <div className="flex flex-col p-3 gap-2">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-blue-400' : 'text-primary'}`}>
            <span className="material-symbols-outlined text-[20px]">location_on</span>
            <h1 className="text-sm font-bold tracking-tight uppercase">ParkSmart</h1>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center justify-center rounded-full h-10 w-10 border-2 border-transparent hover:border-primary/30 transition-all overflow-hidden relative"
            >
              {userProfile.profilePic ? (
                <img src={userProfile.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  <span className="material-symbols-outlined text-[24px]">person</span>
                </div>
              )}
              {/* Green Status Light */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowMenu(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border overflow-hidden z-[100] ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800'
                    }`}
                  >
                    {/* User Info Header */}
                    <div className={`p-4 border-b flex items-center gap-3 ${theme === 'dark' ? 'border-slate-700 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        {userProfile.profilePic ? (
                          <img src={userProfile.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined">person</span>
                          </div>
                        )}
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                      </div>
                      <div>
                        <p className="font-bold text-sm">{userProfile.name}</p>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{userProfile.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Theme Selector */}
                    <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-3">App Theme</p>
                      <div className="relative">
                        <select
                          value={theme}
                          onChange={(e) => onThemeChange(e.target.value as Theme)}
                          className={`w-full appearance-none px-4 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer focus:ring-2 focus:ring-primary/20 ${
                            theme === 'dark' 
                              ? 'bg-slate-900 border-slate-700 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <option value="basic">Basic (Classic)</option>
                          <option value="colorful">Colorful (Vibrant)</option>
                          <option value="dark">Dark Mode (Night)</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                          <span className="material-symbols-outlined text-sm">expand_more</span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="p-2">
                      <button 
                        onClick={() => { setShowMenu(false); onLogout(); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span className="text-sm font-bold">Log Out</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleProfilePicChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        <div className={`relative flex gap-2 items-center border rounded-xl p-1 shadow-sm transition-all ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <select 
            value={localBorough} 
            onChange={(e) => handleBoroughChange(e.target.value)}
            className={`text-xs font-bold uppercase border-none rounded-lg px-2 py-2 focus:ring-0 cursor-pointer min-w-[100px] transition-colors ${
              theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-700'
            }`}
          >
            <option value="Manhattan">Manhattan</option>
            <option value="Brooklyn">Brooklyn</option>
            <option value="Queens">Queens</option>
            <option value="Bronx">Bronx</option>
            <option value="Staten Island">Staten Island</option>
          </select>
          <div className={`w-px h-6 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          <input 
            type="text" 
            value={localAddress} 
            onChange={(e) => handleAddressChange(e.target.value)}
            onFocus={() => localAddress.trim().length > 0 && suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Address..."
            className={`flex-grow text-sm bg-transparent border-none focus:ring-0 px-2 py-1 transition-colors ${
              theme === 'dark' ? 'text-white placeholder:text-slate-600' : 'text-slate-700 placeholder:text-slate-400'
            }`}
          />
          <button 
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
              isLocating ? 'text-primary animate-pulse' : 
              theme === 'dark' ? 'text-slate-500 hover:text-blue-400 hover:bg-slate-700' : 'text-slate-400 hover:text-primary hover:bg-blue-50'
            }`}
            title="Use my current location"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isLocating ? 'sync' : 'my_location'}
            </span>
          </button>

          {/* Autocomplete Suggestions */}
          {showSuggestions && (
            <div className={`absolute top-full left-0 right-0 mt-1 border rounded-xl shadow-lg overflow-hidden z-[60] ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`w-full text-left px-4 py-2 text-sm border-b last:border-none transition-colors ${
                    theme === 'dark' ? 'text-slate-300 hover:bg-slate-700 border-slate-700' : 'text-slate-700 hover:bg-slate-50 border-slate-100'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
