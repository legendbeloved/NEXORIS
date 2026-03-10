import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Shield, MoreHorizontal, ChevronDown } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  status: 'Active' | 'Pending';
  avatar?: string;
}

export const TeamPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 1, name: 'Habibullah Isaliu', email: 'habibullah@nexoris.ai', role: 'Owner', status: 'Active', avatar: 'https://picsum.photos/seed/owner/100/100' },
    { id: 2, name: 'Sarah Chen', email: 'sarah@nexoris.ai', role: 'Admin', status: 'Active', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { id: 3, name: 'Mike Ross', email: 'mike@nexoris.ai', role: 'Member', status: 'Pending' },
  ]);

  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-white italic">Team Management</h2>
          <p className="text-zinc-500 mt-1">Manage access and roles for your organization.</p>
        </div>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
        >
          <UserPlus size={18} />
          Invite Member
        </button>
      </div>

      <div className="glass rounded-[32px] border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">User</th>
                <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="p-6 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center border border-white/10">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-zinc-500">{member.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white">{member.name}</p>
                        <p className="text-xs text-zinc-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className={member.role === 'Owner' ? 'text-brand-primary' : 'text-zinc-600'} />
                      <span className="text-sm text-zinc-300">{member.role}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      member.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass p-8 rounded-[32px] border-white/10 max-w-md w-full space-y-6 z-10"
            >
              <h3 className="text-xl font-bold text-white">Invite Team Member</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Email Address</label>
                  <input type="email" placeholder="colleague@company.com" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Role</label>
                  <div className="relative">
                    <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 appearance-none">
                      <option>Member</option>
                      <option>Admin</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsInviteOpen(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 font-bold transition-all">Cancel</button>
                <button onClick={() => setIsInviteOpen(false)} className="flex-1 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-all">Send Invite</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
