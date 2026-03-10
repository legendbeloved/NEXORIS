import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Key, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-display font-bold text-white italic">My Profile</h2>
        <p className="text-zinc-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="glass p-8 rounded-[32px] border-white/10 flex flex-col items-center text-center space-y-4 h-fit">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary p-[2px]">
              <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/owner/200/200" 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-lg">
              <User size={14} />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Habibullah Isaliu</h3>
            <p className="text-sm text-zinc-500">Platform Owner</p>
          </div>
          <div className="w-full pt-4 border-t border-white/5">
            <p className="text-xs text-zinc-600 uppercase font-bold tracking-widest mb-2">Member Since</p>
            <p className="text-zinc-400 font-mono text-sm">March 2026</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass p-8 rounded-[32px] border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User size={18} className="text-brand-primary" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">First Name</label>
                <input 
                  type="text" 
                  defaultValue="Habibullah"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Last Name</label>
                <input 
                  type="text" 
                  defaultValue="Isaliu"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="email" 
                    defaultValue="habibullah@nexoris.ai"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[32px] border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" />
              Security
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                    <Key size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Password</p>
                    <p className="text-xs text-zinc-500">Last changed 3 months ago</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  Change
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Enabled</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  Configure
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
