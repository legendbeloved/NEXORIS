import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity } from 'lucide-react';
import { useNotificationStore } from '../../store/dashboardStore';

interface FunnelStage {
  stage: string;
  count: number;
  rate: string;
  color: string;
}

const funnelStages: FunnelStage[] = [
  { stage: 'Discovered', count: 1240, rate: '100%', color: '#5B4CF5' },
  { stage: 'Contacted', count: 890, rate: '71.8%', color: '#4F46E5' },
  { stage: 'Opened', count: 642, rate: '72.1%', color: '#4338CA' },
  { stage: 'Replied', count: 214, rate: '33.3%', color: '#3730A3' },
  { stage: 'Interested', count: 86, rate: '40.2%', color: '#312E81' },
  { stage: 'Agreed', count: 32, rate: '37.2%', color: '#1E1B4B' },
  { stage: 'Paid', count: 18, rate: '56.3%', color: '#F59E0B' },
  { stage: 'Delivered', count: 12, rate: '66.7%', color: '#10B981' },
];

export const SplitRow: React.FC = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [notifications]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Funnel Visualization */}
      <div className="lg:col-span-3 p-8 rounded-3xl glass border-white/10 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-display font-bold text-white italic flex items-center gap-2">
            <Activity size={20} className="text-brand-secondary" />
            Conversion Funnel
          </h2>
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Real-time Performance</span>
        </div>

        <div className="flex-grow flex flex-col justify-between gap-2">
          {funnelStages.map((stage, i) => (
            <div key={stage.stage} className="flex items-center gap-4 group">
              <div className="w-24 text-[10px] font-bold text-zinc-500 uppercase tracking-tighter truncate">
                {stage.stage}
              </div>
              <div className="flex-grow relative h-10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(stage.count / funnelStages[0].count) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full rounded-r-lg relative overflow-hidden group-hover:brightness-125 transition-all"
                  style={{ backgroundColor: stage.color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white" />
                </motion.div>
                <div className="absolute inset-y-0 left-4 flex items-center gap-3">
                  <span className="text-xs font-bold text-white">{stage.count.toLocaleString()}</span>
                  {i > 0 && (
                    <span className="text-[10px] font-mono text-white/50">({stage.rate})</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="lg:col-span-2 p-8 rounded-3xl glass border-white/10 flex flex-col h-[500px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-white italic flex items-center gap-2">
            <Terminal size={20} className="text-brand-primary" />
            Agent Activity
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Live</span>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar"
          aria-live="polite"
        >
          <AnimatePresence initial={false}>
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -20 }}
                className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-3 items-start group hover:bg-white/10 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl shrink-0 flex flex-col items-center justify-center text-[8px] font-bold border ${
                  n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                  n.type === 'warning' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' :
                  n.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                  'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                }`}>
                  <span className="opacity-50">AGENT</span>
                  <span className="text-sm leading-none">{n.agentId || '?'}</span>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                        {n.agentName || 'System'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs font-mono text-zinc-300 leading-relaxed break-words">
                    {n.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {notifications.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
              <Activity size={48} className="opacity-20 animate-pulse" />
              <p className="text-sm italic">Waiting for agent activity...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
