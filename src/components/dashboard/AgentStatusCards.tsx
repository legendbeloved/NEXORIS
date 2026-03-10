import React from 'react';
import { Cpu, Send, MessageSquare, Play, Square } from 'lucide-react';
import { motion } from 'motion/react';
import { useAgentStore, useAgentConfig } from '../../store/dashboardStore';

export const AgentStatusCards: React.FC = () => {
  const { agents, toggleAgent, updateAgent } = useAgentStore();
  const { config } = useAgentConfig();

  const handleToggle = async (id: number) => {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;

    const newStatus = agent.status === 'ACTIVE' ? 'IDLE' : 'ACTIVE';
    toggleAgent(id); // Optimistic update

    if (newStatus === 'ACTIVE') {
      try {
        let endpoint = '';
        let payload = {};

        if (id === 1) {
          endpoint = '/api/agents/discovery';
          payload = { category: config.global.categories[0] || 'SaaS', location: config.global.targetRegion || 'San Francisco, CA' };
        } else if (id === 2) {
          endpoint = '/api/agents/outreach';
        }

        if (endpoint) {
          updateAgent(id, { currentAction: 'Initializing AI core...' });

          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
            .then(async (res) => {
              if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                  updateAgent(id, { currentAction: 'Task completed successfully', status: 'IDLE', progress: 100 });
                } else {
                  updateAgent(id, { status: 'ERROR', currentAction: 'Operation failed' });
                }
              } else {
                updateAgent(id, { status: 'ERROR', currentAction: 'Server error' });
              }
            })
            .catch((err) => {
              console.error('Agent activation error:', err);
              updateAgent(id, { status: 'ERROR', currentAction: 'Connection refused' });
            });
        }
      } catch (e) {
        updateAgent(id, { status: 'ERROR' });
      }
    }
  };

  const getAgentIcon = (id: number) => {
    switch (id) {
      case 1: return Cpu;
      case 2: return Send;
      case 3: return MessageSquare;
      default: return Cpu;
    }
  };

  const getAgentColor = (id: number) => {
    switch (id) {
      case 1: return '#00D4FF'; // Aqua
      case 2: return '#5B4CF5'; // Indigo
      case 3: return '#F59E0B'; // Amber
      default: return '#5B4CF5';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {agents.map((agent) => {
        const color = getAgentColor(agent.id);
        const isActive = agent.status === 'ACTIVE';

        const AgentIcon = getAgentIcon(agent.id);

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: agent.id * 0.1 }}
            className={`relative p-5 md:p-6 rounded-3xl glass border-white/10 transition-all duration-500 overflow-hidden group ${isActive ? 'shadow-[0_0_40px_rgba(0,0,0,0.3)]' : ''
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
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'text-white shadow-lg' : 'bg-zinc-800 text-zinc-500'
                      }`}
                    style={isActive ? { backgroundColor: color, boxShadow: `0 0 20px ${color}40` } : {}}
                  >
                    <AgentIcon size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg md:text-xl font-display font-bold text-white italic truncate max-w-[120px] sm:max-w-none">
                        {agent.name}
                      </h3>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${agent.status === 'ACTIVE' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' :
                          agent.status === 'ERROR' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' :
                            'bg-zinc-600'
                        }`} />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] uppercase tracking-widest font-bold ${agent.status === 'ACTIVE' ? 'text-green-500' :
                          agent.status === 'ERROR' ? 'text-red-500' :
                            'text-zinc-500'
                        }`}>
                        {agent.status}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(agent.id)}
                  className={`p-2.5 md:p-3 rounded-xl transition-all ${isActive ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                    }`}
                >
                  {isActive ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
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
