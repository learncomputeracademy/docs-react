-- ============================================================
-- Stage 7: Admin panel — schema additions
-- Run this in the Supabase SQL editor, same as supabase/schema.sql.
--
-- NOTE: ADMIN-PLAN.md §3 proposed `alter table docs alter column
-- category_id drop not null` for standalone pages (e.g. /about/). Checked
-- supabase/schema.sql directly — category_id already has no NOT NULL
-- constraint, so that line is a no-op and is omitted here. A standalone
-- page is already just a docs row with category_id IS NULL, today.
-- ============================================================

-- ── Settings seed — homepage/footer/contact copy store ────────
-- site_settings already exists (schema.sql); this seeds the 3 keys the
-- admin settings screen and the home/footer refactor will read from.

insert into site_settings (key, value) values
  ('home',    '{}'::jsonb),
  ('footer',  '{}'::jsonb),
  ('contact', '{}'::jsonb)
on conflict (key) do nothing;

-- ── Media library ────────────────────────────────────────────
-- The only genuinely new table Stage 7 needs (ADMIN-PLAN.md §3/§5 Screen 8).

create table media (
  id         uuid        primary key default gen_random_uuid(),
  backend    text        not null check (backend in ('cloudinary', 'r2')),
  public_id  text        not null,          -- Cloudinary publicId or R2 key
  url        text        not null,
  kind       text        not null check (kind in ('image', 'video', 'file')),
  alt        text,
  width      int,
  height     int,
  bytes      int,
  created_at timestamptz not null default now(),
  unique (backend, public_id)
);

alter table media enable row level security;

create policy "public reads media" on media for select using (true);
create policy "admin manages media" on media for all
  using (public.is_admin()) with check (public.is_admin());

-- ── Verify ───────────────────────────────────────────────────
--   select key from site_settings order by key;  -- expect contact, footer, home
--   select count(*) from media;                  -- expect 0, table just created
