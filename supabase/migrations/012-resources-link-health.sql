-- ============================================================
-- Resources: periodic link-health checking
-- Run this in the Supabase SQL editor, same as 002-011.
--
-- Adds status tracking so scripts/check-resource-links.mjs (run daily by
-- .github/workflows/check-resource-links.yml) can mark dead/off-domain-
-- redirecting links, and the public /resources page can stop showing them.
-- Written by the service role (bypasses RLS, same as the daily backup
-- script) — no policy changes needed here.
-- ============================================================

alter table resources add column link_status text not null default 'unchecked'
  check (link_status in ('unchecked', 'ok', 'redirect_offsite', 'dead'));
alter table resources add column link_checked_at timestamptz;
alter table resources add column link_fail_count int not null default 0;
-- Manual override: admin can force a flagged link to keep showing (false
-- positive — checker got WAF-blocked, site requires auth, etc.) without
-- waiting for the status itself to clear.
alter table resources add column link_force_show boolean not null default false;

-- ── Verify ───────────────────────────────────────────────────
--   select column_name, data_type from information_schema.columns
--   where table_name = 'resources' and column_name like 'link_%';
