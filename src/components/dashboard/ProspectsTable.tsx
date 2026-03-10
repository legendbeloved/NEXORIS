import React, { useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState
} from '@tanstack/react-table';
import { 
  MoreHorizontal, 
  ExternalLink, 
  Mail, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { motion } from 'motion/react';

interface Prospect {
  id: number;
  name: string;
  category: string;
  status: string;
  website: string;
  email: string;
  phone: string;
  painPoints: string[];
  token: string;
  updated_at: string;
}

const columnHelper = createColumnHelper<Prospect>();

const statusColors: Record<string, string> = {
  discovered: 'bg-zinc-500/10 text-zinc-500',
  contacted: 'bg-blue-500/10 text-blue-500',
  opened: 'bg-indigo-500/10 text-indigo-500',
  replied: 'bg-brand-secondary/10 text-brand-secondary',
  interested: 'bg-emerald-500/10 text-emerald-500',
  agreed: 'bg-brand-accent/10 text-brand-accent',
  paid: 'bg-brand-primary/10 text-brand-primary',
};

export const ProspectsTable: React.FC<{ data: Prospect[] }> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = [
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <button className="flex items-center gap-2 hover:text-white transition-colors" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Prospect <ArrowUpDown size={12} />
        </button>
      ),
      cell: info => (
        <div className="flex flex-col">
          <span className="font-bold text-white">{info.getValue()}</span>
          <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
            <ExternalLink size={10} /> {info.row.original.website}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => <span className="text-xs text-zinc-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: 'Contact Info',
      cell: info => (
        <div className="flex flex-col">
          <span className="text-xs text-zinc-300">{info.getValue() || 'N/A'}</span>
          <span className="text-[10px] text-zinc-500 font-mono">{info.row.original.phone || 'No phone'}</span>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${statusColors[info.getValue()] || 'bg-zinc-500/10 text-zinc-500'}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('painPoints', {
      header: 'Pain Points',
      cell: info => (
        <div className="flex flex-wrap gap-1">
          {info.getValue()?.slice(0, 2).map((point, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-zinc-500">
              {point}
            </span>
          ))}
          {info.getValue()?.length > 2 && (
            <span className="text-[9px] text-zinc-600">+{info.getValue().length - 2} more</span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('updated_at', {
      header: 'Last Activity',
      cell: info => (
        <span className="text-[10px] text-zinc-500 font-mono">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: info => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => {
              if (info.row.original.token) {
                window.open(`/client/${info.row.original.token}`, '_blank');
              }
            }}
            className="p-2 rounded-lg bg-white/5 text-zinc-500 hover:text-brand-secondary hover:bg-white/10 transition-all"
            title="View Client Portal"
          >
            <ExternalLink size={14} />
          </button>
          <button className="p-2 rounded-lg bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
            <Mail size={14} />
          </button>
          <button className="p-2 rounded-lg bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
            <MessageSquare size={14} />
          </button>
          <button className="p-2 rounded-lg bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
            <MoreHorizontal size={14} />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-[32px] border-white/10 overflow-hidden"
    >
      <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-display font-bold text-white italic">Active Prospects</h3>
        
        <div className="flex items-center gap-3">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Filter list..." 
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
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
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <motion.tr 
                key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-4 bg-white/[0.02] border-y border-white/5 first:border-l first:rounded-l-2xl last:border-r last:rounded-r-2xl group-hover:bg-white/[0.05] transition-colors">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 md:p-6 mt-4 flex items-center justify-between">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
          Showing {table.getRowModel().rows.length} of {data.length} results
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${
                  table.getState().pagination.pageIndex === i 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                    : 'bg-white/5 text-zinc-500 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
