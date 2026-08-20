# Admin panel spec

`/admin` — the editing surface for the site. Behind Supabase Auth, `noindex`, guarded by
middleware. Client-rendered is fine; there is no SEO concern behind a login.

Governed by **[D-10](DECISIONS.md)**. Read that first for why content is in Postgres.

---

## Screens

| Screen | Function |
|---|---|
| Dashboard | counts, recently edited docs |
| Docs list | filter by category/status, drag to reorder, bulk publish, delete (admin-only, soft) |
| Doc editor | title, slug, **path (locked after launch — see D-12)**, meta title/description, **block editor** → `docs/CONTENT-MODEL.md`, draft/publish, live preview, **revision history + restore** |
| Pages | homepage hero + about-band text today, more pages as needed — see D-38 |
| SEO | Search Console / Bing Webmaster verification codes — see D-39 |
| Menu | header nav CRUD + reorder — **admin-only**, see D-40 |
| Categories | CRUD + ordering — **admin-only** |
| Testimonials | CRUD + publish toggle |
| Resources | CRUD, grouped — see D-42 (editor-accessible) |
| Notes | Freeform rich-text notes/todos (Tiptap, incl. task-list checkboxes) with private file attachments — **admin-only**, shared across all admin accounts, see D-60 |
| Settings | **usage panel** (below) — **admin-only**, see D-38 |
| Users | create/edit-role/block/delete accounts — **admin-only**, see D-37 |
| Activity | who-did-what feed across the whole panel — **admin-only**, see D-37 |
| Trash | soft-deleted lessons, restore — **admin-only**, see D-37 |

### Two rules that matter more than they look

**Lock `path` after first publish.** An editor casually renaming a URL undoes the entire
SEO-parity effort and is invisible until traffic drops weeks later. Lock the field, or
auto-create a 301 when it changes. Never let it change silently.

**Preview before publish.** Render the real doc page with `status='draft'`, visible only to
authenticated admins. Editors will otherwise publish to check their work.

---

## Usage panel — requested feature

A Settings-screen card (moved off the Dashboard, D-38 — admin-only, editors don't need
free-tier internals in front of them) tracking free-tier headroom. **Track all four
limits, not just storage** —
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

## Resources link-health check

Separate daily Action, added 2026-08-20 in response to a user request ("don't show a
resource link if it's dead or redirecting somewhere else"). DB writes only — no git
operations, unlike the backup job above.

```yaml
# .github/workflows/check-resource-links.yml
on:
  schedule: [{ cron: "20 3 * * *" }]   # 03:20 UTC — offset from the backup job
  workflow_dispatch:
```

`scripts/check-resource-links.mjs`: `HEAD` (GET fallback on 405/501) each resource URL with
a real browser UA, follows redirects, flags a link `redirect_offsite` if the final host
differs from the saved one (same-domain redirects — http→https, trailing slash, www — are
not flagged), `dead` on status ≥400/timeout/network error. `/resources` (`getResources()`,
`lib/content.ts`) filters those two out unless an admin sets `link_force_show` from
`/admin/resources`.

**Doesn't check every link every day.** Healthy (`ok`) links rotate through 30 daily
buckets (`id` char-sum `% 30`) — full catalog re-checked monthly, flat cost regardless of
catalog size. `unchecked`/already-flagged links are checked every run instead, so new or
fixed links resolve fast. A link only flips out of `ok` after 2 consecutive failures, so one
flaky check doesn't hide it.

**Why this stays DB-only, no `revalidateTag`:** matches the standing ISR-quota block
(CLAUDE.md) — the same reason this job's writes don't show on the live `/resources` page
until that block is lifted and a `revalidateTag('resources')` call is added to the script
(flat cost either way: one tag covers the whole page regardless of how many rows changed
that day, so it doesn't scale with catalog size once wired in).

Considered and rejected: any 3rd-party link-checking API. Uptime-monitor free tiers (UptimeRobot,
Freshping) cap around 50 monitors — far short of a resources catalog that could reach the
1000s; scraping/proxy APIs (ScrapingBee, ScraperAPI) cap free tiers around 1000 calls/**month**,
which one full check pass would exhaust outright. Self-hosted `fetch` + the 30-bucket stagger
above is the only actually-free option at scale, and also avoids a real risk none of those
services solve for free: hammering 1000s of external domains daily from one CI runner IP risks
some sites' WAFs blocking/challenging that IP, producing false dead-link flags — the fix is
fewer requests per day (staggering), not a different checker.

---

## Auth

**Superseded by D-37 (2026-07-27).** Role/status now live in a `profiles` table, not
`app_metadata` — a JWT claim doesn't change until the token refreshes (up to an hour),
which made "block this user" too slow to be real. `public.is_admin()` / `public.can_edit()`
read `profiles`; `proxy.ts` and every RLS policy across all 9 tables key off those two
functions. Two roles: **admin** (everything, incl. Users/Categories/Settings, can delete/
restore) and **editor** (docs, media, translations, pages, SEO, and — since D-42 —
resources: write and publish, cannot delete/restore lessons or manage users/categories/
settings/menu).

- New users are created from `/admin/users` (service-role `auth.admin.createUser`), not by
  hand in the dashboard — a `handle_new_user()` trigger gives every new `auth.users` row a
  `profiles` row automatically.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never `NEXT_PUBLIC_*`, never a client
  component. Grep the build output before deploying.
- Deleting an admin account is blocked outright — demote to editor first, a deliberate
  separate step, so no single click removes an admin by mistake.
