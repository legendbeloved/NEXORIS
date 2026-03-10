import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 mx-auto shadow-[0_0_60px_rgba(255,255,255,0.05)]">
          <AlertTriangle size={48} className="text-zinc-500" />
        </div>
        
        <h1 className="text-6xl font-display font-bold text-white italic tracking-tighter mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-zinc-500 max-w-md mx-auto mb-8">
          The coordinates you entered lead to deep space. This sector has not been mapped by our agents yet.
        </p>

        <button 
          onClick={() => navigate('/app')}
          className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 mx-auto"
        >
          <ArrowLeft size={18} />
          Return to Dashboard
        </button>
      </motion.div>
    </div>
  );
};
