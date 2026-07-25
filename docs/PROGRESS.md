# Progress journal

**Read this first when starting a new session.** It is the running record of what is done,
what is next, and what was learned the hard way.

**How to use it:** append a dated entry per working session. Newest at the top. State what
actually happened, including what failed — a journal that only records successes is useless
for picking up work weeks later.

---

## Current state — 2026-07-25

**Phase:** Stage 1 ✅ scaffold complete · Stage 2 ⬜ schema written, awaiting user to run it · Stage 3 dry-run ✅ passed.
**Architecture:** Next.js 16 LTS + **Supabase (free tier)** + Vercel, ISR with on-demand

### ⚡ Next action

1. **User: run `supabase/schema.sql`** in the Supabase SQL editor (project `ipurerfngdvoxbypfdzt`). Paste the entire file and execute.
2. **User: create admin user** in Supabase Auth tab, then run the `update auth.users` command at the bottom of schema.sql to set `role: admin` in `app_metadata`.
3. After schema is in: run `node scripts/extract-docs.mjs --verbose` again, then write the DB-insert version of the script (Stage 3 proper).

### Stage board

| # | Stage | Status | Notes |
|---|---|---|---|
| 0 | Baseline & URL inventory | 🟨 partial | `urls-before.txt` done. Search Console export + `git tag pre-migration` outstanding |
| 1 | Scaffold Next.js 16 + Tailwind + shadcn | ✅ **DONE** | Next 16.2.11, Tailwind v4, shadcn (manual), unplugin-icons, Supabase clients |
| 2 | Supabase schema + RLS + auth | 🟨 **SQL written** | `supabase/schema.sql` ready — **user must run it in dashboard** |
| 3 | **Extraction: 132 HTML docs → Supabase** ⭐ | 🟨 dry-run ✅ | `scripts/extract-docs.mjs` passes — 64 clean / 52 mech / 15 demo / 0 fail. DB-insert pass next. |
| 4 | Assets → Cloudinary | ⬜ | credentials received; see [ASSETS.md](ASSETS.md) |
| 5 | Public site build | ⬜ | |
| 6 | ISR + revalidation webhook · Try It editor | ⬜ | HTML/CSS/JS + React |
| 7 | Admin panel + usage panel + daily keep-alive/backup | ⬜ | spec in [ADMIN.md](ADMIN.md) |
| 8 | Search (Postgres FTS) + contact form | ⬜ | both are new functionality, not migration |
| 9 | **SEO foundation** | ⬜ | ~~highest-risk~~ → low risk / high upside. D-12 confirmed |
| 10 | Cutover to Vercel | ⬜ | **+ set up Search Console & Bing, submit sitemap** |
| 11 | Post-launch watch | ⬜ | watching for **first indexing** |

### Measured facts worth not re-deriving

Full detail and method in **[RESEARCH.md](RESEARCH.md)**.

- **Extraction is safe.** 0 of 132 files lack `.doc-content`. 64 clean · 52 mechanical · **15 demo** · 0 fail. Verified 2026-07-25 by running `scripts/extract-docs.mjs`.
- Content: **1.1 MB raw**, 132 files, avg 8.3 KB, 4,687 top-level blocks. In Postgres ≈ **5 MB of 500 MB — about 1%.**
- Assets: 216 MB in `assets/img` → **188 MB referenced, 28 MB orphaned.** ~90 MB of the referenced is **PDFs**.
- Links: 131 distinct internal, **89 already broken on the live site today**.
- Live URLs: **140** (`urls-before.txt`).
- URL map: **131 entries** in `scripts/url-map.json` (132 − 1 redirect for duplicate poster page).
- Categories: **7** — `basics` 1 · `css` 35 · `design` 17 · `html` 36 · `javascript` 28 · `photoshop` 12 · `react` 2.
- Stack: **Next.js 16.2.x LTS** · Tailwind v4 · shadcn/ui (Radix) · Supabase free = 500 MB / 5 GB egress / **2 projects max**.
- ⚠️ **Supabase pause clock resets only when schema is applied.** Do it today.

---

## 2026-07-25 — Session 3: Stage 1 scaffold + Stage 3 dry-run

**Done**

- Scaffolded Next.js 16.2.11 (Turbopack default → forced `--webpack` because unplugin-icons requires it).
- Installed: `@supabase/supabase-js`, `@supabase/ssr`, Tailwind v4, `@tailwindcss/typography`, `unplugin-icons`, `@iconify/json`, `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `cheerio`, `gray-matter`, `nanoid`.
- shadcn/ui: configured manually (init requires TTY; components.json + CSS vars written by hand). Radix UI base.
- Globals.css: shadcn neutral theme (OKLCH), dark mode via `.dark` class, typography plugin.
- next.config.ts: Cloudinary `remotePatterns` + unplugin-icons webpack plugin.
- Lib layer: `lib/types.ts` (Block types), `lib/content.ts` (choke point), `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/admin.ts`, `lib/database.types.ts` (stub).
- Supabase schema: `supabase/schema.sql` — categories, docs (blocks jsonb, D-11), testimonials, resources, leads, site_settings, RLS, 7 category seed rows, db_size() helper. Not yet applied — needs user action.
- Extraction script: `scripts/extract-docs.mjs` — dry-run, 132 files → JSON. Result: **64/52/15/0** (matches baseline). URL map: 131 entries in `scripts/url-map.json`.
- TypeScript clean (`tsc --noEmit` exits 0).

**Findings worth remembering**

1. **Turbopack + unplugin-icons** don't mix. Solution: `next dev --webpack` in package.json scripts. Production builds were already webpack; this aligns dev with prod.
2. **shadcn@4.14.1 init now asks which base library** (Base UI / React Aria / Radix UI via arrow-key menu — no TTY, no auto). Chose Radix UI; set up components.json manually. This is fine.
3. **CSS variables format changed for Tailwind v4**: uses OKLCH values and `@theme inline {}` block instead of `:root { --background: hsl(0 0% 100%) }`. globals.css updated accordingly.
4. **Classification bug (fixed in session)**: initial classifier checked raw file for `class="row"` — ALL files have this in the outer Liquid chrome. Fixed to check inside `.doc-content` only.

**Failed / abandoned**

- `npx shadcn@latest init -y` — exits 0 but blocks on a non-TTY arrow-key prompt. Resolved by manual setup.

**Next session — start here**

1. ⚡ **User must run `supabase/schema.sql`** in the Supabase SQL editor first. This also resets the pause clock.
2. Write the DB-insert version of `scripts/extract-docs.mjs` (add `--write` flag, `upsert` on conflict `path`).
3. Run it dry-run first, then `node scripts/extract-docs.mjs --write` to populate.
4. Verify: 131 rows in `docs`, 7 in `categories`, no Liquid/Bootstrap residue.

---

## 2026-07-24 — Session 2: research day (no code, by design)
revalidation. ⚠️ **D-01 was reversed the same day it was made — content is in Postgres,
not MDX. Read [D-10](DECISIONS.md) before touching anything.**
**Next action:** Stage 3 — the extraction script.
**Blocked on:** nothing. All credentials received.

### Credentials — where they live (values never in a tracked file)

| Service | Identifier | Status |
|---|---|---|
| Cloudinary | cloud `docslca` | ✅ in `.env.local` |
| Supabase | project ref `ipurerfngdvoxbypfdzt` | ✅ in `.env.local`, **verified live 2026-07-24** |

Variable names are in `.env.example`. Values are in `.env.local`, which is git-ignored and
sweep-verified. Mirror both into Vercel → Settings → Environment Variables before the first
deploy.

⏰ **Supabase pause clock is running.** The project is empty and idle; free tier pauses
after 7 days of no DB activity — **~2026-07-31** if nothing touches it. Either start
Stage 2 before then or stand up the keep-alive job early (`docs/ADMIN.md`).

### Stage board

| # | Stage | Status | Notes |
|---|---|---|---|
| 0 | Baseline & URL inventory | 🟨 partial | `urls-before.txt` done (140 URLs). Search Console export + `git tag pre-migration` still outstanding |
| 1 | Scaffold Next.js 16 + Tailwind + shadcn | ⬜ | |
| 2 | Supabase schema + RLS + auth | ⬜ | **needs project credentials.** Schema in `MIGRATION-PLAN.md` §2 |
| 3 | **Extraction: 132 HTML docs → Supabase** ⭐ | ⬜ | critical path — holds every unknown. Can be written and dry-run before Stage 2 lands |
| 4 | Assets → Cloudinary | ⬜ | credentials received; see [ASSETS.md](ASSETS.md) |
| 5 | Public site build | ⬜ | |
| 6 | ISR + revalidation webhook · Try It editor | ⬜ | HTML/CSS/JS + React |
| 7 | Admin panel + usage panel + daily keep-alive/backup | ⬜ | spec in [ADMIN.md](ADMIN.md) |
| 8 | Search (Postgres FTS) + contact form | ⬜ | both are new functionality, not migration |
| 9 | **SEO foundation** | ⬜ | ~~highest-risk~~ → low risk / high upside. D-12 confirmed |
| 10 | Cutover to Vercel | ⬜ | **+ set up Search Console & Bing, submit sitemap** — never existed before |
| 11 | Post-launch watch | ⬜ | watching for **first indexing**, not traffic recovery |

### Measured facts worth not re-deriving

Full detail and method in **[RESEARCH.md](RESEARCH.md)**.

- **Extraction is safe.** 0 of 132 files lack `.doc-content` — the plan's hard fail
  condition is zero. 65 clean · 52 mechanical · **15 need a decision** (live demos → `tryit`).
- Content: **1.1 MB raw**, 132 files, avg 8.3 KB, 4,687 top-level blocks. In Postgres
  ≈ **5 MB of 500 MB — about 1%.**
- Assets: 216 MB in `assets/img` → **188 MB referenced, 28 MB orphaned.** ~90 MB of the
  referenced is **PDFs**, not images.
- Links: 131 distinct internal, **89 already broken on the live site today**.
- Live URLs: **140** (`urls-before.txt`).
- Categories: **7** after the approved `design`/`photoshop` split — `basics` 1 · `css` 35 ·
  `design` 17 · `html` 36 · `javascript` 28 · `photoshop` 12 · `react` 2.
- ⚠️ **`graphics-design-poster` and `-posters` are duplicate pages** (differ by one link).
  Merging → 131 lessons. See `docs/URLS.md`.
- Stack: **Next.js 16.2.x LTS** · Supabase free = 500 MB / 5 GB egress / **2 projects max**.

---

## 2026-07-24 — Session 1: audit, decisions, scaffolding of the record

**Done**

- Audited the Jekyll source at `C:\Users\Raptor\Downloads\docs-master\docs-master`.
  Findings recorded in `CLAUDE.md` §2.
- Captured `urls-before.txt` — **140 URLs**. This is the acceptance test for the entire
  migration: the diff against `urls-after.txt` must be empty before cutover.
- Resolved all six open architecture questions with the user → `docs/DECISIONS.md` D-01…D-08.
- Received Cloudinary credentials (account `docslca`). Written to `.env.local`;
  **verified git-ignored** via `git check-ignore` before anything else was written.
- Created `CLAUDE.md`, `docs/DECISIONS.md`, `docs/ASSETS.md`, this file, `.gitignore`,
  `.env.example`.

**Findings worth remembering**

1. **The contact form has never worked on GitHub Pages.** It posts to
   `<?=$_SERVER['PHP_SELF']?>` — PHP, on a static host. Every submission since the site
   moved to Pages has gone nowhere. Leads have been silently lost.
2. **Search has never worked either.** `search.json` is 0 bytes; `_includes/search.html`
   is a bare form with no JavaScript behind it.
3. ~~`/resourses/` is misspelled and stays misspelled.~~ **Overturned by D-12** — it
   becomes `/resources`.
4. ~~`box-model` trailing-slash exception.~~ **Overturned by D-12** — everything moves to
   `trailingSlash: false` under `/tools/`.
5. ~~`graphics-design` is 181 MB, mostly prunable.~~ **Overturned by measurement** — only
   28 MB of the 216 MB is orphaned; ~90 MB is *referenced PDFs*. See `docs/RESEARCH.md` §2.
6. Only the contents of `<div class="doc-content">` is real content in each file.
   Everything outside it is Bootstrap grid scaffolding and Liquid includes.
7. Four near-duplicate sidebar includes exist. They collapse into one data-driven
   `<DocSidebar />`.

**Late in the session — architecture reversed**

The user moved from MDX back to **Supabase free tier** (D-10), for future upgrade room
(student accounts), a more professional editing surface, and no deploy wait on publish.
D-01, D-06, D-07 and D-09 are all superseded. `docs/ADMIN.md` written.

Two free-tier risks were raised and mitigated in the same stroke — the project pauses after
7 days idle, and free tier has no automated backups. One daily GitHub Action pings the DB
*and* commits a content export, solving both for free.

Worth noting for the record: reversing D-01 cost about twenty minutes of doc edits and
zero code, because no code existed yet and `lib/content.ts` was already the mandated
choke point. That is the argument for keeping it.

**Two more reversals, same session**

- **D-11 — lessons are typed blocks**, not one rich-text blob. Admin panel is a block
  editor on shadcn/ui + dnd-kit. Widget catalog derived from measured content, not
  invented: 634 code snippets, 802 headings, 78 tables, 166 images, and a long tail of 8
  callouts / 3 iframes / 2 videos. Phase 1 is 5 widgets covering ~95%. See
  `docs/CONTENT-MODEL.md`. Cost: Stage 3 must *segment* HTML, not dump it.
- **D-12 — the site is not indexed by Google**, so URLs are free to change. This is the
  largest de-risking event so far: it removes byte-for-byte URL preservation, the misspelled
  `/resourses/`, the trailing-slash exceptions, and most of Stage 9. New scheme in
  `docs/URLS.md`. ⚠️ **Unverified** — someone should run `site:docs.learncomputer.in`
  before this is fully relied on.

- **D-13 — UI libraries open**, under a performance budget (JS < 100 KB gz, Lighthouse
  ≥ 95). Iconify accepted but **compiled via `unplugin-icons`**, never the runtime-fetch
  mode. Added `cmdk` (⌘K palette), `sonner`, `dnd-kit`, Tiptap, CodeMirror 6, `motion`.
  Dark mode required. See `docs/UI.md`.

**Failed / abandoned**

- Nothing built yet, so nothing failed. Worth noting instead: **four decisions were
  reversed within hours of being made** (D-01, D-06, D-07, D-09). All were cheap because no
  code existed. This is the argument for having settled architecture *before* Stage 1, and
  for the `lib/content.ts` choke point.

---

## 2026-07-24 — Session 2: research day (no code, by design)

User's instruction: *"We are not building the project today but researching everything, so
that we can start from tomorrow."* Everything below is measured or verified. Full write-up
in **[RESEARCH.md](RESEARCH.md)**.

**Done**

- Parsed all 132 lesson files with cheerio to answer the one question the timeline depends
  on: **how hard is extraction?** Answer: 0 hard failures, 15 files needing judgment.
- Corrected the asset numbers, which were wrong in two directions at once.
- Verified Next.js and Supabase facts against current sources (six-month-old assumptions).
- Checked the indexing claim from outside.

**Findings that changed existing decisions**

1. ⚠️ **The prune estimate was wrong.** `MIGRATION-PLAN.md` promised "30–50% free savings";
   measured it is **13%** (28 MB of 216 MB). The content genuinely uses its images.
   **~90 MB is PDFs** linked with `<a href>` — invisible to an `<img src>` scan, which is
   how the first pass mis-classified them as orphans. `ASSETS.md` rewritten.
2. ⚠️ **Next.js 16.2.11 is current LTS**, not 15. Corrected everywhere. App Router / ISR /
   `revalidateTag` unchanged in shape, so no rework — but do not copy Next 15 snippets out
   of `MIGRATION-PLAN.md` without checking them.
3. ⚠️ **Supabase free tier allows only 2 active projects.** New constraint; check what
   already exists before creating one.
4. ⚠️ **D-12 needs a footnote.** No lesson page is indexed — the decision stands — but the
   domain *is* crawled and **two PDF asset URLs are in Google's index**. They need 301s to
   Cloudinary or the migration creates the site's first indexing errors.
5. **The 15 "hard" files are the best opportunity in the project.** They contain working
   `<form>`, `<select>`, `<textarea>` and inline `<style>` demos. Converting them to
   `tryit` blocks turns the most awkward content into the site's strongest pages.
6. `heading` blocks must allow **levels 2–6**, not 2–4. `CONTENT-MODEL.md` fixed.
7. **89 of 131 internal links are already broken on the live site**, including
   `tryit.asp?filename=trycss_text` — a leftover W3Schools link. Pre-existing, not caused
   by the migration, and nearly free to fix while rewriting links anyway.

**Failed / abandoned**

- First asset analysis produced **157 MB of "orphans" — wrong.** Two bugs: it counted only
  `<img src>` and ignored `<a href>` (hiding 90 MB of linked PDFs), and its path
  normaliser stripped `/` before `../`, so Liquid-prefixed paths never resolved. Caught
  because the same file appeared as both "orphan" and "unresolved". **Lesson for Stage 3:
  normalise paths in a loop until stable, and treat any internal contradiction in a report
  as a bug in the report, not a finding.**
- Did **not** verify indexing authoritatively. An external search cannot prove absence —
  Search Console is the only real answer. Still open.

**Supabase credentials received** (end of session 2). Project `ipurerfngdvoxbypfdzt`
verified live — GoTrue v2.193.1 responding, service-role and anon keys both valid, JWT
`ref` matches the project URL, keys valid to 2036. Database is empty; no schema yet.

*Diagnostic note so nobody re-chases it:* `GET /rest/v1/` returns **401 for the anon key by
design** — that endpoint is service_role-only (`"Only the service_role API key can be used
for this endpoint"`). It is not a broken key. Test anon against `/auth/v1/settings` instead.

**✅ D-12 CONFIRMED — the last open assumption is closed.** The user has no Search Console
property for this domain, and the site has no `sitemap.xml` (404) and no real `robots.txt`.
Google was never given a way to discover these 132 lessons. **The project's single largest
risk — losing organic traffic in migration — is now zero, because there is none to lose.**
Stage 9 flips from *parity defence* to *foundation build*; Stage 10 gains "create Search
Console + Bing properties and submit a sitemap", which has never existed for this site.

**Next session — Day 1, in order**

1. ~~Search Console check~~ — ✅ resolved, nothing blocking.
2. Apply the Stage 2 schema + RLS (`MIGRATION-PLAN.md` §2, adjusted for `blocks jsonb`
   per D-11). Doing this also resets the pause clock.
3. Scaffold: Next.js 16 LTS + Tailwind + shadcn + Iconify(`unplugin-icons`). Nothing else.
4. **Write `scripts/extract-docs.mjs`** — the critical path. Dry-run to JSON files on disk,
   no DB writes. Must emit `extract-report.json` *and* `url-map.json`.
5. Review report against the known baseline: 65 clean / 52 mechanical / 15 demos. A
   materially different split means the script is wrong, not the content.
6. Hand-review the 15 demo files and decide `tryit` vs `richtext` per file.

**Do not** start the public site build until step 5 matches. Everything downstream depends
on the extraction being trustworthy.

---

<!--
Template for a new entry:

## YYYY-MM-DD — Session N: <one-line theme>

**Done**
-

**Findings worth remembering**
-

**Failed / abandoned**   ← keep this section honest, it saves the most time later
-

**Next session — start here**
1.
-->
