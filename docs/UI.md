# UI stack & design system

Design direction is **D-03: W3Schools, modernized** — the structure students recognise,
everything else brought up to date. Library choices are **[D-13](DECISIONS.md)**.

---

## The guardrail that makes "use any library" safe

The old site shipped **~3.5 MB** of Bootstrap + FontAwesome + Themify + OwlCarousel +
jQuery. Killing that is the largest single performance win available, and it is very easy
to recreate it one convenient dependency at a time.

**Budget, enforced per PR:**

| Metric | Budget |
|---|---|
| JS shipped to a lesson page | **< 100 KB** gzipped |
| CSS | **< 30 KB** gzipped |
| Fonts | **< 100 KB** total, self-hosted, 2 families max |
| Lighthouse Performance (desktop) | **≥ 95** |

A lesson page is *text and code*. It should ship almost no JavaScript. The only client
component on a typical page is Try-It, and it lazy-loads on interaction.

**Rule:** a new runtime dependency needs a one-line justification in the PR. Build-time
dependencies (Shiki, unplugin-icons) are free — use them liberally.

---

## Icons — Iconify, compiled not fetched

**Use `unplugin-icons` + `@iconify/json`.** Icons compile to inline SVG at build time,
tree-shaken, zero runtime cost, no network request.

```tsx
import IconCss from "~icons/logos/css-3";
import IconCopy from "~icons/lucide/copy";
```

> ⚠️ **Do not use `@iconify/react`'s default runtime mode.** It fetches icon data from
> Iconify's public API at render time — an external request per icon set, a flash of
> missing icon, and a third-party dependency in the critical path. Same icons, wrong
> delivery. If `@iconify/react` is used, it must be with a local `@iconify/json` bundle.

**Sets:** `lucide` for UI chrome (consistent 24px grid), `logos` / `devicon` for
technology marks (CSS3, HTML5, JS, React, Photoshop) — those brand icons are exactly what
a course index page wants and what FontAwesome was being used badly for.

---

## Components

| Need | Choice | Note |
|---|---|---|
| Base primitives | **shadcn/ui** | copy-in, no runtime dep, fully editable |
| Underlying a11y | Radix (via shadcn) | keyboard + ARIA handled |
| **Command palette** | **`cmdk`** | ⌘K search. The single highest-impact modern touch for a docs site |
| Toasts | `sonner` | admin panel feedback |
| Drag & drop | `dnd-kit` | block reordering — shadcn ships none |
| Code editor | CodeMirror 6 | Try-It + admin code blocks. Lazy-loaded |
| Syntax highlighting | **Shiki** (build time) | zero client JS. Never a client-side highlighter |
| Rich text | Tiptap | the `richtext` block only |
| Animation | **`motion`** | sparingly — see below |

### Animation, deliberately restrained

Motion earns its place in transitions, sidebar/mobile-nav, and copy-confirmation
feedback. It does **not** belong in scroll-triggered lesson content — students are here to
read, and animation that delays text is a bug wearing a costume.

`prefers-reduced-motion` must be honoured globally, not per component.

---

## Design tokens

**Dark mode is required**, not optional — it is a developer-audience baseline. Both themes
get designed, neither is an afterthought.

- **Type:** two families max, self-hosted via `next/font` (zero layout shift, no external
  request). One sans for UI/prose, one mono for code. Nothing else.
- **Color:** a single accent, used for links, active sidebar item and primary actions.
  W3Schools' green is recognisable to your students — a refined version keeps the
  familiarity without the 2010s saturation.
- **Contrast:** WCAG AA minimum on body text in **both** themes. Check the accent against
  both backgrounds; a single accent that works on white often fails on near-black.
- **Spacing/radius:** one scale, defined once in Tailwind config, never ad-hoc values.

---

## The four screens that decide whether this feels good

1. **Lesson page** — the sidebar, the prose column, the TOC. 95% of all time on site.
2. **Code block** — 634 of them. Copy button, language label, and *restrained* highlighting.
   Get this one wrong and the whole site feels cheap.
3. **Try It Yourself** — split editor/preview, the signature interaction.
4. **Command palette** — ⌘K, instant, keyboard-first.

Everything else is chrome. Build these four properly before polishing anything else.

---

## Approval flow

Per CLAUDE.md §5 — migrate content first, redesign second. Before building 132 pages of
UI, I'll build **the homepage and one representative lesson page** and get sign-off on
those two. A design mistake found on page 2 is cheap; found on page 132 it is not.
