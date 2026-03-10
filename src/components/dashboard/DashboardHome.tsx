import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgentStatusCards } from './AgentStatusCards';
import { KPIRow } from './KPIRow';
import { SplitRow } from './SplitRow';
import { RevenueChart } from './RevenueChart';
import { ProspectsTable } from './ProspectsTable';

export const DashboardHome: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetch('/api/stats').then(res => res.json()),
    refetchInterval: 5000,
  });

  const { data: prospectsData } = useQuery({
    queryKey: ['prospects'],
    queryFn: () => fetch('/api/prospects').then(res => res.json()),
    refetchInterval: 10000,
  });

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <section aria-labelledby="agent-status-title">
        <h2 id="agent-status-title" className="sr-only">Agent Status</h2>
        <AgentStatusCards />
      </section>

      <section aria-labelledby="kpi-title">
        <h2 id="kpi-title" className="sr-only">Key Performance Indicators</h2>
        <KPIRow stats={stats || {}} />
      </section>

      <section aria-labelledby="funnel-activity-title">
        <h2 id="funnel-activity-title" className="sr-only">Conversion Funnel and Live Activity</h2>
        <SplitRow funnel={stats?.funnel || []} />
      </section>

      <section aria-labelledby="revenue-title">
        <h2 id="revenue-title" className="sr-only">Revenue Analytics</h2>
        <RevenueChart />
      </section>

      <section aria-labelledby="prospects-title" className="overflow-x-auto">
        <h2 id="prospects-title" className="sr-only">Recent Prospects</h2>
        <div className="min-w-[600px] lg:min-w-0">
          <ProspectsTable data={prospectsData?.prospects || []} />
        </div>
      </section>
    </div>
  );
};
