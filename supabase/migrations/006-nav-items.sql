-- ============================================================
-- Header navigation menu
-- Run this in the Supabase SQL editor, same as 002/003/004/005.
--
-- The public header currently has zero nav links (logo + language switch
-- + theme toggle only). This makes the nav data-driven and admin-editable
-- instead of hardcoded, per the user's ask for a "menu nav dashboard to
-- manage menu items."
-- ============================================================

create table nav_items (
  id         uuid        primary key default gen_random_uuid(),
  label      text        not null,
  label_bn   text,
  url        text        not null,
  sort_order int         not null default 0,
  created_at timestamptz not null default now()
);

alter table nav_items enable row level security;

create policy "public reads nav items" on nav_items for select using (true);
-- Admin-only writes, same tier as categories/resources (site structure,
-- not day-to-day content) — not editors, unlike docs/media/pages/seo.
create policy "admin manages nav items" on nav_items for all
  using (public.is_admin()) with check (public.is_admin());

insert into nav_items (label, label_bn, url, sort_order) values
  ('Resources', 'রিসোর্স', '/resources', 1);

-- ── Verify ───────────────────────────────────────────────────
--   select label, url, sort_order from nav_items order by sort_order;
--   -- expect one row: Resources -> /resources
