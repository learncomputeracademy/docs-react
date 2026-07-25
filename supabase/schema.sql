-- ============================================================
-- docs.learncomputer.in — Supabase schema
-- Run this in the Supabase SQL editor (project: ipurerfngdvoxbypfdzt)
-- Adapted from MIGRATION-PLAN.md §2 — blocks jsonb per D-11
-- Admin check uses app_metadata per ADMIN.md (NOT user_metadata)
-- ============================================================

-- ── Helper ───────────────────────────────────────────────────

create or replace function auth.is_admin()
returns boolean
language sql stable security definer as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  )
$$;

-- ── Tables ───────────────────────────────────────────────────

create table categories (
  id          uuid    primary key default gen_random_uuid(),
  slug        text    unique not null,   -- 'css', 'html', 'javascript', etc.
  title       text    not null,
  description text,
  sort_order  int     not null default 0
);

create table docs (
  id               uuid        primary key default gen_random_uuid(),
  category_id      uuid        references categories(id) on delete restrict,
  slug             text        not null,           -- new slug: 'intro', 'flexbox'
  path             text        unique not null,    -- new URL: 'css/intro'
  old_path         text,                           -- old Jekyll permalink for 301s
  title            text        not null,
  meta_title       text,
  meta_description text,
  blocks           jsonb       not null default '[]', -- typed block content (D-11)
  toc              jsonb       not null default '[]', -- [{id, text, level}]
  status           text        not null default 'draft'
                               check (status in ('draft', 'published')),
  sort_order       int         not null default 0,
  search_vector    tsvector    generated always as (
                     setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
                     setweight(to_tsvector('english', coalesce(meta_description, '')), 'B')
                   ) stored,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  published_at     timestamptz,
  unique (category_id, slug)
);

create table testimonials (
  id          uuid    primary key default gen_random_uuid(),
  name        text    not null,
  course      text,
  testimonial text    not null,
  image_url   text,
  rating      int     check (rating between 1 and 5),
  published   boolean not null default false,
  sort_order  int     not null default 0
);

create table resources (
  id            uuid  primary key default gen_random_uuid(),
  group_name    text  not null,   -- 'free_images', 'fonts', 'color_tools', etc.
  name          text  not null,
  url           text  not null,
  thumbnail_url text,
  sort_order    int   not null default 0
);

create table leads (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  email      text        not null,
  phone      text,
  message    text,
  source     text,
  status     text        not null default 'new',
  created_at timestamptz not null default now()
);

create table site_settings (
  key   text  primary key,
  value jsonb not null
);

-- ── Indexes ──────────────────────────────────────────────────

create index docs_search_idx    on docs using gin(search_vector);
create index docs_path_idx      on docs(path);
create index docs_category_idx  on docs(category_id);
create index docs_status_idx    on docs(status);

-- ── updated_at trigger ───────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

create trigger docs_updated_at
  before update on docs
  for each row execute function set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────

alter table docs          enable row level security;
alter table categories    enable row level security;
alter table testimonials  enable row level security;
alter table resources     enable row level security;
alter table leads         enable row level security;
alter table site_settings enable row level security;

-- Public reads
create policy "public reads published docs"         on docs         for select using (status = 'published');
create policy "public reads categories"             on categories   for select using (true);
create policy "public reads published testimonials" on testimonials for select using (published = true);
create policy "public reads resources"              on resources    for select using (true);
create policy "public reads settings"               on site_settings for select using (true);
create policy "anyone can submit a lead"            on leads        for insert with check (true);

-- Admin: full control on every table
create policy "admin manages docs"          on docs          for all using (auth.is_admin()) with check (auth.is_admin());
create policy "admin manages categories"    on categories    for all using (auth.is_admin()) with check (auth.is_admin());
create policy "admin manages testimonials"  on testimonials  for all using (auth.is_admin()) with check (auth.is_admin());
create policy "admin manages resources"     on resources     for all using (auth.is_admin()) with check (auth.is_admin());
create policy "admin manages leads"         on leads         for all using (auth.is_admin()) with check (auth.is_admin());
create policy "admin manages settings"      on site_settings for all using (auth.is_admin()) with check (auth.is_admin());

-- ── Seed: categories ─────────────────────────────────────────
-- 7 categories after the design/photoshop split (D-12a)

insert into categories (slug, title, sort_order) values
  ('basics',     'Computer Basics',  1),
  ('html',       'HTML',             2),
  ('css',        'CSS',              3),
  ('javascript', 'JavaScript',       4),
  ('react',      'React',            5),
  ('design',     'Graphic Design',   6),
  ('photoshop',  'Photoshop',        7);

-- ── DB size helper (used by admin usage panel) ───────────────

create or replace function db_size()
returns bigint
language sql stable security definer as $$
  select pg_database_size(current_database())
$$;

-- ── Verify ───────────────────────────────────────────────────
-- After running, check:
--   select count(*) from categories;              -- expect 7
--   select * from auth.users;                     -- should be empty
--   select from docs where status = 'published';  -- 0 rows until extraction
--
-- Test RLS with anon key (must see 0 docs rows — none published yet):
--   select count(*) from docs;
--
-- Create admin user in Supabase dashboard Auth tab, then run:
--   update auth.users
--   set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
--   where email = 'your-admin-email@example.com';
