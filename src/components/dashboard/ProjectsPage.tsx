import React from 'react';
import { motion } from 'motion/react';
import { Layers, Clock, CheckCircle2, AlertCircle, ChevronRight, MessageSquare, Download, Calendar } from 'lucide-react';

interface Project {
  id: number;
  client: string;
  name: string;
  status: 'In Progress' | 'Review' | 'Completed' | 'Delayed';
  progress: number;
  dueDate: string;
  agent: string;
}

const projects: Project[] = [
  { id: 1, client: 'Elite Plumbing', name: 'Digital Transformation', status: 'In Progress', progress: 65, dueDate: '2026-03-12', agent: 'Agent 3' },
  { id: 2, client: 'Downtown Dental', name: 'Automated Booking System', status: 'Review', progress: 90, dueDate: '2026-03-08', agent: 'Agent 3' },
  { id: 3, client: 'Joe\'s Pizza', name: 'Performance Optimization', status: 'Completed', progress: 100, dueDate: '2026-03-01', agent: 'Agent 3' },
  { id: 4, client: 'Green Garden', name: 'Full Stack Rebuild', status: 'Delayed', progress: 30, dueDate: '2026-03-20', agent: 'Agent 3' },
];

export const ProjectsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white italic tracking-tight">Active Projects</h1>
          <p className="text-zinc-500 mt-1 text-sm">Monitor delivery status and client satisfaction.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-bg bg-zinc-800 overflow-hidden">
                <img src={`https://picsum.photos/seed/agent${i}/100/100`} alt="Agent" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">3 Agents Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-3xl border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Project Info */}
              <div className="lg:w-1/4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    project.status === 'Delayed' ? 'bg-red-500/10 text-red-500' :
                    'bg-brand-primary/10 text-brand-primary'
                  }`}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white truncate">{project.client}</h3>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{project.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                    project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
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
              <div className="flex-grow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Delivery Progress</span>
                  <span className="text-xs font-bold text-white">{project.progress}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    className={`h-full ${
                      project.status === 'Completed' ? 'bg-emerald-500' :
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
              <div className="lg:w-1/4 flex items-center justify-end gap-3">
                <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-zinc-500 hover:text-white transition-all group/btn relative">
                  <MessageSquare size={18} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-brand-bg">2</span>
                </button>
                <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-zinc-500 hover:text-white transition-all">
                  <Download size={18} />
                </button>
                <button className="px-4 py-3 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all flex items-center gap-2">
                  Details
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
