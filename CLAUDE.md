# CLAUDE.md — docs-react

> **Scope note:** This file governs **this repository only**. The `CLAUDE.md` in
> `C:\Users\Raptor\Downloads\CLAUDE.md` is a PageSpeed plan for `amartadey.com`, an
> unrelated property. Ignore it while working here.

---

## 1. What this project is

A rewrite of **docs.learncomputer.in** — currently a Jekyll + GitHub Pages site — as a
modern React application.

- **Audience:** built for students of learncomputer.in, but public and free for anyone.
  **Do not** put "for LCA students only" framing anywhere in the UI or copy.
- **Model:** a W3Schools-style learning site — left sidebar syllabus, lesson page in the
  middle, runnable code examples, clean and fast.
- **Content:** everything on the current site carries over. No content is dropped in this
  migration. Redesign is allowed and expected; content removal is not.
- **Source of truth for the old site:** `C:\Users\Raptor\Downloads\docs-master\docs-master`
  (read-only reference — never edit it).
- **Reference plan:** `MIGRATION-PLAN.md` in this repo. Detailed and mostly sound; where
  this file and the plan disagree, **this file wins** (see §4 Decisions).

---

## 2. Ground truth — audit of the Jekyll source

Verified 2026-07-24 against `docs-master/docs-master`.

| Item | Reality |
|---|---|
| Live domain | `docs.learncomputer.in` (`CNAME`) |
| Doc pages | **132** files in `_docs/` |
| Categories (old) | `basic` (1), `css` (35), `design` (30), `html` (36), `javascript` (28), `react` (2) |
| **Categories (new)** | **7** — `basics` (1), `css` (35), `design` (17), `html` (36), `javascript` (28), `photoshop` (12), `react` (2). `design` split approved; see `docs/URLS.md` |
| Standalone pages | `index`, `syllabus`, `resourses` *(sic — misspelled in the live URL)*, `contact`, `about`, `box-model`, `box-shadow-generator`, `404` |
| Posts | 1 stub (`welcome-to-jekyll`) — **discard**, it is Jekyll boilerplate |
| Permalinks | 137 explicit `permalink:` lines; `index`/`syllabus`/`resourses` fall back to `permalink: /:path/` |
| Page format | `.md` files containing **raw HTML + Liquid includes**, not markdown |
| Real content | only what is inside `<div class="doc-content">` |
| Layouts / includes | 3 layouts, 9 includes — incl. **4 near-duplicate sidebars** |
| Assets | **222 MB**; `assets/img` is **216 MB** across 408 files. **188 MB referenced, only 28 MB orphaned** — measured, see `docs/RESEARCH.md` §2 |
| Worst offender | PDFs, not images — **~90 MB of course handouts** linked via `<a href>`, largest 26.5 MB |
| Front-end libs | Bootstrap, FontAwesome, Themify Icons, OwlCarousel2, jQuery — **all dropped** |
| Search | broken — `search.json` is 0 bytes, `_includes/search.html` has no JS |
| Contact form | dead — posts to `<?=$_SERVER['PHP_SELF']?>`, PHP on GitHub Pages, silently failing |
| `_config.yml` | never customised — `title: Your awesome title`, empty `url` |

### The content-shape problem

Every doc file looks like this:

```
---
layout: documentation
title: Introduction of CSS | Learn Computer Academy
permalink: css/css-intro/
---
<div class="loader">
{% include innerpage-navigation.html %}
{% include sidebar-general.html %}
  <div class="page-content"><div class="content-wrapper"><div class="row">
    <div class="col-md-9 content">
      <div class="doc-content">
        <h1>CSS Introduction</h1>       ← everything from here is real content
```

Extraction is a **scripted engineering task**, not copy-paste. 132 files × manual cleanup
guarantees inconsistency. See §6.

---

## 3. Non-negotiables

These are hard gates. Violating any of them means the migration failed, regardless of how
good the new site looks.

1. ~~URLs are preserved byte-for-byte.~~ **Lifted — D-12 is CONFIRMED.** No Search Console
   property, no `sitemap.xml`, no canonicals, no lesson pages indexed. Google was never
   given a way to discover this site. URLs are redesigned once, now, per `docs/URLS.md`,
   then **frozen at launch**. `urls-before.txt` survives as a **content completeness
   checklist**: all 140 pages must still exist somewhere.
2. **All 140 pages must have a destination**, and every moved path gets a **301**. Bookmarks
   and links from learncomputer.in are real even with zero Google presence.
   ⚠️ **526 internal `<a href>` links** across the lessons must be rewritten from
   `url-map.json`, or the site ships full of broken links.
3. **Content ships in the server HTML.** View-source on a doc page must show the lesson
   text. **Never SSR a doc page** — ISR only. Not indexed *yet* is not the same as never
   indexed; this gate is what makes indexing work when it happens.
4. **No secrets in `NEXT_PUBLIC_*`.** The Supabase service-role key and Cloudinary API
   secret live in `.env.local` and Vercel environment variables **only** — never a client
   component. Grep the build output before every deploy.
5. **Old site stays live for 30 days post-cutover.** GitHub Pages is the rollback.
6. **The 216 MB of assets never enters this repo.** They go to Cloudinary. `public/` stays
   under 5 MB.
7. ⚠️ **Two indexed PDF URLs must redirect.** `graphics-design/Color-Theory.pdf` and
   `ui/ui-theory-3.pdf` are in Google's index. When assets move to Cloudinary they 404
   unless 301'd — the migration's only real chance to *create* an indexing error.

---

## 4. Decisions

All settled 2026-07-24. These supersede `MIGRATION-PLAN.md` wherever they differ.

| Concern | Choice | Note |
|---|---|---|
| Framework | Next.js 16 LTS (16.2.x), App Router, TypeScript | |
| **Content store** | **Supabase Postgres, free tier** | Revised — see D-10. Admin panel is in scope. |
| **Host** | **Vercel** | **Not Cloudflare Workers.** Vercel's native `revalidateTag` replaces the plan's R2 + D1 + Durable Object apparatus entirely. |
| **Rendering** | **ISR + on-demand tag revalidation** | Publish → webhook → one page regenerates in ~1s. **Never SSR** — it would break §3.3 and hit the DB on every crawler visit. |
| **Design** | **W3Schools, modernized** | Familiar structure — fixed syllabus sidebar, example-first lessons, prominent Try-It buttons — with modern type, spacing, dark mode, no 2010s clutter. |
| **Try It Yourself** | **Yes, incl. React** | Browser-only. HTML/CSS/JS via `srcdoc` iframe; React via in-browser JSX transform (Sucrase). No backend. |
| **Images** | **Cloudinary** | A **separate account** from amartadey.com — credentials pending from the user. |
| Styling | Tailwind CSS + `@tailwindcss/typography` | |
| Components | shadcn/ui + `cmdk`, `sonner`, `dnd-kit`, Tiptap, CodeMirror 6 | see `docs/UI.md` |
| Icons | **Iconify via `unplugin-icons`** — compiled to SVG at build time | ⚠️ never `@iconify/react` runtime mode |
| Perf budget | JS < 100 KB gz · CSS < 30 KB · fonts < 100 KB · Lighthouse ≥ 95 | D-13. The old site shipped 3.5 MB — do not recreate it |
| Code highlighting | Shiki via `rehype-pretty-code`, at build time | |
| Search | Postgres full-text (`tsvector`) | Always current, unlike a build-time index. Replaces the empty `search.json`. |
| Contact form | Server Action → validate → email | Replaces the dead PHP. Provider TBD (Resend). |
| Dropped entirely | Bootstrap, FontAwesome, Themify, OwlCarousel2, jQuery | ~3.5 MB gone |

**Consequences:** Plan stages 2 (schema + RLS), 6 (revalidation) and 7 (admin panel) are
all **back in scope**. Stage 3 (extraction) is unchanged as the critical path — it writes
DB rows rather than files, which is a change of sink, not of logic.

**Still enforced:** all content access goes through **`lib/content.ts`**. Pages never call
Supabase directly. This is what made reversing D-01 cheap, and it is what will make the
next reversal cheap too. Do not bypass it for convenience.

### Free-tier guardrails — non-optional

- **Never SSR a doc page.** ISR only. SSR would hit Postgres on every crawler request and
  burn the 5 GB/month egress on bot traffic.
- **The project pauses after 7 days of inactivity** and there are **no automated backups**
  on free tier. One daily GitHub Action solves both — pings the DB, and exports all content
  to `backup/` as versioned MDX. See `docs/ADMIN.md`.
- **`backup/` is a backup, never a source of truth.** Never edited, never built from.

---

## 4a. Where the record lives — read these when starting a session

The user works in **fresh contexts across multiple days**. Nothing important may live only
in a chat transcript. Keeping these current is part of the work, not overhead.

| File | Holds | Update when |
|---|---|---|
| `CLAUDE.md` (this file) | rules, ground truth, non-negotiables | a rule or constraint changes |
| **`docs/PROGRESS.md`** | **running journal — read this first each session** | **end of every session, always** |
| `docs/DECISIONS.md` | every decision + why + what it cost | a decision is made or reversed |
| `docs/ASSETS.md` | Cloudinary conventions, where each file type goes | asset handling changes |
| `docs/ADMIN.md` | admin panel spec, usage panel, keep-alive/backup job | admin scope changes |
| `docs/CONTENT-MODEL.md` | the block schema + widget catalog | a block type is added |
| `docs/URLS.md` | new URL scheme + rewrite rules | ⚠️ frozen at launch |
| `docs/UI.md` | design system, library stack, performance budget | a dependency is added |
| **`docs/RESEARCH.md`** | **measured facts** — extraction difficulty, asset truth, version checks | new measurement is taken |
| `MIGRATION-PLAN.md` | original plan — historical reference | never; superseded by the above |
| `urls-before.txt` | 140 live URLs — the acceptance test | never |

**Rules:** append to `DECISIONS.md`, never rewrite it — supersede instead. End every
session by updating `PROGRESS.md`, including what failed. Secrets go in `.env.local` only;
tracked `.md` files may name a variable but never its value.

---

## 5. Working agreements

- **Migrate content first, redesign second.** Never do both to the same page in one pass.
  A parity bug and a design bug look identical when they land together.
- **Scripts over hands.** Anything touching all 132 docs is a re-runnable, idempotent
  script in `scripts/` that writes a report file. Read the report; work the failures.
- **Small, categorised commits.** Content extraction, design, and infra are separate
  commits. No bundled refactors.
- **Verify, then claim.** "Done" means it renders, the URL matches, and view-source shows
  the content. Report failures with the actual output.
- **Ask before anything outward-facing** — DNS, deploys to the live domain, sending mail,
  purging caches.

---

## 6. Roadmap

| # | Stage | Status |
|---|---|---|
| 0 | Baseline: `urls-before.txt` ✅ (140 URLs), Search Console export, current Lighthouse, `git tag pre-migration` | 🟨 partial |
| 1 | Scaffold Next.js 16 + Tailwind + shadcn | ⬜ |
| 2 | Supabase schema + RLS + auth | ⬜ needs project credentials |
| 3 | **Extraction script: 132 HTML docs → Supabase rows** ⭐ critical path | ⬜ |
| 4 | Assets: prune → WebP → Cloudinary → `image-map.json` | ⬜ |
| 5 | Public site build (shell, sidebar, lesson page, home, TOC) | ⬜ |
| 6 | ISR + revalidation webhook · **Try It Yourself editor** (HTML/CSS/JS + React) | ⬜ |
| 7 | Admin panel + usage panel + daily keep-alive/backup job | ⬜ |
| 8 | Search + contact form (both broken today — genuinely new functionality) | ⬜ |
| 9 | **SEO foundation** — sitemap, canonicals, JSON-LD, metadata. ~~highest-risk~~ → low risk, high upside (D-12) | ⬜ |
| 10 | Cutover to Vercel + **stand up Search Console & Bing Webmaster Tools, submit sitemap** | ⬜ |
| 11 | Post-launch watch — **first indexing**, not traffic recovery | ⬜ |

**Start at Stage 3, not Stage 1.** The extraction script holds every unknown in this
project. Run it against all 132 files and read the report before committing to a schedule:
`fail < 15` → the plan holds. `fail > 40` → the content needs real manual work and every
downstream estimate moves.

---

## 7. Repo layout (target)

```
app/
├─ layout.tsx
├─ page.tsx                        →  /
├─ [category]/[slug]/page.tsx      →  /css/css-intro/   ← the 132 docs
├─ syllabus/  resourses/  contact/
├─ box-model/  box-shadow-generator/   (client components)
├─ not-found.tsx  sitemap.ts  robots.ts
components/     ui/ (shadcn) + DocSidebar, TryItEditor, Toc, …
lib/            content access, search, schemas
scripts/        extract-docs.mjs, images.mjs, reports (git-ignored output)
content/        (if file-based — see §9)
public/         logo, favicons, OG image. Under 5 MB. Nothing else.
```

**One sidebar, not four.** `sidebar.html`, `sidebar-general.html`, `sidebar-resourses.html`
and `sidebar-syllabus.html` collapse into a single data-driven `<DocSidebar />`. Adding a
lesson becomes a data change, never a template edit.

---

## 8. Verification commands

```bash
# URL baseline (run from the Jekyll source)
grep -rh "^permalink:" _docs/ *.markdown *.html | sed 's/permalink: *//' | tr -d '"' | sort -u > urls-before.txt

# Residue check after extraction — all must return nothing
grep -rlE '\{%|\{\{|col-md-|class="loader"' content/

# Content-in-HTML gate
curl -s https://<preview>/css/css-intro/ | grep -c "Cascading Style Sheets"
```

---

## 9. Outstanding items

Nothing is blocking. Live list with dates: **`docs/DECISIONS.md` → Open**.

- ✅ **Cloudinary credentials** — received 2026-07-24, account `docslca`. In `.env.local`,
  verified git-ignored. See `docs/ASSETS.md`.
- ⬜ **Real copy for `/about/`** — the current page is unmodified Jekyll theme text. The
  URL is live, so the page must exist. Needed by Stage 5.
- ⬜ **Contact form inbox + Resend account** — needed by Stage 8.
- ⬜ **Search Console export**, top 100 pages by clicks/impressions — not blocking; makes
  Stage 9 targeted rather than protecting all 140 URLs uniformly.
- ⬜ **Higher-resolution logo** — not blocking; the existing PNG works.

Content decisions I took unilaterally (all reversible — see `docs/DECISIONS.md` D-08):
the Jekyll boilerplate post is dropped, and `_config.yml` has nothing worth carrying over.
