import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Line, 
  ComposedChart,
  Cell
} from 'recharts';
import { Calendar, Download, Filter, Loader2, DollarSign, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const fallbackData = [
  { week: 'W1', revenue: 1200, deals: 2 },
  { week: 'W2', revenue: 2100, deals: 3 },
  { week: 'W3', revenue: 800, deals: 1 },
  { week: 'W4', revenue: 3400, deals: 5 },
  { week: 'W5', revenue: 2900, deals: 4 },
  { week: 'W6', revenue: 4500, deals: 6 },
  { week: 'W7', revenue: 5200, deals: 7 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-surface/90 backdrop-blur-md border border-brand-border p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-bold text-brand-text">
            Revenue: <span className="text-brand-secondary">${payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-sm font-bold text-brand-text">
            Deals: <span className="text-brand-accent">{payload[1].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC = () => {
  const navigate = useNavigate();
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ['revenue'],
    queryFn: () => fetch('/api/analytics/revenue').then(res => res.json()),
  });

  const displayData = revenueData || fallbackData;

  return (
    <div className="glass p-6 md:p-8 rounded-[32px] border-brand-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <DollarSign size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-brand-text italic">Revenue Analytics</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-text-muted">Last 30 Days</span>
              <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">+12.5% Growth</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/app/payments')}
          className="px-4 py-2 rounded-xl bg-brand-surface border border-brand-border text-brand-text-muted hover:text-brand-text hover:bg-brand-surface/80 transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
        >
          View Details <ChevronRight size={14} />
        </button>
      </div>

      <div className="h-[350px] w-full min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B4CF5" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#5B4CF5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-brand-border)" vertical={false} opacity={0.3} />
            <XAxis 
              dataKey="week" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar 
              dataKey="revenue" 
              radius={[6, 6, 0, 0]} 
              barSize={40}
            >
              {displayData.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="url(#barGradient)"
                  className="hover:brightness-125 transition-all cursor-pointer"
                />
              ))}
            </Bar>
            <Line 
              type="monotone" 
              dataKey="deals" 
              stroke="#00D4FF" 
              strokeWidth={2} 
              dot={{ fill: '#00D4FF', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
