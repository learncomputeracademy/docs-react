-- ============================================================
-- Resources screen: editors get access too
-- Run this in the Supabase SQL editor, same as 002-006.
--
-- User: editors should be able to manage the Resources list, same as
-- Docs/Media/Pages/SEO already are (D-37/D-38). Resources was left
-- admin-only at the time (schema.sql) alongside Categories/Settings/
-- Users — this moves it to the editor tier.
-- ============================================================

drop policy "admin manages resources" on resources;
create policy "editors manage resources" on resources for all
  using (public.can_edit()) with check (public.can_edit());

-- ── Verify ───────────────────────────────────────────────────
--   select policyname, cmd from pg_policies where tablename = 'resources';
--   -- expect "public reads resources" (select) and "editors manage resources" (all)
