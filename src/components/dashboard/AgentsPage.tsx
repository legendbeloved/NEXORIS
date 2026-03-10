import React from 'react';
import { motion } from 'motion/react';
import { Bot, Zap, Settings, Play, Square, RefreshCcw, Cpu, Brain, MessageSquare, Send } from 'lucide-react';
import { useAgentStore, useAgentConfig } from '../../store/dashboardStore';

export const AgentsPage: React.FC = () => {
  const { agents, toggleAgent, updateAgent } = useAgentStore();
  const { config, setConfig } = useAgentConfig();
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      // Give some visual feedback
      setTimeout(() => setSyncing(false), 1000);
    } catch (e) {
      setSyncing(false);
    }
  };

  const handleActivate = async (id: number) => {
    const agent = agents.find(a => a.id === id);
    const becomingActive = agent?.status !== 'ACTIVE';
    
    toggleAgent(id);

    if (becomingActive) {
      updateAgent(id, { currentAction: 'Initializing AI routines...', progress: 10 });
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
          updateAgent(id, { currentAction: 'Processing mission parameters...', progress: 40 });
          const res = await fetch(endpoint, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (res.ok) {
            updateAgent(id, { currentAction: 'Task completed successfully.', progress: 100 });
            setTimeout(() => {
              toggleAgent(id); // Deactivate after completion
              updateAgent(id, { currentAction: 'Waiting for instructions...', progress: 0 });
            }, 3000);
          } else {
            updateAgent(id, { status: 'ERROR', currentAction: 'Failed to execute task.' });
          }
        }
      } catch (e) {
        updateAgent(id, { status: 'ERROR', currentAction: 'Connection error.' });
      }
    } else {
      updateAgent(id, { currentAction: 'Standby.', progress: 0 });
    }
  };

  const agentDetails = [
    {
      id: 1,
      name: 'Discovery Agent',
      icon: Cpu,
      color: '#00D4FF',
      description: 'Scans the web, social media, and local directories to find businesses with critical digital gaps.',
      capabilities: ['Web Scraping', 'Gap Analysis', 'Niche Targeting', 'Lead Scoring'],
      stats: { uptime: '99.9%', efficiency: '94%', tasks: 1240 }
    },
    {
      id: 2,
      name: 'Outreach Agent',
      icon: Send,
      color: '#5B4CF5',
      description: 'Crafts hyper-personalized pitches that address the specific pain points found during discovery.',
      capabilities: ['Personalization', 'A/B Testing', 'Sequence Management', 'Spam Protection'],
      stats: { uptime: '98.5%', efficiency: '88%', tasks: 890 }
    },
    {
      id: 3,
      name: 'Negotiation Agent',
      icon: MessageSquare,
      color: '#F59E0B',
      description: 'Handles objections, discusses pricing within your guardrails, and books the final meeting.',
      capabilities: ['Objection Handling', 'Dynamic Pricing', 'Calendar Sync', 'CRM Integration'],
      stats: { uptime: '100%', efficiency: '92%', tasks: 214 }
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tight">AI Agent Squad</h1>
          <p className="text-zinc-500 mt-1 text-sm">Manage and monitor your autonomous workforce.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCcw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync Agents'}
        </button>
      </div>

      <div className="glass rounded-[24px] p-6 border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Active Modules</h3>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">System Online</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'sentimentAnalysis', label: 'Sentiment Analysis' },
            { key: 'competitorTracking', label: 'Competitor Tracking' },
            { key: 'autoEscalation', label: 'Auto-Escalation' },
          ].map((m) => {
            const active = (config.modules as any)?.[m.key];
            return (
              <button
                key={m.key}
                onClick={async () => {
                  const next = { ...(config.modules || {}), [m.key]: !active } as { sentimentAnalysis: boolean; competitorTracking: boolean; autoEscalation: boolean };
                  setConfig({ modules: next });
                  try {
                    await fetch('/api/config', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ modules: next }),
                    });
                  } catch {}
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                  active ? 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/30' : 'bg-white/5 text-zinc-400 border-white/10'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {agentDetails.map((detail) => {
          const agent = agents.find(a => a.id === detail.id);
          const isActive = agent?.status === 'ACTIVE';
          
          return (
            <motion.div
              key={detail.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[32px] border-white/10 overflow-hidden flex flex-col lg:flex-row"
            >
              {/* Agent Identity */}
              <div className="lg:w-1/3 p-8 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: detail.color, boxShadow: `0 0 30px ${detail.color}30` }}
                  >
                    <detail.icon size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white italic">{detail.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{agent?.status}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-8">{detail.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Uptime</span>
                    <span className="text-xs font-mono text-white">{detail.stats.uptime}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Efficiency</span>
                    <span className="text-xs font-mono text-white">{detail.stats.efficiency}</span>
                  </div>
                  {isActive && agent?.progress > 0 && (
                    <div className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[10px] text-brand-primary uppercase font-bold tracking-widest">Mission Progress</span>
                        <span className="text-[10px] font-mono text-brand-primary">{agent.progress}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${agent.progress}%` }}
                          className="h-full bg-brand-primary"
                        />
                      </div>
                      <p className="mt-2 text-[10px] text-zinc-400 font-mono italic">
                        &gt; {agent.currentAction}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Controls & Capabilities */}
              <div className="flex-grow p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Capabilities</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleActivate(detail.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                        isActive ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                      }`}
                    >
                      {isActive ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all">
                      <Settings size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {detail.capabilities.map((cap, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:bg-white/10 transition-all">
                      <Brain size={16} className="mx-auto mb-2 text-zinc-500 group-hover:text-brand-primary transition-colors" />
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{cap}</span>
                    </div>
                  ))}
                </div>

                {/* Configuration Summary (minimal, brand-consistent) */}
                <div className="pt-2">
                  <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Configuration</h4>
                  <div className="flex flex-wrap gap-2">
                    {detail.id === 1 && (
                      <>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-400">
                          Region: <span className="text-white font-bold">{config.global.targetRegion}</span>
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-400">
                          Depth: <span className="text-white font-bold">{config.agent1.searchDepth}/10</span>
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-400">
                          Revenue Weight: <span className="text-white font-bold">{config.agent1.scoringWeightRevenue}%</span>
                        </span>
                        <span className={`px-3 py-1 rounded-lg border text-[10px] ${config.agent1.competitorAnalysis ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
                          Competitor Intel: <span className="font-bold">{config.agent1.competitorAnalysis ? 'ON' : 'OFF'}</span>
                        </span>
                      </>
                    )}
                    {detail.id === 2 && (
                      <>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-400">
                          Sender: <span className="text-white font-bold">{config.agent2.senderIdentity}</span>
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-400">
                          Tone: <span className="text-white font-bold">{config.agent2.brandTone}</span>
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-400">
                          Profile: <span className="text-white font-bold">{config.agent2.personalityProfile}</span>
                        </span>
                        <span className={`px-3 py-1 rounded-lg border text-[10px] ${config.agent2.smartScheduling ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
                          Smart Sched: <span className="font-bold">{config.agent2.smartScheduling ? 'ON' : 'OFF'}</span>
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-400">
                          Limit: <span className="text-white font-bold">{config.agent2.dailySendLimit}/day</span>
                        </span>
                      </>
                    )}
                    {detail.id === 3 && (
                      <>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-400">
                          Escalation at <span className="text-white font-bold">{config.agent3.escalationDiscountPercent}%</span>
                        </span>
                        {config.agent3.rules?.[0] && (
                          <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-400">
                            Guardrails: <span className="text-white font-bold">${config.agent3.rules[0].min} - ${config.agent3.rules[0].max}</span>
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Current Task Progress</span>
                    <span className="text-xs font-bold text-white">{agent?.progress}%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${agent?.progress}%` }}
                      className="h-full"
                      style={{ backgroundColor: detail.color }}
                    />
                  </div>
                  <p className="text-xs font-mono text-zinc-500 bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-brand-primary mr-2">{'>'}</span>
                    {agent?.currentAction}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
