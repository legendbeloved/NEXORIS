import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Users, 
  Mail, 
  Layers, 
  CreditCard, 
  BarChart, 
  Settings, 
  Bell,
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotificationStore } from '../../store/dashboardStore';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  onLogout?: () => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'agents', icon: Bot, label: 'Agents' },
  { id: 'prospects', icon: Users, label: 'Prospects' },
  { id: 'outreach', icon: Mail, label: 'Outreach' },
  { id: 'projects', icon: Layers, label: 'Projects' },
  { id: 'payments', icon: CreditCard, label: 'Payments' },
  { id: 'analytics', icon: BarChart, label: 'Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'notifications', icon: Bell, label: 'Notification Center', hasBadge: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onLogout
}) => {
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen?.(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 240,
          x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -240 : 0)
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 h-full border-r border-white/5 bg-brand-bg/80 backdrop-blur-xl z-[60] flex flex-col lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6 flex items-center justify-between">
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(91,76,245,0.3)]">
                <Zap className="text-white fill-white" size={24} />
              </div>
              <h1 className="text-xl font-display font-bold tracking-tighter uppercase italic">Nexoris</h1>
            </div>
          )}
          {isCollapsed && !isMobileOpen && (
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(91,76,245,0.3)]">
              <Zap className="text-white fill-white" size={20} />
            </div>
          )}
          {isMobileOpen && (
            <button onClick={() => setIsMobileOpen?.(false)} className="lg:hidden p-2 text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="mt-8 px-4 flex-grow space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                activeTab === item.id 
                  ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-[0_0_15px_rgba(91,76,245,0.1)]' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
              }`}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <item.icon size={20} className={activeTab === item.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              {(!isCollapsed || isMobileOpen) && <span className="font-medium">{item.label}</span>}
              
              {item.hasBadge && unreadCount > 0 && (
                <span className={`absolute ${(isCollapsed && !isMobileOpen) ? 'top-2 right-2' : 'right-4'} w-5 h-5 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-bg`}>
                  {unreadCount}
                </span>
              )}

              {isCollapsed && !isMobileOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative text-zinc-500 hover:text-red-400 hover:bg-red-400/5 border border-transparent"
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              {(!isCollapsed || isMobileOpen) && <span className="font-medium">Exit Command Center</span>}
              
              {isCollapsed && !isMobileOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  Exit
                </div>
              )}
            </button>
          </div>
        </nav>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-4 border-t border-white/5 text-zinc-500 hover:text-white transition-colors items-center justify-center"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </motion.aside>
    </>
  );
};
