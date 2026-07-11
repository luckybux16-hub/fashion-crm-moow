create table if not exists public.crm_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_backups (
  id uuid primary key default gen_random_uuid(),
  reason text not null default 'Автокопия',
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.crm_state enable row level security;
alter table public.crm_backups enable row level security;

drop policy if exists "crm_state_select" on public.crm_state;
drop policy if exists "crm_state_insert" on public.crm_state;
drop policy if exists "crm_state_update" on public.crm_state;
drop policy if exists "crm_state_select_authenticated" on public.crm_state;
drop policy if exists "crm_state_insert_authenticated" on public.crm_state;
drop policy if exists "crm_state_update_authenticated" on public.crm_state;
drop policy if exists "crm_backups_select" on public.crm_backups;
drop policy if exists "crm_backups_insert" on public.crm_backups;
drop policy if exists "crm_backups_delete" on public.crm_backups;

create policy "crm_state_select"
  on public.crm_state
  for select
  to anon, authenticated
  using (true);

create policy "crm_state_insert"
  on public.crm_state
  for insert
  to anon, authenticated
  with check (true);

create policy "crm_state_update"
  on public.crm_state
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "crm_backups_select"
  on public.crm_backups
  for select
  to anon, authenticated
  using (true);

create policy "crm_backups_insert"
  on public.crm_backups
  for insert
  to anon, authenticated
  with check (true);

create policy "crm_backups_delete"
  on public.crm_backups
  for delete
  to anon, authenticated
  using (true);
