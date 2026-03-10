import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Search, Filter, Download, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Transaction {
  id: string;
  client: string;
  amount: number;
  status: 'Succeeded' | 'Pending' | 'Failed';
  date: string;
  method: string;
}

const fallbackTransactions: Transaction[] = [
  { id: 'ch_3Mv1...', client: 'Elite Plumbing', amount: 1200, status: 'Succeeded', date: '2026-03-05 14:22', method: 'Visa •••• 4242' },
  { id: 'ch_3Mv2...', client: 'Downtown Dental', amount: 1200, status: 'Succeeded', date: '2026-03-04 09:15', method: 'Mastercard •••• 5555' },
  { id: 'ch_3Mv3...', client: 'Joe\'s Pizza', amount: 800, status: 'Succeeded', date: '2026-03-01 18:45', method: 'Apple Pay' },
  { id: 'ch_3Mv4...', client: 'Green Garden', amount: 1500, status: 'Pending', date: '2026-03-06 11:30', method: 'Bank Transfer' },
  { id: 'ch_3Mv5...', client: 'Unknown', amount: 1200, status: 'Failed', date: '2026-03-06 15:10', method: 'Visa •••• 1234' },
];

export const PaymentsPage: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetch('/api/stats').then(res => res.json()),
  });

  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => fetch('/api/deals').then(res => res.json()),
  });

  const displayTransactions = deals?.map((d: any) => ({
    id: `ch_${d.id}x92`,
    client: d.client_name,
    amount: d.amount,
    status: d.status === 'paid' ? 'Succeeded' : 'Pending',
    date: d.closed_at ? new Date(d.closed_at).toLocaleString() : 'N/A',
    method: 'Simulated Payment'
  })) || fallbackTransactions;

  const totalRevenue = stats?.revenue || 24490;
  const pendingPayouts = deals?.filter((d: any) => d.status === 'pending').reduce((sum: number, d: any) => sum + d.amount, 0) || 3200;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tight">Financial Command</h1>
          <p className="text-zinc-500 mt-1 text-sm">Track revenue, transactions, and payment status.</p>
        </div>
        <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={64} />
          </div>
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-3xl md:text-4xl font-display font-extrabold text-white italic tracking-tighter">${totalRevenue.toLocaleString()}</h3>
          <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold mt-2">
            <ArrowUpRight size={12} />
            ↑ 12.4% vs last month
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard size={64} />
          </div>
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Pending Payouts</p>
          <h3 className="text-3xl md:text-4xl font-display font-extrabold text-white italic tracking-tighter">${pendingPayouts.toLocaleString()}</h3>
          <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-bold mt-2">
            <Clock size={12} />
            Scheduled for March 10
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle size={64} />
          </div>
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Total Deals Closed</p>
          <h3 className="text-3xl md:text-4xl font-display font-extrabold text-brand-primary italic tracking-tighter">{stats?.dealsClosed || 0}</h3>
          <div className="flex items-center gap-1 text-brand-primary text-[10px] font-bold mt-2">
            <ArrowUpRight size={12} />
            Keep scaling outreach
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass rounded-[32px] border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-display font-bold text-white italic">Recent Transactions</h2>
            <div className="hidden sm:flex px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative group flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search transaction ID..." 
                className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-primary/50 transition-all"
              />
            </div>
            <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-colors">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Client</th>
                <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount</th>
                <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {displayTransactions.map((tx) => (
                <motion.tr 
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{tx.client}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{tx.method}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm text-zinc-300">${tx.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                      tx.status === 'Succeeded' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      tx.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-zinc-500">{tx.date}</td>
                  <td className="p-4 text-right">
                    <button className="text-zinc-500 hover:text-white transition-colors">
                      <Download size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};