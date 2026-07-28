# Tools — the interactive apps under `/tools/`

The register of every interactive tool: what's built, what's promised, and what's worth
building next. Update this whenever a tool ships or an idea is added, killed, or reordered.

**What a "tool" is here:** a self-contained interactive app, no database dependency, no
admin panel, reachable at `/tools/<slug>` and `/bn/tools/<slug>`. Tools are *not* lessons —
they don't live in Supabase and they aren't editable from the admin panel. They're code.

---

## Why we build these at all

Generic versions of nearly every tool below already exist a thousand times over. A gradient
generator is not a differentiator. **What is:** ours are linked from the lesson they teach,
they explain themselves, and they work in Bengali. That combination is the moat, and it's
why the three rules in *House rules* are requirements rather than polish.

The secondary reason: the old Jekyll site advertised four tools in its nav and only ever
shipped two. All four now exist here (D-48) — closing that gap was table stakes.

---

## House rules — every tool, no exceptions

1. **Bilingual.** EN + BN routes, strings in a dedicated `lib/<tool>-i18n.ts`. West Bengal
   Bengali; CSS/JS property and function names stay English inside Bengali sentences
   (students type `margin`, not `মার্জিন`). See `lib/box-model-i18n.ts` for the pattern.
2. **Teaching panel.** Hover/focus a control → a plain-language explanation of what that
   property actually does. This is the thing generic tools don't have.
3. **Links back to the lesson** it teaches, where one exists.
4. **Real CSS/JS on real elements.** Never simulate the behaviour in JavaScript — let the
   browser compute it, and measure with `getBoundingClientRect`/`ResizeObserver` rather
   than arithmetic that can drift from what's rendered. This is what makes the tool
   trustworthy as a teaching aid. (D-43.)
5. **Static route** (`○` in the build output). No SSR, no DB call.
6. **Old URL gets a 301** if the tool existed on the Jekyll site (`next.config.ts`
   `redirects()`), plus `app/sitemap.ts` entries for both locales.
7. **Perf budget still applies** — JS < 100 KB gz (D-13). Anything needing canvas work or a
   heavy encoder must lazy-load its bundle; flagged per-tool below where relevant.

### Reusable pieces (check these before writing anything)

| Need | Use |
|---|---|
| Sliders, section cards, segmented toggles | `components/tools/tool-controls.tsx` |
| Colour conversion — hex/rgba/hsl/**oklch**, colour extraction from a CSS string | `lib/color.ts` |
| Drag-to-reorder lists | `@dnd-kit` — pattern in `components/tools/box-shadow-demo.tsx` and `components/admin/docs-list.tsx` |
| Runnable code sandbox (HTML/CSS/JS + React via Sucrase) | `lib/tryit.ts`, `components/blocks/try-it.tsx` |
| Canonical + hreflang metadata | `buildAlternates()` in `lib/seo.ts` |
| Undo/redo, share-link state, localStorage persistence | pattern in `box-shadow-demo.tsx` |

### ⚠️ Gotcha: `useState(defaultState)` must never generate ids at call time

If `defaultState()` builds its initial items/layers/stops via a `makeX()` factory that calls
`uid()`/`crypto.randomUUID()` for the id, **every one of these tools' first render will
hydration-mismatch** — `useState`'s lazy initializer runs once during SSR and again,
independently, during the client's hydration render, producing two different random ids
for what's supposed to be the same initial state (D-47, caught live on the flexbox
playground after shipping on all three earlier tools without ever noticing in testing).

**The fix, and the pattern to follow from the start**: give every `makeX()` factory an
optional `id?: string` second parameter that overrides the default `uid()` call, and have
`defaultState()` pass fixed literal ids (`'default-1'`, `'default-2'`, …) for its initial
set. Every *other* call site — an "Add layer" button, a click-to-insert-stop handler — is a
client-only event handler that never runs during SSR, so it's safe to keep calling `uid()`
there unchanged.

**Also worth knowing**: `read_console_messages` attaches its listener lazily on first call
— messages emitted before that first call (including a hydration warning, which fires
within milliseconds of navigation) are gone. Call it once *before* navigating, not after,
or a broken hydration pass reads as a clean console.

---

## Built

| Tool | Route | Old URL | Shipped |
|---|---|---|---|
| Interactive Box Model | `/tools/box-model` | `/box-model` → 301 | D-43 · Session 21 |
| Box Shadow Generator | `/tools/box-shadow-generator` | `/box-shadow-generator` → 301 | D-44 · Session 22 |
| Gradient Generator | `/tools/gradient` | `/gradient/` → 301 | D-45 · Session 23 |
| Flexbox Playground | `/tools/flexbox` | *(none — new)* | D-46 · Session 24 |
| Scrollbar App | `/tools/scrollbar` | `/scrollbar/` → 301 | D-48 · Session 25 |

**Box Model** — box-sizing toggle, width/height in px/%/em/rem, per-side padding/margin/
border with link modes (All / Top-Bottom / Left-Right / Each), border style + colour,
per-corner radius, editable content text and font size. Hover/click any layer for an
explanation; four preset scenarios including the "why border-box exists" one (300px asked
→ 360px actual → flip → exactly 300px). Live measured size maths, DevTools-convention
colours (blue/green/amber/orange). Deliberately excludes `display`, `position`, `overflow`
— each is a different lesson.

**Box Shadow Generator** — multi-layer stack (add/duplicate/delete/reorder/hide/solo),
drag-on-canvas offset editing, hex+alpha colour with eyedropper, output in hex8/rgba/hsl/
oklch, paste-to-import parser, light-source mode (one angle drives every layer coherently),
smooth-shadow generator (easing-curve stack), A/B compare, 12 presets, three modes
(`box-shadow` / `text-shadow` / `filter: drop-shadow()` — the last demonstrates
silhouette-following vs bounding-box), four output formats, undo/redo, shareable URL state.

**Gradient Generator** — linear/radial/conic, unlimited colour stops (click the bar to
insert one with an interpolated colour, drag a handle to move it, per-stop hex+alpha with
eyedropper), drag directly on the preview to set angle (linear) or center (radial/conic).
**sRGB vs OKLCH shown side by side by default, not behind a toggle** — both renders use the
browser's own `in oklch` CSS Color 4 interpolation syntax, not a simulation; verified live
that the two visibly differ (a vivid mid-purple in OKLCH vs a duller one in sRGB for the
same indigo→pink stops). Paste-to-import (linear/radial/conic, angle or `to <side>`, shape
+ size keywords, `at X% Y%`, an `in oklch` hint, named/hex/rgba colours). 8 presets
(sunset, ocean, forest, candy, subtle UI background, glass, mesh-ish, mono conic). Same
four output formats, undo/redo, shareable URL state as the shadow tool.

**Flexbox Playground** — every container property (`flex-direction`, `flex-wrap`,
`justify-content`, `align-items`, `align-content`, `gap`) and every per-item property
(`flex-grow`, `flex-shrink`, `flex-basis`, `order`, `align-self`). **No drag-to-reorder —
deliberately.** The item number badge is fixed HTML/DOM order and never moves; only `order`
(an editable slider, -5 to 5) changes visual position. Dragging would have implied direct
positional control, which is exactly the thing `order` isn't — the point is that visual
position and source order can diverge, and the fixed badges next to a real live layout are
what make that visible. Each item shows its real measured size (`ResizeObserver`, never
computed). 5 presets — swapped "holy grail" and "sticky footer" for presets that actually
fit a flat single-container model (see the D-46 note in `docs/DECISIONS.md` for why). Three
output formats — CSS, Tailwind, React style; no CSS-variable tab, since flexbox output is
inherently multi-rule, not a single value. **No lesson to link to** — the old curriculum
has zero flexbox coverage (confirmed by grepping the source), so the CTA points at the CSS
category listing and the tool's own explanation panel carries the full teaching load.

**Scrollbar App** — every part of both scrollbar systems: the standard `scrollbar-width`
(auto/thin/none) and `scrollbar-color`, and every `::-webkit-scrollbar` part (track, thumb
+ hover colour, corner, buttons) with colour/radius/border on each. Both are generated
together, driven by the same underlying colour choices, and rendered live via real
`::-webkit-scrollbar` CSS on the actual preview element (through CSS custom properties, not
a mocked-up image) — verified in a Chromium browser that the live scrollbar visibly changes
with every control, including a genuine arrow glyph Chrome draws automatically on a sized
`::-webkit-scrollbar-button`. An **honest support note** up top: `scrollbar-width`/
`scrollbar-color` are Firefox-and-newer-Chromium; `::-webkit-scrollbar` is WebKit/Blink-only
and Firefox ignores it outright — generate both if you want it to look intentional
everywhere. 5 presets. Two output tabs (CSS, React) — no Tailwind tab, since core Tailwind
has no scrollbar utilities and generating classes for a plugin this project doesn't use
would produce copy that doesn't work. **Links to a real lesson** —
`css/pseudo-elements` — one of only two tools that has one (the box model demo links to
`css/boxmodel`; the shadow, gradient and flexbox tools all fall back to the CSS category
listing because no matching lesson exists).

Closes the old Jekyll nav's last unfulfilled promise (see D-48 in `docs/DECISIONS.md`) — no
tool the old site advertised and never built remains 404ing.

---

## Roadmap

Ordered by value. Curriculum links are to lessons that already exist in `_docs/`.

### Tier 1 — highest value, tied to existing lessons

**Grid Generator** — `/tools/grid`
Visual row/column builder with `fr`/`px`/`auto`/`minmax()`, drag items across cells, named
areas via a text grid, `gap`. Exports real `grid-template-areas`. Together with Flexbox this
closes the layout gap the old CSS syllabus never modernised.
*Lessons:* `css-align`, `css-display-visibility`

**CSS Specificity Calculator** — `/tools/specificity`
Paste a selector → (a,b,c) breakdown, each part colour-coded to what produced it. Compare
two selectors, say which wins and why. Tiny build, high clarity-per-line.
*Lesson:* `css-specificity`

**Colour & Contrast Studio** — `/tools/colour`
Palette from one base (complementary / triadic / analogous / split-complementary), WCAG
AA/AAA contrast checker with per-text-size pass-fail, colourblind simulation, export as CSS
variables or Tailwind config. Serves the design curriculum *and* accessibility. `lib/color.ts`
already does most of the maths.
*Lessons:* `css-colors`, `design/color-theory`, `design/color-in-design`

**CSS Units Playground** — `/tools/units`
One box; switch `px`/`em`/`rem`/`%`/`vw`/`vh`/`ch`. Parent-size slider **and** root-font-size
slider, so `em` vs `rem` inheritance becomes visible rather than theoretical. This is what
makes the unit lesson click.
*Lesson:* `css-units`

### Tier 2 — JavaScript (little good competition here)

**Event Propagation Visualizer** — `/tools/event-flow`
Nested boxes; click one and watch capture travel down and bubbling travel back up as an
animated trace. Toggle `capture`, fire `stopPropagation()` mid-flight and watch the rest
die. Genuinely hard to teach in prose.
*Lessons:* `javascript-events`, `javascript-advanced-events`

**Event Loop / Async Visualizer** — `/tools/event-loop`
Call stack + microtask queue + macrotask queue side by side, stepping through code the user
writes. Hardest build on this list; also the least well-served by existing tools.
*Lesson:* `javascript-promises-and-async`

**Regex Tester** — `/tools/regex`
Live match highlighting, named groups, plain-English explanation per token, cheat-sheet
sidebar, presets (email, phone, Indian PIN code, URL).

**JSON Formatter / Validator** — `/tools/json`
Format, minify, collapsible tree, JSONPath query, errors that point at the actual character.
*Lesson:* `javascript-json-and-data-fetching`

**Array Method Playground** — `/tools/array-methods`
Pick `map`/`filter`/`reduce`/`find`/`sort`, write the callback, see every iteration's inputs
and outputs as a table. `reduce` is where students fall off; this is the fix.
*Lesson:* `javascript-arrays`

### Tier 3 — design & Photoshop (currently zero tools)

**Typography Scale Generator** — `/tools/type-scale`
Base size + ratio (major third, perfect fourth, …), live specimen, line-height and measure
guidance, font pairing, CSS output.
*Lesson:* `design/typography`

**Raster vs Vector Demo** — `/tools/raster-vs-vector`
The same logo as PNG and as SVG, one zoom slider, watch one turn to mush. ~40 lines of real
work for three lessons' worth of payoff.
*Lessons:* `design/pixel`, `design/raster-graphics`, `design/vector-graphics`

**Interactive Photoshop Shortcut Cheat Sheet** — `/tools/photoshop-shortcuts`
Searchable, filterable by task, Win/Mac toggle, printable. The static lesson already exists;
making it searchable is a pure upgrade.
*Lesson:* `design/photoshop-shortcut-keys`

**Image Resize / Compression Demo** — `/tools/image-compress`
Drag an image in, adjust quality and dimensions, see file size and a zoomed quality
comparison live. All client-side via canvas.
⚠️ **Perf budget risk** — canvas work plus any encoder library pushes against the <100 KB gz
limit. Must lazy-load this route's bundle.
*Lessons:* `photoshop-resizing`, `design/image`

### Tier 4 — small utilities, cheap wins

- **Border-radius generator** — including the 8-value blobby syntax (`css-border`)
- **Cubic-bezier easing editor** — draggable curve + live animation preview
- **Base64 encoder / decoder**
- **URL encoder / decoder**
- **Meta tag & Open Graph previewer** — renders the actual Google / Facebook / X card
- **HTML table generator** (`css-table`, HTML lessons)
- **Favicon generator**
- **Colour format converter** — nearly free, `lib/color.ts` already does the conversions

### The distinctive one

**Bengali Lorem Ipsum Generator** — `/tools/bengali-lorem`
Nobody has this. Designers mocking up Bengali layouts currently paste English lorem and
discover at the last minute that Bengali conjuncts and matras wreck their line-heights.
Words / sentences / paragraphs, optional Latin mix, copy button. Small, useful, unique, and
it turns the bilingual identity into a feature rather than an obligation.

---

## Nav & discovery

Tools live under Resources in the header nav as sub-menu items (two-level nesting, D-43).
Adding one is an admin-panel action, not a migration: **Admin → Menu → add child of
Resources**. No `nav_items` SQL needed.

⚠️ **Build a `/tools` index page once there are more than four.** Right now they're only
reachable through the nav dropdown, which doesn't scale and gives search engines nothing to
land on. The index should be a card grid with each tool's name, one-line description, and
the lesson it pairs with — and it belongs in `sitemap.ts` too.

---

## Adding a tool — checklist

- [ ] `components/tools/<name>.tsx` — reuse `tool-controls.tsx`, don't re-implement sliders
- [ ] `lib/<name>-i18n.ts` — full EN + BN
- [ ] `app/tools/<slug>/page.tsx` + `app/bn/tools/<slug>/page.tsx`, both with
      `buildAlternates()` metadata
- [ ] 301 in `next.config.ts` if an old URL exists
- [ ] Both routes added to `app/sitemap.ts`
- [ ] Teaching panel + link to the paired lesson
- [ ] `tsc --noEmit`, then `rm -rf .next && npm run build` — confirm both routes are `○`
- [ ] Grep `.next/static/` for secret env-var names
- [ ] **Live browser pass, both locales and both themes** — every real bug in D-43 and D-44
      was found this way and none of them by reading the code
- [ ] Decision entry in `docs/DECISIONS.md`, session entry in `docs/PROGRESS.md`
- [ ] Add to *Built* above, remove from the roadmap
- [ ] Add to the nav via Admin → Menu
