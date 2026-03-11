import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Shield, Zap, Bell, Globe, Lock, Cpu, Save, RefreshCcw, AlertTriangle, Bot, Target, MessageSquare, DollarSign, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { useAgentConfig } from '../../store/dashboardStore';
import { useQuery } from '@tanstack/react-query';

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const { config, setConfig } = useAgentConfig();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [billing, setBilling] = useState({
    plan: 'Pro',
    currency: 'USD',
    invoiceEmail: 'billing@nexoris.ai',
    autoRenew: true,
    taxId: '',
  });
  const [billingHydrated, setBillingHydrated] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    inApp: true,
    email: true,
    weeklySummary: true,
    agentAlerts: true,
    dealAlerts: true,
    marketing: false,
  });
  const [notificationsHydrated, setNotificationsHydrated] = useState(false);

  const { data: billingData } = useQuery({
    queryKey: ['settings', 'billing'],
    queryFn: () => fetch('/api/settings/billing').then((r) => r.json()),
  });

  const { data: notificationsData } = useQuery({
    queryKey: ['settings', 'notifications'],
    queryFn: () => fetch('/api/settings/notifications').then((r) => r.json()),
  });

  useEffect(() => {
    if (!billingHydrated && billingData) {
      setBilling(billingData);
      setBillingHydrated(true);
    }
  }, [billingData, billingHydrated]);

  useEffect(() => {
    if (!notificationsHydrated && notificationsData) {
      setNotificationSettings(notificationsData);
      setNotificationsHydrated(true);
    }
  }, [notificationsData, notificationsHydrated]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      if (activeSection === 'billing') {
        await fetch('/api/settings/billing', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(billing),
        });
      } else if (activeSection === 'notifications') {
        await fetch('/api/settings/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notificationSettings),
        });
      } else {
        await fetch('/api/config', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });
      }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tight">System Settings</h1>
          <p className="text-zinc-500 mt-1 text-sm">Configure your NEXORIS engine and agent behavior.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${
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

          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[32px] border-white/10 space-y-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white italic">Notifications</h3>
                  <p className="text-xs text-zinc-500">Control alerts across the dashboard.</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'inApp', title: 'In-app notifications', desc: 'Show notifications in your dashboard.' },
                  { key: 'email', title: 'Email notifications', desc: 'Receive important alerts by email.' },
                  { key: 'weeklySummary', title: 'Weekly summary', desc: 'Get weekly performance summaries.' },
                  { key: 'agentAlerts', title: 'Agent alerts', desc: 'Mission status, errors, approvals.' },
                  { key: 'dealAlerts', title: 'Deal alerts', desc: 'Meeting booked, deal agreed, payment received.' },
                  { key: 'marketing', title: 'Product updates', desc: 'Occasional updates and tips.' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings((s: any) => ({ ...s, [item.key]: !s[item.key] }))}
                      className={`w-12 h-6 rounded-full relative p-1 transition-colors ${
                        (notificationSettings as any)[item.key] ? 'bg-brand-primary' : 'bg-zinc-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        (notificationSettings as any)[item.key] ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'billing' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[32px] border-white/10 space-y-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white italic">Plan & Billing</h3>
                  <p className="text-xs text-zinc-500">Billing preferences and invoice details.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Plan</label>
                  <select
                    value={billing.plan}
                    onChange={(e) => setBilling((s) => ({ ...s, plan: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 text-white appearance-none"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Currency</label>
                  <select
                    value={billing.currency}
                    onChange={(e) => setBilling((s) => ({ ...s, currency: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 text-white appearance-none"
                  >
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                    <option value="NGN">NGN</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Invoice Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                    <input
                      type="email"
                      value={billing.invoiceEmail}
                      onChange={(e) => setBilling((s) => ({ ...s, invoiceEmail: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 text-white placeholder-zinc-600"
                      placeholder="billing@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Tax ID (optional)</label>
                  <input
                    type="text"
                    value={billing.taxId}
                    onChange={(e) => setBilling((s) => ({ ...s, taxId: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 text-white placeholder-zinc-600"
                    placeholder="VAT / EIN"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-sm font-bold text-white">Auto-renew</p>
                  <p className="text-xs text-zinc-500">Renew automatically each billing cycle.</p>
                </div>
                <button
                  onClick={() => setBilling((s) => ({ ...s, autoRenew: !s.autoRenew }))}
                  className={`w-12 h-6 rounded-full relative p-1 transition-colors ${billing.autoRenew ? 'bg-brand-primary' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${billing.autoRenew ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </motion.div>
          )}

          {activeSection !== 'general' &&
            activeSection !== 'agents' &&
            activeSection !== 'agent-config' &&
            activeSection !== 'notifications' &&
            activeSection !== 'billing' && (
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
