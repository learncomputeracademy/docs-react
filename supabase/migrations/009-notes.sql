-- ============================================================
-- Admin notes: freeform notes/todos (Tiptap rich text, incl. task-list
-- checkboxes) with private file attachments. Shared across every admin
-- account, admin-only (not editor) — matches categories/settings/users.
-- Run this in the Supabase SQL editor, same as 002-008.
-- ============================================================

create table notes (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null default '',
  body_html   text        not null default '',
  attachments jsonb       not null default '[]', -- [{url, filename, bytes, backend}]
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index notes_updated_idx on notes(updated_at desc);

create trigger notes_updated_at
  before update on notes
  for each row execute function set_updated_at();

alter table notes enable row level security;

create policy "admin manages notes" on notes for all
  using (public.is_admin()) with check (public.is_admin());

-- ── Verify ───────────────────────────────────────────────────
--   select count(*) from notes;  -- expect 0
--   select policyname, cmd from pg_policies where tablename = 'notes';
--   -- expect "admin manages notes" (ALL)
