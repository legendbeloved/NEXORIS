import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Mail, Phone, MapPin, Zap, Activity, Clock, FileText, MessageSquare } from 'lucide-react';

interface EntityDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    type: 'prospect' | 'project';
    data: any;
    loading?: boolean;
}

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    type,
    data,
    loading
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* ModalContent */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl h-full max-h-[85vh] glass rounded-3xl border-white/10 overflow-hidden flex flex-col shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className={`w-2 h-2 rounded-full ${type === 'prospect' ? 'bg-brand-secondary' : 'bg-emerald-500'}`} />
                                <h2 className="text-2xl font-display font-bold text-white italic">{title}</h2>
                            </div>
                            {subtitle && <p className="text-zinc-500 text-sm">{subtitle}</p>}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                                <Activity size={48} className="animate-spin opacity-20" />
                                <p className="text-sm italic">Accessing neural archives...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column: Core Info */}
                                <div className="space-y-8">
                                    {type === 'prospect' && (
                                        <>
                                            <section>
                                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Network Presence</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                                                        <MapPin size={16} className="text-brand-secondary" />
                                                        <span className="text-sm">{data?.location || 'Unknown Location'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                                                        <Mail size={16} className="text-brand-secondary" />
                                                        <span className="text-sm">{data?.email || 'No Email'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                                                        <ExternalLink size={16} className="text-brand-secondary" />
                                                        <a href={data?.website} target="_blank" rel="noreferrer" className="text-sm hover:text-brand-secondary transition-colors truncate">
                                                            {data?.website}
                                                        </a>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Agent Intelligence</h3>
                                                <div className="p-5 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-white uppercase tracking-tighter">Lead Score</span>
                                                        <span className="text-2xl font-display font-bold text-brand-secondary italic">{data?.lead_score}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-brand-secondary" style={{ width: `${data?.lead_score}%` }} />
                                                    </div>
                                                    <p className="text-xs text-zinc-400 italic leading-relaxed">
                                                        {data?.gap_analysis}
                                                    </p>
                                                </div>
                                            </section>
                                        </>
                                    )}

                                    {type === 'project' && (
                                        <>
                                            <section>
                                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Deployment Status</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] text-zinc-500 uppercase mb-1">Service Type</p>
                                                        <p className="text-sm font-bold text-white">{data?.service_type}</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <p className="text-[10px] text-zinc-500 uppercase mb-1">Deadline</p>
                                                        <p className="text-sm font-bold text-white">{data?.deadline ? new Date(data.deadline).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Project Files</h3>
                                                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center justify-center text-center space-y-3">
                                                    <FileText size={32} className="text-emerald-500 opacity-50" />
                                                    <p className="text-xs text-zinc-500 italic">No files have been delivered yet. Agent 3 is monitoring development.</p>
                                                </div>
                                            </section>
                                        </>
                                    )}
                                </div>

                                {/* Right Column: Activity / History */}
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Neural Log (Agent Activity)</h3>
                                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {data?.messages?.map((m: any, i: number) => (
                                                <div key={i} className={`flex gap-4 ${m.sender === 'agent' ? 'flex-row' : 'flex-row-reverse'}`}>
                                                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${m.sender === 'agent' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/10 text-zinc-400'}`}>
                                                        {m.sender === 'agent' ? <Zap size={14} /> : <MessageSquare size={14} />}
                                                    </div>
                                                    <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${m.sender === 'agent' ? 'bg-brand-primary/5 border border-brand-primary/10 text-zinc-300' : 'bg-white/5 border border-white/5 text-zinc-400'}`}>
                                                        {m.content}
                                                        <div className="mt-2 text-[8px] opacity-50 font-mono">
                                                            {new Date(m.created_at).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!data?.messages || data.messages.length === 0) && (
                                                <div className="p-8 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-600">
                                                    <Clock size={24} className="mb-2 opacity-20" />
                                                    <p className="text-[10px] uppercase font-bold tracking-widest">No activity recorded</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
