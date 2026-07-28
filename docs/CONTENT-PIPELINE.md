# Content pipeline — topic → written → illustrated → bilingual → live

**What this is:** the standing runbook for adding new lesson content to the site. Say
*"write content for `<topic>`, follow `docs/CONTENT-PIPELINE.md`"* and this file is the
whole spec — no re-deciding any of it per run.

**Settled 2026-07-28** with the site owner. The four defaults below are decisions, not
suggestions; change them here rather than per-run, so behaviour stays predictable.

| Decision | Setting |
|---|---|
| **Language** | **Always both.** Every lesson ships EN + BN in the same run. Never EN-only. |
| **Publish state** | **Published immediately** (`status: 'published'`). |
| **Images** | **Generated in the same run** — no placeholder pass. |
| **Image style** | **Flat vector, brand-orange accent.** See §4. |

---

## 0. Before writing anything — confirm the outline

**Always propose the lesson list and get a yes before writing lesson bodies.** Rewriting 12
approved lessons because the outline was wrong is the single most expensive mistake this
pipeline can make, and it is entirely avoidable with one question.

Propose: category, the ordered lesson list with one-line scope each, and roughly how many
images. Then stop and wait.

**Existing categories** (`categories.slug`): `basics`, `programming`, `html`, `css`,
`javascript`, `react`, `design`, `photoshop`. New category = a `categories` row first;
confirm with the owner before creating one, since it changes the site's top-level nav shape.

⚠️ **`basics` currently holds ONE doc containing 16 in-page chapters** (computer generations,
memory, number systems, hardware, software, I/O, storage, OS, networking, internet, security,
applications, quantum, AI). Adding "topics" there means either splitting that monolith into
real docs or adding alongside it — **ask which**, they are very different jobs and the split
one rewrites a page that already exists and is already translated.

---

## 1. Where content actually lives

Two tables. No files, no MDX — `backup/` is an export, never a source (CLAUDE.md §4).

**`docs`** — one row per lesson, English:

| Column | Value |
|---|---|
| `category_id` | looked up from `categories` by slug |
| `slug` | lesson slug, e.g. `input-devices` |
| `path` | `<category>/<slug>` — **the upsert key** |
| `title` | lesson title |
| `meta_title` | `` `${title} \| Learn Computer Academy` `` |
| `meta_description` | one sentence, ~150 chars, written not templated |
| `blocks` | `jsonb` block array — see §2 |
| `toc` | derived from `heading` blocks |
| `status` | `'published'` |
| `sort_order` | 1-based position within the category |
| `published_at` | `new Date().toISOString()` |

Upsert with `{ onConflict: 'path' }` — makes re-running the script safe and idempotent.

**`doc_translations`** — one row per lesson per locale, Bengali:

```
{ doc_id, locale: 'bn', title, meta_title, meta_description, blocks, toc }
```

Upsert with `{ onConflict: 'doc_id,locale' }`.

---

## 2. The block schema

Full reference: `docs/CONTENT-MODEL.md`. Blocks used in practice, with the builder helpers
every content script defines (copy them from `scripts/create-programming-section.mjs`):

```js
h(level, text)            // heading — auto-generates the anchor
p(html)                   // richtext — real HTML: <p>, <ul>, <b>, <code>, <a>
code(language, source)    // syntax-highlighted, Shiki at build time
callout(variant, html, title)  // 'note' | 'tip' | 'warning' | 'danger'
table(header, rows)
img(publicId, alt, width, height, caption)  // see §4
```

**Every block needs a stable `nanoid(12)` `id`** — generated once at write time, never
regenerated (drag-reorder keys and deep links depend on it).

`toc` is derived, never hand-written:

```js
blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
```

**Block-level rules that matter:**
- `heading` is its own block type — never an `<h2>` inside `richtext`, or it vanishes from
  the table of contents and anchor links.
- Prose goes in `richtext` as real HTML, not markdown. It is the only type that reaches
  `dangerouslySetInnerHTML`, so it must be clean, hand-authored HTML — never pasted markup.
- Code that a reader would want to run gets `runnable: true` → becomes a Try-It block.

---

## 3. Writing the lesson content

**Original, written fresh.** Never copy from W3Schools, GeeksforGeeks, Wikipedia, or any
other source. Concepts are universal; the sentences must be ours. This is a public education
site under someone's real name — plagiarism is an unrecoverable reputational problem, not a
style issue.

**Accuracy over fluency.** These are teaching materials for beginners who cannot tell when
they are being told something wrong. If a claim is uncertain, either verify it or leave it
out. A confidently-worded wrong explanation is worse than a missing one — this has already
bitten this project once (D-48 shipped a factually wrong claim about scrollbar buttons in a
*teaching* tool, caught only by live testing).

**Voice and level**, matching the existing `programming` and `basics` content:
- Plain English, short sentences, second person ("you").
- Assume zero prior knowledge; define a term the first time it appears.
- Concrete examples over abstract description. Analogies only where they genuinely clarify.
- No "for LCA students only" framing anywhere — the site is public and free (CLAUDE.md §1).

**Shape of a lesson** (~8–15 blocks is typical):
1. `richtext` — what this is and why it matters, no heading above it
2. `heading(2)` + content, repeated per section
3. one image per major concept that benefits from one (§4)
4. `callout('tip'|'note')` where there is a real gotcha worth flagging
5. `table` for comparisons — genuinely better than prose for these

**Internal links:** check `scripts/url-map.json` before writing any `<a href>` to another
lesson. Slugs changed in the migration — the old Jekyll form is usually wrong. This has
produced real bugs three separate times; the map check is the only reliable way.

---

## 4. Images — Magnific `gpt-2` → Cloudinary

### Model (fixed)

**Always `mode: "gpt-2"`.** Never `auto`, never another family. It is the site owner's
standing instruction, and independently correct — Magnific ranks `gpt-2` `tier: sota,
rank: 1` for infographics, diagrams, typography and non-photorealistic design.

| Setting | Value | Why |
|---|---|---|
| `mode` | `gpt-2` | fixed |
| `resolution` | `1k` | renders in a ~700px column; Cloudinary downsizes anyway |
| `quality` | `medium` | **130 credits.** 2k/high is 700 for no visible gain here |
| `aspectRatio` | `16:9` wide diagrams · `4:3` general · `1:1` single concepts | |
| `count` | `1` | generate one, regenerate if wrong — cheaper than picking from 4 |

Run `simulate_cost` before any batch of more than ~5 images and report the total before
spending. Reserve 2k/high for hero or OG images only.

### House style (fixed)

Append this to every prompt so the category stays visually coherent:

> Flat vector illustration, clean and minimal, generous whitespace, white background,
> single accent colour bright orange #f97316 with neutral grays, no gradients, no 3D,
> no photorealism, no drop shadows, simple bold shapes, readable at small size,
> educational diagram style.

Label text inside an image only when the diagram genuinely needs it — `gpt-2` renders text
well, but any text baked into an image is **untranslatable** and invisible to search. Prefer
a caption or surrounding prose. Never bake a whole paragraph into an image.

### Getting the image into Cloudinary

Magnific-hosted URLs are not a delivery CDN for this site — every image must end up in
Cloudinary under this project's conventions (`docs/ASSETS.md`).

1. `images_generate` with the settings above.
2. `creations_wait` to get the finished asset URL.
3. Download the bytes, upload to Cloudinary at
   **`docs/img/<category>/<lesson-slug>-<n>`** (no file extension in the public ID).
   `scripts/upload-logo.mjs` is the working reference for the upload call.
4. **Read `width`/`height` from the Cloudinary upload response** — put the real numbers in
   the block. Never assume them; wrong dimensions cause layout shift (CLS), which the
   perf budget explicitly guards.
5. Set the block's `alt` to a real description of the image content — never empty, never
   the lesson title. It is what screen readers and search engines get.

The public site requests these via the standard `f_auto,q_auto` loader; no per-image
transform work is needed.

---

## 5. Bengali

**Every lesson, same run, no exceptions.** A missing translation means `/bn/<path>` breaks
while the language switcher still offers it.

- **West Bengal / Indian Bengali** — জল, not পানি. This is a standing preference.
- Translate the *content*, not the markup: same block structure, same block `id`s, same
  anchors, same images. Only human-readable text changes.
- **Keep technical terms in English inside Bengali sentences** — `CPU`, `RAM`, `operating
  system`, `input device`. This matches every existing translation on the site; transliterating
  them reads as unnatural and makes the lesson harder, not easier.
- Translate `title`, `meta_title`, `meta_description`, heading text, prose, table cells,
  callout titles, and image `alt`/`caption`. Do **not** translate code, language keywords,
  or `publicId`s.
- `toc` for the BN row uses the **same anchor `id`s** as English with translated `text`, so
  deep links work across both locales.

---

## 6. Delivery — the script

One re-runnable script per content run, in `scripts/`, named
`create-<topic>-content.mjs`. This is CLAUDE.md §5's "scripts over hands" rule: content
written straight into the admin panel is unreviewable and unrepeatable.

Copy the structure of **`scripts/create-programming-section.mjs`** — it is the proven
reference: env loading, block builders, `--dry-run`, per-lesson upsert, a written summary.

Required properties:
- **`--dry-run` flag** that prints what would be written and touches nothing. Always run
  this first and read the output.
- **Idempotent** — upserts on `path` / `doc_id,locale`, so a re-run corrects rather than
  duplicates.
- **Writes both** the `docs` row and its `doc_translations` row.
- **Never deletes.** No content run removes an existing doc. If something must go, that is
  a separate, deliberate, explicitly-approved action.

---

## 7. Publishing and verification

`status: 'published'` + the Supabase Database Webhook → `/api/revalidate` → the affected
pages regenerate. No deploy needed; ISR handles it.

**Verify, then claim** (CLAUDE.md §5) — a run is not done until:

- [ ] `--dry-run` output read and correct
- [ ] script run for real, every lesson reports success
- [ ] `/<category>/<slug>` loads and shows the content
- [ ] `/bn/<category>/<slug>` loads and shows Bengali
- [ ] images actually render (not broken Cloudinary URLs), correct dimensions, no layout shift
- [ ] the category index and sidebar list the new lessons in the intended order
- [ ] **view-source shows the lesson text** — CLAUDE.md §3.3's hard SEO gate. If content is
      only in client-side JS, the run has failed regardless of how it looks in a browser.
- [ ] no console errors on the live pages

**Then journal it** — `docs/PROGRESS.md` session entry and a `docs/DECISIONS.md` entry if
anything non-obvious was decided. Commit the script (content is code here). **Never push
without asking.**

---

## 8. Cost

At the fixed settings: **130 credits per image.**

| Scope | Images | Credits |
|---|---|---|
| One lesson | ~2 | ~260 |
| A 10-lesson category | ~20 | ~2,600 |
| A 20-lesson category | ~40 | ~5,200 |

Check `account_balance` before a large run and report the projected spend before committing
to it. Text costs nothing — only images draw down credits.

---

## 9. Guardrails

- **Never invent facts.** Verify or omit. These are teaching materials.
- **Never copy prose** from another site.
- **Never delete or overwrite existing lessons** as a side effect of adding new ones.
- **Never skip Bengali**, never skip `alt` text.
- **Never hardcode a lesson link** without checking `scripts/url-map.json` first.
- **Never spend a large image budget** without reporting the estimate first.
- **Never push to git** without explicit approval.
- If the outline, scope, or category is ambiguous — **ask before writing**, not after.
