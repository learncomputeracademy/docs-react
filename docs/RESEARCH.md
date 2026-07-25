# Research findings — 2026-07-24

Everything below is **measured or verified**, not estimated. Method: a throwaway cheerio
parse of all 132 lesson files, plus live checks against the running site and current docs.
The spike scripts were scratch and are not kept — the numbers are.

⚠️ **Two of these findings overturn assumptions already written into other files.** They
have been corrected at source; this page records why.

---

## 1. Extraction feasibility ⭐ the number the timeline hangs on

`MIGRATION-PLAN.md` set the gate: **fail < 15 → schedule holds; fail > 40 → everything
slips.** The plan's fail condition was "file has no `.doc-content`".

```
files scanned .............. 132
missing .doc-content ....... 0        ← the hard fail condition is ZERO
Liquid inside content ...... 1
top-level blocks ........... 4,687
```

**The schedule holds.** Every one of the 132 files has a clean, findable content root.

Classified by how much human attention each file needs:

| Class | Files | What it means |
|---|---|---|
| **Clean** | **65** | script handles it end-to-end, no review |
| **Mechanical** | **52** | unwrap stray `div.row` / classless divs, drop `footer-btn`, support `h5`/`h6`. Scripted once, applies to all |
| **Needs a decision** | **15** | live interactive demos — see below |

### The 15 files are an opportunity, not debt

They contain **working HTML forms, `<select>`, `<textarea>`, `<button>` and inline
`<style>` demo blocks** — real interactive examples:

```
css/css-form  css/css-navbar  css/css-dropdowns  css/css-pseudo-classes
css/css-pseudo-elements  css/css-inline-block  css/css-image-transparency
css/css-icons  css/css-font  html/html-forms  html/html-form-elements
html/html-form-input-types  html/html-blocks  html/html-responsive  html/tag-video
```

**These should become `tryit` blocks (D-04), not `richtext`.** They are already the exact
thing the Try-It editor exists to show — a live demo the student can edit. Converting them
turns the hardest 15 files into the site's best pages.

`html/tag-video` also carries the only `<script>` in the entire corpus. Handle it by hand.

### Block-model corrections this forces

- **`heading` must allow levels 2–6.** There are 10 `h6` and 7 `h5` in the wild;
  `docs/CONTENT-MODEL.md` originally allowed 2–4 only. **Fixed.**
- `div.footer-btn` (33), `div.row` (34) and classless `div` (33) are all droppable or
  unwrappable — confirmed as chrome, not content.

---

## 2. Assets — the migration plan's prune estimate was wrong

`MIGRATION-PLAN.md` and the first draft of `docs/ASSETS.md` both said *"expect to drop
30–50% of that 218 MB for free."* **Measured, it is 13%.**

```
assets/img on disk ......... 408 files, 216.2 MB
  referenced by lessons .... 209 files, 188.2 MB   (87%)
  ORPHANED ................. 199 files,  28.1 MB   (13%)
broken references .......... 1  (assets/img/movie.mp4)
```

This content genuinely uses its images. **Do not plan around a free 100 MB saving.**

### Where the weight actually is: PDFs, not images

**~90 MB of the 188 MB referenced is PDFs** — course handouts linked with `<a href>`,
which is why the first pass mis-classified them as orphans:

| File | Size |
|---|---|
| `graphics-design/pdfs/designer-guide-4.pdf` | **26.5 MB** |
| `graphics-design/pdfs/designer-guide-2.pdf` | **21.4 MB** |
| `pdfs/Indian_Rupee_Symbol.pdf`, `designer-guide-3.pdf` | 6.8 MB each |
| `typography-1/3.pdf`, `designer-guide-1.pdf` | 4.4–5.8 MB |
| + 12 more (`ui-theory-*`, `Color-Theory`, `wireframes`) | ~10 MB |

**Revised Stage 4 plan:**

1. **~98 MB of actual images** → WebP q80, max 1600px → expect **25–35 MB**.
2. **~90 MB of PDFs** → Cloudinary `raw/upload` **as-is**. Do not convert. A 26.5 MB
   handout is worth compressing, but that is a content decision for the user, not an
   automated step.
3. **28.1 MB orphans** → delete. Largest are unused GIFs (`tabs-howto` 3.3 MB,
   `shrink-nav` 2.2 MB, `sign-in-form` 2.0 MB) — old homepage decoration, not lesson content.

**Total Cloudinary payload ≈ 120 MB** against a 25 GB free tier. Not a concern.

---

## 3. Indexing — the user's assumption is *mostly* right, with a real exception

D-12 rests on "the site is not indexed." Verified from outside:

| Check | Result |
|---|---|
| Site live? | ✅ `/css/css-intro/` serves a full lesson |
| Canonical tag | ❌ none |
| Meta robots | ❌ none |
| `robots.txt` | not a real file — Cloudflare is serving a managed content-signals page |
| Lesson pages in search results | **none surfaced** ✅ |
| **Assets in search results** | ⚠️ **`graphics-design/Color-Theory.pdf` and `ui/ui-theory-3.pdf` ARE indexed** |

**D-12 stands** — no lesson page appears in the index, so the URL redesign is safe.

**But the domain is crawled, and at least two PDF URLs are in Google's index.** Two
consequences, both cheap:

1. **Those PDF URLs must redirect.** When assets move to Cloudinary,
   `/assets/img/graphics-design/**/*.pdf` will 404 on indexed URLs. Add 301s to the
   Cloudinary `raw` URLs. Without this, the migration creates the site's first-ever
   indexing errors.
2. ✅ **RESOLVED, same day — there is no Search Console property.** The user has never set
   one up for this domain. Adding that to `sitemap.xml` returning **404** and no real
   `robots.txt`, the picture is complete and self-consistent: **this site was never given
   a way to be discovered.** 132 lessons reachable only by internal navigation. The two
   indexed PDFs were almost certainly found through external links.
   **D-12 is confirmed, not assumed.** The migration's headline risk — losing organic
   traffic — is structurally impossible here.

---

## 4. Version & platform facts (verified July 2026)

| Thing | Status | Action |
|---|---|---|
| **Next.js** | **16.2.11 is Active LTS** (rel. 2026-07-21). 15.5.21 is Maintenance LTS | ⚠️ **Plan said Next 15 — corrected to 16 LTS everywhere** |
| Next 16.3 | canary/preview only | do not use |
| Supabase free | 500 MB DB · 5 GB egress · 1 GB storage · 50k MAU · 500k edge invocations | as assumed |
| Supabase free | **max 2 active projects** | ⚠️ **new constraint** — check existing projects before creating |
| Supabase pause | 7 days inactivity, **manual** restore, up to 60 s cold start | keep-alive job confirmed necessary |

**On Next.js 16:** it is a major version ahead of what `MIGRATION-PLAN.md` assumed. App
Router, ISR and `revalidateTag` are all unchanged in shape, so no architectural rework —
but do not copy Next 15 snippets from the plan without checking them against current docs.

---

## 5. Content provenance — worth knowing

Dead internal links include `css_text.html` and **`tryit.asp?filename=trycss_text`**.
`tryit.asp` is W3Schools' own Try-It URL format. Some lessons were adapted from W3Schools
with links left pointing back at the original.

**89 of 131 distinct internal links are already broken on the live site today.** This is
pre-existing, not something the migration introduces — but since every link gets rewritten
in Stage 3 anyway, it is nearly free to fix. The extraction script should report any link
that does not resolve to a known page.

No action needed beyond that. Flagged because it explains the broken links rather than
leaving them a mystery for a future session.

---

## Corrections applied to other files

| File | Was | Now |
|---|---|---|
| `docs/ASSETS.md` | "drop 30–50% for free" | measured 13%; PDF strategy added |
| `docs/CONTENT-MODEL.md` | heading levels 2–4 | 2–6; 15 demo files → `tryit` |
| `CLAUDE.md`, `DECISIONS.md` | Next.js 15 | **Next.js 16 LTS** |
| `docs/DECISIONS.md` D-12 | "not indexed" | stands, + indexed-PDF redirects required |

Sources: [Next.js July 2026 security release](https://nextjs.org/blog/july-2026-security-release) ·
[Next.js EOL dates](https://endoflife.date/nextjs) ·
[Supabase free tier limits 2026](https://uibakery.io/blog/supabase-pricing) ·
[Supabase pricing breakdown](https://www.metacto.com/blogs/the-true-cost-of-supabase-a-comprehensive-guide-to-pricing-integration-and-maintenance)
