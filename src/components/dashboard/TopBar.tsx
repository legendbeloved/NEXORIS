import React from 'react';
import { Bell, Sun, Moon, Search, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { useNotificationStore } from '../../store/dashboardStore';

interface TopBarProps {
  activeTab: string;
  onMenuToggle?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeTab, onMenuToggle }) => {
  const { unreadCount, markAllAsRead } = useNotificationStore();
  const [isDark, setIsDark] = React.useState(true);

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
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search system..." 
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-primary/50 transition-all w-64"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative group">
            <button 
              onClick={markAllAsRead}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all relative"
            >
              <Bell size={18} className={unreadCount > 0 ? 'animate-[shake_0.5s_ease-in-out_infinite]' : ''} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-primary rounded-full border-2 border-brand-bg" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">Habibullah Isaliu</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-tighter font-medium">Platform Owner</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary p-[1px] cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/owner/100/100" alt="Owner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
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
