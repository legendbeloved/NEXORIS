import React, { useEffect, useState } from 'react';
import { Search, Mail, Activity, CreditCard, TrendingUp } from 'lucide-react';
import { motion, useSpring, useTransform } from 'motion/react';

interface KPICardProps {
  label: string;
  value: number;
  subValue: string;
  icon: any;
  color: string;
  delay: number;
  isCurrency?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, subValue, icon: Icon, color, delay, isCurrency }) => {
  const springValue = useSpring(0, { stiffness: 50, damping: 20 });
  const displayValue = useTransform(springValue, (v) => 
    isCurrency ? `$${Math.floor(v).toLocaleString()}` : Math.floor(v).toLocaleString()
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      springValue.set(value);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay, springValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-5 md:p-6 rounded-3xl glass border-brand-border hover:border-brand-primary/20 transition-all group relative overflow-hidden"
      role="region"
      aria-label={label}
    >
      <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: color }} />
      
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 md:p-3 rounded-xl bg-brand-surface text-brand-text-muted group-hover:text-brand-text transition-colors border border-brand-border">
          <Icon size={18} className="md:w-5 md:h-5" />
        </div>
        <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
          <TrendingUp size={12} />
          {subValue}
        </div>
      </div>

      <p className="text-brand-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
      <motion.h3 className="text-3xl md:text-4xl font-display font-extrabold text-brand-text tracking-tighter italic">
        {displayValue}
      </motion.h3>
    </motion.div>
  );
};

export const KPIRow: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <KPICard 
        label="Total Prospects Found" 
        value={stats.totalProspects || 0} 
        subValue="↑ 24 today" 
        icon={Search} 
        color="#00D4FF" 
        delay={0.1} 
      />
      <KPICard 
        label="Emails Sent" 
        value={stats.emailsSent || 0} 
        subValue="82% opened" 
        icon={Mail} 
        color="#5B4CF5" 
        delay={0.2} 
      />
      <KPICard 
        label="Deals Closed" 
        value={stats.dealsClosed || 0} 
        subValue="↑ 3 this week" 
        icon={Activity} 
        color="#F59E0B" 
        delay={0.3} 
      />
      <KPICard 
        label="Revenue Generated" 
        value={stats.revenue || 0} 
        subValue="↑ $490 this week" 
        icon={CreditCard} 
        color="#F59E0B" 
        delay={0.4} 
        isCurrency 
      />
    </div>
  );
};
