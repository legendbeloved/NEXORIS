import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Shield, Zap, Bell, Globe, Lock, Cpu, Save, RefreshCcw, AlertTriangle, Bot, Target, MessageSquare, DollarSign } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');

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
        <button className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20">
          <Save size={14} />
          Save Changes
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
                    <input type="text" defaultValue="NEXORIS AI" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Primary Niche</label>
                    <input type="text" defaultValue="Digital Agencies" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50" />
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
                    <button className="w-12 h-6 rounded-full bg-brand-primary relative p-1">
                      <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">Dark Mode Dashboard</p>
                      <p className="text-xs text-zinc-500">Use the deep midnight theme for the command center.</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-brand-primary relative p-1">
                      <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
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
              {['Discovery Engine', 'Outreach Intelligence', 'Negotiation & Delivery'].map((agentName, idx) => (
                <div key={idx} className="glass p-8 rounded-[32px] border-white/10 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      <Bot size={20} />
                    </div>
                    <h3 className="text-lg font-display font-bold text-white italic">{agentName}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Target Industries */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                        <Target size={12} /> Target Industries
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['SaaS', 'Real Estate', 'E-commerce', 'Healthcare'].map(tag => (
                          <span key={tag} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-300 hover:border-brand-primary/50 cursor-pointer transition-colors">
                            {tag}
                          </span>
                        ))}
                        <button className="px-2 py-1 rounded-lg bg-brand-primary/20 border border-brand-primary/40 text-[10px] text-brand-primary font-bold">
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Budget Range */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                        <DollarSign size={12} /> Budget Range
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="text" defaultValue="$1k" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary/50" />
                        <span className="text-zinc-600 text-xs">-</span>
                        <input type="text" defaultValue="$5k" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary/50" />
                      </div>
                    </div>

                    {/* Comm Style */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                        <MessageSquare size={12} /> Comm. Style
                      </div>
                      <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary/50 text-zinc-300 appearance-none">
                        <option>Professional & Formal</option>
                        <option>Casual & Friendly</option>
                        <option>Direct & Concise</option>
                        <option>Consultative</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
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
                      <span className="text-xs font-mono text-white">$800</span>
                    </div>
                    <input type="range" className="w-full accent-brand-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Max Discount Allowance</label>
                      <span className="text-xs font-mono text-white">15%</span>
                    </div>
                    <input type="range" className="w-full accent-brand-primary" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-6">
                <h3 className="text-lg font-display font-bold text-white italic">Outreach Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Daily Discovery Scan Limit</label>
                    <input type="number" defaultValue="500" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Daily Outreach Limit</label>
                    <input type="number" defaultValue="100" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50" />
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
