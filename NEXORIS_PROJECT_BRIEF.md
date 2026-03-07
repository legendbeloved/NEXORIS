# ⚡ NEXORIS
## Fully Automated Multi-Agent Business Outreach System
### Complete Project Brief · Brand Identity · Build Guide · Prompt Library

---

> *"Find. Connect. Close. Automatically."*

---

## 🏷️ BRAND DECLARATION

**Brand Name:** NEXORIS
**Tagline:** Find. Connect. Close. Automatically.
**Name Origin:** Nexus (hub of connections) + Horizon (the future ahead) = NEXORIS
The name represents the next horizon of automated business intelligence.

**Mission:**
To empower entrepreneurs, agencies, and solo operators with enterprise-grade AI systems that autonomously find, pitch, convert, and serve clients — so you build a business, not a job.

**Vision:**
A world where anyone with a skill can scale their client acquisition to any size, without hiring a sales team, without cold-calling, and without interrupting their deep work.

**Brand Statement:**
NEXORIS is the operating system behind your client pipeline. Three intelligent agents work in shifts that never end — discovering, convincing, and closing — while you focus on what you do best.

**Tone:** Confident. Precise. Slightly futuristic. Never corporate. Never casual.
**Archetype:** The Sage + The Innovator
**Personality Traits:** Authoritative, Efficient, Intelligent, Transparent, Relentless

**Logo Concept:**
A bold wordmark "NEXORIS" in uppercase geometric letterforms with a custom ligature between the X and O — creating a subtle infinity loop or orbital symbol. The icon mark is an abstract hexagonal node with three interconnected lines representing the three agents. Clean, minimal, technical.

**Logo Variants:**
- Full Color: Wordmark in electric indigo (#5B4CF5) with icon in neon aqua (#00D4FF)
- Dark Background: White wordmark + aqua icon
- Light Background: Midnight wordmark + indigo icon
- Monochrome: Solid black
- Icon Only: For favicon, app icon, avatar

---

## 👥 TEAM BRIEFING RECORD

**Project:** NEXORIS — Multi-Agent Business Outreach Automation System
**Briefing Date:** Project Start
**Briefing Type:** Full Team Assembly

### Team Roster

| Role | Specialist | Experience | Assigned Responsibility |
|---|---|---|---|
| **Lead Architect & Vibe Coder** | Full-Stack Lead | 20+ yrs | Overall architecture, coordination, final decisions |
| **AI Systems Engineer** | Multi-Agent & LLM Specialist | 14+ yrs | Agent architecture, prompt engineering, agent communication |
| **Frontend Engineer** | Next.js / React Specialist | 15+ yrs | All UI screens, design system implementation |
| **Backend Engineer** | Node.js / Python API Specialist | 18+ yrs | REST APIs, agent orchestration layer, webhooks |
| **Database Architect** | PostgreSQL / Supabase Expert | 16+ yrs | Schema design, indexes, real-time subscriptions |
| **Brand & Identity Designer** | Visual Design + Design Systems | 20+ yrs | Logo, colors, typography, complete design system |
| **Motion Designer** | Framer Motion / GSAP | 14+ yrs | Animations, transitions, agent activity visualizations |
| **UX Researcher** | User Flows & IA | 17+ yrs | Wireframes, user journeys, admin + client dashboards |
| **DevOps Engineer** | Vercel / CI-CD / Performance | 15+ yrs | Deployment pipeline, env config, monitoring |
| **Payment Systems Engineer** | Stripe Integration | 15+ yrs | Payment links, receipts, webhook handling |
| **Email & Deliverability Engineer** | Resend / SendGrid | 12+ yrs | Email system, deliverability, A/B tracking |
| **Accessibility Auditor** | WCAG 2.1 | 12+ yrs | Keyboard nav, screen reader, contrast testing |
| **QA Engineer** | Playwright / Vitest | 14+ yrs | Unit, integration, and E2E test coverage |
| **Real-Time Systems Engineer** | WebSockets / Supabase Realtime | 13+ yrs | Live agent activity feed, notification center |

### Briefing Notes

**Problem Confirmed:** Manual client acquisition is the #1 bottleneck for solo operators and small agencies. Cold outreach, research, follow-up, negotiation, and delivery are all time-intensive and deeply repetitive — perfectly suited for AI automation.

**Market Opportunity:** Millions of local businesses globally lack websites, social media presence, and basic digital infrastructure. The gap is the opportunity.

**Competitive Advantage:** Most outreach tools send generic blasts. NEXORIS uses AI to genuinely analyze each business, craft personalized solutions, and negotiate autonomously. This is not a CRM or email blaster — it is a thinking pipeline.

**Critical Risks Flagged:**
1. Google Maps / Places API rate limits — implement aggressive caching and request batching
2. Email deliverability — domain warming, DKIM/SPF/DMARC setup, sending limits respected
3. Agent decision boundaries — clear guardrails must prevent agents from making decisions outside defined parameters
4. Legal compliance — CAN-SPAM, GDPR compliance required for all outreach emails
5. Payment security — Stripe webhooks must be verified; no client-side payment logic
6. AI hallucination in negotiation — Agent 3 responses must be grounded in preset rules, not freeform

**Tech Stack — Agreed & Locked:**

```
Frontend:         Next.js 14 (App Router) + TypeScript
Styling:          Tailwind CSS + CSS Custom Properties
Animation:        Framer Motion + GSAP (for agent flow visualizations)
State:            Zustand (global) + TanStack Query (server state)
Auth:             Supabase Auth (email + Google OAuth)
Database:         PostgreSQL via Supabase
Real-Time:        Supabase Realtime
Backend:          Node.js with Express (API routes in Next.js + standalone agent workers)
Agent Runtime:    Python FastAPI (agent workers, better AI library support)
AI Models:        Google Gemini 1.5 Flash (free tier) + Anthropic Claude API
Business Search:  Google Places API ($200/mo free credit covers ~40K lookups)
Email:            Resend (free: 3,000/month) → scale to paid
Email Tracking:   Custom pixel tracking + Resend webhooks
Payments:         Stripe (test mode for development)
Scheduling:       Cal.com API (open source, free tier)
Storage:          Supabase Storage (for mockups, assets, delivered files)
Error Monitor:    Sentry (free tier)
Analytics:        Vercel Analytics (free)
Deployment:       Vercel (frontend + API) + Railway (Python agent workers)
Version Control:  Git + GitHub
```

---

## 📋 IDEA TEMPLATE — STRUCTURED

```
─────────────────────────────────────────────────────────────
IDEA TEMPLATE — FRONTEND
─────────────────────────────────────────────────────────────

Role:
  You are an expert full-stack developer and UI/UX designer
  with 20+ years of experience building production-grade
  AI-powered SaaS platforms. You specialize in multi-agent
  system interfaces, admin dashboards, real-time data
  visualization, and autonomous workflow management tools.

Context:
  NEXORIS is a fully automated multi-agent business outreach
  and client acquisition platform. Three AI agents work 24/7:
  Agent 1 discovers local businesses with digital problems,
  Agent 2 crafts and sends personalized outreach, Agent 3
  negotiates, books meetings, processes payments, and delivers
  projects. The platform owner watches everything happen in
  real-time through a command-center dashboard. Clients get
  their own portal to track project progress.

  Target Audience:
  - Primary: Freelancers, solo developers, designers, agencies
    who want to scale client acquisition without hiring
  - Secondary: Small business owners who receive and review
    proposals and track their project delivery

  Emotional Tone: Powerful, intelligent, futuristic, trustworthy.
  The interface must feel like a mission control center, not a
  spreadsheet tool.

Task:
  Break this app into:

  ─────────────────────
  1. CORE FEATURES
  ─────────────────────

  AGENT SYSTEM:
  • Agent 1 — Business Discovery Engine
    - Google Places API search by category + location
    - AI analysis of each business's digital presence gaps
    - Contact extraction (email, phone) and validation
    - Prospect database creation and management
    - Adaptive search strategy based on conversion data

  • Agent 2 — Outreach Intelligence Engine
    - AI-generated personalized email per prospect
    - Dynamic mockup/preview generation per business type
    - A/B variation generation and tracking
    - Send-time optimization
    - Performance analytics and auto-refinement
    - Engagement tracking (opens, clicks, replies)

  • Agent 3 — Negotiation & Delivery Engine
    - AI negotiation within preset price guardrails
    - Autonomous meeting booking via Cal.com
    - Stripe payment link generation and tracking
    - Automated receipt delivery
    - Project delivery via secure client portal
    - Follow-up sequences and client communication
    - Smart escalation to human when needed

  PLATFORM FEATURES:
  • Landing page with live agent activity counter
  • Booking page (Cal.com embedded)
  • Admin command center dashboard
  • Client portal (per-client access)
  • Real-time notification center
  • Analytics and reporting
  • Agent configuration and guardrails panel

  ─────────────────────
  2. USER FLOW
  ─────────────────────

  OWNER FLOW:
  Step 1 → Sign up / Log in to NEXORIS admin
  Step 2 → Configure agent parameters:
           - Target city/region
           - Business categories to search
           - Pricing guardrails (min/max per service)
           - Email sender details and brand assets
           - Services offered and descriptions
  Step 3 → Activate agents (flip the switch)
  Step 4 → Watch real-time agent activity in command center
  Step 5 → Receive notifications at each milestone
  Step 6 → Review analytics, adjust parameters if needed
  Step 7 → Agent 3 closes deals, collects payment, delivers work
  Step 8 → Owner sees revenue dashboard update automatically

  CLIENT FLOW:
  Step 1 → Receive personalized outreach email from Agent 2
  Step 2 → Review their custom proposal + mockup preview
  Step 3 → Click CTA to enter client portal or book a call
  Step 4 → Interact with Agent 3 (negotiation / questions)
  Step 5 → Agree on price, receive Stripe payment link
  Step 6 → Pay, receive instant receipt
  Step 7 → Access client portal to track project delivery
  Step 8 → Receive completed project + confirmation

  ─────────────────────
  3. INPUT → LOGIC → DATA → OUTPUT
  ─────────────────────

  INPUT:
  - Owner: Location, business categories, price ranges, services
  - Agent 1: Google Places API results, web scrape data
  - Agent 2: Prospect profile from Agent 1
  - Agent 3: Response data from Agent 2 engagement
  - Client: Email replies, form submissions, payment

  LOGIC:
  - Agent 1: AI scores each business for outreach worthiness
             (presence gaps + contact availability + category match)
  - Agent 2: LLM generates personalized email per business
             A/B test selector picks variation
             Send-time optimizer schedules delivery
             Engagement tracker updates prospect status
  - Agent 3: Response classifier identifies intent (interested/not)
             Negotiation LLM responds within price guardrails
             Booking API creates calendar event
             Stripe API generates payment link on agreement
             Project delivery system uploads and notifies client

  DATA:
  - Prospects table (business data, status, contact info)
  - Outreach table (email variants, send times, engagement)
  - Conversations table (all agent-client messages)
  - Projects table (service type, status, files, deadline)
  - Payments table (amount, status, Stripe IDs, receipts)
  - Analytics table (conversion rates, revenue, agent metrics)
  - Notifications table (all owner alerts with read state)

  OUTPUT:
  - Owner: Real-time dashboard, notifications, revenue reports
  - Client: Personalized email, proposal, portal access, delivered project
  - System: Continuous learning signals fed back to agent parameters

  ─────────────────────
  4. MVS SCOPE
  (Minimum Viable Slice — proves the concept works)
  ─────────────────────

  • Agent 1 working: searches one category in one city,
    returns 10 prospects with contact info and AI analysis
  • Agent 2 working: generates one personalized email per prospect,
    sends via Resend, tracks opens
  • Basic admin dashboard: shows agent status, prospect list,
    email send confirmations
  • This proves the core loop works before adding complexity

  ─────────────────────
  5. MVP SCOPE
  (Minimum Viable Product — shippable to first real users)
  ─────────────────────

  • All three agents functional end-to-end
  • Admin dashboard with real-time activity feed
  • Client portal (view proposal + project status + pay)
  • Stripe payment integration (payment link + receipt)
  • Cal.com booking integration
  • Email tracking (opens + clicks + replies)
  • Notification system (in-app + email to owner)
  • Agent guardrails configuration panel
  • Dark mode + light mode
  • Mobile responsive
  • NEXORIS landing page

Constraints:
  - Beginner-friendly codebase (well-commented)
  - Simple, powerful UI — command center aesthetic
  - No unnecessary features in MVP
  - Mobile-first for notifications; desktop-first for dashboards
  - All free API tiers used where possible for localhost
─────────────────────────────────────────────────────────────
```

---

## 🎨 BRAND DESIGN SYSTEM OVERVIEW

### Design Style: Glass Liquid Design (Primary)
Frosted glass surfaces with subtle liquid distortion on hover. Deep space backgrounds with layered glass panels at multiple z-levels. Agent activity represented as flowing light streams. The UI feels like a mission control center inside a premium spaceship.

**Style Alternatives for This Project:**

| Style | Fit Score | Why |
|---|---|---|
| **Glass Liquid** ⭐ PRIMARY | 10/10 | Premium SaaS feel, depth communicates complexity, works beautifully on dark backgrounds |
| **Aurora UI** | 9/10 | Excellent for hero sections, agent visualizations, gradient backgrounds |
| **Glassmorphism** | 8/10 | Solid choice, but Glass Liquid adds the organic fluidity that makes it more premium |
| **Minimalism** | 6/10 | Too quiet for a system that's supposed to feel alive and active |
| **Neumorphism** | 4/10 | Too soft, doesn't communicate speed or intelligence |
| **Brutalism** | 3/10 | Wrong energy for a professional SaaS tool |
| **Claymorphism** | 2/10 | Too playful, completely wrong for enterprise-adjacent B2B |

**Recommendation:** Glass Liquid Design as primary, Aurora UI for the landing page hero section and agent flow visualizations. This combination creates a dark, premium, technical interface that feels intelligent without being cold.

### Color System

```
PRIMARY PALETTE:
  Midnight Deep:    #08091A   (background base)
  Midnight Mid:     #0D1030   (surface level 1)
  Midnight Raised:  #141840   (surface level 2)
  Electric Indigo:  #5B4CF5   (primary brand)
  Indigo Light:     #7C6FFF   (primary hover)
  Indigo Dark:      #3D2FD4   (primary active)
  Neon Aqua:        #00D4FF   (secondary / Agent active indicator)
  Aqua Dim:         #00A3C8   (secondary hover)

ACCENT (Unexpected — creates premium feel):
  Amber Gold:       #F59E0B   (accent for revenue, payments, success)
  Gold Dim:         #D97706   (accent hover)

NEUTRAL SCALE:
  50:  #F8F9FF   100: #EEF0FF   200: #D4D8FF
  300: #A8AEFF   400: #7A82CC   500: #555E99
  600: #3D4470   700: #2A2F50   800: #1A1F38
  900: #0D1028

SEMANTIC:
  Success:  #10B981  (Emerald — project delivered)
  Warning:  #F59E0B  (Amber — attention needed)
  Error:    #EF4444  (Red — agent failure, declined)
  Info:     #00D4FF  (Aqua — general information)

AGENT COLOR CODING:
  Agent 1:  #5B4CF5  (Indigo — Discovery)
  Agent 2:  #00D4FF  (Aqua — Outreach)
  Agent 3:  #F59E0B  (Amber — Deal Closing)
```

### Typography System

```
DISPLAY FONT: "Syne" (Google Fonts)
  — Bold, geometric, editorial. Sharp angles convey precision and intelligence.
  — Weights used: Bold (700), ExtraBold (800)
  — Use for: Hero headings, agent names, section titles, KPI numbers

BODY FONT: "DM Sans" (Google Fonts)
  — Clean, slightly warm geometric sans-serif. Readable at small sizes.
  — Weights used: Regular (400), Medium (500), SemiBold (600)
  — Use for: Body copy, labels, descriptions, table content, micro-copy

MONO FONT: "JetBrains Mono" (Google Fonts)
  — Technical, clear, excellent for data and agent logs.
  — Use for: Agent activity logs, API response previews, code blocks, timestamps

IMPORT (Google Fonts):
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

TYPE SCALE (Modular, ratio 1.25, base 16px):
  xs:   12px    Captions, timestamps, badges
  sm:   14px    Labels, secondary text, table cells
  base: 16px    Body text, form inputs
  md:   20px    Card titles, sub-headings
  lg:   25px    Section headings
  xl:   31px    Page titles
  2xl:  39px    Dashboard KPIs, large numbers
  3xl:  48px    Hero sub-heading
  4xl:  61px    Hero heading
  5xl:  76px    Landing page display

LINE HEIGHT:
  Display (4xl–5xl): 1.0 – 1.05 (extremely tight)
  Headings (xl–3xl): 1.15 – 1.25
  Subheadings (md–lg): 1.3 – 1.4
  Body (base–sm): 1.6 – 1.7
  Captions (xs): 1.4

LETTER SPACING:
  5xl display:   -0.04em  (tight)
  4xl display:   -0.03em  (tight)
  Section heads: -0.02em
  Body:           0em     (neutral)
  Labels/caps:   +0.06em  (slightly open)
  ALL CAPS:      +0.10em  (wide)
```

---

## 🗺️ SCREEN MAP — ALL SCREENS

### PUBLIC SCREENS (No Auth Required)
```
/                     → Landing Page (NEXORIS showcase)
/booking              → Consultation booking (Cal.com embedded)
/client/[token]       → Client portal (token-based access, no login required)
/client/[token]/pay   → Payment screen
/client/[token]/portal → Project tracking screen
```

### AUTH SCREENS
```
/login                → Admin login
/signup               → Admin registration
/forgot-password      → Password recovery
/reset-password       → New password
/verify-email         → Email confirmation
```

### ADMIN SCREENS (Protected: ADMIN role)
```
/dashboard            → Command center (main dashboard)
/dashboard/agents     → Agent management + configuration
/dashboard/agents/[id]→ Individual agent detail + logs
/dashboard/prospects  → Prospect database
/dashboard/prospects/[id] → Single prospect detail + conversation
/dashboard/outreach   → Email campaigns + A/B analytics
/dashboard/projects   → All active projects
/dashboard/projects/[id] → Project detail
/dashboard/payments   → Revenue + payment history
/dashboard/analytics  → Conversion metrics + reports
/dashboard/notifications → Notification center
/dashboard/settings   → Agent guardrails + configuration
/dashboard/settings/agents  → Agent behavior config
/dashboard/settings/pricing → Price range guardrails
/dashboard/settings/email   → Sender settings
/dashboard/settings/integrations → API key management
```

### ERROR & EMPTY STATES
```
/404                  → Not found
/403                  → Access denied
/500                  → Server error
```

---

## 🏗️ PHASE-BY-PHASE BUILD GUIDE

---

### ━━━ PHASE 1 — PROJECT SCAFFOLD ━━━

**Step 1.1 — Initialize Repository**
```bash
# Create Next.js project
npx create-next-app@latest nexoris \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd nexoris

# Core dependencies
npm install framer-motion gsap @gsap/react
npm install zustand @tanstack/react-query
npm install lucide-react clsx tailwind-merge
npm install next-themes
npm install react-hook-form zod @hookform/resolvers
npm install @supabase/supabase-js @supabase/ssr
npm install stripe @stripe/stripe-js
npm install resend
npm install date-fns
npm install recharts
npm install sonner  # toast notifications

# Dev dependencies
npm install -D @types/node vitest playwright
```

**Step 1.2 — Folder Structure**
```
nexoris/
├── src/
│   ├── app/
│   │   ├── (public)/           # Landing, booking, client portal
│   │   ├── (auth)/             # Login, signup, verify
│   │   ├── (admin)/            # Dashboard and all admin screens
│   │   │   └── dashboard/
│   │   ├── api/
│   │   │   ├── agents/         # Agent trigger endpoints
│   │   │   ├── prospects/      # Prospect CRUD
│   │   │   ├── outreach/       # Email management
│   │   │   ├── projects/       # Project management
│   │   │   ├── payments/       # Stripe webhooks + links
│   │   │   └── notifications/  # Notification management
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # Design system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Drawer.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── agents/             # Agent-specific components
│   │   │   ├── AgentCard.tsx
│   │   │   ├── AgentActivityFeed.tsx
│   │   │   ├── AgentStatusBadge.tsx
│   │   │   └── AgentFlowVisualizer.tsx
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── KPICard.tsx
│   │   │   ├── ActivityTimeline.tsx
│   │   │   ├── ProspectTable.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   └── ConversionFunnel.tsx
│   │   ├── notifications/
│   │   │   ├── NotificationBell.tsx
│   │   │   └── NotificationCenter.tsx
│   │   ├── layout/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminTopbar.tsx
│   │   │   └── ClientNav.tsx
│   │   └── landing/            # Landing page sections
│   ├── lib/
│   │   ├── supabase/           # Supabase client + server
│   │   ├── stripe.ts
│   │   ├── resend.ts
│   │   ├── gemini.ts           # Google AI client
│   │   ├── places.ts           # Google Places API client
│   │   ├── validations.ts      # Zod schemas
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAgentStatus.ts
│   │   ├── useRealtime.ts
│   │   ├── useNotifications.ts
│   │   └── useProspects.ts
│   ├── store/
│   │   ├── agentStore.ts       # Agent states + controls
│   │   ├── notificationStore.ts
│   │   └── uiStore.ts          # Sidebar, modals, theme
│   ├── styles/
│   │   ├── globals.css         # Design tokens + base
│   │   └── animations.css      # Custom animation utilities
│   └── types/
│       ├── agent.ts
│       ├── prospect.ts
│       ├── project.ts
│       ├── payment.ts
│       └── notification.ts
├── agent-workers/              # Python FastAPI agent workers
│   ├── agent1/                 # Discovery agent
│   ├── agent2/                 # Outreach agent
│   └── agent3/                 # Negotiation agent
├── errors/                     # Bug fix documentation
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local
├── .env.example
└── README.md
```

**Step 1.3 — Environment Variables**
```bash
# .env.example (commit this — no secrets)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google APIs
GOOGLE_PLACES_API_KEY=your_places_api_key
GOOGLE_AI_API_KEY=your_gemini_api_key

# Anthropic (optional, secondary AI)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Resend (email)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=outreach@yourdomain.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Cal.com
CAL_COM_API_KEY=your_calcom_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
AGENT_WORKER_URL=http://localhost:8000

# Notifications (owner email)
OWNER_EMAIL=your@email.com
```

**Step 1.4 — Git Setup**
```bash
git init
git add .
git commit -m "Initialize NEXORIS project"
git branch -M main
git checkout -b dev

# Feature branch convention
git checkout -b feature/landing-page
git checkout -b feature/auth-screens
git checkout -b feature/admin-dashboard
git checkout -b feature/agent-1
# etc.
```

---

### ━━━ PHASE 2 — DESIGN SYSTEM IMPLEMENTATION ━━━

**Step 2.1 — Design Tokens (globals.css)**
```css
:root {
  /* Brand Colors */
  --color-primary:        #5B4CF5;
  --color-primary-light:  #7C6FFF;
  --color-primary-dark:   #3D2FD4;
  --color-secondary:      #00D4FF;
  --color-secondary-dim:  #00A3C8;
  --color-accent:         #F59E0B;
  --color-accent-dim:     #D97706;

  /* Agent Colors */
  --agent-1-color:        #5B4CF5;
  --agent-2-color:        #00D4FF;
  --agent-3-color:        #F59E0B;

  /* Semantic */
  --color-success:        #10B981;
  --color-warning:        #F59E0B;
  --color-error:          #EF4444;
  --color-info:           #00D4FF;

  /* Typography */
  --font-display: 'Syne', 'Georgia', serif;
  --font-body:    'DM Sans', 'Helvetica Neue', sans-serif;
  --font-mono:    'JetBrains Mono', 'Courier New', monospace;

  /* Spacing */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px; --space-24: 96px;

  /* Border Radius */
  --radius-sm:   4px;   --radius-md: 8px;
  --radius-lg:  16px;   --radius-xl: 24px;
  --radius-full: 9999px;

  /* Glass Effect Tokens */
  --glass-bg:      rgba(255, 255, 255, 0.04);
  --glass-border:  rgba(255, 255, 255, 0.08);
  --glass-blur:    16px;
  --glass-shadow:  0 8px 32px rgba(0, 0, 0, 0.4);

  /* Motion */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter:    cubic-bezier(0, 0, 0.2, 1);
  --ease-exit:     cubic-bezier(0.4, 0, 1, 1);
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 350ms;
}

[data-theme='dark'] {
  --bg-base:         #08091A;
  --bg-surface:      #0D1030;
  --bg-elevated:     #141840;
  --bg-overlay:      rgba(8, 9, 26, 0.9);
  --border-default:  rgba(255, 255, 255, 0.08);
  --border-strong:   rgba(255, 255, 255, 0.16);
  --text-primary:    #F0F2FF;
  --text-secondary:  #8B93C4;
  --text-muted:      #555E99;
  --shadow-md:       0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg:       0 8px 32px rgba(0, 0, 0, 0.6);
}

[data-theme='light'] {
  --bg-base:         #F8F9FF;
  --bg-surface:      #FFFFFF;
  --bg-elevated:     #FFFFFF;
  --bg-overlay:      rgba(248, 249, 255, 0.95);
  --border-default:  rgba(0, 0, 0, 0.08);
  --border-strong:   rgba(0, 0, 0, 0.16);
  --text-primary:    #08091A;
  --text-secondary:  #3D4470;
  --text-muted:      #7A82CC;
  --shadow-md:       0 4px 16px rgba(91, 76, 245, 0.08);
  --shadow-lg:       0 8px 32px rgba(91, 76, 245, 0.12);
}
```

**Step 2.2 — Tailwind Config**
```javascript
// tailwind.config.ts
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      screens: {
        'xs': '320px', 'sm': '480px', 'md': '768px',
        'lg': '1024px', 'xl': '1280px', '2xl': '1440px',
      },
      colors: {
        brand: {
          primary: '#5B4CF5', 'primary-light': '#7C6FFF',
          secondary: '#00D4FF', accent: '#F59E0B',
        },
        midnight: {
          deep: '#08091A', mid: '#0D1030', raised: '#141840',
        },
      },
      fontFamily: {
        display: ['Syne', 'Georgia', 'serif'],
        body: ['DM Sans', 'Helvetica Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
}
```

**Step 2.3 — Glass Liquid Component Utility**
```typescript
// lib/utils.ts — Glass surface class generator
export const glass = (opacity = 0.04) => ({
  background: `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
})

// Tailwind glass utility classes
// Add to globals.css:
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.glass-hover:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.14);
  transition: all var(--duration-normal) var(--ease-standard);
}
```

---

### ━━━ PHASE 3 — DATABASE SCHEMA ━━━

**Complete Supabase / PostgreSQL Schema:**

```sql
-- USERS (handled by Supabase Auth, extended here)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'ADMIN'
                CHECK (role IN ('ADMIN', 'SUPER')),
  owner_email   TEXT,          -- where to send owner notifications
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AGENT CONFIGURATIONS
CREATE TABLE agent_configs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_number  INT NOT NULL CHECK (agent_number IN (1, 2, 3)),
  is_active     BOOLEAN NOT NULL DEFAULT FALSE,
  config        JSONB NOT NULL DEFAULT '{}',
  -- Agent 1 config: { target_cities, categories, max_prospects_per_run }
  -- Agent 2 config: { sender_name, sender_email, send_time_window, ab_ratio }
  -- Agent 3 config: { min_price, max_price, services, discount_ceiling }
  last_run_at   TIMESTAMPTZ,
  runs_count    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (owner_id, agent_number)
);

-- PROSPECTS (found by Agent 1)
CREATE TABLE prospects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id         UUID NOT NULL REFERENCES profiles(id),
  business_name    TEXT NOT NULL,
  category         TEXT NOT NULL,
  address          TEXT,
  city             TEXT NOT NULL,
  country          TEXT NOT NULL DEFAULT 'NG',
  phone            TEXT,
  email            TEXT,
  website          TEXT,
  google_maps_id   TEXT UNIQUE,
  google_rating    DECIMAL(2,1),
  review_count     INT,
  pain_points      JSONB NOT NULL DEFAULT '[]',
  -- e.g. ["no_website", "no_social_media", "low_engagement"]
  ai_score         INT,            -- 0-100 outreach worthiness score
  ai_analysis      TEXT,           -- Full AI analysis text
  status           TEXT NOT NULL DEFAULT 'DISCOVERED'
                   CHECK (status IN (
                     'DISCOVERED', 'ANALYZING', 'QUEUED',
                     'CONTACTED', 'OPENED', 'REPLIED',
                     'INTERESTED', 'NEGOTIATING', 'AGREED',
                     'PAID', 'IN_PROGRESS', 'DELIVERED',
                     'DECLINED', 'UNRESPONSIVE', 'BLACKLISTED'
                   )),
  mockup_url       TEXT,           -- Preview asset URL (Supabase Storage)
  client_token     TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  deleted_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_prospects_owner ON prospects(owner_id);
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_city ON prospects(city);
CREATE INDEX idx_prospects_client_token ON prospects(client_token);

-- OUTREACH EMAILS (managed by Agent 2)
CREATE TABLE outreach_emails (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id     UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES profiles(id),
  subject         TEXT NOT NULL,
  body_html       TEXT NOT NULL,
  body_text       TEXT NOT NULL,
  variation       TEXT NOT NULL DEFAULT 'A' CHECK (variation IN ('A', 'B')),
  resend_id       TEXT,             -- Resend message ID
  status          TEXT NOT NULL DEFAULT 'DRAFT'
                  CHECK (status IN (
                    'DRAFT', 'SCHEDULED', 'SENT',
                    'DELIVERED', 'OPENED', 'CLICKED',
                    'REPLIED', 'BOUNCED', 'FAILED'
                  )),
  sent_at         TIMESTAMPTZ,
  opened_at       TIMESTAMPTZ,
  clicked_at      TIMESTAMPTZ,
  replied_at      TIMESTAMPTZ,
  open_count      INT NOT NULL DEFAULT 0,
  click_count     INT NOT NULL DEFAULT 0,
  ai_prompt_used  TEXT,             -- prompt that generated this email
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_emails_prospect ON outreach_emails(prospect_id);
CREATE INDEX idx_emails_status ON outreach_emails(status);

-- CONVERSATIONS (Agent 3 ↔ Client)
CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id     UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  sender          TEXT NOT NULL CHECK (sender IN ('AGENT', 'CLIENT')),
  channel         TEXT NOT NULL CHECK (channel IN ('EMAIL', 'PORTAL', 'SYSTEM')),
  message         TEXT NOT NULL,
  metadata        JSONB DEFAULT '{}',
  -- e.g. { price_offered, price_accepted, action_taken }
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_conversations_prospect ON conversations(prospect_id);

-- PROJECTS
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id     UUID NOT NULL REFERENCES prospects(id),
  owner_id        UUID NOT NULL REFERENCES profiles(id),
  service_type    TEXT NOT NULL,
  -- e.g. "website", "social_media_package", "automation"
  title           TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'NOT_STARTED'
                  CHECK (status IN (
                    'NOT_STARTED', 'IN_PROGRESS',
                    'REVIEW', 'DELIVERED', 'COMPLETED'
                  )),
  deadline        TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  delivery_files  JSONB DEFAULT '[]',
  -- Array of { name, url, size, type }
  delivery_notes  TEXT,
  client_approved BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_projects_prospect ON projects(prospect_id);
CREATE INDEX idx_projects_status ON projects(status);

-- PAYMENTS
CREATE TABLE payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id         UUID NOT NULL REFERENCES prospects(id),
  project_id          UUID REFERENCES projects(id),
  owner_id            UUID NOT NULL REFERENCES profiles(id),
  amount              DECIMAL(10,2) NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'USD',
  status              TEXT NOT NULL DEFAULT 'PENDING'
                      CHECK (status IN (
                        'PENDING', 'LINK_SENT', 'PAID',
                        'REFUNDED', 'FAILED', 'DISPUTED'
                      )),
  stripe_payment_intent TEXT,
  stripe_session_id     TEXT,
  stripe_receipt_url    TEXT,
  payment_link        TEXT,
  link_sent_at        TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  receipt_sent_at     TIMESTAMPTZ,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_payments_prospect ON payments(prospect_id);
CREATE INDEX idx_payments_status ON payments(status);

-- NOTIFICATIONS (for owner)
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES profiles(id),
  prospect_id     UUID REFERENCES prospects(id),
  project_id      UUID REFERENCES projects(id),
  type            TEXT NOT NULL,
  -- 'PROSPECT_FOUND' | 'EMAIL_SENT' | 'EMAIL_OPENED' | 'REPLY_RECEIVED'
  -- | 'MEETING_BOOKED' | 'DEAL_AGREED' | 'PAYMENT_RECEIVED'
  -- | 'PROJECT_DELIVERED' | 'AGENT_ERROR' | 'AGENT_NEEDS_APPROVAL'
  title           TEXT NOT NULL,
  message         TEXT NOT NULL,
  action_url      TEXT,
  priority        TEXT NOT NULL DEFAULT 'NORMAL'
                  CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  requires_action BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notifications_owner ON notifications(owner_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- AGENT ACTIVITY LOGS
CREATE TABLE agent_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES profiles(id),
  agent       INT NOT NULL CHECK (agent IN (1, 2, 3)),
  action      TEXT NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('RUNNING', 'SUCCESS', 'ERROR', 'SKIPPED')),
  prospect_id UUID REFERENCES prospects(id),
  details     JSONB DEFAULT '{}',
  duration_ms INT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_agent_logs_agent ON agent_logs(agent);
CREATE INDEX idx_agent_logs_created ON agent_logs(created_at DESC);
```

---

### ━━━ PHASE 4 — FRONTEND SCREENS BUILD ORDER ━━━

Build screens in this exact order. Each screen confirmed working before moving to next.

**BATCH A — Entry Screens (Week 1)**
1. `/` — Landing Page
2. `/login` — Admin Login
3. `/signup` — Admin Registration
4. `/verify-email` — Email verification
5. `/forgot-password` — Password recovery

**BATCH B — Admin Core (Week 2)**
6. `/dashboard` — Command Center (main)
7. `/dashboard/agents` — Agent Management
8. `/dashboard/notifications` — Notification Center

**BATCH C — Prospect & Outreach (Week 3)**
9. `/dashboard/prospects` — Prospect Database
10. `/dashboard/prospects/[id]` — Single Prospect
11. `/dashboard/outreach` — Email Campaigns

**BATCH D — Projects & Payments (Week 4)**
12. `/dashboard/projects` — Project Management
13. `/dashboard/projects/[id]` — Project Detail
14. `/dashboard/payments` — Revenue Dashboard

**BATCH E — Analytics & Settings (Week 5)**
15. `/dashboard/analytics` — Metrics + Reports
16. `/dashboard/settings/*` — All settings screens

**BATCH F — Client Facing (Week 6)**
17. `/client/[token]` — Client Portal Entry
18. `/client/[token]/pay` — Payment Screen
19. `/booking` — Public Booking Page

**BATCH G — Polish (Week 7)**
20. `/404`, `/403`, `/500` — Error screens
21. All empty states
22. All loading/skeleton states
23. Mobile responsive QA pass
24. Dark/light mode QA pass

---

### ━━━ PHASE 5 — AGENT WORKER ARCHITECTURE ━━━

**Python FastAPI Agent Workers (agent-workers/)**

Each agent runs as a separate FastAPI service on Railway. They communicate with the Next.js API via authenticated HTTP calls and with each other via Supabase database state changes + Supabase Realtime.

**Agent 1 — Business Discovery Worker:**
```python
# agent-workers/agent1/main.py

Flow:
1. Receive trigger (HTTP POST from Next.js API or scheduled cron)
2. Read config from DB: { target_cities, categories, max_per_run }
3. For each city + category combination:
   a. Call Google Places API (Text Search)
   b. For each business returned:
      - Check if already in prospects table (skip duplicates)
      - Fetch business details (Places Details API)
      - Scrape website if URL exists
      - Check social media presence
   c. For each new business:
      - Call Gemini AI to analyze pain points
      - Score outreach worthiness (0-100)
      - Extract and validate contact details
      - Insert into prospects table with status='DISCOVERED'
      - Create notification: "New prospect found: [Business Name]"
   d. Update agent_logs with results
4. Trigger Agent 2 for each DISCOVERED prospect above threshold score
```

**Agent 2 — Outreach Intelligence Worker:**
```python
# agent-workers/agent2/main.py

Flow:
1. Receive trigger with prospect_id
2. Load prospect data from DB
3. Generate personalized email:
   a. System prompt: "You are a professional outreach specialist writing
      for [Owner Name/Company]. Write a personalized email to [Business Name]
      that specifically addresses their [pain_points]. Do not be generic.
      Reference their specific situation. Tone: warm, professional, direct."
   b. Generate Variation A and Variation B
   c. Select send variation based on A/B ratio config
4. Generate mockup preview (if business needs website):
   - Use template system to create HTML preview
   - Upload to Supabase Storage
   - Add preview URL to email
5. Schedule email for optimal send time (business hours in prospect's timezone)
6. Send via Resend API
7. Update outreach_emails table with resend_id, status='SENT'
8. Create notification: "Email sent to [Business Name]"
9. Begin tracking loop (check for opens/clicks every 30 mins)
10. When reply detected → update status='REPLIED' → trigger Agent 3
```

**Agent 3 — Negotiation & Delivery Worker:**
```python
# agent-workers/agent3/main.py

Flow:
1. Receive trigger: prospect replied with interest
2. Load full context: business profile, pain points, email history, config
3. Classify reply intent:
   - INTERESTED → Proceed to negotiation
   - QUESTION → Answer question + re-pitch
   - PRICE_OBJECTION → Apply negotiation strategy
   - NOT_INTERESTED → Update status='DECLINED', stop
   - MEETING_REQUEST → Book via Cal.com API
4. Negotiation loop:
   a. Generate response within price guardrails
   b. System prompt: "You are a negotiation specialist for [Owner].
      Services offered: [list]. Price range: $[min]-$[max].
      You may offer up to [discount_ceiling]% discount.
      Do NOT go below minimum price. Be helpful and persuasive.
      Current conversation: [full history]"
   c. Send response via Resend
   d. Log to conversations table
   e. Create notification for each exchange
5. When deal agreed:
   a. Create project record in DB
   b. Generate Stripe payment link for agreed amount
   c. Send payment link to client via email + portal
   d. Create notification: "Deal agreed with [Business Name] for $[amount]"
6. When payment received (Stripe webhook):
   a. Update payment status='PAID'
   b. Send receipt to client
   c. Create project tasks
   d. Notify owner: "Payment received: $[amount] from [Business Name]"
7. Project delivery:
   a. Monitor project status in DB
   b. When owner marks project as ready, automatically notify client
   c. Send delivery email with portal access link
   d. Create notification: "Project delivered to [Business Name]"
```

---

### ━━━ PHASE 6 — API ENDPOINTS ━━━

```
AGENT MANAGEMENT:
POST   /api/agents/[id]/start          Start an agent (owner only)
POST   /api/agents/[id]/stop           Stop an agent (owner only)
GET    /api/agents/status              Get all agent statuses
GET    /api/agents/[id]/logs           Get agent activity logs
PATCH  /api/agents/[id]/config         Update agent configuration

PROSPECTS:
GET    /api/prospects                  List all (paginated, filterable)
GET    /api/prospects/[id]             Get single prospect + full detail
PATCH  /api/prospects/[id]/status      Manually update status
DELETE /api/prospects/[id]             Soft delete prospect
GET    /api/prospects/[id]/conversation Get full conversation history

OUTREACH:
GET    /api/outreach                   List all emails (paginated)
GET    /api/outreach/analytics         A/B test results + metrics
POST   /api/outreach/[id]/resend       Manually trigger resend
POST   /api/outreach/track/open        Email open pixel tracking
POST   /api/outreach/track/click       Email click tracking

PROJECTS:
GET    /api/projects                   List all projects
GET    /api/projects/[id]              Get project detail
PATCH  /api/projects/[id]              Update project status
POST   /api/projects/[id]/deliver      Mark project as delivered + notify client
POST   /api/projects/[id]/files        Upload delivery files

PAYMENTS:
GET    /api/payments                   List all payments
POST   /api/payments/create-link       Create Stripe payment link
POST   /api/payments/webhook           Stripe webhook handler
GET    /api/payments/analytics         Revenue stats

NOTIFICATIONS:
GET    /api/notifications              Get owner notifications (paginated)
PATCH  /api/notifications/[id]/read    Mark single as read
POST   /api/notifications/read-all     Mark all as read
GET    /api/notifications/unread-count Fast unread count for badge

CLIENT PORTAL (public, token-based):
GET    /api/client/[token]             Verify token + get client data
GET    /api/client/[token]/project     Get project status + files
POST   /api/client/[token]/message     Client sends message to Agent 3

ANALYTICS:
GET    /api/analytics/overview         Dashboard KPIs
GET    /api/analytics/conversion       Funnel metrics
GET    /api/analytics/revenue          Revenue over time
GET    /api/analytics/agents           Per-agent performance
```

---

### ━━━ PHASE 7 — STATE MANAGEMENT ━━━

```typescript
// store/agentStore.ts — Zustand
interface AgentStore {
  agents: {
    1: AgentState;
    2: AgentState;
    3: AgentState;
  };
  startAgent: (id: 1 | 2 | 3) => void;
  stopAgent: (id: 1 | 2 | 3) => void;
  updateAgentStatus: (id: 1 | 2 | 3, status: AgentStatus) => void;
}

// store/notificationStore.ts
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  toggleCenter: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Notification) => void; // called by Supabase Realtime
}

// store/uiStore.ts
interface UIStore {
  sidebarOpen: boolean;
  activeMobile: string;
  theme: 'dark' | 'light';
  activeModal: string | null;
  setSidebarOpen: (v: boolean) => void;
  setTheme: (t: 'dark' | 'light') => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

// SERVER STATE (TanStack Query)
// All API data is fetched here. Not stored in Zustand.
// Examples:
useProspects({ page, status, city })     → GET /api/prospects
useProspect(id)                           → GET /api/prospects/[id]
useProjects({ status })                   → GET /api/projects
usePayments({ month })                    → GET /api/payments
useAnalytics()                            → GET /api/analytics/overview
useAgentLogs(agentId)                     → GET /api/agents/[id]/logs

// REALTIME (Supabase Realtime)
// Subscribed to:
// - notifications table (INSERT) → trigger notification store update
// - agent_logs table (INSERT) → trigger live activity feed update
// - prospects table (UPDATE) → trigger prospect list refresh
```

---

### ━━━ PHASE 8 — ADMIN DASHBOARD: COMMAND CENTER ━━━

The main dashboard is the most important screen. It must feel like a mission control center.

**Layout:**
- Fixed left sidebar (240px wide, collapsible to 64px on mobile)
- Top bar with notification bell, theme toggle, user avatar
- Main content area: scrollable
- Right panel (optional): agent activity feed (320px, slide-in)

**Main Dashboard Sections:**

1. **Agent Status Bar** (top of page, full width)
   - Three agent cards side by side
   - Each shows: Agent name, current status (ACTIVE/IDLE/ERROR), last action, prospects processed today
   - Each has a START/STOP toggle
   - Animated pulse indicator when active (Agent 1: indigo, Agent 2: aqua, Agent 3: amber)

2. **KPI Cards Row** (4 cards)
   - Total Prospects Found | Emails Sent | Deals Closed | Revenue Generated
   - Each card: large number in Syne font, % change vs last week, sparkline chart

3. **Conversion Funnel** (left, 60% width)
   - Visual funnel: Discovered → Contacted → Opened → Replied → Interested → Agreed → Paid → Delivered
   - Numbers at each stage, drop-off percentages between stages

4. **Live Activity Feed** (right, 40% width)
   - Real-time stream of agent actions
   - Each entry: agent badge (color-coded), action description, prospect name, timestamp
   - Infinite scroll, newest at top
   - Supabase Realtime subscription

5. **Recent Prospects Table** (bottom)
   - Columns: Business Name, Category, City, Pain Points, Status, Agent Activity, Last Updated, Actions
   - Status badges color-coded
   - Quick action buttons: View, Pause Outreach, Blacklist

6. **Revenue Chart** (bottom right)
   - Bar chart: Revenue by week/month
   - Recharts with custom glass styling
   - Line overlay: Number of deals closed

---

### ━━━ PHASE 9 — NOTIFICATION SYSTEM ━━━

```
NOTIFICATION EVENTS + MESSAGES:

AGENT 1 — Discovery:
  PROSPECT_FOUND (LOW)
  → Title: "New prospect discovered"
  → Message: "Agent 1 found {business_name} in {city}. Score: {ai_score}/100. Pain points: {pain_points}"

AGENT 2 — Outreach:
  EMAIL_SENT (LOW)
  → "Outreach email sent to {business_name}"

  EMAIL_OPENED (NORMAL)
  → "{business_name} opened your email — {open_count} time(s)"

  EMAIL_CLICKED (NORMAL)
  → "{business_name} clicked the link in your email"

  REPLY_RECEIVED (HIGH) ⚡
  → "{business_name} replied to your outreach! Agent 3 is taking over."

AGENT 3 — Negotiation & Delivery:
  NEGOTIATION_STARTED (NORMAL)
  → "Agent 3 started negotiating with {business_name}"

  MEETING_BOOKED (NORMAL)
  → "{business_name} booked a consultation for {date_time}"

  DEAL_AGREED (HIGH) ⚡
  → "Deal agreed with {business_name} for ${amount}. Payment link sent."

  PAYMENT_RECEIVED (URGENT) 🎉
  → "Payment received: ${amount} from {business_name}. Project started."

  PROJECT_DELIVERED (HIGH)
  → "Project delivered to {business_name}. Awaiting client confirmation."

  AGENT_NEEDS_APPROVAL (URGENT) 🚨
  → "Agent 3 needs your decision on {business_name}: {situation_summary}"

SYSTEM:
  AGENT_ERROR (URGENT) 🚨
  → "Agent {number} encountered an error: {error_message}. Manual review needed."
```

---

### ━━━ PHASE 10 — PAYMENT FLOW ━━━

```
1. Agent 3 reaches price agreement with client
2. Backend creates Stripe Checkout Session:
   - Amount: agreed amount
   - Metadata: { prospect_id, project_id, owner_id }
   - Success URL: /client/[token]/portal?payment=success
   - Cancel URL: /client/[token]/pay?cancelled=true
3. Payment link stored in payments table, status='LINK_SENT'
4. Email sent to client with payment link + deadline (24hrs)
5. Client completes payment on Stripe-hosted page
6. Stripe calls POST /api/payments/webhook
7. Webhook verified (stripe.webhooks.constructEvent)
8. payments table updated: status='PAID', paid_at=now()
9. prospects table updated: status='PAID'
10. projects table updated: status='IN_PROGRESS'
11. Owner notification: PAYMENT_RECEIVED (URGENT)
12. Client receipt email sent automatically via Resend
13. Client portal updated with project start confirmation
```

---

### ━━━ PHASE 11 — TESTING ━━━

```
UNIT TESTS (Vitest):
□ AI score calculator function
□ Email variation selector logic
□ Price guardrail validator
□ Stripe webhook signature verifier
□ Client token generator
□ Pain point classifier
□ Notification message formatter

INTEGRATION TESTS:
□ POST /api/agents/1/start → returns 200, updates DB
□ GET /api/prospects → returns paginated list
□ POST /api/payments/webhook → updates payment + triggers notifications
□ GET /api/client/[token] → returns correct client data
□ POST /api/notifications/read-all → marks all as read

E2E TESTS (Playwright):
□ Admin signs up → verifies email → logs in → reaches dashboard
□ Admin configures Agent 1 → starts agent → sees prospects appear
□ Admin views prospect → sees AI analysis → sees email sent
□ Admin sees notification → clicks through to prospect detail
□ Client receives email → clicks link → enters portal → pays → sees project
```

---

### ━━━ PHASE 12 — DEPLOYMENT ━━━

**Vercel (Frontend + API Routes):**
```
Build Command:     next build
Output Directory:  .next
Install Command:   npm install
Framework:         Next.js

Environment Variables (add ALL from .env.local):
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  GOOGLE_PLACES_API_KEY
  GOOGLE_AI_API_KEY
  RESEND_API_KEY
  STRIPE_SECRET_KEY
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  STRIPE_WEBHOOK_SECRET
  CAL_COM_API_KEY
  AGENT_WORKER_URL (Railway URL)
  OWNER_EMAIL
```

**Railway (Python Agent Workers):**
```
Each agent worker deployed as separate Railway service
Dockerfile in each agent-workers/agent[n]/ directory
Environment variables mirrored from Vercel
Cron jobs configured in Railway dashboard
```

---

## 📦 COMPLETE PROMPT LIBRARY — NEXORIS

---

### PROMPT 1 — Brand Design System JSON

```
You are a senior brand designer and design systems engineer with 20+ years of experience.

Generate the complete NEXORIS brand design system in JSON format.

Brand details:
- Name: NEXORIS
- Tagline: "Find. Connect. Close. Automatically."
- Product: Fully automated multi-agent business outreach system
- Audience: Freelancers, developers, agencies, solo operators
- Tone: Confident, precise, slightly futuristic, intelligent
- Primary design style: Glass Liquid Design
- Primary dark background: #08091A (deep midnight space)
- Primary brand color: #5B4CF5 (electric indigo)
- Secondary: #00D4FF (neon aqua)
- Accent: #F59E0B (amber gold — unexpected, for success + revenue)
- Display font: Syne (Google Fonts) — Bold 700, ExtraBold 800
- Body font: DM Sans (Google Fonts) — Regular 400, Medium 500, SemiBold 600
- Mono font: JetBrains Mono (Google Fonts)

The JSON must include ALL of the following sections with zero placeholders:

1. brand_identity (name, tagline, mission, vision, brand_statement, tone, archetype, personality_traits)
2. logo (type, concept, clearance_zone, min_size, variants: full_color/white/black/mono/icon_only)
3. colors (full palette: primary/secondary/accent/neutrals 50-900/semantic/agent_colors/gradients)
4. dark_mode_tokens (complete token set: bg_base, bg_surface, bg_elevated, border, text, shadow)
5. light_mode_tokens (complete token set)
6. typography (display_font, body_font, mono_font each with name/source/weights/fallback, full modular scale, line_height per use_case, letter_spacing per use_case)
7. spacing (4px base, full scale 1-24)
8. border_radius (sm/md/lg/xl/full)
9. shadows (sm/md/lg/xl/glass/glow/agent_glow variants)
10. glass_liquid_tokens (bg_opacity, blur, border_opacity, shadow)
11. motion (duration_tokens, easing_tokens, animation_specs per motion type)
12. buttons (all 8 types, all 5 sizes, all states)
13. forms (all component types, all states, design rules)
14. breakpoints (xs through 2xl with px values)
15. z_index (base/dropdown/sticky/overlay/modal/toast/tooltip)
16. icons (library: Lucide React, size scale, style rules)
17. agent_system (agent 1/2/3 colors, status badge styles, activity indicator specs)
18. design_style (primary: Glass Liquid details, alternatives with fit scores)
19. screen_types (all screens with routes and types)
20. notification_types (all events with priority and badge colors)

Output ONLY valid, minified JSON. No markdown fences, no comments, no placeholders, no explanations.
```

---

### PROMPT 2 — Landing Page

```
You are a senior frontend engineer and UI/UX designer with 20+ years of experience.

Build the NEXORIS landing page as a complete Next.js component.

Brand:
- Name: NEXORIS — "Find. Connect. Close. Automatically."
- Design: Glass Liquid Design + Aurora UI accents
- Background: #08091A (deep midnight)
- Primary: #5B4CF5 (electric indigo)
- Secondary: #00D4FF (neon aqua)
- Accent: #F59E0B (amber gold)
- Display font: Syne (700, 800)
- Body font: DM Sans (400, 500, 600)
- Animation: Framer Motion

The landing page must include these sections in this order:

1. NAVIGATION
   - Logo left (NEXORIS wordmark)
   - Links center: Features, How It Works, Pricing, Demo
   - Right: "Sign In" text button + "Get Started" primary button
   - Sticky, glass background on scroll
   - Mobile hamburger menu

2. HERO SECTION
   - Eyebrow: "AI-Powered Client Acquisition"
   - H1 (Syne, 5xl, tight): "Your business, running itself."
   - Subheading (DM Sans, lg): "Three intelligent agents find, pitch, and close clients 24/7 while you focus on your craft."
   - CTA buttons: "Start Free" (primary, indigo) + "Watch Demo" (ghost)
   - Live counter: "X businesses contacted today" (animated, real-time feel)
   - Background: Aurora mesh gradient (indigo + aqua + deep midnight)
   - Floating glass card preview of the dashboard (3D tilt on mousemove)
   - Grain texture overlay (subtle, opacity 0.03)
   - Custom cursor (soft indigo glow ring)

3. AGENT SHOWCASE (Three columns)
   - Section title: "Three agents. One unstoppable pipeline."
   - Agent 1 card: icon (magnifying glass), title "Discovery Agent", description, animated data points appearing
   - Agent 2 card: icon (envelope/AI), title "Outreach Agent", description, animated email being written
   - Agent 3 card: icon (handshake/bolt), title "Negotiation Agent", description, animated payment confirmation
   - All cards: glass surfaces, agent color coding (indigo/aqua/amber)
   - Inter-card connection lines (animated SVG path from card to card)

4. HOW IT WORKS (Timeline)
   - 5 steps in a vertical timeline
   - Left: step number + title; Right: detail + visual
   - Scroll-triggered reveal (Framer Motion useInView)
   - Connected by animated vertical line

5. SOCIAL PROOF
   - "Trusted by 500+ solo operators and agencies"
   - 5 testimonial cards in horizontal scroll
   - Each: avatar, name, role, quote, star rating

6. PRICING (3 tiers)
   - Starter: Free (MVS — 50 prospects/mo)
   - Growth: $49/mo (500 prospects, all 3 agents)
   - Agency: $149/mo (unlimited, white label, priority support)
   - Toggle: Monthly / Annual (20% off)
   - Most popular badge on Growth tier

7. FINAL CTA
   - "Your pipeline doesn't have to sleep."
   - Large CTA button
   - Background: concentrated glow effect

8. FOOTER
   - Logo + tagline
   - Links: Product, Company, Legal
   - Copyright, social links

Requirements:
- Mobile-first, fully responsive at 320/480/768/1024/1280/1440px
- Dark mode (default) + light mode
- All animations with Framer Motion
- Human layout: deliberate asymmetry in hero, varied type weights
- Custom cursor effect in hero
- Scroll-triggered reveals throughout
- No Lorem Ipsum — all copy is final
- TypeScript strict mode
- All images: descriptive alt text
- All buttons: aria-label
- Semantic HTML throughout

Output: Complete, production-ready Next.js page component.
```

---

### PROMPT 3 — Admin Command Center Dashboard

```
You are building the NEXORIS admin command center dashboard.
This is the most important screen in the app — it must feel like
a real-time mission control interface for an intelligent autonomous system.

Tech: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts, Zustand
Design: Glass Liquid Design, dark theme (#08091A base)
Fonts: Syne (headings + KPI numbers), DM Sans (body + labels), JetBrains Mono (logs)
Colors: Primary #5B4CF5, Secondary #00D4FF, Accent #F59E0B

Layout:
- Fixed left sidebar (240px, collapsible to icon-only on mobile)
- Top bar: breadcrumb, notification bell with unread badge, theme toggle, user avatar
- Main content: CSS Grid, responsive

Sidebar navigation items:
  Dashboard (home icon) — active
  Agents (bot icon)
  Prospects (users icon)
  Outreach (mail icon)
  Projects (layers icon)
  Payments (credit-card icon)
  Analytics (bar-chart icon)
  Settings (settings icon)
  Notification Center (bell icon with badge)

Dashboard sections to build:

1. AGENT STATUS CARDS (3 cards, full width row)
   Each card contains:
   - Agent number + name (Syne, bold)
   - Status badge: ACTIVE (green pulse) / IDLE (gray) / ERROR (red pulse)
   - Current action text (DM Mono, sm, muted)
   - Stat: "X prospects processed today"
   - Toggle: Start/Stop agent
   - Progress bar: current task progress
   - Agent color: Agent 1 = indigo, Agent 2 = aqua, Agent 3 = amber
   - Glass card with agent-color glow on active state

2. KPI ROW (4 cards)
   - Total Prospects Found: large number + "↑ 24 today"
   - Emails Sent: large number + "X opened (Y%)"
   - Deals Closed: large number + "↑ 3 this week"
   - Revenue Generated: "$X,XXX" in amber/gold + "↑ $490 this week"
   - Each card: glass surface, subtle bottom border in agent or semantic color

3. SPLIT ROW — Funnel + Activity Feed
   Left (60%): Conversion Funnel
   - Horizontal funnel visualization
   - 8 stages: Discovered → Contacted → Opened → Replied → Interested → Agreed → Paid → Delivered
   - Each stage: count + conversion rate from previous
   - Visual: decreasing width bars with stage colors
   - Built with Recharts FunnelChart or custom SVG

   Right (40%): Live Agent Activity Feed
   - Real-time scrolling log of agent actions
   - Supabase Realtime subscription
   - Each entry: [Agent Badge] [Action] [Prospect Name] [Timestamp]
   - Agent badge: colored dot + "A1" / "A2" / "A3"
   - Scroll to top for newest entries
   - Smooth animation: new entries slide in from top
   - JetBrains Mono for log entries

4. REVENUE CHART (full width)
   - Bar chart: weekly revenue bars
   - Line overlay: deals closed per week
   - Date range selector: 7D / 30D / 90D / Custom
   - Recharts with custom glass-styled tooltip
   - Amber bars + indigo line

5. RECENT PROSPECTS TABLE
   - Columns: Business | Category | City | Pain Points | Status | Agent | Updated | Actions
   - Status badges: color-coded pills
   - Pain point chips (max 2 shown + "+N more" chip)
   - Actions: View button + kebab menu (Pause, Blacklist, Force Contact)
   - Pagination: 10 per page
   - Filter bar: by status, category, city, date range
   - Search input
   - TanStack Table implementation

Animations:
- KPI numbers count up on page load (Framer Motion)
- Agent status cards pulse when active
- Activity feed items slide in from right
- Funnel bars animate in on mount
- All skeleton states while loading (glass shimmer)
- Notification bell shakes when new URGENT notification arrives

State:
- Agent statuses: Zustand agentStore
- KPI data: TanStack Query (refetch every 60s)
- Activity feed: Supabase Realtime subscription
- Prospects: TanStack Query (paginated, filterable)
- Notification unread count: Zustand notificationStore

Accessibility:
- Sidebar: nav landmark, aria-current on active item
- KPI cards: role="region" aria-label per card
- Table: proper thead/tbody, scope attributes
- All icon buttons: aria-label
- Activity feed: aria-live="polite"
- Focus trap in mobile sidebar overlay

Output: Complete, production-ready Next.js dashboard page.
Make it feel alive, intelligent, and unmistakably premium.
```

---

### PROMPT 4 — Client Portal

```
You are building the NEXORIS client portal — a token-gated page
where business owners (the prospects Agent 2 contacted) can:
1. View their personalized proposal and mockup
2. See their project progress
3. Communicate with Agent 3
4. Pay via Stripe

Route: /client/[token] (no login required — token provides access)

Design: Glass Liquid Design — but lighter, warmer, more approachable than admin
Background: A softer dark (#0F1020) or light mode version
Client should feel: welcomed, impressed, safe, confident in paying

Screens within the portal:

SCREEN 1: /client/[token] — Welcome + Proposal
  - NEXORIS logo top left
  - Header: "Hello, {business_name} 👋"
  - Subheading: "Here's what we've prepared specifically for you."
  - Their AI-generated problem analysis:
    - "We noticed {pain_point_1}: {explanation}"
    - "This could be costing you X customers per month"
  - Mockup preview: iframe or image of their proposed solution
  - Services proposed: cards with service name, description, benefit
  - Pricing: displayed clearly (with or without negotiation context)
  - CTA: "I'm Interested" → opens chat with Agent 3
           "Book a Call" → Cal.com booking widget
           "Pay Now" → /client/[token]/pay

SCREEN 2: /client/[token]/chat — Conversation with Agent 3
  - Chat interface (WhatsApp-style)
  - Agent 3 messages on left (NEXORIS branded avatar)
  - Client messages on right
  - Client can type and send messages
  - Agent 3 responds (via backend + AI → Resend email + chat)
  - Timestamps, read receipts
  - "Agent 3 is thinking..." typing indicator (3 dot animation)

SCREEN 3: /client/[token]/pay — Payment Screen
  - Summary: Service, Amount, What's included
  - Trust badges: "Secured by Stripe" + "30-day satisfaction guarantee"
  - "Pay ${amount}" primary button → redirects to Stripe Checkout
  - Alternative: "Schedule a call first" text button
  - Small print: refund policy, what happens after payment

SCREEN 4: /client/[token]/portal — Project Tracking
  - "Your project is underway" header
  - Progress timeline: Paid → In Progress → Review → Delivered
  - Current stage highlighted with animated indicator
  - Estimated delivery date
  - Project files section (downloads when delivered)
  - Support: "Message Agent 3" button
  - Payment receipt download link

Requirements:
- Mobile-first (clients mostly on mobile)
- Light mode default (warmer, more trustworthy feel for clients)
- Dark mode available via toggle
- All animations: smooth, welcoming (not aggressive)
- Loading states for every async operation
- Error state if token is invalid: friendly message + "Contact us" link
- TypeScript, accessible, semantic HTML

Output: Complete client portal with all 4 screens.
```

---

### PROMPT 5 — Agent Configuration Settings

```
You are building the NEXORIS agent configuration and guardrails settings panel.
This is where the owner configures how each agent behaves.

Route: /dashboard/settings/agents and /dashboard/settings/pricing

Design: Glass Liquid, dark, admin aesthetic — same as main dashboard

Build the following settings screens:

SCREEN 1: Agent 1 Configuration
  Section: "Discovery Settings"
  Fields:
  - Target Cities (multi-select tag input with search) — add cities with Enter key
  - Business Categories (multi-select: Salons, Barbershops, Schools, Boutiques, etc.)
  - Maximum prospects per run (number input, 10–500)
  - Minimum AI score threshold (slider, 0–100, default: 60)
  - Search radius (slider, 1–50km)
  - Run frequency (select: Every 6hrs / 12hrs / 24hrs / Manual only)
  - Skip businesses with existing websites (toggle)
  - Skip businesses with social media (toggle)

  Section: "Contact Extraction"
  - Attempt email extraction (toggle)
  - Attempt phone extraction (toggle)
  - Require valid email to proceed (toggle, default: on)

  Save button → shows success toast

SCREEN 2: Agent 2 Configuration
  Section: "Sender Identity"
  - Sender name (text input)
  - Sender email (email input with DNS record verification status badge)
  - Reply-to email (email input)
  - Company name in email (text input)

  Section: "Email Strategy"
  - A/B test ratio (slider: 0% A / 100% B to 100% A / 0% B)
  - Send time window start (time picker)
  - Send time window end (time picker)
  - Respect prospect's local timezone (toggle)
  - Maximum emails per day (number, 1–100, with deliverability warning above 50)
  - Include mockup preview in email (toggle)
  - Days to wait before follow-up (number, 1–14)
  - Maximum follow-up emails (number, 1–5)

  Section: "Email Tone"
  - Tone selector (radio: Professional / Warm & Friendly / Direct & Bold)
  - Custom instructions for AI (textarea — "Always mention X", "Never say Y")

SCREEN 3: Agent 3 Configuration
  Section: "Pricing Guardrails"
  - Service type selector
  - For each service:
    - Minimum price ($) [input]
    - Maximum price ($) [input]
    - Default/suggested price ($) [input]
    - Maximum discount allowed (% slider, 0–30%)
    - Include in proposal (toggle)
  
  Section: "Negotiation Behavior"
  - Negotiation style (radio: Firm / Flexible / Aggressive discounting)
  - Maximum negotiation rounds before escalating to human (number, 1–10)
  - Auto-book meetings (toggle)
  - Auto-send payment links on agreement (toggle)
  - Require owner approval before sending payment links above $X (currency input)
  - Auto-deliver project when marked complete (toggle)

  Section: "Service Packages"
  - Add/edit service packages
  - Each package: name, description, deliverables (list), base price
  - Drag to reorder

  Save button → success toast → re-reads config in store

Form requirements:
- React Hook Form + Zod validation
- Inline validation (no submit-only validation)
- Unsaved changes indicator (dot on tab, "You have unsaved changes" banner)
- Reset to defaults option (with confirmation dialog)
- All inputs accessible with keyboard
- All sliders: visible value label

Output: Complete settings screens with all form components.
```

---

### PROMPT 6 — Backend API Routes

```
You are a senior backend engineer with 18+ years of experience.

Build the complete NEXORIS backend API routes using Next.js 14 App Router API routes
(route.ts files). Use TypeScript, Supabase as the database, Zod for validation.

Context:
- All admin API routes require Supabase session authentication
- Client portal routes use token-based access (no session required)
- All responses follow this format:
  SUCCESS: { success: true, data: {...}, message: "...", meta?: {...} }
  ERROR:   { success: false, error: { code: "...", message: "..." } }

Build these API routes with COMPLETE implementation:

1. src/app/api/agents/[id]/start/route.ts
   POST — Start an agent worker
   - Verify auth (admin only)
   - Validate agent ID (1, 2, or 3)
   - Update agent_configs: is_active = true
   - Call Python worker endpoint to start agent
   - Insert into agent_logs: status='RUNNING', action='AGENT_STARTED'
   - Create notification: AGENT_STARTED
   - Return agent status

2. src/app/api/agents/[id]/stop/route.ts
   POST — Stop an agent
   - Same as start but is_active = false
   - Signal Python worker to stop gracefully

3. src/app/api/prospects/route.ts
   GET — Paginated list with filters
   - Auth required
   - Query params: page, limit, status, city, category, search, sort_by, sort_order
   - Returns: { prospects: [...], total, page, totalPages }

4. src/app/api/prospects/[id]/route.ts
   GET — Full prospect detail (profile + outreach history + conversations + project + payment)
   PATCH — Update prospect status or manual override
   DELETE — Soft delete (set deleted_at)
   All: auth required, validate ownership

5. src/app/api/payments/webhook/route.ts
   POST — Stripe webhook handler
   - Verify stripe-signature header
   - Handle events:
     checkout.session.completed → update payment, notify owner, send receipt, start project
     payment_intent.payment_failed → update payment status, notify owner
   - Return 200 immediately (Stripe expects fast response)

6. src/app/api/notifications/route.ts
   GET — Paginated notifications
   - Auth required
   - Filter: is_read, priority, type
   - Mark returned notifications as 'fetched' (not read — user must explicitly mark read)

7. src/app/api/notifications/unread-count/route.ts
   GET — Returns { count: number } fast
   - Auth required
   - Single COUNT query on notifications where is_read=false

8. src/app/api/client/[token]/route.ts
   GET — Verify token and return client/prospect data
   - No auth required — token is the access control
   - Validate token exists and is not expired
   - Return: prospect profile, proposal data, project status

9. src/app/api/client/[token]/message/route.ts
   POST — Client sends message to Agent 3
   - No auth required — token validated
   - Insert into conversations: sender='CLIENT', channel='PORTAL'
   - Trigger Agent 3 worker to process and respond
   - Create owner notification: REPLY_RECEIVED

10. src/app/api/analytics/overview/route.ts
    GET — Dashboard KPI data
    - Auth required
    - Returns: total_prospects, emails_sent, deals_closed, revenue_total,
               prospects_today, deals_this_week, revenue_this_week,
               open_rate, reply_rate, conversion_rate

For each route:
- Full TypeScript types
- Zod schema validation on request body
- Proper HTTP status codes
- Supabase server client (not browser client)
- Error handling with descriptive messages
- Rate limiting on public endpoints (client token routes)
- Logging of all critical operations

Output: All 10 route files with complete implementation.
```

---

### PROMPT 7 — Agent 1: Python Discovery Worker

```
You are a senior AI systems engineer and Python developer with 14+ years
of experience building production-grade autonomous agent systems.

Build Agent 1 (Discovery Worker) for NEXORIS as a Python FastAPI service.

File: agent-workers/agent1/main.py + supporting modules

Technology:
- Python 3.11+
- FastAPI for HTTP endpoints
- httpx for async HTTP requests
- supabase-py for database operations
- google-generativeai (Gemini 1.5 Flash) for AI analysis

Agent 1 Responsibilities:
1. Search Google Places API for local businesses by category + city
2. Analyze each business's digital presence gaps
3. Score each business for outreach worthiness
4. Extract and validate contact details
5. Store results in Supabase prospects table
6. Trigger Agent 2 for qualifying prospects
7. Log all actions to agent_logs table
8. Create notifications for owner

Build these components:

1. FastAPI app with endpoints:
   POST /start → Start the agent (called by Next.js)
   POST /stop  → Graceful stop
   GET  /status → Current status, prospects found this run

2. Google Places service (services/places.py):
   - search_businesses(city, category, radius_km) → list of places
   - get_business_details(place_id) → full details including website, phone
   - Rate limiting: 10 requests/second, exponential backoff on errors
   - Cache results in memory to avoid duplicate API calls

3. Digital presence analyzer (services/analyzer.py):
   - check_website(url) → bool + load time if exists
   - check_google_my_business(place) → completeness score
   - extract_social_media(website_html) → { facebook, instagram, twitter }
   - For businesses without websites: scrape Google Maps listing for contact info

4. AI pain point analyzer (services/ai_analyzer.py):
   Using Gemini 1.5 Flash:
   System prompt: "You are a digital marketing analyst..."
   - Analyze the business data and identify specific pain points
   - Generate a relevance score 0-100
   - Return structured JSON: { pain_points: [], score: int, analysis: str, recommended_service: str }

5. Contact extractor (services/contact.py):
   - Extract email from website HTML
   - Extract email from Google listing
   - Validate email format + basic MX record check
   - Extract and format phone number

6. Main orchestrator (agent.py):
   - Read config from Supabase agent_configs
   - Loop through cities × categories
   - For each business: analyze → score → extract contacts → store
   - Skip if already in prospects table (check google_maps_id)
   - Only proceed if score >= threshold (from config)
   - Call Agent 2 trigger for qualifying prospects

Error handling:
- All API calls wrapped in try/except
- Errors logged to agent_logs with status='ERROR'
- Owner notification created on critical failures
- Agent continues to next prospect on non-critical errors
- Maximum retry: 3 attempts with exponential backoff

Environment variables needed:
  GOOGLE_PLACES_API_KEY
  GOOGLE_AI_API_KEY
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  NEXORIS_API_URL (Next.js API to trigger Agent 2)
  NEXORIS_API_SECRET (shared secret for inter-service auth)

Output: Complete, production-ready Python FastAPI agent worker.
Include requirements.txt and Dockerfile.
```

---

### PROMPT 8 — Email Tracking System

```
You are building the NEXORIS email tracking system.
This enables Agent 2 to know exactly when a prospect opens, clicks, and replies.

Build these components:

1. Open Tracking Pixel (src/app/api/outreach/track/open/route.ts)
   - GET endpoint with query params: emailId, prospectId
   - Log the open: update outreach_emails (status, opened_at, open_count++)
   - Update prospect status to 'OPENED' if first open
   - Create owner notification if first open (EMAIL_OPENED)
   - Return: 1x1 transparent PNG (no-cache headers)

2. Click Tracking (src/app/api/outreach/track/click/route.ts)
   - GET endpoint: emailId, prospectId, destination (encoded URL)
   - Log the click: update outreach_emails (clicked_at, click_count++)
   - Update prospect status to 'CLICKED'
   - Create owner notification (EMAIL_CLICKED)
   - Redirect to actual destination URL

3. Reply Detection (src/app/api/outreach/webhook/inbound/route.ts)
   - POST endpoint receiving Resend inbound email webhook
   - Parse reply: extract emailId from headers (custom X-NEXORIS-EMAIL-ID header)
   - Update outreach_emails: status='REPLIED', replied_at=now()
   - Update prospect status to 'REPLIED'
   - Store reply in conversations table: sender='CLIENT', channel='EMAIL'
   - Create HIGH priority notification: REPLY_RECEIVED
   - Trigger Agent 3 worker via HTTP POST

4. Email HTML Template Builder (lib/email-templates.ts)
   - generateOutreachEmail(prospect, variation: 'A'|'B', emailId) → { subject, html, text }
   - Embeds tracking pixel in HTML: <img src="/api/outreach/track/open?emailId=...&prospectId=..." />
   - Wraps CTA links with tracking redirect
   - Includes custom header: X-NEXORIS-EMAIL-ID: emailId
   - Templates use brand colors: indigo primary, clean white layout
   - Mobile-responsive HTML email (table-based layout for email client compatibility)
   - Dynamic sections based on pain points

5. A/B Test Selector (lib/ab-selector.ts)
   - selectVariation(agentConfig) → 'A' | 'B' based on configured ratio
   - Track which variation performs better in analytics

6. Analytics Aggregator (src/app/api/outreach/analytics/route.ts)
   - GET: returns { open_rate, click_rate, reply_rate, by_variation: {A: {...}, B: {...}}, best_send_times, top_performing_pain_points }

Include:
- TypeScript throughout
- Edge-compatible code for pixel tracker (must be fast — no DB lag on email open)
- Full error handling
- Rate limiting to prevent tracking abuse

Output: Complete email tracking system with all components.
```

---

### PROMPT 9 — Notification Center Component

```
You are building the NEXORIS real-time notification center.

The notification center has two parts:
1. NotificationBell — icon in the top bar with animated unread count badge
2. NotificationCenter — full panel (slide-in drawer) showing all notifications

Tech: Next.js, TypeScript, Framer Motion, Zustand, Supabase Realtime

Build these components:

1. NotificationBell (components/notifications/NotificationBell.tsx)
   - Bell icon (Lucide)
   - Red badge with unread count (animates in when count > 0)
   - Badge pulses when count changes
   - Badge shows "99+" when count exceeds 99
   - Bell shakes animation when URGENT notification arrives
   - Keyboard accessible (Enter/Space opens panel)
   - aria-label: "Notifications, {count} unread"

2. NotificationCenter (components/notifications/NotificationCenter.tsx)
   - Slide-in panel from top-right (Framer Motion, spring animation)
   - Dark glass background
   - Header: "Notifications" title + "Mark all read" button + close button
   - Filter tabs: All | Unread | Urgent | Requires Action
   - Notification list (virtualized if >50 items)
   - Each notification card:
     - Agent badge (A1/A2/A3 colored dot, or system icon)
     - Title (bold, DM Sans SemiBold)
     - Message (DM Sans Regular, muted, 2 lines max with ellipsis)
     - Timestamp (relative: "2 minutes ago")
     - Priority indicator (left border: normal=gray, high=indigo, urgent=amber pulsing)
     - "Requires Action" tag if requires_action=true
     - Read/unread state: unread = slightly brighter background
     - Click: marks as read + navigates to action_url
   - Empty state: "All clear. Your agents are working." + small animation
   - "Load more" button for pagination

3. useNotifications hook (hooks/useNotifications.ts)
   - Fetches notifications from API on mount
   - Subscribes to Supabase Realtime (new inserts on notifications table)
   - Updates Zustand store on new notification
   - Triggers bell shake + sound effect (subtle) on URGENT notification
   - Auto-marks as read when notification is visible for 3+ seconds

4. Real-time subscription setup (hooks/useRealtime.ts)
   - Supabase Realtime channel subscription
   - Filter: notifications where owner_id = current user
   - On INSERT: add to store, update unread count, trigger bell animation

Animation specs:
- Panel entrance: x: 400 → 0, spring(stiffness: 300, damping: 30)
- Panel exit: x: 0 → 400, duration: 200ms ease-in
- New notification item: y: -20 → 0, opacity: 0 → 1, duration: 300ms
- Urgent bell shake: keyframes rotate [-5, 5, -5, 5, 0], duration: 400ms
- Unread badge pop: scale: 0 → 1.2 → 1, spring animation
- Read transition: background color fade over 300ms

Output: Complete notification system with all components and hooks.
```

---

### PROMPT 10 — README File

```
Generate the complete NEXORIS README.md file.

Project details:
- Name: NEXORIS
- Tagline: Find. Connect. Close. Automatically.
- Description: A fully automated multi-agent AI business outreach and client acquisition system. Three intelligent agents discover local businesses, send personalized outreach, negotiate deals, process payments, and deliver projects — all without manual intervention.
- Tech stack: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Supabase, PostgreSQL, Python FastAPI, Google Gemini AI, Resend, Stripe, Cal.com, Railway, Vercel
- GitHub: [user to add]
- Live URL: [user to add]

The README must include:
1. Project banner placeholder (markdown image)
2. Badges: Next.js, TypeScript, Supabase, Vercel, Python
3. Overview section (what it does, why it exists)
4. Feature list with agent breakdown (Agent 1, 2, 3 capabilities)
5. Tech stack table
6. Architecture diagram (ASCII art showing: Admin → Next.js App → Supabase → Python Workers → External APIs)
7. Screenshots section (placeholder)
8. Prerequisites (Node 18+, Python 3.11+, accounts: Supabase, Resend, Stripe, Google Cloud)
9. Complete setup instructions:
   a. Clone repo
   b. Install Node dependencies
   c. Set up Python virtual environment + install requirements
   d. Configure Supabase (create project, run migrations)
   e. Set up all environment variables (table with name, description, where to get it)
   f. Configure Stripe webhook
   g. Run locally (3 terminal windows: Next.js, Agent 1, Agent 2/3 workers)
10. All environment variables table (complete, with example values and descriptions)
11. Database setup section (link to migration files, Supabase setup steps)
12. Agent configuration guide (how to configure each agent)
13. Deployment guide:
    a. Deploy Next.js to Vercel
    b. Deploy Python workers to Railway
    c. Configure production environment variables
    d. Set up Stripe production webhook
14. API documentation summary (link to /docs endpoint)
15. Git workflow (branch naming, commit conventions, PR process)
16. Contributing guide
17. Roadmap (future features)
18. License (MIT)
19. Contact

Tone: Professional, clear, developer-friendly. Like a senior engineer wrote it.
Output: Complete README.md in markdown format.
```

---

## ✅ NEXORIS — COMPLETE BUILD CHECKLIST

```
PHASE 1 — Foundation
[ ] Next.js project created and configured
[ ] Python virtual environments set up
[ ] All npm packages installed
[ ] Supabase project created
[ ] All database migrations run
[ ] All environment variables set in .env.local
[ ] Git repo initialized, main and dev branches created

PHASE 2 — Design System
[ ] Design tokens in globals.css (dark + light mode)
[ ] Tailwind config updated (fonts, breakpoints, colors)
[ ] Glass utility classes defined
[ ] Core UI components built (Button, Input, Card, Badge, Modal)
[ ] Fonts loaded (Syne, DM Sans, JetBrains Mono)
[ ] Dark/light mode switching working

PHASE 3 — Database
[ ] All tables created in Supabase
[ ] Row Level Security (RLS) policies defined
[ ] Indexes created
[ ] Realtime enabled on: notifications, agent_logs, prospects

PHASE 4 — Auth
[ ] Supabase Auth configured
[ ] Login screen built and working
[ ] Signup screen built and working
[ ] Email verification working
[ ] Protected routes working (middleware.ts)
[ ] Admin role assigned to first user

PHASE 5 — Frontend (MVS)
[ ] Landing page complete
[ ] Admin dashboard (command center) complete
[ ] Agent status cards + toggle working
[ ] KPI cards loading data
[ ] Prospect table loading data
[ ] Notification bell + center working
[ ] All screens responsive (320px–1440px)
[ ] Dark and light mode working on all screens

PHASE 6 — Backend (MVS)
[ ] /api/agents/[id]/start + /stop working
[ ] /api/prospects paginated and filterable
[ ] /api/notifications with realtime
[ ] /api/analytics/overview returning data
[ ] /api/client/[token] working

PHASE 7 — Agent 1 (MVS)
[ ] Python FastAPI service running
[ ] Google Places API search working
[ ] AI analysis via Gemini working
[ ] Prospects being inserted into Supabase
[ ] Agent logs being created
[ ] Owner notifications being created
[ ] Agent 2 trigger on qualifying prospect

PHASE 8 — Agent 2
[ ] Email generation via Gemini working
[ ] A/B variation selection working
[ ] Resend API sending emails
[ ] Open tracking pixel returning 1x1 PNG
[ ] Click tracking redirecting correctly
[ ] Reply webhook processing inbound replies
[ ] Status updates cascading correctly

PHASE 9 — Agent 3
[ ] Reply classification working
[ ] Negotiation response generation working (within guardrails)
[ ] Cal.com booking integration working
[ ] Stripe payment link generation working
[ ] Stripe webhook processing payments
[ ] Receipt email sent on payment
[ ] Project record created on payment
[ ] Client portal updated on payment

PHASE 10 — Client Portal
[ ] Token validation working
[ ] Proposal display correct
[ ] Chat interface working (client → Agent 3 → client)
[ ] Payment screen with Stripe redirect
[ ] Project tracking screen
[ ] File delivery working

PHASE 11 — Testing
[ ] Unit tests passing (Vitest)
[ ] Integration tests passing
[ ] E2E tests passing (Playwright)
[ ] Lighthouse score > 85 on all pages
[ ] WCAG 2.1 AA audit passing
[ ] Screen reader test completed
[ ] Keyboard navigation test completed

PHASE 12 — Deployment
[ ] Vercel deployment successful
[ ] Railway deployment successful (Python workers)
[ ] All env vars set in Vercel + Railway
[ ] Stripe production webhook configured
[ ] Resend domain verified (DKIM/SPF/DMARC)
[ ] Sentry error monitoring active
[ ] README.md complete
[ ] All error fix .md files in /errors folder
```

---

*NEXORIS — Project Brief v1.0*
*Built with the VIBE CODING MASTER GUIDE methodology*
*Team of 14 specialists · Lead Architect presiding*
