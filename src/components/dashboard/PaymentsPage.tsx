import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Search, Filter, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  client: string;
  amount: number;
  status: 'Succeeded' | 'Pending' | 'Failed';
  date: string;
  method: string;
}

const transactions: Transaction[] = [
  { id: 'ch_3Mv1...', client: 'Elite Plumbing', amount: 1200, status: 'Succeeded', date: '2026-03-05 14:22', method: 'Visa •••• 4242' },
  { id: 'ch_3Mv2...', client: 'Downtown Dental', amount: 1200, status: 'Succeeded', date: '2026-03-04 09:15', method: 'Mastercard •••• 5555' },
  { id: 'ch_3Mv3...', client: 'Joe\'s Pizza', amount: 800, status: 'Succeeded', date: '2026-03-01 18:45', method: 'Apple Pay' },
  { id: 'ch_3Mv4...', client: 'Green Garden', amount: 1500, status: 'Pending', date: '2026-03-06 11:30', method: 'Bank Transfer' },
  { id: 'ch_3Mv5...', client: 'Unknown', amount: 1200, status: 'Failed', date: '2026-03-06 15:10', method: 'Visa •••• 1234' },
];

export const PaymentsPage: React.FC = () => {
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
          <h3 className="text-4xl font-display font-extrabold text-white italic tracking-tighter">$24,490</h3>
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
          <h3 className="text-4xl font-display font-extrabold text-white italic tracking-tighter">$3,200</h3>
          <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-bold mt-2">
            <Clock size={12} />
            Scheduled for March 10
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle size={64} />
          </div>
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Failed Payments</p>
          <h3 className="text-4xl font-display font-extrabold text-red-500 italic tracking-tighter">2</h3>
          <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold mt-2">
            <ArrowDownRight size={12} />
            Action required
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass p-8 rounded-3xl border-white/10 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-display font-bold text-white italic">Recent Transactions</h2>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search payments..." 
                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-primary/50 transition-all w-48"
              />
            </div>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all">
              <Filter size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Transaction ID</th>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Client</th>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Amount</th>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date</th>
                <th className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Method</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <motion.tr 
                  key={tx.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <td className="px-4 py-4 bg-white/[0.02] border-y border-white/5 first:border-l first:rounded-l-2xl last:border-r last:rounded-r-2xl group-hover:bg-white/[0.05] transition-colors">
                    <span className="text-[10px] font-mono text-zinc-500">{tx.id}</span>
                  </td>
                  <td className="px-4 py-4 bg-white/[0.02] border-y border-white/5 group-hover:bg-white/[0.05] transition-colors">
                    <span className="text-xs font-bold text-white">{tx.client}</span>
                  </td>
                  <td className="px-4 py-4 bg-white/[0.02] border-y border-white/5 group-hover:bg-white/[0.05] transition-colors">
                    <span className="text-xs font-bold text-white">${tx.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-4 bg-white/[0.02] border-y border-white/5 group-hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center gap-2">
                      {tx.status === 'Succeeded' ? <CheckCircle2 size={12} className="text-emerald-500" /> :
                       tx.status === 'Pending' ? <Clock size={12} className="text-zinc-500" /> :
                       <AlertCircle size={12} className="text-red-500" />}
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        tx.status === 'Succeeded' ? 'text-emerald-500' :
                        tx.status === 'Pending' ? 'text-zinc-500' :
                        'text-red-500'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 bg-white/[0.02] border-y border-white/5 group-hover:bg-white/[0.05] transition-colors">
                    <span className="text-[10px] text-zinc-500 font-mono">{tx.date}</span>
                  </td>
                  <td className="px-4 py-4 bg-white/[0.02] border-y border-white/5 last:border-r last:rounded-r-2xl group-hover:bg-white/[0.05] transition-colors text-right">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{tx.method}</span>
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
