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

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  onLogout?: () => void;
}

export const navItems = [
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
        className={`fixed left-0 top-0 h-full border-r border-brand-border bg-brand-bg/80 backdrop-blur-xl z-[60] flex flex-col lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6 flex items-center justify-between">
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(91,76,245,0.3)]">
                <Zap className="text-white fill-white" size={24} />
              </div>
              <h1 className="text-xl font-display font-bold tracking-tighter uppercase italic text-brand-text">Nexoris</h1>
            </div>
          )}
          {isCollapsed && !isMobileOpen && (
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(91,76,245,0.3)]">
              <Zap className="text-white fill-white" size={20} />
            </div>
          )}
          {isMobileOpen && (
            <button onClick={() => setIsMobileOpen?.(false)} className="lg:hidden p-2 text-brand-text-muted hover:text-brand-text">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="mt-8 px-4 flex-grow space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-brand-primary/10 text-brand-primary' 
                  : 'text-brand-text-muted hover:bg-brand-surface hover:text-brand-text hover:shadow-sm'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'fill-brand-primary/20' : ''} />
              {(!isCollapsed || isMobileOpen) && (
                <span className="font-medium text-sm flex-grow text-left">{item.label}</span>
              )}
              {item.hasBadge && unreadCount > 0 && (!isCollapsed || isMobileOpen) && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-border">
          <button 
            onClick={onLogout}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-brand-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all group ${
              isCollapsed && !isMobileOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut size={20} />
            {(!isCollapsed || isMobileOpen) && <span className="font-medium text-sm">Sign Out</span>}
          </button>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center mt-2 p-2 text-brand-text-muted hover:text-brand-text transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </motion.aside>
    </>
  );
};
