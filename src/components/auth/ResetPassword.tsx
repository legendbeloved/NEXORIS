import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Loader2, Lock, ArrowLeft } from 'lucide-react';
import { isSupabaseConfigured, supabaseClient } from '../../lib/supabase';

interface ResetPasswordProps {
  onBackToLogin: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onBackToLogin }) => {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!isSupabaseConfigured) {
        setError('Auth is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local.');
        return;
      }

      try {
        const anyAuth = supabaseClient.auth as any;
        if (typeof anyAuth.getSessionFromUrl === 'function') {
          const { error: err } = await anyAuth.getSessionFromUrl({ storeSession: true });
          if (err) {
            setError(err.message);
            return;
          }
          setReady(true);
          return;
        }

        const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        const type = params.get('type');
        if (!access_token || !refresh_token || type !== 'recovery') {
          setError('Invalid or expired password reset link.');
          return;
        }

        const { error: err } = await anyAuth.setSession({ access_token, refresh_token });
        if (err) {
          setError(err.message);
          return;
        }

        setReady(true);
      } catch {
        setError('Failed to initialize password reset.');
      }
    };

    init();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ready) return;
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      const { error: err } = await supabaseClient.auth.updateUser({ password });
      if (err) {
        setError(err.message);
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg opacity-30" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-10 rounded-[32px] border-white/10 text-center relative z-10"
      >
        <div className="w-20 h-20 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-brand-primary/20 rounded-full animate-pulse" />
          {success ? (
            <CheckCircle2 size={40} className="text-emerald-500" />
          ) : error ? (
            <AlertCircle size={40} className="text-red-400" />
          ) : (
            <Lock size={40} className="text-brand-primary" />
          )}
        </div>

        <h2 className="text-3xl font-display font-bold text-white mb-2 italic">
          {success ? 'Password updated' : 'Set a new password'}
        </h2>

        <p className="text-zinc-400 mb-8 leading-relaxed">
          {success ? 'You can now sign in with your new password.' : 'Choose a strong password and confirm it below.'}
        </p>

        {!success && (
          <form onSubmit={onSubmit} className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!ready || saving}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white placeholder-zinc-600"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={!ready || saving}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white placeholder-zinc-600"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={!ready || saving}
              className="w-full py-4 rounded-xl bg-brand-primary text-white font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : 'Update Password'}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={onBackToLogin}
          className="mt-6 text-xs text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={12} />
          Back to Sign In
        </button>
      </motion.div>
    </div>
  );
};

