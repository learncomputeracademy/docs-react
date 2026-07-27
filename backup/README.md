# This is a backup. It is not the site.

Everything in this directory is written automatically, once a day, by
`.github/workflows/supabase-daily.yml` running `scripts/daily-backup.mjs`.

- **Never edit these files.** Edits here do not reach the live site and will be
  silently overwritten by tomorrow's run.
- **Never build from these files.** The app reads content from Supabase
  (`lib/content.ts`), never from this directory.
- **Only use this during an actual restore**, using `backup/docs.json` (the full
  JSON dump — the real restore source) against the live database. The `.mdx`
  files under `content/` are a human-readable secondary view of the same data,
  not a separate format to restore from.

This exists for two reasons (see `docs/ADMIN.md`):

1. Supabase's free tier pauses a project after 7 days with no database activity,
   and offers no automated backups on that tier. The daily job's own query resets
   that clock; the export gives us something to restore from if the worst happens
   anyway.
2. A scheduled GitHub Action on a repo with no other activity gets disabled by
   GitHub after 60 days — the daily backup commit is itself repository activity,
   which keeps the job alive.
