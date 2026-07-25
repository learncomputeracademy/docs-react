# URL scheme

Unlocked by **[D-12](DECISIONS.md)** — the site is not indexed, so URLs can be fixed now.
**This window closes at launch.** Once Google indexes the site, these freeze permanently.

---

## The problem with the current URLs

Every slug repeats its own category:

```
/css/css-intro/              /javascript/javascript-arrays/       /html/html-intro/
/css/css-syllabus/           /javascript/js-syllabus/             /html/html-syllabus/
                                        ↑ and inconsistently: js- vs javascript-
```

Plus `/resourses/` is misspelled, and the two tools sit at the root with no trailing slash
while everything else has one.

---

## Rules

**R1 · Drop the category prefix from the slug.** The category is already in the path.

```
/css/css-intro/            →  /css/intro/
/javascript/javascript-arrays/  →  /javascript/arrays/
/html/html-forms/          →  /html/forms/
/photoshop/photoshop-layers/ →  /photoshop/layers/
```

**R2 · One name per concept.** `js-syllabus`, `css-syllabus`, `html-syllabus` and
`react-syllabus` all become `/<category>/syllabus/`.

**R3 · Fix spelling.** `/resourses/` → **`/resources/`**.

**R4 · Group the tools.** `/box-model` → `/tools/box-model/`,
`/box-shadow-generator` → `/tools/box-shadow-generator/`. The nav already points at a
Scrollbar App and a Gradient Generator; they get `/tools/…` slots when they move in.

**R5 · Trailing slashes: pick one.** `trailingSlash: false` (Next.js default) — every page
is `/css/intro`, no exceptions, 301 from the slashed form. The current site is inconsistent
and there is no reason to inherit that.

**R6 · Keep meaningful prefixes.** `tag-article`, `tag-video` etc. are *not* stutter — the
prefix says what the page is about. They stay as `/html/tag-article`.

**R7 · Never invent depth.** Two segments, `/[category]/[slug]`. No `/html/tags/article`.
Depth costs more than it gives on a 132-page site.

---

## Categories

| Now | Proposed | Pages | Rationale |
|---|---|---|---|
| `basic` (1 page) | **`basics`** | 1 | `basic-computer` → `/basics/computer-fundamentals` |
| `css` | `css` | 35 | unchanged |
| `html` | `html` | 36 | unchanged |
| `javascript` | `javascript` | 28 | unchanged |
| `react` | `react` | 2 | unchanged |
| `design` (30 pages) | ✅ **split → `design` + `photoshop`** | 17 + 12 | **approved by user 2026-07-24** |

Seven categories total.

### The `design` → `design` + `photoshop` split (approved)

Photoshop has its own syllabus page, so it was already a separate course living inside
another category's URL space. Splitting it makes the sidebar navigable instead of a
30-item wall.

**`photoshop/` — 12 pages.** Mechanical: strip the `photoshop-` prefix.

| Old | New |
|---|---|
| `design/photoshop-intro` | `/photoshop/intro` |
| `design/photoshop-toolbar` | `/photoshop/toolbar` |
| `design/photoshop-layers` | `/photoshop/layers` |
| `design/photoshop-selection-tools` | `/photoshop/selection-tools` |
| `design/photoshop-drawing-selection-tools` | `/photoshop/drawing-selection-tools` |
| `design/photoshop-alteration-tools` | `/photoshop/alteration-tools` |
| `design/photoshop-additional-tools` | `/photoshop/additional-tools` |
| `design/photoshop-color-boxes` | `/photoshop/color-boxes` |
| `design/photoshop-resizing` | `/photoshop/resizing` |
| `design/photoshop-saving` | `/photoshop/saving` |
| `design/photoshop-shortcut-keys` | `/photoshop/shortcut-keys` |
| `design/photoshop-syllabus` | `/photoshop/syllabus` |

**`design/` — 17 pages.** Drops the `graphics-design-` stutter.

| Old | New | Note |
|---|---|---|
| `design/graphics-design-intro` | `/design/intro` | |
| `design/graphics-design-brochure-intro` | `/design/brochure` | |
| `design/graphics-design-brochure-exercise` | `/design/brochure-exercise` | |
| `design/graphics-design-flyer` | `/design/flyer` | |
| `design/graphics-design-menu-exercise` | `/design/menu-exercise` | |
| `design/graphics-design-poster` | `/design/poster` | ⚠️ merge target |
| `design/graphics-design-posters` | → **301 to `/design/poster`** | ⚠️ **duplicate — see below** |
| `design/graphics-design-ui-exercise` | `/design/ui-exercise` | |
| `design/graphics-design-visiting-card-intro` | `/design/visiting-card` | |
| `design/graphics-design-visiting-card-exercise` | `/design/visiting-card-exercise` | |
| `design/color-theory` | `/design/color-theory` | |
| `design/color-in-design` | `/design/color-in-design` | |
| `design/typography` | `/design/typography` | |
| `design/raster-graphics` | `/design/raster-graphics` | |
| `design/vector-graphics` | `/design/vector-graphics` | |
| `design/pixel` | `/design/pixel` | |
| `design/web-design` | `/design/web-design` | |
| `design/image` | `/design/image-basics` | `image` alone is too generic; the page is "What is an image? / Bitmap" |

### ⚠️ Duplicate found: `graphics-design-poster` vs `graphics-design-posters`

The two files are **the same page**. `diff` shows 10 differing lines total: the title, the
permalink, and **one link** — one version points readers at
`webgraphicshub.com/works/social-media-post-design/`, the other at a Freepik search.
Same `<h1>` ("Poster Design"), same body, 5,768 vs 5,896 bytes.

**Recommendation: merge into `/design/poster`, keeping *both* example links** — Web
Graphics Hub and Freepik are both useful references, so nothing is lost. 301
`design/graphics-design-posters/` → `/design/poster`.

This takes the lesson count **132 → 131**. Flagged rather than done silently, because
CLAUDE.md §1 says no content is dropped — merging duplicates while preserving both links
honours that, but it is the user's call. **Default if unanswered: merge.**

---

## Standalone pages

| Now | Proposed |
|---|---|
| `/` | `/` |
| `/syllabus/` | `/syllabus` |
| `/resourses/` | **`/resources`** ← spelling fixed |
| `/contact/` | `/contact` |
| `/about/` | `/about` — still needs real copy (O-1) |
| `/box-model` | **`/tools/box-model`** |
| `/box-shadow-generator` | **`/tools/box-shadow-generator`** |
| `/404.html` | Next `not-found.tsx` |

---

## Implementation

**Do not hand-write 140 mappings.** The Stage 3 extraction script applies R1–R7 and emits
`scripts/url-map.json`:

```json
{ "css/css-intro": "css/intro", "javascript/js-syllabus": "javascript/syllabus" }
```

That file has three consumers:

1. `docs.path` — the new URL, written to Supabase.
2. **Internal link rewriting** — there are **526 `<a href>` links** across the 132 lessons.
   Many point at old paths. The script rewrites them from the same map. Miss this and the
   site ships with hundreds of broken internal links. This is the highest-risk part of the
   URL change, and it is entirely automatable.
3. `next.config` redirects — a 301 from every old path, so bookmarks and any links from
   learncomputer.in keep working.

**Verification:** after extraction, no lesson body may contain a link to a path that is not
in `url-map.json`'s values. Add that as an assertion in `extract-report.json`.

---

## Freeze

At launch, add an entry to `PROGRESS.md`: **"URLs frozen — D-12 expired."** From that point
`docs.path` is locked in the admin panel (see `docs/ADMIN.md`) and any change needs a 301.
