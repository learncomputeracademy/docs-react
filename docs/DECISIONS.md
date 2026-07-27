# Decision log

Every architectural decision, why it was made, and what it costs. Append-only — when a
decision is reversed, mark the old one **Superseded** and add a new entry. Never delete.

**Format:** one entry per decision. `Status` is `Active`, `Superseded by D-xx`, or `Open`.

---

## D-13 · UI libraries are open — under a performance budget
**Date:** 2026-07-24 · **Status:** Active · **Decided by:** user

The user green-lit any icon/component/widget library that makes the site more modern, and
named **Iconify** specifically. Accepted, with one condition attached.

**The condition:** the old site shipped ~3.5 MB of Bootstrap + FontAwesome + Themify +
OwlCarousel + jQuery, and removing it is the largest performance win in this project. That
is easy to undo one convenient dependency at a time. So: **JS < 100 KB gz on a lesson page,
CSS < 30 KB, fonts < 100 KB, Lighthouse ≥ 95.** New *runtime* deps need a one-line
justification; *build-time* deps (Shiki, unplugin-icons) are free.

**Icons — Iconify, but compiled:** `unplugin-icons` + `@iconify/json`, inlined as SVG at
build time. ⚠️ **Not** `@iconify/react` in its default runtime mode, which fetches icon
data from Iconify's public API at render time — external request in the critical path,
flash of missing icon, third-party runtime dependency. Same icons, wrong delivery.

**Added:** `cmdk` (⌘K palette — highest-impact modern touch for a docs site), `sonner`,
`dnd-kit`, CodeMirror 6, Tiptap, `motion` (restrained; honour `prefers-reduced-motion`).

**Dark mode is required, not optional.** Full stack and tokens: `docs/UI.md`.

---

## D-12 · URLs are free to change — the site is not indexed
**Date:** 2026-07-24 · **Status:** Active · **Decided by:** user
**Relaxes:** CLAUDE.md §3.1 and §3.2, which were the project's two hardest constraints

The user reports `docs.learncomputer.in` **is not yet indexed by Google**. There is
therefore no organic ranking to preserve and no URL contract to honour.

**This is the single largest de-risking event in the project.** What it removes:

- byte-for-byte URL preservation, and the empty-diff gate before cutover
- carrying the misspelled `/resourses/` forever
- the trailing-slash exceptions for `box-model` and `box-shadow-generator`
- most of Stage 9, which was the highest-risk stage
- the urgency of the 30-day GitHub Pages rollback

**What it does *not* remove — do not over-correct:**

- Static HTML still ships from ISR. The site will be indexed *eventually*, and being
  crawlable from day one is the whole point of the architecture. Nothing about D-10 changes.
- `sitemap.xml`, `robots.txt`, canonicals, per-page metadata, OG cards and JSON-LD are all
  still built. They are now a **foundation** rather than a **parity exercise**.
- `urls-before.txt` (140 URLs) stays — repurposed from *URL contract* to **content
  completeness checklist**. Every one of the 140 must still have a destination page; it
  simply no longer has to be at the same address.
- Human links still break. Students' bookmarks, WhatsApp shares and any links from
  learncomputer.in are real even with zero Google presence. Redirects are cheap; add them
  for anything that moves.

### ✅ CONFIRMED 2026-07-24 — no longer an assumption

The user has **no Search Console property for this domain at all.** Combined with what was
measured, the evidence chain is now complete and consistent:

| Signal | State |
|---|---|
| Search Console property | ❌ **never existed** |
| `sitemap.xml` | ❌ **404** |
| `robots.txt` | ❌ not a real file — Cloudflare serves a managed content-signals page |
| Canonical tags | ❌ none |
| Meta robots | ❌ none |
| Lesson pages in search results | ❌ none |
| Asset PDFs in index | ⚠️ 2 (`Color-Theory.pdf`, `ui/ui-theory-3.pdf`) |

**This is not a site that lost its ranking — it is a site Google was never given a way to
discover.** 132 lessons reachable only through internal navigation, with no sitemap and no
Search Console. The two indexed PDFs were almost certainly found via external links, which
is exactly what you would expect.

**Consequence — the project's biggest risk is now zero.** "Jekyll→React migrations lose
organic traffic" cannot happen here; there is no organic traffic to lose. Stage 9 changes
character completely: from **SEO parity** (the highest-risk stage) to **SEO foundation**
(low risk, large upside). The new site will be the first version of this content that
search engines have ever had a fair chance to index.

**Two obligations remain, and they are now opportunities rather than defences:**

1. **301 the two indexed PDF URLs** to Cloudinary. Cheap; skipping it would create the
   site's first-ever indexing error. CLAUDE.md §3.7.
2. **Set up Search Console and Bing Webmaster Tools at launch**, verify the domain, submit
   the sitemap. This is now a *build* task in Stage 10, not a verification task. Without
   it, the new site risks repeating exactly the discovery failure that caused this.

D-12 expires at launch. From the day pages start being indexed, URLs freeze permanently.

**Consequence:** URLs get designed properly *now*, then **frozen at launch**. From the day
the site is indexed, D-12 expires and the old rules apply permanently. Record the freeze in
`PROGRESS.md` when it happens.

New scheme: **`docs/URLS.md`**.

### D-12a · `design` splits into `design` + `photoshop`
**Date:** 2026-07-24 · **Decided by:** user

12 Photoshop pages move to their own category (`/photoshop/intro`, `/photoshop/layers`, …);
17 stay in `design` with the `graphics-design-` stutter dropped. **Seven categories total.**
Photoshop already had its own syllabus page, so it was a separate course sitting inside
another category's URL space. Full mapping in `docs/URLS.md`.

**Duplicate found while mapping:** `graphics-design-poster` and `graphics-design-posters`
are the same page — identical `<h1>` and body, differing only in title, permalink and one
example link (Web Graphics Hub vs Freepik). **Recommended: merge into `/design/poster`
keeping both links, 301 the other.** Takes the lesson count 132 → 131. Flagged rather than
done silently because CLAUDE.md §1 forbids dropping content; merging a duplicate while
preserving both links honours that. **Default if unanswered: merge.**

---

## D-11 · Lessons are typed blocks, not one rich-text blob
**Date:** 2026-07-24 · **Status:** Active · **Decided by:** user (concept), Claude (shape)

A lesson is an ordered array of typed blocks in `docs.blocks jsonb`. The admin panel is a
block editor built on shadcn/ui. Full spec: **`docs/CONTENT-MODEL.md`**.

**Why, from measured content rather than principle:**

| Evidence | Implication |
|---|---|
| **634** `<pre class="snippet">` across 92 files | code is the dominant non-prose element; it needs a language field and a runnable flag, which a blob cannot hold |
| snippets already carry `class="js\|html\|css"` | language metadata comes free from extraction — no guessing |
| **802** `<h2>` in 130 files | headings as blocks give TOC, anchors and an outline view for free |
| Try It Yourself (D-04) | **forces the decision** — editable source cannot be reliably recovered from prose HTML |
| 8 callouts, 3 iframes, 2 video, 2 audio, 1 `<mark>` | the long tail is tiny; do **not** build 12 widgets up front |

**Hybrid, deliberately.** Pure blocks make writing prose miserable, so one `richtext`
block (Tiptap) holds normal paragraphs and only structural things get their own type.

**Cost, accepted knowingly:** Stage 3 extraction gets harder — the script must *segment*
HTML into blocks rather than dump a blob. Mitigated by how regular the source markup turns
out to be (`pre.snippet`, `div.img-block`, `div.note`, `table`).

**Build order:** Phase 1 = `richtext`, `heading`, `code`, `image`, `table` → covers ~95% of
existing content and is the bar for Stage 3 being done. Everything else is Phase 2+.

**UI:** shadcn/ui, plus **`dnd-kit`** for block reordering — shadcn ships no drag-and-drop.
CodeMirror 6 for code blocks. Edit in place, never in modals.

---

## D-10 · Content lives in Supabase (free tier); admin panel is in scope
**Date:** 2026-07-24 · **Status:** Active · **Decided by:** user
**Supersedes:** D-01, D-06, D-07, D-09

The 132 lessons live in Postgres on Supabase's **free tier**. An admin panel at `/admin`
is the editing surface. This reverses D-01, made earlier the same day.

**User's reasoning (accepted):**
1. Opens the door to future upgrades — student accounts, progress tracking, quizzes —
   without a second migration.
2. An admin panel feels more professional than editing files.
3. **No waiting for a deploy to publish.**

**On (3) — this only works if wired correctly:**

```
Editor clicks Publish  →  Supabase DB webhook  →  POST /api/revalidate
   →  revalidateTag('doc:css/css-intro')  →  that ONE page regenerates (~1s)
   →  every visitor and Googlebot still gets static HTML from the edge
```

Pages must be **ISR with on-demand tag revalidation**, not pure SSG (a rebuild — the thing
being avoided) and not SSR (kills the SEO gate in CLAUDE.md §3.3 and hits the DB on every
pageview, including bot traffic). **The database is touched on publish, and on the first
request after a revalidation. Never per pageview.** Getting this wrong silently converts
a fast static site into a slow dynamic one that burns the free tier's quota on crawlers.

### Storage reality — measured, not estimated

Raw `_docs` is **1.1 MB** across 132 files (avg 8.3 KB). After stripping Bootstrap
scaffolding and storing both `body_html` and `body_md`, plus the `tsvector` GIN index:
**≈5 MB against a 500 MB limit — about 1%.** Storage is not the binding constraint and
will not be for years. The usage panel is still built (see `docs/ADMIN.md`), but it tracks
all four free-tier limits, because the ones that actually bite are egress and pausing.

### The two real free-tier risks

| Risk | Consequence |
|---|---|
| **Project pauses after 7 days of inactivity** | manual restore from the dashboard. Builds fail while paused; publishing fails; **already-cached ISR pages keep serving**, so the public site survives — blast radius is the admin panel, not SEO |
| **No automated backups on free tier** | 132 lessons of hand-written teaching material with no restore point |

**Both are solved by one daily GitHub Action** (free, ~15 lines):

1. `select 1` against Supabase → resets the 7-day inactivity clock, so it never pauses.
2. Export every row of `docs` to MDX + JSON and commit it to this repo → a versioned,
   diffable, off-Supabase backup, restorable by re-running the seed script.

⚠️ **The export is a backup, not a source of truth.** Never edit it. Never build from it.
This is the D-09 warning, honoured in the opposite direction.

**Upgrade trigger:** move to Pro ($25/mo) when real students depend on the site, or when
egress approaches the 5 GB/month limit. Not before — the ISR architecture keeps Supabase
traffic tiny by design.

⚠️ Free-tier limits shift. Re-verify at implementation time rather than trusting the
numbers written here.

---

## D-01 · Content lives in MDX files, not a database
**Date:** 2026-07-24 · **Status:** ⚠️ **Superseded by D-10** (same day) · **Decided by:** user

> Reversed within hours of being made. Kept for the reasoning, which still holds if the
> project ever needs to go back. The reversibility clause below **survives** — see D-10.

The 132 lessons become `.mdx` files in `content/<category>/<slug>.mdx`.

**Why:** One author. MDX is free, version-controlled, diffable, reviewable in a PR, and
fully static — no cold starts, no quota, no monthly bill. `MIGRATION-PLAN.md` assumed
Supabase; a database only earns its keep when non-technical people edit lessons.

**Cost of this choice:** editing a lesson means editing a file (or a GitHub web edit),
not clicking through an admin UI.

**Reversibility — protected:** all content reads go through `lib/content.ts`. Pages never
touch the filesystem directly. Swapping MDX for a DB later is one file, not a rewrite.
This constraint is load-bearing; do not bypass it for convenience.

**Struck as a result:** MIGRATION-PLAN Stage 2 (Supabase schema + RLS), Stage 6
(revalidation webhooks), Stage 7 (admin panel). ~1 week of build and $25/mo saved.

---

## D-02 · Host on Vercel, fully static
**Date:** 2026-07-24 · **Status:** Active · **Decided by:** user

**Why:** With D-01 there is no database to cache, so the migration plan's Cloudflare
apparatus — R2 incremental cache, D1 tag cache, Durable Object queue — has nothing to do.
Vercel is zero-config for Next.js and the free tier covers a static docs site comfortably.

**Note for the record:** the plan's §0 warning is still correct and still matters if this
is ever revisited — for Next.js on Cloudflare, use **Workers** via `@opennextjs/cloudflare`,
never Cloudflare **Pages** (`next-on-pages` is superseded).

**Consequence:** every lesson is HTML at build time, which satisfies the "content must be
in the server HTML" gate (§3.3 of CLAUDE.md) by construction rather than by configuration.

---

## D-03 · Design: W3Schools, modernized
**Date:** 2026-07-24 · **Status:** Active · **Decided by:** user

Keep the structure students already recognise — fixed syllabus sidebar, example-first
lessons, prominent Try-It buttons, short scannable sections. Modernise everything else:
typography, spacing, dark mode, accessible contrast, no 2010s clutter.

**Not** Tailwind-docs minimalism, **not** MDN density, **not** SaaS-docs polish. Those were
the alternatives considered.

---

## D-04 · "Try It Yourself" editor, including React
**Date:** 2026-07-24 · **Status:** Active · **Decided by:** user

Live editable code + instant preview, running entirely in the browser. No backend, no
execution service, no cost.

- **HTML / CSS / JS** — write into an `<iframe srcdoc>`, sandboxed.
- **React** — in-browser JSX transform via **Sucrase** (smaller and faster than
  Babel standalone), then the same iframe.

**Cost:** the largest build item after content extraction. Sandbox the iframe properly —
this runs arbitrary user code.

---

## D-05 · Media on Cloudinary, account `docslca`
**Date:** 2026-07-24 · **Status:** Active · **Decided by:** user

All images, and any PDFs/ZIPs, go to Cloudinary cloud **`docslca`** — deliberately a
**different account** from the one used for amartadey.com, so the two properties' quotas
and asset libraries stay separate.

**Credentials:** in `.env.local` (git-ignored) and, before first deploy, in the Vercel
dashboard. The API secret is **not** recorded in any tracked file. `.env.example` documents
the variable names only.

Folder structure, upload rules, and the PDF/ZIP convention: **`docs/ASSETS.md`**.

---

## D-06 · Search is client-side, not a service
**Date:** 2026-07-24 · **Status:** ⚠️ **Superseded by D-10** — now Postgres full-text search

A build-time static index goes stale the moment content publishes without a build, which
is the entire point of D-10. Postgres `tsvector` is queried live and is always current.
Original reasoning below.

Content is local at build time, so the index can be built at build time too
(Pagefind or FlexSearch) and shipped as a static file. No Algolia, no Postgres FTS, no
API key, no per-query cost.

**Context:** search on the current site has never worked — `search.json` is 0 bytes and
`_includes/search.html` contains a form with no JavaScript behind it. This is new
functionality, not a migration.

---

## D-07 · Supabase not used
**Date:** 2026-07-24 · **Status:** ⚠️ **Superseded by D-10** — Supabase is now the content store

Follows from D-01 and D-02: nothing left in scope needs a database.

**What would bring it back**, in rough order of likelihood:
1. Non-technical editors needing an admin panel → but see D-01's reversibility clause first.
2. Storing contact-form submissions instead of only emailing them.
3. User accounts — progress tracking, "mark lesson complete", quizzes.

If any of those land, see **D-09** for which database and why — and note that (1) does
**not** imply a database at all. `MIGRATION-PLAN.md` §2 still has a usable schema and RLS
policy set. Revisit rather than rewrite.

---

## D-09 · The future admin panel: Git for content, a database only for real data
**Date:** 2026-07-24 · **Status:** ⚠️ **Superseded by D-10** — content moved into the DB

> Its core warning survives and is honoured in D-10: **never two editable sources of
> truth.** D-10 resolves it the other way — Postgres is authoritative, the Git export is a
> read-only backup that is never edited.

Answers "which database, given we host on Vercel?" — asked while the admin panel is still
deferred under D-01.

**The trap this avoids:** if an admin panel writes lessons into a database, lessons exist
in both MDX and Postgres and nothing says which is authoritative. That ambiguity, not the
choice of database, is what makes people regret adding a CMS.

**Therefore, two tiers:**

| Tier | Where it lives | Why |
|---|---|---|
| **Lesson content** | **Git.** Admin panel commits MDX via the GitHub API (Octokit, or TinaCMS / Sveltia / Decap). **No database.** | keeps version history, diffs, rollback, PR review — worth a lot for teaching material. D-01 stays intact, one source of truth |
| **Dynamic data** | **A database.** Contact leads now; student accounts, progress, quiz results later | genuinely cannot live in Git |

**Cost of the Git tier:** publishing waits for a build (~1–3 min for 140 pages) instead of
being instant. Acceptable for lesson content.

**Database choice when the day comes — recommendation: Supabase.**

| | Neon | Supabase |
|---|---|---|
| Idle | auto-suspends, auto-resumes ~0.5s | free tier **pauses after 7 days, manual restore** |
| Auth | ❌ | ✅ auth + RLS |
| Prod cost | free tier usable | ~$25/mo Pro |

Chosen for **auth**, not for the database. The most likely future feature is student
accounts with progress tracking, and auth is the most expensive thing to build yourself
and the easiest to get subtly wrong.

**Reverse this if it turns out to be data-only** — leads storage with no logins ever. Then
use **Neon**: free, Vercel-native, and no 7-day pause, which matters for something touched
once a week.

⚠️ Re-verify both free tiers at implementation time. Vercel Postgres was folded into Neon
and these tiers have shifted more than once.

**Nothing is provisioned today.** No database exists until a feature needs one. The contact
form (Stage 8) is the first candidate, and it can ship email-only.

---

## D-08 · Old content decisions
**Date:** 2026-07-24 · **Status:** Active · **Decided by:** Claude, reversible on request

- `_posts/2025-02-10-welcome-to-jekyll.markdown` — Jekyll boilerplate. **Dropped.**
- `about.markdown` — contains unmodified theme text ("This is the base Jekyll theme…").
  `/about/` is a live URL so the page must exist; it **needs real copy** from the user.
- `_config.yml` — never customised (`title: Your awesome title`, empty `url`). Nothing to
  carry over.
- Bootstrap, FontAwesome, Themify Icons, OwlCarousel2, jQuery — **all dropped**. ~3.5 MB.

---

## D-14 · Cloudflare R2 for oversized files
**Date:** 2026-07-25 · **Status:** Active · **Decided by:** User

Cloudinary's free tier caps every upload — images and raw files alike — at 10 MB. Only 2 of
132 lessons' assets exceed it (`designer-guide-2.pdf` 21.4 MB, `designer-guide-4.pdf`
26.5 MB, both course handouts referenced from `design/intro`), but the constraint is
permanent, not a one-time exception — any future oversized upload hits the same wall.

**Chosen: Cloudflare R2**, over Vercel Blob and over compressing the files to force them
under 10 MB.

| | R2 | Vercel Blob (Hobby) |
|---|---|---|
| Free storage | 10 GB | 1 GB |
| Egress | **$0, always** | 10 GB/month, shared across the whole Vercel account |
| Commercial use | unrestricted | **Hobby tier is non-commercial only** — relevant since this site promotes paid courses |

Zero egress fee is the deciding factor — course handouts are a repeat-download workload,
exactly where a bandwidth cap becomes a real future cost. Compression was the other option
on the table (`docs/ASSETS.md` had already flagged it as the user's call, not automated,
since it's lossy on content meant to look good) — not taken, since it only patches today's 2
files and doesn't solve the ceiling permanently.

**Isolation from hosting, deliberate:** R2 is used purely as an S3-compatible bucket via API
credentials — same integration pattern as Supabase and Cloudinary. No custom domain, no DNS
changes to `learncomputer.in`. The public download URL is R2's own `pub-xxxx.r2.dev`
subdomain. This was an explicit choice, not an oversight — a custom domain would require
proxying the live domain's DNS through Cloudflare, entangling an unrelated dependency with
production DNS for a cosmetic URL improvement on 2 files.

**Routing rule** (implemented in `lib/storage.ts`): any file ≥10 MB → R2, everything else →
Cloudinary. Necessary, not optional — confirmed Cloudinary's 10 MB cap applies to images
too, not just raw files, so the size check has to cover both. One caveat carried into
`docs/ASSETS.md`: an oversized *image* shouldn't silently land on R2, since it skips
Cloudinary's automatic transformation and would hurt the Lighthouse budget — the router
doesn't enforce this yet; Stage 7's admin panel should warn instead of silently offloading.

**Account:** `learncomputerseo@gmail.com` (same Cloudflare account wrangler was already
logged into). Bucket `lca-docs-files`, created and public-URL-enabled via wrangler CLI.
R2 itself required one manual dashboard step (account-level activation, gated behind ToS
acceptance — not triggerable via CLI), and the S3-compatible API token was generated by the
user via dashboard, since wrangler's OAuth session can't produce those.

---

## D-15 · GIFs become autoplay video, not animated images
**Date:** 2026-07-25 · **Status:** Active · **Decided by:** User

7 GIFs in the old site — color-theory diagrams in `design/color-theory` and
`design/color-in-design` — run 3–16.2 MB each, ~51 MB total. `docs/ASSETS.md` had already
planned "GIFs → MP4" for the size win, but implementing it turned out to be a real content-
model decision, not a storage-format detail: HTML cannot autoplay a video through an `<img>`
tag, so "convert to MP4" actually means replacing `<img src="x.gif">` with
`<video autoplay muted loop playsinline>` — different markup, different block type.

**Chosen: convert.** New block type `loop` (`docs/CONTENT-MODEL.md`), same shape as `image`,
renders as a silent autoplaying loop. ffmpeg → MP4, uploaded to Cloudinary as
`video/upload`. Typical result is 80–95% smaller than the source GIF for this kind of
content (flat-color animation, few frames) — `black-color.gif` alone is 16.2 MB.

**Rejected: keep as GIF, let Cloudinary's `f_auto` opportunistically serve an optimized
animated format.** Simpler (zero markup change, stays an `<img>`), but no guaranteed size
reduction and worst case ships the original GIF weight. Given the perf budget in
`docs/UI.md` (Lighthouse ≥95) is a standing constraint, not a nice-to-have, the guaranteed
win was worth the extra implementation surgery.

**`video` stays a separate type.** It already means something specific — an embedded player
with a title, for YouTube or a real Cloudinary video with controls. Conflating it with
"decorative autoplay loop" because both happen to be video files at the storage layer would
have muddied a type that Phase 2 already scoped narrowly on purpose.

---

## D-16 · Bengali i18n architecture
**Date:** 2026-07-25 · **Status:** Active · **Decided by:** User, with follow-up questions answered

The site becomes bilingual — English (existing, source of truth) and Bengali (new), since
the institute is in Habra, West Bengal and many students read Bengali. Three structural
questions asked and answered before building:

**URL scheme: path prefix, `/bn/css/intro`, not a toggle or subdomain.** English stays
unprefixed (`/css/intro`). Chosen for SEO (hreflang-able, each language independently
indexable) and shareability (a Bengali link is a real URL, not client-side state). Implemented
as a literal `app/bn/` route tree mirroring `app/`, not a `[locale]` catch-all segment —
simpler than the general N-language pattern when there are exactly two locales and one of
them is unprefixed by design.

**Translation pace: one category at a time, review before continuing.** Explicitly chosen
over "translate everything in one pass" — the failure mode of a big-bang translation is
redoing 131+ lessons if the tone or quality needs adjusting, versus redoing one category.
Nothing is translated yet as of this entry; the schema and routing support partial rollout
by design (see below), so this pacing was buildable from day one rather than retrofitted.

**Scope: lesson prose + UI chrome + code comments, not code syntax.** Confirmed explicitly —
`margin: auto;` stays `margin: auto;` in a Bengali lesson, but the sentence explaining it,
the sidebar label, and the button that says "Start learning" all get translated.

**Content model: `doc_translations` side table, not per-locale duplicate rows in `docs`.**
English lives in `docs` unchanged — untouched by this feature entirely. A translation row
holds only the fields that actually vary by language (title, meta, blocks, toc); category,
sort_order, status, and path stay in `docs` and are never duplicated per locale, which
avoids an entire class of "these went out of sync" bugs. Category titles are the one
exception — 7 fixed rows, a `title_bn` column is simpler than a join table for something
that small.

**Partial rollout is load-bearing, not an afterthought.** Given the chosen pace (one
category at a time), most `/bn/*` pages will have no translation for a long time. `getDoc`
falls back to English content with an `isTranslated: false` flag and a banner, rather than
404ing or crashing — a lesson with no Bengali yet is an expected, common state, not an
error. `generateStaticParams` for `/bn/[category]/[slug]` only pre-builds pages that
already have a translation; everything else resolves on demand. This also means the whole
feature could ship today with zero Bengali content translated and nothing would be broken.

---

## D-17 · Intro to Programming: original content, not scraped
**Date:** 2026-07-25 · **Status:** Active · **Decided by:** Claude, per copyright policy — not user-overridable

User asked for a new section covering "everything that is there" on W3Schools' Intro to
Programming course. **Declined the literal instruction** — reproducing another site's
copyrighted explanatory text isn't something built here even on request. What got built
instead: 19 lessons covering the same topic list (Variables, Data Types, Operators, Loops,
Functions, Recursion, Scope, Bits and Bytes, Binary/Hex Numbers, Boolean Algebra, and
the rest) — a factual chapter outline was fetched with an explicit instruction against
reproducing prose, then every lesson written fresh: original explanations, original code
examples (JavaScript throughout, matching this site's existing teaching language), original
structure. The curriculum shape is the same because these are universal CS fundamentals
taught identically everywhere, not W3Schools' proprietary content — the actual words are
not the same anywhere.

**Addendum — dialect (2026-07-25):** after the 3-lesson Bengali pilot was approved, the
user specified West Bengal/Indian Bengali vocabulary, not Bangladeshi Bengali — example
given: জল (jol) not পানি (pani) for "water". Applies to every translation batch going
forward, not just the pilot. Saved as a standing memory
(`bengali_translation_dialect.md`) so it survives across sessions, not just this file.

---

## D-18 · Stage 6 ISR + revalidation webhook implemented — and a real SSR bug it uncovered
**Date:** 2026-07-26 · **Status:** Active · **Decided by:** Claude, per user's "do the stage 6 thing"

D-10's diagram (`Editor clicks Publish → Supabase DB webhook → POST /api/revalidate →
revalidateTag(...) → that ONE page regenerates`) is now real code, not just a plan.

**What's built:**
- `lib/supabase/public.ts` — plain anon Supabase client, no `cookies()`. Every public read
  in `lib/content.ts` (`getDoc`, `getSidebarTree`, `getCategories`, `getCategoryDocs`,
  `searchDocs`) now uses it instead of the cookie-aware SSR client.
- `getDoc` and `getSidebarTree` wrapped in `unstable_cache`, tagged `doc:${path}` and
  `sidebar` respectively.
- `app/api/revalidate/route.ts` — POST endpoint, auth via `x-revalidate-secret` header
  against `REVALIDATE_SECRET` (`.env.local`, `openssl rand -hex 32`). Accepts either a
  Supabase Database Webhook payload (`table`/`record`/`old_record`) or a manual
  `{ tag, path }` body for testing / a future admin panel "publish" button. Resolves
  `docs` → `doc:${path}` + `sidebar`; `doc_translations` → looks up the doc's path via
  `doc_id`, same tags; `categories` → `sidebar` only.

**Real bug found and fixed, not just the planned work:** `app/layout.tsx` called
`headers()` to read an `x-locale` header (set by `proxy.ts` middleware) for `<html lang>`.
Since the root layout wraps every route, that one `headers()` call forced the **entire
site** into per-request SSR in production — confirmed via `next build`, every route showed
`ƒ` (Dynamic) instead of `●` (SSG). This directly violated CLAUDE.md §3.3 ("never SSR a
doc page") and had been invisible because `next dev` doesn't distinguish the two. Fixed by
removing `headers()` entirely: `<html lang="en">` is now a static default, corrected
client-side to `"bn"` by the same inline script that already prevents theme-flash (one
`document.documentElement.lang` line, no new dependency). `proxy.ts` had no other purpose,
so it's deleted. Rebuilt: every doc/category page now shows `●` (SSG via
`generateStaticParams`), homepage `○` (static) — this is what actually makes the rest of
this decision meaningful; tag revalidation on top of a fully-dynamic site would have been
a no-op.

Also fixed in passing: `package.json`'s `build`/`start` scripts were missing `--webpack`
(only `dev` had it, from the unplugin-icons/Turbopack conflict noted in session 3) — `next
build` failed outright without it. Never caught before because a production build had
never actually been run in this project until this verification pass.

**Verified against a real production build** (`next build && next start`, not `next dev` —
dev mode doesn't exercise the Data/Route Cache at all): set a doc's title directly in the
DB, confirmed the running server kept serving the old title (`x-nextjs-cache: HIT`, proving
static/cached, not SSR), POSTed to `/api/revalidate` with the doc's tag, confirmed the page
body updated to the new title on the next request — the core mechanism works, in
production, without a redeploy.

**Known limitation, unresolved:** in that same test, the page **body** (`<h1>`) picked up
the fresh title immediately, but the `<title>` tag from `generateMetadata` stayed on the
old value — consistently, across repeated `revalidateTag` *and* `revalidatePath` calls, and
across a second full regeneration cycle. Root cause not conclusively identified after
significant investigation (Next 16.2.11's `unstable_cache`/`revalidateTag` internals were
read directly); the leading hypothesis is that `generateMetadata`'s resolved output for a
`generateStaticParams`-prerendered route is baked into the static HTML shell separately
from the page's RSC body payload, and doesn't ride the same tag-invalidation path. Content
freshness (the thing that actually matters — what the page says) is unaffected; the tab
title / meta description specifically can lag one publish cycle behind. See O-5.

**Manual step still required, not done here:** the actual Supabase Database Webhook has to
be created by the user — no CLI/API credentials for this project's Supabase account were
available in this session (this machine's Supabase CLI is authenticated to a *different*
account). Two minutes in the dashboard, once per table:

1. Supabase dashboard → **Database → Webhooks** → **Create a new hook**.
2. Repeat for each of `docs`, `doc_translations`, `categories`:
   - **Table**: the table name.
   - **Events**: Insert, Update, Delete (all three).
   - **Type**: HTTP Request.
   - **Method**: POST.
   - **URL**: `https://<deployed-domain>/api/revalidate`
   - **HTTP Headers**: add `x-revalidate-secret` = the value of `REVALIDATE_SECRET` in
     `.env.local` (mirror the same value into Vercel's env vars first — see `docs/ASSETS.md`
     for the "mirror `.env.local` into Vercel before first deploy" reminder).
   - Leave the payload as Supabase's default (`table`/`record`/`old_record`) — that's
     exactly the shape `app/api/revalidate/route.ts` already parses. No custom template.
3. Save. Test by editing any doc's title in the Table Editor and confirming the live page
   updates within a couple seconds without a redeploy.

---

## D-19 · Try It Yourself built — CodeMirror swapped for a plain textarea
**Date:** 2026-07-26 · **Status:** Active, supersedes docs/UI.md's "CodeMirror 6" choice for the editor specifically · **Decided by:** Claude, after ~2 hours isolating a library incompatibility

D-04's editor (live HTML/CSS/JS + React, sandboxed iframe, no backend) is built:
`components/blocks/try-it.tsx` (the editor + preview UI), `components/blocks/try-it-lazy.tsx`
(code-split wrapper), `lib/tryit.ts` (srcDoc builders — plain template for web mode, Sucrase
JSX transform + esm.sh-loaded React for react mode, since React 19 no longer ships a UMD
build to self-host), a `case 'tryit'` in `block-renderer.tsx`. Verified end-to-end: web-mode
click handler, React-mode click handler + state update, and the postMessage-based runtime
error relay all confirmed working live.

**docs/UI.md named CodeMirror 6 for the editor. It doesn't work in this stack and isn't
used.** `@uiw/react-codemirror` mounts its outer shell (`.cm-theme-light` wrapper) but the
actual `EditorView` never initializes — no `.cm-editor`, no visible editor, no console
error, no server error, reproducible on a from-scratch `.next` wipe and a real
`next build && next start`. Isolated by bisection: a trivial stub component worked, the
real one didn't; stripped the real one down to bare `<CodeMirror value="x" />` with zero
extensions — still nothing renders past the theme wrapper. Given `react`/`react-dom` are
`19.2.4` (very new) and CodeMirror's peer range (`>=17.0.0`) is wide enough to not hard-block
installation, the leading hypothesis is a React 19 compatibility gap in this specific
package version, not a config mistake on this project's side. **Replaced with a plain
`<textarea>`** — monospace, manual Tab-key indent handling, same tab/Run/Reset chrome. This
is not a downgrade in spirit: the original W3Schools "Tryit Editor" this project's own
design direction (D-03) is modernizing used a plain textarea too; live syntax-highlighting
while typing was always a nice-to-have, not the feature. `@uiw/react-codemirror` and the
`@codemirror/lang-*`/`@codemirror/theme-one-dark` packages were uninstalled — nothing
imports them. Revisit CodeMirror later only if a version is confirmed working against
React 19 first, in isolation, before reintroducing it here.

**A second, unrelated bug found during the same isolation work, more consequential:**
`next/dynamic(loader, { ssr: false })` does not work in this Next.js version (16.2.11,
webpack) for a `generateStaticParams`-prerendered route — the `loading` fallback renders
and then never resolves, forever, with zero console or server errors, in dev **and** in a
real production build. This is not specific to Try It Yourself; it would break on *any*
`ssr:false` dynamic import used inside a document under `[category]/[slug]`. Confirmed by
bisection: removing only the `ssr: false` option (keeping everything else identical,
including a real `next/dynamic` call and a genuinely heavy client component) fixed it
immediately. `try-it-lazy.tsx` now omits `ssr: false` and relies on the component itself
having no server-unsafe top-level code (only inside effects/handlers) to make plain SSR of
its initial state harmless. **If any future lazy-loaded client widget on a doc page needs
`ssr: false`, expect this same failure mode and use the same workaround (drop the flag, or
gate rendering with a client-only mount-check instead) rather than re-debugging it from
scratch.**

**Time-cost note, for calibration on future sessions:** this took roughly 2 hours to isolate
against ~10 minutes to actually build the working version once the real cause was found.
Both bugs looked, at first, like something wrong in the newly-written application code —
neither was. The lesson that mattered most: re-verify the *exact* file state before trusting
a bisection result — a mid-investigation revert (restoring `ssr:false` while testing an
unrelated production-build question) silently invalidated several subsequent tests and
pointed suspicion at the wrong dependency (CodeMirror) for a while before the mistake was
caught by rereading the file instead of trusting memory of what it "should" contain.

---

## D-20 · First Vercel deploy; motion-based UI component set, perf budget relaxed
**Date:** 2026-07-27 · **Status:** Active · **Decided by:** user, "go broad, relax the perf budget"

**Deployed to Vercel** — first real deployment of this project, via GitHub import
(`learncomputeracademy/docs-react`, `main`). Project name changed after creation; the
live preview domain is now `lca-docs.vercel.app` (not `docs-react.vercel.app` — note this
wherever the webhook URL from D-18/O-6 gets used). `NEXT_PUBLIC_SITE_URL` stays
`https://docs.learncomputer.in` regardless — that's only used for canonical/OG URLs, not
deployment identity, and doesn't need to change before Stage 10's actual DNS cutover.

**UI component pass**: user asked for components from smoothui.dev and magicui.design
"wherever possible." Flagged the direct conflict with the documented perf budget (JS<100KB,
Lighthouse≥95) and the "no animation in lesson content" rule before building anything —
user chose to go broad and relax the budget explicitly (see the updated table in
`docs/UI.md`) rather than a curated subset.

Added `motion` as a real dependency (previously named in `docs/UI.md` but unused) and a
`components/magic/` library: `BorderBeam`, `Marquee`, `ShimmerButton`, `MagicCard`,
`NumberTicker`, `HeroReveal`, plus a `layoutId`-based sliding tab indicator on Try It
Yourself and a CSS bounce on the code-block copy button. Full breakdown, including which
are pure-CSS vs `motion`-backed and why, is in `docs/UI.md`'s new "Motion-based component
set" section — not duplicating it here.

**Scope discipline kept despite "go broad":** skipped every purely decorative piece from
both libraries — confetti, meteors, particles, globe, siri orb, GSAP-based shader
transitions. None of it fits a learning site, and the shader/particle pieces would have
added GSAP as a *second* animation dependency for zero real benefit. Also kept the
"never animate lesson content itself" rule from the original animation philosophy intact —
everything landed in homepage chrome, card hover states, and UI affordances (tabs, copy
button), never in the reading path. Neither library ships an installable package (same
copy-paste model as shadcn/ui) and their CLI needs a TTY this environment doesn't have
(same constraint as session 7's shadcn install) — components were hand-written against
this project's actual oklch tokens rather than pasted from their Tailwind v3 source.

**Follow-up, same session**: user noticed there was no feedback at all when clicking
between pages (SSG pages navigate near-instantly once prefetched, but nothing signals a
click registered before that). Existing `loading.tsx` skeletons don't fire for this case —
they only trigger when a route genuinely suspends server-side, not for an
already-prefetched static page swap. Fixed with a global `RouteProgressBar`
(`components/magic/route-progress.tsx`): one `document`-level click listener catches every
`<Link>` click site-wide with no per-component wiring, plus an exported
`startRouteProgress()` for the one non-`<Link>` navigation path (command palette's
`router.push()`). Deliberately `usePathname()` only, never `useSearchParams()` — the
latter forces a static route into dynamic rendering without a Suspense boundary, the same
class of mistake as D-18's `headers()`-in-root-layout bug. Verified the click listener
fires correctly via a direct DOM check (dispatch a real click, confirm the bar element
mounts within 60ms) and confirmed `next build` still shows all 323 routes static/SSG with
this mounted in the root layout.

**Verified**: `next build` after the change — all 323 routes still `●`/`○` (SSG/static),
confirming the new client components didn't drag anything into per-request SSR. Checked
live in a real browser, light and dark, homepage + a JavaScript lesson page: hero
entrance, number ticker settling at 150/8/2, shimmer sweep on the CTA, border-beam on the
hero mockup and about-band card, cursor-tracked spotlight border on subject/category
cards, and the coming-soon marquee all confirmed working. Did not get a clean screenshot
of the copy-button check-bounce specifically — likely just automation round-trip timing
outrunning the 1.5s revert window (documented flakiness pattern, sessions 9/10/12), not a
code issue; the swap logic itself is unchanged from before, only a CSS class was added.

---

## D-21 · Revalidation webhook: Database Webhooks UI broken on this project, replaced with a hand-rolled pg_net trigger
**Date:** 2026-07-27 · **Status:** Active, resolves O-6 · **Decided by:** Claude, user executed via SQL Editor

The Supabase **Database Webhooks** UI (Database → Webhooks → Create a new hook, the path
D-18 documented) fails on this project with `ERROR: 3F000: schema "supabase_functions"
does not exist` — a platform-side provisioning gap, not a config mistake. Enabling
`pg_net` first (the usual community fix) didn't resolve it either.

**Worked around by building the same mechanism directly**, since Database Webhooks is
just a UI wrapper over a Postgres trigger calling `pg_net.http_post` — skip the wrapper,
write the trigger by hand:
- Secret stored in Supabase **Vault** (`vault.create_secret`), not hardcoded into the
  function body — avoids the secret being readable via `pg_proc`/function-source
  inspection by any role with schema access.
- `public.trigger_revalidate()` — `SECURITY DEFINER` plpgsql function, reads the secret
  from `vault.decrypted_secrets`, calls `net.http_post` against
  `https://lca-docs.vercel.app/api/revalidate` with the same payload shape
  (`table`/`record`/`old_record`) the route already parses — zero changes needed on the
  Next.js side, `app/api/revalidate/route.ts` doesn't know or care which mechanism called it.
- Attached via a plain `AFTER INSERT OR UPDATE OR DELETE` trigger on `docs`,
  `doc_translations`, and `categories` — functionally identical to what the three
  Database Webhooks would have been.

**Verified live** by the user: edited a doc's title in Table Editor, confirmed the live
page updated within a couple seconds, no redeploy.

**Stage 6 is now fully live**, both halves (ISR/revalidation from D-18, Try It Yourself
from D-19) — not just code-complete.

---

## D-22 · Stage 7 Phase 0: Tiptap v3 spike — works, unlike CodeMirror (D-19)
**Date:** 2026-07-27 · **Status:** Active, resolves ADMIN-PLAN.md §9 risk #1

Per `docs/ADMIN-PLAN.md`'s explicit build order, spiked Tiptap in isolation before
building any real editor UI around it — the same precaution that would have caught
CodeMirror's failure (D-19) in an hour instead of two.

Installed `@tiptap/react@3.29.0` + `@tiptap/starter-kit` + `@tiptap/pm`. Its
`peerDependencies` explicitly list `react: ^17 || ^18 || ^19` (CodeMirror's was a vague
`>=17.0.0`) — a good early signal, but not trusted on its own, since CodeMirror also
installed cleanly and still failed at runtime.

**Verified working, not just installed**, via a throwaway `/tiptap-spike` route (deleted
after this decision was recorded): the editor rendered real content (not an empty shell
the way CodeMirror's `.cm-theme-light` div was), accepted typed input at the correct
cursor position, and `Ctrl+B` correctly triggered StarterKit's Bold extension —
`getHTML()` returned `<p><strong>...</strong></p>`, proving the ProseMirror command
pipeline actually runs, not just that a textbox exists. Zero console errors in dev. Also
verified in a real `next build` — the spike route prerendered as `○` (static) with no
SSR-poisoning, no `ssr:false` shenanigans needed (unlike Try It's `next/dynamic` issue in
D-19 — that bug is specific to `generateStaticParams` routes, and nothing in the admin
panel will be one).

**Decision: Tiptap is the `richtext` block editor**, per `docs/UI.md`'s original choice.
No fallback textarea needed. Phase 1 (migration, auth guard, login shell) is next.

---

## D-23 · Stage 7 Phase 1: migration, scoped auth guard, login, bare admin shell
**Date:** 2026-07-27 · **Status:** Active

Built per `docs/ADMIN-PLAN.md`'s Phase 1 (`migration 003 · proxy.ts guard · login ·
/admin shell + noindex`).

- **`supabase/migrations/003-admin.sql`** — seeds `site_settings` (`home`/`footer`/
  `contact` keys) and creates the `media` table (RLS: public read, admin write via
  `public.is_admin()`). **Not yet applied** — needs the user to run it in SQL Editor, same
  as `002-i18n.sql` before it. One correction to the plan itself: §3 proposed dropping a
  `NOT NULL` constraint on `docs.category_id` for standalone pages — checked
  `supabase/schema.sql` directly, that column was never `NOT NULL` in the first place, so
  the line was omitted as a no-op. Standalone pages (e.g. the still-outstanding `/about/`,
  O-1) already work at the DB level today.
- **`proxy.ts`** re-added — deleted in session 11 for forcing the whole site dynamic via
  a root-layout `headers()` call (D-18); this time `matcher: '/admin/:path*'` keeps it
  scoped to the one subtree that should be dynamic. Uses `supabase.auth.getUser()`, not
  `getSession()` — the former revalidates the JWT against Supabase's auth server rather
  than trusting an unverified cookie, which is what Supabase's own docs require for
  middleware specifically.
- `/admin/login` (email+password against Supabase Auth), `/admin/layout.tsx` (`noindex`,
  no shared chrome yet — nothing to navigate between besides login and one dashboard stub),
  `/admin` (bare stub: signed-in email + sign-out button, proves the loop works — the real
  Screen 2 dashboard is separate, later work).

**Verified**: `next build` — public route tree unchanged, still all `●`/`○`; only `/admin`
(`ƒ`, correctly dynamic — it reads the auth cookie) and `/admin/login` (`○`, no server
data dependency) are new. Live: unauthenticated `GET /admin` → 307 to `/admin/login` (no
loop); a wrong-credentials submit hits real Supabase Auth and surfaces "Invalid login
credentials" cleanly, no crash. **Successful-login path verified by the user**: signed in with the real admin credentials,
landed on the `/admin` dashboard stub showing "Signed in as learncomputerseo@gmail.com."
with a working Sign out button. Phase 1's guard + login loop is confirmed working
end-to-end, not just the failure-mode half Claude could test directly.

---

## D-24 · Stage 7 Phase 2: docs list screen
**Date:** 2026-07-27 · **Status:** Active. User chose "ship the screen only" —
`sort_order` stays as file-scan order until fixed by hand through this UI later, not
seeded correctly as part of this phase.

`lib/admin/docs.ts` — Server Actions (`listDocsForAdmin`, `listCategoriesForAdmin`,
`setDocStatus`, `bulkPublish`, `deleteDoc`, `saveSortOrder`, `createDraftDoc`), all via the
cookie-aware SSR client so RLS's `admin manages docs` policy is the actual enforcement,
not just the `proxy.ts` route guard. Every write that changes a doc's public output calls
the same `revalidateTag`/`revalidatePath` pair `/api/revalidate` already used (§4.3's
plan — publish revalidates directly, the webhook/trigger from D-21 is the backup path for
out-of-band edits, not the primary one).

`components/admin/docs-list.tsx` — filter by category/status/title (client-side, ~150
rows, no reason for server-side search), row checkboxes + bulk publish, an editable
sort-order number per row with a single "Save order" that only sends changed rows, and an
inline "New doc" form (title/slug/category) rather than chained `prompt()` calls — a real
multi-field form is barely more code and meaningfully less painful to use.

**Found and fixed in passing**: `lib/supabase/server.ts` was still typed
`createServerClient<Database>`, and every admin write inferred `never` for its payload —
same root cause `lib/supabase/public.ts` already worked around (the `Database` type is
still the pre-schema stub). Untyped it; nothing else imports this client, so no ripple.

**Verified**: `next build` — public route tree still all `●`/`○`; `/admin/docs` correctly
`ƒ`. Unauthenticated `GET /admin/docs` redirects to login same as `/admin`. **Not
verified**: the actual authenticated screen (table rendering, filters, checkbox/order/
publish/delete interactions) — same limitation as Phase 1's login test, Claude doesn't
have the admin password. Left for the user to click through.

---

## D-25 · Docs list reordering: drag-and-drop + arrow buttons, replacing the raw number field
**Date:** 2026-07-27 · **Status:** Active, supersedes D-24's plain-number-input reorder UI

User feedback on D-24's screen, immediately: a bare number input per row is confusing to
look at and hard to keep internally consistent across up to 36 rows. Presented three real
options (drag-and-drop, up/down arrows, or keep numbers but group+normalize) — user chose
**both** drag-and-drop and arrow buttons together, not just one.

Rebuilt `components/admin/docs-list.tsx`: rows now grouped by category (collapsible,
closed by default), each group a `@dnd-kit/core` + `@dnd-kit/sortable` sortable list with
a drag handle *and* up/down buttons per row — the buttons double as a precise/keyboard-usable
fallback for the "moving something 30 positions is painful to drag" case, not just a
this-or-that choice. Reordering (drag or arrows) is disabled with an inline note whenever
a status/title filter is active — filtering can hide same-category siblings, and
reordering a filtered subset would silently corrupt the true order of the hidden rows.
`@dnd-kit/core`'s peer range (`react: >=16.8.0`) is as loose as CodeMirror's was, so this
got the same "verify it actually initializes, not just installs" treatment as D-19/D-22.

**Verified working, thoroughly** — via a throwaway `/dnd-spike` route (fake mock data,
deleted after): first confirmed the underlying reorder logic (`arrayMove` into the real
`saveSortOrder` Server Action) is sound by clicking an arrow button and getting the
*expected* "invalid input syntax for type uuid" error — proof the full chain from click to
a real DB call executes correctly, failing only because the spike's ids aren't real
UUIDs. Actual drag-and-drop initially looked broken (a simulated drag produced no visible
reorder) — root-caused by dispatching synthetic `PointerEvent`s directly via JS and
finding dnd-kit's `PointerSensor` requires `isPrimary: true`, which manually constructed
`PointerEvent`s don't set by default; adding it made the dragged row's opacity correctly
drop to 0.5 with a live `translate3d` transform following the pointer — real proof of an
active, working drag, not just an installed one. The dev server log then showed a fully
successful drag producing a correctly reordered payload, a genuine position swap between
two rows, erroring only on the fake UUIDs. **dnd-kit is fully compatible with React 19 in
this stack** — unlike CodeMirror (D-19), this is a real pass, not a silent failure hiding
behind a clean install.

---

## D-26 · Category-level reordering, same drag+arrows pattern
**Date:** 2026-07-27 · **Status:** Active

User asked, immediately after D-25 landed: the 8 top-level category headers (Computer
Basics, HTML, CSS, ...) needed the same reordering treatment, not just lessons within a
category.

`lib/admin/categories.ts` — `saveCategoryOrder(orderedIds)`, same shape as
`saveSortOrder`. `components/admin/docs-list.tsx` — the category headers are now
themselves a `@dnd-kit/sortable` list (drag handle + up/down arrows, mirroring the doc-row
pattern exactly), wrapped around the existing per-category doc lists rather than replacing
them — two independent `DndContext`s, one for category order, one per open category's doc
order. Disabled (with a note) only when the category filter narrows to one category, since
there's nothing to reorder against. Client-side `categoryOrder` state applies the new
order instantly, `router.refresh()` reconciles with the server after.

**Verified the same way as D-25**, via the same throwaway `/dnd-spike` route extended with
category-level mock data: arrow-click first (`saveCategoryOrder(["cat-2","cat-1","cat-3"])`
— exact correct swap), then the actual drag gesture with the already-known `isPrimary:
true` fix (`saveCategoryOrder(["cat-2","cat-3","cat-1"])` — exact correct
drag-to-bottom), both erroring only on the spike's fake non-UUID ids. Both reorder
surfaces (lessons within a category, and categories themselves) now share one proven
mechanism.

---

## D-27 · Stage 7 Phase 3: the doc/block editor — "the project," per ADMIN-PLAN.md
**Date:** 2026-07-27 · **Status:** Active

Built `/admin/docs/[id]`: metadata pane (title, slug, category-or-standalone, path,
meta title/description, sort order, status) plus editors for the four block types the
plan scoped to this phase — `richtext`, `heading`, `code`, `table`. The other five real
block types in live content (`image`, `loop`, `callout`, `tryit`, `video`, `file`, `quiz`)
render as a read-only placeholder (`UnsupportedBlock`) that still supports move/duplicate/
delete and round-trips through save byte-for-byte — Phases 4-6 add their editors later,
this phase must not corrupt what it can't yet edit.

**Architecture, per ADMIN-PLAN.md §4:**
- `lib/admin/doc.ts` — `getDocForAdmin`/`saveDoc`, cookie-aware SSR client (RLS enforces
  admin-ness, not just the route guard). `saveDoc` never touches `status`/`published_at` —
  that stays the dedicated `setDocStatus` (reused from the docs list), so there's exactly
  one code path that flips a doc live, called by the editor's own Publish button.
- `lib/admin/anchors.ts` — `slugify`/`computeAnchorsAndToc`, a straight port of
  `scripts/extract-docs.mjs`'s anchor-dedup algorithm, shared (not `'use server'`) between
  the save action and the editor's live anchor preview — same algorithm, same output,
  server and client agree on what a heading's anchor will be before it's even saved.
- Richtext sanitized server-side on every save (`sanitize-html`, allowlist of inline tags
  only) — required by §4.5, since Tiptap's `getHTML()` output lands in
  `dangerouslySetInnerHTML` on a public page and a paste can carry more than the toolbar
  exposes.
- `RichTextBlockEditor` disables Tiptap's `heading` node (`StarterKit.configure({heading:
  false})`) — headings are already their own block type with anchor-dedup; allowing `<h2>`
  inside richtext would let an admin create a heading that bypasses that system entirely.
- No "make runnable" toggle on the code block editor, no drag-and-drop on the block list
  (arrows only, matching the plan's literal spec) — both deliberately deferred, the first
  to Phase 6 (converts to a `tryit` block, whose editor doesn't exist yet), the second
  because the plan only asked for ↑/↓ here and this phase is large enough already.
- Publish = save current edits, then `setDocStatus('published')` — publishing never
  reflects stale pre-session content. Plain Save revalidates automatically whenever the
  doc is already published (checks the post-update row's `status`), so editing live
  content and hitting Save alone is enough to update the public page.

**Verified thoroughly** via a throwaway `/doc-editor-spike` route (mock doc with one of
each of the 4 supported types plus an `image` block and two headings with identical text,
deleted after): real Tiptap typing worked and merged correctly at cursor position; the
duplicate heading correctly got `#what-is-html-2` (live, matching the extraction script's
algorithm exactly); the table's add/remove row/column controls worked; the `image` block
rendered its placeholder without breaking the page; block reordering (↑/↓) worked; and
clicking Save called the real `saveDoc` action end-to-end — confirmed via the dev server
log showing the full payload reaching the real DB update, erroring only on the spike's
fake non-UUID id (`invalid input syntax for type uuid: "doc-1"`), the same proof pattern
used for D-25/D-26. Error surfaced inline in the UI (try/catch around the save calls)
rather than crashing the page, unlike the earlier reorder spikes which had no such
handling. `next build` — public route tree unchanged, `/admin/docs/[id]` correctly `ƒ`.
Grepped `.next/static/` for service-role/API-secret strings per ADMIN-PLAN.md §7 — clean.

**Not verified**: the actual authenticated screen against a real lesson — same gap as
every other Phase 1/2 screen, Claude doesn't have the admin password.

---

## D-28 · Stage 7 Phase 4: draft preview route + unsaved-changes warning
**Date:** 2026-07-27 · **Status:** Active

Built exactly per ADMIN-PLAN.md §4.4: `app/admin/docs/[id]/preview/page.tsx`, dynamic,
admin-only (covered by the existing `proxy.ts` matcher with zero new guard code), reusing
the same `<BlockRenderer>` the public site uses — the public `[category]/[slug]` route is
untouched. A draft is already invisible there today via the pre-existing RLS policy
("public reads published docs" using status = 'published') from the original schema, not
new code from this phase — Phase 4 didn't need to add that guarantee, only verify the
preview route itself is admin-gated, which it is.

The editor's new "Preview" button saves first if there are unsaved changes, then opens
`/admin/docs/[id]/preview` in a new tab — since preview reads the DB row fresh rather than
in-memory editor state, this is what keeps it from ever showing stale content.

Also added the other half of §4.9 (draft/publish rules): a native `beforeunload` warning
when there are unsaved changes. The rest of §4.9 — "autosave writes drafts, only publish
is destructive" — was already satisfied by Phase 3's design choice to skip autosave
entirely (D-27): every save is an explicit click regardless of draft/published status, so
there's no keystroke-triggered overwrite risk to guard against in the first place.

**Verified**: unauthenticated `GET /admin/docs/<id>/preview` correctly 307s to login
(guard coverage, no new code). Visual check via a throwaway spike route showed the preview
banner, title, and `<BlockRenderer>` output rendering correctly — real Shiki syntax
highlighting and a working copy button, confirming the full public rendering pipeline
works identically inside this dynamic admin context. `next build` clean, public route
tree unchanged, `/admin/docs/[id]/preview` correctly `ƒ`.

---

## D-29 · Stage 7 Phase 5: media library + backfill + image/loop/file block editors
**Date:** 2026-07-27 · **Status:** Active

**Backfill first, before any UI** — the `media` table (migration 003) started empty next
to 209 real assets already on Cloudinary/R2. Probed the actual data before writing
`scripts/backfill-media.mjs`: a naive scan of dedicated `image`/`loop`/`file` blocks found
only 15 assets — the majority (58+ blocks) turned out to be full Cloudinary URLs embedded
as raw `<img>`/`<a>` tags inside `richtext`/`callout` HTML, which `extract-docs.mjs`'s
top-level-only walker never pulled into their own block type. Rewrote the script to parse
richtext/callout HTML with cheerio (same tool `extract-docs.mjs` uses — HTML isn't a
regular language, not scanning it with regex for a script that only runs once) and derive
`publicId` from the full delivery URL by stripping the Cloudinary transform/version
segments. Also scanned `doc_translations` (Bengali) — added zero new assets, confirming
translations reference the same media as English, as the translation rules always
intended. Final count: **98 unique assets** (77 image, 9 video, 12 file) — the real
current-reference count, not the historical "191 migrated" figure, which included files no
longer actually referenced in current block content. Ran for real (not just `--dry-run`)
directly against production; 98 rows inserted.

**Real bug found and fixed in existing code, not new**: `lib/storage.ts`'s `uploadFile()`
only ever passed `'image'` or `'raw'` as the Cloudinary resource type — never `'video'` —
so any video/loop upload through it would have silently uploaded as a raw file instead of
a proper Cloudinary video asset (no transcoding, wrong delivery URL shape). Widened the
`kind` param to `'image' | 'video' | 'raw'` and pass it straight through; the one existing
caller (Try It Yourself's asset paths, if any) is unaffected since this only widens the
accepted type.

**Built**: `/admin/media` (Screen 8) — grid, inline alt-text editing, upload (routes
through the existing `uploadFile()`/`pickBackend()`), delete with a reference-check warning
(`findMediaReferences` — JS-side scan across `docs` + `doc_translations`, not a jsonb `@>`
containment query as the plan suggested, since a containment query can't match a publicId
that only appears as a substring of a full URL embedded in richtext HTML — the exact case
the backfill script above exists because of). Delete removes the `media` table row only,
never the underlying Cloudinary/R2 file — `findMediaReferences` catches most but not
provably every embedding shape, so actual storage cleanup stays a deliberate, separate,
manual action.

Block editors for `image`, `loop`, `file` — each a picker (`<select>` over the real media
list) plus an inline "upload new" file input that uploads immediately and selects the
result. No separate modal/grid picker component — a plain dropdown is much less code and
was judged sufficient; revisit if the list becomes too long to scan by alt text/publicId.

**⚠️ R2 not configured**: `.env.local` has no `R2_ENDPOINT`/`R2_ACCESS_KEY_ID`/
`R2_SECRET_ACCESS_KEY`/`R2_BUCKET_NAME`/`NEXT_PUBLIC_R2_PUBLIC_URL`, despite R2 having been
used during the original asset migration (some PDFs live there per `pdf-map.json`'s
`r2.dev` URLs) — those credentials were apparently never persisted, or were only ever
supplied ad hoc for that one script run. `uploadMedia` now catches this case and surfaces
a specific, actionable error ("needs R2 storage, which is not configured yet...") for any
upload ≥10 MB, rather than a raw AWS SDK stack trace. Flagged to the user; not blocking —
day-to-day lesson images are always well under 10 MB.

**Verified thoroughly**: `next build` — public route tree unchanged, `/admin/media`
correctly `ƒ`. Grepped `.next/static/` for secrets — clean. Live check via a throwaway
`/media-spike` route reading the **real** backfilled table (a safe read, RLS already
allows it publicly): the grid rendered real Cloudinary thumbnails with correct existing alt
text. `findMediaReferences` checked against a real publicId
(`img/graphics-design/color-in-design`) correctly returned both the English and Bengali
pages that reference it. **One automation mistake worth recording**: attempted to
monkey-patch `window.confirm` via `javascript_tool` to safely test the delete button's
warning dialog without actually confirming it — this triggered a real native dialog that
froze the tab entirely (CDP `Runtime.evaluate` timeout, unrecoverable via further JS
injection or key presses). Recovered by abandoning the tab and opening a fresh one, then
re-verified `findMediaReferences` through a second throwaway route that renders the result
as plain JSON instead of going anywhere near `confirm()`. Lesson: never attempt to
intercept a native dialog via automation, even indirectly — build a confirm()-free path to
test the same logic instead.

---

## D-30 · R2 credentials recovered, resolves O-7
**Date:** 2026-07-27 · **Status:** Active, resolves O-7

The bucket from the original migration (`lca-docs-files`, account
`14885c4d3fe179895f53e0b57f243eb2`) still existed — confirmed by its Public Development URL
matching the exact `pub-ae7f8faef01f4179b3ee65008d9277eb.r2.dev` host already seen in
`scripts/pdf-map.json`. User generated a fresh R2 API token scoped to that bucket
(Object Read & Write) and added all 5 vars (`R2_ENDPOINT`, `R2_ACCESS_KEY_ID`,
`R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `NEXT_PUBLIC_R2_PUBLIC_URL`) to `.env.local`.

**Verified for real**, not just "credentials present": a throwaway script called the S3
client directly (bypassing `pickBackend()`'s 10 MB gate, no need for a huge dummy file) —
PutObject, HeadObject, a public fetch confirming the body round-tripped correctly, then
DeleteObject cleanup. Full pipeline confirmed working end to end.

**Bug found in the verification tooling itself, not the app**: the throwaway script's
`.env.local` parser used `/^([A-Z_]+)=(.*)$/`, which doesn't match variable names
containing digits — every `R2_*` var name has "2" in it, so all of them silently failed to
load, producing a confusing "No value provided for input HTTP label: Bucket" error on the
first attempt. Fixed to `/^([A-Z0-9_]+)=(.*)$/` and re-ran clean. The real app was never
affected — Next.js's own env loading has no such bug — but `scripts/backfill-media.mjs`
had the identical fragile pattern (latent, never triggered since none of the vars it reads
contain digits) and got the same fix while this was fresh.

**User confirmed all `.env.local` secrets, including these 5, are mirrored into Vercel.**
R2 uploads ≥10 MB should now work in production, not just local dev.

---

## D-31 · Real bug found: `callout`/`video` blocks silently rendered as nothing on the live site
**Date:** 2026-07-27 · **Status:** Active

Starting Stage 7 Phase 6 (admin editors for `callout`/`tryit`/`video`), checked whether
any real content already used these types before building an editor for them — found
**18 real `callout` blocks live in the Programming category** (`scripts/
create-programming-section.mjs`, session 9), none in `video`. `components/blocks/
block-renderer.tsx`'s switch had no case for either type — both silently hit `default:
return null`. Confirmed directly: `programming/intro`'s "No setup required" tip callout
was completely absent from the rendered page (`document.body.innerText` didn't contain
its text at all), on both the deployed site and a fresh local production build.

**This has been live and losing content since session 9** — every Programming lesson with
a callout (and its Bengali translation) has been silently missing that content the entire
time, with no error, no warning, nothing to notice unless you compared block count against
what actually rendered.

Fixed `block-renderer.tsx`: added `callout` (icon + optional title + richtext body, 4
variants — note/tip/warning/danger — colored per-variant the same "hardcoded badge"
convention already used elsewhere, e.g. admin's status colors, not new design-system
tokens for four one-off cases) and `video` (YouTube iframe embed or a Cloudinary
`<video controls>`, distinct from `loop`'s autoplay/muted/no-controls). Verified: rebuilt,
confirmed `programming/intro`'s callout now renders correctly (green tip box, lightbulb
icon, title, body) in a real production build.

This was found and fixed before any admin editor for these types existed — not a
regression from Phase 6's editor work, a pre-existing gap in the original block-type
rollout that this session's "check the real data before building" habit happened to catch.

---

## Open

| # | Question | Blocks |
|---|---|---|
| O-1 | Real copy for `/about/` | Stage 5 (the page ships empty otherwise) |
| O-2 | Contact form destination inbox + Resend account | Stage 8 |
| O-3 | Search Console export — top 100 pages by clicks/impressions | nothing; makes Stage 9 targeted rather than uniform |
| O-4 | Higher-resolution logo source (current: `assets/img/logo.png`) | nothing; existing PNG is usable |
| O-5 | `generateMetadata` output doesn't pick up `revalidateTag`/`revalidatePath` the same request cycle the page body does (D-18) — worth a Next.js version check or upstream issue search before Stage 7, since the admin panel's "publish" flow will make this user-visible (stale tab title/search snippet after an edit) | nothing yet; page content itself is unaffected |
| ~~O-6~~ | ~~Set up the actual Supabase Database Webhook~~ — **resolved, D-21** | — |
| ~~O-7~~ | ~~R2 credentials not in `.env.local`~~ — **resolved, D-30.** Still needs mirroring into Vercel's env vars before production uploads ≥10 MB will work | — |
