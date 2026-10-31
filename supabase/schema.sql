-- =====================================================================
-- Shared Task Tracker · database schema
-- Run this whole file once in Supabase: SQL Editor → New query → Run
-- It is safe to re-run.
-- =====================================================================

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  owner       text not null check (owner in ('sritha', 'mayuri')),
  title       text not null check (char_length(title) between 1 and 120),
  created_at  timestamptz not null default now()
);

create table if not exists public.task_completions (
  task_id     uuid not null references public.tasks(id) on delete cascade,
  day         int  not null check (day between 1 and 30),
  completed   boolean not null default true,
  updated_at  timestamptz not null default now(),
  primary key (task_id, day)
);

create index if not exists tasks_owner_idx on public.tasks (owner);

-- The app has no login (it is shared by two trusted people), so the public
-- anon key is allowed to read and write these tables. Do not store anything
-- sensitive here.
alter table public.tasks enable row level security;
alter table public.task_completions enable row level security;

drop policy if exists "tasks_select" on public.tasks;
drop policy if exists "tasks_insert" on public.tasks;
drop policy if exists "tasks_update" on public.tasks;
drop policy if exists "tasks_delete" on public.tasks;
create policy "tasks_select" on public.tasks for select to anon, authenticated using (true);
create policy "tasks_insert" on public.tasks for insert to anon, authenticated with check (true);
create policy "tasks_update" on public.tasks for update to anon, authenticated using (true) with check (true);
create policy "tasks_delete" on public.tasks for delete to anon, authenticated using (true);

drop policy if exists "completions_select" on public.task_completions;
drop policy if exists "completions_insert" on public.task_completions;
drop policy if exists "completions_update" on public.task_completions;
drop policy if exists "completions_delete" on public.task_completions;
create policy "completions_select" on public.task_completions for select to anon, authenticated using (true);
create policy "completions_insert" on public.task_completions for insert to anon, authenticated with check (true);
create policy "completions_update" on public.task_completions for update to anon, authenticated using (true) with check (true);
create policy "completions_delete" on public.task_completions for delete to anon, authenticated using (true);

-- Enable realtime so both dashboards update live when either user changes something.
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'tasks') then
    alter publication supabase_realtime add table public.tasks;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'task_completions') then
    alter publication supabase_realtime add table public.task_completions;
  end if;
end $$;
