import React, { useState } from 'react';
import { Sun, Moon, Search, Menu, User, Settings, HelpCircle, CreditCard, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationBell } from '../notifications/NotificationBell';
import { useTheme } from '../ThemeProvider';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  activeTab: string;
  onMenuToggle?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeTab, onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsProfileOpen(false);
  };

  return (
    <header className="h-20 border-b border-white/5 bg-brand-bg/60 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all"
        >
          <Menu size={20} />
        </button>
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-medium uppercase tracking-widest text-zinc-500">
          <span className="hidden sm:inline">Nexoris</span>
          <span className="text-zinc-700 hidden sm:inline">/</span>
          <span className="text-brand-secondary">{activeTab}</span>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search system..." 
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-primary/50 transition-all w-64"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            data-tour="theme-toggle"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <NotificationBell />

          <div className="relative" data-tour="user-profile">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-white/10"
            >
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-white">Habibullah Isaliu</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter font-medium">Platform Owner</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary p-[1px] cursor-pointer hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center overflow-hidden">
                  <img src="https://picsum.photos/seed/owner/100/100" alt="Owner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-4 w-56 p-2 rounded-2xl glass border border-white/10 shadow-xl z-50 flex flex-col gap-1"
                >
                  <button onClick={() => handleNavigate('/app/profile')} className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3">
                    <User size={16} /> Profile
                  </button>
                  <button onClick={() => handleNavigate('/app/team')} className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3">
                    <User size={16} /> Team
                  </button>
                  <button onClick={() => handleNavigate('/app/subscription')} className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3">
                    <CreditCard size={16} /> Billing
                  </button>
                  <button onClick={() => handleNavigate('/app/help')} className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3">
                    <HelpCircle size={16} /> Help & Docs
                  </button>
                  <div className="h-px bg-white/5 my-1" />
                  <button onClick={() => handleNavigate('/')} className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3">
                    <LogOut size={16} /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }
      `}</style>
    </header>
  );
};
