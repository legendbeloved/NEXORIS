import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Key, Save } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const ProfilePage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/profile').then(res => res.json()),
  });

  const avatarFileRef = useRef<HTMLInputElement | null>(null);

  const initial = useMemo(() => ({
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    roleTitle: data?.roleTitle || 'Platform Owner',
    avatarUrl: data?.avatarUrl || 'https://picsum.photos/seed/owner/200/200',
    memberSince: data?.memberSince || 'March 2026',
  }), [data]);

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const dirty =
    form.firstName !== initial.firstName ||
    form.lastName !== initial.lastName ||
    form.email !== initial.email ||
    form.roleTitle !== initial.roleTitle ||
    form.avatarUrl !== initial.avatarUrl;

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      setAvatarError(null);
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        roleTitle: form.roleTitle.trim(),
        avatarUrl: form.avatarUrl.trim(),
        memberSince: initial.memberSince,
      };
      const r = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const onAvatarFile = async (file: File | null) => {
    setAvatarError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file.');
      return;
    }
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setAvatarError('Image is too large. Max size is 2MB.');
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.onload = () => resolve(String(reader.result || ''));
      reader.readAsDataURL(file);
    }).catch(() => '');

    if (!dataUrl) {
      setAvatarError('Failed to load image. Please try another file.');
      return;
    }

    setForm((s) => ({ ...s, avatarUrl: dataUrl }));
  };

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
                  src={form.avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <button
              onClick={() => avatarFileRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-lg"
            >
              <User size={14} />
            </button>
            <input
              ref={avatarFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onAvatarFile(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{form.firstName || '—'} {form.lastName || ''}</h3>
            <p className="text-sm text-zinc-500">{form.roleTitle || 'Platform Owner'}</p>
          </div>
          <div className="w-full pt-4 border-t border-white/5">
            <p className="text-xs text-zinc-600 uppercase font-bold tracking-widest mb-2">Member Since</p>
            <p className="text-zinc-400 font-mono text-sm">{initial.memberSince}</p>
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
                  value={form.firstName}
                  onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))}
                  disabled={isLoading || saving}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Last Name</label>
                <input 
                  type="text" 
                  value={form.lastName}
                  onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))}
                  disabled={isLoading || saving}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="email" 
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    disabled={isLoading || saving}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Role Title</label>
                <input
                  type="text"
                  value={form.roleTitle}
                  onChange={(e) => setForm((s) => ({ ...s, roleTitle: e.target.value }))}
                  disabled={isLoading || saving}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Avatar URL</label>
                <input
                  type="url"
                  value={form.avatarUrl}
                  onChange={(e) => setForm((s) => ({ ...s, avatarUrl: e.target.value }))}
                  disabled={isLoading || saving}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                />
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => avatarFileRef.current?.click()}
                    disabled={isLoading || saving}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload Avatar
                  </button>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    PNG/JPG/WebP · Max 2MB
                  </div>
                </div>
                {avatarError && (
                  <div className="text-xs text-red-400">
                    {avatarError}
                  </div>
                )}
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
            <button
              onClick={save}
              disabled={isLoading || saving || !dirty}
              className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
