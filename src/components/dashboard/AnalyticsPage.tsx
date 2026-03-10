import React from 'react';
import { motion } from 'motion/react';
import { BarChart, TrendingUp, Users, Mail, Target, Zap, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const fallbackData = [
  { name: 'Mon', prospects: 120, outreach: 45, deals: 2 },
  { name: 'Tue', prospects: 150, outreach: 52, deals: 3 },
  { name: 'Wed', prospects: 180, outreach: 61, deals: 1 },
  { name: 'Thu', prospects: 140, outreach: 48, deals: 4 },
  { name: 'Fri', prospects: 210, outreach: 75, deals: 5 },
  { name: 'Sat', prospects: 90, outreach: 30, deals: 2 },
  { name: 'Sun', prospects: 110, outreach: 35, deals: 1 },
];

export const AnalyticsPage: React.FC<{ stats: any, prospects: any[] }> = ({ stats, prospects }) => {
  const conversionRate = stats.totalProspects > 0 ? ((stats.dealsClosed / stats.totalProspects) * 100).toFixed(1) + '%' : '0%';
  const avgDealSize = stats.dealsClosed > 0 ? '$' + Math.round(stats.revenue / stats.dealsClosed).toLocaleString() : '$0';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tight">Intelligence Analytics</h1>
          <p className="text-zinc-500 mt-1 text-sm">Deep dive into your autonomous growth metrics.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
          <button className="px-4 py-2 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg">7 Days</button>
          <button className="px-4 py-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:text-white transition-colors">30 Days</button>
          <button className="px-4 py-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:text-white transition-colors">All Time</button>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Conversion Rate', value: conversionRate, trend: '+0.8%', icon: Target, color: '#5B4CF5' },
          { label: 'Avg. Deal Size', value: avgDealSize, trend: '+$120', icon: Zap, color: '#F59E0B' },
          { label: 'Total Prospects', value: stats.totalProspects?.toLocaleString() || '0', trend: '+24', icon: Users, color: '#00D4FF' },
          { label: 'Revenue Generated', value: '$' + (stats.revenue?.toLocaleString() || '0'), trend: '+$8.2k', icon: TrendingUp, color: '#10B981' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border-white/10 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/5 text-zinc-400 group-hover:text-white transition-colors">
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div className="text-emerald-500 text-[10px] font-bold flex items-center gap-1">
                <ArrowUpRight size={12} />
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-display font-extrabold text-white italic tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Growth Chart */}
        <div className="glass p-8 rounded-[32px] border-white/10 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-display font-bold text-white italic flex items-center gap-2">
              <TrendingUp size={20} className="text-brand-primary" />
              Prospect Discovery vs Outreach
            </h3>
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Weekly Growth</span>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fallbackData}>
                <defs>
                  <linearGradient id="colorProspects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutreach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B4CF5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5B4CF5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="prospects" stroke="#00D4FF" fillOpacity={1} fill="url(#colorProspects)" strokeWidth={2} />
                <Area type="monotone" dataKey="outreach" stroke="#5B4CF5" fillOpacity={1} fill="url(#colorOutreach)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel Chart */}
        <div className="glass p-8 rounded-[32px] border-white/10 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-display font-bold text-white italic flex items-center gap-2">
              <Target size={20} className="text-brand-secondary" />
              Conversion Efficiency
            </h3>
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">By Stage</span>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={stats.funnel || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="stage" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#5B4CF5" radius={[4, 4, 0, 0]} barSize={30} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
