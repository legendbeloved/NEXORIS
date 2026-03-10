# NEXORIS - Multi-Agent Business Outreach Platform

## Background and Motivation
NEXORIS is a mission-control style platform that automates the entire client acquisition lifecycle using three specialized AI agents: Discovery, Outreach, and Negotiation/Delivery. It targets freelancers and agencies looking to scale without increasing headcount.

## Key Challenges and Analysis
- **Real-time Feedback**: The UI must feel alive, showing agent activity as it happens.
- **Complex State Management**: Tracking prospects through multiple stages (Discovered -> Contacted -> Negotiating -> Paid -> Delivered).
- **AI Personalization**: Ensuring Agent 2 generates high-quality, non-spammy outreach.
- **Security**: Protecting client data and payment flows.

## High-level Task Breakdown

### Phase 1: Foundation & Infrastructure
- [ ] Initialize Express + Vite full-stack setup.
- [ ] Design and implement SQLite database schema.
- [ ] Create basic layout with "Command Center" aesthetic (Dark mode, futuristic).

### Phase 2: Agent 1 - Discovery Engine
- [ ] Implement Google Places API integration (or mock for MVS).
- [ ] AI Gap Analysis logic using Gemini.
- [ ] Prospect management UI.

### Phase 3: Agent 2 - Outreach Engine
- [ ] AI Personalized email generation.
- [ ] Mockup/Preview generation logic.
- [ ] Email tracking system (opens/clicks).

### Phase 4: Agent 3 - Negotiation & Delivery
- [ ] AI Negotiation logic with price guardrails.
- [ ] Stripe integration for payments.
- [ ] Client portal for project tracking.

### Phase 5: Command Center & Analytics
- [ ] Real-time activity feed.
- [ ] Revenue and conversion analytics.
- [ ] Agent configuration panel.

## Project Status Board
- **Current Mode**: Executor
- **Active Task**: MVP Refinement & Bug Fixing

## Current Status / Progress Tracking
- [x] Project Metadata updated.
- [x] Initial Scratchpad created.
- [x] Full-stack server setup (Express + Vite + SQLite).
- [x] Command Center UI implementation.
- [x] Agent 1 Discovery logic (AI Gap Analysis).
- [x] Agent 2 Outreach logic (AI Personalized Emails).
- [x] Agent 3 Negotiation logic (AI Guardrails).
- [x] Landing Page implementation.
- [x] Agent Configuration panel.
- [x] Real-time Activity Feed.
- [x] Fixed broken AI SDK usage in `server.ts`.
- [x] Fixed missing `Send` icon import in `AgentsPage.tsx`.
- [x] Connected dashboard components to real API data (KPIs, Funnel, Revenue).
- [x] Implemented actual agent triggering from the UI.
- [x] Fixed server port conflicts.
- [x] Implemented Agent Personality Profiles (Empathetic, Data-Driven, Challenger).
- [x] Added Smart Scheduling logic for outreach timing.
- [x] Implemented Competitor Intelligence module in Discovery Agent.
- [x] Connected Payments page to real revenue and deals data.
- [x] Connected Outreach page to actual sent communication history.
- [x] Implemented full settings synchronization with the backend.
- [x] Fixed `vite-error-overlay` caused by duplicate `Send` icon declaration in `AgentsPage.tsx`.
- [x] Implemented comprehensive mobile responsiveness (mobile nav, responsive grids, and layout optimization).
- [x] Enhanced database schema with `projects` and `analytics` tables.
- [x] Upgraded Agent 1 with dynamic "deep scan" business generation using Gemini.
- [x] Enhanced Agent 2 with dynamic mockup description generation.
- [x] Upgraded Agent 3 negotiation logic with Cal.com booking instructions.
- [x] Built comprehensive Client Portal with proposal view, real-time chat, and simulated Stripe payment.
- [x] Added Live Mission Feed to Landing Page for real-time social proof.
- [x] Implemented "Batch A - Entry Screens" from SCREENS.md:
    - [x] Created `SignInPage`, `SignUpPage`, `EmailVerification`, `ForgotPassword`.
    - [x] Updated `App.tsx` with proper auth routing and state management.
    - [x] Verified `LandingPage` implementation against design specs.
- [x] Implemented core dashboard enhancements:
    - [x] Implemented global light/dark mode with `ThemeProvider`.
    - [x] Created interactive Onboarding Tour using `react-joyride`.
    - [x] Added Profile, Team, Subscription, Help, and 404 pages.
    - [x] Refined mobile responsiveness for Payments and Team pages.
    - [x] Fixed all linting warnings and JSX errors.
    - [x] Installed all necessary production dependencies (Stripe, Resend, OpenAI).
    - [x] Connected Agent Status Cards to real backend endpoints (`/api/agents/discovery`, `/api/agents/outreach`).

## Executor's Feedback or Assistance Requests
- The platform is now feature-complete for the MVP.
- All core user flows (onboarding, dashboard, client portal) are fully responsive and functional.
- The UI is polished with consistent animations and theming.
- Next steps could involve deeper backend integration with real Stripe/Resend APIs (currently simulated or partially implemented).

## Lessons
- Using `AnimatePresence` for the landing page transition and mission feed creates a high-end feel.
- Mocking the Google Places API with an LLM allows for realistic testing without API costs during development.
- Ensure AI SDK usage matches the version installed in `package.json`.
- Always verify if dashboard components are using hardcoded data vs API data.
- Port conflicts (EADDRINUSE) are common in development; always have a way to easily change the port or kill the process.
- Using `useQuery` with `enabled` property is a great way to optimize API calls for tabs that aren't currently visible.
- Parameterized prompts in AI agents (like Personality Profiles) significantly improve the quality and relevance of generated content.
- `overflow-x-auto` is essential for making large data tables usable on mobile.
- Contextual prompts for Agent 3 (referring to UI elements like buttons) improve the user experience in the client portal.
- React 19 compatibility requires careful handling of peer dependencies (e.g., using `--legacy-peer-deps` for some libraries).
- Global theme management with Tailwind requires synchronizing React state with the DOM's class list.
