import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

interface SignInPageProps {
  onSuccess: () => void;
  goSignup: () => void;
  goForgotPassword: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onSuccess, goSignup, goForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      if (email === 'error@example.com') {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      } else {
        setLoading(false);
        onSuccess();
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-brand-bg text-white overflow-hidden font-sans">
      {/* Left Panel - Decorative */}
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
          
          <blockquote className="text-2xl font-display font-medium leading-relaxed italic">
            "Three agents. One system. Zero manual effort."
          </blockquote>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-brand-secondary border-brand-secondary/20">
              12K Leads Found
            </div>
            <div className="glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-brand-accent border-brand-accent/20">
              $280K Closed
            </div>
            <div className="glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-brand-primary border-brand-primary/20">
              500+ Users
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
            <h2 className="text-3xl font-display font-bold text-white mb-2 italic">Welcome back</h2>
            <p className="text-zinc-500 mb-8">Sign in to your NEXORIS dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Password</label>
                  <button type="button" onClick={goForgotPassword} className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary hover:text-brand-secondary/80 transition-colors">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-brand-primary/50 transition-all text-white placeholder-zinc-600"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
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
                    Sign In to Dashboard
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

              <button type="button" className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
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
                  Don't have an account?{' '}
                  <button onClick={goSignup} className="text-brand-secondary font-bold hover:underline transition-all">
                    Sign up
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