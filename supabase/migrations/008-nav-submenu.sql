-- ============================================================
-- Nav sub-menus (one level deep) + the box model demo entry
-- Run this in the Supabase SQL editor, same as 002-007.
--
-- WordPress-style nesting, capped at two levels: a site header realistically
-- never needs deeper, and unbounded depth means unbounded dropdown UI.
-- The cap is enforced in the app (lib/admin/nav.ts), not by a CHECK here —
-- a self-referencing FK can't express "parent must itself have no parent"
-- without a trigger, and this is one form field, not a hostile input path.
-- ============================================================

alter table nav_items add column parent_id uuid references nav_items(id) on delete cascade;

create index nav_items_parent_idx on nav_items(parent_id);

-- Box Model Demo as a child of Resources (D-43). Subselect rather than a
-- hardcoded uuid — 006 generated the Resources row's id at run time.
insert into nav_items (label, label_bn, url, sort_order, parent_id)
select 'Box Model Demo', 'বক্স মডেল ডেমো', '/tools/box-model', 1, id
from nav_items
where url = '/resources'
limit 1;

-- ── Verify ───────────────────────────────────────────────────
--   select n.label, n.url, p.label as parent
--   from nav_items n left join nav_items p on p.id = n.parent_id
--   order by coalesce(n.parent_id::text, ''), n.sort_order;
--   -- expect: Resources (no parent), Box Model Demo (parent: Resources)
