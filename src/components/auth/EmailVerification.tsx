import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onSuccess, onBack }) => {
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Simulate polling for verification
  useEffect(() => {
    const pollInterval = setInterval(() => {
      // In a real app, check API if verified
      if (Math.random() > 0.8) { // Random chance to verify
        setIsVerified(true);
        setTimeout(onSuccess, 2000);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [onSuccess]);

  const handleResend = () => {
    if (resendTimer > 0) return;
    setIsResending(true);
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      setResendTimer(60);
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
        <div className="w-20 h-20 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-brand-primary/20 rounded-full animate-ping" />
          {isVerified ? (
            <CheckCircle2 size={40} className="text-emerald-500" />
          ) : (
            <Mail size={40} className="text-brand-primary" />
          )}
        </div>

        <h2 className="text-3xl font-display font-bold text-white mb-2 italic">
          {isVerified ? 'Verified!' : 'Check your inbox'}
        </h2>
        
        <p className="text-zinc-400 mb-8 leading-relaxed">
          {isVerified 
            ? 'Redirecting you to the dashboard...'
            : <>We sent a verification link to <span className="text-white font-bold">{email}</span>. Click it to activate your account.</>
          }
        </p>

        {!isVerified && (
          <div className="space-y-6">
            <button 
              onClick={handleResend}
              disabled={resendTimer > 0 || isResending}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? <RefreshCw className="animate-spin" size={14} /> : <Mail size={14} />}
              {resendTimer > 0 ? `Resend email in ${resendTimer}s` : 'Resend email'}
            </button>

            <button 
              onClick={onBack}
              className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={12} />
              Wrong email? Go back
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};