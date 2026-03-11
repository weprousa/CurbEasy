import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('Guest');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login with specific credentials
    setTimeout(() => {
      if (username === 'Guest' && password === 'guest1010') {
        onLogin();
      } else {
        setError('Invalid credentials. Hint: Guest / guest1010');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-row items-stretch justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Left Side - Decorative (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="relative z-10 text-center space-y-8 max-w-lg">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block p-6 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20 shadow-2xl"
          >
            <span className="material-symbols-outlined text-8xl text-white animate-bounce">directions_car</span>
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white leading-tight">Master the NYC Curb.</h2>
            <p className="text-xl text-indigo-100 font-medium">The most advanced parking intelligence platform for the modern New Yorker.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-8">
            {[
              { icon: 'traffic', label: 'Real-time' },
              { icon: 'gavel', label: 'Legal' },
              { icon: 'notifications_active', label: 'Alerts' }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-white mb-2">{item.icon}</span>
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 relative text-white">
        <div className="flex-grow flex flex-col items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md space-y-10">
            {/* Logo Section */}
            <div className="text-center space-y-4">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-xl shadow-2xl shadow-purple-900/20 mb-2 relative ring-1 ring-white/30"
              >
                <span className="material-symbols-outlined text-5xl text-white">local_parking</span>
                {/* Signal Light Decoration */}
                <div className="absolute -top-2 -right-2 flex flex-col gap-1 p-1.5 bg-slate-900 rounded-full border-2 border-white shadow-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </motion.div>
              
              <div className="space-y-1">
                <h1 className="text-6xl font-black tracking-tighter text-white italic">
                  Park<span className="text-orange-400">Smart</span>
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <span className="h-px w-8 bg-white/20"></span>
                  <p className="text-sm font-bold text-blue-100 uppercase tracking-[0.2em]">NYC Smart Parking Assistant</p>
                  <span className="h-px w-8 bg-white/20"></span>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-100 text-sm font-medium backdrop-blur-md"
                >
                  <span className="material-symbols-outlined text-lg">error</span>
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-100/70 ml-1">Identity / Username</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/50 group-focus-within:text-orange-400 transition-colors">person</span>
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Guest"
                      className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder:text-white/30 focus:ring-4 focus:ring-white/20 focus:border-white/50 outline-none transition-all backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-100/70">Security Key</label>
                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-orange-400 hover:underline">Forgot password?</button>
                  </div>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/50 group-focus-within:text-orange-400 transition-colors">lock</span>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder:text-white/30 focus:ring-4 focus:ring-white/20 focus:border-white/50 outline-none transition-all backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-indigo-700 font-black py-5 rounded-2xl shadow-xl shadow-purple-900/40 hover:bg-blue-50 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">sync</span>
                ) : (
                  <>
                    <span className="uppercase tracking-widest">Authorize Access</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="text-center pt-4">
              <p className="text-sm font-medium text-blue-100/60">
                Don't have an account? <button className="text-orange-400 font-bold hover:underline">Create an account</button>
              </p>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <footer className="p-8 border-t border-white/10 bg-black/10 backdrop-blur-md">
          <div className="max-w-md mx-auto space-y-6">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {['PRIVACY POLICY', 'TERMS OF SERVICE', 'COMPLIANCE'].map((link) => (
                <button key={link} className="text-[10px] font-black text-blue-100/40 hover:text-white tracking-widest transition-colors">
                  {link}
                </button>
              ))}
            </div>
            
            <div className="space-y-3 text-center">
              <p className="text-[10px] font-bold text-blue-100/30 tracking-wider">
                © 2026 PARKSMART TECHNOLOGIES INC. ALL RIGHTS RESERVED.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-green-400 tracking-widest uppercase">SYSTEM STATUS: OPERATIONAL</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Decorative Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <span className="absolute top-1/4 left-10 material-symbols-outlined text-9xl rotate-12">directions_car</span>
        <span className="absolute bottom-1/4 right-10 material-symbols-outlined text-9xl -rotate-12">traffic</span>
        <span className="absolute top-1/2 right-1/4 material-symbols-outlined text-8xl rotate-45">gavel</span>
      </div>
    </div>
  );
};

export default LoginView;
