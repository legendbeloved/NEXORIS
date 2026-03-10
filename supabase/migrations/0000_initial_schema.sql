-- Initial Schema for NEXORIS

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'ADMIN' CHECK (role IN ('ADMIN', 'SUPER')),
    owner_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Table: agent_configs
CREATE TABLE public.agent_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    agent_number INT NOT NULL CHECK (agent_number IN (1, 2, 3)),
    is_active BOOLEAN NOT NULL DEFAULT false,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_run_at TIMESTAMPTZ,
    runs_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (owner_id, agent_number)
);

-- RLS: agent_configs
ALTER TABLE public.agent_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own agent_configs" ON public.agent_configs FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own agent_configs" ON public.agent_configs FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own agent_configs" ON public.agent_configs FOR UPDATE USING (auth.uid() = owner_id);

-- Table: prospects
CREATE TABLE public.prospects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id),
    business_name TEXT NOT NULL,
    category TEXT NOT NULL,
    address TEXT,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'NG',
    phone TEXT,
    email TEXT,
    website TEXT,
    google_maps_id TEXT UNIQUE,
    google_rating DECIMAL(2,1),
    review_count INT,
    pain_points JSONB NOT NULL DEFAULT '[]'::jsonb,
    ai_score INT CHECK (ai_score >= 0 AND ai_score <= 100),
    ai_analysis TEXT,
    status TEXT NOT NULL DEFAULT 'DISCOVERED',
    mockup_url TEXT,
    client_token TEXT UNIQUE,
    notes TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for prospects
CREATE INDEX idx_prospects_owner ON public.prospects(owner_id);
CREATE INDEX idx_prospects_status ON public.prospects(status);
CREATE INDEX idx_prospects_city ON public.prospects(city);
CREATE INDEX idx_prospects_token ON public.prospects(client_token);
CREATE INDEX idx_prospects_email ON public.prospects(email);
CREATE INDEX idx_prospects_deleted ON public.prospects(deleted_at) WHERE deleted_at IS NULL;

-- RLS: prospects
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own prospects" ON public.prospects FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own prospects" ON public.prospects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own prospects" ON public.prospects FOR UPDATE USING (auth.uid() = owner_id);
-- Portal users can select by client_token without auth
CREATE POLICY "Portal access via client_token" ON public.prospects FOR SELECT USING (client_token IS NOT NULL);

-- Table: outreach_emails
CREATE TABLE public.outreach_emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id),
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT NOT NULL,
    variation TEXT NOT NULL DEFAULT 'A' CHECK (variation IN ('A', 'B')),
    resend_id TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    open_count INT NOT NULL DEFAULT 0,
    click_count INT NOT NULL DEFAULT 0,
    ai_prompt_used TEXT,
    followup_number INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: outreach_emails
ALTER TABLE public.outreach_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own outreach_emails" ON public.outreach_emails FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own outreach_emails" ON public.outreach_emails FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own outreach_emails" ON public.outreach_emails FOR UPDATE USING (auth.uid() = owner_id);

-- Table: conversations
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('AGENT', 'CLIENT')),
    channel TEXT NOT NULL CHECK (channel IN ('EMAIL', 'PORTAL', 'SYSTEM')),
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can select conversations" ON public.conversations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.prospects p WHERE p.id = conversations.prospect_id AND p.owner_id = auth.uid())
);
CREATE POLICY "Portal and Webhooks can insert" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Portal can select conversations" ON public.conversations FOR SELECT USING (true);

-- Table: projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID NOT NULL REFERENCES public.prospects(id),
    owner_id UUID NOT NULL REFERENCES public.profiles(id),
    service_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'NOT_STARTED',
    deadline TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    delivery_files JSONB DEFAULT '[]'::jsonb,
    delivery_notes TEXT,
    client_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own projects" ON public.projects FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = owner_id);

-- Table: payments
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prospect_id UUID NOT NULL REFERENCES public.prospects(id),
    project_id UUID REFERENCES public.projects(id),
    owner_id UUID NOT NULL REFERENCES public.profiles(id),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'PENDING',
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent TEXT,
    stripe_receipt_url TEXT,
    payment_link TEXT,
    link_sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    receipt_sent_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own payments" ON public.payments FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own payments" ON public.payments FOR UPDATE USING (auth.uid() = owner_id);

-- Table: notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id),
    prospect_id UUID REFERENCES public.prospects(id),
    project_id UUID REFERENCES public.projects(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    priority TEXT NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    requires_action BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_owner ON public.notifications(owner_id);
CREATE INDEX idx_notifications_unread ON public.notifications(owner_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

-- RLS: notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own notifications" ON public.notifications FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = owner_id);

-- Table: agent_logs
CREATE TABLE public.agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id),
    agent INT NOT NULL CHECK (agent IN (1, 2, 3)),
    action TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('RUNNING', 'SUCCESS', 'ERROR', 'SKIPPED')),
    prospect_id UUID REFERENCES public.prospects(id),
    details JSONB DEFAULT '{}'::jsonb,
    error_msg TEXT,
    duration_ms INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: agent_logs
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own agent_logs" ON public.agent_logs FOR SELECT USING (auth.uid() = owner_id);

-- Enable Realtime for relevant tables
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.prospects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_logs;
