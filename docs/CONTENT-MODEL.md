# Content model — the block system

How a lesson is stored, edited and rendered. Governed by **[D-11](DECISIONS.md)**.

**One sentence:** a lesson is an ordered array of typed blocks in a `jsonb` column; the
admin panel is a block editor; the public site maps each block type to a React component.

---

## Why blocks, and not one big rich-text field

A single HTML blob is easier to build and worse at everything after that. Concretely, for
**this** content:

- **634 code snippets** each need a language, and half of them will need a "runnable"
  flag for Try-It. In an HTML blob, that is un-editable structured data — an editor would
  be hand-writing `<pre class="snippet"><code class="js">`.
- **Try It Yourself (D-04) requires structured code.** You cannot reliably pull editable
  source out of prose HTML. This is the feature that forces the decision.
- Quizzes and exercises are the obvious next feature. Blocks make them an added type;
  a blob makes them a rewrite.
- Blocks are sanitisable by construction — each type has a known shape, so nothing
  arbitrary reaches `dangerouslySetInnerHTML` except the one prose type.

**And not pure blocks either.** Forcing every paragraph into its own block makes writing
prose miserable. So: one `richtext` block type holds normal prose (Tiptap, inline
formatting, lists, links), and everything structural gets its own type.

---

## Schema

```ts
type Block =
  | { id: string; type: "richtext"; html: string }                    // prose, Tiptap
  | { id; type: "heading";  level: 2|3|4|5|6; text: string; anchor: string }  // 5–6 measured in the wild
  | { id; type: "code";     language: Lang; code: string;
      filename?: string; runnable?: boolean }                          // runnable → Try-It
  | { id; type: "tryit";    mode: "web" | "react";
      files: { html?: string; css?: string; js?: string; jsx?: string } }
  | { id; type: "image";    publicId: string; alt: string;
      caption?: string; width: number; height: number }                // Cloudinary
  | { id; type: "loop";     publicId: string; alt: string;
      width: number; height: number }                                  // was a GIF — see D-15
  | { id; type: "table";    header: string[]; rows: string[][]; caption?: string }
  | { id; type: "callout";  variant: "note" | "tip" | "warning" | "danger";
      title?: string; html: string }
  | { id; type: "video";    provider: "youtube" | "cloudinary"; videoId: string; title: string }
  | { id; type: "file";     publicId: string; kind: "pdf" | "zip";
      label: string; size: string }                                    // see ASSETS.md
  | { id; type: "quiz";     /* Phase 3 — schema deliberately unspecified */ };
```

Stored on `docs.blocks jsonb`. `body_html` remains as a **rendered cache** for search
excerpts and nothing else — never edited, never the source of truth.

**`id` is a stable nanoid per block.** Needed for drag-reorder keys, deep links, and
future per-block comments. Generate once, never regenerate.

**`heading` is its own type** rather than living inside `richtext` — that is what makes the
table of contents, anchor links and the admin's outline view fall out for free. 802 `<h2>`s
across the site make this worth it.

**`loop` vs `video`, and why both exist (D-15):** 7 GIFs in the old site (color-theory
diagrams, up to 16.2 MB each) were originally `<img>` tags — a real animated-image use case,
not a video-with-controls use case. `loop` mirrors `image`'s shape exactly (same fields) but
renders as `<video autoplay muted loop playsinline>`, because HTML has no way to autoplay a
video through an `<img>` tag. `video` stays a distinct type for actual embedded players
(YouTube, a Cloudinary video with controls/title) — different UX, shouldn't share a type
just because both are "video files" at the storage layer.

---

## Build order — resist building all of them

The long tail is genuinely tiny: 8 callouts, 3 iframes, 2 videos, 2 audio, 1 `<mark>` in
the entire site. Building 12 widgets before any content is migrated is the classic trap.

| Phase | Widgets | Covers |
|---|---|---|
| **1** | `richtext`, `heading`, `code`, `image`, `table` | **~95% of all existing content** |
| **2** | `callout`, `tryit`, `file`, `video` | the rest, plus the new Try-It feature |
| **3** | `quiz`, `exercise`, anything the editor actually asks for | future |

Phase 1 is the bar for the Stage 3 extraction to be considered done.

---

## What the extraction script maps (Stage 3)

The source is unusually regular, which is what makes this tractable:

| Source HTML | → Block |
|---|---|
| `<pre class="snippet"><code class="js">` | `code`, `language: "js"` — **language comes free** |
| `<h2>` / `<h3>` / `<h4>` | `heading` + generated anchor |
| `<div class="img-block">` + `<div class="text-block">` | `image` with `caption` |
| `<table>` | `table` |
| `<div class="note">` | `callout`, `variant: "note"` |
| `<iframe src="youtube…">` | `video` |
| `<p> <ul> <ol> <b> <a> <code>` (inline) | accumulate into `richtext` |
| `<hr>` (635 of them) | ✂️ **dropped** — a separator after every `<h2>`, not content |
| `div.footer-btn` prev/next (131) | ✂️ **dropped** — generated from sidebar order |
| `col-md-*`, `row`, `content-wrapper`, `loader` | ✂️ **dropped** — Bootstrap scaffolding |

⚠️ **This makes Stage 3 harder than dumping a blob**, and that cost is accepted knowingly.
Segmenting into blocks is the price of the editor being good.

**Measured 2026-07-24 — the cost is now known, not guessed** (`docs/RESEARCH.md` §1):

| Class | Files | Work |
|---|---|---|
| Clean | **65** | script handles end-to-end |
| Mechanical | **52** | unwrap stray divs, drop `footer-btn`, support `h5`/`h6` — one fix, applies to all |
| **Needs a decision** | **15** | live interactive demos |

**The 15 are an opportunity.** They contain working `<form>`, `<select>`, `<textarea>` and
inline `<style>` demos — `css-form`, `css-navbar`, `css-dropdowns`, `html-forms`,
`html-form-elements`, `html-form-input-types` and 9 more. **Convert them to `tryit` blocks,
not `richtext`.** They are already exactly what Try-It exists to show, which turns the
hardest files into the site's best pages.

`html/tag-video` holds the corpus's only `<script>` — hand-convert it.

---

## Rendering (public site)

A server component switch: block type → component. Runs at ISR build time, so all block
content lands in the server HTML and the CLAUDE.md §3.3 SEO gate holds.

```tsx
// components/blocks/BlockRenderer.tsx  — server component
{blocks.map(b => {
  switch (b.type) {
    case "richtext": return <Prose key={b.id} html={b.html} />;
    case "code":     return <CodeBlock key={b.id} {...b} />;   // Shiki, build-time
    case "tryit":    return <TryIt key={b.id} {...b} />;        // the only client component
    ...
  }
})}
```

Only `tryit` is a client component. Everything else is server-rendered and ships zero JS.

---

## Editor UX (admin)

shadcn/ui throughout — see `docs/ADMIN.md`.

- Vertical list of blocks; hover reveals drag handle, duplicate, delete.
- `/` slash-command inserts a block, W3Schools-authoring speed. Also a `+` button between
  blocks for discoverability.
- **Drag to reorder — `dnd-kit`.** shadcn does not ship drag-and-drop; this is the extra
  dependency the block editor needs.
- Each non-prose block edits **in place**, not in a modal. Modals make a 40-block lesson
  exhausting.
- Code blocks: CodeMirror 6, language from the block's own field, plus a "make runnable"
  toggle that converts `code` → `tryit`.
- Autosave draft to `status='draft'`; explicit Publish is what fires the revalidation
  webhook.

**The thing that will actually be felt daily:** paste handling. An editor pasting from
Word, VS Code, or the old live site should get sensible blocks, not markup soup. Paste a
code block → get a `code` block with language detected. This is worth more than three
extra widget types.
