create table if not exists public.crm_users (
  id text primary key,
  name text not null,
  login text not null unique,
  email text unique,
  password text not null,
  role text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_models (
  id text primary key,
  brand text not null default 'Не определились',
  title text not null,
  article text,
  status text not null,
  current_responsible_user_id text references public.crm_users(id),
  owner_user_id text references public.crm_users(id),
  constructor_user_id text references public.crm_users(id),
  workshop_user_id text references public.crm_users(id),
  deadline date,
  created_at date not null,
  updated_at date not null,
  archived_at timestamptz,
  deleted_reason text,
  data jsonb not null default '{}'::jsonb
);

create table if not exists public.crm_model_participants (
  model_id text not null references public.crm_models(id) on delete cascade,
  user_id text not null references public.crm_users(id) on delete cascade,
  primary key (model_id, user_id)
);

create table if not exists public.crm_comments (
  id text primary key,
  model_id text not null references public.crm_models(id) on delete cascade,
  author_user_id text references public.crm_users(id),
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_history (
  id uuid primary key default gen_random_uuid(),
  model_id text references public.crm_models(id) on delete cascade,
  user_id text references public.crm_users(id),
  action text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_payments (
  id text primary key,
  model_id text not null references public.crm_models(id) on delete cascade,
  payment_type text not null,
  work text not null,
  amount numeric not null default 0,
  paid boolean not null default false,
  paid_at date
);

create table if not exists public.crm_login_events (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.crm_users(id),
  user_name text,
  role text,
  login text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.crm_users enable row level security;
alter table public.crm_models enable row level security;
alter table public.crm_model_participants enable row level security;
alter table public.crm_comments enable row level security;
alter table public.crm_history enable row level security;
alter table public.crm_payments enable row level security;
alter table public.crm_login_events enable row level security;

drop policy if exists "crm_users_all" on public.crm_users;
drop policy if exists "crm_models_all" on public.crm_models;
drop policy if exists "crm_model_participants_all" on public.crm_model_participants;
drop policy if exists "crm_comments_all" on public.crm_comments;
drop policy if exists "crm_history_all" on public.crm_history;
drop policy if exists "crm_payments_all" on public.crm_payments;
drop policy if exists "crm_login_events_all" on public.crm_login_events;

create policy "crm_users_all" on public.crm_users for all to anon, authenticated using (true) with check (true);
create policy "crm_models_all" on public.crm_models for all to anon, authenticated using (true) with check (true);
create policy "crm_model_participants_all" on public.crm_model_participants for all to anon, authenticated using (true) with check (true);
create policy "crm_comments_all" on public.crm_comments for all to anon, authenticated using (true) with check (true);
create policy "crm_history_all" on public.crm_history for all to anon, authenticated using (true) with check (true);
create policy "crm_payments_all" on public.crm_payments for all to anon, authenticated using (true) with check (true);
create policy "crm_login_events_all" on public.crm_login_events for all to anon, authenticated using (true) with check (true);
