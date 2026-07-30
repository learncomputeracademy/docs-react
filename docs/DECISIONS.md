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

## D-32 · Stage 7 Phase 6: remaining block editors — callout, video, tryit
**Date:** 2026-07-27 · **Status:** Active. Last of ADMIN-PLAN.md's "editable block types"
work — every block type with real rows now has an editor except `quiz` (zero rows,
deliberately deferred per CONTENT-MODEL.md).

Built after fixing D-31 (the public renderer never had cases for these two types at all).

- `CalloutBlockEditor` — variant select (note/tip/warning/danger) + optional title +
  **reuses `RichTextBlockEditor`** for the body rather than a second HTML editor
  implementation.
- `VideoBlockEditor` — provider select (youtube/cloudinary) + video ID + title. Plain
  fields, no picker — unlike image/loop/file, a video's "ID" is either a YouTube ID or a
  Cloudinary publicId typed by hand, not something the media library indexes.
- `TryItBlockEditor` — mode select + per-file tabs + a live sandboxed-iframe preview via
  the exact same `lib/tryit.ts` `buildWebDoc`/`buildReactDoc` functions the public site
  uses. **Deliberately not the public `TryIt` component** (`components/blocks/try-it.tsx`)
  — that one's "Reset" restores its own original `files` prop, built for a reader
  experimenting with saved content, not an admin editing that content and needing the
  result back out to a parent's state.

**Verified**: `next build` clean, public route tree unchanged. Live spike (mock callout/
video/tryit blocks): all three render with correct existing content loaded, the Tiptap
toolbar works inside the reused richtext editor, and clicking Run on the tryit block
correctly rebuilt the sandboxed iframe (visually confirmed the button appeared with the
right label). **One verification gap, structural not a bug**: couldn't confirm an actual
click *inside* the sandboxed iframe registers via browser automation — `sandbox=
"allow-scripts"` without `allow-same-origin` (a deliberate security choice) makes the
iframe's contents genuinely invisible to both JS (`contentDocument` blocked, cross-origin)
and the accessibility tree (`find` only resolved the iframe itself, opaque boundary) — not
something this tooling can reach by design, not evidence of anything broken. The
underlying mechanism is byte-identical to the public `TryIt` component, which was already
extensively verified with real click interactivity (both modes) in session 12.

---

## D-33 · Stage 7 Phase 7: the Bengali translation editor
**Date:** 2026-07-27 · **Status:** Active

Built `/admin/docs/[id]/bn` per ADMIN-PLAN.md §5 Screen 5. Two columns, aligned by block
`id` — English read-only on the left, Bengali editable on the right — which is the whole
feature: it's what makes a partial translation visually obvious instead of a silent gap,
the exact class of bug session 9 caught by hand (a table's row labels left in English).

- **Only `richtext`/`heading`/`table`/`callout` are translatable.** Everything else
  (`code`, `image`, `loop`, `file`, `video`, `tryit`, `quiz`) shows "stays identical to
  English, not translated here" — `code` because the project's own translation rule
  requires byte-identical code across locales, the rest because they have no natural
  translated content today (a future enhancement could open up alt-text/title fields, not
  built now).
- **Anchors are never recomputed from Bengali text.** `saveTranslation` copies each
  heading's anchor from the matching English block by id, so `/css/intro#anchor` and
  `/bn/css/intro#anchor` resolve to the same fragment — the manual translation scripts
  already followed this rule by hand (PROGRESS.md session 9), this enforces it in code.
- **Block order and set are always derived from English, never trusted from client
  state.** `saveTranslation` rebuilds the final array by walking `englishBlocks` and
  looking up each by id — a translation added out of sequence (e.g. via "Copy from
  English" on a block with no prior translation) can't end up in the wrong position on the
  actual `/bn` page, and a Bengali block whose English counterpart was since deleted gets
  dropped rather than lingering as an orphan.
- **Reused block editors directly** — `RichTextBlockEditor`/`HeadingBlockEditor`/
  `TableBlockEditor`/`CalloutBlockEditor` are the exact same components the English editor
  uses, just bound to Bengali block fields. Same sanitization (`lib/admin/sanitize.ts`,
  extracted from `lib/admin/doc.ts` this phase so both editors share one rule instead of
  drifting).
- "Create Bengali translation" clones the full English `blocks` array as the starting
  point (ADMIN-PLAN.md's own instruction), rather than starting empty.

**Verified**: `next build` clean, public route tree unchanged, `/admin/docs/[id]/bn`
correctly `ƒ`. Live spike (a doc with a translated heading/richtext, a correctly-locked
code block, and one deliberately untranslated heading): rendered exactly as designed,
"Copy from English" correctly populated the empty slot with editable English content, and
Save called the real Server Action end-to-end (dev log confirmed the full chain executing,
erroring only on the spike's fake id) with the error surfacing inline rather than crashing
the page.

Stage 7 now covers every planned screen except Categories/Settings (Phase 8) and
Resources/Dashboard (Phase 9).

---

## D-34 · Admin chrome: persistent left sidebar; media page filter + view links
**Date:** 2026-07-27 · **Status:** Active

User feedback on the shipped screens: no way to navigate between admin sections without
going back to the dashboard each time, and the media page needed a WordPress-style
type filter and a direct link to each file.

- `AdminSidebar` — flat nav (not a tree, unlike the public `DocSidebar`; this never grows
  past a handful of top-level screens), Dashboard/Docs/Media active, Categories/Settings/
  Resources/Leads shown disabled (grayed, no href) so the full shape of the panel is
  visible before Phase 8/9 build them — `builtHrefs` in `app/admin/layout.tsx` is the one
  place that list needs updating as each ships.
- `AdminChrome` — client wrapper deciding whether to show the sidebar at all
  (`usePathname()`), hidden on `/admin/login` (no session yet) and any `/preview` route
  (meant to read close to the real public page, not framed in admin chrome).
- **Real layout bug caught while verifying, not shipped blind**: the sidebar's `h-screen`
  was overflowing past the actual viewport, because the public site's `SiteHeader` was
  still rendering above the admin panel (the root layout wraps every route). Extracted
  `SiteChrome` (client, same `usePathname()` pattern) to skip the public header/footer
  entirely for `/admin/*` — the admin panel is a separate application surface, not a page
  within the public site's chrome. Neither this nor `AdminChrome` touch `headers()`/
  `cookies()`, so neither carries D-18's SSR-poisoning risk despite living in/near the root
  layout.
- Media library: WordPress-style type filter (All/Images/Videos/Files, tab UI with live
  counts) and each thumbnail is now a link to the file's actual URL (opens in a new tab,
  hover reveals an external-link icon).

**Verified live against real data** — this session's admin panel testing has been
spike-only throughout (no admin credentials), but this browser tab turned out to still
hold a valid session from earlier testing, letting this be checked directly: sidebar
renders and highlights the active section correctly, `/admin/media`'s filter tabs show the
real backfilled counts (98/77/9/12) and correctly narrow the grid, hovering a thumbnail
reveals the view-file overlay. Separately confirmed via a clean `curl` (no cookies) that
the auth guard itself is unaffected — still redirects correctly. `next build` clean,
public route tree unchanged.

---

## D-35 · Stage 7 Phase 8: categories screen, site settings, /about/ mechanism
**Date:** 2026-07-27 · **Status:** Active

**Categories** (`/admin/categories`) — CRUD over `categories`, doc count shown per row.
Delete surfaces the FK `on delete restrict` violation (Postgres code `23503`) as a plain
message ("still has N lessons, move or delete them first") instead of a raw PG error.

**Site settings** (`/admin/settings`) — scoped to homepage hero + about-band text only,
not the full "features, coming-soon, footer, contact" surface ADMIN-PLAN.md originally
described. Two real constraints forced the trim:
- Feature-card and coming-soon icons are hardcoded lucide/Iconify imports — CLAUDE.md §4
  bans runtime icon loading, so there's no safe way to make icon choice admin-editable
  without either a second delivery mechanism or inventing a fixed icon-per-slot
  convention. Left hardcoded; only worth revisiting if the icon set itself needs to grow.
- `SiteFooter` is a client component deriving locale via `usePathname()` specifically to
  avoid needing `headers()`/`cookies()` near the root layout (D-18's lesson). Making its
  text DB-editable would mean either fetching settings client-side or restructuring that
  locale-derivation — not worth it for a copyright line nobody's asked to change. Skipped;
  `site_settings.footer` stays seeded-empty and unused for now.
- Home overrides layer on top of `lib/i18n.ts`'s existing defaults, never replace them —
  `getSiteSettings()` (new, `lib/content.ts`) returns `{}` on any failure (missing row,
  migration not run), and the merge uses `||` not `??` so an admin explicitly clearing a
  field falls back to the default instead of rendering blank. This is what makes it safe:
  every `site_settings` row is empty today, and the homepage must render identically
  whether or not this feature exists.

**`/about/` mechanism** — per ADMIN-PLAN.md §1c, a standalone page is just a `docs` row
with `category_id IS NULL`, already supported since Phase 3's editor (the "Standalone
page" category option). Two things were still missing: the actual `app/about/page.tsx`
route, and a real bug the plan flagged in advance — `getAllDocPaths()`/
`getTranslatedDocPaths()` split `path` on `/` for `[category]/[slug]`'s
`generateStaticParams`, and a slash-less path like `about` would split into `{ category:
'about', slug: undefined }`. Filtered both functions to `path.includes('/')`. Deliberately
did **not** write real About copy — O-1 is a content decision, not a code one, and
fabricating personal/institutional bio content without the user's input would be
presumptuous. `/about/` 404s honestly until a real doc row exists at that path.

**Real bug caught while testing, fixed before commit**: `CategoriesManager`'s
delete-blocked message used `alert()` — same class of blocking native dialog as the
`confirm()` mistake in D-29, froze the browser automation tab identically. Beyond the
testing risk, it was also the only screen this session using a jarring native dialog
instead of the inline-error pattern every other admin screen already uses — replaced with
`setError()`.

**Verified thoroughly, including a live homepage regression check** since this touches
already-shipped, working code: `next build` clean, public route tree unchanged except
`/about` (new, correctly `○` static since `getDoc('about')` returns null at build time and
bakes a static not-found). Curled the live homepage HTML directly and confirmed "Learn to
build"/"for the web" render byte-identical to before, proving the empty-settings fallback
path works. `/about` confirmed 404. Categories and Settings screens checked live against
real data via the still-authenticated browser tab from D-34 — real category list with
correct doc counts, edit form pre-filled correctly, delete-blocking fired correctly (before
the `alert()` fix landed).

Stage 7 now has every screen except Resources + the usage dashboard (Phase 9).

---

## D-36 · Stage 7 Phase 9: resources, dashboard/usage panel, daily backup job — and Leads/contact form dropped entirely

**Date:** 2026-07-27 · **Status:** Active

**Resources** (`/admin/resources`, public `/resources/`) — CRUD grouped by `group_name`,
public page groups the same way. Fixes the spelling the Jekyll site never did
(`/resourses/` → `/resources/`, per `docs/URLS.md`).

**Dashboard rebuild** (`/admin`) — counts (docs/published/draft/categories/translations),
5 most-recently-edited docs, and a usage panel via `lib/admin/usage.ts`. Usage panel
deliberately omits egress/file-storage/MAU — those need the Supabase Management API token,
which isn't in `.env.local`; not fabricating numbers for what isn't actually measurable.
Inactivity row is visually dominant/warned at ≥4 days per `docs/ADMIN.md`'s spec, since
that's the number that actually threatens the free-tier project pause. Verified live: 150
lessons, 150 published, 0 draft, 150 translations, 0 days since activity, 2.6% (12.8 MB /
500 MB) DB size.

**`lib/supabase/admin.ts`** was still typed `createClient<Database>(...)` — same `never`-
inference bug as `public.ts`/`server.ts` earlier this session, tripped for the first time
here because `usage.ts` is its first real consumer. Dropped the generic; no ripple, nothing
else imports this client.

**Daily backup job** (`.github/workflows/supabase-daily.yml` + `scripts/daily-backup.mjs`)
— one cron does both jobs `docs/ADMIN.md` specs: pings the DB (resets the free tier's
7-day inactivity pause) and exports every `docs`/`categories`/`doc_translations` row to
`backup/` (per-doc `.mdx` with blocks as a fenced JSON block, plus `backup/docs.json` as
the actual restore source), committing only if something changed. Ran once against the
real production DB already — 150 `.mdx` files across 8 category folders + `docs.json` now
sit in the repo as genuine first-backup data, not a spike. `backup/README.md` states the
same "never source of truth, never edited, never built from" rule CLAUDE.md §4 already
requires. **Needs `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` added as
repo secrets** (Settings → Secrets and variables → Actions) before the scheduled run will
work — not yet done.

**Leads dropped, not deferred.** User: *"i don't want the leads functionlity here, the
contact page too won't have any contact form, just the basic info of our institute and if
someone want to contact they can visit the main website's contact form."* This removes an
entire planned screen (`docs/ADMIN.md`'s "Leads inbox" row, the Dashboard's "recent leads"
line) and the Stage 8 contact-form work outright — not a "build later" trim like O-1/O-3.
Removed the `Leads` entry from `AdminSidebar`'s `NAV_ITEMS` (it was disabled/unbuilt, so no
route or `leads` table code existed yet to delete). `app/contact/page.tsx` is now a static
server component: institute description reusing only already-established facts (Habra,
West Bengal, same wording as the homepage's about-band) plus an outbound link to
`https://learncomputer.in/contact/`. No form, no `leads` table use, no Resend dependency.
O-2 is resolved by removal below, not answered.

**Verified:** `tsc --noEmit` clean, `next build` clean (`/contact` and `/resources`
prerender `○` static, `/admin/resources` `ƒ` dynamic as expected), grepped
`.next/static/` for `SUPABASE_SERVICE_ROLE_KEY`/`R2_SECRET_ACCESS_KEY`/
`CLOUDINARY_API_SECRET` — no matches.

---

## D-37 · Users, roles, revision history, activity log, soft delete

**Date:** 2026-07-27 · **Status:** Active — ⚠️ **migration not yet run against production**

User asked for a "Users" feature: multiple people uploading content, admin can add/edit/
delete/block them, and "in depth review of what every user is doing." Four choices were
made explicit before building (`AskUserQuestion`): **2 roles** (admin/editor, both can
publish), **activity feed + revision history** (not feed-only, not revisions-only), **admin
sets a temp password** (no invite-email/SMTP dependency), **admin-only soft-delete** for
lessons. Mid-build the user added: *"make sure that even admin can't delete admin by
mistake"* — see below.

**Why `app_metadata` had to go.** The existing `is_admin()` (schema.sql) read
`auth.jwt() ->> 'app_metadata' ->> 'role'`. A JWT claim only updates on token refresh — up
to an hour. "Block this user" needing up to an hour to take effect fails the ask outright.
`supabase/migrations/004-users.sql` replaces it with a `profiles` table
(`id`/`name`/`role`/`status`) and rewrites `is_admin()` (+ new `can_edit()`, true for both
roles) to read it — every RLS policy across all 9 tables re-permissions itself through
those two functions, and blocking is instant on the next request since `proxy.ts` and
every write now hit the live table, not a cached token. `docs`, `media`, and
`doc_translations` (the last one caught only during review — 002-i18n.sql's translation
policy was still `is_admin()`-only and would have silently blocked editors from
translating) move to `can_edit()`; categories/testimonials/resources/settings/users/
activity stay admin-only per the 2-role decision.

**Admin-deleting-admin guard**, added mid-build per the user's explicit ask: `deleteUser`
(`lib/admin/users.ts`) refuses outright if the target's role is `admin` — it must be
demoted to editor first, a deliberate separate step, so no single click removes an admin
account. Enforced in the server action itself (service-role bypasses RLS, so this can't be
an RLS policy) and mirrored in the Users screen (delete disabled/grayed for admin rows).

**Soft delete, not hard delete.** `docs.deleted_at` + a `docs_delete_restore_guard` BEFORE
UPDATE trigger that raises unless `is_admin()` — enforced twice (RLS "editors manage docs"
technically allows an editor to UPDATE, so the trigger is the real gate, not just the
app-layer button hiding). Deliberately does **not** touch `status`/`published_at` on
delete: an earlier draft cleared them, which would have unlocked the slug field on restore
for a previously-published doc — a real risk against CLAUDE.md §3.2 (no accidental URL
changes on migrated content). Restore is now a true undo. The public read policy's
`deleted_at is null` clause is the actual hide mechanism (one policy, not ~8 query-site
filters across `lib/content.ts`) — this is also why `path`/`(category_id, slug)`'s plain
unique constraints had to become partial indexes (`where deleted_at is null`): otherwise a
soft-deleted row keeps squatting on its path forever and recreating that lesson fails.

**Revision history**, not just a log line. `doc_revisions` snapshots `title`/`blocks`/
`toc`/`status` on every `saveDoc`, capped at 20/doc (oldest pruned after insert, ~60MB
worst case against the 500MB free tier). The editor's new "History" panel diffs by block
id (added/changed/removed vs. the next-older revision) rather than a raw JSON diff — a
lesson is a list of blocks, so that's the unit that actually reads as "what changed."
Restoring snapshots the pre-restore state first, so a restore is never a one-way trip
either.

**Activity log** (`activity_log`, append-only — no update/delete policy for anyone,
including admins, short of the SQL editor) is wired into every existing admin action:
doc save/publish/unpublish/delete/restore/create, media upload/delete, category/resource/
settings CRUD, translation create/save/delete, and every user action. `logActivity()`
(`lib/admin/activity.ts`) never throws — same graceful-degradation pattern as
`getSiteSettings` — a logging failure must not take down the save it's recording.
**Stated ceiling, not silently glossed over:** only catches what goes through the app. A
`scripts/*.mjs` run or a direct Supabase Studio edit uses the service-role key or a
different session with no app-attributed user, and won't appear here — a trigger-based
approach wouldn't fix this either (service-role connections still have no user to
attribute), so the log is honestly incomplete rather than falsely complete.

**Onboarding**: `/admin/users`' "New user" generates a 16-char temp password client-never-
sees-twice (shown once in the create response, admin copies and hands it over out of
band), via `auth.admin.createUser` + `email_confirm: true`. No SMTP dependency, matching
the "admin sets a temp password" choice over invite emails (would have needed Resend, which
D-36 explicitly walked away from for the contact form).

**⚠️ Deployment order matters.** `proxy.ts` and every admin server action now query
`profiles` on every request. **The migration must be run in the Supabase SQL editor before
this code is deployed** — otherwise `/admin` locks out immediately (the profile lookup
fails, `role` stays `null`, every request redirects to `/admin/login`) including for the
existing admin account. Not yet run as of this commit.

**Verified:** `tsc --noEmit` clean, `next build` clean (`/admin/users`, `/admin/activity`,
`/admin/trash` all `ƒ` dynamic as expected, no regression on the 300+ static/SSG public
routes), grepped `.next/static/` for service-role/R2/Cloudinary secret names — no matches.
**Not live-tested** — doing so requires the migration to be applied first (see above), a
schema change against the production database that needs the user's own action, not mine.

**Update, same day:** user ran `004-users.sql` and confirmed via `select id, name, role,
status from profiles;` — one row, `role='admin'`, `status='active'`. Pushed and deployed
(`2413296`). O-8 resolved.

Also added, same session: a dark/light toggle and a build-version label
(`lib/admin/version.ts` — `VERCEL_GIT_COMMIT_SHA` in production, `git rev-parse --short
HEAD` locally) in the sidebar footer, since the admin panel has no header of its own
(`SiteChrome` hides the public one on `/admin/*`) and had no way to switch theme.

---

## D-38 · Settings split into Settings (usage, admin-only) and Pages (site copy, editors too)

**Date:** 2026-07-27 · **Status:** Active — ⚠️ **migration not yet run against production**

User: the free-tier usage widget should move from Dashboard into Settings ("since only
admin can see it"), and the site-content fields inside Settings (home hero/about-band copy)
should move to a new **Pages** tab that editors can also reach, "from where even editors
can change contents of different pages, that are still to be added."

- `/admin` (Dashboard) loses the usage panel — editors already see Dashboard, and free-tier
  internals (DB size, days-to-pause) aren't something an editor needs in front of them.
- `/admin/settings` becomes admin-only-and-only-usage — just the panel that moved in.
- `/admin/pages` (new, `components/admin/pages-manager.tsx`, renamed from
  `settings-manager.tsx` — same component, same `site_settings` key `'home'`) is reachable
  by editors. Today it holds one form (home hero + about-band, EN/BN); the `footer`/
  `contact` `site_settings` keys already exist (003-admin.sql seed) with no editor UI yet —
  more pages get a form here the same way, as they're actually needed, not built ahead of
  demand.
- **`supabase/migrations/005-pages-editable.sql`**: `site_settings`'s RLS policy
  (schema.sql) was `is_admin()`-only — moving its content screen to editors without this
  would mean `saveSettings()` fails against RLS for every editor, the same class of gap
  D-37 caught for `doc_translations`. Opens to `can_edit()`, same as docs/media/
  doc_translations.

**⚠️ Deployment order, same caution as D-37 but lower stakes**: unlike 004, skipping this
migration doesn't lock anyone out — an editor saving Pages content just gets a normal RLS
error surfaced as the existing inline-error banner. Still, run
`005-pages-editable.sql` in the Supabase SQL editor before editors are expected to use
`/admin/pages`.

**Verified:** `tsc --noEmit` clean, `next build` clean (`/admin/pages` new, `ƒ` dynamic;
no regressions elsewhere), grepped `.next/static/` for secret names — no matches. Not yet
live-tested (same reasoning as D-37 — needs the migration run first).

**Update, same day:** user ran `005-pages-editable.sql`. O-9 resolved.

---

## D-39 · Custom 404 page; Stage 9 SEO foundation (sitemap, robots, canonical, JSON-LD); admin SEO screen

**Date:** 2026-07-27 · **Status:** Active

User asked for three things: a "beautiful" 404 page, the Stage 9 SEO work (sitemap,
robots, canonical, structured data — flagged in CLAUDE.md's roadmap as no-longer-risky
per D-12, since the old site was never indexed and there's nothing to break), and,
conditionally, "if needed for certain tasks," a new SEO tab editors can also reach.

**404 page** (`app/not-found.tsx`) — reuses existing motion components
(`HeroReveal`/`ShimmerButton`/`BorderBeam`/`NumberTicker`) rather than inventing new ones,
matching `docs/UI.md`'s "chrome/transitions, not lesson content" rule for where motion
belongs. One English-only page, same as the old Jekyll site's single `404.html` — no
per-locale variant, since nothing calls `notFound()` on a Bengali-specific path today.

**`lib/seo.ts`** (new) — `SITE_URL` (reads the already-set `NEXT_PUBLIC_SITE_URL`),
`buildAlternates()` for canonical + hreflang, `organizationJsonLd()`/`websiteJsonLd()`/
`articleJsonLd()`, and `jsonLdScript()`. **Two real bugs caught before they shipped**:
- `buildAlternates()`'s first draft computed canonical by checking whether `enPath`
  (always an English path, by definition) `startsWith('/bn')` — always false, so the
  Bengali homepage would have gotten the *English* URL as its own canonical, telling
  Google to ignore the Bengali page entirely. Redesigned to take the calling page's own
  `currentPath` explicitly rather than infer it.
- `jsonLdScript()` originally did a bare `JSON.stringify` for the `dangerouslySetInnerHTML`
  script content — an admin-authored doc title containing the literal string `</script>`
  would have broken out of the script tag. Escapes `<` → `<`, standard practice for
  inline JSON-LD.

**`app/sitemap.ts`** / **`app/robots.ts`** (new) — fully data-driven via a new
`getAllPublishedPaths()`/`getTranslatedPathsForSitemap()` in `lib/content.ts` (the
existing `getAllDocPaths()` filters out standalone pages like `about`, which
`generateStaticParams` needs but a sitemap doesn't). This means `/about` starts appearing
in the sitemap automatically the day it's actually published — never before, so the
sitemap can't ever point Google at a 404 (O-1 stays unaffected). Verified live:
`robots.txt` and `sitemap.xml` both prerender `○` static and serve real content against
the real `docs.learncomputer.in` domain.

**Canonical + hreflang** added via `buildAlternates()` to home (en/bn), category (en/bn),
lesson (en/bn), about, contact, resources. **Article JSON-LD** added to lesson pages
(`datePublished`/`dateModified` from the real `docs` row — verified live, correct
timestamps). **Organization + WebSite JSON-LD** added once in the root layout (site-wide,
not per-page).

**Admin SEO screen** (`/admin/seo`, editor-accessible per the user's explicit ask) — one
new `site_settings` key, `'seo'` (no migration needed: `site_settings.key` has no fixed
constraint, and `saveSettings`'s upsert creates the row on first save). Holds Search
Console / Bing Webmaster verification codes so they can be pasted in later — when Stage 10
actually happens — without a code deploy. Root layout's `metadata` became `generateMetadata`
(async, reading `getSiteSettings('seo')`) to serve them as real `<meta
name="google-site-verification">`/`msvalidate.01` tags. `saveSettings()` now branches:
the `'seo'` key revalidates via `revalidatePath('/', 'layout')` (busts the root layout
across every route) instead of the existing per-page `'/'`/`'/bn'` revalidation, since
verification tags are site-wide, not homepage-only.

**Verified:** `tsc --noEmit` clean, `next build` clean (`/robots.txt`/`/sitemap.xml` both
`○` static — the async `generateMetadata` read didn't force the root layout dynamic,
confirming the same caching pattern already proven safe by `home-content.tsx`'s
`getSiteSettings('home')` call), grepped `.next/static/` for secret names — no matches.
Live-checked against a local production build: real canonical/hreflang/JSON-LD tags on
`/html/intro` and `/bn/html/intro`, correct `sitemap.xml`/`robots.txt` content, 404 page
returns HTTP 404 with the real page rendered, `/admin/seo` correctly redirects
unauthenticated requests to login.

**Not done**: actually standing up Search Console/Bing Webmaster Tools and submitting the
sitemap (Stage 10) — that needs the user's own Google/Microsoft account and is outward-
facing, not something to do unprompted.

---

## D-40 · Header nav menu (admin-editable) + real /resources content, ported from the old site

**Date:** 2026-07-27 · **Status:** Active — ⚠️ **migration not yet run against production**

User pointed at the old Jekyll site's live `/resourses/` page and asked for three things:
the equivalent page on this site (it already existed — `/resources`, built Session 14 —
but was **empty**, nobody had ever populated it), a header nav menu, and an admin screen
to manage nav items.

**Real bug found and fixed, unrelated to the new feature but caught while verifying it.**
`lib/content.ts`'s `getResources()` was a plain Supabase fetch, never wrapped in
`unstable_cache` — but `lib/admin/resources.ts`'s create/update/delete actions already
called `revalidateTag('resources', ...)`, assuming a `'resources'`-tagged cache entry
existed to invalidate. None did, so every admin edit's revalidation was silently a no-op,
and Next's default fetch caching served whatever was in the table at the very first
production build — forever, until a full clean rebuild. Live-tested against a real
`next build && next start` (not just `next dev`, which doesn't hit this code path the same
way) after seeding 94 real rows directly: `/resources` still rendered the pre-seed empty
state. This is exactly the kind of bug `next dev` hides and only a production build
surfaces — the session's build+verify step earning its keep. Fixed by tagging
`getResources()` `'resources'`, matching every other read in the file. Checked the rest of
`lib/content.ts` for the same class of bug (an admin action revalidating a tag nothing
caches) — cross-referenced every `revalidateTag()` call against every `unstable_cache` tag;
`nav`/`resources`/`settings`/`sidebar` all now match, nothing else was silently broken.

**Real content ported**, not fabricated: `scripts/seed-resources.mjs` transcribes the old
site's `docs-master/docs-master/_data/resources.yml` — 94 real external links across 10
groups (Free Images, Colors, Free Icons, Free Fonts, Lorem Ipsum, Webfont Generators,
W3Schools, CSS Generators, JavaScript Libraries, Design & UI). Idempotent (skips existing
`name`+`url` pairs), writes a report to `scripts/reports/`. Two source bugs fixed rather
than replicated while transcribing: one `design_uis` entry was literally labeled `"Visit"`
(an obvious copy-paste artifact — corrected to "Vectr", the actual site at that URL), and
a duplicate Tinypng row was deduped. **No thumbnails** — the old site's preview images live
at `docs.learncomputer.in/assets/img/preview-N.png`, on the *old* Jekyll deploy of this
same domain (still live pre-cutover); hotlinking them would 404 the moment this project
takes over the domain, since those files were never migrated to Cloudinary per CLAUDE.md
§6. Admin can attach real thumbnails later via Media upload. **Ran directly against
production** (94/94 inserted, 0 skipped) — same judgment call as the daily-backup script
and the translation scripts earlier this project: populating real, already-public content
is in-scope for "make it in our site too," not a separate action needing its own sign-off.

**Header nav** — `nav_items` table (new migration, `006-nav-items.sql`): `label`/`label_bn`/
`url`/`sort_order`, public read, admin-only write (same tier as Categories/Resources — site
structure, not day-to-day content, unlike Docs/Media/Pages/SEO which editors reach). Root
layout became `async` to fetch it once (cached, graceful-empty on any failure — same
pattern as every other admin-editable read) and threads it through `SiteChrome` →
`SiteHeader` as a prop, since both stay client components (`SiteChrome` needs
`usePathname()` to hide the header on `/admin/*`, D-34) and can't fetch server data
themselves. External URLs (`http...`) get `target="_blank"` automatically. Hidden below
`sm` — a real mobile-nav gap if this list grows past the one seeded "Resources" link, not
built now since it's still just one link.

**Admin Menu screen** (`/admin/menu`, admin-only) — CRUD + arrow-based reorder, mirrors
`resources-manager.tsx`'s structure closely.

**⚠️ Deployment order**: skipping the migration doesn't break anything — `getNavItems()`
degrades to an empty array exactly like a missing `site_settings` row, verified live (no
nav rendered, no error, no crash). It just means the nav stays invisible until
`006-nav-items.sql` is run.

**Verified:** `tsc --noEmit` clean, `next build` clean (`/admin/menu` new, `ƒ` dynamic; all
341 routes otherwise unchanged in kind). Grepped `.next/static/` for secret names — no
matches. Live-checked against a local production build twice — first catching the
`getResources()` bug, then confirming the fix (`/resources` renders real names: Freepik,
Unsplash, Coolors, Figma, Google Fonts) and confirming the nav's graceful-empty behavior
pre-migration.

**Update, same day:** user ran `006-nav-items.sql`. O-10 resolved.

---

## D-41 · Real thumbnails for all 94 seeded resources, uploaded to Cloudinary

**Date:** 2026-07-27 · **Status:** Active

User pointed at `docs-master/docs-master/_data/resources.yml` (the thumbnail filenames
D-40's seed deliberately skipped) and `docs-master/docs-master/assets/img/` (where the 96
actual `preview-N.*` image files live), and asked for them uploaded and wired in.

`scripts/upload-resource-thumbnails.mjs` (new) — parses the same source `.yml` with a
small line-based parser (no YAML dependency added for a fixed 3-line-per-entry shape),
matches each entry to its already-seeded `resources` row by `(name, url)`, uploads the
local file to **Cloudinary, not R2** (these are tiny preview images, nowhere near the 10MB
`pickBackend()` cutoff in `lib/storage.ts` — R2 is for oversized files only, per
`docs/ASSETS.md`), sets `resources.thumbnail_url`, and registers the upload in `media` too
so it's visible from the admin Media library like every other image on the site, not a
side channel invisible to the admin panel.

**Real matching bug caught by the dry run**: two entries failed to match — `seed-
resources.mjs` had transcribed "W3Schools Javascript"/"W3Schools JQuery" as "W3Schools
JavaScript"/"W3Schools jQuery" (a casing correction made by hand while transcribing D-40,
not a bug in the source data itself) — this script's name-matcher needed to know about
that drift too. Added to the same `correctName()` table as the Vectr fix. Re-ran the dry
run after the fix: 95/95 matched (94 unique resources + the one intentionally-deduped
Tinypng entry matching the same row twice), 0 missing files, 0 unmatched — confirmed
before touching Cloudinary or the DB.

**Real non-bug, worth recording anyway**: the first post-upload verification (`next build
&& next start` without clearing `.next`) showed zero thumbnails and an empty header nav,
looking exactly like D-40's caching bug again. It wasn't — `rm -rf .next` and a fully clean
rebuild rendered everything correctly (real Cloudinary thumbnails, "Resources" nav link).
Root cause was local: repeated `next build` calls during this same session's testing had
left a stale on-disk Data Cache entry from *before* the thumbnails/nav migration existed,
and nothing had triggered `revalidateTag` between those builds since the seed/upload
scripts write directly to Postgres, bypassing the app entirely. This does **not** reproduce
on a real deploy — Vercel builds from a clean container each time — but it's a real trap
for local verification after any script-driven DB write: **always `rm -rf .next` before a
verification rebuild that follows a direct-DB script**, not just `next build` again.

**Verified:** `tsc --noEmit` clean, dry run matched 95/95 before any write. Queried
production directly after running for real: 94/94 resources have `thumbnail_url` set,
94/94 have a matching `media` row. Live-checked against a **fully clean** rebuild (`rm -rf
.next && next build && next start`): real Cloudinary thumbnail URLs render on `/resources`,
header nav shows "Resources". Grepped `.next/static/` for secret names — no matches.

---

## D-42 · Resources moves to the editor tier

**Date:** 2026-07-27 · **Status:** Active — ⚠️ **migration not yet run against production**

User asked whether editors could manage Resources — they couldn't (left admin-only in
schema.sql, unchanged by D-37/D-38 which moved docs/media/translations/settings but not
resources/categories/testimonials). Moved to the editor tier, all three layers that
enforce it: **`supabase/migrations/007-resources-editable.sql`** (RLS policy
`is_admin()` → `can_edit()`, same swap as docs/media/translations/settings before it),
`proxy.ts`'s `ADMIN_ONLY_PREFIXES` (`/admin/resources` removed), and `AdminSidebar`'s
`NAV_ITEMS` (`adminOnly: false`). Categories/Settings/Users/Activity/Trash/Menu stay
admin-only — this was specifically about Resources, not a broader re-opening.

**Verified:** `tsc --noEmit` clean, fully clean rebuild (`rm -rf .next && next build`)
clean, grepped `.next/static/` for secret names — no matches. Not live-tested as an
editor (would need a second test account) — RLS is the real enforcement either way, and
the policy swap here is identical in shape to four already-verified-working ones
(docs/media/translations/settings).

**Update, same day:** user ran `007-resources-editable.sql`. O-11 resolved.

---

## D-43 · Nav sub-menus (WordPress-style) + the interactive box model demo

**Date:** 2026-07-27 · **Status:** Active — ⚠️ **migration 008 not yet run against production**

User asked for the old site's `/box-model` tool rebuilt "modern with beautiful UI …
highly customizable, even more than what it is now … contrasting colors for everything",
placed in the nav as a **sub-menu of Resources**, plus a WordPress-style sub-menu manager
in the admin. Four scoping questions were answered up front: deep box-model controls (not
a general CSS playground), full Bengali version, three-column layout, all four teaching
aids.

### Nav sub-menus

`nav_items` gains `parent_id` (migration `008-nav-submenu.sql`, self-referencing FK,
`on delete cascade`). **Two levels only** — a site header never realistically needs more,
and unbounded depth means unbounded dropdown UI. The cap is enforced in
`lib/admin/nav.ts` (`assertValidParent`) rather than a CHECK constraint: a self-referencing
FK can't express "the parent must itself be a root" without a trigger, and every write path
already funnels through that one file. It also refuses to nest an item that has its own
children, which is the other way a third level could appear.

`getNavItems()` now returns a two-level tree. It still selects `*`, so with 008 unrun the
`parent_id` column simply comes back undefined, every row reads as a root, and the header
renders the old flat nav — **verified live before running the migration**: header showed
"Resources" as a plain link, no dropdown, no error.

Admin Menu screen gets indent/outdent buttons (indent = nest under the sibling directly
above, WordPress's exact rule), indented child rows, a parent picker in the form, and a
delete confirmation that names how many sub-items will cascade.

`components/site-nav.tsx` (new) renders the dropdown: **click-to-open, not hover** — a
hover dropdown is unreachable on touch and hostile to keyboard users. Escape and
click-outside close it, `aria-expanded`/`aria-haspopup` on the trigger. The parent's own
URL is the first row inside the dropdown, so nesting a child under a page never makes that
page unreachable from the nav.

### The box model demo

`/tools/box-model` + `/bn/tools/box-model` (URL per `docs/URLS.md` R4, which already froze
`/tools/…` for these). 301 from the old `/box-model` in `next.config.ts`, per CLAUDE.md
§3.2. Both routes prerender static; both in the sitemap; canonical + hreflang wired.

**The key architectural difference from the old tool**: the old jQuery version
re-implemented the box model in JavaScript — manually positioning four absolutely-placed
divs and computing every dimension by hand. This one applies **real CSS to real elements**
and lets the browser do all of it, including `box-sizing`, `%`/`em`/`rem` units, and
`border-radius`. `box-sizing`, `width`/`height`, `padding` and `border` all sit on one
element (they must, for real box-sizing semantics); its background is the padding colour
and a child fills the content box, so what shows through is exactly the padding region.
The numbers under the box come from `getBoundingClientRect` via a `ResizeObserver`, not
arithmetic — so they cannot drift from what's actually rendered, which is the whole point
of a teaching tool.

That one-element requirement makes "which layer is the pointer over" a geometry question
rather than an event-target one, since border/padding/content are bands of the same
element. `bandAt()` resolves it from pointer coordinates against the border and padding
widths — exact, one handler. Margin is genuinely outside the box so it stays its own
element. Layers are also reachable from the legend buttons (hover, click-to-pin,
`aria-pressed`), which is what makes the tool usable by keyboard and on touch at all.

**Controls**: box-sizing, width/height with px/%/em/rem, padding + margin per side with
px/em/rem and the old tool's link modes (All / Top-Bottom / Left-Right / Each), border
width per side plus style and colour picker, border-radius per corner, and editable
content text + font-size. Deliberately *not* included: `display`, `position`, `overflow`,
`box-shadow` — the user picked "deep on the box model itself" over a general playground,
and each of those is a different lesson.

**Teaching aids**, all four: hover/select explanation panel; four preset scenarios (the
"why border-box exists" one loads 300px + 40 padding + 20 border and the readout says
360px, then flipping to border-box snaps it to exactly 300 — verified live); a spelled-out
arithmetic breakdown that swaps to a different explanation under border-box; and a link to
the existing `/css/boxmodel` lesson.

**Real contrast bug found and fixed during the live pass.** First palette used a saturated
`orange-500` margin against the default `#f59e0b` amber border — in dark mode the two
nearly merged, which is precisely what the user asked to avoid. Fixed by making margin the
*least* saturated of the four layers (`orange-200` / `dark:orange-900`): the border colour
is user-editable and therefore the one layer whose contrast can't be guaranteed, so margin
has to work as a muted backdrop behind whatever they pick. Hues still follow the Chrome
DevTools convention (blue/green/amber/orange) students will meet later. Re-verified zoomed
in, both themes.

**⚠️ Deployment order**: 008 unrun is harmless — the header falls back to a flat nav
(verified). The demo page itself has no database dependency at all and works either way.

**Verified:** `tsc --noEmit` clean; fully clean rebuild (`rm -rf .next`) clean with both
tool routes `○` static; `.next/static/` grepped for secret names — no matches; `/box-model`
returns 308 → `/tools/box-model`. Live browser pass on both locales and both themes:
presets, the border-box payoff, pointer band detection, the explanation panel, and the
Bengali page all confirmed working, with a clean console (no hydration warnings).

---

## D-44 · Box Shadow Generator (`/tools/box-shadow-generator`) — full tier 1-4 build

User asked for the old `/box-shadow-generator` tool rebuilt "with all the features currently
available, and also any new modern and more feature rich as possible... make it as feature
rich as possible" for designers, developers and students, explicitly "in full" after I
proposed a tiered feature list (Tier 1 core, Tier 2 designer power, Tier 3 teaching, Tier 4
adjacent modes) and asked which tiers to build.

**The old tool** (`box-shadow-generator.html` in the Jekyll source) was one shadow only:
h/v-offset, blur, spread, colour, a separate opacity field, inset, plus box/canvas
background colour and a copy button. `box-shadow` is a comma-separated list and the single
biggest gap was that the old tool could never produce more than one layer — every
realistic-looking shadow stacks several.

**Shared code extracted first.** `Slider`/`Section`/`SegmentedControl` were private to
`box-model-demo.tsx`; moved to `components/tools/tool-controls.tsx` and both demos now
import from there rather than duplicating ~80 lines. `Slider` gained an optional
`onDragStart` prop (fires once per drag gesture, before the first `onChange`) — used to
snapshot undo history once per drag instead of once per pixel.

**New lib modules** (pure functions, no DOM, so they're independently reasoned about):
- `lib/color.ts` — hex↔rgba, and sRGB → OKLCH via Björn Ottosson's published matrices
  (verified against the reference values: red `#ff0000` → `oklch(62.8% 0.258 29.2)`,
  matches oklch.com to 3 decimal places). `extractColor()` pulls a colour (hex/rgba/hsl
  function or a small named-colour table) out of a shadow-layer string, used by the parser.
- `lib/box-shadow.ts` — `ShadowLayer` type, CSS generation for all three modes
  (`box-shadow`/`text-shadow`/`filter: drop-shadow()`), the paste-to-import parser
  (`parseShadowInput`, top-level-comma splitting that respects `rgba(...)` parens),
  `smoothShadowLayers()` (the shadows.brumm.af technique — N layers on an easing curve,
  offset/blur growing, opacity falling), `angleDistanceToOffset()` for light-source mode,
  and `SHADOW_PRESETS` (12 presets: flat, 3 Material elevations, 2 Tailwind shadow scales,
  neumorphism raised/pressed, glow, 20-layer retro long-shadow, hard offset, pressed
  button).
- `lib/box-shadow-i18n.ts` — same convention as `box-model-i18n.ts`: full EN/BN, CSS
  property/function names stay English in Bengali text.

**`components/tools/box-shadow-demo.tsx`** — three columns (layers+controls / canvas /
presets+output), same architecture principle as the box model demo: real CSS on a real
element, nothing simulated in JS. What's in:
- **Multi-layer stack**: add/duplicate/delete/reorder (`@dnd-kit`, same sortable pattern as
  `docs-list.tsx`'s category/doc reordering), per-layer hide and solo, drag handle.
- **Drag-on-canvas**: pointer-drag the shape itself to set the active layer's x/y directly,
  1:1 pixel mapping, snapshots history on drag start.
- **Colour**: hex + alpha slider (no browser ships a native alpha colour input, so this is
  the practical version of "one picker with alpha") plus an eyedropper button, feature-
  detected against `window.EyeDropper` (Chromium-only, hidden elsewhere) — swatch previews
  the actual composited rgba against a checkerboard.
- **Output format switch**: hex8 / `rgba()` / `hsl()` / `oklch()` for the generated CSS,
  independent of how layers are edited (always hex+alpha internally, for precision).
- **Paste-to-import**: parses a pasted `box-shadow`/`text-shadow` value (bare or as a full
  declaration) back into editable layers — verified live against
  `box-shadow: 0 20px 40px -10px rgba(16, 24, 40, 0.4), inset 0 -2px 0 #ffffff33;`, which
  correctly split into two layers, resolved the 8-digit hex alpha to `rgba(255, 255, 255,
  0.2)`, and preserved the negative spread and the `inset` flag.
- **Light-source mode**: one angle+distance+elevation panel recomputes x/y/blur for every
  layer coherently (deterministic function of the three inputs, not path-dependent), so a
  multi-layer stack can't end up with physically inconsistent per-layer offsets. Verified
  live: 315° (light from upper-left, the default) puts the shadow lower-right; dragging to
  123° recomputed both layers to `x:-16.8 y:-10.9` in the same frame.
- **Smooth-shadow generator**: one elevation slider replaces the current stack with a
  5-layer easing-curve shadow (the technique behind most modern soft shadows).
- **Compare A/B**: snapshot the current stack as A, keep editing as B, two boxes side by
  side, swap.
- **Three modes** share one UI: `box-shadow`, `text-shadow` (spread/inset hidden — the
  syntax doesn't have them), `filter: drop-shadow()` (same, plus paste-import is disabled
  since the parser only targets box/text syntax). The "image" shape is an inline `Star`
  icon (`lucide-react`), not a binary asset — CLAUDE.md keeps `public/` asset-free, and an
  SVG icon demonstrates the drop-shadow-vs-box-shadow contrast better than a raster PNG
  would (crisp at any size, themeable fill). **Verified live**: switching shape to the star
  in `drop-shadow` mode hugs the star's points; switching the same star to `box-shadow`
  mode shows the shadow as a rectangle around the star's bounding box — the exact
  pedagogical contrast this shape option exists for.
- **Output formats**: plain CSS block, Tailwind arbitrary value (`shadow-[...]` or
  `[filter:...]`/`[text-shadow:...]`), CSS custom property, React style object.
- **Undo/redo**: scoped to layer mutations (add/delete/reorder/preset/import, and one
  snapshot per slider *drag*, not per tick) — a full-state-per-onChange history would fill
  up with hundreds of no-op steps for one drag and make undo useless.
- **Share link + persistence**: state round-trips through a base64 URL param (`?s=...`) and
  `localStorage`, hydrated in a post-mount `useEffect` (not the initial render) so the
  server-rendered default state and the client's first paint always match — avoids a
  hydration mismatch, same reasoning as every other `window`-dependent read in this
  codebase (theme toggle, etc.).
- **Teaching**: hover/focus-scoped explanation panel per field (offset/blur/spread/colour/
  inset), a contrast note (shadow-as-hint-not-border), and a perf note that only appears
  once 3+ visible layers have blur > 30px.

**Two real bugs caught during the live pass, both fixed:**
1. **Box-shadow silently no-op'd on the "image" (star) shape.** `shapeStyle()` — the
   function that applied `boxShadow`/`filter` — was only ever called for the generic shape
   `<div>`; the `Star` icon and the text `<span>` each had their own ad-hoc inline
   conditional, and the Star's never set `boxShadow` at all (only `filter`, for drop mode).
   Switching to the star shape while in `box-shadow` mode rendered nothing. Fixed by
   extracting one `activeShadowStyle` computed once from `state.mode` and spreading it into
   all three render targets — the exact "three call sites redefining the same logic
   slightly differently" shape a bug like this comes from. Re-verified: the star now shows
   a rectangular box-shadow around its bounding box, confirmed against the drop-shadow
   version which correctly hugs the star's silhouette.
2. **The "Opacity" slider label and four layer-row button titles (drag/solo/hide-show/
   duplicate/delete) were hardcoded English inside two module-level subcomponents**
   (`ColorField`, `LayerRowContent`) that didn't have access to the `s` strings object in
   scope. Caught by actually loading the Bengali page and reading it, not by inspecting the
   i18n file in isolation — the i18n file itself was already complete;  the bug was call
   sites never threading the translated strings through. Fixed by adding `opacityLabel`/
   `eyedropperLabel`/`labels` props to both subcomponents.

**Local-server gotcha hit twice this session, noted for next time**: killing a backgrounded
`npm run start` with `pkill` inside Git Bash on Windows doesn't reliably kill the actual
Windows node process — `next start` kept reporting `EADDRINUSE` and the *old, pre-fix*
build kept serving on the port while the new one silently failed to bind. Verified via the
server's own log file, not assumption. Fixed by killing the port's actual owning PID via
`Get-NetTCPConnection -LocalPort ... | Stop-Process` (PowerShell) instead of `pkill`.

**Nav entry**: no migration needed — `parent_id` and the admin Menu screen's nesting UI
already exist from D-43. Deliberately not scripted (the admin UI already does this in two
clicks); user needs to add "Box Shadow Generator" as a child of Resources themselves.

**Skipped, deliberately** (ponytail: ship the lazy version, name what was cut): zoom got
included (5 lines, cheap) but saved/recent colour swatches did not (real state + UI for
low marginal value); Material elevations 2 and 4 are skipped in favour of 1/3/5 as a
representative ramp; the smooth-shadow curve is a reasonable approximation, not pixel-tuned
against a reference implementation — the shape of the curve is the point, not exact
matching.

**Verified:** `tsc --noEmit` clean; fully clean rebuild (`rm -rf .next`) clean, both routes
`○` static; `.next/static/` grepped for secret names — no matches; `/box-shadow-generator`
redirects to `/tools/box-shadow-generator`. Live browser pass: multi-layer stack, drag-to-
set-offset, undo, all three modes, the star shape's box-shadow-vs-drop-shadow contrast, a
real preset (Glow), light-source mode's coherent recompute, paste-import with a realistic
multi-layer/inset/8-digit-hex input, and the fully-translated Bengali page (post-fix) — all
confirmed working, clean console.

---

## D-45 · Gradient Generator (`/tools/gradient`)

Next tool off `docs/TOOLS.md`'s roadmap after the user asked what else would help students
and developers — the two "Outstanding promises" were flagged as the highest-value/lowest-
cost items (advertised by the old Jekyll nav, both 404 on the live site), and the user
picked the gradient generator first.

**Shared code reused, not duplicated.** Before writing anything new: `splitTopLevel()` (the
paren-aware comma splitter) moved from `lib/box-shadow.ts` into `lib/color.ts` since the
gradient parser needs the identical logic; `uid()` moved from `lib/box-shadow.ts` into
`lib/utils.ts` (now used by both layer and gradient-stop factories). `lib/box-shadow.ts`
updated to import both rather than keep its own copies. No behaviour change, confirmed by
`tsc --noEmit` clean before touching anything gradient-specific.

**`NAMED_COLORS` in `lib/color.ts` expanded from 8 keywords to the full CSS1 basic set (16)
plus a handful of commonly-pasted extras (orange, pink, brown, gold, indigo, violet) — 25
total.** The box-shadow parser rarely meets a named colour, but gradient examples reach for
`red, yellow, green` constantly (it's the canonical test string), and the old table was
missing `yellow` entirely — any pasted gradient using it would have silently resolved to
black. Caught before shipping by writing a real paste-import test case with named colours,
not by inspecting the table.

**`lib/gradient.ts`** — `GradientSpec`/`Stop` types, `gradientValue()` (generates real CSS
Color 4 syntax: `linear-gradient(<angle>deg [in oklch]?, ...)`, `radial-gradient(<shape>
<size> at X% Y% [in oklch]?, ...)`, `conic-gradient(from <angle>deg at X% Y% [in oklch]?,
...)` — the interpolation hint is genuine browser syntax, never simulated), `colorAtPosition()`
(sRGB lerp between neighbouring stops, used to give a newly-inserted stop a sensible
starting colour), the paste-import parser (same pragmatic-not-full-CSS-grammar approach as
the shadow parser — handles angle/`to <side>`/shape+size keywords/`at X% Y%`/an `in oklch`
hint/named+hex+rgba colours with or without explicit positions, degrades to even
auto-distribution otherwise), and 8 presets (sunset, ocean, forest, candy, subtle UI
background, glass, mesh-ish — one off-centre radial rather than true stacked-layer mesh,
documented as the deliberate simplification it is — and a mono conic).

**`lib/gradient-i18n.ts`** — full EN/BN, same convention.

**`components/tools/gradient-demo.tsx`** — three columns (type + stops / comparison canvas
/ presets + output). Notable pieces:
- **`GradientBar`** — the standard gradient-editor UX (Figma/Photoshop pattern): a
  horizontal strip rendering the current stops as a flat left-to-right gradient regardless
  of the actual type/angle (built by reusing `gradientValue()` with `{ kind: 'linear',
  angle: 90 }` rather than a second code path), click empty space to insert a stop at that
  position, drag a handle to reposition. A compact list below duplicates select/delete for
  keyboard access, same reasoning as the box-shadow layer list.
- **sRGB vs OKLCH shown side by side unconditionally**, not behind a toggle — that
  comparison *is* the tool's reason for existing over any generic gradient generator, so it
  isn't optional. A separate "which one goes into the copied CSS" selector is genuinely
  optional and is a toggle.
- **Drag directly on either preview swatch**: for linear, drag angle from the pointer's
  angle relative to the swatch center (`atan2`, matches the angle math already established
  in the box-shadow generator's light-source mode); for radial/conic, drag sets the center
  position. Verified live: dragging on a radial swatch recomputed `at 19% 14%` in the same
  frame the slider values updated.
- Output formats: CSS block (`.gradient { background-image: ...; }` — the correct property
  for a gradient, not the `background` shorthand, which would misleadingly imply resetting
  other background-* properties), Tailwind arbitrary (`bg-[...]`), CSS variable, React
  style.
- Undo/redo scoped to structural edits (add/delete/move-stop-per-drag/preset/import), same
  drag-gesture-batching as the shadow tool's `onDragStart` pattern.
- Share link + localStorage, same post-mount-hydration pattern (avoids the SSR/client
  mismatch class of bug).

**No real bugs found in the tool logic itself this session** — the `NAMED_COLORS` gap above
was caught and fixed *before* it ever reached the live tool, not after. One test-harness
false alarm during the live pass: a paste-import test appeared to fail with a stray leading
character in the textarea; turned out to be a keystroke-simulation artifact (Ctrl+A racing
the typed text), not a parser bug — confirmed by setting the textarea value directly via JS
and re-running the same input successfully.

**Nav entry**: not yet added — same as box-shadow generator, needs Admin → Menu, no
migration.

**Verified:** `tsc --noEmit` clean; fully clean rebuild (`rm -rf .next`) clean, both routes
`○` static; `.next/static/` grepped for secret names — no matches. Live browser pass: all
three gradient types, click-to-insert and drag-to-move on the stop bar, drag-on-canvas for
both angle (linear) and center (radial), a real visible sRGB-vs-OKLCH difference confirmed
by zooming into the two swatches, paste-import with named colours + an `in oklch` hint
(correctly auto-selected the OKLCH output tab), reset, and the fully-translated Bengali
page — all confirmed working, clean console (verified via `read_console_messages`, not just
visual inspection).

---

## D-46 · Flexbox Playground (`/tools/flexbox`)

Third tool off `docs/TOOLS.md`'s roadmap. Per the recommended build order from the original
tool-ideas answer (gradient → flexbox → scrollbar → specificity → contrast studio), this is
next — Tier 1, "most-wanted CSS tool that exists."

**Real content gap found before writing any code.** Grepped `docs-master/docs-master/
_docs/css` for `display:\s*flex|flexbox` — zero real hits (`css-float.md`'s one match is
footer-nav chrome, not lesson content). **The old curriculum has no flexbox lesson at all.**
Worth surfacing on its own, separate from this tool: `css-align.md` teaches `margin: auto`
centering, i.e. the pre-flexbox technique. The playground's CTA points at the CSS category
listing instead of a specific lesson (same fallback as the shadow/gradient tools), and its
own explanation panel carries the full teaching load since there's nothing to link to.

**No drag-to-reorder — a deliberate design decision, not a missing feature.** Every other
tool in this project uses direct-manipulation dragging (box-shadow's offset, gradient's
stops/angle/center) because dragging maps naturally to a *position*. `order` is not a
position — it's an independent property whose entire teaching point is that visual order
and DOM/HTML order can diverge. Implementing drag-to-reorder here would have meant either
(a) silently reassigning `order` values to match the new visual sequence on every drag,
which collapses `order` back into "just array position" and teaches nothing, or (b)
reordering the underlying item array, which changes what `order` is even a demo of. Instead:
the item array order is permanently fixed (it *is* the HTML/DOM order), each item carries a
persistent number badge showing that fixed position, and `order` is edited as an ordinary
slider (-5 to 5) in the per-item panel. The "Wrap & reorder" preset is built specifically to
make this visible: item 2 gets `order: -1` and visibly jumps to the front of the layout
while its badge still reads "2" — verified live, exactly as designed.

**Presets: "holy grail" and "sticky footer" (as originally scoped in the roadmap) dropped
in favour of ones that actually fit the tool's model.** Both need something this tool
doesn't represent — holy grail needs nested containers (header / 3-column middle / footer),
sticky footer needs `margin-top: auto` on one item, a property outside the grow/shrink/
basis/order/align-self set the per-item editor exposes. Building either would have meant
either lying about what's being demonstrated or quietly extending the item model for one
preset. Replaced with Navbar, Sidebar layout, Centered, Equal columns, and Wrap & reorder —
all five genuinely single-flat-container demos, same honesty-over-completeness call as
gradient.ts's "mesh-ish" preset in D-45.

**`lib/flexbox.ts`** — `Container`/`FlexItem` types, `containerStyle()`/`itemStyle()` (real
inline styles the canvas actually renders — not a separate representation that could drift
from what CSS generation describes), `generateCss()`/`generateTailwind()`/`generateReact()`
(each only emits declarations that differ from the flex default, matching how a person
would actually write it — a container with default `align-items: stretch` never gets an
explicit line for it), and the 5 presets.

**`components/tools/flexbox-demo.tsx`** — three columns (container + items / live canvas /
presets + output). The canvas *is* the primary editing surface as much as a preview: click
an item to select it, and every item shows its real `ResizeObserver`-measured size (not
computed from the flex values, which could drift from what's actually rendered — same
house rule as every other tool here). `align-content` is visibly dimmed when `flex-wrap` is
`nowrap`, since it has no effect until wrapping produces multiple lines. Output is 3 formats
(CSS/Tailwind/React), not the 4-format convention from the shadow/gradient tools — no
CSS-variable tab, since a flex layout is inherently several rules across several elements,
not a single value a custom property could hold.

**No real product bugs found this session.** One authoring mistake caught and fixed before
verification: the closing teaching-note panel originally concatenated two unrelated i18n
strings (`s.measured` + `s.domOrderNote`) into a nonsensical sentence — caught on a read-
through of the JSX, not by testing, since it would have rendered fine, just meaninglessly.
Fixed by dropping the unused `measured` string entirely and keeping just the DOM-order note.

**Nav entry**: not yet added — same as the other two /tools additions, needs Admin → Menu,
no migration.

**Verified:** `tsc --noEmit` clean; fully clean rebuild (`rm -rf .next`) clean, both routes
`○` static; `.next/static/` grepped for secret names — no matches. Live browser pass: all
five presets (including a direct visual confirmation of the order-vs-DOM-position split via
Wrap & reorder), real measured item sizes updating live, all three output formats, and the
fully-translated Bengali page — all confirmed working, clean console (`read_console_messages`
after a fresh navigation, not just a visual check). One CDP screenshot timeout mid-session
was a transient tooling hiccup, not a hang — confirmed by an immediate successful retry
showing correct, fully-settled state.

---

## D-47 · Fix a real hydration bug across all three /tools demos (box-shadow, gradient, flexbox)

User spotted a Next.js dev-overlay hydration error on the flexbox page (`data-item-id`
mismatch between server and client) and reported it with a screenshot mid-session, while
work on the Scrollbar App had already started.

**Root cause**: `useState<State>(defaultState)` in all three components passes the
`defaultState` function itself as React's lazy-initializer, and `defaultState()` builds its
initial layers/stops/items via `makeLayer()`/`makeStop()`/`makeItem()`, each of which calls
`uid()` (`crypto.randomUUID()`) to generate an id. React's lazy initializer runs once on
the **server** during SSR and *independently again* on the **client** during hydration's
first render — two separate calls to `uid()`, two different ids, and the id ends up in the
DOM as `data-item-id`/`data-layer-id`-equivalent attributes and `key` props. Every
`/tools/box-shadow-generator`, `/tools/gradient`, and `/tools/flexbox` page load has been
doing this since each tool shipped (D-44, D-45, D-46) — it just never surfaced in a Console
Error overlay the way the flexbox one visibly did.

**Why my own testing missed it three times in a row.** Every verification pass this project
has done used `mcp__claude-in-chrome__read_console_messages` *after* navigating, but that
tool's listener attaches lazily on first call — per its own returned note, messages emitted
before the first call are simply gone. A hydration warning fires within the first commit,
milliseconds after navigation completes, so "navigate, then check console" was structurally
incapable of catching this. Corrected going forward: attach the listener (one
`read_console_messages` call, any pattern) **before** navigating, so it's live for the
actual page load.

**Fix**: `makeLayer()`, `makeStop()`, and `makeItem()` each gained an optional second `id?:
string` parameter (falls back to `uid()` when omitted). Each tool's `defaultState()` now
passes fixed literal ids (`'default-1'`, `'default-2'`, …) for its initial set instead of
letting them default to a fresh random uuid. Every *other* call site — `addLayer`,
`duplicateLayer`, `addStop`, `insertStopAt`, `addItem` — is a client-only event handler that
never runs during SSR, so those keep using real `uid()` unchanged; they were never part of
the bug. Grepped all three component files for any other `uid()`/`randomUUID`/`Math.random`/
`Date.now` call outside the lib factories to confirm this was the only source of
render-time non-determinism — none found.

**Verified properly this time**: for each of the three tools, attached the console listener
*before* navigating (not after), did a fresh full-page navigation, and confirmed zero
console output — genuinely zero messages, not just zero errors. Additionally cleared
`localStorage` and re-verified on the gradient and flexbox pages specifically to rule out a
stale saved-state effect masking the check, then read the live DOM's `data-item-id`
attributes directly on flexbox and confirmed they render as the new fixed
`default-1`/`default-2`/`default-3` values, not random ids.

---

## D-48 · Scrollbar App (`/tools/scrollbar`) — the last old-nav promise, closed

User asked to build the Scrollbar App specifically, the fourth and final tool the old
Jekyll nav advertised (`_includes/nav.html`) that had never actually been built — confirmed
404ing on the live site back in the original tool-ideas research. With this, every tool the
old site promised now exists.

**Real content this tool has that the others don't**: a genuine paired lesson.
`css/pseudo-elements` exists and is published (confirmed live — clicked through from the
tool and landed on real rendered content, not a 404), unlike the box-shadow/gradient/
flexbox tools which all fall back to a category-listing CTA. **Caught and fixed a wrong
lesson URL before shipping**: first wrote `/css/css-pseudo-elements` (the old Jekyll
permalink), but `scripts/url-map.json` shows the actual current slug is `/css/pseudo-
elements` — the "css-" prefix was dropped in the URL redesign, same pattern as the box
model demo's `/css/boxmodel`. Checked the map file instead of assuming from memory of the
box-model precedent, and it caught a real mistake.

**Two systems, generated together, both real**: the standard `scrollbar-width`/
`scrollbar-color` and every `::-webkit-scrollbar` part, both driven from the same
underlying colour choices (one thumb colour, one track colour — a real developer wants
cross-browser consistency, not two independent palettes to keep in sync by hand). Rendered
via CSS custom properties on the actual previewed element, read by a static stylesheet
(`PREVIEW_STYLESHEET` in `lib/scrollbar.ts`) — the preview and the copyable CSS output can
never disagree because they're generated from the same state by construction, not two
independent code paths that happen to currently produce the same numbers.

**Honest support note, not just decoration**: `scrollbar-width`/`scrollbar-color` are
Firefox-and-newer-Chromium; `::-webkit-scrollbar` is WebKit/Blink-only and Firefox drops
every rule silently. Deliberately avoided citing specific version numbers for the more
recent Chromium support (can't verify precise cutoffs without live browser access) — stated
the relative truth (engine family, "added more recently") instead of a number that could be
stale or wrong.

**No Tailwind output tab** — core Tailwind ships no scrollbar utilities; the plugin that
adds them isn't part of this project, so generating classes assuming its presence would
produce copy that silently doesn't work. Documented as a deliberate omission in the UI
itself (`s.noTailwindNote`), not just left unexplained.

**Real bug found and fixed during the live pass — and a second, smaller one after that.**
1. Hover-hint text was silently broken for four of six field groups (track, thumb, corner,
   buttons): `{...hintProps(key)}` was spread directly onto the `<Section>` component, which
   only destructures `title`/`children`/`action` and drops everything else — the mouse
   handlers never reached any actual DOM element, so hover would have done nothing, with no
   type error to catch it (JSX spread attributes bypass TypeScript's excess-property
   checking). Caught by reading through the file structurally against the two field groups
   that *did* wrap a `<div>` correctly, not by testing — the bug wouldn't have thrown, just
   silently done nothing. Fixed by moving every `hintProps()` spread onto a wrapping `<div>`
   inside each `<Section>`.
2. The "no arrow glyph is drawn" claim in the buttons-field description turned out to be
   wrong: verified live in Chrome that `::-webkit-scrollbar-button` renders Chrome's own
   native arrow icon automatically once given a size, no drawing required — visible via a
   zoomed screenshot of the horizontal scrollbar's left button cap. The tool's own teaching
   copy was making a factual claim about browser behaviour that turned out false; fixed the
   EN/BN description before shipping rather than leaving a plausible-sounding but incorrect
   explanation in a *teaching* tool, which would have been worse than most bugs.

**Unrelated finding, not fixed (out of scope)**: doc lesson pages' browser tab title is
duplicated — `"CSS Pseudo Elements | Learn Computer Academy | Learn Computer Academy"`,
site name appended twice. Confirmed pre-existing (reproduces on `/css/pseudo-elements`,
a route untouched by this session) and unrelated to anything built here. Not investigated
further or fixed — flagged for a future session. New Open item O-16.

**Verified:** `tsc --noEmit` clean; fully clean rebuild (`rm -rf .next`) clean, both routes
`○` static; `.next/static/` grepped for secret names — no matches; `/scrollbar` redirects to
`/tools/scrollbar`. Live browser pass, listener attached before navigating throughout (per
the corrected process from D-47): zero console output on a fresh load; a genuinely styled
`::-webkit-scrollbar` visibly different from the browser default (zoomed screenshot); the
Neon preset applied correctly with live re-render; horizontal axis switching real overflow
content; the buttons toggle producing a real native arrow glyph; both output tabs; the
Bengali page including a working click-through to the real, published linked lesson.

---

## D-49 · Tools index page, site-wide scrollbar CSS, Specificity Calculator, Colour & Contrast Studio

Four related pieces of work in one session, in the order the user asked for them.

### `/tools` index page

The thing `docs/TOOLS.md` flagged as necessary "once there are more than four" — seven now.
`components/tools-index.tsx` + `lib/tools-index-i18n.ts` (a plain hand-maintained array —
deliberately not derived from `docs/TOOLS.md`'s own table, so the two can drift if only one
gets updated; flagged in TOOLS.md itself as a thing to remember). `/tools` and `/bn/tools`,
both in `sitemap.ts`.

**Caught two wrong lesson URLs before they ever shipped**, both by checking
`scripts/url-map.json` rather than guessing from the old Jekyll permalinks (same discipline
as D-48's `pseudo-elements` catch): the specificity lesson is `/css/specificity`, not
`/css/css-specificity` — got this one wrong on the *first* attempt in this exact file
before checking the map, exactly the mistake the map-check exists to catch. `/css/colors`
was correct on the first guess.

### Site-wide minimal scrollbar

User supplied exact CSS (thin, transparent track, `#cbd5e1` thumb → `#94a3b8` on hover,
8px, 8px radius) and asked for it applied "throughout the website," not as an opt-in class.
Added to `app/globals.css` via `html { scrollbar-width; scrollbar-color }` (inherited,
covers the standard system) and `*::-webkit-scrollbar` (universal selector, covers every
scrollable element without hunting each one down individually). Dark variant
(`#475569` → `#64748b`) keyed off `html.dark`, matching where the existing theme-toggle
script actually applies the class (`document.documentElement`, confirmed in
`app/layout.tsx` before writing the selector — guessing `.dark *::-webkit-scrollbar-thumb`
without checking would have silently never matched, since `:is(.dark *)` requires a
descendant and the class sits on `<html>` itself, not an ancestor of it). Verified live in
both themes via zoomed screenshots on a real doc page's scrollbar — not just visual
inspection, an actual zoom crop confirming the exact rendered thumb colour in each theme.

### CSS Specificity Calculator (`/tools/specificity`)

A real tokenizer against the CSS Selectors spec — not the common regex-count shortcut most
"specificity calculators" use, which gets `:not()`/`:is()`/`:has()`/`:where()` wrong.
**Verified against 14 test cases before any UI existed**, covering exactly the cases a
shortcut fails: `:is(#a, .b)` scores as `#a` alone (the max-specificity-branch rule, not a
sum); `:where(#a)` scores `(0,0,0)` even with an ID inside; combinators and `*` contribute
nothing; legacy single-colon pseudo-elements (`:before` etc.) count as pseudo-elements, not
pseudo-classes. All 14 passed on the first run.

Two modes: Calculate (paste one selector or a comma-list, get a colour-coded `(a, b, c)`
breakdown per selector) and Compare (two selectors, a plain-English "decided by the {tier}
column: X vs Y" call-out — not just a winner, the reason). The colour-coded token rendering
is a *second*, deliberately separate tokenizer (`tokenizeForDisplay`) from the scoring one —
documented in the code as an intentional non-DRY choice: unifying "produce a correct number"
and "produce display segments including a dimmed `:where()` branch that must never reach the
score" into one function would have made the already-verified scoring logic harder to trust,
for no real benefit.

### Colour & Contrast Studio (`/tools/colour`)

`lib/contrast.ts`: WCAG relative luminance and contrast ratio, hue-rotation palette
generation (complementary/triadic/analogous/split-complementary — same saturation/lightness
as the base, only hue rotates) plus a tint/shade ramp, and a colour-blindness simulation
(protanopia/deuteranopia/tritanopia).

**The WCAG luminance formula is deliberately its own function, not a reuse of
`lib/color.ts`'s existing `srgbToLinear`.** That function serves the OKLCH conversion used
by the shadow/gradient tools and uses the true sRGB EOTF threshold (0.04045). WCAG 2.x's
own published formula uses a *different* threshold (0.03928) — a well-known discrepancy in
the spec text that every real-world contrast checker (axe-core, Lighthouse, browser
devtools) replicates literally rather than "fixing," because matching their number is the
entire point of building a WCAG checker. Verified against the well-known reference values
before writing any UI: black/white = 21:1 exactly, and the canonical `#767676`-on-white
boundary case = 4.54:1 (the one-hex-step-darker `#777777` = 4.48:1, correctly on the other
side of AA).

**Colour-blindness simulation is an explicit, documented approximation** — matrices applied
directly to gamma-corrected sRGB rather than linearised LMS cone-response space, which is
what a rigorous simulation does. This is the same approach most browser-extension
simulators use; the UI says so explicitly ("good enough to show a real problem, not a
clinical diagnostic tool") rather than implying more precision than it has.

**Real bug caught and fixed before shipping, not after**: the hover-hint mechanism
(`hintField`/`hintProps`, copied from the pattern in earlier tools) was wired onto 4 field
groups but only 1 ever rendered its hint text — the other 3 set state that nothing read.
Worse, one of the three spread `hintProps()` directly onto a `<Section>` component, the
*exact* bug from D-48 (`Section` only destructures `title`/`children`/`action` and silently
drops anything else — no type error, since JSX spread bypasses excess-property checking).
Caught this time before it ever reached a browser, by re-reading the file structurally
rather than waiting to notice broken hover behaviour live. Removed the whole
half-working mechanism rather than patching it — the tool already had unconditionally
-visible description text for the two fields that mattered most, which is simpler and was
already proven better UX than hover-gated text for this particular tool.

Export as CSS variables or a Tailwind `@theme` block — the latter matches this project's
own Tailwind v4 CSS-first config (`app/globals.css`'s own `@theme inline { ... }`), not the
legacy JS `tailwind.config.js` colours-object convention many older tools would generate.

**Verified:** `tsc --noEmit` clean; fully clean rebuild (`rm -rf .next`) clean, all four new
routes (`/tools`, `/tools/specificity`, `/tools/colour`, plus their `/bn/` pairs) `○`
static; `.next/static/` grepped for secret names — no matches. Live browser pass, listener
attached before navigating throughout: zero console output on every page; the tools index
card grid; the specificity calculator's default selector computing exactly `(0, 3, 5)` as
hand-verified, Compare mode correctly identifying which column decided a real `:is()` case;
the contrast studio's complementary palette, live WCAG badges recolouring correctly, the
colour-blind trap preset (1.27:1, fails everything) visibly collapsing to a muddy
indistinguishable pair under deuteranopia; both new lesson links (`css/colors`,
`css/specificity`) resolving to real published content, not 404s; both Bengali pages.

---

## D-50 · Grid Generator

`/tools/grid`, the first of Tier 1's two tools from `docs/TOOLS.md`'s roadmap (CSS Units
Playground is the other, still unbuilt) and the item explicitly promised there: "drag items
across cells."

**Model** (`lib/grid.ts`): `Track = {mode: 'fr'|'px'|'auto'|'minmax', ...}`, one array each
for `columns`/`rows`; `GridItem = {colStart, colEnd, rowStart, rowEnd, ...}`, explicit
1-indexed exclusive-end grid lines, same convention CSS Grid itself uses. `minmax()` is
hardcoded to px-min/fr-max — `minmax(150px, 1fr)` is overwhelmingly the common real case,
matching the box-shadow/gradient/flexbox tools' own documented simplifications. CSS/
Tailwind/React generators mirror `lib/flexbox.ts` line for line: only non-default
declarations get emitted, Tailwind uses arbitrary-value brackets throughout since named
utilities can't express arbitrary track mixes or line placement.

**`grid-template-areas` is derived, one-way only** — items rasterize into a name matrix,
never the reverse. Reverse-parsing typed ASCII art back into a valid non-overlapping
placement is a real constraint-solving problem; deriving the string from an already-valid
rectangle layout is filling a matrix. The pedagogical value is seeing your dragged layout
*as* an area string, not typing one by hand. Duplicate item names and overlapping
placements both surface as an explanatory note instead of a broken string — verified with a
standalone Node script before any UI existed (holy-grail layout → correct 3-row area
string; a deliberately overlapping pair → `overlap`; two items same name → `duplicate-name`
— all three cases matched by hand).

**Canvas: one grid, not two overlaid layers.** Every cell is either covered by an item or
isn't — never both — so items and "empty cell" drag-target markers render as siblings in
the same real `display: grid` container, using each cell's own `gridColumn`/`gridRow`
rather than absolute-position overlays. Dragging across empty-cell markers (pointerdown
sets an anchor, pointerenter on further markers updates the live selection while dragging,
a window-level `pointerup` commits) previews the rectangle and creates a new item on
release; a rectangle that crosses an already-occupied cell is rejected with an explanatory
note rather than silently clipped. Existing items are click-to-select and edited with
numeric line-number sliders — never drag-resized, the same simplification the flexbox
playground already made for `order` (explicit inputs over implying positional dragging that
isn't really what's happening).

**Presets** (5, matching `docs/TOOLS.md`'s pitch): Holy grail layout (the one Flexbox's flat
single-container model explicitly couldn't do — D-46 noted its absence there), Bootstrap-
style 12-column (explicit callback to CLAUDE.md's note that the old site's Bootstrap grid
was dropped entirely — this is what replaces it), Dashboard, Named areas demo (a simple 2×2
chosen specifically to make the derived area string easy to read at a glance), Photo grid
(documents that `repeat(auto-fill, minmax(...))` dynamic track counts are out of scope —
fixed explicit track counts only, same "worth naming the ceiling" pattern as the minmax
simplification above).

Lesson link: `/css/display-visibility` (`/bn/css/display-visibility`) — checked against
`scripts/url-map.json` before writing it in, not assumed from the old Jekyll permalink form
(`css-display-visibility`). `/css/align` was also verified as a real, correct slug during
planning but isn't used as the single CTA link — kept in mind for a future cross-reference
if one of the alignment-property description panels ever needs one, not added speculatively
this round.

**Verified:** `tsc --noEmit` clean; full `rm -rf .next` rebuild clean, `/tools/grid` and
`/bn/tools/grid` both `○` static; `.next/static/` grepped for secret names — no matches.
Live browser pass, console listener attached before navigating: zero console output on
every page touched. Single-cell drag-to-place confirmed working end-to-end (anchor → commit
→ new item appears → area string and CSS regenerate correctly). Deleting an item correctly
frees its cell as a drag target and the derived area string correctly shows `.` for it.
Holy-grail preset applied and hand-checked against expected output in all three export
formats (CSS/Tailwind/React) plus the derived `grid-template-areas` block — all matched.
Both locales checked; `/tools` index card renders with its new icon. **Not** independently
verified live: a true multi-cell drag crossing more than one cell, and the mid-drag overlap
rejection path — the browser-automation harness available this session sends a drag as a
bare press+release with no intermediate move events, so `pointerenter` never fires on
interior cells; a real mouse fires continuous enter/leave transitions per the DOM spec as it
crosses each cell, so this is a tooling gap rather than a known defect, but it's flagged
here rather than silently claimed as tested. The anchor/current/commit code path itself is
exactly what the verified single-cell case already exercises end to end, just with `anchor
=== current`.

---

## D-51 · Optimistic UI for admin reordering (nav Menu + docs-within-category)

User complaint: reordering/nesting items in the admin Menu screen, and reordering docs
within a category, both visibly waited a few seconds — the row snapped back to its old
position until the mutation resolved and `router.refresh()` re-rendered with fresh server
data. An inventory (background Explore agent) of every drag/reorder/position-change UI
under `app/admin/**` found exactly two places with this gap:

- **`components/admin/nav-manager.tsx`** — every mutation (move up/down, indent/outdent,
  create, update, delete) went through a shared `run()` that awaited the server action and
  then called `router.refresh()`, with no local list state at all — the flattened `roots`/
  `childrenOf`/render list was derived straight from the `items` prop every time. Nothing
  moved until the full round trip landed.
- **`components/admin/docs-list.tsx`** — category-level reordering was *already* optimistic
  (a `categoryOrder` local-state array, set immediately before the transition, with a
  comment explaining exactly why: "so a reorder doesn't need to wait on `router.refresh()`
  to feel instant"). Doc-within-category reordering (`persistOrder`/`onDragEnd`/
  `moveByOne`) had no equivalent — it derived order straight from `docs[].sort_order`,
  same gap as the nav manager.

**Fix, nav manager:** React 19's `useOptimistic(items, navReducer)` — the exact tool for
this shape of problem. Every action (`move`, `setParent`, `update`, `delete`, `create`) is
dispatched via `applyOptimistic()` synchronously at the top of the existing `startTransition`
block, before `await`ing the server call. `move` recomputes `sort_order` from the reordered
id list; `setParent` (indent/outdent) predicts the new `sort_order` the server will assign
(`existing sibling count + 1` — mirrors `setNavParent`'s own `count`-then-`insert-at-end`
logic exactly, so the optimistic position matches the eventual real one); `delete`
mirrors the DB's on-delete cascade (migration 008) by also dropping optimistic children;
`create` shows a `temp-${Date.now()}`-id placeholder that's invisibly swapped for the real
row once `router.refresh()` lands. On success, the transition's `router.refresh()` delivers
a new `items` prop that already matches the optimistic state, so there's no revert-then-
reapply flicker — React only clears the optimistic overlay once the new base state commits,
same render. On failure (the `catch` branch — no `router.refresh()` call), the transition
ends without a new `items` prop ever arriving, so React reverts to the pre-action list
automatically — no manual rollback code needed. `onCreate`/`onUpdate` also close their forms
(`setCreating(false)`/`setEditingId(null)`) synchronously rather than after the `await`, so
the form UI itself doesn't lag either.

**Fix, docs list:** copied the already-working `categoryOrder` pattern one level down —
`docOrderByCategory: Map<categoryId, string[]>`, one order array per category (`sort_order`
is scoped per category server-side, not global, so a flat single array would've been wrong).
`persistOrder` now takes a `categoryId` and calls `setDocOrderByCategory` immediately, before
the transition. The `groups` memo overlays this order onto the server-sorted list, falling
back to server order for any doc id not yet in the map (a doc created or moved into the
category since the map was initialized) — a small robustness addition beyond what
`categoryOrder` itself does, since docs churn (create/delete/move) far more often than
categories do.

**Scope decision:** the user's complaint was specifically about position/reorder actions.
Publish/unpublish, delete, and bulk-publish in the same file already show their effect only
after `router.refresh()` too, but weren't flagged and aren't "position" changes — left as-is
rather than expanding scope unrequested. The Explore agent's inventory also confirmed no
other admin screen (categories, resources, media, pages) has any reorder UI at all.

**Verified:** `tsc --noEmit` clean; full `rm -rf .next` rebuild clean, `/admin/menu` and
`/admin/docs` both still render (`ƒ` dynamic, as before — no route-type regression). **Not
live-clicked**: reordering in the admin Menu screen writes directly to the production
Supabase `nav_items` table and changes the real site's live header nav — clicking move/
indent/delete buttons to test would be a real, if reversible, production mutation, so it
wasn't done without asking first. Verification here is the type check, the clean build, and
line-by-line review of the `useOptimistic` reducer against each server action's actual
behavior (`setNavParent`'s sibling-count logic in particular, checked in `lib/admin/nav.ts`
to make sure the optimistic `sort_order` prediction matches what the server will actually
assign).

---

## D-52 · Real wordmark logo (light/dark), Cloudinary-hosted, admin-replaceable

User supplied two new logo files from the source design folder (not this repo) — `16.png`
(black text, for the light-theme header) and `17.png` (white text, for the dark-theme
header), both with "Learn Computer Academy" already baked into the artwork as a single
wordmark image, not an icon-plus-separate-text lockup.

**Uploaded via `scripts/upload-logo.mjs`** (new, one-off) to Cloudinary at
`docs/img/site/logo-light` / `docs/img/site/logo-dark` — `docs/ASSETS.md`'s existing
"anything not lesson-specific" folder — with `overwrite: true`, so the delivery URL (and
hence the public_id stored in settings) never has to change on a re-upload, only the bytes
behind it do. `f_auto,q_auto,c_limit,w_480` at request time (same convention as every other
image on this site) — the header displays these at ~32px tall / ~180px wide, so 480 leaves
2–3x retina headroom while shipping nowhere near the ~350–370 KB, several-thousand-px
originals.

**Header change** (`components/site-header.tsx`): replaced the old `<img
src="/logo-icon.png">` (icon only) + a separate `<span>{siteName}</span>` text lockup with
two full-wordmark `<img>` tags, swapped via Tailwind's `dark:` variant
(`dark:hidden`/`hidden dark:block`), not the component's own `dark` React state. That state
starts `false` on every render until a `useEffect` corrects it client-side — swapping the
logo on it would flash the light-mode (black-text) logo for one frame on every dark-mode
page load. The `dark` class on `<html>` is already set before paint by `app/layout.tsx`'s
inline script (D-... theme flash prevention), so a pure-CSS swap keyed off that same class
is correct from the very first paint, no flash possible. The visible text span is gone
entirely — the artwork *is* the text now — replaced by real `alt` text on both images for
accessibility/SEO, sourced from `strings.siteName` same as before.

**Admin-replaceable, not hardcoded** — the actual ask, not just a one-time asset swap.
Added a `'branding'` `site_settings` key (no migration — same no-fixed-enum upsert pattern
`'seo'` used, see `lib/admin/settings.ts`'s existing comment) holding
`{ logoLightPublicId, logoDarkPublicId }`, `null`/absent meaning "use the just-uploaded
defaults" (`DEFAULT_LOGO_LIGHT_PUBLIC_ID`/`DEFAULT_LOGO_DARK_PUBLIC_ID`, `lib/cloudinary.ts`).
New `lib/admin/branding.ts` → `uploadLogo(variant, formData)`: always uploads to the *same*
fixed key per variant (`docs/img/site/logo-light.png` / `-dark.png`), not a
timestamped `media/...` key like the general media library — every future re-upload
overwrites the same asset rather than accumulating orphaned Cloudinary uploads or needing a
new URL written back into settings each time. New `/admin/settings` "Branding" section
(`components/admin/branding-manager.tsx`) — two upload cards with light/dark-background
swatches so the preview actually shows contrast the way the real header will, using the
exact same `cldUrl(...,'f_auto,q_auto,c_limit,w_480')` transform the live header requests,
not a separate admin-only rendering that could drift from reality.

**Plumbing**: `app/layout.tsx` fetches `getSiteSettings('branding')` alongside the existing
`getNavItems()` (same `Promise.all`, same pattern), resolves both logo URLs once via
`cldUrl`, and passes them down through `SiteChrome` → `SiteHeader` as props — server-
resolved, not fetched client-side, so no extra request or loading state in the header
itself. `saveSettings`'s `'branding'` case revalidates `revalidatePath('/', 'layout')`
(header renders on every route, same reasoning as `'seo'`), not the homepage-only path the
other settings keys use.

**Scope, respected**: user said these logos are for the header only. Did not touch the
favicon or the `openGraph.images` OG-image reference — both still point at the old
`public/logo-icon.png`, untouched, since that's a different use case the user didn't ask to
change.

**Verified**: `tsc --noEmit` clean; full `rm -rf .next` rebuild clean, `/` stays `○` static
(branding fetch uses the same tagged `unstable_cache` as every other `getSiteSettings` read,
no new dynamic API); `.next/static/` grepped for secret names — no matches. Live browser
pass: light-mode header shows the black-text wordmark, toggling dark mode swaps to the
white-text wordmark with no flash and no console output either time; `/admin/settings`
renders both upload cards with live Cloudinary previews on correct light/dark swatches, no
console errors. **Not done**: did not click "Upload" to test a live re-upload end-to-end —
the code path is the same `uploadFile`/Cloudinary flow already proven by both the upload
script (this session) and the existing media library (prior sessions), so re-testing it live
would only re-verify already-proven plumbing, not the new part (the fixed-key/settings
wiring), which was verified by type-checking and reading the code path instead.

`docs/ASSETS.md` updated: the "Logo → `public/`" row split into favicons/OG (still
`public/`) and the header logo (now Cloudinary, admin-replaceable) — the old row was flatly
wrong the moment this shipped, so left uncorrected it would have misled the next session.

---

## D-53 · Computer Basics rebuild, pilot lesson (D-52's content pipeline in real use)

First real run of `docs/CONTENT-PIPELINE.md` (D-... the pipeline doc itself, written this
session before this run). The existing `basics` category held exactly one doc,
`basics/computer-fundamentals`, 104 blocks stacking 16 chapters via headings inside a single
page — not 16 real lessons. User asked to delete it and rebuild as real separate lessons.

**Outline approved before writing anything** (pipeline §0's own rule): 16 lessons, same
topic breadth as the old page, sequenced intro → history → hardware/I-O/memory/storage →
number systems → software/OS → networking/internet/security → applications → quantum/AI.
Old URL `/basics/computer-fundamentals` gets a 301 to the new `/basics/what-is-a-computer`
once the full rebuild is done — deferred, not part of this run, since the old page stays
live and useful until every replacement lesson actually exists.

**Given a 30-minute time budget, built one pilot lesson end-to-end** rather than rushing
all 16 — `basics/what-is-a-computer`, EN + BN, one image, published, fully verified — as a
calibration checkpoint on voice, translation quality, and image style before committing to
doing it 15 more times. The old doc was deliberately left untouched; the pilot coexists
alongside it (`Computer Basics` sidebar temporarily shows both). The full 16-lesson rebuild,
the soft-delete of the old doc, and the redirect are explicitly not done yet.

**Two real, non-obvious things this run found, both fed back into `docs/CONTENT-PIPELINE.md`
immediately rather than left for the next run to rediscover:**

1. **`docs.path` has no unique constraint in the live database.**
   `.upsert(row, { onConflict: 'path' })` — the exact pattern
   `scripts/create-programming-section.mjs` used — fails outright: "no unique or exclusion
   constraint matching the ON CONFLICT specification." `scripts/create-basics-content.mjs`
   uses select-then-insert/update instead, which works regardless of what constraints do or
   don't exist, and is now the corrected reference pattern in the pipeline doc.
2. **Bengali heading anchors must be passed explicitly, not derived from Bengali text.** The
   `h()` block builder's anchor auto-derivation lowercases and slugifies the *text* — running
   that over Bengali text produces a Bengali-Unicode slug that would never match the English
   anchor, breaking every same-page TOC deep link and any future cross-locale link. Added an
   optional third `anchor` param to `h()`; every BN heading in the pilot passes the literal
   English anchor string, verified live by clicking a Bengali TOC entry and confirming the
   URL fragment (`#the-four-basic-operations`) matches the English page exactly.

**Image**: Magnific `gpt-2`, 1k/medium (130 credits), a labelled Input→Process→Output→Storage
cycle diagram in the house flat-vector/orange-accent style. Visually checked before upload
(no garbled text, correct labels, on-brand) — this is not skippable, `gpt-2` can occasionally
mis-render label text and the pipeline has no automated check for that, only a human look.
Uploaded to `docs/img/basics/what-is-a-computer-1`, real dimensions (1024×768) read from the
Cloudinary response and used in both locales' image blocks.

**Verified**: `--dry-run` read before the real run; both `docs` and `doc_translations` rows
written and confirmed via the live Vercel deployment (no local rebuild needed — ISR +
the Supabase Database Webhook picked it up automatically); view-source contains the lesson
text in both locales (SEO gate, CLAUDE.md §3.3); the Cloudinary image renders with correct
`f_auto,q_auto` + responsive `2x` srcset; sidebar shows the new lesson before the old one
(`sort_order`); no console errors on either locale; the BN TOC anchor-matching link tested
live and confirmed.

**Lesson 2, `basics/generations-of-computers`** — built one at a time per the user's
instruction ("just one at a time"), not the remaining 14 in one batch. Same shape: EN + BN,
one Magnific `gpt-2` image (a five-stage timeline, vacuum tube → transistor → integrated
circuit → microprocessor → AI), published, verified live the same way as the pilot.

**A third real finding, this one caught by comparing the image against the text rather than
by looking at the image alone:** the first generated timeline image invented its own date
ranges for stages 4 and 5 ("1970s–1990s", "2000s–Present") that the prompt never specified
and that directly contradict the lesson's own text — the fourth generation is written as
"1970s–present" (still ongoing) and the fifth deliberately has no fixed start year, with a
callout explaining exactly why generation boundaries are approximate. An AI-generated image
can introduce confidently-wrong *factual claims*, not just render text badly — a different
failure mode than the "garbled text" check the pipeline doc already called out, and one a
visual glance alone won't catch if you don't also check it against what the lesson actually
says. Regenerated with an explicit "no dates or years anywhere in the image" instruction
instead of shipping the contradiction. Not yet written into `docs/CONTENT-PIPELINE.md` as a
standing rule — worth adding once this pattern repeats, rather than over-fitting the pipeline
doc to a single incident.

Also fixed: the old doc and lesson 1 shared `sort_order: 1`, so the old doc was sorting
itself between lesson 1 and lesson 2 in the sidebar instead of staying out of the way.
Bumped `basics/computer-fundamentals` to `sort_order: 99` directly (a one-off DB update, not
part of `create-basics-content.mjs` — it only ever touches the *new* lessons) — confirmed
live that new lessons now sort correctly ahead of it.

**Lesson 3, `basics/computer-hardware`** — motherboard, CPU, RAM vs. storage (deliberately
paired as one section rather than two, since "what's the difference" is the actual question
beginners have, not two unrelated facts), power supply, one labelled diagram of a case
interior (motherboard, CPU, RAM, storage, PSU, cables between them). The image came back
clean and accurate on the first generation — correct labels, no invented facts, no repeat of
lesson 2's date-range problem — so no regeneration needed this time. `sort_order: 4`. EN +
BN, published, verified live the same way as the previous two: server HTML contains the
lesson text in both locales, image renders at its real 1024×768 with no layout shift, no
console errors, sidebar orders correctly ahead of the old doc.

**Lessons 4–16, remainder of the outline** — built in one continuous run after the user said
"Build all the next lessons" (superseding the earlier "just one at a time" pacing instruction
for this run only). Same per-lesson loop each time: write EN + BN blocks in
`scripts/create-basics-content.mjs`, generate one Magnific `gpt-2` image (1k/medium),
download and visually check it against the lesson's own text before upload (not just for
garbled labels — the lesson-2 date-invention failure mode was checked for on every image this
run), upload to Cloudinary via a throwaway `scripts/_upload-lesson-image.mjs` (written, used,
deleted each time — never committed), correct the image block's width/height to the real
Cloudinary response if it differs from the placeholder, run the script, then verify both
locales live via `curl | grep` for a distinctive phrase plus an HTTP 200 check. All 13 images
came back clean on the first generation this run — no repeats of the date-invention or
mismatched-dimension issues from lessons 1–2.

Lessons, in order: `input-devices` (5), `output-devices` (5), `computer-memory` (6, explicitly
cross-links back to lesson 3 rather than repeating the RAM explanation, goes deeper on
ROM/PROM/EPROM/EEPROM and L1/L2/L3 cache), `storage-devices` (7, same cross-link pattern,
HDD/SSD/pen drive/cloud), `number-systems` (8, decimal/binary/hex with a worked 13 → 1101 → D
conversion — checked by hand before writing and re-checked against the generated image, which
rendered the bulb states, digits, and base labels correctly), `computer-software` (9,
system vs. application, explicit "what breaks if you remove this" test for telling the two
apart), `operating-systems` (10, Windows/macOS/Linux/Android/iOS + an apps→OS→hardware layer
diagram — image prompt explicitly said "no real trademarked logos," came back with generic
shape icons, not actual brand marks), `computer-networking` (11, LAN/WAN/router/IP address),
`internet-basics` (12, internet vs. the Web, ISP/browser/URL/DNS, a 4-step "how a page loads"
flow diagram), `cybersecurity-basics` (13, passwords/malware/phishing/updates, framed as
habits over expertise), `computer-applications` (14, education/business/healthcare/
entertainment/retail — retail added beyond the original 4-field outline to match a 5-icon
image layout that came back with an extra field; content was written to match rather than
discarded), `quantum-computing-intro` (15, bit vs. qubit, superposition described as "0 and 1
at the same time" with an explicit callout that this is a beginner-safe simplification of the
real physics, no invented dates/capability claims about real quantum computers), and
`artificial-intelligence-basics` (16, what AI is, machine learning in one paragraph, five
everyday touchpoints, an honest "what AI cannot do" section plus a short ethics note —
closing lesson for the whole Computer Basics section).

`docs/img/basics/computer-applications-1` is a 5-field diagram (added "Retail" beyond the
original 4-field `docs/CONTENT-PIPELINE.md`-outline wording) — noted here since it's the one
place this run's content diverged from the originally approved outline, and it did so to
match what the image actually rendered rather than the other way around.

**Rebuild closeout**: attempted to soft-delete `basics/computer-fundamentals` via a
service-role script (the same pattern used all session for content writes) — blocked by the
`docs_delete_restore_guard` trigger ("Only an admin can delete or restore a lesson"), which
requires the authenticated admin session `lib/admin/docs.ts`'s `deleteDoc` runs under, not
just RLS bypass. This is a deliberate safety gate (the 150+ migrated lessons are the one
genuinely irreplaceable asset in this project) and was correctly left in place rather than
routed around. The Chrome browser extension was not connected this session, so the actual
soft-delete via `/admin` couldn't be completed here either — **left for the next session**,
see O-20 (updated). The 301 redirect half of the closeout — `/basics/computer-fundamentals` →
`/basics/what-is-a-computer` in `next.config.ts` — does not require admin auth and was added
in this run; it is harmless to have live even before the old doc is deleted, since Next only
serves the redirect for the literal old path and does not touch the still-live doc row.

## D-54 · Image style is asked every content run, never a fixed default

**Reversed from D-52's original setting.** The pipeline previously locked image style to one
fixed house style (flat vector, brand-orange accent) so every category stayed visually
consistent without a question each run. The site owner reversed this after the Computer
Basics rebuild (D-53): different runs may genuinely want different looks (a playful category
vs. a technical one), so **`docs/CONTENT-PIPELINE.md` §0 and §4 now require asking the image
style at the start of every run**, with concrete options offered rather than an open
"what style?" — flat vector, isometric, hand-drawn/sketch, photoreal, line-art/monochrome, or
"same as the last run in this category."

**Why this is a real reversal, not an addition:** the whole point of D-52's fixed style was
*never asking again*. Making it a per-run question means every future run must stop and ask
before generating images — slower per-run, deliberately, in exchange for visual range across
categories. `docs/CONTENT-PIPELINE.md`'s settled-defaults table and §4 updated accordingly;
the Session 30 house style (flat vector / `#f97316` orange) is kept in the doc as a *worked
example* to show the owner when asking, not as the answer to assume.

## D-55 · Sidebar reorder: css, html, javascript + a real content bug found and fixed

**Reorder.** User reported the CSS sidebar was in the wrong order (screenshot: Bootstrap and
"Introduction of CSS" buried alphabetically instead of at natural teaching positions).
Confirmed all three of `css` (35), `html` (36), and `javascript` (28) had `sort_order` set to
raw alphabetical-by-slug — never a real teaching order — and reordered all three directly via
one-off scripts (dry-run first, then applied, then deleted; matches the throwaway-script
pattern used all through Session 30). No code changes needed — the sidebar already reads
`sort_order`, so this was pure data.

- **css**: intro → syntax → colors/backgrounds/borders/spacing → box model → typography →
  content elements (links/lists/tables) → display & positioning → layout & selectors →
  real-world components (navbar/dropdowns/forms) → units/how-to → Bootstrap + syllabus as
  trailing extras.
- **html**: syllabus → intro → basic/attributes/structure → content elements → forms → misc
  (iframes/filepaths/responsive) → HTML5/semantic intro → individual semantic tag pages
  (page-structure tags first, then content, then media).
- **javascript**: syllabus → intro → fundamentals (basics/control-flow/functions/scope) →
  data types → DOM/events → closures/this/OOP → error handling → async → modern JS/modules →
  storage → debugging/performance/tooling → jQuery.

**Syllabus placement.** Discovered every category with a `syllabus`-slugged doc uses it as a
category overview/roadmap page (content opens with a heading like "HTML - Hyper Text Markup
Language"). Placed it **first** in html and javascript — read the roadmap before the lessons
— a placement call made without asking since it's low-stakes and trivially reversible.
`css/syllabus` was deliberately left at its existing (last) position rather than moved to
match, because of the bug below.

**Real bug found while checking, not part of the ask, fixed after explicit approval
("fix both of them"):** `css/syllabus`'s `title` was **"Color in Design"** (BN: "ডিজাইনে রঙ")
despite its content being the exact same generic category-overview stub as the other two
syllabus docs (`"CSS - Cascading Style Sheets"` heading + a one-line "click here to learn
more" note) — a migration/data mismatch, not a legitimate title. Its content also linked to
`/css/css-intro`, a stale Jekyll-style path; `scripts/url-map.json` confirms the correct
current path is `/css/intro` (pipeline §3's link-check rule, applied retroactively). Fixed
both EN and BN rows: `title` → "CSS Syllabus" / "CSS সিলেবাস" (matching the html/javascript
naming pattern exactly), `meta_title` updated to match, and the stale link corrected in both
locales' `richtext` block. Verified live: both `/css/syllabus` and `/bn/css/syllabus` render
the corrected title and a working `/css/intro` link. (The doubled "| Learn Computer Academy"
visible in the browser tab title is the pre-existing O-16 bug, unrelated to this fix — not
touched.)

**Not done**: `programming`, `react`, `design`, `photoshop` haven't been checked for the same
alphabetical-order issue — only the three categories the user named this session were
touched.

## D-56 · New "SQL" category — 16 lessons from the site owner's own prior handbook

User supplied `c:\Users\Raptor\Downloads\index (17).html`, a custom-built SQL reference they'd
already made for students (dark-themed, JS-data-driven, 16 chapters, ~64 "topic cards" each
with what/syntax/example/output/explanations/uses/mistakes/related fields) and asked for it
rebuilt as a new site category, following `docs/CONTENT-PIPELINE.md`.

**Source is the owner's own material, not scraped** — pipeline §3's originality rule is about
never copying *another site's* prose; reusing your own prior work is exactly what the rule
permits. English prose was adapted directly from the source (restructured into blocks, light
editing for site voice); Bengali was written fresh.

**Outline approved before writing anything** (pipeline §0), plus three explicit choices asked
alongside it via `AskUserQuestion` since the source didn't map cleanly onto existing site
conventions:
1. **Outline** — build all 16 chapters as-is (intro → databases/tables → data types → the four
   families DDL/DML/DCL/TCL → filtering/sorting/grouping → joins → functions → window
   functions → subqueries → CTEs → beyond the basics). Approved unchanged — the source was
   already well-organized and vetted for students.
2. **Content depth** — the source's per-topic "card" format (what/syntax/example/output/
   explanations/uses/mistakes) is far denser than a typical lesson elsewhere on the site.
   Owner chose to **keep full depth** rather than condense, since none of it was filler.
3. **Images** (first real use of D-54's per-run question) — the source has zero images, all
   code/tables. Owner chose **selective**: only lessons with a genuinely visual concept get
   one, not one per lesson. Ended up as 6 of 16 lessons: the four SQL families (moved here
   from a planned DDL-lesson placement — better fits where the concept is *introduced*), SQL
   data type families, JOIN types (Venn diagram), window-function ranking (a literal
   ROW_NUMBER/RANK/DENSE_RANK numbers table), and why an index helps (scan vs. lookup). House
   style: flat vector, but **teal-green `#5fc9a8` accent instead of Computer Basics' orange**
   — deliberately different per-category look (that's the entire point of D-54), and a nod to
   the source file's own accent color.

**New category creation confirmed low-risk before building**: `createCategory` in
`lib/admin/categories.ts` is a plain `categories` row insert with no `docs_delete_restore_guard`-
style trigger gating it (unlike doc deletion, D-53's closeout) — a service-role script insert
worked cleanly. Verified this empirically before relying on it: `slug: 'sql', title: 'SQL',
title_bn: 'এসকিউএল'` (matching the existing transliteration pattern — HTML→এইচটিএমএল,
CSS→সিএসএস, JavaScript→জাভাস্ক্রিপ্ট), `sort_order: 9` (after React). Confirmed live, though
`/sql` itself correctly 404s until the category has ≥1 doc — `loadCategory` in
`components/category-content.tsx` calls `notFound()` on an empty category by design, not a bug.

**New block type used for the first time in a while**: `code(language, codeText)`, per
`docs/CONTENT-MODEL.md`'s schema — confirmed `'sql'` is already in `lib/shiki.ts`'s supported
`LANGS` list. SQL code blocks are plain `code`, never `runnable`/`tryit` — this site's Try-It
only supports HTML/CSS/JS/React (CLAUDE.md §4 decisions table), there's no SQL execution
engine to back a runnable SQL block.

**Every image visually verified against its own claim before upload — not just for garbled
text, per the lesson-2-Computer-Basics precedent.** Two were higher-risk than typical (numbers
and region-shading an AI can render subtly wrong) and got extra scrutiny:
- **Window-function ranking table** — checked the actual rendered digits, not just labels:
  salaries 90/80/80/70/60 → ROW_NUMBER 1,2,3,4,5 (correct, always unique) → RANK 1,2,2,4,5
  (correct, ties share a rank and the next number skips) → DENSE_RANK 1,2,2,3,4 (correct, ties
  share a rank, nothing skipped). All three columns came back numerically correct on the first
  generation.
- **JOIN Venn diagram** — checked shading region by region against join semantics: INNER only
  the overlap, LEFT all of A + overlap, RIGHT all of B + overlap, FULL both entirely. All four
  correct on the first generation.

All 16 lessons published one at a time (not batched inserts) — same per-lesson loop as D-53's
Computer Basics run: write EN+BN blocks, generate image where planned, download and visually
verify, upload to Cloudinary via a throwaway `scripts/_upload-lesson-image.mjs` (written, used,
deleted each time), correct width/height to the real Cloudinary response, run
`scripts/create-sql-content.mjs` (dry-run first every time), verify both locales live via
`curl | grep` for a distinctive phrase plus an HTTP 200 check. Final check confirmed the full
16-lesson sidebar order live via `curl` against `/sql/intro`.

**Verified**: all 16 EN + all 16 BN docs live, server HTML contains lesson text in both locales
(SEO gate, CLAUDE.md §3.3), all 6 images render at their real dimensions with no layout shift,
sidebar shows all 16 in the approved outline order, `/sql` category page resolves once lesson 1
existed.

## D-57 · New "Artificial Intelligence" category — 23 lessons merging two prior courses into one

User supplied four files from their own prior AI teaching material — two curriculum pages
("AI for Beginners," 7 modules; "AI for Creative & Tech Professionals," 10 modules) and two
much larger teacher guides (85 KB, 90 KB) holding the actual theory, code examples, and demo
scripts. Explicit instruction: **"We have 2 courses for it but the docs should be one"** — a
single merged category, not two parallel tracks.

**Merged outline, approved before writing anything** (pipeline §0), proposed as one
simple→advanced progression deduplicating the real overlap between the two courses (both
opened with "what is AI," both closed with ethics): Foundations (3) → Everyday AI (2) →
Prompting (2) → Creative AI (3) → Dev AI (3) → Python & ML (4) → Applying it (3) → Safety (3)
= 23 lessons. Approved unchanged.

**Three explicit per-run choices, same pattern as D-56, via `AskUserQuestion`:**
1. **Outline** — approved as proposed (all 23, no restructuring).
2. **Content depth** — full topic-card depth kept, matching D-56's SQL precedent, since the
   teacher guides\' theory sections were themselves substantive, not filler.
3. **Image style** (D-54 in action again) — owner explicitly said images "will be using GPT2
   and will be awesome like infographics style as much as possible, doesn't have to be
   related to our brand" and asked to be given concrete options rather than deciding
   unprompted. Offered vibrant tech/futuristic, bold flat multi-color, isometric 3D, and
   abstract gradient mesh; **bold flat infographic, multi-color** was chosen. This is the
   first category whose house style deliberately breaks from a single muted accent colour —
   correct per D-54's whole premise, and distinctly punchier than Computer Basics' orange or
   SQL's teal-green.

**What got cut from the source, deliberately:** class numbers, assessment rubrics, homework
assignments, teacher-only "how to teach this" framing, and all enrollment/pricing/marketing
copy (₹/$ figures, "Enroll Now," batch timings). This is a public teaching site, not the
academy's internal classroom manual (CLAUDE.md §1) — the theory, code, and worked examples
were the genuinely reusable part, and were kept in full depth.

**Real editorial calls made against the source, not just extracted from it:**
- **No pinned prices or salary figures anywhere** — the source\'s "$150–$500 per chatbot,"
  "₹10–50 lakh/year," and "mid-2025" model-comparison pricing table would all be stale within
  months. Rewrote the model-comparison and freelancing lessons around durable *dimensions*
  (what each model family is generally known for, what a service type involves) with an
  explicit callout telling readers to check current pricing themselves — the same discipline
  D-56 already established for SQL\'s tooling/pricing content.
- **The chatbot-building lesson's main code example was restructured, not copied.** The
  source teaches the insecure "API key directly in frontend JS" version first as the primary
  working example, with the security warning bolted on afterward as a separate box. This
  lesson leads with the safe server-proxy-calling frontend code as the primary example
  instead, with the danger callout explaining *why* immediately after — teaching the correct
  pattern as the default, not as a correction to an already-absorbed bad one.
- Real, verifiable facts used carefully: AlphaFold2\'s protein-folding result, the Amazon
  hiring-AI bias case, the IT Act / cybercrime.gov.in reference — all things with lasting,
  checkable accuracy — while unverifiable or fast-moving specifics (exact company user
  counts, precise salary bands) were paraphrased into durable claims or dropped.

**New category setup**: `slug: 'ai', title: 'Artificial Intelligence', title_bn:
'কৃত্রিম বুদ্ধিমত্তা'`, `sort_order: 10` (after SQL). Icon added to `lib/category-icons.tsx`
(`BrainCircuit` from lucide — generic, not a brand mark, same reasoning as `programming` /
`basics` / `sql`) covering all four icon surfaces (sidebar, homepage, search, category page)
through the single shared `CATEGORY_ICONS` map.

**Cross-link added**: `basics/artificial-intelligence-basics` (the short intro lesson inside
the Computer Basics rebuild, D-53) got a new callout pointing to this category as the
deep-dive version — added directly via a one-off script (not through
`create-basics-content.mjs`, which only ever touches Computer Basics\' own 16 lessons) since
it\'s a cross-category edit, done once, not part of any lesson-authoring loop.

**Every image visually verified before upload, same as every prior run** — six of the
category\'s images carried real numeric or factual content and got the extra scrutiny
established after the Computer Basics date-invention incident and reused for SQL\'s
ranking-table/Venn-diagram images: the AI history timeline (all 7 years and labels exact),
the next-token-prediction probabilities (92%/5%/3%, correct winner), the deepfake warning
signs (five signs matching the lesson\'s own list, generic non-real face), and the ReAct loop
diagram. All came back correct on the first generation.

**Verified**: all 23 EN + 23 BN docs live, server HTML contains lesson text in both locales,
images render at real dimensions (two needed a placeholder-dimension correction after the
real Cloudinary response came back different, same routine fix pattern as every prior run),
sidebar shows all 23 in outline order, `/ai` category page resolves, cross-link from
`basics/artificial-intelligence-basics` confirmed live.

---

## D-58 · AI category — 8 more images added, direct user feedback ("haven't added much images")

**Date:** 2026-07-29 · **Status:** Active · **Decided by:** user

User reviewed the live AI category after D-57 shipped and flagged it as too text-only:
**"I feel you haven't added much images, can you add some more please at appropriate
places."** Identified the 8 lessons in the 23 that had gone out with zero images, and added
exactly one image to each, at a point in the lesson chosen to reinforce that lesson's own
central claim rather than appended at the end:

- `comparing-ai-models` — five generic model-family strengths, placed right before the
  Open Source vs. Closed Source breakdown.
- `ai-coding-assistants` — the six things assistants are genuinely good at, plus a "still
  needs human review" banner, placed right after that lesson's own bullet list.
- `building-an-ai-chatbot-for-a-website` — insecure (key exposed in the browser) vs. secure
  (key hidden behind a server proxy) two-panel diagram, placed directly after the
  `callout('danger', …)` warning it visually restates.
- `introduction-to-machine-learning-concepts` — supervised / unsupervised / reinforcement
  three-panel comparison, placed right after the Reinforcement Learning section closes out
  all three categories.
- `llms-and-rag-in-depth` — the 4-step RAG pipeline (ingest → embed → retrieve → generate),
  placed right after the lesson's own step-by-step table, reinforcing rather than repeating it.
- `ai-across-industries` — a 7-icon grid of every industry the lesson covers, placed as a
  visual overview right after the intro paragraph, before the per-industry sections begin.
- `ai-careers-and-freelancing` — the five new AI job roles as icon cards, placed right after
  the lesson's own roles table.
- `ai-security-and-responsible-development` — a prompt-injection attack-vs-defense diagram
  (the three real defenses: sanitise input, validate output, rate limit), placed right after
  the attack example code block, before the defenses are listed in prose.

**Same discipline as every prior image run**: `gpt-2`, generic abstract icons only (no real
brand logos — Copilot/Cursor/ChatGPT are named in lesson prose but never drawn), every image
visually verified against the lesson's own claims before upload. Three of the eight needed a
placeholder-dimension correction after the real Cloudinary response came back
1024×768 instead of the guessed 1344×768 — same routine fix pattern as D-57.

**Verified**: all 8 images live in both `/ai/<slug>` and `/bn/ai/<slug>` — HTTP 200 plus a
content-grep for each image's Cloudinary public ID, confirmed for every lesson.

**Not pushed** — user said "I will push it later on" (re: the SQL icon commit, but the same
stated preference applies here); committed locally only, per this session's standing
instruction to never push without being asked.

---

## D-59 · Domain cutover cleared — old-site URL preservation formally waived

**Date:** 2026-07-29 · **Status:** Active · **Decided by:** user

User asked whether `docs.learncomputer.in` (DNS on Cloudflare) could point at Vercel now.
Investigation before answering found the real blockers weren't content-completeness (all
9 categories resolve, 450 sitemap URLs, all lesson pages verified live) but two things:

1. **No redirect layer for ~130 old Jekyll-style URLs** (`css/css-boxmodel`,
   `html/html-intro`, etc.) — `scripts/url-map.json` only rewrites internal `<a href>`s at
   extraction time, it was never wired into `next.config.ts` or middleware as live 301s.
   Only the 4 tools + 1 basics-slug redirects actually exist.
2. Two PDFs (`graphics-design/Color-Theory.pdf`, `ui/ui-theory-3.pdf`) flagged in CLAUDE.md
   §3.7 as specifically Google-indexed, unlike the rest of the old site.

User ran `site:docs.learncomputer.in` and confirmed a small number of old pages are
genuinely indexed — but says this was **accidental**: every HTML page on the old Jekyll
site already carried noindex, so whatever Google picked up (the PDFs, presumably, since
`<a href>` links to files aren't covered by an HTML page's noindex meta tag) was never an
intentional index the user is trying to protect. **Formally waived**: no redirect layer
needed for the old URL scheme, `url-map.json` stays extraction-time-only, this closes the
"custom domain" half of CLAUDE.md's non-negotiable #2/#7 for good — not deferred, decided.

**Still true and unaffected by this waiver**: non-negotiable #1's "all 140 pages must exist
somewhere" (content completeness) was never in question — that's about not losing content
during migration, separate from whether the *old URLs* specifically redirect.

**Remaining pre-cutover note, not a blocker**: Cloudflare DNS record should be set to
**DNS-only (grey cloud)**, not proxied, when pointed at Vercel — Vercel issues its own TLS
cert and needs to see the real target directly, or cert issuance/handshake can fail.

---

## D-60 · Admin Notes tab — shared, Tiptap rich text, checklist todos, private attachments

**Date:** 2026-07-30 · **Status:** Active · **Decided by:** user (asked directly, 4
clarifying questions before building — see chat)

New `/admin/notes` screen, admin-only (same tier as Categories/Settings/Users/Trash/Menu —
enforced in both `proxy.ts` and RLS via `public.is_admin()`). Four forks resolved before
writing any code:

1. **Shared across all admin accounts**, not private per-admin. Simplest option, matches
   how every other admin screen (Resources, Media, Settings) already has no per-user
   scoping. No `created_by`/`user_id` column.
2. **Tiptap rich-text (WYSIWYG)**, not raw markdown source. This project has no markdown
   renderer installed anywhere (content is stored as structured HTML blocks, not .md), and
   Tiptap is already the editor used for lesson richtext blocks — reusing it means zero new
   parsing/rendering dependencies. Notes are stored as `body_html`, same shape as
   `docs.blocks`' richtext entries, not literal markdown text.
3. **Todos are markdown-style checklists inside a note**, not a separate structured todo
   table. `- [ ] task` syntax doesn't apply literally since storage is HTML, but the same
   idea via Tiptap's task-list node (`@tiptap/extension-task-list` + `-task-item`, both
   newly added — StarterKit doesn't bundle them). No new schema for todos.
4. **Attachments are multi-file and private to the note** — not one-file-only, and not
   added to the shared `media` table/Admin → Media screen. They're working files for a
   note, not content assets meant to be reused elsewhere. Stored as a jsonb array on the
   note row itself (`attachments: [{url, filename, bytes, backend}]`), uploaded through the
   same `lib/storage.ts` `uploadFile` router Media already uses (Cloudinary under 10 MB, R2
   at/above it — R2 still not configured, same caveat as Media's upload form).

Built a separate `NoteEditor` component rather than reusing `RichTextBlockEditor` — that
one deliberately disables headings (extract-docs.mjs's anchor system owns them for lesson
content) and has no task-list button. Neither restriction makes sense for a personal
notes/todos scratchpad.

Manual "Save" button, no autosave — matches every other admin editor in this codebase
(Resources, Categories, Menu), none of which autosave either.

---

## D-61 · New PHP category — 29 lessons, first of a 3-language build (PHP → Python → React)

**Date:** 2026-07-30 · **Status:** Active · **Decided by:** user

User asked for new PHP, Python, and React documentation, explicitly acknowledging the site
can never fully keep pace with the official docs and authorizing linking out to them where a
full reference beats reproducing one. Confirmed up front (CONTENT-PIPELINE.md §0):

- **Order:** one language at a time — PHP first (as listed), then Python, then React.
- **React specifically**: the 2 existing docs (`react/introduction`, a `react/syllabus` that
  was mostly an unfilled chapter outline — Jekyll-era leftovers) will be **rebuilt from
  scratch**, not kept alongside new lessons — same treatment as the Computer Basics rebuild.
- **Image style**: one shared style across all three languages — **isometric**, warm-orange
  `#f97316` accent + neutral grays/blues, clean geometric shapes, soft shadows, no baked-in
  text. Reuse this exact clause for the Python and React runs too, per the site owner's
  choice of "same style across all three."
- **Target size**: comprehensive, ~25-30 lessons each, matching `javascript`'s depth rather
  than `sql`/`ai`'s leaner ~16-23.
- Mid-run, user asked to cut images to only where a diagram genuinely helps beyond what a
  code block already shows — not one-per-lesson. PHP shipped with **5 images across 29
  lessons** (650 credits total, not the ~7,000+ a "2 per lesson" default would have cost).

**New category**: slug `php`, title "PHP" / `পিএইচপি`, sort_order 9 (after `react`, before
`sql`/`ai`, which shifted to 10/11). Icon `logos:php` added to `lib/category-icons.tsx`.

**Scope note**: shipped 29 lessons, not the 28 originally approved — added "Type Casting"
as its own lesson between Data Types and Constants (it was in an earlier draft outline,
got dropped when trimming to 28 for approval, and I didn't notice it was still in the
script until sort_order review). Flagged to the user rather than deleting already-written,
correct content. Sort order shifts everything after Data Types by +1 versus the originally
posted numbering.

**Builds on existing content, doesn't repeat it**: assumes `programming` (19 lessons —
variables, loops, functions, etc.) and `html` are already known; the PHP-and-MySQL lessons
(28-29) assume `sql/intro` and `sql/dml`, and link to them rather than re-explaining SQL.

**Two real bugs caught by the build, not shipped**:
1. My `code()` block builder used field name `source`; the actual `Block` type
   (`lib/types.ts`) and renderer (`components/blocks/block-renderer.tsx`) expect `code`.
   Every code block had `b.code === undefined`, which crashed Shiki's highlighter
   (`Cannot read properties of undefined (reading 'length')`) at build time on the first
   PHP page it tried to prerender. `next build` failing loudly here is exactly the design
   working — this could otherwise have shipped as a broken page.
2. `php` wasn't in `lib/types.ts`'s `Lang` union or `lib/shiki.ts`'s `LANGS` allowlist
   (only html/css/js/jsx/tsx/ts/bash/json/sql/python/text). Both extended to add `php` —
   same pattern presumably followed when `sql` and `python` were added for their own
   categories.
3. **Not a code bug, a build-cache gotcha worth remembering**: after fixing #1 and
   re-running the content script, `next build` kept failing on the *exact same* page with
   the *exact same* error, even though the DB row was already fixed. Root cause:
   `.next/cache`'s persistent fetch cache had cached the broken `getDoc('php/loops')`
   result from the *first* (failed) build attempt, and a second `next build` reused it
   without re-fetching. `rm -rf .next` before rebuilding resolved it. Worth trying first,
   before assuming a fix didn't work, any time a build error persists identically across
   consecutive `next build` runs in the same content-authoring session.

---

## D-62 · New Python category — 28 lessons, second of the 3-language build

**Date:** 2026-07-30 · **Status:** Active · **Decided by:** user

Second of the PHP → Python → React run (D-61). Outline (28 lessons) approved as-is, no
changes requested. New category: slug `python`, title "Python" / `পাইথন`, sort_order 10
(after `php`, `sql`/`ai` shifted to 11/12). Icon `logos:python`.

**Structurally different from PHP on purpose, not by omission**: core Python has no
web-request machinery (no superglobals/sessions/forms — that's a framework's job, not the
language's), so those PHP lessons were replaced with genuinely Python-specific topics
instead: list comprehensions, iterators/generators, and modules/pip. Also dropped a
dedicated "Constants" lesson — Python has no `const` keyword, just an `UPPER_CASE` naming
convention — folded into Variables instead of padding out a thin topic into its own lesson.

Same isometric style clause as PHP (D-61), reused verbatim per the "one shared style
across all three" decision. 5 images again (introduction, modules, OOP intro, iterators/
generators, databases) — 650 credits, same restrained approach as PHP.

**No scope drift this time** — 28 lessons shipped, 28 approved, sort_order 1–28 exactly
as proposed. (PHP shipped 29 against an approved 28; see D-61.)

**The two PHP bugs, avoided from the start**: `code()`'s builder used the field name `code`
(not PHP script's original `source` mistake) from the first line written, and `python` was
already in `lib/types.ts`'s `Lang` union / `lib/shiki.ts`'s `LANGS` (added when the existing
`programming`/`sql` categories were built) — no site-code changes needed this run, only
content. `rm -rf .next` before the verification build, per D-61's build-cache lesson —
clean build, zero prerender errors, first attempt.

---

## Open

| # | Question | Blocks |
|---|---|---|
| ~~O-12~~ | ~~Run `supabase/migrations/008-nav-submenu.sql`~~ — **resolved.** User ran it; the sub-menu still didn't show due to a stale `nav` cache tag (direct-SQL write bypassed `revalidateTag`) — fixed via the `/api/revalidate` webhook, see D-44 | — |
| ~~O-13~~ | ~~Add "Box Shadow Generator" to the header nav~~ — **resolved.** Confirmed live in the admin Menu screen (Session 28): all eight tools now sit under a top-level "Tools" (টুলস) dropdown — Box Model, Box Shadow, Gradient, Flexbox, Grid, Colour & Contrast, Scrollbar, Specificity. User added these by hand between sessions, not tracked here as it happened | — |
| ~~O-14~~ | ~~Add "Gradient Generator" to the header nav~~ — **resolved**, see O-13 | — |
| ~~O-15~~ | ~~Add "Flexbox Playground" to the header nav~~ — **resolved**, see O-13. The "Tools" dropdown structure this entry flagged as unconfirmed is exactly the live structure | — |
| O-16 | Doc lesson pages' browser tab title is duplicated — `"<Title> \| Learn Computer Academy \| Learn Computer Academy"`, confirmed on `/css/pseudo-elements` (D-48), pre-existing and unrelated to any /tools work. Not investigated | Cosmetic (browser tab / bookmark title only) — does not affect page content, SEO `<title>` may or may not share the bug, unconfirmed |
| ~~O-17~~ | ~~Add "Scrollbar App" to the header nav~~ — **resolved**, see O-13 | — |
| ~~O-18~~ | ~~Add "CSS Specificity Calculator" and "Colour & Contrast Studio" to the header nav~~ — **resolved**, see O-13 | — |
| ~~O-19a~~ | ~~Add "Grid Generator" to the header nav~~ — **resolved**, see O-13 | — |
| O-19b | Confirm live multi-cell drag-to-place on the Grid Generator works with a real mouse — this session's browser-automation harness couldn't exercise it (see D-50's Verified note) | Single-cell placement is confirmed working; multi-cell drag is unconfirmed rather than known-broken |
| O-20 | All 16 Computer Basics lessons are now live (D-53) and the 301 redirect is in `next.config.ts`. **Only remaining step:** soft-delete `basics/computer-fundamentals` via the `/admin` panel (Chrome extension wasn't connected this session; a service-role script is correctly blocked by `docs_delete_restore_guard`) | Old 16-chapter page still shows in the sidebar alongside all 16 new lessons until this one delete happens |
| ~~O-11~~ | ~~Run `supabase/migrations/007-resources-editable.sql`~~ — **resolved.** User ran it. | — |
| ~~O-10~~ | ~~Run `supabase/migrations/006-nav-items.sql`~~ — **resolved.** User ran it. | — |
| ~~O-9~~ | ~~Run `supabase/migrations/005-pages-editable.sql`~~ — **resolved.** User ran it. | — |
| ~~O-8~~ | ~~Run `supabase/migrations/004-users.sql`~~ — **resolved.** User ran it, confirmed `role='admin'`, deployed at `2413296` | — |
| O-1 | Real copy for `/about/` | Stage 5 (the page ships empty otherwise) |
| ~~O-2~~ | ~~Contact form destination inbox + Resend account~~ — **resolved, D-36: dropped entirely, no form built** | — |
| O-3 | Search Console export — top 100 pages by clicks/impressions | nothing; makes Stage 9 targeted rather than uniform |
| O-4 | Higher-resolution logo source (current: `assets/img/logo.png`) | nothing; existing PNG is usable |
| O-21 | **`[category]/[slug]` (and its `/bn` twin) serve a real "not found" page but with HTTP 200, not 404**, for any slug outside `generateStaticParams`'s list. Reproduced locally with `next build && next start` — not Vercel-only. Root-caused to a known Next.js App Router limitation (matching open framework GitHub issues, e.g. #63483): `generateStaticParams` + no explicit `dynamic`/`revalidate` config implicitly runs the route in force-static mode, and an on-demand `notFound()` render for an unlisted param gets served/cached as 200. Ruled out as the cause: our own `unstable_cache` layer (tested removing it entirely — bug persisted), and `revalidate = 86400` (tested, no effect — reverted, not committed). The two documented real fixes both cost a hard requirement: `dynamicParams = false` guarantees correct 404s but breaks "a newly-published lesson appears without a full rebuild" (the whole point of on-demand tag revalidation); `dynamic = 'force-dynamic'` guarantees correct status codes but forces a DB hit on every request including bots, exactly what the free-tier guardrail (CLAUDE.md §4) says never to do. **Parked, not fixed** — user confirmed old/mistyped URLs aren't an indexing concern (D-59), so the practical impact today is near zero; the right real fix is probably a lightweight edge-cached valid-slug check in `proxy.ts` that avoids a per-request DB hit, worth building alongside Stage 9 (SEO foundation) rather than as a one-off patch now | Cosmetic today (soft-404, real users/crawlers see correct "not found" content) — would matter for SEO health once the site is actually being indexed and crawled at volume |
| O-5 | `generateMetadata` output doesn't pick up `revalidateTag`/`revalidatePath` the same request cycle the page body does (D-18) — worth a Next.js version check or upstream issue search before Stage 7, since the admin panel's "publish" flow will make this user-visible (stale tab title/search snippet after an edit) | nothing yet; page content itself is unaffected |
| ~~O-6~~ | ~~Set up the actual Supabase Database Webhook~~ — **resolved, D-21** | — |
| ~~O-7~~ | ~~R2 credentials not in `.env.local`~~ — **resolved, D-30.** Still needs mirroring into Vercel's env vars before production uploads ≥10 MB will work | — |
| O-22 | Run `supabase/migrations/009-notes.sql` (D-60) — the `notes` table doesn't exist in the live DB yet | `/admin/notes` will 500 on every query until this runs |
