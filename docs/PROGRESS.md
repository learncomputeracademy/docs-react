# Progress journal

**Read this first when starting a new session.** It is the running record of what is done,
what is next, and what was learned the hard way.

**How to use it:** append a dated entry per working session. Newest at the top. State what
actually happened, including what failed — a journal that only records successes is useless
for picking up work weeks later.

---

## Current state — 2026-07-25

**Phase:** Stage 1–4 ✅ · **Stage 5 🟨 first two pages built (home + one lesson page), design polish applied, awaiting user sign-off before scaling to all 131.**
**Architecture:** Next.js 16 LTS + **Supabase (free tier)** + Vercel, ISR with on-demand

### ⚡ Next action

Get explicit sign-off on the homepage + `css/align` lesson page design (per `docs/UI.md`'s
approval-flow rule), then scale the same components to all 131 docs — mechanically true
already, since the lesson page is one dynamic route (`app/[category]/[slug]/page.tsx`) with
`generateStaticParams()`, not 131 hand-built files. What's actually still open:
- Category index pages (`/[category]`) — don't exist yet. Homepage category cards currently
  link straight to each category's first lesson as a stand-in.
- Command palette (⌘K / `cmdk`) and Try It Yourself — explicitly deferred per `docs/UI.md`'s
  "four screens" priority order; screens 1–2 (lesson page, code block) came first.
- `docs.sort_order` is still file-scan order, not the old site's intended sequence — Stage 7
  fix, unchanged from before.

### Stage board

| # | Stage | Status | Notes |
|---|---|---|---|
| 0 | Baseline & URL inventory | 🟨 partial | `urls-before.txt` done. Search Console export + `git tag pre-migration` outstanding |
| 1 | Scaffold Next.js 16 + Tailwind + shadcn | ✅ **DONE** | Next 16.2.11, Tailwind v4, shadcn (manual), unplugin-icons, Supabase clients |
| 2 | Supabase schema + RLS + auth | ✅ **DONE** | Schema live on `ipurerfngdvoxbypfdzt`. Admin user created (learncomputerseo@gmail.com — password in user's password manager, never stored here). `auth.is_admin()` moved to `public.is_admin()` — SQL editor role has no CREATE on the `auth` schema itself |
| 3 | **Extraction: 132 HTML docs → Supabase** ⭐ | ✅ **DONE** | 131 rows written and verified. Re-run once more in session 5 after a table-extraction bug fix — see below |
| 4 | Assets → Cloudinary + R2 | ✅ **DONE** | 18 PDFs + 191 images/GIFs migrated (sessions 5–6). See [ASSETS.md](ASSETS.md) |
| 5 | Public site build | 🟨 **in progress** | Home + 1 lesson page built and polished (session 7). Awaiting sign-off before scaling |
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
- **Assets fully migrated — not just measured.** 18/18 PDFs + 191/191 images/GIFs live on
  Cloudinary/R2. 0 residual old-path references anywhere in the DB, confirmed by direct
  query. GIF→MP4 conversion (D-15) took the 7 large color-theory animations from 51.5 MB to
  6.7 MB, an 87% reduction. Orphaned assets (198 files, 27.5 MB) were never uploaded — and
  never touched in the read-only source either, since "prune" here just means "don't
  migrate it," not delete anything.
- Links: 131 distinct internal, **89 already broken on the live site today**.
- Live URLs: **140** (`urls-before.txt`).
- URL map: **131 entries** in `scripts/url-map.json` (132 − 1 redirect for duplicate poster page).
- Categories: **7** — `basics` 1 · `css` 35 · `design` 17 · `html` 36 · `javascript` 28 · `photoshop` 12 · `react` 2.
- Stack: **Next.js 16.2.x LTS** · Tailwind v4 · shadcn/ui (Radix) · Supabase free = 500 MB / 5 GB egress / **2 projects max**.

---

## 2026-07-25 — Session 7: Stage 5 build — home + one lesson page, design polish

**Done**

- Built the actual site shell: `app/layout.tsx` (theme-flash-prevention inline script,
  header, footer), `components/site-header.tsx`, `components/site-footer.tsx`,
  `components/doc-sidebar.tsx` (persistent, data-driven, replaces the old site's 4
  near-duplicate sidebar includes per the repo-layout plan), `components/blocks/
  block-renderer.tsx` (async server component, switches on block type: richtext, heading,
  code via Shiki, image via `next/image` + custom Cloudinary loader, `loop` via
  `<video autoplay muted loop playsinline>`, table).
- `app/[category]/[slug]/page.tsx` — the one dynamic route that will eventually serve all
  131 lessons. `generateStaticParams()` pre-renders every known path at build time (⚠️
  content-in-server-HTML non-negotiable, never SSR). `app/page.tsx` — homepage with a
  category grid.
- `lib/shiki.ts` (singleton highlighter, avoids re-instantiating the WASM highlighter per
  code block), `lib/cloudinary.ts` (URL builder + `next/image` custom loader).
- Added `getSidebarTree()` to `lib/content.ts` — the sidebar needs every category with its
  docs in one query, not fetched per-category.
- **Design polish**, prompted mid-session by the user supplying the real LCA logo/favicon
  and asking for a more professional feel: processed the logo (8588×1498 source down to a
  64px header icon + app icon/apple-icon via Next's `app/icon.png` convention — no
  hand-built `.ico`), extracted the brand orange and computed its exact OKLCH value,
  verified WCAG AA contrast mathematically (not eyeballed) before committing to it as the
  theme's `--primary` in both light and dark mode, added real brand icons (`logos:css-3`,
  `logos:html-5`, etc. via `unplugin-icons`) replacing generic ones on the homepage, added
  a shadcn-pattern `Button` component (hand-written, not `npx shadcn add` — that needs a
  TTY, doesn't work in this environment) since buttons are a genuine cross-site need, not
  speculative.
- Removed the unused create-next-app scaffold SVGs and the old default favicon — nothing
  referenced them.

**Findings worth remembering**

1. **`next/image`'s `loader` prop cannot be a plain function passed from a Server
   Component** — "Functions cannot be passed directly to Client Components" at runtime,
   not a type error, so it wasn't caught by `tsc`. Fixed by wiring the loader through
   `next.config.ts`'s `images.loaderFile` instead (Next imports it directly, no prop
   serialization needed) — also the documented pattern, not a workaround.
2. **A global custom image loader conflicts with local `public/` assets.** Once
   `loaderFile` is set, *every* `next/image` call routes through it — including the header
   logo, which isn't a Cloudinary asset. Solution: plain `<img>` for local static assets,
   custom loader only applies where it's actually pointed (Cloudinary `publicId`s). Two
   different asset sources need two different tags, not one loader trying to handle both.
3. **`generateStaticParams` runs at build time with no HTTP request** — the cookie-aware
   Supabase SSR client throws if used there. Fixed by giving `getAllDocPaths()` (the one
   function that runs in that context) a plain `@supabase/supabase-js` client instead of
   the cookie-aware one. The read is public anyway (RLS already allows anon reads of
   published docs), so this isn't a workaround, it's the correct client for a context that
   was never going to have cookies.
4. **Real bug, not a React bug**: `center-align.gif` broke as an autoplaying video —
   `duration: null`, wouldn't play even in Chrome's own native video viewer (checked
   before assuming the bug was in my code). Root cause: it's a **single-frame GIF**
   (`sharp` metadata: `pages: 1`), not an animation — ffmpeg can't produce a meaningful
   video from one frame. `migrate-images.mjs` was routing every `.gif` extension through
   the video pipeline unconditionally. Fixed with a `pages > 1` gate; re-verified the
   other 9 GIFs are genuine multi-frame animations (7 and 8 frames for the two smallest)
   before trusting them.
5. **Shiki's dual-theme output needs one CSS rule to actually switch themes.** It emits
   both light and dark colors as CSS custom properties on every span and defaults to the
   light one — without `.dark .shiki { color: var(--shiki-dark) !important; ... }`, code
   blocks silently stay light-themed even when the rest of the page is dark. Caught by
   actually toggling dark mode in a live browser check, not by reading the Shiki output.
6. **Brand orange fails WCAG AA on white at the logo's own lightness** (2.35:1 against a
   4.5:1 requirement) — computed exactly via OKLCH→linear-sRGB→relative-luminance, not
   eyeballed. Same hue/chroma, darkened to L=0.57 for light-mode text use (4.72:1), kept at
   the logo's native L=0.75 for dark mode (8.45:1, no compromise needed there). Also means
   solid buttons using this color as a fill need **dark** text in both themes, not the
   usual light-on-accent pattern — this orange doesn't clear AA against white text at
   either lightness value tested.
7. **`unplugin-icons`' JSX/React compiler mode needs `@svgr/core` as a real dependency**,
   not just the plugin itself — didn't surface until a `~icons/*` import was actually used
   for the first time this session (config was wired up in session 3, unused until now).

**Failed / abandoned**

- Dev server needed two full clean restarts (`rm -rf .next`, kill stray node processes)
  during this session — accumulated config changes (`next.config.ts` edited while the
  server was running) left Next's dev cache in a state throwing "Unexpected end of JSON
  input" on its own manifest files. Not an app bug; a clean restart resolved it both times.
  Worth remembering: after any `next.config.ts` edit, restart clean rather than trust hot
  reload.

**Next session — start here**

1. Get the user's actual sign-off on what's built (not just "I think it looks fine" —
   `docs/UI.md` calls for explicit confirmation before scaling to 131 pages).
2. Build `/[category]` index pages — the one structural gap; homepage cards currently
   route around it by linking straight to each category's first lesson.
3. Screens 3–4 from `docs/UI.md` (Try It Yourself, command palette) — deferred on purpose,
   not forgotten.

---

## 2026-07-25 — Session 6: full image + GIF migration, Stage 4 complete

**Done**

- Ran `scripts/audit-images.mjs` (fresh, loop-normalized path resolution — the earlier
  157 MB-orphan bug from session 2 doesn't get to happen twice). Result: 191 referenced
  (98.6 MB: 139 jpg, 42 png, 10 gif), 198 orphaned (27.5 MB), 11 "broken refs" that turned
  out to be false positives — W3Schools-style placeholder filenames (`img_girl.jpg`,
  `smiley.gif`) used inside code examples teaching HTML syntax, plus one pre-existing
  external hotlink to an unrelated Cloudinary account. Numbers cross-checked against the
  session-2 baseline (98 MB / 28 MB) before trusting them.
- **Asked the user how to handle the 7 large color-theory GIFs** (51 MB combined,
  `black-color.gif` alone 16.2 MB) before writing any conversion code — "convert to MP4"
  wasn't just a format change, it meant swapping `<img>` for `<video autoplay muted loop
  playsinline>`, a real content-model decision. User chose full conversion. Recorded as D-15.
- Added a `loop` block type (`lib/types.ts`, `docs/CONTENT-MODEL.md`) — same shape as
  `image`, renders as an autoplay video. Kept distinct from the existing `video` type
  (real player, title, controls) on purpose.
- Wrote `scripts/migrate-images.mjs`: rasters → WebP q80/max 1600px via `sharp` →
  Cloudinary; GIFs → MP4 via `ffmpeg` → Cloudinary video. Verified both conversion paths in
  isolation before running the full batch (a 2.98 MB test GIF came out at 0.24 MB, 92%
  reduction — matched what shipped for real). Ran the full 191-file batch in the
  background; 0 failures.
- **Found a second real gap while verifying, same shape as the PDF-links-in-tables bug from
  session 5**: the rewrite pass only scanned `<img src>`, but 7 `design/` lessons pair a
  thumbnail `<img>` with a separate `<a href download>` "download full size" link — same
  two-link-per-resource pattern already seen with PDFs, just missed for images because it
  didn't occur to check for it a second time. Caught by grepping the DB for old-path
  residue after the first pass instead of trusting the run's own summary line. One more
  edge case found the same way: a single `<iframe src="....jpg">` (`photoshop/shortcut-keys`,
  using an iframe purely for scroll behavior on a very tall image). Extended
  `rewriteImgTags` to cover `a[href]` and `iframe[src]`, added a `--relink-only` flag so
  the fix could be applied without re-uploading all 191 already-live files, re-ran. Zero
  residual old-path references confirmed by direct query.
- Live-verified a sample of both output types via `curl -I`: WebP image 200, MP4 video 200
  with a byte size matching the conversion log.

**Findings worth remembering**

1. **A pattern found once should be checked for everywhere, not just where it was found.**
   The `<img>` + `<a href download>` pairing was already known from the PDF pass (session
   5) but the image migration script still only checked `<img>` — the same shape of bug
   recurred because the lesson from the first instance wasn't generalized into the second
   script. Both scripts now share the "check img, a[href], AND iframe[src]" checklist,
   written down here so a future asset-type migration doesn't relearn it a third time.
2. **`aria-label="Complementary"` appearing on the triadic and tetradic diagrams is a
   pre-existing content bug**, not something this session introduced — confirmed by
   checking the raw Jekyll source, where all four color-scheme images in that section
   already shared the same (wrong) `alt="Complementary"`. Left as-is; not this migration's
   job to silently correct authored content, only to carry it forward faithfully. Worth a
   line in a future content-QA pass.
3. **Cheerio's `$.root().html()` re-wraps fragment content in `<html><head></head><body>`**
   even when the input was a bare fragment. `$('body').html()` is the correct call to get
   back just the modified fragment. Caught by a 30-second isolated test before it could
   corrupt 131 docs' worth of richtext HTML.
4. Reused the "verify by direct query, not by trusting the script's own summary counter"
   habit from the PDF session — the "11 links rewritten" undercount taught that lesson;
   this session applied it proactively instead of after the fact.

**Failed / abandoned**

- Nothing failed outright. Both gaps found this session (download links, iframe) were
  caught by verification before being reported as done, not discovered later as bugs.

**Next session — start here**

Stage 5, public site build. Layout + `DocSidebar` + home page first, then **one lesson page
for design sign-off** before building all 131 — `docs/UI.md` is explicit that this approval
gate comes before scale, not after.

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
