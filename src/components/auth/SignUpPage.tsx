import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, User, Loader2, ArrowRight } from 'lucide-react';
import { isSupabaseConfigured, supabaseClient } from '../../lib/supabase';

interface SignUpPageProps {
  onSuccess: () => void;
  goSignin: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onSuccess, goSignin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-zinc-700' };
    let score = 0;
    if (pass.length > 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-brand-accent' };
    if (score >= 3) return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 0, label: '', color: 'bg-zinc-700' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured) {
      try {
        const { error: err } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });
        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
        setLoading(false);
        onSuccess();
        return;
      } catch {
        setError('Sign up failed. Please try again.');
        setLoading(false);
        return;
      }
    }

    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  const handleGoogle = async () => {
    setError(null);
    if (!isSupabaseConfigured) {
      setError('Google sign-up requires Supabase. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local.');
      return;
    }
    try {
      await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/login` },
      });
    } catch {
      setError('Google sign-up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-brand-bg text-white overflow-hidden font-sans">
      {/* Left Panel - Decorative (Hidden on mobile) */}
      <div className="hidden lg:flex w-[40%] bg-brand-bg relative items-center justify-center p-12 border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 aurora-bg opacity-50" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        
        <div className="relative z-10 max-w-md space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(91,76,245,0.3)]">
              <div className="w-6 h-6 border-2 border-white rounded-full" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tighter italic">NEXORIS</h1>
          </div>
          
          <h2 className="text-4xl font-display font-bold leading-tight">
            Deploy your autonomous workforce today.
          </h2>
          
          <div className="space-y-4 text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">1</div>
              <p>Configure your target market</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary font-bold">2</div>
              <p>Activate your AI agents</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold">3</div>
              <p>Watch revenue grow automatically</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-brand-bg/50 backdrop-blur-3xl -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass p-8 md:p-12 rounded-[32px] border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-brand-secondary/10 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold text-white mb-2 italic">Create Account</h2>
            <p className="text-zinc-500 mb-8">Start your 14-day free trial</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white placeholder-zinc-600"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white placeholder-zinc-600"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white placeholder-zinc-600"
                    placeholder="Create a password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Strength Meter */}
                {password && (
                  <div className="flex items-center gap-2 mt-2 ml-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className={`h-1 w-6 rounded-full transition-colors ${
                            strength.score >= i ? strength.color : 'bg-white/10'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${
                      strength.score === 1 ? 'text-red-500' :
                      strength.score === 2 ? 'text-brand-accent' :
                      strength.score === 3 ? 'text-emerald-500' : 'text-zinc-500'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white placeholder-zinc-600"
                    placeholder="Confirm password"
                  />
                </div>
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
                disabled={loading}
                className="w-full py-4 rounded-xl bg-brand-primary text-white font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : (
                  <>
                    Create Account
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#0d0e21] text-zinc-500 uppercase font-bold tracking-widest text-[10px]">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>

              <div className="text-center">
                <p className="text-zinc-500 text-xs">
                  Already have an account?{' '}
                  <button onClick={goSignin} className="text-brand-secondary font-bold hover:underline transition-all">
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
