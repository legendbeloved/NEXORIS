import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Shield, Trash2, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  status: 'Active' | 'Pending';
  avatar?: string;
}

export const TeamPage: React.FC = () => {
  const { data, isLoading, refetch } = useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: () => fetch('/api/team').then(res => res.json()),
  });

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Member');
  const [saving, setSaving] = useState(false);

  const initialMembers = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const [draftMembers, setDraftMembers] = useState<TeamMember[]>(initialMembers);

  useEffect(() => {
    setDraftMembers(initialMembers);
  }, [initialMembers]);

  const dirty = useMemo(() => {
    if (draftMembers.length !== initialMembers.length) return true;
    const byId = new Map<number, TeamMember>();
    for (const m of initialMembers) byId.set(m.id, m);
    for (const d of draftMembers) {
      const o = byId.get(d.id);
      if (!o) return true;
      if (o.name !== d.name) return true;
      if (o.email !== d.email) return true;
      if (o.role !== d.role) return true;
      if (o.status !== d.status) return true;
      if ((o.avatar || '') !== (d.avatar || '')) return true;
    }
    return false;
  }, [draftMembers, initialMembers]);

  const saveChanges = async () => {
    setSaving(true);
    try {
      const byId = new Map<number, TeamMember>();
      for (const m of initialMembers) byId.set(m.id, m);
      const updates = draftMembers
        .map((d) => {
          const o = byId.get(d.id);
          if (!o) return null;
          const changed =
            o.name !== d.name ||
            o.email !== d.email ||
            o.role !== d.role ||
            o.status !== d.status ||
            (o.avatar || '') !== (d.avatar || '');
          if (!changed) return null;
          return d;
        })
        .filter(Boolean) as TeamMember[];

      await Promise.all(
        updates.map((u) =>
          fetch(`/api/team/${u.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(u),
          }),
        ),
      );
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (id: number) => {
    const ok = window.confirm('Delete this team member?');
    if (!ok) return;
    setSaving(true);
    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' });
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  const inviteMember = async () => {
    const name = inviteName.trim();
    const email = inviteEmail.trim();
    if (!name || !email) return;
    setSaving(true);
    try {
      await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role: inviteRole, status: 'Pending' }),
      });
      setInviteName('');
      setInviteEmail('');
      setInviteRole('Member');
      setIsInviteOpen(false);
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-white italic">Team Management</h2>
          <p className="text-zinc-500 mt-1">Manage access and roles for your organization.</p>
        </div>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="w-full sm:w-auto justify-center px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
        >
          <UserPlus size={18} />
          Invite Member
        </button>
      </div>

      <div className="glass rounded-[32px] border-white/10 overflow-hidden">
        <div className="md:hidden p-4 space-y-3">
          {draftMembers.map((member) => (
            <div key={member.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-zinc-500">{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{member.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{member.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => deleteMember(member.id)}
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors shrink-0"
                  disabled={saving}
                  aria-label="Delete member"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Shield size={14} className={member.role === 'Owner' ? 'text-brand-primary' : 'text-zinc-600'} />
                  <select
                    value={member.role}
                    disabled={saving}
                    onChange={(e) => {
                      const nextRole = e.target.value as TeamMember['role'];
                      setDraftMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, role: nextRole } : m)));
                    }}
                    className="text-sm text-zinc-300 bg-transparent border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-primary/50"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  member.status === 'Active' 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
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
              {draftMembers.map((member) => (
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
                      <select
                        value={member.role}
                        disabled={saving}
                        onChange={(e) => {
                          const nextRole = e.target.value as TeamMember['role'];
                          setDraftMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, role: nextRole } : m)));
                        }}
                        className="text-sm text-zinc-300 bg-black/20 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-primary/50"
                      >
                        <option value="Owner">Owner</option>
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                      </select>
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
                    <button
                      onClick={() => deleteMember(member.id)}
                      disabled={saving}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
                      aria-label="Delete member"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3">
        <button
          onClick={() => setDraftMembers(initialMembers)}
          disabled={!dirty || saving}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <button
          onClick={saveChanges}
          disabled={!dirty || saving}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
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
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Full Name</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Role</label>
                  <div className="relative">
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 appearance-none"
                    >
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
                      <option value="Owner">Owner</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsInviteOpen(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 font-bold transition-all">Cancel</button>
                <button
                  onClick={inviteMember}
                  disabled={saving || !inviteName.trim() || !inviteEmail.trim()}
                  className="flex-1 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
