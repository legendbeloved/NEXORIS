import React from 'react';
import { motion } from 'motion/react';
import { Check, CreditCard, Zap, Crown, Rocket } from 'lucide-react';

const PlanCard: React.FC<{ 
  name: string; 
  price: string; 
  features: string[]; 
  isPopular?: boolean; 
  isCurrent?: boolean; 
}> = ({ name, price, features, isPopular, isCurrent }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`relative p-8 rounded-[32px] border ${
      isPopular 
        ? 'bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border-brand-primary/50 shadow-[0_0_40px_rgba(91,76,245,0.2)]' 
        : 'bg-white/5 border-white/10'
    }`}
  >
    {isPopular && (
      <div className="absolute top-0 right-0 px-4 py-1 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-xl rounded-tr-[30px]">
        Best Value
      </div>
    )}
    
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-white">{name}</h3>
      {isCurrent && (
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
          Current Plan
        </span>
      )}
    </div>
    
    <div className="mb-8">
      <span className="text-4xl font-display font-bold text-white italic">{price}</span>
      <span className="text-zinc-500">/mo</span>
    </div>
    
    <ul className="space-y-4 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
          <Check size={16} className="text-brand-primary shrink-0 mt-0.5" />
          {feature}
        </li>
      ))}
    </ul>
    
    <button 
      disabled={isCurrent}
      className={`w-full py-4 rounded-xl font-bold transition-all ${
        isCurrent 
          ? 'bg-white/5 text-zinc-500 cursor-not-allowed' 
          : isPopular 
            ? 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20' 
            : 'bg-white/10 text-white hover:bg-white/20'
      }`}
    >
      {isCurrent ? 'Active Plan' : 'Upgrade Plan'}
    </button>
  </motion.div>
);

export const SubscriptionPage: React.FC = () => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white italic mb-4">
          Scale Your Outreach Operations
        </h2>
        <p className="text-zinc-400">
          Choose the plan that fits your growth stage. Upgrade anytime to unlock more agents and features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PlanCard 
          name="Starter" 
          price="$49" 
          features={[
            "1 Active Agent",
            "500 Prospects / mo",
            "Basic Email Outreach",
            "Standard Support",
            "1 Team Member"
          ]} 
        />
        <PlanCard 
          name="Pro" 
          price="$149" 
          isPopular
          isCurrent
          features={[
            "3 Active Agents",
            "2,500 Prospects / mo",
            "Advanced Outreach & A/B Testing",
            "Priority Support",
            "5 Team Members",
            "CRM Integration"
          ]} 
        />
        <PlanCard 
          name="Enterprise" 
          price="$499" 
          features={[
            "Unlimited Agents",
            "10,000+ Prospects / mo",
            "Custom AI Model Training",
            "Dedicated Account Manager",
            "Unlimited Team Members",
            "API Access",
            "White-label Portal"
          ]} 
        />
      </div>

      <div className="glass p-8 rounded-[32px] border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Payment Method</h3>
            <p className="text-sm text-zinc-500">Visa ending in 4242 • Expires 12/28</p>
          </div>
        </div>
        <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white font-bold transition-all text-sm">
          Update Card
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs text-zinc-600">
          Need a custom solution? <a href="#" className="text-brand-primary hover:underline">Contact Sales</a>
        </p>
      </div>
    </div>
  );
};
