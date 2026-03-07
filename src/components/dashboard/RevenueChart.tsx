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
import { Calendar, Download, Filter } from 'lucide-react';

const data = [
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
      <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-bold text-white">
            Revenue: <span className="text-brand-secondary">${payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-sm font-bold text-white">
            Deals: <span className="text-brand-accent">{payload[1].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC = () => {
  return (
    <div className="p-8 rounded-3xl glass border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-display font-bold text-white italic flex items-center gap-2">
            Revenue & Growth
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Weekly performance tracking across all agents</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
            <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white bg-brand-primary rounded-lg shadow-lg">7D</button>
            <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">30D</button>
            <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">90D</button>
          </div>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B4CF5" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#5B4CF5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
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
              {data.map((entry, index) => (
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
              stroke="#F59E0B" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#08091A' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-primary" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Revenue ($)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-accent" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Deals Closed</span>
        </div>
      </div>
    </div>
  );
};
