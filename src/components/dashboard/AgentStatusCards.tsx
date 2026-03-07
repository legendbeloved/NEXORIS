import React from 'react';
import { Zap, Play, Square } from 'lucide-react';
import { motion } from 'motion/react';
import { useAgentStore } from '../../store/dashboardStore';

export const AgentStatusCards: React.FC = () => {
  const { agents, toggleAgent } = useAgentStore();

  const getAgentColor = (id: number) => {
    switch (id) {
      case 1: return '#5B4CF5'; // Indigo
      case 2: return '#00D4FF'; // Aqua
      case 3: return '#F59E0B'; // Amber
      default: return '#5B4CF5';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {agents.map((agent) => {
        const color = getAgentColor(agent.id);
        const isActive = agent.status === 'ACTIVE';
        
        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: agent.id * 0.1 }}
            className={`relative p-6 rounded-3xl glass border-white/10 transition-all duration-500 overflow-hidden group ${
              isActive ? 'shadow-[0_0_40px_rgba(0,0,0,0.3)]' : ''
            }`}
          >
            {/* Glow Effect */}
            <div 
              className={`absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl pointer-events-none`}
              style={{ backgroundColor: color, opacity: isActive ? 0.15 : 0 }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'text-white shadow-lg' : 'bg-zinc-800 text-zinc-500'
                    }`}
                    style={isActive ? { backgroundColor: color, boxShadow: `0 0 20px ${color}40` } : {}}
                  >
                    <Zap size={24} fill={isActive ? 'currentColor' : 'none'} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-display font-bold text-white italic">
                        Agent {agent.id}: {agent.name}
                      </h3>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        agent.status === 'ACTIVE' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 
                        agent.status === 'ERROR' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' : 
                        'bg-zinc-600'
                      }`} />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] uppercase tracking-widest font-bold ${
                        agent.status === 'ACTIVE' ? 'text-green-500' : 
                        agent.status === 'ERROR' ? 'text-red-500' : 
                        'text-zinc-500'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => toggleAgent(agent.id)}
                  className={`p-3 rounded-xl transition-all ${
                    isActive ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                  }`}
                >
                  {isActive ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Current Action</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{isActive ? 'Processing...' : 'Idle'}</span>
                  </div>
                  <p className="text-xs font-mono text-zinc-300 bg-black/20 p-2 rounded-lg border border-white/5">
                    {agent.currentAction}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Task Progress</span>
                    <span className="text-[10px] text-white font-bold">{agent.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                      className="h-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Prospects Processed</span>
                  <span className="text-lg font-display font-bold text-white italic">{agent.prospectsProcessed}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
