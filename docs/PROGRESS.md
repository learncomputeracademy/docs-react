# Progress journal

**Read this first when starting a new session.** It is the running record of what is done,
what is next, and what was learned the hard way.

**How to use it:** append a dated entry per working session. Newest at the top. State what
actually happened, including what failed — a journal that only records successes is useless
for picking up work weeks later.

---

## Current state — 2026-07-26

**Phase:** Stage 1–4 ✅ · **Stage 5 🟨 in progress** · **Bengali translation of all 8
pre-existing categories is now COMPLETE — every lesson on the site has a `/bn/` version.**
**Architecture:** Next.js 16 LTS + **Supabase (free tier)** + Vercel, ISR with on-demand

### ⚡ Next action

**Bengali translation effort is done.** Status per category (`doc_translations` rows,
locale `bn`), all verified against the DB:
- `programming` (19/19) — ✅ done.
- `basics` (1/1) — ✅ done.
- `html` (36/36) — ✅ done, all verified rendering at `/bn/html/*`.
- `css` (35/35) — ✅ done.
- `javascript` (28/28) — ✅ done.
- `react` (2/2) — ✅ done: introduction, syllabus.
- `design` (17/17) — ✅ done.
- `photoshop` (12/12) — ✅ done (`scripts/translate-photoshop-all.mjs`), verified
  12/12 rows present. Typos in the source prose (OCR-style: "Magniies", "speciied",
  "Deines") were silently corrected in translation rather than replicated — unlike
  code-block content, which stays byte-identical. One source bug preserved verbatim:
  `photoshop/drawing-selection-tools` has an image `alt="Type Tool"` paired with caption
  "Pen Tool" in the English original; the Bengali translation mirrors the same mismatch
  rather than silently fixing it.

**Every one of the 131 pre-existing lessons across all 8 categories now has a Bengali
translation.** No more `/bn/*` pages fall back to the English "not yet translated" banner.

**Category index pages are done too (session 10)** — `/[category]` and `/bn/[category]`
now exist; homepage cards link to them instead of routing around the gap. Their lesson list
renders as a card grid (`sm:grid-cols-2 lg:grid-cols-3`), not the initial single-column
numbered list — user asked for cards to match the homepage subject-picker style, same
session. **Mobile sidebar drawer is also done** (same session) — Stage 5 (public site
build) is feature-complete.

**Stage 6 is now fully code-complete (sessions 11–12).**

ISR half (session 11): `unstable_cache` + tagged `getDoc`/`getSidebarTree`,
`/api/revalidate` webhook route, and a **real SSR bug fixed**: `app/layout.tsx`'s
`headers()` call was forcing the entire site dynamic in production (every route showed
`ƒ`, not `●`/`○`) — fixed, verified via `next build`. Verified against a real production
build that content genuinely revalidates on-demand without a redeploy. **Not yet live**:
the actual Supabase Database Webhook needs the user to create it in their dashboard
(instructions in `docs/DECISIONS.md` D-18 / O-6) — can't be done from this session, no
dashboard credentials. **Known gap**: `generateMetadata`'s `<title>` doesn't pick up the
same invalidation the page body does — see D-18/O-5.

Try It Yourself half (session 12): editable HTML/CSS/JS and React (Sucrase JSX transform +
esm.sh-loaded React, since React 19 dropped UMD builds), sandboxed `<iframe sandbox=
"allow-scripts">`, postMessage error relay — all verified working live, including actual
click interactivity in both modes. **CodeMirror 6, named in `docs/UI.md`, doesn't work in
this stack** — `@uiw/react-codemirror`'s `EditorView` never initializes (React 19
incompatibility, isolated over ~2 hours of bisection), swapped for a plain `<textarea>`,
package uninstalled. Also found and fixed, same investigation: `next/dynamic(fn,
{ssr:false})` never resolves on a `generateStaticParams` route in this Next.js version —
affects any future lazy client widget on a doc page, not just this one. Full writeup:
`docs/DECISIONS.md` D-19.

### Also this session: three site bugs found and fixed (not translation work)
- Shiki code-block theme swapped to Ayu Light / Dracula per user request (`lib/shiki.ts`) —
  dual-theme via CSS vars, dark-mode switch rule already existed in `app/globals.css`.
- Language switcher was broken on the bare `/bn` homepage — `localizedPath()` in
  `lib/i18n.ts` only stripped the `/bn` prefix when followed by a trailing slash, so
  clicking "English" from `/bn` looped back to `/bn`. Fixed the regex, verified both
  directions including the `/` → `/bn` (no double slash) case.
- ⌘K search: confirmed already working (Postgres full-text search). Added a "Pick a
  subject" section (categories with logo icons + lesson counts, shown when the query is
  empty) to `components/command-menu.tsx`, backed by a new `categoriesAction` in
  `lib/actions.ts` — same "link to first lesson" pattern as the homepage subject cards.

Scripts are one-off per batch: `scripts/translate-<category>-<batch>.mjs`, safe to
delete after running (idempotent upsert on `doc_id,locale`). Pattern: pull English
`blocks`/`toc` for a batch of docs, hand-translate prose to West Bengal/Indian Bengali
(see the `bengali-translation-dialect` memory — জল not পানি), keep all code blocks and
HTML tag/attribute syntax byte-identical, translate visible labels inside **richtext**
live-demo blocks (not inside `type: code` blocks), keep anchors/heading IDs identical to
the English version. Verified spot-checks in browser after each major batch.

### Also still open (pre-existing, unchanged)
- Admin panel — **does not exist yet.** No link, no login. Stage 7, unstarted — deliberately,
  user confirmed sticking to the roadmap (Stage 6 before Stage 7) rather than jumping ahead.
- `docs.sort_order` is still file-scan order, not the old site's intended sequence — Stage 7
  fix, unchanged from before.

## 2026-07-27 — Session 13: first Vercel deploy, motion-based UI component pass

**Done**

- **First real deploy.** User imported the GitHub repo into Vercel; live preview domain
  is `lca-docs.vercel.app` (project was renamed after creation from `docs-react`). Walked
  through the import screen (Application Preset → Next.js, Root Directory `./`, all 8
  `.env.local` vars mirrored in). `next build` output (323 static/SSG routes, 0 dynamic
  except `/api/revalidate`) carried over cleanly.
- **UI component pass from SmoothUI/MagicUI**, user's explicit request ("add whatever is
  possible"). Flagged the conflict with the documented perf budget and the "no animation
  on lesson content" rule first; user chose to go broad and relax the budget rather than a
  curated subset — see D-20 for the full decision.
- Added `motion` as a real dependency + `components/magic/` (`BorderBeam`, `Marquee`,
  `ShimmerButton`, `MagicCard`, `NumberTicker`, `HeroReveal`), a sliding tab indicator on
  Try It Yourself, and a copy-button check bounce. Wired into the homepage (hero, stats,
  subject cards, coming-soon section, about band) and category index pages (lesson cards).
  Kept confetti/particles/globe/GSAP-shader pieces out — pure decoration, no fit here, and
  GSAP would've been a second animation dependency for nothing. Full list + rationale in
  `docs/UI.md`.
- **Verified**: `tsc --noEmit` clean, `next build` still shows every doc/category page as
  `●`/`○` (no accidental SSR regression), and a live browser pass in both themes on the
  homepage and a JS lesson page — hero fade-in, number ticker count-up, shimmer CTA,
  border-beam, cursor-tracked card spotlight, and the marquee all confirmed working.

**Not done**

- Copy-button check-bounce specifically wasn't caught on screenshot (probably automation
  round-trip timing outrunning the 1.5s window, not a real bug — see D-20).

**Follow-ups, same session, after user review**

- **Real bug**: NumberTicker (hero stats row) got stuck at 0 for "lessons" on the user's
  phone while "Subjects"/"Languages" showed correct settled values — mathematically
  impossible from normal animation lag (all three share one spring, so if two had reached
  their exact targets the third couldn't still be at exactly 0). Root cause: the
  `useInView()` scroll-gate, copied from MagicUI's below-the-fold pattern, doesn't fit
  this always-above-the-fold usage and likely raced against the hero's own mount
  animation on that device. Removed the gate; animates unconditionally on mount. Fixed,
  committed, pushed (`38ea7f9`).
- Committed and pushed all of this session's work (3 commits: UI component pass, route
  progress bar, docs) plus the NumberTicker fix — `main` is fully in sync with what's
  deployed.
- **Supabase Database Webhook UI is broken on this project** — fails with `schema
  "supabase_functions" does not exist`, a platform provisioning gap, not a mistake in
  setup. Worked around with a hand-rolled `pg_net` trigger (Vault-stored secret,
  `SECURITY DEFINER` function, attached to `docs`/`doc_translations`/`categories`) that
  calls the same `/api/revalidate` endpoint. **User verified it live** — Stage 6 is now
  fully live, not just code-complete. Full writeup: D-21.

**Stage 7, Phase 0 — same session, after the above**

Read the pre-existing `docs/ADMIN-PLAN.md` (thorough, real content audit — hardcoded
homepage copy, `/about/` reusing `docs` via nullable `category_id`, 11-screen breakdown,
9-phase build order). Confirmed with the user to start at Phase 0 (its own recommendation):
spike Tiptap in isolation before building any editor UI around it, same precaution that
would have caught CodeMirror's failure (D-19) in an hour instead of two.

**Tiptap v3 works** — installed, verified via a throwaway route (typed input at the
correct cursor position, `Ctrl+B` correctly produced `<strong>` via `getHTML()`, zero
console errors, clean production build), then deleted the spike files once the result was
recorded. No textarea fallback needed for the `richtext` block editor. Full writeup: D-22.

**Stage 7, Phase 1 — same session**

Built the migration (`supabase/migrations/003-admin.sql`), the scoped `proxy.ts` auth
guard (`/admin/:path*` only, `getUser()` not `getSession()`), `/admin/login`, and a bare
`/admin` dashboard stub. Verified: public route tree still all `●`/`○` after `next build`;
unauthenticated `/admin` correctly 307s to `/admin/login` with no loop; a bad-credentials
submit hits real Supabase Auth and shows "Invalid login credentials" cleanly. **User
verified the successful-login path** — signed in with the real admin credentials, reached
the `/admin` dashboard stub, email shown correctly, sign-out present. Phase 1's guard +
login loop is fully confirmed, both halves. Full writeup: D-23.

**Stage 7, Phase 2 — same session**

Migration confirmed run by the user. Asked how to handle `sort_order` (wrong for all 150
rows) — user chose to ship the docs list screen only, fix the actual sequence later
through the UI rather than work out correct ordering right now.

Built `/admin/docs`: filter (category/status/title), checkboxes + bulk publish, editable
sort-order per row + "Save order," inline "New doc" form. `lib/admin/docs.ts` holds the
Server Actions, all revalidating the same way the eventual publish flow will. Found and
fixed a real bug in passing: `lib/supabase/server.ts` was typed against the still-empty
`Database` stub, making every admin write infer `never` — same class of issue already
worked around in `lib/supabase/public.ts`; untyped it, nothing else imports this client.

Verified: `next build` unchanged public route tree, `/admin/docs` correctly dynamic,
unauthenticated access redirects to login same as `/admin`. Full writeup: D-24.

**Reorder UX redone, same session, right after the user tried it**

Immediate feedback: the plain number input was confusing and hard to keep consistent
across up to 36 rows. Offered drag-and-drop, up/down arrows, or numbers-but-grouped —
user chose to combine drag-and-drop *and* arrow buttons rather than pick one.

Rebuilt the screen grouped by category (collapsible) with `@dnd-kit` sortable lists, drag
handle + ↑/↓ per row. Reordering disabled with a note whenever a status/title filter is
active, since a filtered subset hides same-category siblings and reordering it would
corrupt their true order. dnd-kit's peer range is as loose as CodeMirror's was, so this
got the same real-verification treatment as D-19/D-22 — via a throwaway `/dnd-spike`
route with fake data: proved the reorder *logic* first (an arrow click produced the
expected "invalid uuid" error, meaning the full chain to a real DB call works), then
found the drag itself silently not activating, root-caused to synthetic `PointerEvent`s
needing `isPrimary: true` (dnd-kit's `PointerSensor` requires it, unset by default) — once
added, the drag visibly activated (opacity/transform live-tracking the pointer) and the
dev server log showed a fully correct reordered payload. **dnd-kit works correctly in
this React 19 stack** — a real pass, not a CodeMirror-style silent failure. Full
writeup: D-25.

**Category-level reordering, same session, right after**

User asked for the 8 top-level category headers (Computer Basics, HTML, CSS, ...) to get
the same drag+arrows treatment, not just lessons within a category. Added
`saveCategoryOrder` (`lib/admin/categories.ts`) and made the category headers themselves a
second, independent `@dnd-kit` sortable list layered around the existing per-category doc
lists. Verified the same rigorous way — extended the throwaway spike route with
category-level mock data, confirmed both the arrow-click and the real drag gesture produce
correctly reordered payloads to the real Server Action, erroring only on fake ids. Full
writeup: D-26.

**Not verified either time**: the actual authenticated `/admin/docs` screen — Claude
doesn't have the admin password, same gap as Phase 1's login test.

**Stage 7, Phase 3 — same session: the doc/block editor**

"The project," per ADMIN-PLAN.md. Built `/admin/docs/[id]`: metadata pane (title, slug,
category-or-standalone, path, meta fields, sort order, status) plus editors for the four
block types the plan scoped to this phase — `richtext` (Tiptap, with a real toolbar this
time — bold/italic/strike/lists/blockquote/link — headings disabled inside it since those
are their own block type), `heading` (with a live anchor preview), `code`, `table`
(add/remove row & column). The other five real block types in live content (`image`,
`loop`, `callout`, `tryit`, `video`, `file`, `quiz`) render as a read-only placeholder that
still round-trips through save untouched — Phases 4-6 add their editors, this phase must
not corrupt what it can't yet edit.

Richtext is sanitized server-side on every save (new `sanitize-html` dependency) since
Tiptap's output lands in `dangerouslySetInnerHTML` on a public page. Heading anchors use a
straight port of `scripts/extract-docs.mjs`'s dedup algorithm (`lib/admin/anchors.ts`),
shared between the save action and the editor's live preview so they can never disagree.
Publish = save current edits then flip status (reuses `setDocStatus` from the docs list —
one code path that ever makes a doc live); plain Save alone revalidates automatically
whenever the doc is already published.

**Verified thoroughly** via a throwaway `/doc-editor-spike` route (one block of each
supported type, plus an `image` block and two headings with identical text): real Tiptap
editing worked, the duplicate heading correctly got `#what-is-html-2` live, the table's
row/column controls worked, the unsupported block rendered its placeholder without
breaking anything, block reordering worked, and Save called the real Server Action
end-to-end (dev log confirmed the full payload reaching a real DB call, erroring only on
the spike's fake id — same proof pattern as D-25/D-26). Errors now surface inline in the
UI instead of crashing the page. `next build` clean, public route tree unchanged, and
grepped `.next/static/` for leaked secrets per ADMIN-PLAN.md §7 — clean. Full writeup:
D-27.

**Not verified**: the actual authenticated screen against a real lesson — same gap as
every screen so far, Claude doesn't have the admin password.

**Stage 7, Phase 4 — same session: draft preview + unsaved-changes warning**

User confirmed Phase 3 looked good, asked to keep going. Built the preview route
(`/admin/docs/[id]/preview`) exactly per plan — dynamic, admin-only via the existing
`proxy.ts` guard (zero new code needed there), reusing the same `<BlockRenderer>` the
public site uses. A draft is already invisible on the public route today via the
original schema's RLS policy, not new code from this phase. The editor's new "Preview"
button saves first if dirty, then opens the preview in a new tab, so it never shows stale
content. Also added a native `beforeunload` warning for unsaved changes — the rest of
§4.9's "autosave writes drafts" concern was already moot since Phase 3 has no autosave at
all (every save is an explicit click).

Verified: unauthenticated preview access redirects to login same as every other admin
route; a throwaway spike confirmed the preview banner + `<BlockRenderer>` render
correctly, including real Shiki syntax highlighting and a working copy button inside the
dynamic admin context. `next build` clean, public route tree unchanged. Full writeup: D-28.

**Stage 7, Phase 5 — same session: media library, backfill, image/loop/file editors**

Discovered the `media` table (new in migration 003) was empty next to 209 real assets
already live — wrote `scripts/backfill-media.mjs` to index them. First pass (dedicated
`image`/`loop`/`file` blocks only) found just 15; the real majority turned out to be full
Cloudinary URLs embedded as raw `<img>` tags inside `richtext`/`callout` HTML, which the
extractor's top-level-only walker never pulled into their own block. Rewrote the script to
parse that HTML with cheerio and derive publicIds from the full URLs. Also checked
`doc_translations` — zero new assets found, confirming Bengali content reuses the same
media as English, as intended. Final: **98 unique assets**, backfilled for real.

Found and fixed a real, pre-existing bug while building on `lib/storage.ts`:
`uploadFile()` never actually passed `'video'` as the Cloudinary resource type — any video
upload through it would have silently gone up as a raw file. Fixed.

Built `/admin/media` (grid, upload, inline alt editing, delete-with-reference-check) and
picker-based editors for `image`/`loop`/`file` blocks, each with an inline "upload new"
fallback. `findMediaReferences` scans both `docs` and `doc_translations` in JS (not a
jsonb containment query as the plan suggested) since a publicId can appear as a substring
of a full embedded URL, which containment can't match — verified correct against a real
asset, returning both its English and Bengali referencing pages.

**Real gap found, not code**: R2 credentials aren't in `.env.local` at all, despite R2
having been used during the original migration. Uploads ≥10 MB will fail with a clear,
specific error rather than a cryptic one — not blocking day-to-day use, but worth fixing
(O-7).

**Automation note**: an attempt to safely test the delete button's confirm() dialog by
monkey-patching `window.confirm` backfired and froze the tab with a real native dialog —
recovered by opening a fresh tab, then re-verified the same logic through a confirm()-free
route instead. Full writeup: D-29.

**R2 credentials recovered, same session, right after**

The original migration's bucket (`lca-docs-files`) still existed — user found it via its
Public Development URL matching the exact host already known from `pdf-map.json`,
generated a fresh scoped API token, added all 5 vars to `.env.local`. Verified for real via
a direct S3-client script (PutObject/HeadObject/public-fetch/DeleteObject, bypassing the
10 MB routing threshold rather than needing a huge dummy file) — full pipeline confirmed
working. Caught and fixed a latent bug in the verification tooling itself along the way
(env-parsing regex didn't match variable names containing digits, so every `R2_*` var
silently failed to load) — the real app was never affected, only the throwaway test
script and `backfill-media.mjs` shared the same fragile pattern; both fixed. O-7 resolved
— D-30. **Still needs mirroring into Vercel's env vars** before production uploads ≥10 MB
will work; `.env.local` only covers local/dev.

**R2 credentials recovered and verified — same session, right after**

Bucket from the original migration (`lca-docs-files`) still existed. User generated a
fresh scoped API token, added all 5 vars to `.env.local`, then confirmed they're mirrored
into Vercel too. Verified for real via a direct S3-client script (bypassing the 10 MB
routing threshold) — full PutObject/HeadObject/public-fetch/DeleteObject pipeline
confirmed working. O-7 resolved. Full writeup: D-30.

**Stage 7, Phase 6 — same session: callout, video, tryit editors**

Before building an editor for `callout`/`video`, checked whether any real content already
used these types — found **18 real `callout` blocks live in the Programming category**
(session 9) that had been **silently rendering as nothing on the public site since session
9**, because `block-renderer.tsx`'s switch had no case for either type. Confirmed directly:
`programming/intro`'s "No setup required" tip was completely absent from the rendered
page. Fixed the public renderer first (own commit, before the editor work) — 4-variant
callout styling, YouTube/Cloudinary video embeds — then verified the fix in a real
production build. Full writeup: D-31.

Then built the actual Phase 6 editors: `CalloutBlockEditor` (reuses `RichTextBlockEditor`
for the body), `VideoBlockEditor` (plain fields, no media-library picker — a video ID
isn't something the library indexes), and `TryItBlockEditor` (mode + per-file tabs + a
live sandboxed-iframe preview via the same `lib/tryit.ts` functions the public site uses —
deliberately not the public `TryIt` component itself, which resets to its own original
content rather than handing edits back to a parent). Verified via a live spike: all three
render real content correctly, the Run button correctly rebuilds the iframe. Couldn't
verify an actual click *inside* the sandboxed iframe via automation — the sandbox's
`allow-scripts`-without-`allow-same-origin` deliberately makes its contents invisible to
both JS and the accessibility tree, not something this tooling can reach by design. The
underlying mechanism is identical to the public `TryIt` component, already proven with
real click interactivity in session 12. Full writeup: D-32.

**Stage 7's "every block type gets an editor" work is now complete** except `quiz` (zero
rows, deliberately deferred).

**Stage 7, Phase 7 — same session: the Bengali translation editor**

Built `/admin/docs/[id]/bn` — two columns aligned by block id, English read-only left,
Bengali editable right, which is the whole feature (makes a partial translation visually
obvious, the exact bug class session 9 caught by hand). Only richtext/heading/table/
callout are translatable; code and every media/structural block type stay locked to
English (code must be byte-identical per the project's own rule; the rest have no natural
translated content today). Heading anchors are never recomputed from Bengali text — always
copied from the matching English block by id, so deep links resolve to the same fragment
in both locales, enforcing in code a rule the manual translation scripts already followed
by hand. Block order/set on save always derives from English's current blocks, never
trusted from client state, so an out-of-sequence "Copy from English" can't land in the
wrong position and a since-deleted English block's orphaned translation gets dropped
automatically. Reused the exact same block editor components the English editor uses.
Extracted `lib/admin/sanitize.ts` out of `lib/admin/doc.ts` so both editors share one
sanitization rule.

Verified via a live spike (translated heading/richtext, correctly-locked code block, one
deliberately untranslated heading): rendered exactly as designed, "Copy from English"
correctly populated the empty slot, Save reached the real Server Action end-to-end. `next
build` clean, public route tree unchanged. Full writeup: D-33.

**Stage 7 now covers every planned screen except Categories/Settings (Phase 8) and
Resources/Dashboard (Phase 9).**

**Next session — start here**

1. Open a real lesson in `/admin/docs/[id]` once deployed and confirm editing/saving
   works — still the first time real content (not spike data) passes through any of this
   session's editors. Also try `/admin/media` (upload + place an image) and
   `/admin/docs/[id]/bn` (translate a block on a real lesson) for the same reason.
2. Verify the callout fix (D-31) on the deployed site — check `/programming/intro` (and
   its Bengali translation) actually shows the "No setup required" tip now.
3. Stage 7, Phase 8: categories screen, site settings (home/footer copy), `/about/` page.
4. `generateMetadata` staleness (O-5) still open.

---

### Stage board

| # | Stage | Status | Notes |
|---|---|---|---|
| 0 | Baseline & URL inventory | 🟨 partial | `urls-before.txt` done. Search Console export + `git tag pre-migration` outstanding |
| 1 | Scaffold Next.js 16 + Tailwind + shadcn | ✅ **DONE** | Next 16.2.11, Tailwind v4, shadcn (manual), unplugin-icons, Supabase clients |
| 2 | Supabase schema + RLS + auth | ✅ **DONE** | Schema live on `ipurerfngdvoxbypfdzt`. Admin user created (learncomputerseo@gmail.com — password in user's password manager, never stored here). `auth.is_admin()` moved to `public.is_admin()` — SQL editor role has no CREATE on the `auth` schema itself |
| 3 | **Extraction: 132 HTML docs → Supabase** ⭐ | ✅ **DONE** | 131 rows written and verified. Re-run once more in session 5 after a table-extraction bug fix — see below |
| 4 | Assets → Cloudinary + R2 | ✅ **DONE** | 18 PDFs + 191 images/GIFs migrated (sessions 5–6). See [ASSETS.md](ASSETS.md) |
| 5 | Public site build | ✅ **DONE** | Home + 1 lesson page built (session 7), revised on user feedback — accordion sidebar, real branding, wider layout (session 8). Category index pages (card-grid lesson lists) + persistent/independently-scrolling sidebar + mobile drawer + prev/next + homepage redesign (session 10) |
| 6 | ISR + revalidation webhook · Try It editor | ✅ **DONE, live** | Revalidation (session 11): webhook + tag-based caching + a real SSR bug fix. Database Webhooks UI was broken on this project (D-21) — replaced with a hand-rolled pg_net trigger, user verified live in production (session 13). Try It (session 12): HTML/CSS/JS + React, verified working — textarea not CodeMirror, see D-19 |
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
- Categories: **8** — `basics` 1 · `css` 35 · `design` 17 · `html` 36 · `javascript` 28 · `photoshop` 12 · `programming` 19 · `react` 2 (150 lessons total; the `7`/`131` figures elsewhere in this section predate the Programming category added in session 9).
- Stack: **Next.js 16.2.x LTS** · Tailwind v4 · shadcn/ui (Radix) · Supabase free = 500 MB / 5 GB egress / **2 projects max**.

---

## 2026-07-26 — Session 10: Photoshop translation finished; sidebar/UX rework; category index pages

Opened by finishing the last translation batch (Photoshop, 12/12 — see "Current state"
above), then moved to a run of user-reported UX issues and one explicitly-requested feature.

**Done**

- **Sidebar reload bug (real, user-reported)** — clicking between lessons showed the sidebar
  flashing/rebuilding on every navigation. Root cause: `DocSidebar` was rendered inside
  `LessonContent`, i.e. inside the same Suspense boundary `loading.tsx` wraps, so the whole
  page (sidebar included) fell back to a skeleton on every click. Fixed by moving the sidebar
  into a `layout.tsx` (outside that Suspense boundary) and decoupling active-item
  highlighting from a server-passed `activePath` prop to a client-side `usePathname()` read
  in `SidebarNav` — the sidebar no longer depends on route params at all, so it doesn't
  re-render on navigation.
- **Independent sidebar scroll (also reported)** — sidebar was scrolling together with the
  page instead of having its own scrollbar like VitePress. Fixed with `sticky` + a bounded
  height (`h-[calc(100vh-3.5rem)]`) + its own `overflow-y-auto` on the `nav` element.
- **Prev/Next lesson buttons**, VitePress-style — new `getAdjacentDocs()` in `lib/content.ts`
  flattens the (already locale-aware, correctly ordered) sidebar tree and looks up the
  doc before/after the current path; rendered at the bottom of every lesson in both locales.
- **Footer/homepage copy trim** (user request) — removed "Free to use, for everyone." /
  "সবার জন্য সম্পূর্ণ ফ্রি" from the footer, and the "Completely free" feature card from the
  homepage (grid dropped from 3 to 2 columns to match).
- **Accordion icon bug (real, screenshot-reported)** — opening a sidebar category rotated
  the category's own logo badge (e.g. the JS icon), not just the chevron. Cause: the rotate
  rule targeted `[data-state=open]>svg` — *any* direct SVG child of the trigger, which
  matched both icons. Fixed by scoping rotation to the chevron specifically via a
  `group`/`group-data-[state=open]` pair instead of a broad child selector.
- **"Intro to Programming" had no sidebar/homepage icon** — `CATEGORY_ICONS` map was missing
  a `programming` entry (added in session 9 but never given an icon). Added `Code2` (lucide).
- **Homepage redesign** (user request: "make it more beautiful, add more text, we'll add
  WordPress/Python etc. later") — researched tone/content from learncomputer.in (Habra
  training institute, JS/Python/WordPress/AI courses, hands-on training angle) for ideas,
  without copying its "for our students" framing (`CLAUDE.md` non-negotiable: public/free
  framing only). Added: a dynamic lessons/subjects/languages stat row (was previously a
  static, now-stale "7 subjects" hardcode — fixed to be computed), a third feature card
  ("Available in Bengali too" — real differentiator, not a re-add of the removed "free"
  card), a "More subjects on the way" section (WordPress/Python/Node.js/AI, via real
  `logos:*` Iconify icons — found and fixed a dark-mode contrast bug where WordPress/OpenAI's
  brand marks are dark-on-transparent and nearly invisible on a dark card; gave every
  coming-soon icon a theme-independent white circular backing), and a closing "from the team
  behind Learn Computer Academy" band with a link to learncomputer.in. Verified in both
  locales and both themes.
- **Category index pages** (`/[category]`, `/bn/[category]`) — the "one structural gap"
  flagged in every prior session's notes. Consolidated the sidebar layout up one level, from
  `[category]/[slug]/layout.tsx` to `[category]/layout.tsx`, so one persistent sidebar now
  covers both the index page and every lesson under it (previously it only covered lessons).
  New `components/category-content.tsx`, reusing `getSidebarTree()`. Homepage subject cards
  now link to the index page instead of jumping straight to the first lesson (the previous
  stand-in). Initially a numbered single-column list; **changed to a card grid**
  (`sm:grid-cols-2 lg:grid-cols-3`, same visual language as the homepage subject picker) per
  user follow-up request, same session — screenshots showed the list read as an oversized
  accordion, not a landing page.
- **Mobile sidebar drawer** — sidebar was `hidden md:block` with no mobile equivalent. Added
  `components/mobile-sidebar.tsx` (server, fetches `getSidebarTree()` — free, deduped by the
  `cache()` added earlier) + `components/mobile-sidebar-drawer.tsx` (client: `@radix-ui/
  react-dialog`, already a dependency via the command palette). Reuses `SidebarNav` as-is
  inside the drawer rather than building a second nav — one accordion implementation, two
  presentations. Closes itself on route change via a `usePathname()` effect, since
  `SidebarNav`'s links are plain `next/link`s with no knowledge of the drawer. Sits in its
  own full-width bar above the content (`CategoryLayout`'s wrapper split into an outer block
  container + inner flex row) rather than inside `DocSidebar`'s flex row, which can't host a
  full-width mobile bar without squeezing the content column.

**Bugs found while building the category index pages**

1. **`generateStaticParams` crashed using the cookie-aware Supabase client** — `getCategories()`
   calls `createClient()` from `lib/supabase/server.ts`, which reads cookies; that throws
   outside a request context (`Route /[category] used cookies() inside generateStaticParams`).
   Exact same class of bug `getAllDocPaths()` was already built to avoid for the lesson
   route. Fixed the same way: added `getAllCategorySlugs()` using the plain anon
   `@supabase/supabase-js` client instead.
2. **Sidebar accordion regression, self-introduced by the layout consolidation** — moving the
   sidebar to a shared, non-remounting layout meant its "which section is open" state
   (`Accordion defaultValue`, computed once at mount) could go stale: landing on `/css`
   (whose pathname doesn't match any *lesson* path) computed no active category, and since
   the component never remounts on subsequent navigation within that subtree, it stayed
   wrong. Fixed by making the Accordion controlled (`value`/`onValueChange`) and syncing the
   open section reactively via a `useEffect` keyed on the pathname-derived active category,
   while still preserving whatever other sections the user manually opened.
3. Also added `getSidebarTree()` → wrapped in React's `cache()`, since the category layout
   and the category/lesson page both call it once per request now — dedupes the DB round
   trip within a single render pass rather than adding a bespoke caching layer.

**Findings worth remembering**

1. **A Suspense boundary's `loading.tsx` only wraps `page.tsx`, not a sibling `layout.tsx`
   in the same folder.** This is *the* lever for "persistent sidebar, skeleton only on the
   part that changes" — anything that should survive navigation without flashing belongs in
   `layout.tsx`, not inside the component the page renders.
2. **A layout that doesn't read the params it's nested under is free to be shared further up
   the tree.** `DocSidebar` never needed `category`/`slug`, so moving its hosting layout from
   `[category]/[slug]/` to `[category]/` cost nothing — the fix was almost entirely a file
   move, not new logic.
3. **Moving a component out of a remount boundary can silently invalidate assumptions baked
   into "runs once at mount" state** (the accordion `defaultValue` bug above). Anything using
   `defaultValue`/`useState(() => ...)` to seed state from a prop should be re-checked when
   the surrounding remount lifecycle changes, even if the component's own code didn't change.
4. **Iconify's `logos:*` collection ships true brand-color marks, not `currentColor`
   monochrome icons** — WordPress and OpenAI's logos are dark by brand guideline and
   disappear on a dark background. A white backing chip (not a theme-conditional class) is
   the correct fix, since the icon itself doesn't change with the site's theme.
5. Browser automation (Chrome DevTools MCP) had another run of transient screenshot
   timeouts/staleness this session (same pattern noted in session 9) — cross-checked via
   `location.href` through `javascript_tool` each time to confirm the app was actually
   fine before concluding a screenshot failure wasn't a real bug.
6. **`resize_window` didn't actually shrink the rendering viewport in this environment** —
   called it twice (390×800, then 420×850), `window.innerWidth` stayed 1920 both times, and
   screenshots kept coming back desktop-sized. Verified the mobile drawer instead via two
   independent, non-visual checks: (a) reading the live DOM to confirm the trigger bar and
   desktop `<nav>` carry opposite `md:hidden`/`md:block` classes, and (b) forcing that same
   toggle with a one-off `element.style.display` override via `javascript_tool`, then
   screenshotting the now-visible drawer opening and closing on navigation. Real mobile
   check (resize a real browser or device) is still worth doing before calling this closed.

**Failed / abandoned**

- Nothing abandoned. Both self-introduced regressions (params crash, accordion state) were
  caught by verification (typecheck + live navigation) within the same session, not left for
  later discovery.

**Next session — start here**

1. **Stage 5 (public site build) is now feature-complete** — category index pages, mobile
   drawer, persistent/independent-scroll sidebar, prev/next, homepage redesign all landed
   this session. Worth a real-device or real-browser-resize mobile pass before calling it
   fully signed off (see finding #6 above — this session's mobile verification was
   DOM-state-based, not a true narrow-viewport screenshot).
2. Try It Yourself (Stage 6) as its own dedicated session — new dependency (Sucrase for
   in-browser JSX), a `tryit` block UI, sandboxed iframes. Bigger scope, deliberately not
   folded into this session.
3. Admin panel (Stage 7) — explicitly **not** starting yet; user confirmed sticking to the
   roadmap order (Stage 6 before Stage 7) when asked directly this session.

---

## 2026-07-26 — Session 11: Stage 6 ISR + revalidation webhook (code-complete)

User asked "what's next", got the recommendation to stick to the roadmap and do the ISR
half of Stage 6 before Try It Yourself, then said to go ahead. Full detail in
`docs/DECISIONS.md` D-18 — this is the short version.

**Done**

- `lib/supabase/public.ts` — plain anon Supabase client (no `cookies()`). Every public read
  in `lib/content.ts` switched to it from the cookie-aware SSR client, which had been the
  only reason those functions couldn't run inside `unstable_cache` or `generateStaticParams`
  in the first place.
- `getDoc` tagged `doc:${path}`, `getSidebarTree` tagged `sidebar`, both via `unstable_cache`
  — this is the layer that actually makes revalidation possible; without it there's nothing
  for `revalidateTag` to invalidate.
- `app/api/revalidate/route.ts` — POST, secret-header auth, accepts a Supabase Database
  Webhook payload or a manual `{ tag, path }` body. Resolves the right tag(s) per table
  (`docs`/`doc_translations`/`categories`).
- **Real bug, not on the plan**: `app/layout.tsx` called `headers()` for `<html lang>`,
  which — because it's the ROOT layout, wrapping every route — forced the entire site into
  per-request SSR in production. Invisible in `next dev` (which doesn't distinguish static
  from dynamic the same way); caught by actually running `next build` for the first time in
  this project's history and reading its route table (`ƒ` on every route, expected `●`/`○`).
  Fixed by dropping `headers()` for a static `lang="en"` default corrected client-side via
  the same inline script that already prevents theme-flash. Deleted `proxy.ts` — its only
  job was feeding that now-unused header. Rebuilt: every doc/category page is now `●`
  (SSG), homepage `○` (static). This was the load-bearing fix; tag-based revalidation on a
  site that's fully dynamic anyway would have been a no-op wrapped around a bigger problem.
- Also fixed: `package.json`'s `build`/`start` scripts were missing `--webpack` (only `dev`
  had it, from session 3's unplugin-icons/Turbopack conflict). `next build` failed outright
  without it — never caught because a production build had never been run in this project
  before this session.
- **Verified against a real production build**, not `next dev`: set a doc's title directly
  in the DB via a throwaway script, confirmed the running server kept serving the old value
  (`x-nextjs-cache: HIT`), POSTed to `/api/revalidate` with the doc's tag, confirmed the
  page body picked up the new title on the next request. Reverted the test title afterward,
  deleted the throwaway scripts. The core mechanism is proven, in production, without a
  redeploy.

**Known limitation, not resolved**

`generateMetadata`'s `<title>`/meta output didn't pick up the same invalidation the page
body did — stayed on the old value across repeated `revalidateTag` and `revalidatePath`
calls, and a second full regeneration cycle, while the `<h1>` (page body, same underlying
`getDoc` call) updated correctly every time. Read Next 16.2.11's `unstable_cache`/
`revalidateTag`/route-module source directly trying to root-cause it; leading hypothesis is
that a `generateStaticParams`-prerendered route's metadata gets baked into the static HTML
shell on a path separate from the RSC body payload, and doesn't ride the same tag
invalidation — not conclusively confirmed. Logged as D-18/O-5 rather than either claiming
it's fixed or burning more time chasing Next.js internals with no clear stopping point.
Page *content* is unaffected; only the tab title / search snippet can lag one publish cycle.

**Not done — needs the user**

The actual Supabase Database Webhook (dashboard → Database → Webhooks) has to be created by
hand — no CLI/API credentials for this project's Supabase account were available in this
session (the CLI on this machine is authenticated to a *different* Supabase account
entirely, confirmed by `supabase projects list` not showing this project). Setup steps are
in D-18/O-6: table events on `docs`/`doc_translations`/`categories` → POST to
`/api/revalidate` → header `x-revalidate-secret: <REVALIDATE_SECRET value>`. Supabase's
default webhook payload shape is already what the route expects, no template needed.

**Findings worth remembering**

1. **A dynamic API (`headers()`/`cookies()`) used in the ROOT layout poisons every route in
   the app**, not just the component that calls it — this is a much bigger blast radius
   than the same call in a leaf page, and `next dev` won't show you it happened. Any
   "why is my ISR/SSG not working" investigation should check the root layout first.
   `next build`'s route table (`○`/`●`/`ƒ`) is the actual source of truth, not assumptions.
   Deployed to Vercel, this bug would have quietly meant every crawler hit was hitting
   Supabase — the exact failure mode CLAUDE.md §3.3 exists to prevent.
2. **`unstable_cache` can be created inline, per-call, with dynamic tags** — `unstable_cache(fn,
   [key, ...args], { tags: [dynamicTag] })()`, called fresh every invocation — this is the
   documented pattern for per-argument tags (e.g. `doc:${path}`), not a misuse; caching is
   keyed by `keyParts`, not by the wrapper's identity.
3. **`revalidateTag(tag, 'max')` is not "revalidate immediately with no periodic expiry"** —
   reading Next's own source, a *string* profile like `'max'` only sets `pendingRevalidatedTags`
   without setting `pathWasRevalidated`, which behaves like stale-while-revalidate for the
   *first* subsequent hit. `revalidateTag(tag, { expire: 0 })` is what actually corresponds
   to "on-demand, regenerate now." The deprecation warning for the old single-argument form
   pushes toward `'max'`, which reads as "the new correct default" but isn't the same thing
   as the old (deprecated but immediate) single-argument behavior.
4. **Never trust a rebuild as a clean test of a caching bug** — `unstable_cache`'s default
   revalidate window is `CACHE_ONE_YEAR_SECONDS`, and Next reuses `.next/cache` across
   builds by default, so a second `next build` can silently bake in stale data cached by the
   *first* build rather than re-fetching. `rm -rf .next/cache` before any build used as a
   cache-behavior test, or the "before" state is contaminated by leftover cache from a
   previous run — this cost real time during this session's testing.
5. A background `next start` process left listening on a port from an earlier test survives
   `pkill -f "next-server"`/`pkill -f "next start"` (pattern didn't match how the process
   shows up), silently serving stale build output to every subsequent curl and making a
   fixed bug look unfixed. `netstat -ano | grep :<port>` + `taskkill //PID <pid> //F` to
   confirm the port is actually free before trusting a "clean" test run.

**Failed / abandoned**

- Did not resolve the `generateMetadata` staleness lag (see above) — logged as O-5 rather
  than abandoned outright; worth revisiting with a Next.js version bump or upstream issue
  search before Stage 7 makes it user-visible.
- Did not set up the real Supabase Database Webhook — genuinely blocked on dashboard access
  this session doesn't have, not a scope decision.

**Next session — start here**

1. User needs to create the Supabase Database Webhook (D-18/O-6) before Stage 6's
   revalidation is actually live in production — everything on the code side is done and
   verified, this is the one remaining manual step.
2. Try It Yourself — the other half of Stage 6, still unstarted, still its own session.
3. Worth a quick Next.js changelog/issue search for the `generateMetadata` staleness
   quirk (O-5) before it becomes user-visible via the admin panel's publish flow.

---

## 2026-07-26 — Session 12: Try It Yourself built (Stage 6, second half)

Full decision writeup in `docs/DECISIONS.md` D-19 — this is the short version.

**Done**

- `components/blocks/try-it.tsx` — the editor + preview UI. Tabs per file present in the
  block's `files` (HTML/CSS/JS for web mode, JSX/CSS for react mode), Run/Reset buttons,
  sandboxed `<iframe sandbox="allow-scripts">` (no `allow-same-origin` — opaque origin,
  correct for running arbitrary user code per D-04), runtime errors relayed back via
  `postMessage` and shown in an error panel.
- `lib/tryit.ts` — pure srcDoc builders. Web mode: plain template, html/css/js inlined with
  a try/catch + `window.onerror` wired to the postMessage relay. React mode: Sucrase
  (`transforms:['jsx']`) compiles the block's JSX to `React.createElement` calls, injected
  into a doc that loads React via an import map pointing at `esm.sh` (React's own
  officially-documented no-build-tool pattern) since **React 19 no longer ships a UMD
  build** to self-host the old way.
- `components/blocks/try-it-lazy.tsx` + a `case 'tryit'` in `block-renderer.tsx` — wires it
  into the content pipeline. Code-split so CodeMirror-successor weight doesn't hit every
  lesson page, only ones that use it.
- **Verified live**, not just built: inserted temporary test blocks (web-mode counter,
  react-mode counter, a deliberate `thisWillThrow()`) into a real doc, confirmed in-browser
  — both counters actually increment on click (not just initial render), the error panel
  shows "thisWillThrow is not defined" correctly. Reverted the test doc back to its
  original content afterward.

**Two real bugs found and fixed, not on the original plan** — full detail in D-19:

1. **CodeMirror 6 (named in `docs/UI.md`) doesn't work in this stack.**
   `@uiw/react-codemirror`'s outer shell mounts but its `EditorView` never initializes — no
   editor, no error, anywhere. Took roughly 2 hours to isolate via bisection (trivial stub
   vs real component; bare CodeMirror with zero props/extensions still failed). Replaced
   with a plain `<textarea>` (monospace, manual Tab-key indent) — not a real loss, W3Schools'
   own original Tryit Editor used a textarea too. Package uninstalled.
2. **`next/dynamic(fn, { ssr: false })` never resolves on a `generateStaticParams` route in
   Next.js 16.2.11 (webpack)** — the loading fallback shows forever, zero console/server
   errors, reproducible in dev and a real `next build && next start`. This was the actual
   root cause of bug #1 looking like a CodeMirror problem for most of the investigation —
   removing only `ssr: false` (keeping everything else, including the real heavy
   component) fixed it instantly. Affects any *future* lazy-loaded client widget on a doc
   page, not just this one — the workaround (drop the flag; the component just needs no
   server-unsafe code outside effects/handlers) is documented in `try-it-lazy.tsx` and
   D-19 so it doesn't need re-discovering.

**Findings worth remembering**

1. **A mid-investigation revert can silently invalidate everything tested after it.**
   While isolating bug #2, `try-it-lazy.tsx` was reverted to its original `ssr:false` state
   to test an unrelated production-build question, and never restored — every bisection
   test run after that point (CodeMirror-only, bare CodeMirror, plain textarea) was
   actually re-testing the *already-known-broken* `ssr:false` path, not the thing being
   isolated. This pointed suspicion at CodeMirror for a long stretch before the mistake was
   caught by rereading the file's actual current content instead of trusting memory of
   what it should contain. Lesson: when a bisection result contradicts a previous one,
   re-read the file before doubting the test.
2. **A killed dev-server process on Windows can leave `.next` file-locked for a few
   seconds** — `rm -rf .next` right after `taskkill` silently left `.next/dev` behind
   (`rm: cannot remove '.next/dev': Directory not empty`), producing a "clean" rebuild that
   wasn't. A short sleep between kill and delete, plus checking `ls .next` actually fails
   before trusting a wipe, avoided repeating this.
3. **`next/dynamic`'s loader must stay a simple `() => import(...)` expression.** Wrapping
   it with extra statements (even just a `console.log` before the `import()` call) for
   debugging purposes risked breaking Next's compile-time static analysis of that pattern —
   reverted the debug wrapper once this became a live concern, rather than trusting output
   from an instrumented version of the exact code path being debugged.
4. **`next/dynamic`'s `loading` fallback can render successfully forever while the actual
   import factory silently never resolves** — no exception, no rejected promise visible
   anywhere. The only way this surfaced was checking Network tab requests for the expected
   chunk file by name and noticing it was never fetched at all (later, once it *was* being
   fetched, checking whether the DOM the loaded module actually produced matched
   expectations, not just whether the request succeeded).

**Failed / abandoned**

- CodeMirror 6 as originally speced in `docs/UI.md` — not abandoned lightly, but after
  thorough isolation showing it's a genuine library/React-19 incompatibility, not a mistake
  in this project's usage of it. Textarea is the shipped replacement; revisiting CodeMirror
  is future work, not blocking.

**Next session — start here**

1. User still needs to create the Supabase Database Webhook (D-18/O-6) — Stage 6 is fully
   code-complete on both halves now (ISR + Try It), this is the one manual step left.
2. Admin panel (Stage 7) is next per the roadmap — note for whoever builds it: its code
   block editor was also speced around CodeMirror 6 (`docs/CONTENT-MODEL.md`) and will hit
   the same wall; plan for a textarea-based editor there too unless a React-19-compatible
   CodeMirror version is confirmed working first, in isolation.
3. `generateMetadata` staleness (D-18/O-5) still unresolved — worth a Next.js version
   check before the admin panel's publish flow makes it user-visible.

---

## 2026-07-25 — Session 9: Bengali i18n + Intro to Programming + command palette

Two new user requests in one turn: a new "Intro to Programming" section, and a full
Bengali translation of the entire site. Both are big enough that the session opened with
clarifying questions (see D-16) before writing code — answers: `/bn/` path prefix, one
category translated at a time with review checkpoints, and lesson prose + UI chrome + code
comments all in scope (syntax itself stays English).

**Done**

- **Schema** (`supabase/migrations/002-i18n.sql`, not yet applied — needs the user to run
  it): `doc_translations` table (English stays in `docs`, untouched), `categories.title_bn`,
  new `programming` category row (sort_order 8).
- **Routing**: `app/bn/` route tree mirrors `app/` (literal folder split, not a `[locale]`
  segment — simpler for exactly 2 locales with one unprefixed). Shared logic via
  `components/home-content.tsx` and `components/lesson-content.tsx` so English and Bengali
  routes aren't two independent copies of the same page.
- **`proxy.ts`** (Next.js renamed `middleware.ts` → `proxy.ts` as of this version; caught
  the deprecation warning and migrated rather than leaving it on the old convention) sets
  an `x-locale` request header so the root layout can set the correct `<html lang>` — it
  can't read dynamic route params directly since `/bn` is a folder split, not a segment.
- **i18n string dictionary** (`lib/i18n.ts`) for UI chrome — nav, buttons, footer, the
  "not translated yet" banner. Lesson content translations live in `doc_translations`, not
  here; this file is chrome-only on purpose.
- **Partial-rollout fallback, built in from the start**: `getDoc(path, 'bn')` returns
  English content + `isTranslated: false` when no translation exists yet, rather than
  404ing — a missing translation is the expected common case for most of the rollout, not
  an error. `getTranslatedDocPaths()` (used by `/bn`'s `generateStaticParams`) only
  pre-builds pages that already have a translation.
- **Command palette** (⌘K), user's mid-session addition, referencing kbar's UX — built with
  `cmdk` (already the decided library in `docs/UI.md`, not kbar itself) + Radix Dialog +
  a Server Action calling the existing Postgres full-text `searchDocs()`. Lazy-loaded via
  `next/dynamic` so it doesn't add to every page's initial JS. **Verified working
  end-to-end live**: typed "align", got "CSS Align" back from a real database query.
- **Intro to Programming content — written, not yet inserted** (blocked on the migration):
  `scripts/create-programming-section.mjs` contains all 19 lessons as structured block
  data — Variables, Constants, Data Types, Type Casting, Operators, Comments, If
  Statements, Loops, Arrays, Strings, Functions, Recursion, Scope, Input/Output, Bits and
  Bytes, Binary Numbers, Hexadecimal Numbers, Boolean Algebra, plus an intro. Entirely
  original writing — see D-17 for why this wasn't scraped from the source the user named.
- **Real regression found and fixed before it shipped**: `getDoc`'s category join
  explicitly selected `title_bn`, a column that doesn't exist until the migration runs —
  this silently broke **every** English lesson page too (not just Bengali ones), since the
  query failed and the error was swallowed into a plain `notFound()`. Caught by testing
  `/css/align` again after the i18n changes and seeing a 404 on a page that worked minutes
  earlier — traced it directly against the DB rather than guessing. Fixed by dropping the
  unused column from that query.
- Also hardened `getSidebarTree` and `getTranslatedDocPaths` the same way — any
  `doc_translations` failure degrades to "no Bengali data available yet," never a crash.
- Fixed a real (if smaller) bug found via screenshot: the language-switch button showed
  "বাংলা" while already on the Bengali page — read `t(otherLocale)` where it should have
  read `t(locale)`, showing the wrong direction's label.

**Findings worth remembering**

1. **A query that references a not-yet-migrated column breaks everything selecting that
   row, not just the new feature.** `title_bn` was meant to affect only Bengali rendering,
   but including it in `getDoc`'s always-run category join broke English too, silently
   (swallowed error → `notFound()`). New optional columns should not be selected in
   shared/hot-path queries until they're confirmed to exist, or the code needs a fallback
   that doesn't happen to look like a 404.
2. **Next.js renamed `middleware.ts` to `proxy.ts`** in this version (deprecation warning,
   not yet a hard break). Migrated rather than leaving the deprecated convention in a
   fresh project.
3. **A TypeScript narrowing limitation with try/catch reassignment** — `let x = null; try
   { x = ... } catch { x = null }; if (!x) return ...; return {...x}` doesn't narrow `x`
   cleanly after the guard, because the assignment happened inside a try block. Extracting
   the try/catch into a small helper function that *returns* the value (so the caller gets
   a plain `const`) sidesteps the limitation entirely and reads better besides.
4. **Chrome DevTools/CDP had a run of transient screenshot timeouts** mid-session,
   unrelated to the app — waiting a few seconds and retrying resolved every instance. Two
   separate real UI bugs (language switcher direction, this session's earlier duplicate
   anchors) were caught by *not* giving up on visual verification when the tool got flaky.

**Failed / abandoned**

- Nothing abandoned. Every bug found this session (regression, hardening gaps, switcher
  direction) was caught and fixed within the same session, not deferred.

**Update, same session — migration applied, content live, full category translated**

User ran the migration shortly after this session's summary was posted. Immediately:
- `node scripts/create-programming-section.mjs` — all 19 English lessons inserted and
  verified live at `/programming/*`.
- Bengali pilot written and inserted (`scripts/translate-programming-pilot.mjs`):
  `intro`, `variables`, `data-types` — the first three lessons a student reads. Verified
  live at `/bn/programming/*`, screenshotted: translated titles sit correctly in the
  sidebar alongside the 16 still-English ones, in the right sort order, no rendering
  issues. Translation rules applied: prose translated, code blocks byte-identical to
  English, comments translated only when descriptive (not when just echoing a literal
  output value like `// 0` or `// "apple"`).
- **User approved the pilot** and gave one standing correction: West Bengal/Indian Bengali
  vocabulary, not Bangladeshi (জল not পানি). Saved as a memory file
  (`bengali_translation_dialect.md`) — this needs to survive far past this session, into
  every future translation batch.
- User then said "continue, do all" — translated the remaining 16 lessons in the same
  session (`scripts/translate-programming-rest.mjs`), all inserted and verified.
  **The Programming category is now the first to reach full bilingual parity** — zero
  fallback banners remain under `/bn/programming/*`.
- **Caught my own translation bug during a routine visual spot-check**, not from user
  feedback: the Arithmetic Operators table had its header translated but the row content
  ("Addition", "Subtraction", etc.) was left in English by mistake — inconsistent with
  the Comparison/Logical tables in the same lesson, which were done correctly. Fixed with
  a targeted patch to that one table rather than re-running the whole batch. Worth noting
  the failure mode: spreading `...en.block` and only overriding `header` silently keeps
  the old `rows` — an easy mistake to repeat in future translation batches, so watch for
  it specifically when a table needs its row *labels* (not just headers) translated.
  English (untranslated syntax, per the user's own note that syntax can't be translated),
  inline `<code>` spans inside sentences left as-is, anchors identical between languages
  so deep links and the "On this page" TOC scroll-to work the same in both.
- **Now waiting on the user's read of these 3 lessons for tone/quality** — the explicit
  checkpoint from D-16, not a technical blocker. Once approved: the remaining 16 Programming
  lessons, then the user picks the next category.

---

## 2026-07-25 — Session 8: sidebar accordion, real branding, wider layout, real bug fix

User feedback on session 7's build, addressed in order:

**Done**

- **Duplicate heading-anchor bug — real, not cosmetic.** React console errors
  (`key-characteristics`, `examples`, `types` colliding) traced to lessons with repeated
  subheading text (e.g. "Key Characteristics" under every era in
  `basics/computer-fundamentals`'s 16-section page) — the extractor's `slugify()` had no
  per-document dedup, so identical text produced identical anchors. Affected 3 of 131 docs
  (`basics/computer-fundamentals`, `javascript/control-flow`, `react/introduction`), 15
  anchors total. **Did not re-run `extract-docs.mjs`** — that regenerates blocks from the
  raw Jekyll source and would have wiped every Cloudinary URL from the Stage 4 migration.
  Instead wrote a one-off script operating on the *current* DB content: same dedup
  algorithm, applied to already-migrated `blocks`/`toc`, nothing else touched. Fixed the
  extractor too (for correctness on any future re-extraction) but the live fix came from
  the surgical script.
- **Sidebar rebuilt as an accordion.** All 7 categories were rendering fully expanded —
  36 HTML lessons visible at once with no way to collapse. Added `@radix-ui/react-accordion`
  (matches the shadcn pattern already used for `Button`), split `DocSidebar` into a server
  component (data fetch) + `SidebarNav` client component (interactive accordion), reused
  the homepage's brand icons per category. The category containing the current page
  defaults open; others closed but reachable.
- **Real branding.** User supplied the actual LCA logo/favicon files (local paths, not in
  the repo). Processed with `sharp`: `app/icon.png` (512px, Next's native favicon
  convention — no hand-built `.ico`), `app/apple-icon.png` (180px), `public/logo-icon.png`
  (64px header icon). **Did not use the full wordmark PNG** — its "LEARN COMPUTER ACADEMY"
  text is baked into black pixels, which would be invisible in dark mode, and CSS `invert()`
  would also wreck the orange badge alongside the text. Used the icon badge (no baked text)
  + real DOM text (`text-foreground`, adapts to theme automatically) instead.
- **Wider, flexible lesson-page layout.** Removed the `max-w-6xl` (1152px) cap entirely —
  sidebar and TOC stay fixed-width, the center content column (`flex-1`) now absorbs all
  remaining viewport width. Mobile unaffected (sidebar/TOC already hidden below md/xl
  breakpoints, this only changes what happens on larger screens).
- **Homepage overhaul** — user called the first pass "too bland." Added: a stats badge
  ("131 free lessons, 7 subjects" — computed from live data, not hardcoded), a decorative
  static code-editor mockup in the hero (not interactive — that's Try It Yourself's job,
  Stage 6), a 3-column features section (runnable examples / beginner friendly / free), a
  "Browse subjects" anchor-link secondary CTA, bigger/bolder subject cards with hover lift.
  Extracted the category→icon map into `lib/category-icons.tsx` so the sidebar and
  homepage share one source instead of two copies.
- Fetched https://designrevision.com/blog/best-shadcn-templates for pattern reference
  (collapsible sidebar sections, nested items, mobile drawer) before building — confirmed
  the accordion direction rather than inventing it from scratch.

**Findings worth remembering**

1. **Console errors from a stale browser tab looked identical to a live bug.** After
   fixing the duplicate-anchor issue in the DB, the dev server terminal kept relaying
   `[browser] Encountered two children with the same key` from an already-open tab that
   hadn't hard-reloaded since before the fix. Verified directly against the DB (0
   duplicates) before spending more time chasing a bug that no longer existed — the
   lesson: when a fix "doesn't seem to work" after confirming success, check whether
   you're looking at stale client state before re-deriving the server-side logic.
2. **A full wordmark logo with baked-in text is theme-hostile.** Any raster asset with
   dark text baked into transparent PNG pixels can't adapt to dark mode without either a
   second asset or accepting a hue-wrecking `invert()`. Icon-only image + real text is the
   general fix, not specific to this logo.

**Next session — start here**

1. Get explicit sign-off before scaling to all 131 lessons.
2. Mobile sidebar is still just hidden, not a drawer — worth a pass if the user wants the
   full shadcn-sidebar-template pattern, not just desktop polish.
3. Category index pages (`/[category]`) — still the one structural gap.

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
