import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

export const SplitRow: React.FC<{ funnel: any[] }> = ({ funnel }) => {
  const navigate = useNavigate();
  const notifications = useNotificationStore((state) => state.notifications);
  const scrollRef = useRef<HTMLDivElement>(null);

  const stages = (funnel && funnel.length > 0) ? funnel.map(f => {
    const defaultStage = funnelStages.find(fs => fs.stage.toLowerCase() === f.stage.toLowerCase());
    return {
      stage: f.stage.charAt(0).toUpperCase() + f.stage.slice(1),
      count: f.count,
      rate: funnel[0].count > 0 ? `${((f.count / funnel[0].count) * 100).toFixed(1)}%` : '0%',
      color: defaultStage?.color || '#5B4CF5'
    };
  }) : funnelStages;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [notifications]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
      {/* Funnel Visualization */}
      <div className="lg:col-span-3 p-6 md:p-8 rounded-3xl glass border-brand-border flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg md:text-xl font-display font-bold text-brand-text italic flex items-center gap-2">
            <Activity size={20} className="text-brand-secondary" />
            Conversion Funnel
          </h2>
          <button 
            onClick={() => navigate('/app/analytics')}
            className="text-[10px] font-bold text-brand-text-muted hover:text-brand-text uppercase tracking-widest transition-colors flex items-center gap-1"
          >
            Full Report <ArrowUpRight size={12} />
          </button>
        </div>

        <div className="flex-grow flex flex-col justify-between gap-3 md:gap-2">
          {stages.map((stage, i) => (
            <div key={stage.stage} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 group">
              <div className="w-full sm:w-24 text-[10px] font-bold text-brand-text-muted uppercase tracking-tighter truncate">
                {stage.stage}
              </div>
              <div className="flex-grow relative h-8 sm:h-10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(stage.count / stages[0].count) * 100}%` }}
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
      <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl glass border-brand-border flex flex-col h-[400px] md:h-[500px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-display font-bold text-brand-text italic flex items-center gap-2">
            <Terminal size={20} className="text-brand-primary" />
            Agent Activity
          </h2>
          <button 
            onClick={() => navigate('/app/notifications')}
            className="text-[10px] font-bold text-brand-text-muted hover:text-brand-text uppercase tracking-widest transition-colors flex items-center gap-1"
          >
            View All <ArrowUpRight size={12} />
          </button>
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
                className="p-3 rounded-xl bg-brand-surface border border-brand-border flex gap-3 items-start group hover:bg-brand-surface/80 transition-colors"
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
                      <span className="text-[10px] font-bold text-brand-text uppercase tracking-widest">
                        {n.agentName || 'System'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-500" />
                      <span className="text-[10px] text-brand-text-muted font-mono">
                        {n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[8px] text-brand-text-muted uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs font-mono text-brand-text-muted leading-relaxed break-words">
                    {n.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {notifications.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-brand-text-muted space-y-4">
              <Activity size={48} className="opacity-20 animate-pulse" />
              <p className="text-sm italic">Waiting for agent activity...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
