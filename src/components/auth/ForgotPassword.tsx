import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg opacity-30" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-10 rounded-[32px] border-white/10 text-center relative z-10"
      >
        <div className="w-20 h-20 mx-auto bg-brand-secondary/10 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-brand-secondary/20 rounded-full animate-pulse" />
          {success ? (
            <CheckCircle2 size={40} className="text-emerald-500" />
          ) : (
            <Mail size={40} className="text-brand-secondary" />
          )}
        </div>

        <h2 className="text-3xl font-display font-bold text-white mb-2 italic">
          {success ? 'Link sent!' : 'Reset Password'}
        </h2>
        
        <p className="text-zinc-400 mb-8 leading-relaxed">
          {success 
            ? <>We sent a password reset link to <span className="text-white font-bold">{email}</span>. Check your inbox to continue.</>
            : 'Enter your email address and we’ll send you a link to reset your password.'
          }
        </p>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-secondary/50 transition-all text-white placeholder-zinc-600"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 text-left"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl bg-brand-secondary text-white font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-secondary/25 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : (
                <>
                  Send Reset Link
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={onBack}
              className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={12} />
              Back to Sign In
            </button>
          </form>
        ) : (
          <button 
            type="button"
            onClick={onBack}
            className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </button>
        )}
      </motion.div>
    </div>
  );
};