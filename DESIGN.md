---
name: docs.learncomputer.in
description: A bilingual programming curriculum site that reads as engineered software, not a marketing funnel.
colors:
  primary-light: "oklch(0.57 0.171 53)"
  primary-dark: "oklch(0.75 0.171 53)"
  background-light: "oklch(1 0 0)"
  background-dark: "oklch(0.145 0 0)"
  foreground-light: "oklch(0.145 0 0)"
  foreground-dark: "oklch(0.985 0 0)"
  card-light: "oklch(1 0 0)"
  card-dark: "oklch(0.205 0 0)"
  muted-light: "oklch(0.97 0 0)"
  muted-dark: "oklch(0.269 0 0)"
  muted-foreground-light: "oklch(0.556 0 0)"
  muted-foreground-dark: "oklch(0.708 0 0)"
  accent-light: "oklch(0.96 0.03 53)"
  accent-dark: "oklch(0.28 0.05 53)"
  border-light: "oklch(0.922 0 0)"
  border-dark: "oklch(1 0 0 / 10%)"
  destructive-light: "oklch(0.577 0.245 27.325)"
  destructive-dark: "oklch(0.704 0.191 22.216)"
typography:
  display:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.02em"
    fontFeature: "uppercase"
  code:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    lineHeight: 1.625
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
spacing:
  sm: "0.75rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.background-light}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1.25rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1.25rem"
  subject-panel:
    backgroundColor: "{colors.card-light}"
    rounded: "{rounded.xl}"
    padding: "0"
  icon-badge:
    backgroundColor: "{colors.accent-light}"
    textColor: "{colors.primary-light}"
    rounded: "{rounded.md}"
    size: "2rem"
---

# Design System: docs.learncomputer.in

## Overview

**Creative North Star: "The Engineered Curriculum"**

This is a learning platform built to look like the software it teaches, not like a course-marketplace funnel. Its material is near-black/near-white neutrals, sharp 1px borders, and a single brand-orange accent used sparingly — closer to Linear or Raycast than to a bootcamp landing page. Structure carries the page: a two-column hero with real trust microcopy (lesson counts, subject counts), a grouped list-based subject index instead of a flat card wall, and one authored motion moment (a live-typing code panel) that demonstrates the product rather than decorating the page.

The system explicitly rejects ambient decorative chrome: no dot-grid or blur-blob backgrounds, no auto-shimmer, no unmotivated border-beams, and no soft illustrated-education imagery. The one border-beam that exists is earned — it rings the live-typing code panel specifically to signal "this is live," not applied as generic surface polish. Confirmed anti-references from the direction contract: decorative dot-grids, blur blobs, and the glossy "sticker" icon packs (Twemoji/Fluent Color/Streamline) that were removed from the subject index during build (design critique 2026-08-06) for reading as stitched-together against the flat brand logos beside them.

**Key Characteristics:**
- Near-black/near-white neutral base, one brand-orange accent, applied with restraint
- List-based, grouped subject index — not a uniform card grid
- Sharp 1px borders and light `shadow-sm` elevation on floating surfaces, never heavy drop shadows
- Exactly one ambient motion moment sitewide: the hero's live-typing code panel
- One consistent icon-badge treatment regardless of whether the icon is a real brand logo or a Lucide outline glyph

## Colors

A committed, not drenched, palette: one brand accent against a pure neutral gray/black/white scale, tuned separately for light and dark mode rather than inverted mechanically.

### Primary
- **Brand Orange** (`oklch(0.57 0.171 53)` light / `oklch(0.75 0.171 53)` dark): the CTA button, active/hover accents, the second word of the hero headline, icon-badge tint, focus rings. Light-mode value is deliberately darkened from the logo's native `L=0.75` (2.35:1 on white, fails AA) down to `L=0.57` (4.72:1, verified AA) — a legibility correction, not a stylistic choice. Dark mode restores the logo's full native vibrancy (`L=0.75`, 8.45:1 against the dark background) since contrast is no longer a problem there. Primary buttons in dark mode use dark text on this orange (`--primary-foreground: oklch(0.145 0 0)`), never light text — light text on this orange fails AA.

### Neutral
- **Paper / Near-Black** (`oklch(1 0 0)` / `oklch(0.145 0 0)`): page background, inverted per mode.
- **Card Surface** (`oklch(1 0 0)` light / `oklch(0.205 0 0)` dark): panels, the subject-index rows, the animated-code frame — one step off the page background in dark mode only, flat-matching it in light mode.
- **Border Hairline** (`oklch(0.922 0 0)` light / `oklch(1 0 0 / 10%)` dark): every 1px border sitewide, always this token, never a heavier gray.
- **Muted Foreground** (`oklch(0.556 0 0)` / `oklch(0.708 0 0)`): secondary body copy, lesson counts, sub-labels.
- **Accent Tint** (`oklch(0.96 0.03 53)` light / `oklch(0.28 0.05 53)` dark): a low-chroma orange wash used only as the icon-badge background — never a full surface fill.

### Named Rules
**The One Accent Rule.** Brand orange is the only chromatic color anywhere on the page (destructive red exists only for form/error states, unused on this homepage). Every other surface is neutral gray, black, or white.

**The Earned Motion Rule.** Ambient looping motion (border-beams, shimmer, auto-playing chrome) is reserved for the one element that is actually demonstrating a live capability — the AnimatedCode panel. It is not a decorative device available to other surfaces.

## Typography

**Display / Body Font:** Geist Sans (with `ui-sans-serif, system-ui, sans-serif` fallback)
**Mono / Code Font:** Geist Mono (with `ui-monospace, monospace` fallback)

**Character:** A single sans-serif family carries every weight of the page — headline, body, and UI chrome — paired with Geist Mono strictly for code. No serif, no display face, no system-font fallback in practice (both are self-hosted via `next/font` and wired through Tailwind's `@theme inline` block; a prior build had this silently falling back to the browser default and was fixed this session).

### Hierarchy
- **Display** (600, `text-4xl sm:text-6xl` / ~2.25–3.75rem, tight tracking): the hero H1 only, two-tone (neutral + one brand-orange span).
- **Title** (700, `text-2xl`/1.5rem): section headings ("Pick a subject").
- **Subtitle** (600, `text-lg`/1.125rem): the about-band and panel-group headings.
- **Body** (400, `text-sm`–`text-lg`/0.875–1.125rem, relaxed line-height): hero subhead, feature-strip copy, lesson lists.
- **Label** (500, `text-xs`/0.75rem, uppercase, tracked-out): subject-panel group headers only ("START HERE", "BUILD THE WEB").
- **Code** (Geist Mono, `text-[13px]`, relaxed line-height): the AnimatedCode panel and all lesson code blocks (Shiki, ayu-light/dracula pair).

### Named Rules
**The One Family Rule.** Geist Sans handles every text role from hero H1 to body copy to UI labels; only code switches families. No secondary display or serif face exists anywhere in the built system.

## Layout

A centered `max-w-6xl` container with `px-6` gutters runs the whole page. The hero is a two-column grid (`lg:grid-cols-2`) — copy left, AnimatedCode panel right — that stacks to one column below `lg`, and is visible (not `hidden lg:block`) at every width, since the code panel is the page's one piece of product proof and was fixed this session to render on mobile too. The subject index below it is a two-column grid of grouped panels (`lg:grid-cols-2`) rather than a flat N-up card wall. The feature band is a single wrapping flex row divided by hairlines (`divide-x`), not three repeated card shapes. Section rhythm runs on `py-16`/`py-24` vertical spacing with `gap-12` between hero columns and `gap-6` between subject panels.

## Elevation & Depth

Hybrid: mostly flat, with `shadow-sm` reserved for surfaces that visually float above the page — the subject-index panels, the about-band card, and CTA buttons — plus a slightly heavier `shadow-lg` on the AnimatedCode panel, its one genuinely elevated surface. Elevation was added deliberately this session to correct a zero-shadow build (finish review 2026-08-06); the values are conventional offset+blur shadows, never zero-offset "glow" shadows.

### Shadow Vocabulary
- **Panel** (`shadow-sm`): subject-index panels, the about-band card, primary/outline buttons.
- **Featured surface** (`shadow-lg`): the AnimatedCode panel — the one element with the most visual weight on the page.

### Named Rules
**The Floating-Surface Rule.** Anything that reads as a discrete panel sitting above the page background (not flush with it, like the feature-strip row) carries `shadow-sm` at minimum. Flush inline elements (feature strip, section headers) stay shadow-free.

## Shapes

Corners run a consistent scale from `rounded-md` (buttons, icon badges, 8px) up to `rounded-xl` (subject panels, the about-band card, the AnimatedCode frame, 14px) — nothing sharper than 6px, nothing more rounded than 14px; no pill shapes, no fully square corners. Borders are uniformly 1px hairlines (`border`, using the `--border` token), never doubled or heavy. No clipping, masking, or angled-cut silhouettes anywhere in the built system.

## Components

### Buttons
- **Shape:** `rounded-md` (8px)
- **Primary:** brand-orange background, `shadow-sm shadow-primary/20`, used once per hero as the primary CTA ("Start learning")
- **Outline:** transparent background, 1px border, used for the secondary hero CTA and the about-band's external link
- **Hover / Focus:** background/opacity shift on hover, ring token on focus

### Cards / Containers
- **Corner Style:** `rounded-xl` (14px)
- **Background:** `card` token (flush with page in light mode, one step lighter than page in dark mode)
- **Shadow Strategy:** `shadow-sm`, see Elevation & Depth
- **Border:** 1px hairline (`border`)
- **Internal Padding:** panel body rows at `px-4 py-3`; the about-band card at `p-8`

### Subject Index Panel (signature component)
The homepage's core structural device, replacing a conventional card grid. Each subject group (e.g. "Build the web") is one bordered, rounded panel: a muted uppercase label header, then a `divide-y` list of rows — each row an icon badge, category title, lesson count, and a hover-revealed arrow. Rows share one icon-badge treatment (`bg-accent`, `rounded-md`, `size-8`) regardless of whether the icon inside is a real brand-color SVG logo (HTML, CSS, JS, React, PHP, Python, Node.js, WordPress, Photoshop) or a Lucide outline glyph tinted `text-primary` (Basics, Design, Programming, AI, SQL, SEO, Marketing, Career, Hosting) — a deliberate fix (finish review 2026-08-06) for the two icon systems previously reading as visually separate.

### AnimatedCode Panel (signature component)
A bordered, `rounded-xl`, `shadow-lg` panel styled like a code editor: a muted title bar with three traffic-light dots (destructive/primary/emerald, all at 60% opacity) and a filename, then a Shiki-highlighted `<pre>` that types out one of seven language snippets character-by-character on a loop, with a blinking-cursor CSS effect on the last line while typing. Ringed by `BorderBeam`, the one legitimate ambient-motion element in the system — earned because it signals "this is a live capability," not decoration.

### Navigation
Not sampled directly on this page pass (header/sidebar live outside `home-content.tsx`); no claims made here.

## Do's and Don'ts

### Do:
- **Do** keep brand orange to a single accent role — CTA, active state, icon tint, one hero span — never a fill color for large surfaces.
- **Do** use the shared icon-badge treatment (`bg-accent`, `rounded-md`, `size-8`, `text-primary` for non-brand icons) for any new category or list row, regardless of whether the icon is a brand logo or an outline glyph.
- **Do** give floating panels `shadow-sm` minimum; reserve `shadow-lg` for the page's single most prominent live element.
- **Do** prefer a grouped, list-based index (bordered panel of divided rows) over a uniform card grid when presenting more than a handful of like items.

### Don't:
- **Don't** add ambient decorative chrome — dot-grids, blur blobs, auto-shimmer, unmotivated border-beams — anywhere the element isn't demonstrating a live capability. The one border-beam that exists is earned by AnimatedCode specifically.
- **Don't** reintroduce glossy "sticker" icon packs (Twemoji, Fluent Color, Streamline) next to the flat brand-color logos; they were removed for reading as stitched-together (design critique 2026-08-06). This is a defect the build corrected, not a style to reintroduce for variety.
- **Don't** build a same-size icon-over-heading-over-text 3-up card scaffold for feature lists; the built system uses a single divided inline strip instead (finish review 2026-08-06).
- **Don't** use hard-offset neobrutalist shadows, glyph icon fonts, or a system display face — none of these appear anywhere in the built system and none should be introduced to future surfaces.
