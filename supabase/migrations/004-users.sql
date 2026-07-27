-- ============================================================
-- Stage 7: Users, roles, revisions, activity log
-- Run this in the Supabase SQL editor, same as 002/003.
--
-- Replaces the JWT app_metadata.role check (schema.sql) with a `profiles`
-- table, so blocking a user takes effect on their next request instead of
-- waiting up to an hour for their JWT to refresh. Two roles only —
-- 'admin' (everything, incl. user management) and 'editor' (docs + media,
-- can publish, cannot delete/restore or manage users/categories/settings).
-- ============================================================

-- ── profiles ─────────────────────────────────────────────────

create table profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  name       text,
  role       text        not null default 'editor' check (role in ('admin', 'editor')),
  status     text        not null default 'active' check (status in ('active', 'blocked')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "users read own profile" on profiles for select using (auth.uid() = id);
create policy "admin manages profiles" on profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- New Supabase Auth users (created via the admin panel) get a profile row
-- automatically. security definer — inserting into public.profiles must
-- succeed regardless of the new user's own (nonexistent yet) RLS grants.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name) values (new.id, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Existing auth.users rows predate this trigger and predate `profiles`
-- entirely — the only one today is the account created by hand in the
-- Supabase dashboard back in D-23. Backfill it as admin so this migration
-- doesn't lock you out of your own panel.
insert into profiles (id, name, role, status)
select id, email, 'admin', 'active' from auth.users
on conflict (id) do update set role = 'admin', status = 'active';

-- ── is_admin() / can_edit() now read profiles, not the JWT ────
-- Same function names/signatures as schema.sql's is_admin() — every RLS
-- policy across all 8 existing tables re-permissions itself for free.

create or replace function public.is_admin()
returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  )
$$;

create or replace function public.can_edit()
returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor') and status = 'active'
  )
$$;

-- ── docs / media: editors get full access, not admin-only ─────
-- Every other table (categories, testimonials, resources, site_settings)
-- keeps its existing "admin manages X" policy from schema.sql/003 — those
-- stay admin-only per the 2-role decision. Only docs, media, and
-- doc_translations (Bengali content — 002-i18n.sql) open up.

drop policy "admin manages docs" on docs;
create policy "editors manage docs" on docs for all
  using (public.can_edit()) with check (public.can_edit());

drop policy "admin manages media" on media;
create policy "editors manage media" on media for all
  using (public.can_edit()) with check (public.can_edit());

-- doc_translations (002-i18n.sql) was missed when docs/media opened up
-- above — Bengali translation is doc content too, editors need it.
drop policy "admin manages translations" on doc_translations;
create policy "editors manage translations" on doc_translations for all
  using (public.can_edit()) with check (public.can_edit());

-- ── docs: soft delete ────────────────────────────────────────
-- Admin-only, per decision — enforced twice: RLS below is app-layer
-- convenience, this trigger is the real gate (a determined editor with a
-- valid JWT could otherwise call the update API directly and delete
-- something the app's UI would have refused).

alter table docs add column deleted_at timestamptz;

create index docs_deleted_idx on docs(deleted_at) where deleted_at is not null;

create or replace function public.enforce_delete_restore_admin_only()
returns trigger language plpgsql as $$
begin
  if (new.deleted_at is distinct from old.deleted_at) and not public.is_admin() then
    raise exception 'Only an admin can delete or restore a lesson.';
  end if;
  return new;
end;
$$;

create trigger docs_delete_restore_guard
  before update on docs
  for each row execute function public.enforce_delete_restore_admin_only();

-- Soft-deleted rows keep occupying `path`/`(category_id, slug)` forever
-- under the old plain unique constraints — recreating a lesson at the same
-- path after deleting it would fail. Swap for partial unique indexes that
-- only apply to live rows.
alter table docs drop constraint docs_path_key;
alter table docs drop constraint docs_category_id_slug_key;
create unique index docs_path_key on docs(path) where deleted_at is null;
create unique index docs_category_id_slug_key on docs(category_id, slug) where deleted_at is null;

-- Public reads must exclude soft-deleted rows too — this is the one place
-- that matters, since lib/content.ts's ~8 read paths all go through RLS
-- rather than each needing its own deleted_at filter.
drop policy "public reads published docs" on docs;
create policy "public reads published docs" on docs for select
  using (status = 'published' and deleted_at is null);

-- ── doc_revisions ────────────────────────────────────────────
-- Snapshot on every save (lib/admin/doc.ts), capped at 20/doc by the app
-- (oldest pruned after insert). What makes "review what a user is doing"
-- real — an activity_log line says *that* something changed, this shows
-- *what*.

create table doc_revisions (
  id         uuid        primary key default gen_random_uuid(),
  doc_id     uuid        not null references docs(id) on delete cascade,
  actor_id   uuid        references auth.users(id) on delete set null,
  title      text        not null,
  blocks     jsonb       not null,
  toc        jsonb       not null,
  status     text        not null,
  created_at timestamptz not null default now()
);

create index doc_revisions_doc_idx on doc_revisions(doc_id, created_at desc);

alter table doc_revisions enable row level security;
create policy "editors manage revisions" on doc_revisions for all
  using (public.can_edit()) with check (public.can_edit());

-- ── activity_log ─────────────────────────────────────────────
-- Append-only (no update/delete policy — nobody can edit their own
-- history, including admins, short of the SQL editor). entity_label is
-- denormalized on purpose: a doc/category/user can later be deleted or
-- renamed, and the log should still read sensibly.
-- Known ceiling: only catches what goes through the app. A script run
-- with the service-role key, or an edit made directly in Supabase Studio,
-- has no authenticated user to attribute and won't appear here.

create table activity_log (
  id           uuid        primary key default gen_random_uuid(),
  actor_id     uuid        references auth.users(id) on delete set null,
  action       text        not null,
  entity_type  text        not null,
  entity_id    text,
  entity_label text,
  meta         jsonb,
  created_at   timestamptz not null default now()
);

create index activity_log_created_idx on activity_log(created_at desc);

alter table activity_log enable row level security;
create policy "editors write activity" on activity_log for insert with check (public.can_edit());
create policy "admin reads activity" on activity_log for select using (public.is_admin());

-- ── leads: dropped (D-36, no contact form was ever built) ─────

drop table if exists leads;

-- ── Verify ───────────────────────────────────────────────────
--   select id, role, status from profiles;             -- your account, role='admin'
--   select count(*) from docs where deleted_at is null; -- 150, unchanged
--   insert into docs (path, ...) at an already-live path should now
--     succeed once the live row's deleted_at is set (soft-deleted)
--   select * from leads;                                -- relation does not exist
