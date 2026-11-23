-- ============================================================
-- 014: Typing test data in learner accounts (2026-11-23)
-- Run in the Supabase SQL editor. Safe to run before or after the deploy:
-- the site keeps syncing everything else if this column is missing.
--
-- One jsonb column holding what the typing test keeps in the browser:
--   { history: [...last 100 results], weakKeys: { "e": 12, ... },
--     lessons: { "<lessonId>": { completed, bestWpm, bestAccuracy } },
--     settings: {...} }
-- About 10 KB per learner. Owner-only, like the rest of the row (RLS from 013).
-- ============================================================

alter table learner_progress add column if not exists typing jsonb;

alter table learner_progress drop constraint if exists learner_progress_typing_size;
alter table learner_progress add constraint learner_progress_typing_size
  check (typing is null or pg_column_size(typing) <= 100000);

-- Check after running:
-- select column_name from information_schema.columns
--   where table_name = 'learner_progress' and column_name = 'typing';  -- expect 1 row
