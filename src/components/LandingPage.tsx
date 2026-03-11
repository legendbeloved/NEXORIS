import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Zap, 
  Search, 
  Send, 
  TrendingUp, 
  ChevronRight, 
  Play, 
  Check, 
  Star, 
  Menu, 
  X, 
  Github, 
  Twitter, 
  Linkedin,
  Activity,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

// --- Components ---

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Navbar = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', type: 'hash', value: 'services' },
    { name: 'Case Studies', type: 'hash', value: 'case-studies' },
    { name: 'Features', type: 'hash', value: 'features' },
    { name: 'How It Works', type: 'hash', value: 'how-it-works' },
    { name: 'Pricing', type: 'hash', value: 'pricing' },
    { name: 'FAQ', type: 'hash', value: 'faq' },
  ];

  const handleNavigation = (type: 'hash' | 'path', value: string) => {
    if (type === 'hash') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => scrollToSection(value), 50);
        return;
      }
      scrollToSection(value);
    } else {
      navigate(value);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'py-4 glass' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(91,76,245,0.3)] group-hover:scale-110 transition-transform">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <span className="text-2xl font-display font-bold tracking-tighter uppercase italic">NEXORIS</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => handleNavigation(link.type as any, link.value)}
              className="text-sm font-medium text-zinc-400 hover:text-brand-secondary transition-colors"
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2">
            Sign In
          </button>
          <button 
            onClick={onGetStarted}
            className="px-6 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-primary/90 transition-all shadow-[0_0_20px_rgba(91,76,245,0.2)]"
          >
            Get Started
          </button>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-t border-white/10 p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => { 
                    handleNavigation(link.type as any, link.value); 
                    setIsMobileMenuOpen(false);
                  }} 
                  className="text-left text-lg font-medium text-zinc-400 hover:text-brand-secondary transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <hr className="border-white/10 my-2" />
              <button 
                onClick={() => { 
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }} 
                className="text-left text-lg font-medium text-zinc-400"
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onGetStarted();
                }}
                className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [contactedCount, setContactedCount] = useState(1429);
  const cardRef = useRef<HTMLDivElement>(null);
  const heroOrbs = React.useMemo(
    () => [
      { top: '10%', left: '8%', size: 220, color: 'bg-brand-primary/15', blur: 'blur-[60px]', drift: 24, duration: 14 },
      { top: '22%', left: '78%', size: 260, color: 'bg-brand-secondary/12', blur: 'blur-[70px]', drift: 30, duration: 18 },
      { top: '62%', left: '12%', size: 180, color: 'bg-brand-accent/10', blur: 'blur-[55px]', drift: 22, duration: 16 },
      { top: '72%', left: '70%', size: 240, color: 'bg-brand-primary/10', blur: 'blur-[75px]', drift: 26, duration: 20 },
      { top: '45%', left: '45%', size: 320, color: 'bg-brand-secondary/10', blur: 'blur-[90px]', drift: 18, duration: 22 },
    ],
    [],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const interval = setInterval(() => {
      setContactedCount(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const calculateTilt = () => {
    if (!cardRef.current) return '';
    const rect = cardRef.current.getBoundingClientRect();
    const x = (mousePos.x - rect.left) / rect.width - 0.5;
    const y = (mousePos.y - rect.top) / rect.height - 0.5;
    return `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden aurora-bg">
      {/* Grain Overlay */}
      <div className="absolute inset-0 grain opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 liquid-gradient-shift opacity-40 pointer-events-none" />
      
      {/* Custom Cursor Glow */}
      <motion.div 
        className="fixed w-64 h-64 bg-brand-primary/20 rounded-full blur-[80px] pointer-events-none z-0 hidden md:block"
        animate={{ x: mousePos.x - 128, y: mousePos.y - 128 }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
      />

      <div className="absolute inset-0 pointer-events-none">
        {heroOrbs.map((o, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${o.color} ${o.blur}`}
            style={{ width: o.size, height: o.size, top: o.top as any, left: o.left as any }}
            animate={{ y: [0, -o.drift, 0], x: [0, o.drift / 2, 0] }}
            transition={{ duration: o.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold tracking-wider uppercase">
            <Activity size={14} className="animate-pulse" />
            AI-Powered Client Acquisition
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold leading-[0.9] tracking-tighter text-white italic">
            Your <span className="text-brand-secondary">business</span><br />
            <span className="text-gradient">running itself.</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-lg leading-relaxed">
            Three intelligent agents find, pitch, and close clients 24/7 while you focus on your craft. Scale without the burnout.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(91,76,245,0.3)] flex items-center justify-center gap-2 group"
            >
              Start Free
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
            >
              View Services
            </button>
          </div>
          <div>
            <button
              onClick={() => scrollToSection('case-studies')}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-brand-secondary transition-colors"
            >
              Browse Case Studies →
            </button>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-bg bg-zinc-800 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="text-white font-bold block">
                <motion.span key={contactedCount}>{contactedCount.toLocaleString()}</motion.span> businesses
              </span>
              <span className="text-zinc-500 flex items-center gap-2">
                <span className="relative inline-flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-secondary"></span>
                </span>
                contacted today autonomously
              </span>
            </div>
          </div>
          
          <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            No credit card required · Set up in 15 minutes
          </div>

          <div className="pt-8 hidden xl:block">
            <LiveFeed />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="perspective-1000 float"
        >
          <div 
            ref={cardRef}
            style={{ transform: calculateTilt(), transition: 'transform 0.1s ease-out' }}
            className="relative glass dashboard-preview rounded-[32px] p-8 shadow-[0_0_100px_rgba(0,0,0,0.5)] border-white/20"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                System Live
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Discovery Agent</span>
                  <span className="text-[10px] text-brand-secondary">Scanning...</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-brand-secondary"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20">
                  <div className="text-2xl font-display font-bold text-white">$4,250</div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Revenue Generated</div>
                </div>
                <div className="p-4 rounded-2xl bg-brand-secondary/10 border border-brand-secondary/20">
                  <div className="text-2xl font-display font-bold text-white">12</div>
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">Meetings Booked</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white italic">Negotiation Agent</div>
                    <div className="text-[10px] text-zinc-500">Closing deal with "Pixel Studio"</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AgentCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  delay,
  children 
}: { 
  icon: any, 
  title: string, 
  description: string, 
  color: string, 
  delay: number,
  children?: React.ReactNode
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
      <div className="relative glass rounded-[32px] p-8 h-full flex flex-col border-white/5 hover:border-white/20 transition-colors">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg`} style={{ backgroundColor: `${color}20`, color: color }}>
          <Icon size={28} />
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-4 italic">{title}</h3>
        <p className="text-zinc-400 mb-8 leading-relaxed">{description}</p>
        <div className="mt-auto">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

const AgentShowcase = () => {
  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter italic">
            Three agents. <span className="text-brand-primary">One unstoppable pipeline.</span>
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            NEXORIS deploys a specialized squad of AI agents that handle the entire sales cycle autonomously.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {/* Connection Lines (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px z-0 pointer-events-none -translate-y-1/2">
            <svg className="w-full h-20 overflow-visible opacity-30">
              <motion.path
                d="M 0 40 Q 200 0, 400 40 T 800 40 T 1200 40"
                fill="none"
                stroke="url(#line-gradient)"
                strokeWidth="2"
                strokeDasharray="10 10"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#5B4CF5" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <AgentCard 
            icon={Search} 
            title="Discovery Agent" 
            description="Scans the web, social media, and local directories to find businesses with critical digital gaps." 
            color="#00D4FF"
            delay={0.1}
          >
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.2, repeat: Infinity, repeatDelay: 3 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-[10px] font-mono"
                >
                  <span className="text-zinc-500">SCANNING: Local_Bakery_{i}</span>
                  <span className="text-brand-secondary">GAP_FOUND</span>
                </motion.div>
              ))}
            </div>
          </AgentCard>

          <AgentCard 
            icon={Send} 
            title="Outreach Agent" 
            description="Crafts hyper-personalized pitches that address the specific pain points found during discovery." 
            color="#5B4CF5"
            delay={0.3}
          >
            <div className="p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10 text-[10px] font-mono text-zinc-400">
              <div className="text-brand-primary mb-1">TO: owner@bakery.com</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                "I noticed your booking system is offline. We can fix this in 48 hours..."
              </motion.div>
            </div>
          </AgentCard>

          <AgentCard 
            icon={TrendingUp} 
            title="Negotiation Agent" 
            description="Handles objections, discusses pricing within your guardrails, and books the final meeting." 
            color="#F59E0B"
            delay={0.5}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-brand-accent/10 border border-brand-accent/20">
                <span className="text-[10px] font-bold text-brand-accent uppercase italic">Proposal Sent</span>
                <span className="text-[10px] text-white">$1,200.00</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold">
                <Check size={12} />
                DEAL_CLOSED: Meeting Booked for Tuesday
              </div>
            </div>
          </AgentCard>
        </div>
      </div>
    </section>
  );
};

const FeatureHighlights = () => {
  const items = [
    { icon: Search, title: 'Prospect Discovery', desc: 'Find high-quality leads with real gap analysis.' },
    { icon: Send, title: 'Personalized Outreach', desc: 'Tailored emails with data-backed insights.' },
    { icon: TrendingUp, title: 'Negotiation Engine', desc: 'Close deals within price guardrails.' },
    { icon: Activity, title: 'Live Activity Feed', desc: 'See agent actions as they happen.' },
    { icon: Zap, title: 'Automation Guardrails', desc: 'Stay in control with safe boundaries.' },
    { icon: ShieldCheck, title: 'Compliance & Deliverability', desc: 'Respect legal and email best practices.' },
  ];
  return (
    <section id="services" className="py-24 px-6 bg-brand-bg/60">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="glass rounded-3xl p-6 border-white/10 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-secondary mb-4">
                <item.icon size={20} />
              </div>
              <div className="text-white font-display font-bold text-lg mb-2 italic">{item.title}</div>
              <div className="text-zinc-400 text-sm">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const UniqueFeatures = () => {
  const [metrics, setMetrics] = useState({ leads: 120, openRate: 48, deals: 7 });
  useEffect(() => {
    const id = setInterval(() => {
      setMetrics(m => ({
        leads: m.leads + Math.floor(Math.random() * 3),
        openRate: Math.min(85, m.openRate + (Math.random() > 0.7 ? 1 : 0)),
        deals: m.deals + (Math.random() > 0.8 ? 1 : 0),
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);
  const cards = [
    { icon: Search, title: 'Adaptive Discovery', desc: 'Learns which niches convert and focuses there.' },
    { icon: Send, title: 'A/B Outreach', desc: 'Tests variants and auto-selects winners.' },
    { icon: TrendingUp, title: 'Guardrail Negotiation', desc: 'Never drops below your minimums.' },
    { icon: Activity, title: 'Realtime Visibility', desc: 'See actions as they happen, intervene anytime.' },
    { icon: ShieldCheck, title: 'Deliverability First', desc: 'Warm domains, compliant templates, safe pacing.' },
    { icon: Zap, title: 'One-Click Scale', desc: 'Turn up volume without losing quality.' },
  ];
  return (
    <section id="unique-features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="glass rounded-3xl p-6 border-white/10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Leads processed</div>
            <div className="text-4xl font-display font-extrabold italic">{metrics.leads}</div>
          </div>
          <div className="glass rounded-3xl p-6 border-white/10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Average open rate</div>
            <div className="text-4xl font-display font-extrabold italic">{metrics.openRate}%</div>
          </div>
          <div className="glass rounded-3xl p-6 border-white/10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Deals closed</div>
            <div className="text-4xl font-display font-extrabold italic">{metrics.deals}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-3xl p-6 border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-primary mb-4">
                <c.icon size={20} />
              </div>
              <div className="text-white font-display font-bold text-lg mb-1 italic">{c.title}</div>
              <div className="text-zinc-400 text-sm">{c.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { 
      title: 'Define Your Niche', 
      detail: 'Tell NEXORIS who your ideal client is and what problems you solve.', 
      visual: (
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-brand-primary/20 border border-brand-primary/40" />
          <div className="w-4 h-4 rounded bg-brand-primary/40 border border-brand-primary/60" />
          <div className="w-4 h-4 rounded bg-brand-primary/20 border border-brand-primary/40" />
        </div>
      )
    },
    { 
      title: 'Set Your Guardrails', 
      detail: 'Define your minimum project price and maximum negotiation range.', 
      visual: (
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-brand-accent" />
        </div>
      )
    },
    { 
      title: 'Agents Deploy', 
      detail: 'The trio begins scanning, pitching, and negotiating in the background.', 
      visual: (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-secondary animate-ping" />
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping delay-75" />
          <div className="w-2 h-2 rounded-full bg-brand-accent animate-ping delay-150" />
        </div>
      )
    },
    { 
      title: 'Review & Approve', 
      detail: 'Monitor the live feed and jump in only when a deal is ready for signature.', 
      visual: <Check size={14} className="text-emerald-500" />
    },
    { 
      title: 'Scale Effortlessly', 
      detail: 'Watch your pipeline grow while you focus on delivering high-quality work.', 
      visual: <TrendingUp size={14} className="text-brand-secondary" />
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 bg-brand-bg/50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter italic mb-4">Setup in 15 minutes</h2>
          <p className="text-zinc-500">The fastest path from zero to a working pipeline.</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-primary via-brand-secondary to-brand-accent opacity-30" />
          
          <div className="space-y-16">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-12 items-start"
              >
                <div className="relative z-10 w-16 h-16 rounded-2xl glass flex items-center justify-center text-2xl font-display font-bold text-white italic shrink-0 group hover:scale-110 transition-transform">
                  <div className="absolute inset-0 bg-brand-primary/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">{i + 1}</span>
                </div>
                <div className="pt-2">
                  <h3 className="text-2xl font-bold text-white mb-2 font-display italic">{step.title}</h3>
                  <p className="text-zinc-400 mb-4 leading-relaxed">{step.detail}</p>
                  <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-500 uppercase">
                    {step.visual}
                    <span className="tracking-widest">Status: Ready</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SocialProof = () => {
  const testimonials = [
    { name: 'Alex Rivera', role: 'Agency Owner', quote: 'NEXORIS booked 4 meetings in my first week. I haven\'t touched my email since.', rating: 5 },
    { name: 'Sarah Chen', role: 'Freelance Dev', quote: 'The discovery agent found gaps I would have never seen. It\'s like having a full sales team.', rating: 5 },
    { name: 'Marcus Thorne', role: 'SaaS Founder', quote: 'The negotiation agent is surprisingly human. It closed a $2k deal while I was asleep.', rating: 5 },
    { name: 'Elena Vance', role: 'Consultant', quote: 'Finally, an AI tool that actually delivers ROI instead of just hype.', rating: 5 },
    { name: 'David Kim', role: 'Studio Lead', quote: 'The command center gives me total visibility. Best investment this year.', rating: 5 },
  ];

  return (
    <section id="case-studies" className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-4">Social Proof</p>
          <h2 className="text-3xl font-display font-bold italic">Trusted by 500+ solo operators and agencies</h2>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x">
          {testimonials.map((t, i) => (
            <div key={i} className="min-w-[280px] sm:min-w-[350px] glass p-8 rounded-[32px] snap-center space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden">
                  <img src={`https://picsum.photos/seed/test${i}/100/100`} alt={t.name} referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
              </div>
              <p className="text-zinc-300 italic">"{t.quote}"</p>
              <div className="flex gap-1 text-brand-accent">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Demo = () => {
  return (
    <section id="demo" className="py-32 px-6 bg-brand-bg/40">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <p className="text-brand-primary font-bold uppercase tracking-widest text-xs">Live Demo</p>
          <h2 className="text-4xl font-display font-extrabold tracking-tighter italic">See the command center in action</h2>
          <p className="text-zinc-400 text-lg">Watch how agents discover prospects, send personalized outreach, and guide clients to payment — all visible in real time.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => scrollToSection('pricing')} className="px-6 py-3 rounded-2xl bg-brand-primary text-white font-bold">Start Free</button>
            <button onClick={() => scrollToSection('features')} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold">Explore Features</button>
          </div>
        </div>
        <div className="aspect-video rounded-3xl overflow-hidden glass border-white/10 relative">
          <iframe 
            title="NEXORIS Demo"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
          <div className="absolute bottom-4 right-4 glass rounded-2xl px-4 py-3 text-xs text-zinc-200 border-white/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[9px] uppercase tracking-widest text-zinc-400">Agents Online</div>
                <div className="text-lg font-display font-bold italic text-emerald-400">3 / 3</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-zinc-400">Pipeline Value</div>
                <div className="text-lg font-display font-bold italic text-brand-secondary">$18,400</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

 

const FAQ = () => {
  const faqs = [
    { q: 'How quickly can I start?', a: 'Most users are live within 15 minutes using the guided setup.' },
    { q: 'Is my email deliverability protected?', a: 'Yes. We use compliant templates, warm domains, and pacing guardrails.' },
    { q: 'Can I control pricing during negotiation?', a: 'Absolutely. Set min/max guardrails and escalation rules in settings.' },
    { q: 'Do you support A/B testing?', a: 'Yes. Toggle A/B mode to generate multiple outreach variants.' },
  ];
  return (
    <section id="faq" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-brand-primary font-bold uppercase tracking-widest text-xs">FAQ</p>
          <h2 className="text-3xl font-display font-extrabold italic tracking-tighter">Answers to common questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 border-white/10">
              <div className="text-white font-display font-bold italic">{f.q}</div>
              <div className="text-zinc-400 mt-2">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    { 
      name: 'Starter', 
      price: 0, 
      desc: 'Perfect for testing the waters.', 
      features: ['50 prospects/mo', 'Discovery Agent only', 'Basic analytics', 'Community support'] 
    },
    { 
      name: 'Growth', 
      price: isAnnual ? 39 : 49, 
      desc: 'The complete autonomous engine.', 
      features: ['500 prospects/mo', 'All 3 Agents active', 'Advanced analytics', 'Priority support', 'Custom guardrails'],
      popular: true 
    },
    { 
      name: 'Agency', 
      price: isAnnual ? 119 : 149, 
      desc: 'Scale without limits.', 
      features: ['Unlimited prospects', 'White-label reports', 'API Access', 'Dedicated account manager', 'Custom agent training'] 
    },
  ];

  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter italic">Simple, scale-ready pricing</h2>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-zinc-800 relative p-1 transition-colors"
            >
              <motion.div 
                animate={{ x: isAnnual ? 24 : 0 }}
                className="w-4 h-4 rounded-full bg-brand-primary" 
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-zinc-500'}`}>
              Annual <span className="text-brand-secondary text-[10px] font-bold uppercase ml-1">20% OFF</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={`relative glass p-8 rounded-[32px] flex flex-col border-white/5 ${tier.popular ? 'border-brand-primary/50 shadow-[0_0_40px_rgba(91,76,245,0.1)]' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-zinc-500 text-sm">{tier.desc}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-display font-extrabold text-white">${tier.price}</span>
                <span className="text-zinc-500 text-sm">/mo</span>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-zinc-400">
                    <Check size={16} className="text-brand-secondary" />
                    {f}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold transition-all ${tier.popular ? 'bg-brand-primary text-white hover:scale-105' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const dots = React.useMemo(
    () => [
      { top: '18%', left: '12%', size: 6, opacity: 0.25, delay: 0 },
      { top: '30%', left: '78%', size: 5, opacity: 0.18, delay: 0.2 },
      { top: '55%', left: '86%', size: 7, opacity: 0.22, delay: 0.4 },
      { top: '72%', left: '20%', size: 5, opacity: 0.16, delay: 0.1 },
      { top: '82%', left: '66%', size: 6, opacity: 0.2, delay: 0.3 },
      { top: '40%', left: '44%', size: 4, opacity: 0.14, delay: 0.15 },
      { top: '64%', left: '10%', size: 7, opacity: 0.2, delay: 0.25 },
      { top: '24%', left: '56%', size: 5, opacity: 0.16, delay: 0.35 },
      { top: '58%', left: '30%', size: 6, opacity: 0.18, delay: 0.45 },
      { top: '12%', left: '88%', size: 4, opacity: 0.14, delay: 0.05 },
    ],
    [],
  );

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        {dots.map((d, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ width: d.size, height: d.size, top: d.top as any, left: d.left as any, opacity: d.opacity }}
            animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
            transition={{ duration: 10 + i, repeat: Infinity, ease: 'easeInOut', delay: d.delay }}
          />
        ))}
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter italic leading-tight">
          Your pipeline doesn't<br />
          <span className="text-brand-secondary">have to sleep.</span>
        </h2>
        <p className="text-xl text-zinc-400 max-w-xl mx-auto">
          Join 500+ operators who have automated their growth. Start your autonomous journey today.
        </p>
        <button 
          onClick={onGetStarted}
          className="px-12 py-6 bg-brand-primary text-white text-xl font-bold rounded-2xl hover:scale-105 transition-all shadow-[0_0_60px_rgba(91,76,245,0.4)]"
        >
          Deploy Your Agents Now
        </button>
      </div>
    </section>
  );
};

const Footer = () => {
  const onLink = (id: string) => scrollToSection(id);
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-[#050505]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <Zap className="text-white fill-white" size={16} />
            </div>
            <span className="text-xl font-display font-bold tracking-tighter uppercase italic">NEXORIS</span>
          </div>
          <p className="text-zinc-500 max-w-sm">
            The world's first fully autonomous multi-agent client acquisition system for modern agencies and solo operators.
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-xl glass flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <Twitter size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl glass flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <Linkedin size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl glass flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <Github size={18} />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li><button type="button" onClick={() => onLink('features')} className="hover:text-brand-secondary transition-colors">Features</button></li>
            <li><button type="button" onClick={() => onLink('how-it-works')} className="hover:text-brand-secondary transition-colors">How It Works</button></li>
            <li><button type="button" onClick={() => onLink('pricing')} className="hover:text-brand-secondary transition-colors">Pricing</button></li>
            <li><button type="button" onClick={() => onLink('faq')} className="hover:text-brand-secondary transition-colors">FAQ</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
        <p>© 2026 NEXORIS AI. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-zinc-400">Terms of Service</a>
          <a href="#" className="hover:text-zinc-400">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

const LiveFeed = () => {
  const [activities, setActivities] = useState([
    { id: 1, agent: 'Discovery', msg: 'Found high-value gap: Elite Plumbing', time: 'Just now' },
    { id: 2, agent: 'Outreach', msg: 'Sent personalized pitch to Downtown Dental', time: '2m ago' },
    { id: 3, agent: 'Negotiation', msg: 'Closed deal: $1,200 with Joe\'s Pizza', time: '5m ago' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const agents = ['Discovery', 'Outreach', 'Negotiation'];
      const actions = [
        'Analyzed digital presence for',
        'Sent hyper-personalized email to',
        'Booked strategy call with',
        'Negotiating project scope with',
        'Generated custom mockup for'
      ];
      const businesses = ['Green Garden', 'The Coffee Nook', 'Tech Solutions', 'Blue Sky Agency', 'Local Market'];
      
      const newActivity = {
        id: Date.now(),
        agent: agents[Math.floor(Math.random() * agents.length)],
        msg: `${actions[Math.floor(Math.random() * actions.length)]} "${businesses[Math.floor(Math.random() * businesses.length)]}"`,
        time: 'Just now'
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass p-6 rounded-3xl border-white/10 space-y-4 max-w-sm w-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Live Mission Feed</h4>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse" />
          <span className="text-[9px] font-bold text-brand-secondary uppercase">Active</span>
        </div>
      </div>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {activities.map((act) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                <Zap size={14} fill="currentColor" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white mb-0.5 italic">Agent: {act.agent}</p>
                <p className="text-[11px] text-zinc-400 truncate">{act.msg}</p>
              </div>
              <span className="text-[9px] text-zinc-600 font-mono ml-auto shrink-0">{act.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function LandingPage({ 
  onEnterApp,
  initialSection
}: { 
  onEnterApp: () => void,
  initialSection?: string
}) {
  useEffect(() => {
    if (initialSection) {
      const el = document.getElementById(initialSection);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="bg-brand-bg text-zinc-100 selection:bg-brand-primary/30 min-h-screen">
      <Navbar onGetStarted={onEnterApp} />
      <Hero onGetStarted={onEnterApp} />
      <AgentShowcase />
      <FeatureHighlights />
      <UniqueFeatures />
      <HowItWorks />
      <SocialProof />
      <FAQ />
      <Pricing />
      <FinalCTA onGetStarted={onEnterApp} />
      <Footer />
    </div>
  );
}
