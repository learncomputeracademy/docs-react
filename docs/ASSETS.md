# Assets — images, PDFs, ZIPs, everything binary

**Rule zero: binaries do not live in this repo.** The old repo carries 222 MB of assets and
it made every clone, build and deploy slower. That stops here.

---

## Where each kind of file goes

**Rule: anything ≥10 MB goes to R2. Everything else goes to Cloudinary.** Cloudinary's free
tier caps *every* upload type — images and raw files alike — at 10 MB; there is no way
around that on this plan, so the split is load-bearing, not a preference. See D-14 and
`lib/storage.ts` (the router that implements this).

| Kind | Home | Why |
|---|---|---|
| Lesson images, screenshots, diagrams (<10MB) | **Cloudinary** `image/upload` | auto WebP/AVIF, auto resize, free CDN |
| GIFs (there are 8, up to 3.3 MB each) | **Cloudinary**, converted to **MP4/WebM** | a 3.3 MB GIF becomes ~200 KB of video |
| PDFs, ZIPs <10MB — worksheets, cheat sheets, syllabi | **Cloudinary** `raw/upload` | same account, same CDN, one place to look |
| **Any file ≥10MB, any type** | **Cloudflare R2** (`lca-docs-files` bucket) | Cloudinary free tier hard-rejects it; R2 free tier is 10 GB storage, **$0 egress forever** — right fit for repeatedly-downloaded course handouts |
| Audio (`claps.mp3`, 436 KB) | **Cloudinary** `video/upload` | Cloudinary treats audio as video |
| Logo, favicons, OG image | **`public/`** in this repo | needed at build time; a few KB |

**`public/` stays under 5 MB.** If it grows past that, something is in the wrong place.

⚠️ **Oversized images should not silently land on R2.** R2 has none of Cloudinary's
automatic transformation (no f_auto/q_auto, no responsive resizing) — an unoptimized image
routed there would ship as-is and hurt the Lighthouse budget. `lib/storage.ts`'s router
doesn't enforce this distinction yet; the admin panel (Stage 7) should warn on an oversized
*image* upload rather than silently offloading it. Doesn't apply to PDFs/ZIPs — those have
no transformation benefit on Cloudinary anyway, so routing by size alone is correct for them.

## Cloudflare R2

Standalone S3-compatible object storage, decoupled entirely from hosting — the app talks to
it via API credentials, same pattern as Supabase/Cloudinary. **Does not use a custom
domain** (that would require proxying `learncomputer.in`'s DNS through Cloudflare); the
public `pub-xxxx.r2.dev` URL is used instead, keeping this dependency fully isolated from
the live domain.

- **Account:** `learncomputerseo@gmail.com` (Cloudflare account ID `14885c4d3fe179895f53e0b57f243eb2`)
- **Bucket:** `lca-docs-files`
- **Public URL:** `https://pub-ae7f8faef01f4179b3ee65008d9277eb.r2.dev`
- **Credentials:** `.env.local` only — `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` are
  server-only (S3-compatible API keys, not the Cloudflare account's own OAuth/API token —
  wrangler login can't generate these; they come from R2 → Manage R2 API Tokens in the
  dashboard). The token was created scoped to **all buckets** on the account, not just this
  one — acceptable for now since it's the only bucket that exists, but tighten scope if a
  second bucket is ever added.

---

## Cloudinary account

**Cloud name:** `docslca` — deliberately **not** the amartadey.com account, so quotas and
asset libraries stay separate.

Credentials live in **`.env.local`** (git-ignored) and in the Vercel dashboard
(Project → Settings → Environment Variables) before the first deploy.
`.env.example` lists the variable names with empty values.

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME   # public — appears in every delivery URL
CLOUDINARY_API_KEY                  # server-only
CLOUDINARY_API_SECRET               # server-only, upload scripts only
```

> The API secret must never reach the browser, a tracked file, or a `NEXT_PUBLIC_*`
> variable. It is only ever read by `scripts/` at your machine, never by the app at
> runtime — the site only ever *reads* from Cloudinary, using public delivery URLs.
> If it is ever exposed, rotate it in the Cloudinary console; nothing in the site breaks.

---

## Folder structure in Cloudinary

Mirror the content tree so an asset's home is guessable from the lesson that uses it.

```
docs/
├─ img/
│  ├─ css/          html/          javascript/
│  ├─ design/       ← the big one: 181 MB of graphics-design source images
│  ├─ react/        basic/
│  └─ site/         ← logo, OG images, anything not lesson-specific
├─ files/
│  ├─ pdf/          ← worksheets, cheat sheets
│  └─ zip/          ← exercise and starter files
└─ video/           ← GIFs converted to MP4/WebM, plus any audio
```

**Public ID = path without extension.** `docs/img/css/box-model` — stable, readable, and
lets `image-map.json` be generated deterministically instead of by hand.

---

## The migration itself (Stage 4)

Order matters. Do not upload first.

> ⚠️ **Measured 2026-07-24 — rewritten.** The original estimate ("expect to drop 30–50%
> for free") came from `MIGRATION-PLAN.md` and is **wrong for this site.** Detail in
> `docs/RESEARCH.md` §2.
>
> ```
> assets/img ....... 408 files, 216.2 MB
>   referenced ..... 209 files, 188.2 MB   (87% — this content genuinely uses its images)
>   orphaned ....... 199 files,  28.1 MB   (13% — all that is free to delete)
> broken refs ...... 1  (assets/img/movie.mp4)
> ```
>
> **~90 MB of the referenced 188 MB is PDFs**, linked via `<a href>` not `<img src>` —
> course handouts, largest `designer-guide-4.pdf` at **26.5 MB**.

1. ✅ **PDFs — done (2026-07-25).** All 18 PDFs migrated via `scripts/migrate-pdfs.mjs`.
   None were orphaned. 16 → Cloudinary raw (<10MB each), 2 → R2
   (`designer-guide-2.pdf` 21.4 MB, `designer-guide-4.pdf` 26.5 MB — both **not**
   compressed, uploaded at full size per the standing "compression is the user's call"
   rule). All 26 `<a href>` occurrences across 6 lessons rewritten to the new URLs and
   verified live (HTTP 200, correct byte sizes). See session 5 in `PROGRESS.md`.
   **Bug found and fixed during this pass**: the Stage 3 table-block extractor was
   discarding any `<a>`/`<img>` inside table cells, keeping only `.text()` — this silently
   dropped the download buttons in `design/intro`'s resource table. Fixed in
   `extract-docs.mjs` (cells now keep HTML, like richtext/callout blocks already did);
   all 131 docs re-extracted and re-written.
2. **Prune — 28.1 MB, not 100 MB.** Delete the 199 orphaned images. The largest are unused
   GIFs (`tabs-howto` 3.3 MB, `shrink-nav` 2.2 MB, `sign-in-form` 2.0 MB) left from an old
   homepage. Everything else is genuinely referenced and migrates.
3. ✅ **Images and GIFs — done (2026-07-25).** `scripts/audit-images.mjs` found 191
   referenced files (98.6 MB: 139 jpg, 42 png, 10 gif), 198 orphaned (27.5 MB, skipped —
   never uploaded, source stays untouched). `scripts/migrate-images.mjs` converted every
   raster to WebP q80/max 1600px via `sharp` and uploaded to Cloudinary. All 10 GIFs
   converted to MP4 via `ffmpeg` (D-15) — the 7 large color-theory ones (51 MB combined,
   largest `black-color.gif` at 16.2 MB) came down to **6.7 MB combined, an 87% reduction**.
   `scripts/image-map.json` has all 191 entries.
   **Rewrite pass covered three surfaces, not one**: `image` blocks' `_src` field, `<img
   src>` inside richtext/table-cell HTML, *and* — found only by cross-checking for
   residual old-path references after the first pass — `<a href download>` links (a
   thumbnail + "download full size" pattern in 7 `design/` lessons, same shape as the PDF
   download tables) and one `<iframe src="....jpg">` (`photoshop/shortcut-keys`, using an
   iframe for scroll behavior on a very tall reference image). Zero residual old-path
   references remain, verified by direct query, not just script exit code.
   ⚠️ **Second bug found during Stage 5 build-out**: `center-align.gif` (used in
   `css/align`) was converted to MP4 like the other 9 GIFs, but it turned out to be a
   **single-frame GIF** — `sharp().metadata().pages === 1`, not an animation. ffmpeg
   produced a degenerate video (`duration: null`, unplayable in Chrome's own native
   player, confirmed before assuming it was a React bug). Fixed the classification in
   `migrate-images.mjs` (`pages > 1` gates the GIF→video path now) and re-uploaded that
   one file as a normal WebP image; the other 9 GIFs were re-checked and are genuine
   multi-frame animations (7 and 8 frames respectively for the two smallest).
4. **Verify:** zero unmapped images in a fresh report, zero 404s in a link crawl — still
   worth doing once Stage 5 pages exist to crawl.

**Exit criteria:** ✅ met — `image-map.json` covers every referenced image, `public/` stays
under 5 MB (nothing was ever added there), no broken image/video references in the DB.

---

## Delivery conventions

- Always `f_auto,q_auto` — Cloudinary negotiates AVIF/WebP per browser.
- Always explicit `width`/`height` on `<img>`, via `next/image`. Unsized images were an
  actual Lighthouse failure on the current site; do not reintroduce them.
- Lesson images: `loading="lazy"`. The one above-the-fold hero image: `fetchpriority="high"`,
  never lazy.
- Cap delivered width at the container width (`c_limit,w_800` for in-lesson images) — do
  not ship a 1600px image into an 800px column.

## Linking a PDF or ZIP from a lesson

```mdx
<FileLink type="pdf"  id="docs/files/pdf/css-cheatsheet"    label="CSS Cheat Sheet" size="240 KB" />
<FileLink type="zip"  id="docs/files/zip/flexbox-exercise"  label="Flexbox Exercise Files" size="1.2 MB" />
```

`<FileLink>` builds the `raw/upload` URL from `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, so the
cloud name is never hardcoded in content. Always state the file size in the label — it is
a small courtesy that prevents a lot of confusion on slow connections.
