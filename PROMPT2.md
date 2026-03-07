<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>NEXORIS Mission Control - Agent Config</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#13b6ec",
                        "background-light": "#f6f8f8",
                        "background-dark": "#101d22",
                        "slate-panel": "#192d33",
                        "slate-border": "#325a67",
                    },
                    fontFamily: {
                        "display": ["Inter", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        .glow-border:focus-within {
            box-shadow: 0 0 0 2px rgba(19, 182, 236, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #101d22;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #325a67;
            border-radius: 10px;
        }
    </style>
</head>
<body class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased custom-scrollbar">
<div class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
<div class="layout-container flex h-full grow flex-col">
<!-- Top Navigation -->
<header class="flex items-center justify-between border-b border-slate-border px-6 py-4 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
<div class="flex items-center gap-8">
<div class="flex items-center gap-3 text-primary">
<div class="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
<span class="material-symbols-outlined text-primary">deployed_code</span>
</div>
<h2 class="text-slate-100 text-xl font-black leading-tight tracking-tight uppercase">Nexoris <span class="text-primary/70 font-light">Control</span></h2>
</div>
<nav class="hidden md:flex items-center gap-8">
<a class="text-slate-400 hover:text-primary text-sm font-medium transition-colors" href="#">Dashboard</a>
<a class="text-primary text-sm font-bold border-b-2 border-primary pb-1" href="#">Agents</a>
<a class="text-slate-400 hover:text-primary text-sm font-medium transition-colors" href="#">Logs</a>
<a class="text-slate-400 hover:text-primary text-sm font-medium transition-colors" href="#">Settings</a>
</nav>
</div>
<div class="flex items-center gap-4">
<div class="relative hidden sm:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
<input class="bg-slate-panel border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary w-64 text-slate-100" placeholder="Search systems..." type="text"/>
</div>
<button class="p-2 bg-slate-panel rounded-lg text-slate-300 hover:text-primary transition-colors relative">
<span class="material-symbols-outlined">notifications</span>
<span class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
</button>
<div class="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-sm">person</span>
</div>
</div>
</header>
<main class="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
<!-- Hero Header -->
<div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
<div class="max-w-2xl">
<div class="flex items-center gap-2 text-primary mb-2">
<span class="text-xs font-bold tracking-[0.2em] uppercase">System Configuration</span>
<div class="h-[1px] w-12 bg-primary/30"></div>
</div>
<h1 class="text-4xl font-black text-slate-100 mb-4 tracking-tight">Agent Mission Parameters</h1>
<p class="text-slate-400 text-lg">Define global guardrails and specific operational protocols for your autonomous intelligence units.</p>
</div>
<div class="flex gap-3">
<button class="px-6 py-2.5 bg-slate-panel text-slate-100 rounded-lg font-bold text-sm hover:bg-slate-700 transition-all border border-slate-border">Export Config</button>
<button class="px-6 py-2.5 bg-primary text-background-dark rounded-lg font-bold text-sm hover:brightness-110 shadow-lg shadow-primary/20 transition-all">Initialize Mission</button>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
<!-- Sidebar Stats / Quick Info -->
<aside class="lg:col-span-3 flex flex-col gap-6">
<div class="bg-slate-panel/40 border border-slate-border rounded-xl p-5">
<h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-4">System Status</h3>
<div class="space-y-4">
<div class="flex justify-between items-center">
<span class="text-sm text-slate-400">Core Engine</span>
<span class="text-xs font-bold px-2 py-0.5 bg-green-500/10 text-green-400 rounded border border-green-500/20 uppercase">Stable</span>
</div>
<div class="flex justify-between items-center">
<span class="text-sm text-slate-400">Agent Sync</span>
<span class="text-xs font-bold px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20 uppercase">98.2%</span>
</div>
<div class="flex justify-between items-center">
<span class="text-sm text-slate-400">Memory Load</span>
<span class="text-xs font-bold px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded border border-yellow-500/20 uppercase">Normal</span>
</div>
</div>
</div>
<div class="bg-slate-panel/40 border border-slate-border rounded-xl p-5">
<h3 class="text-xs font-bold text-primary uppercase tracking-widest mb-4">Active Modules</h3>
<div class="space-y-3">
<label class="flex items-center gap-3 cursor-pointer group">
<input checked="" class="rounded bg-background-dark border-slate-border text-primary focus:ring-primary focus:ring-offset-background-dark" type="checkbox"/>
<span class="text-sm text-slate-300 group-hover:text-white">Sentiment Analysis</span>
</label>
<label class="flex items-center gap-3 cursor-pointer group">
<input checked="" class="rounded bg-background-dark border-slate-border text-primary focus:ring-primary focus:ring-offset-background-dark" type="checkbox"/>
<span class="text-sm text-slate-300 group-hover:text-white">Competitor Tracking</span>
</label>
<label class="flex items-center gap-3 cursor-pointer group">
<input class="rounded bg-background-dark border-slate-border text-primary focus:ring-primary focus:ring-offset-background-dark" type="checkbox"/>
<span class="text-sm text-slate-300 group-hover:text-white">Auto-Escalation</span>
</label>
</div>
</div>
</aside>
<!-- Main Config Area -->
<div class="lg:col-span-9 space-y-8">
<!-- Section 1: Global Mission Parameters -->
<section class="bg-slate-panel/20 border border-slate-border rounded-xl overflow-hidden">
<div class="px-6 py-4 border-b border-slate-border bg-slate-panel/40 flex justify-between items-center">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">public</span>
<h2 class="text-lg font-bold text-slate-100">1. Global Mission Parameters</h2>
</div>
<div class="flex items-center gap-3">
<span class="text-xs text-slate-400 uppercase font-bold">System Active</span>
<button class="relative inline-flex h-6 w-11 items-center rounded-full bg-primary shadow-inner">
<span class="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition"></span>
</button>
</div>
</div>
<div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-2">
<label class="text-sm font-bold text-slate-300">Target City/Region</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
<input class="w-full bg-background-dark border-slate-border rounded-lg pl-10 text-slate-100 focus:ring-primary" data-location="San Francisco" placeholder="e.g. San Francisco, CA" type="text"/>
</div>
</div>
<div class="space-y-2">
<label class="text-sm font-bold text-slate-300">Business Categories</label>
<select class="w-full bg-background-dark border-slate-border rounded-lg text-slate-100 focus:ring-primary h-[42px] px-3 custom-scrollbar" multiple="">
<option>SaaS &amp; Tech</option>
<option selected="">E-commerce</option>
<option selected="">Healthcare</option>
<option>Legal Services</option>
<option>Renewable Energy</option>
</select>
<p class="text-[10px] text-slate-500">Hold CMD/CTRL to select multiple</p>
</div>
</div>
</section>
<!-- Section 2: Agent 1 (Discovery) Guardrails -->
<section class="bg-slate-panel/20 border border-slate-border rounded-xl overflow-hidden">
<div class="px-6 py-4 border-b border-slate-border bg-slate-panel/40 flex items-center gap-3">
<span class="material-symbols-outlined text-primary">radar</span>
<h2 class="text-lg font-bold text-slate-100">2. Agent 1 (Discovery) Guardrails</h2>
</div>
<div class="p-6 space-y-8">
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<div class="space-y-4">
<div class="flex justify-between">
<label class="text-sm font-bold text-slate-300">Search Depth</label>
<span class="text-xs text-primary font-mono">Level 4/10</span>
</div>
<input class="w-full h-1.5 bg-background-dark rounded-lg appearance-none cursor-pointer accent-primary" type="range"/>
<div class="flex justify-between text-[10px] text-slate-500 uppercase tracking-tighter">
<span>Surface</span>
<span>Deep Scan</span>
</div>
</div>
<div class="space-y-4">
<div class="flex justify-between">
<label class="text-sm font-bold text-slate-300">Lead Scoring Weightage</label>
<span class="text-xs text-primary font-mono">85% Revenue</span>
</div>
<input class="w-full h-1.5 bg-background-dark rounded-lg appearance-none cursor-pointer accent-primary" type="range"/>
<div class="flex justify-between text-[10px] text-slate-500 uppercase tracking-tighter">
<span>Growth</span>
<span>Stability</span>
</div>
</div>
</div>
<div class="space-y-3">
<label class="text-sm font-bold text-slate-300">Digital Gap Criteria</label>
<div class="flex flex-wrap gap-2">
<span class="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold flex items-center gap-2">Missing Website <span class="material-symbols-outlined text-xs">close</span></span>
<span class="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold flex items-center gap-2">Low SEO Score <span class="material-symbols-outlined text-xs">close</span></span>
<span class="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold flex items-center gap-2">No Social Presence <span class="material-symbols-outlined text-xs">close</span></span>
<button class="px-3 py-1 bg-slate-panel border border-slate-border text-slate-400 hover:text-white rounded-full text-xs font-bold">+ Add Criteria</button>
</div>
</div>
</div>
</section>
<!-- Section 3: Agent 2 (Outreach) Settings -->
<section class="bg-slate-panel/20 border border-slate-border rounded-xl overflow-hidden">
<div class="px-6 py-4 border-b border-slate-border bg-slate-panel/40 flex items-center gap-3">
<span class="material-symbols-outlined text-primary">send</span>
<h2 class="text-lg font-bold text-slate-100">3. Agent 2 (Outreach) Settings</h2>
</div>
<div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
<div class="space-y-6">
<div class="space-y-2">
<label class="text-sm font-bold text-slate-300">Email Sender Identity</label>
<select class="w-full bg-background-dark border-slate-border rounded-lg text-slate-100 focus:ring-primary">
<option>Executive Concierge (Sarah)</option>
<option>Technical Advisor (Marcus)</option>
<option>Growth Specialist (Alex)</option>
</select>
</div>
<div class="space-y-2">
<label class="text-sm font-bold text-slate-300">Brand Tone</label>
<div class="grid grid-cols-3 gap-2">
<button class="py-2 text-xs font-bold bg-primary text-background-dark rounded border border-primary">Professional</button>
<button class="py-2 text-xs font-bold bg-background-dark text-slate-400 rounded border border-slate-border hover:border-primary/50">Aggressive</button>
<button class="py-2 text-xs font-bold bg-background-dark text-slate-400 rounded border border-slate-border hover:border-primary/50">Helpful</button>
</div>
</div>
</div>
<div class="space-y-6">
<div class="flex items-center justify-between p-4 bg-background-dark/50 rounded-lg border border-slate-border/50">
<div>
<p class="text-sm font-bold text-slate-200">A/B Testing Mode</p>
<p class="text-[10px] text-slate-500">Split traffic between two variant scripts</p>
</div>
<button class="relative inline-flex h-5 w-9 items-center rounded-full bg-primary/40">
<span class="inline-block h-3 w-3 translate-x-1 transform rounded-full bg-white transition"></span>
</button>
</div>
<div class="space-y-2">
<div class="flex justify-between items-center">
<label class="text-sm font-bold text-slate-300">Daily Send Limit</label>
<span class="text-xs font-mono text-primary">450 / day</span>
</div>
<input class="w-full h-1.5 bg-background-dark rounded-lg appearance-none cursor-pointer accent-primary" max="1000" min="0" type="range" value="450"/>
</div>
</div>
</div>
</section>
<!-- Section 4: Agent 3 (Negotiation) Rules -->
<section class="bg-slate-panel/20 border border-slate-border rounded-xl overflow-hidden">
<div class="px-6 py-4 border-b border-slate-border bg-slate-panel/40 flex items-center gap-3">
<span class="material-symbols-outlined text-primary">handshake</span>
<h2 class="text-lg font-bold text-slate-100">4. Agent 3 (Negotiation) Rules</h2>
</div>
<div class="p-6 space-y-6">
<div class="overflow-x-auto">
<table class="w-full text-left text-sm">
<thead>
<tr class="text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-border">
<th class="pb-3 px-2">Service Type</th>
<th class="pb-3 px-2">Min Pricing</th>
<th class="pb-3 px-2">Max Pricing</th>
<th class="pb-3 px-2">Logic Threshold</th>
</tr>
</thead>
<tbody class="divide-y divide-slate-border/30">
<tr class="hover:bg-slate-panel/20 transition-colors">
<td class="py-4 px-2 font-bold text-slate-200">SEO Audit</td>
<td class="py-4 px-2">
<input class="w-20 bg-background-dark border-slate-border rounded text-xs py-1 px-2 focus:ring-primary" type="text" value="$500"/>
</td>
<td class="py-4 px-2">
<input class="w-20 bg-background-dark border-slate-border rounded text-xs py-1 px-2 focus:ring-primary" type="text" value="$1500"/>
</td>
<td class="py-4 px-2 text-slate-500 text-xs italic">Market standard</td>
</tr>
<tr class="hover:bg-slate-panel/20 transition-colors">
<td class="py-4 px-2 font-bold text-slate-200">PPC Setup</td>
<td class="py-4 px-2">
<input class="w-20 bg-background-dark border-slate-border rounded text-xs py-1 px-2 focus:ring-primary" type="text" value="$1200"/>
</td>
<td class="py-4 px-2">
<input class="w-20 bg-background-dark border-slate-border rounded text-xs py-1 px-2 focus:ring-primary" type="text" value="$3000"/>
</td>
<td class="py-4 px-2 text-slate-500 text-xs italic">Performance based</td>
</tr>
</tbody>
</table>
</div>
<div class="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg flex items-start gap-4">
<span class="material-symbols-outlined text-yellow-500">warning</span>
<div class="flex-1">
<p class="text-sm font-bold text-yellow-200">Human Escalation Trigger</p>
<p class="text-xs text-slate-400 mt-1">If lead requests discount &gt; 25% or asks for custom SLAs, immediately notify mission control.</p>
</div>
<button class="text-xs font-bold text-primary underline underline-offset-4">Configure Pings</button>
</div>
</div>
</section>
<!-- Section 5: Brand Assets -->
<section class="bg-slate-panel/20 border border-slate-border rounded-xl overflow-hidden">
<div class="px-6 py-4 border-b border-slate-border bg-slate-panel/40 flex items-center gap-3">
<span class="material-symbols-outlined text-primary">palette</span>
<h2 class="text-lg font-bold text-slate-100">5. Brand Assets</h2>
</div>
<div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
<div class="space-y-3">
<label class="text-sm font-bold text-slate-300">Logo Upload</label>
<div class="border-2 border-dashed border-slate-border rounded-xl p-6 flex flex-col items-center justify-center hover:bg-slate-panel/40 transition-all cursor-pointer group">
<span class="material-symbols-outlined text-3xl text-slate-500 group-hover:text-primary mb-2">cloud_upload</span>
<p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Drop PNG/SVG here</p>
</div>
</div>
<div class="space-y-4">
<label class="text-sm font-bold text-slate-300">Primary Brand Colors</label>
<div class="grid grid-cols-4 gap-2">
<div class="aspect-square rounded-lg bg-primary border border-white/20"></div>
<div class="aspect-square rounded-lg bg-slate-800 border border-white/20"></div>
<div class="aspect-square rounded-lg bg-slate-200 border border-white/20"></div>
<div class="aspect-square rounded-lg bg-red-500 border border-white/20"></div>
</div>
<button class="w-full py-2 text-xs font-bold text-primary bg-primary/10 rounded-lg border border-primary/20">Edit Palette</button>
</div>
<div class="space-y-3">
<label class="text-sm font-bold text-slate-300">Case Study Links</label>
<div class="space-y-2">
<div class="flex items-center gap-2 px-3 py-2 bg-background-dark border border-slate-border rounded-lg">
<span class="material-symbols-outlined text-xs text-primary">link</span>
<span class="text-xs text-slate-300 truncate">cloud-growth.pdf</span>
</div>
<div class="flex items-center gap-2 px-3 py-2 bg-background-dark border border-slate-border rounded-lg">
<span class="material-symbols-outlined text-xs text-primary">link</span>
<span class="text-xs text-slate-300 truncate">startup-scaling.v2.pdf</span>
</div>
<button class="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
<span class="material-symbols-outlined text-sm">add</span> Add New
                                        </button>
</div>
</div>
</div>
</section>
</div>
</div>
</main>
<!-- Footer Meta -->
<footer class="mt-auto border-t border-slate-border/50 px-6 py-4 bg-background-dark/50">
<div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
<div class="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
<span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span> SYSTEM ONLINE</span>
<span>v4.0.1-STABLE</span>
<span>ENC: AES-256</span>
</div>
<p class="text-[10px] text-slate-600 uppercase tracking-widest">© 2024 Nexoris Intelligence. All Rights Reserved.</p>
</div>
</footer>
</div>
</div>
</body></html>