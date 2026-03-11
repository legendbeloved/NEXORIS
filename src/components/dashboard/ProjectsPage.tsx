import React from 'react';
import { motion } from 'motion/react';
import { Folder, Clock, CheckCircle2, AlertCircle, MoreVertical, Plus, Search, Filter, ExternalLink, Calendar, User, MessageSquare, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EntityDetailModal } from './EntityDetailModal';

interface Project {
  id: number;
  client: string;
  name: string;
  status: 'In Progress' | 'Review' | 'Completed' | 'Delayed';
  progress: number;
  dueDate: string;
  agent: string;
}

export const ProjectsPage: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = React.useState<number | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetch('/api/projects').then(res => res.json()),
  });

  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ['project', selectedProjectId],
    queryFn: () => fetch(`/api/projects/${selectedProjectId}`).then(res => res.json()),
    enabled: !!selectedProjectId
  });

  const getStatusColor = (status: string) => {
    // This function body was incomplete in the provided snippet.
    // Assuming it's meant to return a color based on status.
    // For now, returning a placeholder.
    if (status === 'Completed') return 'text-emerald-500';
    if (status === 'Delayed') return 'text-red-500';
    if (status === 'Review') return 'text-brand-accent';
    return 'text-brand-primary';
  };

  const displayProjects = React.useMemo(() => {
    const raw = Array.isArray(projectsData) ? projectsData : (projectsData?.projects || []);
    if (!Array.isArray(raw)) return [];

    const mapStatus = (s: string) => {
      const v = String(s || '').toLowerCase();
      if (v === 'delivered' || v === 'completed') return 'Completed';
      if (v === 'review') return 'Review';
      if (v === 'in_progress' || v === 'in progress') return 'In Progress';
      if (v === 'pending') return 'In Progress';
      return 'In Progress';
    };

    const progressFromStatus = (status: string) => {
      if (status === 'Completed') return 100;
      if (status === 'Review') return 85;
      if (status === 'Delayed') return 55;
      return 45;
    };

    return raw.map((p: any) => {
      const due = p?.deadline ? new Date(p.deadline) : null;
      const isLate = due ? (due.getTime() < Date.now() && String(p.status || '').toLowerCase() !== 'delivered') : false;
      const baseStatus = mapStatus(p?.status);
      const status = isLate ? 'Delayed' : baseStatus;
      const progress = typeof p?.progress === 'number' ? p.progress : progressFromStatus(status);
      const dueDate = due ? due.toLocaleDateString() : '—';
      return {
        ...p,
        client: p?.client || p?.client_name || 'Client',
        name: p?.name || p?.service_type || 'Project',
        status,
        progress,
        dueDate,
      };
    });
  }, [projectsData]);

  const generateProjects = async () => {
    setGenerating(true);
    try {
      await fetch('/api/agents/mission', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      await queryClient.invalidateQueries({ queryKey: ['deals'] });
      await queryClient.invalidateQueries({ queryKey: ['stats'] });
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tight">Active Projects</h1>
          <p className="text-zinc-500 mt-1 text-sm">Monitor delivery status and client satisfaction.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {isLoading && <Loader2 className="animate-spin text-zinc-500" size={16} />}
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-bg bg-zinc-800 overflow-hidden">
                <img src={`https://picsum.photos/seed/agent${i}/100/100`} alt="Agent" referrerPolicy="no-referrer" />
              </div >
            ))}
          </div >
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">3 Agents Active</span>
        </div >
      </div >

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProjects.map((project: any) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-6 rounded-3xl border-white/10 hover:border-brand-primary/30 transition-all group cursor-pointer"
            onClick={() => setSelectedProjectId(project.id)}
          >
            <div className="flex flex-col gap-6">
              {/* Project Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    project.status === 'Delayed' ? 'bg-red-500/10 text-red-500' :
                      'bg-brand-primary/10 text-brand-primary'
                    }`}>
                    <Folder size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white truncate">{project.client}</h3>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{project.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    project.status === 'Delayed' ? 'bg-red-500/10 text-red-500' :
                      project.status === 'Review' ? 'bg-brand-accent/10 text-brand-accent' :
                        'bg-brand-secondary/10 text-brand-secondary'
                    }`}>
                    {project.status}
                  </div>
                  <span className="text-[10px] text-zinc-600 font-mono">ID: NEX-{project.id}042</span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Delivery Progress</span>
                  <span className="text-xs font-bold text-white">{project.progress}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    className={`h-full ${project.status === 'Completed' ? 'bg-emerald-500' :
                      project.status === 'Delayed' ? 'bg-red-500' :
                        'bg-brand-primary'
                      }`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-600 font-mono italic">
                  <span>Started: Feb 12, 2026</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    Due: {project.dueDate}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
                  <MessageSquare size={18} />
                </button>
                <button className="flex-1 sm:flex-none pl-4 pr-3 py-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  View Portal
                  <User size={14} className="text-zinc-500" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!isLoading && displayProjects.length === 0 && (
        <div className="glass p-10 rounded-[32px] border-white/10 text-center">
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Folder size={28} className="text-zinc-500" />
          </div>
          <h3 className="text-xl font-display font-bold text-white italic">No projects yet</h3>
          <p className="text-zinc-500 mt-2 max-w-xl mx-auto">
            Projects appear after the pipeline progresses past outreach and negotiation. Generate a sample run to populate projects automatically.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={generateProjects}
              disabled={generating}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating...' : 'Generate Projects'}
            </button>
            <button
              onClick={() => window.location.href = '/app'}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      <EntityDetailModal
        isOpen={!!selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
        title={detailData?.client_name ? `${detailData.service_type}: ${detailData.client_name}` : 'Project Detail'}
        subtitle={detailData?.status}
        type="project"
        data={detailData}
        loading={isDetailLoading}
      />
    </div>
  );
};
