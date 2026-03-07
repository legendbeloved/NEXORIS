<!DOCTYPE html>

<html class="scroll-smooth" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>NEXORIS | Find. Connect. Close. Automatically.</title>
<!-- Fonts: Syne and DM Sans -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..600;1,9..40,400..600&amp;family=Syne:wght@700;800&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Tailwind Configuration -->
<script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            midnight: '#08091A',
            indigo: {
              DEFAULT: '#5B4CF5',
              dark: '#4538C4'
            },
            aqua: '#00D4FF',
            amber: '#F59E0B',
          },
          fontFamily: {
            display: ['Syne', 'sans-serif'],
            body: ['DM Sans', 'sans-serif'],
          },
          animation: {
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'float': 'float 6s ease-in-out infinite',
          },
          keyframes: {
            float: {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
            }
          }
        }
      }
    }
  </script>
<style data-purpose="custom-styling">body {
    background-color: #08091A;
    color: #FFF;
    overflow-x: hidden;
    }
/* Grain Overlay */
.grain-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 50;
    opacity: 0.03;
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuBkiYD21DT6KlaNpTryNAqnmBChWtJQDsSd7z6maqsoyjdAghqzDww7RTM1aG35se34iOZtfkkg_Ml0pMEnUFSBEx1yU-bSr_bBShAbZViJmWRtbLH_K3vSW8EbA3L6Et28VgSfo-z90NOyvUDM-YS8XMzSuNrgZMjnJX-ni4Bog0IyqHCXYl4vaWLdTn6fp49qx0KE91uqdsCB0OzejvYfwKrZ1HabVJ5W3zEfly8pXp_iAUvKJo8aGJkKNxvbu3TF6zx44zn_m0Y)
    }
/* Glass Effect */
.glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    }
/* Aurora Accents */
.aurora-bg {
    position: absolute;
    filter: blur(120px);
    z-index: -1;
    opacity: 0.4;
    border-radius: 50%;
    }
.aurora-indigo {
    background: #5B4CF5;
    width: 40vw;
    height: 40vw;
    top: -10%;
    left: -10%;
    }
.aurora-aqua {
    background: #00D4FF;
    width: 35vw;
    height: 35vw;
    bottom: -5%;
    right: -5%;
    }
/* 3D Tilt Dashboard Mockup */
.dashboard-preview {
    transform: perspective(1000px) rotatex(5deg) rotatey(-15deg);
    transition: transform 0.5s ease;
    }
.dashboard-preview:hover {
    transform: perspective(1000px) rotatex(0deg) rotatey(0deg);
    }
/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
    }
::-webkit-scrollbar-track {
    background: #08091A;
    }
::-webkit-scrollbar-thumb {
    background: #5B4CF5;
    border-radius: 10px;
    }</style>
</head>
<body class="font-body">
<!-- Grainy Overlay for texture -->
<div class="grain-overlay"></div>
<!-- BEGIN: Main Navigation -->
<nav class="fixed top-0 w-full z-40 px-6 py-4 flex items-center justify-between glass-card border-t-0 border-x-0" data-purpose="sticky-navigation">
<div class="flex items-center gap-2">
<div class="w-8 h-8 bg-indigo rounded-lg flex items-center justify-center font-display font-extrabold text-white">N</div>
<span class="font-display font-extrabold text-2xl tracking-tighter">NEXORIS</span>
</div>
<ul class="hidden md:flex gap-8 text-sm font-medium text-gray-400">
<li><a class="hover:text-aqua transition-colors" href="#features">Features</a></li>
<li><a class="hover:text-aqua transition-colors" href="#how-it-works">How It Works</a></li>
<li><a class="hover:text-aqua transition-colors" href="#pricing">Pricing</a></li>
<li><a class="hover:text-aqua transition-colors" href="#demo">Demo</a></li>
</ul>
<div class="flex items-center gap-6">
<a class="text-sm font-medium hover:text-indigo transition-colors" href="/login" aria-label="Sign In">Sign In</a>
<a class="bg-indigo hover:bg-indigo-dark text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-indigo/20" href="/signup" aria-label="Get Started">
        Get Started
      </a>
</div>
</nav>
<!-- END: Main Navigation -->
<!-- BEGIN: Hero Section -->
<header class="relative pt-40 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
<div class="aurora-bg aurora-indigo animate-pulse-slow"></div>
<div class="grid lg:grid-cols-2 gap-12 items-center">
<div data-purpose="hero-text-content">
<span class="inline-block px-4 py-1.5 rounded-full bg-indigo/10 border border-indigo/30 text-indigo font-semibold text-xs uppercase tracking-widest mb-6">
          AI-Powered Client Acquisition
        </span>
<h1 class="font-display font-extrabold text-6xl md:text-8xl leading-[1.1] mb-8 tracking-tight">
          Your business, <br/>
<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo to-aqua">running itself.</span>
</h1>
<p class="text-xl text-gray-400 max-w-lg mb-10 leading-relaxed">
          Three intelligent agents find, pitch, and close clients 24/7 while you focus on your craft. Scale without the burnout.
        </p>
<div class="flex flex-wrap gap-4 mb-12">
<a class="bg-indigo hover:bg-indigo-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1" href="/signup" aria-label="Start Free">
            Start Free
          </a>
<a class="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 font-bold text-lg transition-all flex items-center gap-2" href="/demo" aria-label="Watch Demo">
<svg class="w-5 h-5" fill="currentColor" viewbox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            Watch Demo
          </a>
</div>
<div class="flex items-center gap-3" data-purpose="live-counter">
<span class="flex h-3 w-3 relative">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqua opacity-75"></span>
<span class="relative inline-flex rounded-full h-3 w-3 bg-aqua"></span>
</span>
<span class="text-gray-400 font-medium">
<span class="text-white font-bold" id="counter">1,284</span> businesses contacted today
          </span>
</div>
</div>
<!-- Glass Dashboard Preview -->
<div class="relative hidden lg:block" data-purpose="hero-visual">
<div class="dashboard-preview glass-card rounded-2xl p-4 shadow-2xl animate-float">
<div class="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
<div class="flex gap-2">
<div class="w-3 h-3 rounded-full bg-red-500/50"></div>
<div class="w-3 h-3 rounded-full bg-amber/50"></div>
<div class="w-3 h-3 rounded-full bg-green-500/50"></div>
</div>
<div class="text-xs text-gray-500">nexoris_agent_v3.2.0</div>
</div>
<div class="space-y-4">
<div class="h-8 bg-white/5 rounded w-full"></div>
<div class="grid grid-cols-3 gap-4">
<div class="h-24 bg-indigo/20 border border-indigo/30 rounded-xl"></div>
<div class="h-24 bg-aqua/20 border border-aqua/30 rounded-xl"></div>
<div class="h-24 bg-amber/20 border border-amber/30 rounded-xl"></div>
</div>
<div class="h-32 bg-white/5 rounded w-full"></div>
</div>
</div>
<!-- Decorative Glow -->
<div class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo filter blur-3xl opacity-20"></div>
</div>
</div>
</header>
<!-- END: Hero Section -->
<!-- BEGIN: Agent Showcase -->
<section class="py-24 px-6 max-w-7xl mx-auto relative" id="features">
<div class="text-center mb-16">
<h2 class="font-display font-extrabold text-4xl md:text-5xl mb-4">Three agents. One unstoppable pipeline.</h2>
<p class="text-gray-400 max-w-2xl mx-auto">Our specialized AI agents work in tandem, passing prospects through the funnel with military precision.</p>
</div>
<div class="grid md:grid-cols-3 gap-8 relative">
<!-- Animated Connection Line (Visual Decoration) -->
<div class="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0"></div>
<!-- Agent 1: Discovery -->
<div class="glass-card p-8 rounded-3xl relative z-10 group hover:border-indigo transition-colors" data-purpose="agent-card">
<div class="w-14 h-14 bg-indigo/20 border border-indigo/40 rounded-2xl flex items-center justify-center mb-6 text-indigo text-2xl group-hover:scale-110 transition-transform">
          🔍
        </div>
<h3 class="font-display font-bold text-2xl mb-4">Discovery Agent</h3>
<p class="text-gray-400 mb-6 leading-relaxed">Scans the web, social media, and local directories to find high-quality prospects based on real digital signals.</p>
<ul class="space-y-3 text-sm text-gray-500">
<li class="flex items-center gap-2">✓ Verified Email Discovery</li>
<li class="flex items-center gap-2">✓ Tech Stack Identification</li>
<li class="flex items-center gap-2">✓ Lead Scoring (0-100)</li>
</ul>
</div>
<!-- Agent 2: Outreach -->
<div class="glass-card p-8 rounded-3xl relative z-10 group hover:border-aqua transition-colors" data-purpose="agent-card">
<div class="w-14 h-14 bg-aqua/20 border border-aqua/40 rounded-2xl flex items-center justify-center mb-6 text-aqua text-2xl group-hover:scale-110 transition-transform">
          ✉️
        </div>
<h3 class="font-display font-bold text-2xl mb-4">Outreach Agent</h3>
<p class="text-gray-400 mb-6 leading-relaxed">Drafts hyper-personalized emails and LinkedIn messages using prospect-specific recent wins or news.</p>
<ul class="space-y-3 text-sm text-gray-500">
<li class="flex items-center gap-2">✓ Multi-channel Sequences</li>
<li class="flex items-center gap-2">✓ Context-aware Personalization</li>
<li class="flex items-center gap-2">✓ Dynamic Sending Schedules</li>
</ul>
</div>
<!-- Agent 3: Negotiation -->
<div class="glass-card p-8 rounded-3xl relative z-10 group hover:border-amber transition-colors" data-purpose="agent-card">
<div class="w-14 h-14 bg-amber/20 border border-amber/40 rounded-2xl flex items-center justify-center mb-6 text-amber text-2xl group-hover:scale-110 transition-transform">
          🤝
        </div>
<h3 class="font-display font-bold text-2xl mb-4">Negotiation Agent</h3>
<p class="text-gray-400 mb-6 leading-relaxed">Handles objections, answers pricing questions, and books meetings directly into your calendar.</p>
<ul class="space-y-3 text-sm text-gray-500">
<li class="flex items-center gap-2">✓ Objection Handling Bot</li>
<li class="flex items-center gap-2">✓ Calendar Integration</li>
<li class="flex items-center gap-2">✓ Auto-follow-up Reminders</li>
</ul>
</div>
</div>
</section>
<!-- END: Agent Showcase -->
<!-- BEGIN: How It Works -->
<section class="py-24 px-6 bg-white/[0.02]" id="how-it-works">
<div class="max-w-4xl mx-auto">
<div class="text-center mb-20">
<h2 class="font-display font-extrabold text-4xl md:text-5xl mb-4">Setup in 15 minutes.</h2>
<p class="text-gray-400">Scaling your pipeline shouldn't be a project itself.</p>
</div>
<div class="relative">
<!-- Vertical Connection Line -->
<div class="absolute left-8 top-0 h-full w-[2px] bg-gradient-to-b from-indigo via-aqua to-transparent"></div>
<div class="space-y-16">
<!-- Step 1 -->
<div class="flex items-start gap-12 group" data-purpose="timeline-step">
<div class="w-16 h-16 rounded-full glass-card flex items-center justify-center font-display font-bold text-2xl text-indigo z-10 shrink-0 border-indigo/30 bg-midnight">1</div>
<div>
<h4 class="font-display font-bold text-2xl mb-3 group-hover:text-indigo transition-colors">Connect Your Profile</h4>
<p class="text-gray-400 text-lg leading-relaxed">Securely link your LinkedIn and Email servers. Our proprietary warmup protocols ensure 100% deliverability.</p>
</div>
</div>
<!-- Step 2 -->
<div class="flex items-start gap-12 group" data-purpose="timeline-step">
<div class="w-16 h-16 rounded-full glass-card flex items-center justify-center font-display font-bold text-2xl text-aqua z-10 shrink-0 border-aqua/30 bg-midnight">2</div>
<div>
<h4 class="font-display font-bold text-2xl mb-3 group-hover:text-aqua transition-colors">Define Ideal Persona</h4>
<p class="text-gray-400 text-lg leading-relaxed">Tell NEXORIS who you're looking for. Use plain English: "Marketing Directors at SaaS companies with 10-50 employees."</p>
</div>
</div>
<!-- Step 3 -->
<div class="flex items-start gap-12 group" data-purpose="timeline-step">
<div class="w-16 h-16 rounded-full glass-card flex items-center justify-center font-display font-bold text-2xl text-indigo z-10 shrink-0 border-indigo/30 bg-midnight">3</div>
<div>
<h4 class="font-display font-bold text-2xl mb-3 group-hover:text-indigo transition-colors">Approve First Batch</h4>
<p class="text-gray-400 text-lg leading-relaxed">Review the first 10 leads and messages. Once you're happy, hit "Auto-Pilot" to let the agents take over.</p>
</div>
</div>
<!-- Step 4 -->
<div class="flex items-start gap-12 group" data-purpose="timeline-step">
<div class="w-16 h-16 rounded-full glass-card flex items-center justify-center font-display font-bold text-2xl text-aqua z-10 shrink-0 border-aqua/30 bg-midnight">4</div>
<div>
<h4 class="font-display font-bold text-2xl mb-3 group-hover:text-aqua transition-colors">Monitor Real-time Results</h4>
<p class="text-gray-400 text-lg leading-relaxed">Watch your dashboard as agents find prospects and start conversations. Get push notifications for replies.</p>
</div>
</div>
<!-- Step 5 -->
<div class="flex items-start gap-12 group" data-purpose="timeline-step">
<div class="w-16 h-16 rounded-full glass-card flex items-center justify-center font-display font-bold text-2xl text-amber z-10 shrink-0 border-amber/30 bg-midnight">5</div>
<div>
<h4 class="font-display font-bold text-2xl mb-3 group-hover:text-amber transition-colors">Close the Deal</h4>
<p class="text-gray-400 text-lg leading-relaxed">Step in only when the client is ready to talk turkey. Nexoris manages everything leading up to the call.</p>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- END: How It Works -->
<!-- BEGIN: Social Proof -->
<section class="py-24 px-6 overflow-hidden">
<div class="max-w-7xl mx-auto">
<div class="text-center mb-16">
<h3 class="text-gray-500 font-semibold tracking-widest uppercase text-sm mb-4">Trusted by 500+ solo operators and agencies</h3>
</div>
<div class="flex gap-6 overflow-x-auto pb-12 snap-x no-scrollbar" data-purpose="testimonial-scroll">
<!-- Testimonial 1 -->
<div class="min-w-[350px] glass-card p-8 rounded-2xl snap-center">
<div class="flex items-center gap-4 mb-6">
<img alt="Sarah J." class="w-12 h-12 rounded-full border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpusWoy__L03Fdnfen9XpE4Uk8FbvpYIeRXPXehRb1v8s1D4-EEDy8B8qb_ybT84HdJyUOH919E6A5Pct8BJv3vnT9DRJBPIsLwBLMXlAJY81AS0JTosgEO1_pDV9G_Z_movuiYugYfcTR4OX9xUglt-QpTahs9-H9qnMxZBY9FCMoY4M3nWjq-dX8AjVqmC2IOF637EQWdawtKd2-7Y7yLTfKD6QT0CIoop1_mmS96Pmu7U4v7l--bNUWm6ev0FHLukx41K5n8eM"/>
<div>
<p class="font-bold text-white">Sarah Jenkins</p>
<p class="text-xs text-gray-500">Founder, Glow Growth</p>
</div>
</div>
<p class="text-gray-300 italic mb-4">"NEXORIS booked 14 discovery calls in my first week. I haven't touched LinkedIn in days."</p>
<div class="flex text-amber text-xs gap-1">★★★★★</div>
</div>
<!-- Testimonial 2 -->
<div class="min-w-[350px] glass-card p-8 rounded-2xl snap-center">
<div class="flex items-center gap-4 mb-6">
<img alt="Marcus" class="w-12 h-12 rounded-full border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN9i7N0B0bpg7yPKOOvw5pQsu1lNITOuupqATrxaR3UADbeX51LTV5Hu3AD4jzby5h1D54NAgIdr8rPUTWjMcEVgxsTSLlYkAldpzZFNKRetc_sJRHHNw80QIxzUnSF0bGSOCuVM8CEiGwjnt7hyYLT5josIj5uWazE4hhYpo-deK-0fazK6732NaGqrQ2mYI--gxbSTqiZcwlc8pact5lL7NRd_-_IMG3VMUACqGWz8dDFladKzcctakXqnez9wQNvaat4Vu0Vkw"/>
<div>
<p class="font-bold text-white">Marcus Thorne</p>
<p class="text-xs text-gray-500">Design Agency Owner</p>
</div>
</div>
<p class="text-gray-300 italic mb-4">"The personalization is spooky. Clients actually think I wrote these myself. Highly recommend."</p>
<div class="flex text-amber text-xs gap-1">★★★★★</div>
</div>
<!-- Testimonial 3 -->
<div class="min-w-[350px] glass-card p-8 rounded-2xl snap-center border-indigo/40">
<div class="flex items-center gap-4 mb-6">
<img alt="Elena" class="w-12 h-12 rounded-full border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCijEkl8fwXPY4zj-3V5Lf-j2MMsodap7F6QD9ZVeIo0w1sGcHJQMsWWiEoOYc6YEfCu16j6LINcXRB-eWVxgcoISTmFgQngbLiTvLE1rESwBWSVP2YuzY-BpjO15hi_XoVENbd11qx7as5OfiZRrGuPSa9HQ9ZEs1iBhfQlxxz57LDMjfzmDQG8-ePbDIre5HNBD2-4QJgyPYpO-XeyjpNLk9TBQyYYzutwCKJC8WvY3U0gPj4ZYIBo52cREIdTDxtAyty7HL3Q38"/>
<div>
<p class="font-bold text-white">Elena Rodriguez</p>
<p class="text-xs text-gray-500">SaaS Consultant</p>
</div>
</div>
<p class="text-gray-300 italic mb-4">"Automating the top of funnel was the best decision of 2024. My MRR has tripled."</p>
<div class="flex text-amber text-xs gap-1">★★★★★</div>
</div>
<!-- Testimonial 4 -->
<div class="min-w-[350px] glass-card p-8 rounded-2xl snap-center">
<div class="flex items-center gap-4 mb-6">
<img alt="David" class="w-12 h-12 rounded-full border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFBUN7YAU2IbzcZlyV5xgDdRsylDi8jjbBBCCD8lQQPi-x-6UYjWetH0OaJTz5GV8AYSlHiTLiSsnn05G3bEHJtVY6weaqnnA6HjWv3qxAHokjs8nrr9nQ-BgJHPOaqORLJOGgzU6PFrXGcwG25SGPuJQ6IaWfoOH2y9uIVehT0W9jysBxQGYhA186S22gG2KFl1HSyyNRcXsQBtIeWybvFJdhR3qpyLqurA9Dy0v_xEgpd-_9qLi34alA69rGGVKji3nEwEkd3k8"/>
<div>
<p class="font-bold text-white">David Chen</p>
<p class="text-xs text-gray-500">Freelance Developer</p>
</div>
</div>
<p class="text-gray-300 italic mb-4">"Finally a tool that doesn't feel like spam. It actually builds real relationships."</p>
<div class="flex text-amber text-xs gap-1">★★★★★</div>
</div>
<!-- Testimonial 5 -->
<div class="min-w-[350px] glass-card p-8 rounded-2xl snap-center">
<div class="flex items-center gap-4 mb-6">
<img alt="Jess" class="w-12 h-12 rounded-full border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvA1KCa6Mnn3KPSitaQOiuKzSbyJP8coX4u7tVr-a2W1s2_MG2ZXg7XYLtykTWkNummqdNuJR_dC9WrpF2AE6bgw-WMs-zv3IkJLgxik-legL9gHiv2GgGBO1Gcds5HqCQyNlXHaifOYguEKYiBXcgR6v4YL_qjPJSUzZ6XvI3RQ4UIKwvjSk5yWSy1zVozjpDWmUlibYlLLwohMgwNEy2W3u9ZElE6_wC56kBjWeWe-_xpNST0DqFFKzQYThqSiq_uNHhcR4ursI"/>
<div>
<p class="font-bold text-white">Jessica Bloom</p>
<p class="text-xs text-gray-500">Content Lead</p>
</div>
</div>
<p class="text-gray-300 italic mb-4">"Setup was incredibly fast. I was live and hunting leads in less than 20 minutes."</p>
<div class="flex text-amber text-xs gap-1">★★★★★</div>
</div>
</div>
</div>
</section>
<!-- END: Social Proof -->
<!-- BEGIN: Pricing Section -->
<section class="py-24 px-6 max-w-7xl mx-auto" id="pricing">
<div class="text-center mb-16">
<h2 class="font-display font-extrabold text-4xl md:text-5xl mb-6">Simple, scale-ready pricing.</h2>
<div class="flex items-center justify-center gap-4 text-sm font-medium">
<span>Monthly</span>
<label class="relative inline-flex items-center cursor-pointer">
<input class="sr-only peer" type="checkbox" value=""/>
<div class="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo"></div>
</label>
<span class="text-gray-500">Annual <span class="text-aqua">(Save 20%)</span></span>
</div>
</div>
<div class="grid md:grid-cols-3 gap-8">
<!-- Starter -->
<div class="glass-card p-10 rounded-3xl flex flex-col" data-purpose="pricing-tier">
<div class="mb-8">
<h4 class="font-display font-bold text-xl mb-2">Starter</h4>
<p class="text-gray-500 text-sm">Perfect for solo testers.</p>
</div>
<div class="mb-8">
<span class="text-4xl font-display font-extrabold">$0</span>
<span class="text-gray-500">/mo</span>
</div>
<ul class="space-y-4 mb-10 flex-grow text-gray-400 text-sm">
<li class="flex items-center gap-2">✓ 100 Lead Discovery/mo</li>
<li class="flex items-center gap-2">✓ Basic Personalization</li>
<li class="flex items-center gap-2">✓ 1 Active Sequence</li>
</ul>
<button class="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors font-bold">Get Started</button>
</div>
<!-- Growth -->
<div class="glass-card p-10 rounded-3xl flex flex-col relative border-indigo/50 bg-indigo/5" data-purpose="pricing-tier">
<div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Most Popular</div>
<div class="mb-8">
<h4 class="font-display font-bold text-xl mb-2 text-white">Growth</h4>
<p class="text-gray-500 text-sm">For scaling solo operators.</p>
</div>
<div class="mb-8">
<span class="text-4xl font-display font-extrabold text-white">$49</span>
<span class="text-gray-500">/mo</span>
</div>
<ul class="space-y-4 mb-10 flex-grow text-gray-300 text-sm font-medium">
<li class="flex items-center gap-2 text-indigo">✓ 1,500 Lead Discovery/mo</li>
<li class="flex items-center gap-2 text-indigo">✓ Advanced AI Personalization</li>
<li class="flex items-center gap-2 text-indigo">✓ Unlimited Active Sequences</li>
<li class="flex items-center gap-2 text-indigo">✓ Multi-channel (Email + LinkedIn)</li>
</ul>
<button class="w-full py-3 rounded-xl bg-indigo hover:bg-indigo-dark transition-all font-bold shadow-lg shadow-indigo/20">Go Pro</button>
</div>
<!-- Agency -->
<div class="glass-card p-10 rounded-3xl flex flex-col" data-purpose="pricing-tier">
<div class="mb-8">
<h4 class="font-display font-bold text-xl mb-2">Agency</h4>
<p class="text-gray-500 text-sm">For teams and portfolios.</p>
</div>
<div class="mb-8">
<span class="text-4xl font-display font-extrabold">$149</span>
<span class="text-gray-500">/mo</span>
</div>
<ul class="space-y-4 mb-10 flex-grow text-gray-400 text-sm">
<li class="flex items-center gap-2">✓ 10,000 Lead Discovery/mo</li>
<li class="flex items-center gap-2">✓ 5 Linked Accounts</li>
<li class="flex items-center gap-2">✓ Priority Dedicated Support</li>
<li class="flex items-center gap-2">✓ Custom API Access</li>
</ul>
<button class="w-full py-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors font-bold">Contact Sales</button>
</div>
</div>
</section>
<!-- END: Pricing Section -->
<!-- BEGIN: Final CTA -->
<section class="py-32 px-6 relative overflow-hidden">
<!-- Glow Background -->
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo filter blur-[140px] opacity-30 z-0 rounded-full"></div>
<div class="max-w-4xl mx-auto text-center relative z-10">
<h2 class="font-display font-extrabold text-5xl md:text-7xl mb-8 leading-tight">Your pipeline doesn't <br/> have to sleep.</h2>
<p class="text-xl text-gray-400 mb-12 max-w-xl mx-auto">Join 500+ businesses who have automated their outreach and reclaimed their time.</p>
<button class="bg-white text-midnight px-12 py-5 rounded-2xl font-display font-extrabold text-2xl hover:bg-aqua hover:scale-105 transition-all shadow-2xl">
        Start Your Free Trial
      </button>
<p class="mt-6 text-sm text-gray-500">No credit card required • 14-day free trial</p>
</div>
</section>
<!-- END: Final CTA -->
<!-- BEGIN: Footer -->
<footer class="py-20 px-6 border-t border-white/5">
<div class="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
<div class="col-span-2">
<div class="flex items-center gap-2 mb-6">
<div class="w-6 h-6 bg-indigo rounded flex items-center justify-center font-display font-extrabold text-white text-xs">N</div>
<span class="font-display font-extrabold text-xl tracking-tighter">NEXORIS</span>
</div>
<p class="text-gray-500 max-w-sm mb-8">
          The autonomous client acquisition engine built for the next generation of digital entrepreneurs.
        </p>
<div class="flex gap-4">
<a class="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:text-aqua transition-colors" href="#">𝕏</a>
<a class="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:text-aqua transition-colors" href="#">in</a>
<a class="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:text-aqua transition-colors" href="#">YT</a>
</div>
</div>
<div>
<h5 class="font-bold mb-6">Product</h5>
<ul class="space-y-4 text-gray-500 text-sm">
<li><a class="hover:text-white transition-colors" href="/#features">Features</a></li>
<li><a class="hover:text-white transition-colors" href="/#features">Agents</a></li>
<li><a class="hover:text-white transition-colors" href="/pricing">Pricing</a></li>
<li><a class="hover:text-white transition-colors" href="/demo">Demo</a></li>
</ul>
</div>
<div>
<h5 class="font-bold mb-6">Legal</h5>
<ul class="space-y-4 text-gray-500 text-sm">
<li><a class="hover:text-white transition-colors" href="#">Privacy Policy</a></li>
<li><a class="hover:text-white transition-colors" href="#">Terms of Service</a></li>
<li><a class="hover:text-white transition-colors" href="#">Cookie Policy</a></li>
<li><a class="hover:text-white transition-colors" href="#">Anti-Spam Policy</a></li>
</ul>
</div>
</div>
<div class="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-gray-600 text-sm">
      © 2024 NEXORIS AI Technologies. All rights reserved.
    </div>
</footer>
<!-- END: Footer -->
<script data-purpose="live-counter-logic">
    // Simple logic to increment counter every few seconds for "real-time" feel
    let count = 1284;
    const counterEl = document.getElementById('counter');
    
    setInterval(() => {
      count += Math.floor(Math.random() * 3) + 1;
      if(counterEl) counterEl.innerText = count.toLocaleString();
    }, 4500);
  </script>
<style data-purpose="utility-classes">
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</body></html>
