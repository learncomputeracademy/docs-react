# Assets — images, PDFs, ZIPs, everything binary

**Rule zero: binaries do not live in this repo.** The old repo carries 222 MB of assets and
it made every clone, build and deploy slower. That stops here.

---

## Where each kind of file goes

| Kind | Home | Why |
|---|---|---|
| Lesson images, screenshots, diagrams | **Cloudinary** `image/upload` | auto WebP/AVIF, auto resize, free CDN |
| GIFs (there are 8, up to 3.3 MB each) | **Cloudinary**, converted to **MP4/WebM** | a 3.3 MB GIF becomes ~200 KB of video |
| PDFs — worksheets, cheat sheets, syllabi | **Cloudinary** `raw/upload` | same account, same CDN, one place to look |
| ZIPs — exercise files, starter projects | **Cloudinary** `raw/upload` | same |
| Audio (`claps.mp3`, 436 KB) | **Cloudinary** `video/upload` | Cloudinary treats audio as video |
| Logo, favicons, OG image | **`public/`** in this repo | needed at build time; a few KB |
| Anything over ~50 MB | ask first | Cloudinary free tier is 25 GB storage / 25 GB bandwidth per month |

**`public/` stays under 5 MB.** If it grows past that, something is in the wrong place.

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

1. **Prune — 28.1 MB, not 100 MB.** Delete the 199 orphans. The largest are unused GIFs
   (`tabs-howto` 3.3 MB, `shrink-nav` 2.2 MB, `sign-in-form` 2.0 MB) left from an old
   homepage. Everything else is genuinely referenced and migrates.
2. **Convert images only.** ~98 MB of real images → WebP q80, max 1600px via `sharp` →
   expect **25–35 MB**. GIFs → MP4.
   **Do not convert the PDFs** — upload as `raw` at full size. Compressing a 26.5 MB
   handout is a content decision for the user, not an automated step. Flag it, don't do it.
3. **Upload** with `scripts/upload-assets.mjs` — idempotent, keyed on public ID, so a
   re-run overwrites rather than duplicates.
4. **Emit `scripts/image-map.json`** — `{ "assets/img/css/box-model.png": "<delivery URL>" }`.
   The Stage 3 extraction script consumes this to rewrite `<img src>` in every lesson.
5. **Verify:** zero unmapped images in `extract-report.json`, zero 404s in a link crawl.

**Exit criteria:** `image-map.json` covers every referenced image · `public/` under 5 MB ·
no broken images after the extraction re-run.

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
