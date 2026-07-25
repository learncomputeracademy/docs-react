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

## Open

| # | Question | Blocks |
|---|---|---|
| O-1 | Real copy for `/about/` | Stage 5 (the page ships empty otherwise) |
| O-2 | Contact form destination inbox + Resend account | Stage 8 |
| O-3 | Search Console export — top 100 pages by clicks/impressions | nothing; makes Stage 9 targeted rather than uniform |
| O-4 | Higher-resolution logo source (current: `assets/img/logo.png`) | nothing; existing PNG is usable |
