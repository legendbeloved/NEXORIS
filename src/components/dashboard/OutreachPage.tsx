import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Plus, Search, Filter, MoreHorizontal, Send, Eye, Copy, Trash2, CheckCircle2, Clock, AlertCircle, Loader2, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Template {
  id: number;
  name: string;
  subject: string;
  openRate: string;
  clickRate: string;
  status: 'Active' | 'Draft' | 'Archived';
  lastUsed: string;
}

const templates: Template[] = [
  { id: 1, name: 'Initial Gap Analysis', subject: 'Quick question about your website performance', openRate: '84.2%', clickRate: '12.5%', status: 'Active', lastUsed: '2 hours ago' },
  { id: 2, name: 'Follow-up: Mockup Ready', subject: 'I built a quick mockup for your business', openRate: '76.8%', clickRate: '24.1%', status: 'Active', lastUsed: '5 hours ago' },
  { id: 3, name: 'Negotiation: Pricing Options', subject: 'Regarding our discussion on pricing', openRate: '92.1%', clickRate: '45.0%', status: 'Active', lastUsed: '1 day ago' },
  { id: 4, name: 'Re-engagement: Case Study', subject: 'How we helped a similar business grow', openRate: '64.5%', clickRate: '8.2%', status: 'Draft', lastUsed: 'Never' },
];

export const OutreachPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'sent' | 'analytics'>('templates');

  const { data: outreach, isLoading } = useQuery({
    queryKey: ['outreach'],
    queryFn: () => fetch('/api/outreach').then(res => res.json()),
    enabled: activeTab === 'sent',
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tight">Outreach Command</h1>
          <p className="text-zinc-500 mt-1 text-sm">Manage your automated communication sequences.</p>
        </div>
        <button className="w-full sm:w-auto justify-center px-6 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20">
          <Plus size={14} />
          New Template
        </button>
      </div>

      {/* Tabs */}
      <div className="max-w-full overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl w-max border border-white/5">
          {[
            { id: 'templates', label: 'Templates' },
            { id: 'sent', label: 'Sent Outreach' },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-brand-primary text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search templates..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
              <button className="w-full sm:w-auto justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-500 hover:text-white transition-all flex items-center gap-2 text-sm font-bold">
                <Filter size={16} />
                Filter
              </button>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="glass p-6 rounded-3xl border-white/10 hover:border-white/20 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        template.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-500/10 text-zinc-500'
                      }`}>
                        <Mail size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{template.name}</h3>
                        <p className="text-[10px] text-zinc-500 font-mono truncate max-w-[240px] sm:max-w-[200px]">{template.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Eye size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Copy size={16} /></button>
                      <button className="p-2 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-black/20 border border-white/5 text-center">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Open Rate</p>
                      <p className="text-sm font-mono text-emerald-500">{template.openRate}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/20 border border-white/5 text-center">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Click Rate</p>
                      <p className="text-sm font-mono text-brand-secondary">{template.clickRate}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-black/20 border border-white/5 text-center">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Status</p>
                      <p className={`text-[10px] font-bold uppercase ${template.status === 'Active' ? 'text-emerald-500' : 'text-zinc-500'}`}>{template.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[10px] text-zinc-600 font-mono italic">Last used {template.lastUsed}</span>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-primary/80 transition-colors flex items-center gap-1">
                      Edit Template <Send size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'sent' && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Loader2 size={48} className="animate-spin mb-4 opacity-20" />
                <p className="text-sm italic">Retrieving sent outreach history...</p>
              </div>
            ) : outreach?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {outreach.map((item: any) => (
                  <div key={item.id} className="glass p-6 rounded-3xl border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-brand-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{item.prospect_name}</h3>
                        <p className="text-xs text-zinc-400 font-medium truncate max-w-[240px] sm:max-w-[300px]">{item.subject}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 w-full md:w-auto">
                      <div className="text-left sm:text-center">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          {item.opened_at ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Clock size={12} className="text-zinc-500" />}
                          <span className={`text-[10px] font-bold uppercase ${item.opened_at ? 'text-emerald-500' : 'text-zinc-500'}`}>
                            {item.opened_at ? 'Opened' : 'Sent'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right sm:text-center">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Variant</p>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-white">{item.variant}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-left sm:text-right">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Sent Date</p>
                        <p className="text-[10px] font-mono text-zinc-400">{new Date(item.sent_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Mail size={48} className="mb-4 opacity-20" />
                <p className="text-sm italic">No outreach sent yet. Activate Agent 2 to start communication.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-20 text-zinc-500"
          >
            <AlertCircle size={48} className="mb-4 opacity-20" />
            <p className="text-sm italic">Analytics deep-dive coming soon.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
