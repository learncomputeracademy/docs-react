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
  request). Geist Sans (UI/prose) + Geist Mono (code) — already present from the Next.js
  scaffold, no extra font added.
- **Color:** single accent, taken from the real LCA logo (not W3Schools green — the user
  supplied the actual brand asset). Same hue (oklch H=53, C=0.171) in both themes, but
  **different lightness per theme, deliberately**: `oklch(0.57 0.171 53)` in light mode,
  `oklch(0.75 0.171 53)` in dark. The logo's own orange (L=0.75) is only 2.35:1 against
  white — fails WCAG AA (4.5:1) outright if used as light-mode link/text color. Darkening
  to L=0.57 gets 4.72:1. Dark mode keeps the full-vibrancy L=0.75, which reads 8.45:1
  against the near-black background — no compromise needed there.
  ⚠️ **Solid buttons using `--primary` as a fill need dark text in both themes**, not the
  usual light-on-accent — this orange (either lightness) fails AA against white text but
  passes comfortably against near-black. `--primary-foreground` is set accordingly.
- **Contrast:** WCAG AA minimum on body text in **both** themes — verified by computing
  actual contrast ratios (OKLCH → linear sRGB → relative luminance), not eyeballed.
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
