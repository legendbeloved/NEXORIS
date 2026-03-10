import React, { useState, useEffect } from 'react';
import {
  AnimatePresence,
  motion
} from 'motion/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import { Sidebar } from './components/dashboard/Sidebar';
import { TopBar } from './components/dashboard/TopBar';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { AgentStatusCards } from './components/dashboard/AgentStatusCards';
import { KPIRow } from './components/dashboard/KPIRow';
import { SplitRow } from './components/dashboard/SplitRow';
import { RevenueChart } from './components/dashboard/RevenueChart';
import { ProspectsTable } from './components/dashboard/ProspectsTable';
import { AgentsPage } from './components/dashboard/AgentsPage';
import { OutreachPage } from './components/dashboard/OutreachPage';
import { ProjectsPage } from './components/dashboard/ProjectsPage';
import { PaymentsPage } from './components/dashboard/PaymentsPage';
import { AnalyticsPage } from './components/dashboard/AnalyticsPage';
import { SettingsPage } from './components/dashboard/SettingsPage';
import { NotificationsPage } from './components/dashboard/NotificationsPage';
import { ProfilePage } from './components/dashboard/ProfilePage';
import { TeamPage } from './components/dashboard/TeamPage';
import { SubscriptionPage } from './components/dashboard/SubscriptionPage';
import { HelpPage } from './components/dashboard/HelpPage';
import { NotFoundPage } from './components/NotFoundPage';
import { useNotificationStore as useLegacyNotificationStore } from './store/dashboardStore';
import { useNotificationStore } from './store/notificationStore';
import { ClientPortal } from './components/client/ClientPortal';
import { SignInPage } from './components/auth/SignInPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { EmailVerification } from './components/auth/EmailVerification';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ThemeProvider } from './components/ThemeProvider';
import { OnboardingTour } from './components/onboarding/OnboardingTour';

const queryClient = new QueryClient();

const DashboardHome: React.FC = () => {
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

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract active tab from path (e.g. /app/agents -> agents)
  const activeTab = location.pathname.split('/')[2] || 'dashboard';

  const addNotification = useLegacyNotificationStore(state => state.addNotification);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  // Simulate real-time activity
  useEffect(() => {
    const interval = setInterval(() => {
      const activities = [
        { msg: "Discovered a new high-value prospect in Austin, TX.", agentId: 1, agentName: "Discovery Agent", type: 'success' },
        { msg: "Sent a personalized outreach email to 'Elite Plumbing'.", agentId: 2, agentName: "Outreach Agent", type: 'info' },
        { msg: "Received a positive reply from 'Joe's Pizza'.", agentId: 3, agentName: "Negotiation Agent", type: 'success' },
        { msg: "System optimized outreach variant B for higher click-through rate.", agentId: 2, agentName: "Outreach Agent", type: 'warning' },
        { msg: "Analyzed digital gaps for 'Downtown Dental'.", agentId: 1, agentName: "Discovery Agent", type: 'info' },
      ];
      const activity = activities[Math.floor(Math.random() * activities.length)];

      addNotification({
        message: activity.msg,
        type: activity.type as any,
        agentId: activity.agentId,
        agentName: activity.agentName,
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [addNotification]);

  // Load notifications
  useEffect(() => {
    let t: any;
    const load = async () => {
      try {
        const r = await fetch(`/api/notifications?page=1&limit=20`);
        const j = await r.json();
        if (j?.data?.notifications) setNotifications(j.data.notifications);
        if (typeof j?.data?.unread_count === "number") setUnreadCount(j.data.unread_count);
      } catch { }
    };
    const poll = async () => {
      try {
        const r = await fetch(`/api/notifications/unread-count`);
        const j = await r.json();
        if (typeof j?.count === "number") setUnreadCount(j.count);
      } catch { }
      t = setTimeout(poll, 30000);
    };
    load();
    poll();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-screen bg-brand-bg text-zinc-300 font-body selection:bg-brand-primary/30 selection:text-white overflow-x-hidden">
      <OnboardingTour />
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          navigate(tab === 'dashboard' ? '/app' : `/app/${tab}`);
          setIsMobileMenuOpen(false);
        }}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        onLogout={() => navigate('/')}
      />

      <main className={`flex-grow transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-[240px]'} ml-0`}>
        <TopBar
          activeTab={activeTab}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <NotificationCenter />

        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route index element={<DashboardHome />} />
                <Route path="agents" element={<AgentsPage />} />
                <Route path="prospects" element={<ProspectsContainer />} />
                <Route path="outreach" element={<OutreachPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="analytics" element={<AnalyticsContainer />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="subscription" element={<SubscriptionPage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Aurora Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

// Wrapper components to fetch data needed by pages
const ProspectsContainer = () => {
  const { data } = useQuery({
    queryKey: ['prospects'],
    queryFn: () => fetch('/api/prospects').then(res => res.json()),
  });
  return <ProspectsTable data={data?.prospects || []} />;
};

const AnalyticsContainer = () => {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetch('/api/stats').then(res => res.json()),
  });
  const { data: prospects } = useQuery({
    queryKey: ['prospects'],
    queryFn: () => fetch('/api/prospects').then(res => res.json()),
  });
  return <AnalyticsPage stats={stats || {}} prospects={prospects?.prospects || []} />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingWrapper />} />
      <Route path="/login" element={<SignInWrapper />} />
      <Route path="/signup" element={<SignUpWrapper />} />
      <Route path="/verify-email" element={<VerifyWrapper />} />
      <Route path="/forgot-password" element={<ForgotWrapper />} />
      <Route path="/client/:token" element={<ClientPortalWrapper />} />
      <Route path="/app/*" element={<DashboardLayout />} />
      {/* Fallback for old hash routes or other paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const LandingWrapper = () => {
  const navigate = useNavigate();
  return (
    <LandingPage
      onEnterApp={() => navigate('/login')}
    />
  );
};

const SignInWrapper = () => {
  const navigate = useNavigate();
  return (
    <SignInPage
      onSuccess={() => navigate('/app')}
      goSignup={() => navigate('/signup')}
      goForgotPassword={() => navigate('/forgot-password')}
    />
  );
};

const SignUpWrapper = () => {
  const navigate = useNavigate();
  return (
    <SignUpPage
      onSuccess={() => navigate('/verify-email')}
      goSignin={() => navigate('/login')}
    />
  );
};

const VerifyWrapper = () => {
  const navigate = useNavigate();
  return (
    <EmailVerification
      email="user@example.com"
      onSuccess={() => navigate('/app')}
      onBack={() => navigate('/signup')}
    />
  );
};

const ForgotWrapper = () => {
  const navigate = useNavigate();
  return (
    <ForgotPassword
      onBack={() => navigate('/login')}
    />
  );
};

const ClientPortalWrapper = () => {
  const { token } = React.useMemo(() => {
    const path = window.location.pathname;
    return { token: path.split('/')[2] };
  }, []);

  if (!token) return <Navigate to="/" />;
  return <ClientPortal token={token} />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
