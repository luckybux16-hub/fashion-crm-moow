create table if not exists public.crm_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.crm_state enable row level security;

drop policy if exists "crm_state_select" on public.crm_state;
drop policy if exists "crm_state_insert" on public.crm_state;
drop policy if exists "crm_state_update" on public.crm_state;

create policy "crm_state_select"
  on public.crm_state
  for select
  using (true);

create policy "crm_state_insert"
  on public.crm_state
  for insert
  with check (true);

create policy "crm_state_update"
  on public.crm_state
  for update
  using (true)
  with check (true);
