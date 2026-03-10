
import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'admin1010') {
      onLogin();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      {/* Floating Icons */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 text-white/20"
      >
        <span className="material-symbols-outlined text-8xl">directions_car</span>
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-10 text-white/20"
      >
        <span className="material-symbols-outlined text-8xl">local_parking</span>
      </motion.div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl mb-2 italic"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            CurbEasy
          </motion.h1>
          <p className="text-white/80 font-medium tracking-widest uppercase text-xs">Smart Parking Management</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Admin Portal</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Username</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                <input 
                  type="text" 
                  value={username}
                  readOnly
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold text-center"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs">Forgot password? Contact system administrator.</p>
          </div>
        </motion.div>

        {/* Professional Footer Stuffs */}
        <div className="mt-12 flex flex-col items-center gap-4 text-white/60">
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
          </div>
          <div className="h-px w-20 bg-white/20"></div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium">
            © 2026 CurbEasy Technologies Inc. All Rights Reserved.
          </p>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-[9px] font-bold uppercase">System Status: Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
