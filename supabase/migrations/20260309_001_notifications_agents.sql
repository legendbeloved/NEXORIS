create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  type text not null,
  title text not null,
  message text not null,
  priority text not null default 'LOW',
  action_url text,
  is_read boolean not null default false,
  requires_action boolean not null default false,
  prospect_id bigint,
  project_id bigint,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_owner_created
  on public.notifications(owner_id, created_at desc);

alter publication supabase_realtime add table public.notifications;

alter table public.notifications enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'notifications' and policyname = 'read own notifications'
  ) then
    create policy "read own notifications"
      on public.notifications for select
      using (owner_id = auth.uid());
  end if;
end$$;

create table if not exists public.agent_logs (
  id bigint generated always as identity primary key,
  owner_id uuid,
  agent int not null,
  action text not null,
  status text not null,
  prospect_id bigint,
  details jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_agent_logs_owner_created
  on public.agent_logs(owner_id, created_at desc);

alter table public.agent_logs enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'agent_logs' and policyname = 'server-writes-only'
  ) then
    create policy "server-writes-only"
      on public.agent_logs
      for all
      to authenticated
      using (false)
      with check (false);
  end if;
end$$;

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='prospects') then
    alter table public.prospects
      add column if not exists token text unique,
      add column if not exists status text,
      add column if not exists city text,
      add column if not exists category text,
      add column if not exists recommended_service text,
      add column if not exists pain_points jsonb default '[]'::jsonb,
      add column if not exists updated_at timestamptz default now();
  end if;
end$$;

create table if not exists public.outreach_emails (
  id bigint generated always as identity primary key,
  prospect_id bigint not null,
  variant text not null,
  subject text not null,
  body_text text not null,
  body_html text not null,
  status text not null default 'SENT',
  resend_id text,
  delivery_status text,
  sent_at timestamptz not null default now()
);

create index if not exists idx_outreach_emails_prospect
  on public.outreach_emails(prospect_id, sent_at desc);

create table if not exists public.conversations (
  id bigint generated always as identity primary key,
  prospect_id bigint not null,
  sender text not null,
  channel text not null default 'EMAIL',
  message text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversations_prospect_created
  on public.conversations(prospect_id, created_at asc);

create table if not exists public.projects (
  id bigint generated always as identity primary key,
  prospect_id bigint not null,
  service_type text not null,
  title text not null,
  status text not null default 'NOT_STARTED',
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id bigint generated always as identity primary key,
  prospect_id bigint not null,
  project_id bigint not null,
  stripe_session_id text,
  payment_link text,
  amount int not null,
  status text not null default 'LINK_SENT',
  link_sent_at timestamptz default now()
);

create index if not exists idx_payments_project on public.payments(project_id);

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='agent_configs') then
    alter table public.agent_configs
      add column if not exists agent_number int,
      add column if not exists is_active boolean default true,
      add column if not exists owner_id uuid,
      add column if not exists sender_name text,
      add column if not exists sender_email text,
      add column if not exists reply_to text,
      add column if not exists ab_ratio float8,
      add column if not exists send_hour_start int,
      add column if not exists send_hour_end int,
      add column if not exists respect_timezone boolean,
      add column if not exists include_mockup boolean,
      add column if not exists custom_instructions text,
      add column if not exists services jsonb,
      add column if not exists default_service text,
      add column if not exists min_price int,
      add column if not exists max_discount_pct int,
      add column if not exists negotiation_style text,
      add column if not exists max_rounds int,
      add column if not exists auto_book_meetings boolean,
      add column if not exists auto_send_payment_links boolean,
      add column if not exists require_approval_above int,
      add column if not exists cal_event_type_id text;
  end if;
end$$;

insert into storage.buckets (id, name, public)
values ('mockups', 'mockups', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read access to mockups'
  ) then
    create policy "Public read access to mockups"
      on storage.objects for select
      using (bucket_id = 'mockups');
  end if;
end$$;
