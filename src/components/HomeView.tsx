
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { askNYCStreetRules } from '../services/geminiService';
import { Theme } from '../types';

interface HomeViewProps {
  onStartChat: (prompt?: string) => void;
  onStartScan: () => void;
  locationContext?: string;
  theme: Theme;
}

const HomeView: React.FC<HomeViewProps> = ({ onStartChat, onStartScan, locationContext, theme }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [inputValue, setInputValue] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nycTimeStr = currentTime.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const nycDayStr = currentTime.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long'
  });

  const nycDateStr = currentTime.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const nycTimeOnlyStr = currentTime.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const featuredTopics = [
    {
      id: 'featured_asp',
      title: 'Alternate Side Parking Reform 2024',
      prompt: 'Tell me about the Alternate Side Parking Reform 2024 in NYC.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMe2B_tUtMty639y6RXIymEksp2_-fHRF9j8ASaoIMANS-arnv0_VF5okXeNl-Z4DOwln_UyWHLtUPDiyuqmW7fZ03tFOEsuLcnrDXo6QE7SzPHrJ3h04d5IsavmVbqHTfK00mIBKdvugC-qroR6ItG-Lab4OgXN-jonOvXkwEt3hfuCb2JxljNNyb4N4zmRhWvZArJxSAYLx_p1veIO_mLBTebD-GbxOIF5fbn0IMVWYw4R1k7Xa_wvDFi1epXoGdhCfOBLuV_Pc'
    },
    {
      id: 'featured_congestion',
      title: 'New Congestion Pricing Rules',
      prompt: 'What are the latest updates on NYC congestion pricing zones and fees for 2026?',
      image: 'https://picsum.photos/seed/nyc-traffic/800/400'
    },
    {
      id: 'featured_summer',
      title: 'Summer Streets 2026 Schedule',
      prompt: 'What is the schedule and route for NYC Summer Streets 2026?',
      image: 'https://picsum.photos/seed/nyc-park/800/400'
    }
  ];

  const nextFeature = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentFeatureIndex((prev) => (prev + 1) % featuredTopics.length);
    setExpandedId(null);
  };

  const prevFeature = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentFeatureIndex((prev) => (prev - 1 + featuredTopics.length) % featuredTopics.length);
    setExpandedId(null);
  };

  const handleCardClick = async (id: string, prompt: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedContent(null);
      return;
    }

    setExpandedId(id);
    setExpandedContent(null);
    setIsExpanding(true);

    const response = await askNYCStreetRules(prompt, locationContext);
    setExpandedContent(response);
    setIsExpanding(false);
  };

  const scrollQuickActions = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      onStartChat(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Hero AI Card */}
      <div className={`relative overflow-hidden rounded-2xl shadow-sm ring-1 transition-all ${
        theme === 'dark' ? 'bg-slate-800 ring-slate-700' : 'bg-white ring-slate-900/5'
      }`}>
        <div className={`absolute top-0 left-0 w-full h-32 opacity-70 ${
          theme === 'colorful' ? 'bg-gradient-to-b from-blue-200 to-transparent' : 
          theme === 'dark' ? 'bg-gradient-to-b from-blue-900/20 to-transparent' : 
          'bg-gradient-to-b from-blue-50 to-white'
        }`}></div>
        <div className="relative p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Dashboard</h1>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[14px] text-blue-500">schedule</span>
                <p className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-xs font-bold uppercase tracking-wider`}>
                  {nycTimeStr}
                </p>
              </div>
              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Your smart parking companion.</p>
            </div>
          </div>
          <div className={`w-full flex items-center gap-3 border rounded-xl py-2 px-3 transition-all group ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-700 focus-within:border-blue-500/50' : 
            'bg-slate-50 border-slate-200 focus-within:border-primary/50'
          }`}>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Can I park here?"
              className={`flex-grow bg-transparent border-none focus:ring-0 text-sm transition-colors ${
                theme === 'dark' ? 'text-white placeholder:text-slate-600' : 'text-slate-700 placeholder:text-slate-300'
              }`}
            />
            <button 
              onClick={handleSearch}
              className={`ml-auto rounded-lg p-1.5 flex items-center justify-center transition-colors ${
                theme === 'colorful' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 
                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500' : 
                'bg-primary hover:bg-primary-dark'
              } text-white`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scan Button */}
      <div className="w-full">
        <button 
          onClick={onStartScan}
          className={`w-full flex items-center justify-center relative overflow-hidden rounded-xl h-14 transition-all shadow-lg group ${
            theme === 'colorful' ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 shadow-purple-500/20' : 
            theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40' : 
            'bg-primary hover:bg-primary-dark shadow-blue-900/20'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="material-symbols-outlined text-white mr-2">center_focus_weak</span>
          <span className="text-white text-lg font-bold tracking-tight">Scan Parking Sign</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Quick Actions</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => scrollQuickActions('left')}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-sm ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button 
              onClick={() => scrollQuickActions('right')}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-sm ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x scroll-smooth"
        >
          <div 
            onClick={() => handleCardClick('asp', 'What is the current Alternate Side Parking status in NYC today?')}
            className={`snap-start flex-none flex flex-col justify-center min-w-[140px] p-3 rounded-xl border transition-all cursor-pointer ${
              expandedId === 'asp' 
                ? 'bg-amber-100 border-amber-300 ring-2 ring-amber-200' 
                : theme === 'dark' ? 'bg-amber-900/20 border-amber-900/30' : 'bg-amber-50 border-amber-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`material-symbols-outlined text-[20px] ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>parking_sign</span>
              <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>ASP Status</span>
            </div>
            <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-amber-100' : 'text-slate-900'}`}>{nycDayStr} Status</p>
            <p className="text-[10px] opacity-60 font-bold uppercase mt-1">Check current rules</p>
          </div>
          <div 
            onClick={() => handleCardClick('meter', 'How do I pay for a parking meter in NYC?')}
            className={`snap-start flex-none flex items-center gap-3 min-w-[140px] px-4 py-3 rounded-xl border shadow-sm transition-all cursor-pointer ${
              expandedId === 'meter' 
                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' 
                : theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
            }`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700 text-blue-400' : 'bg-slate-100 text-slate-600'}`}>
              <span className="material-symbols-outlined text-[18px]">local_parking</span>
            </div>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>Pay Meter</p>
          </div>
          <div 
            onClick={() => handleCardClick('towed', 'How do I find my towed car in NYC?')}
            className={`snap-start flex-none flex items-center gap-3 min-w-[140px] px-4 py-3 rounded-xl border shadow-sm transition-all cursor-pointer ${
              expandedId === 'towed' 
                ? 'bg-red-50 border-red-200 ring-2 ring-red-100' 
                : theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
            }`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700 text-red-400' : 'bg-slate-100 text-slate-600'}`}>
              <span className="material-symbols-outlined text-[18px]">car_crash</span>
            </div>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>Find Towed</p>
          </div>
        </div>

        {/* Inline Expansion for Quick Actions */}
        <AnimatePresence>
          {expandedId && ['asp', 'meter', 'towed'].includes(expandedId) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3"
            >
              <div className={`border rounded-xl p-4 shadow-sm transition-colors ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold text-sm uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-900'}`}>Quick Info</h4>
                  <button onClick={() => setExpandedId(null)} className="text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                {isExpanding ? (
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                ) : (
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {expandedContent}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Explore Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Explore by Category</h3>
          <button className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-primary'}`}>See All</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => handleCardClick('rules', 'Give me a summary of the most important NYC parking rules.')}
            className={`flex flex-col gap-3 p-4 rounded-xl shadow-sm border transition-all cursor-pointer ${
              expandedId === 'rules' 
                ? 'border-primary ring-2 ring-primary/10' 
                : theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-blue-500/30' : 'bg-white border-slate-100 hover:border-primary/30'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-primary'}`}>
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <div>
              <h4 className={`font-bold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Parking Rules</h4>
              <p className="text-xs text-slate-500 mt-1">Official regulations</p>
            </div>
          </div>
          <div 
            onClick={() => handleCardClick('dict', 'Explain common NYC parking signs.')}
            className={`flex flex-col gap-3 p-4 rounded-xl shadow-sm border transition-all cursor-pointer ${
              expandedId === 'dict' 
                ? 'border-purple-600 ring-2 ring-purple-100' 
                : theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-purple-500/30' : 'bg-white border-slate-100 hover:border-primary/30'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
              <span className="material-symbols-outlined">signpost</span>
            </div>
            <div>
              <h4 className={`font-bold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Sign Dictionary</h4>
              <p className="text-xs text-slate-500 mt-1">Identify signs</p>
            </div>
          </div>
          <div 
            onClick={() => handleCardClick('const', 'Where can I find information about active construction zones in NYC?')}
            className={`flex flex-col gap-3 p-4 rounded-xl shadow-sm border transition-all cursor-pointer ${
              expandedId === 'const' 
                ? 'border-orange-600 ring-2 ring-orange-100' 
                : theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-orange-500/30' : 'bg-white border-slate-100 hover:border-primary/30'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
              <span className="material-symbols-outlined">construction</span>
            </div>
            <div>
              <h4 className={`font-bold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Construction</h4>
              <p className="text-xs text-slate-500 mt-1">Active zones map</p>
            </div>
          </div>
          <div 
            onClick={() => handleCardClick('dispute', 'How do I dispute a parking ticket in NYC?')}
            className={`flex flex-col gap-3 p-4 rounded-xl shadow-sm border transition-all cursor-pointer ${
              expandedId === 'dispute' 
                ? 'border-emerald-600 ring-2 ring-emerald-100' 
                : theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-emerald-500/30' : 'bg-white border-slate-100 hover:border-primary/30'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <span className="material-symbols-outlined">gavel</span>
            </div>
            <div>
              <h4 className={`font-bold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Dispute Ticket</h4>
              <p className="text-xs text-slate-500 mt-1">Help & Advice</p>
            </div>
          </div>
        </div>

        {/* Inline Expansion for Explore Grid */}
        <AnimatePresence>
          {expandedId && ['rules', 'dict', 'const', 'dispute'].includes(expandedId) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3"
            >
              <div className={`border rounded-xl p-4 shadow-sm transition-colors ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold text-sm uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-900'}`}>Category Details</h4>
                  <button onClick={() => setExpandedId(null)} className="text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                {isExpanding ? (
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                ) : (
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {expandedContent}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature Card Carousel */}
      <div className="relative group">
        <div 
          onClick={() => handleCardClick(featuredTopics[currentFeatureIndex].id, featuredTopics[currentFeatureIndex].prompt)}
          className={`relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all ${expandedId === featuredTopics[currentFeatureIndex].id ? 'ring-2 ring-primary' : ''}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeatureIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-slate-900/40 z-10"></div>
              <img 
                alt={featuredTopics[currentFeatureIndex].title} 
                className="absolute inset-0 w-full h-full object-cover" 
                src={featuredTopics[currentFeatureIndex].image}
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 p-5 z-20 w-full">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white mb-2 uppercase tracking-wide border border-white/20">
                      Featured
                    </div>
                    <h3 className="text-white text-xl font-bold leading-tight" dangerouslySetInnerHTML={{ __html: featuredTopics[currentFeatureIndex].title.replace('Parking', 'Parking<br/>') }}></h3>
                  </div>
                  <div className={`bg-white text-slate-900 rounded-full p-2 transition-transform ${expandedId === featuredTopics[currentFeatureIndex].id ? 'rotate-90' : ''}`}>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
            {featuredTopics.map((_, idx) => (
              <button 
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentFeatureIndex(idx);
                  setExpandedId(null);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentFeatureIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                aria-label={`Go to feature ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevFeature}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-colors shadow-lg"
          aria-label="Previous feature"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        <button 
          onClick={nextFeature}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-colors shadow-lg"
          aria-label="Next feature"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>

      {/* Inline Expansion for Featured Card */}
      <AnimatePresence>
        {expandedId && expandedId.startsWith('featured_') && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-1"
          >
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Featured Details</h4>
                <button onClick={(e) => { e.stopPropagation(); setExpandedId(null); }} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              {isExpanding ? (
                <div className="flex items-center gap-2 py-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              ) : (
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {expandedContent}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeView;
