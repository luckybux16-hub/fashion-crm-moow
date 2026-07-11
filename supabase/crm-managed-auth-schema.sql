alter table public.crm_state enable row level security;

drop policy if exists "crm_state_select" on public.crm_state;
drop policy if exists "crm_state_insert" on public.crm_state;
drop policy if exists "crm_state_update" on public.crm_state;
drop policy if exists "crm_state_select_authenticated" on public.crm_state;
drop policy if exists "crm_state_insert_authenticated" on public.crm_state;
drop policy if exists "crm_state_update_authenticated" on public.crm_state;

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
