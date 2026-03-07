import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Settings, Search, Filter, MoreHorizontal } from 'lucide-react';
import { useNotificationStore } from '../../store/dashboardStore';

export const NotificationsPage: React.FC = () => {
  const { notifications, clearNotifications, markAllAsRead } = useNotificationStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tight">Notification Center</h1>
          <p className="text-zinc-500 mt-1 text-sm">Review all system logs and agent activity alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Mark all as read
          </button>
          <button 
            onClick={clearNotifications}
            className="px-4 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center gap-2"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>
      </div>

      <div className="glass rounded-[32px] border-white/10 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search notifications..." 
                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-primary/50 transition-all w-48"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/5 text-zinc-500 hover:text-white transition-all"><Filter size={16} /></button>
              <button className="p-2 rounded-lg bg-white/5 text-zinc-500 hover:text-white transition-all"><Settings size={16} /></button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{notifications.length} Total Alerts</span>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
          <AnimatePresence initial={false}>
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-6 flex gap-4 items-start group hover:bg-white/[0.02] transition-colors ${n.read ? 'opacity-60' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                  n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                  n.type === 'warning' ? 'bg-brand-accent/10 text-brand-accent' :
                  n.type === 'error' ? 'bg-red-500/10 text-red-500' :
                  'bg-brand-primary/10 text-brand-primary'
                }`}>
                  {n.type === 'success' ? <CheckCircle2 size={20} /> :
                   n.type === 'warning' ? <AlertCircle size={20} /> :
                   n.type === 'error' ? <AlertCircle size={20} /> :
                   <Info size={20} />}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {n.timestamp.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-600 hover:text-white">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                    {n.message}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[8px] font-bold uppercase tracking-widest text-zinc-500">System</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[8px] font-bold uppercase tracking-widest text-zinc-500">Agent Activity</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {notifications.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-600 space-y-4">
              <Bell size={48} className="opacity-20 animate-pulse" />
              <p className="text-sm italic">No notifications to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
