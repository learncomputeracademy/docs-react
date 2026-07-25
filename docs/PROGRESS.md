# Progress journal

**Read this first when starting a new session.** It is the running record of what is done,
what is next, and what was learned the hard way.

**How to use it:** append a dated entry per working session. Newest at the top. State what
actually happened, including what failed — a journal that only records successes is useless
for picking up work weeks later.

---

## Current state — 2026-07-25

**Phase:** Stage 1 ✅ · Stage 2 ✅ (schema live) · **Stage 3 ✅ DONE — 131 docs in Supabase.**
**Architecture:** Next.js 16 LTS + **Supabase (free tier)** + Vercel, ISR with on-demand

### ⚡ Next action

Stage 4 continues — **PDFs are done, images are next.** Order per `docs/ASSETS.md`:
1. Prune the 28.1 MB of orphaned images (list already known from RESEARCH.md).
2. Convert the ~98 MB of referenced images to WebP q80 max 1600px, route through
   `lib/storage.ts` (Cloudinary in practice — converted images won't near 10 MB).
3. Emit `scripts/image-map.json` (old path → delivery URL).
4. **Follow-up pass on `docs`**: two surfaces need rewriting, same lesson learned from the
   PDF pass — `image` blocks' `_src` field (the join key kept for exactly this step), *and*
   any `<img src>` sitting inside richtext/table-cell HTML (table cells can contain raw
   `<img>` tags now that the extractor preserves cell HTML — confirmed in `design/intro`'s
   book-thumbnail column).

Also open, not blocking: `docs.sort_order` is currently file-scan order, not the old site's
intended teaching sequence — needs a manual reorder pass once the admin panel exists
(Stage 7).

### Stage board

| # | Stage | Status | Notes |
|---|---|---|---|
| 0 | Baseline & URL inventory | 🟨 partial | `urls-before.txt` done. Search Console export + `git tag pre-migration` outstanding |
| 1 | Scaffold Next.js 16 + Tailwind + shadcn | ✅ **DONE** | Next 16.2.11, Tailwind v4, shadcn (manual), unplugin-icons, Supabase clients |
| 2 | Supabase schema + RLS + auth | ✅ **DONE** | Schema live on `ipurerfngdvoxbypfdzt`. Admin user created (learncomputerseo@gmail.com — password in user's password manager, never stored here). `auth.is_admin()` moved to `public.is_admin()` — SQL editor role has no CREATE on the `auth` schema itself |
| 3 | **Extraction: 132 HTML docs → Supabase** ⭐ | ✅ **DONE** | 131 rows written and verified. Re-run once more in session 5 after a table-extraction bug fix — see below |
| 4 | Assets → Cloudinary + R2 | 🟨 **PDFs done** | All 18 PDFs migrated (session 5). Images still open. See [ASSETS.md](ASSETS.md) |
| 5 | Public site build | ⬜ | |
| 6 | ISR + revalidation webhook · Try It editor | ⬜ | HTML/CSS/JS + React |
| 7 | Admin panel + usage panel + daily keep-alive/backup | ⬜ | spec in [ADMIN.md](ADMIN.md). Also where `sort_order` gets fixed |
| 8 | Search (Postgres FTS) + contact form | ⬜ | both are new functionality, not migration |
| 9 | **SEO foundation** | ⬜ | ~~highest-risk~~ → low risk / high upside. D-12 confirmed |
| 10 | Cutover to Vercel | ⬜ | **+ set up Search Console & Bing, submit sitemap** |
| 11 | Post-launch watch | ⬜ | watching for **first indexing** |

### Measured facts worth not re-deriving

Full detail and method in **[RESEARCH.md](RESEARCH.md)**.

- **Extraction is done, not just safe.** 131 rows live in Supabase. 64 clean · 52 mechanical · **15 demo** · 0 fail — dry-run and DB-write matched exactly. Verified 2026-07-25.
- **URL completeness confirmed**: all 140 baseline URLs accounted for — 131 doc rows + 1 duplicate merged into a redirect + 8 standalone pages (home, about, contact, syllabus, resourses, box-model, box-shadow-generator, 404) that were never part of `_docs/` and get hand-built pages in Stage 5.
- **Residue check: clean.** Grepped every block for `{%`, `{{`, `col-md-`, `class="loader"`. One hit — turned out to be React JSX `style={{...}}` in a legitimate code sample (`react/introduction`), not leftover Liquid/Bootstrap. No real residue found.
- Content: **1.1 MB raw**, 132 files, avg 8.3 KB, 4,687 top-level blocks. In Postgres ≈ **5 MB of 500 MB — about 1%.**
- Assets: 216 MB in `assets/img` → **188 MB referenced, 28 MB orphaned.** ~90 MB of the referenced is **PDFs**.
- Links: 131 distinct internal, **89 already broken on the live site today**.
- Live URLs: **140** (`urls-before.txt`).
- URL map: **131 entries** in `scripts/url-map.json` (132 − 1 redirect for duplicate poster page).
- Categories: **7** — `basics` 1 · `css` 35 · `design` 17 · `html` 36 · `javascript` 28 · `photoshop` 12 · `react` 2.
- Stack: **Next.js 16.2.x LTS** · Tailwind v4 · shadcn/ui (Radix) · Supabase free = 500 MB / 5 GB egress / **2 projects max**.
- ⚠️ **Supabase pause clock resets only when schema is applied.** Do it today.

---

## 2026-07-25 — Session 5: Cloudflare R2 + full PDF migration

**Done**

- Resolved D-14: Cloudflare R2 for any file ≥10 MB (Cloudinary's free-tier cap, confirmed to
  apply to images and raw files both). Full reasoning in `docs/DECISIONS.md` D-14.
- Set up R2 via wrangler (already logged in, account `learncomputerseo@gmail.com`): created
  bucket `lca-docs-files`, enabled its public `pub-xxxx.r2.dev` URL. R2 activation itself
  (one-time, dashboard-gated, ties to ToS acceptance) and the S3-compatible API token
  (wrangler's OAuth session can't generate these) had to come from the user.
- Wrote `lib/storage.ts` — router (`pickBackend`, ≥10MB → r2) plus upload helpers for both
  backends. `npx tsc --noEmit` clean.
- Wrote `scripts/migrate-pdfs.mjs` — walks every PDF in the Jekyll source (18 found, 0
  orphaned), uploads via the correct backend, rewrites every matching `<a href>` in Supabase.
- **Found and fixed a real Stage 3 bug while doing this**: the table-block extractor in
  `extract-docs.mjs` only kept `$(td).text()` per cell, silently discarding any `<a>`/`<img>`
  inside — 9 `design/` lessons use tables as resource/download lists (thumbnail + link per
  row), so this was quietly deleting download buttons and thumbnails from the DB, not just
  losing the specific PDF links this session set out to fix. Changed cells to keep HTML
  (`$(td).html()`), consistent with how `richtext`/`callout` already work. Re-ran
  `extract-docs.mjs --write` — all 131 docs re-written with the fix, classification counts
  unchanged (64/52/15/0, as expected — same content, richer capture).
- Ran `migrate-pdfs.mjs` for real: 18/18 PDFs uploaded (16 → Cloudinary raw, 2 → R2 —
  `designer-guide-2.pdf` 21.4 MB, `designer-guide-4.pdf` 26.5 MB, both uploaded uncompressed
  per the standing rule that compression is a content call, not automatic). 6 lessons
  touched, all 26 `<a href>` occurrences rewritten and confirmed zero remaining
  old-path references.
- Verified two representative uploads live via `curl -I`: R2 file returns 200 with
  `Content-Length: 27783581` (matches 26.5 MB), Cloudinary raw file returns 200 with the
  right size too. Not just "the API call didn't error" — actually fetched.

**Findings worth remembering**

1. **Cloudinary's 10 MB free-tier cap applies to images too, not just raw/PDF files.** Was
   initially assumed images had more headroom; checked and they don't. This is why the
   size-based router has to cover both, not just PDFs.
2. **A regex `.test()` immediately followed by `.replace()` on the same content, called once
   per distinct old-path across an 18-entry loop, undercounts when multiple links live in one
   block.** Not a data-correctness bug (verified separately: 0 unrewritten links remained)
   — just a misleading log line ("11 links rewritten" when the real count was 26, since the
   counter incremented per *block/cell touched*, not per link). Caught by cross-checking
   the reported number against an independent grep-based count before trusting it.
3. **R2 needs one dashboard step no CLI can do**: account-level R2 activation is gated
   behind Cloudflare's own ToS acceptance flow. `wrangler r2 bucket create` fails with a
   clear "please enable R2 through the Cloudflare Dashboard" error until that happens —
   good, unambiguous failure mode, not a silent one.
4. **R2's S3-compatible API credentials are a different credential type than wrangler's
   OAuth login.** Even fully authenticated, wrangler cannot generate an Access Key
   ID/Secret pair — those come from R2 → Manage R2 API Tokens in the dashboard,
   specifically because they're consumed by S3-compatible clients (`@aws-sdk/client-s3`),
   not Cloudflare's own API.
5. **Kept R2 fully decoupled from the live domain's DNS.** Used the default `r2.dev` public
   URL instead of a custom domain — a custom domain would require proxying
   `learncomputer.in` through Cloudflare, which the user explicitly didn't want given the
   site has nothing to do with Cloudflare otherwise.

**Failed / abandoned**

- Nothing failed outright. The table-extraction bug was caught *during* this session's work
  (not a regression introduced by it) — worth being honest that Stage 3's "done" from
  session 4 was incomplete in a way that wasn't visible until PDF links needed rewriting and
  turned out not to exist in the DB at all.

**Next session — start here**

1. Stage 4, image half: prune 28.1 MB of orphans → convert ~98 MB to WebP q80/1600px →
   upload via `lib/storage.ts` → emit `image-map.json`.
2. Rewrite pass, two surfaces (same shape as the PDF fix): `image` blocks' `_src` field, and
   raw `<img src>` sitting inside richtext/table-cell HTML.
3. Do not start Stage 5 (public site) until this lands — same reasoning as before, now
   doubly confirmed by how much the table-cell HTML fix mattered.

---

## 2026-07-25 — Session 4: schema applied, Stage 3 written for real

**Done**

- **Fixed `supabase/schema.sql`**: `create function auth.is_admin()` failed with `permission denied for schema auth` — Supabase's SQL editor role has no `CREATE` privilege on the `auth` schema itself (GoTrue-managed, locked down even from the SQL editor's role). Moved the helper to `public.is_admin()`, updated all 6 RLS policies to match. Plain `UPDATE`/`SELECT` on `auth.users` is unaffected — only `CREATE` inside that schema is blocked.
- User ran the corrected schema. Verified via a throwaway script (deleted after use): 7 categories seeded, 0 docs rows, RLS confirmed working (anon key reads 0 leads without erroring — proof the policy exists and is enforced, not just that the table is empty), `db_size()` returns 10.5 MB.
- User created the admin user (`learncomputerseo@gmail.com`) in the Supabase Auth dashboard and ran the `app_metadata` update. **Password was shared in chat — explicitly declined to store it anywhere (file or memory).** The app never needs it; only the `role: admin` JWT claim matters, and that's already set.
- Extended `scripts/extract-docs.mjs` with a `--write` flag: looks up category IDs, builds full doc rows (blocks, toc, sort_order per-category counter, meta_title from raw frontmatter), upserts in batches of 25 keyed on `path` (idempotent — safe to re-run).
- Ran it. **131 docs written to Supabase**, split exactly as expected across all 7 categories.
- Verified against `urls-before.txt`: all 140 baseline URLs resolve to something (131 rows + 1 redirect + 8 standalone pages not in scope for this table). Non-negotiable §3.2 upheld for the extraction's part.
- Ran the residue grep from `MIGRATION-PLAN.md` Stage 3 verification (`{%`, `{{`, `col-md-`, `class="loader"`) against every block in the DB. One hit, traced to `react/introduction`'s code sample — it's `style={{ padding: ... }}`, real JSX, not Liquid. No actual leftovers.

**Findings worth remembering**

1. **`auth` schema CREATE is locked in Supabase's SQL editor, but table writes aren't.** If a future migration needs another `auth.*` function, expect the same error — put it in `public` and reference `auth.jwt()`/`auth.uid()` from there instead. Direct `UPDATE`/`SELECT` against `auth.users` works fine.
2. **Never store a user's login password**, even when they offer it and even in a git-ignored file. It's not needed by any code path here — only the JWT `app_metadata.role` claim is. Recommended a password manager instead.
3. **`sort_order` is currently just file-scan order** — not the deliberate lesson sequence from the old sidebar (which lived in Liquid includes, not frontmatter, so it wasn't extractable). This needs a manual pass in the admin panel later. Flagged in the stage board rather than silently shipped wrong.

**Failed / abandoned**

- Nothing failed outright this session — the `auth.is_admin()` permission error was caught and fixed before any bad state landed in the DB.

**Next session — start here**

1. Stage 4 — assets. Prune orphans (28.1 MB, list already known) → convert referenced images to WebP → upload to Cloudinary → PDFs as `raw`, uncompressed → emit `scripts/image-map.json`.
2. Write and run the follow-up pass that resolves every `image` block's `_src` against `image-map.json`, writes `publicId`, and drops `_src`.
3. Do **not** start Stage 5 (public site) until every image block has a real `publicId` — otherwise the first site build ships broken images.

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
