# Admin panel spec

`/admin` — the editing surface for the site. Behind Supabase Auth, `noindex`, guarded by
middleware. Client-rendered is fine; there is no SEO concern behind a login.

Governed by **[D-10](DECISIONS.md)**. Read that first for why content is in Postgres.

---

## Screens

| Screen | Function |
|---|---|
| Dashboard | counts, recent leads, recently edited docs, **usage panel** (below) |
| Docs list | filter by category/status, drag to reorder, bulk publish |
| Doc editor | title, slug, **path (locked after launch — see D-12)**, meta title/description, **block editor** → `docs/CONTENT-MODEL.md`, draft/publish, live preview |
| Categories | CRUD + ordering |
| Testimonials | CRUD + publish toggle |
| Resources | CRUD, grouped |
| Leads inbox | read, mark status, CSV export |
| Settings | phone, email, address, social links |

### Two rules that matter more than they look

**Lock `path` after first publish.** An editor casually renaming a URL undoes the entire
SEO-parity effort and is invisible until traffic drops weeks later. Lock the field, or
auto-create a 301 when it changes. Never let it change silently.

**Preview before publish.** Render the real doc page with `status='draft'`, visible only to
authenticated admins. Editors will otherwise publish to check their work.

---

## Usage panel — requested feature

A dashboard card tracking free-tier headroom. **Track all four limits, not just storage** —
storage is the one with the most headroom and the least likely to bite.

| Metric | Free tier | Where it comes from | Warn at |
|---|---|---|---|
| **Database size** | 500 MB | `pg_database_size(current_database())` via an RPC | 70% |
| **Egress / bandwidth** | 5 GB / month | Supabase Management API | 70% |
| **File storage** | 1 GB | Storage API — likely 0, media is on Cloudinary (D-05) | 70% |
| **Monthly active users** | 50,000 | auth stats — near zero until student accounts exist | 70% |
| **Days since last activity** | pauses at **7** | max `updated_at` + the keep-alive job's log | ⚠️ **at 4 days** |

**Measured baseline:** content is ~5 MB of the 500 MB — about **1%**. Expect the panel to
read near-empty for a long time. That is the correct result, not a bug.

**The row that actually matters is the last one.** Storage will sit at 1% for years; the
7-day inactivity pause is the thing that will actually interrupt you. Make it the most
prominent element in the card, not a footnote.

```sql
-- run once; the panel calls this via supabase.rpc('db_size')
create or replace function db_size()
returns bigint language sql security definer as
$$ select pg_database_size(current_database()) $$;
-- restrict to admins
revoke execute on function db_size() from anon, authenticated;
grant  execute on function db_size() to service_role;
```

Read it server-side with the service-role key. Cache for an hour — it changes slowly and
every call is egress.

---

## Keep-alive + backup job

One daily GitHub Action does both jobs described in D-10. Free, ~15 lines.

```yaml
# .github/workflows/supabase-daily.yml
on:
  schedule: [{ cron: "0 3 * * *" }]   # 03:00 UTC daily
  workflow_dispatch:
```

1. **Ping** — `select 1`. Resets the 7-day inactivity clock so the project never pauses.
2. **Export** — dump every `docs` row to `backup/content/<category>/<slug>.mdx` plus
   `backup/docs.json`, and commit if changed.

**The export is a backup, never a source of truth.** It is not edited, not built from, not
imported except during an actual restore. Put a `README` in `backup/` saying exactly that —
someone (possibly a future me) will otherwise find those MDX files and assume they are live.

**Watch for:** a scheduled Action on a repo with no other activity gets disabled by GitHub
after 60 days of repository inactivity. The daily backup commit prevents this, since it is
itself repo activity — but if backups ever stop, check whether the workflow was disabled
before assuming the script broke.

---

## Auth

- Create the admin user by hand in the Supabase dashboard.
- Set `role: admin` in **`app_metadata`**, never `user_metadata` — users can edit their own
  `user_metadata`, which would make the role self-assignable. This is the single most
  common way a Supabase admin panel gets breached.
- RLS policies key off `auth.jwt() ->> 'role' = 'admin'`.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never `NEXT_PUBLIC_*`, never a client
  component. Grep the build output before deploying.
