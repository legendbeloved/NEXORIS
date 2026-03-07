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
import LandingPage from './components/LandingPage';
import { Sidebar } from './components/dashboard/Sidebar';
import { TopBar } from './components/dashboard/TopBar';
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
import { useNotificationStore } from './store/dashboardStore';
import { ClientPortal } from './components/client/ClientPortal';

const queryClient = new QueryClient();

const DashboardContent: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => fetch('/api/stats').then(res => res.json()),
    refetchInterval: 5000,
  });

  const { data: prospectsData, isLoading: prospectsLoading } = useQuery({
    queryKey: ['prospects'],
    queryFn: () => fetch('/api/prospects').then(res => res.json()),
    refetchInterval: 10000,
  });

  const addNotification = useNotificationStore(state => state.addNotification);

  // Simulate real-time activity
  useEffect(() => {
    const interval = setInterval(() => {
      const activities = [
        { msg: "Discovered a new high-value prospect in Austin, TX.", agentId: 1, agentName: "Discovery Engine", type: 'success' },
        { msg: "Sent a personalized outreach email to 'Elite Plumbing'.", agentId: 2, agentName: "Outreach Intelligence", type: 'info' },
        { msg: "Received a positive reply from 'Joe's Pizza'.", agentId: 3, agentName: "Negotiation & Delivery", type: 'success' },
        { msg: "System optimized outreach variant B for higher click-through rate.", agentId: 2, agentName: "Outreach Intelligence", type: 'warning' },
        { msg: "Analyzed digital gaps for 'Downtown Dental'.", agentId: 1, agentName: "Discovery Engine", type: 'info' },
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

  if (activeTab === 'agents') return <AgentsPage />;
  if (activeTab === 'outreach') return <OutreachPage />;
  if (activeTab === 'projects') return <ProjectsPage />;
  if (activeTab === 'payments') return <PaymentsPage />;
  if (activeTab === 'analytics') return <AnalyticsPage />;
  if (activeTab === 'settings') return <SettingsPage />;
  if (activeTab === 'notifications') return <NotificationsPage />;
  if (activeTab === 'prospects') return <ProspectsTable data={prospectsData?.prospects || []} />;

  if (activeTab !== 'dashboard') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase italic tracking-tighter">Section Under Construction</h2>
          <p className="text-sm">The {activeTab} module is being optimized for mission-critical performance.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Agent Status Section */}
      <section aria-labelledby="agent-status-title">
        <h2 id="agent-status-title" className="sr-only">Agent Status</h2>
        <AgentStatusCards />
      </section>

      {/* KPI Section */}
      <section aria-labelledby="kpi-title">
        <h2 id="kpi-title" className="sr-only">Key Performance Indicators</h2>
        <KPIRow stats={stats || {}} />
      </section>

      {/* Funnel & Activity Section */}
      <section aria-labelledby="funnel-activity-title">
        <h2 id="funnel-activity-title" className="sr-only">Conversion Funnel and Live Activity</h2>
        <SplitRow />
      </section>

      {/* Revenue Section */}
      <section aria-labelledby="revenue-title">
        <h2 id="revenue-title" className="sr-only">Revenue Analytics</h2>
        <RevenueChart />
      </section>

      {/* Prospects Section */}
      <section aria-labelledby="prospects-title">
        <h2 id="prospects-title" className="sr-only">Recent Prospects</h2>
        <ProspectsTable data={prospectsData?.prospects || []} />
      </section>
    </div>
  );
};

const SignInPage: React.FC<{ onSuccess: () => void; goSignup: () => void }> = ({ onSuccess, goSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 700);
  };
  return (
    <div className="min-h-screen bg-brand-bg text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md glass rounded-3xl p-8 border-white/10">
        <h1 className="text-2xl font-display font-bold italic mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-zinc-400">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-2xl bg-brand-primary text-white font-bold">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-xs text-zinc-500">
          Don’t have an account? <button onClick={goSignup} className="text-brand-secondary underline">Sign Up</button>
        </div>
      </div>
    </div>
  );
};

const SignUpPage: React.FC<{ onSuccess: () => void; goSignin: () => void }> = ({ onSuccess, goSignin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 900);
  };
  return (
    <div className="min-h-screen bg-brand-bg text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md glass rounded-3xl p-8 border-white/10">
        <h1 className="text-2xl font-display font-bold italic mb-6">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} type="text" required className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-zinc-400">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-zinc-400">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-2xl bg-brand-primary text-white font-bold">
            {loading ? 'Creating…' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-xs text-zinc-500">
          Already have an account? <button onClick={goSignin} className="text-brand-secondary underline">Sign In</button>
        </div>
      </div>
    </div>
  );
};

const BYPASS_AUTH = true;

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [portalToken, setPortalToken] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(typeof window !== 'undefined' ? window.location.pathname : '/');
  const [hash, setHash] = useState<string>(typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '');

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/client/')) {
      const token = path.split('/')[2];
      if (token) {
        setPortalToken(token);
        setShowLanding(false);
      }
    } else {
      setCurrentPath(path);
      setHash(window.location.hash.replace('#', ''));
      if (BYPASS_AUTH && (path === '/login' || path === '/signup' || path === '/app')) {
        setShowLanding(false);
      }
    }
    const onPop = () => {
      setCurrentPath(window.location.pathname);
      setHash(window.location.hash.replace('#', ''));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (portalToken) {
    return (
      <QueryClientProvider client={queryClient}>
        <ClientPortal token={portalToken} />
      </QueryClientProvider>
    );
  }

  if (!BYPASS_AUTH && currentPath === '/login') {
    return (
      <QueryClientProvider client={queryClient}>
        <SignInPage 
          onSuccess={() => {
            setShowLanding(false);
            history.pushState({}, '', '/app');
          }}
          goSignup={() => { history.pushState({}, '', '/signup'); setCurrentPath('/signup'); }}
        />
      </QueryClientProvider>
    );
  }

  if (!BYPASS_AUTH && currentPath === '/signup') {
    return (
      <QueryClientProvider client={queryClient}>
        <SignUpPage 
          onSuccess={() => {
            setShowLanding(false);
            history.pushState({}, '', '/app');
          }}
          goSignin={() => { history.pushState({}, '', '/login'); setCurrentPath('/login'); }}
        />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-brand-bg text-zinc-300 font-body selection:bg-brand-primary/30 selection:text-white overflow-x-hidden">
        <AnimatePresence mode="wait">
          {showLanding ? (
            <motion.div
              key="landing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-[100] overflow-y-auto"
            >
              <LandingPage 
                onEnterApp={() => setShowLanding(false)} 
                initialSection={
                  currentPath === '/how-it-works' ? 'how-it-works' :
                  currentPath === '/pricing' ? 'pricing' :
                  currentPath === '/demo' ? 'demo' :
                  currentPath === '/faq' ? 'faq' :
                  hash ? hash : undefined
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-screen"
            >
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }} 
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileMenuOpen}
                setIsMobileOpen={setIsMobileMenuOpen}
                onLogout={() => setShowLanding(true)}
              />
              
              <main className={`flex-grow transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-[240px]'} ml-0`}>
                <TopBar 
                  activeTab={activeTab} 
                  onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                
                <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DashboardContent activeTab={activeTab} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Aurora Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;
