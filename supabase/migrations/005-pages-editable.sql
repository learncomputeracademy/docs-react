-- ============================================================
-- Pages screen: site_settings opens up to editors
-- Run this in the Supabase SQL editor, same as 002/003/004.
--
-- The admin sidebar's "Settings" (free-tier usage) and "Pages" (home
-- hero/about-band copy) used to be one screen, both admin-only. Splitting
-- them moved the site_settings-backed content to a screen editors can
-- reach — it's page content, not project configuration — but the table's
-- RLS policy (schema.sql) was still is_admin()-only. Without this,
-- saveSettings() from an editor session fails silently against RLS.
-- ============================================================

drop policy "admin manages settings" on site_settings;
create policy "editors manage settings" on site_settings for all
  using (public.can_edit()) with check (public.can_edit());

-- ── Verify ───────────────────────────────────────────────────
--   select policyname, cmd from pg_policies where tablename = 'site_settings';
--   -- expect "public reads settings" (select) and "editors manage settings" (all)
