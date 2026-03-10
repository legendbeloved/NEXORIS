import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Shield, Zap, Bell, Globe, Lock, Cpu, Save, RefreshCcw, AlertTriangle, Bot, Target, MessageSquare, DollarSign, Loader2, CheckCircle2 } from 'lucide-react';
import { useAgentConfig } from '../../store/dashboardStore';

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const { config, setConfig } = useAgentConfig();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('Failed to save settings:', e);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'agent-config', label: 'Agent Parameters', icon: Bot },
    { id: 'agents', label: 'Agent Guardrails', icon: Cpu },
    { id: 'security', label: 'Security & API', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Plan & Billing', icon: Lock },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tight">System Settings</h1>
          <p className="text-zinc-500 mt-1 text-sm">Configure your NEXORIS engine and agent behavior.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${
            saved ? 'bg-emerald-500 text-white' : 'bg-brand-primary text-white hover:scale-105 shadow-brand-primary/20'
          }`}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === section.id 
                  ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-[0_0_15px_rgba(91,76,245,0.1)]' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <section.icon size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-grow space-y-8">
          {activeSection === 'general' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[32px] border-white/10 space-y-8"
            >
              <div className="space-y-6">
                <h3 className="text-lg font-display font-bold text-white italic">Business Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Agency Name</label>
                    <input type="text" defaultValue="NEXORIS AI" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Primary Niche</label>
                    <input type="text" defaultValue="Digital Agencies" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 text-white" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-6">
                <h3 className="text-lg font-display font-bold text-white italic">System Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">Autonomous Mode</p>
                      <p className="text-xs text-zinc-500">Allow agents to send outreach without manual approval.</p>
                    </div>
                    <button 
                      onClick={() => setConfig({ modules: { ...config.modules, autoEscalation: !config.modules?.autoEscalation } } as any)}
                      className={`w-12 h-6 rounded-full relative p-1 transition-colors ${config.modules?.autoEscalation ? 'bg-brand-primary' : 'bg-zinc-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${config.modules?.autoEscalation ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">Sentiment Analysis</p>
                      <p className="text-xs text-zinc-500">Enable AI-driven sentiment tracking for all replies.</p>
                    </div>
                    <button 
                      onClick={() => setConfig({ modules: { ...config.modules, sentimentAnalysis: !config.modules?.sentimentAnalysis } } as any)}
                      className={`w-12 h-6 rounded-full relative p-1 transition-colors ${config.modules?.sentimentAnalysis ? 'bg-brand-primary' : 'bg-zinc-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${config.modules?.sentimentAnalysis ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'agent-config' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Agent 1: Discovery */}
              <div className="glass p-8 rounded-[32px] border-white/10 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white italic">Discovery Engine (Agent 1)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      <Target size={12} /> Target Region
                    </div>
                    <input 
                      type="text" 
                      value={config.global.targetRegion} 
                      onChange={e => setConfig({ global: { ...config.global, targetRegion: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary/50 text-white" 
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      <Cpu size={12} /> Search Depth
                    </div>
                    <input 
                      type="number" 
                      min="1" max="10"
                      value={config.agent1.searchDepth} 
                      onChange={e => setConfig({ agent1: { ...config.agent1, searchDepth: parseInt(e.target.value) } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary/50 text-white" 
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      <Shield size={12} /> Competitor Intel
                    </div>
                    <button 
                      onClick={() => setConfig({ agent1: { ...config.agent1, competitorAnalysis: !config.agent1.competitorAnalysis } })}
                      className={`w-full px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                        config.agent1.competitorAnalysis ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' : 'bg-white/5 border-white/10 text-zinc-500'
                      }`}
                    >
                      {config.agent1.competitorAnalysis ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Agent 2: Outreach */}
              <div className="glass p-8 rounded-[32px] border-white/10 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white italic">Outreach Intelligence (Agent 2)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      <MessageSquare size={12} /> Personality
                    </div>
                    <select 
                      value={config.agent2.personalityProfile}
                      onChange={e => setConfig({ agent2: { ...config.agent2, personalityProfile: e.target.value as any } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary/50 text-white appearance-none"
                    >
                      <option value="Empathetic">Empathetic</option>
                      <option value="Data-Driven">Data-Driven</option>
                      <option value="Challenger">Challenger</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      <Zap size={12} /> Smart Scheduling
                    </div>
                    <button 
                      onClick={() => setConfig({ agent2: { ...config.agent2, smartScheduling: !config.agent2.smartScheduling } })}
                      className={`w-full px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                        config.agent2.smartScheduling ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-white/5 border-white/10 text-zinc-500'
                      }`}
                    >
                      {config.agent2.smartScheduling ? 'Active' : 'Off'}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                      <DollarSign size={12} /> Daily Limit
                    </div>
                    <input 
                      type="number"
                      value={config.agent2.dailySendLimit}
                      onChange={e => setConfig({ agent2: { ...config.agent2, dailySendLimit: parseInt(e.target.value) } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary/50 text-white" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'agents' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[32px] border-white/10 space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-bold text-white italic">Negotiation Guardrails</h3>
                  <span className="text-[10px] text-brand-accent font-bold uppercase tracking-widest flex items-center gap-1">
                    <AlertTriangle size={12} /> High Sensitivity
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Minimum Project Price</label>
                      <span className="text-xs font-mono text-white">${config.agent3.rules[0]?.min || 800}</span>
                    </div>
                    <input 
                      type="range" 
                      min="500" max="5000" step="100"
                      value={config.agent3.rules[0]?.min || 800}
                      onChange={e => {
                        const rules = [...config.agent3.rules];
                        if (rules[0]) rules[0].min = parseInt(e.target.value);
                        setConfig({ agent3: { ...config.agent3, rules } });
                      }}
                      className="w-full accent-brand-primary" 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Max Discount Allowance</label>
                      <span className="text-xs font-mono text-white">{config.agent3.escalationDiscountPercent}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" max="50"
                      value={config.agent3.escalationDiscountPercent}
                      onChange={e => setConfig({ agent3: { ...config.agent3, escalationDiscountPercent: parseInt(e.target.value) } })}
                      className="w-full accent-brand-primary" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection !== 'general' && activeSection !== 'agents' && activeSection !== 'agent-config' && (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <RefreshCcw size={48} className="mb-4 opacity-20 animate-spin-slow" />
              <p className="text-sm italic">{activeSection} configuration is being synchronized...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};