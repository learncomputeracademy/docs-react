-- ============================================================
-- 013: Public learner accounts (Google / GitHub sign-in), 2026-11-21
-- Run this in the Supabase SQL editor BEFORE enabling any sign-in provider.
--
-- 1. SECURITY FIX. Until now, the on_auth_user_created trigger (004) gave
--    every new auth user a profiles row with the defaults role='editor',
--    status='active' — i.e. full lesson-editing rights. That was safe only
--    while the admin panel was the sole way to create users. With public
--    sign-in, every learner would become an editor. The trigger is removed;
--    staff profiles are now created explicitly by the admin panel
--    (lib/admin/users.ts createUser). Public sign-ups get NO profiles row,
--    so is_admin()/can_edit() are false for them and /admin stays closed.
--
-- 2. learner_progress: one private row per signed-in learner, holding the
--    same data the site keeps in the browser (completed lessons, quiz
--    results, streak, last lesson, badges seen). RLS: owner only.
-- ============================================================

-- ── 1. No automatic staff profile for new auth users ─────────
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Safer column default too, in case anything else ever inserts a bare row.
alter table profiles alter column status set default 'blocked';

-- ── 2. learner_progress ──────────────────────────────────────
create table if not exists learner_progress (
  user_id      uuid        primary key references auth.users(id) on delete cascade,
  completed    text[]      not null default '{}',   -- lesson paths, e.g. 'css/intro'
  quiz         jsonb       not null default '{}',   -- { "<path>#<block>": { best, total, xp } }
  streak       jsonb,                                -- { last, count, best, grace? }
  last_lesson  jsonb,                                -- { path, title }
  badges_seen  text[]      not null default '{}',
  updated_at   timestamptz not null default now(),
  -- Guards against a runaway client filling the free-tier database.
  constraint learner_progress_size check (
    cardinality(completed) <= 5000
    and cardinality(badges_seen) <= 500
    and pg_column_size(quiz) <= 200000
  )
);

alter table learner_progress enable row level security;

create policy "learner reads own progress" on learner_progress
  for select using (auth.uid() = user_id);
create policy "learner inserts own progress" on learner_progress
  for insert with check (auth.uid() = user_id);
create policy "learner updates own progress" on learner_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "learner deletes own progress" on learner_progress
  for delete using (auth.uid() = user_id);

-- ── Check after running ──────────────────────────────────────
-- select tgname from pg_trigger where tgname = 'on_auth_user_created';  -- expect 0 rows
-- select count(*) from profiles;  -- your existing staff, unchanged
