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
import { Search, MapPin, Globe, Mail, Phone, ExternalLink, MoreVertical, Filter, Download, Trash2, CheckCircle2, XCircle, AlertCircle, Clock, ChevronLeft, ChevronRight, ArrowUpDown, MessageSquare } from 'lucide-react';
import { EntityDetailModal } from './EntityDetailModal';
import { useQuery } from '@tanstack/react-query';
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

interface ProspectsTableProps {
  data: Prospect[];
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

export const ProspectsTable: React.FC<ProspectsTableProps> = ({ data, onSearch, onFilter }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedProspectId, setSelectedProspectId] = React.useState<number | null>(null);
  const { data: detailData, isLoading: isDetailLoading } = useQuery<Prospect>({
    queryKey: ['prospect', selectedProspectId],
    queryFn: () => fetch(`/api/prospects/${selectedProspectId}`).then(res => res.json()),
    enabled: !!selectedProspectId
  });

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
            <MoreVertical size={14} />
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
      className="glass rounded-[32px] border-brand-border overflow-hidden"
    >
      <div className="p-4 md:p-6 border-b border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-display font-bold text-brand-text italic">Active Prospects</h3>

        <div className="flex items-center gap-3">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary transition-colors" size={14} />
            <input
              type="text"
              placeholder="Filter list..."
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="w-full sm:w-64 bg-brand-surface border border-brand-border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-primary/50 transition-all text-brand-text"
            />
          </div>
          <button
            onClick={onFilter}
            className="p-2 rounded-xl bg-brand-surface border border-brand-border text-brand-text-muted hover:text-brand-text transition-colors"
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="md:hidden p-4 space-y-3">
        {table.getRowModel().rows.map((row) => {
          const p = row.original;
          return (
            <div
              key={row.id}
              onClick={() => setSelectedProspectId(p.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedProspectId(p.id);
              }}
              role="button"
              tabIndex={0}
              className="w-full text-left p-4 rounded-2xl bg-brand-surface border border-brand-border hover:bg-brand-surface/80 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="font-bold text-brand-text truncate">{p.name}</div>
                    <span className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${statusColors[p.status] || 'bg-zinc-500/10 text-zinc-500'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-brand-text-muted truncate flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 truncate">
                      <ExternalLink size={12} /> <span className="truncate">{p.website || 'No website'}</span>
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="truncate">{p.category || 'Uncategorized'}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-brand-text-muted font-mono">
                    Last activity: {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (p.token) window.open(`/client/${p.token}`, '_blank');
                  }}
                  className="p-2 rounded-lg bg-black/20 border border-brand-border text-brand-text-muted hover:text-brand-secondary hover:bg-black/30 transition-all"
                  title="View Client Portal"
                >
                  <ExternalLink size={14} />
                </button>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-lg bg-black/20 border border-brand-border text-brand-text-muted hover:text-brand-text hover:bg-black/30 transition-all"
                  title="Message"
                >
                  <MessageSquare size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {table.getRowModel().rows.length === 0 && (
          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border text-center text-brand-text-muted">
            No prospects found.
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-4 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest border-b border-brand-border">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="group hover:bg-brand-surface/50 transition-colors border-b border-brand-border last:border-0"
                onClick={() => setSelectedProspectId(row.original.id)}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 md:p-6 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-widest">
          Showing {table.getRowModel().rows.length} of {data.length} results
        </p>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-xl bg-brand-surface border border-brand-border text-brand-text-muted hover:text-brand-text disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest sm:hidden">
            Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </div>

          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${table.getState().pagination.pageIndex === i
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                  : 'bg-brand-surface text-brand-text-muted hover:text-brand-text border border-brand-border'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-xl bg-brand-surface border border-brand-border text-brand-text-muted hover:text-brand-text disabled:opacity-30 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <EntityDetailModal
        isOpen={!!selectedProspectId}
        onClose={() => setSelectedProspectId(null)}
        title={detailData?.name || 'Prospect Detail'}
        subtitle={detailData?.category}
        type="prospect"
        data={detailData}
        loading={isDetailLoading}
      />
    </motion.div>
  );
};
