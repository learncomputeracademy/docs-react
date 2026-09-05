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
| Colour conversion — hex/rgba/hsl/**oklch**, colour extraction from a CSS string, HSL↔RGB round-trip | `lib/color.ts` |
| WCAG contrast ratio + AA/AAA thresholds, hue-rotation palette generation, colour-blindness simulation | `lib/contrast.ts` |
| CSS selector parsing — a real tokenizer against the Selectors spec, not regex | `lib/specificity.ts` |
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
| CSS Specificity Calculator | `/tools/specificity` | *(none — new)* | D-49 · Session 26 |
| Colour & Contrast Studio | `/tools/colour` | *(none — new)* | D-49 · Session 26 |
| Grid Generator | `/tools/grid` | *(none — new)* | D-50 · Session 27 |
| CSS Clamp Generator | `/tools/clamp` | *(none — new)* | Session 2026-08-17 |
| CSS Units Converter | `/tools/units` | *(none — new)* | Session 2026-08-17 |
| SERP Snippet Previewer | `/tools/serp-preview` | *(none — new)* | Session 2026-09-04 |
| WordPress Template Hierarchy Visualizer | `/tools/wp-template-hierarchy` | *(none — new)* | Session 2026-09-04 |
| WordPress Hooks Timeline | `/tools/wp-hooks-timeline` | *(none — new)* | Session 2026-09-04 |
| WP_Query Args Builder | `/tools/wp-query-builder` | *(none — new)* | Session 2026-09-04 |
| WordPress Enqueue Snippet Generator | `/tools/wp-enqueue-generator` | *(none — new)* | Session 2026-09-04 |
| CSS Animation Studio | `/tools/animation` | *(none — new)* | Session 2026-08-17 |
| CSS Filter Studio | `/tools/filters` | *(none — new)* | Session 2026-08-17 |
| Colour Vision Deficiency Simulator | `/tools/colorblind` | *(none — new)* | Session 2026-08-17 |
| Shade Scale Generator | `/tools/shades` | *(none — new)* | Session 2026-08-17 |
| Lorem Ipsum Generator | `/tools/lorem-text` | *(none — new)* | D-87 · Session 2026-08-18 |
| Placeholder Image Generator | `/tools/lorem-image` | *(none — new)* | D-89 · Session 2026-08-18 |
| Placeholder Video Generator | `/tools/lorem-video` | *(none — new)* | D-91 · Session 2026-08-18 |
| Number System Converter | `/tools/number-system` | *(none — new)* | D-93 · Session 2026-08-18 |
| Notepad | `/tools/notepad` | *(none — new)* | D-94 · Session 2026-08-18 |
| Call Stack + Event Loop Visualizer | `/tools/event-loop` | *(none — new)* | D-97 · Session 2026-08-18 |
| Recursion Visualizer | `/tools/recursion` | *(none — new)* | D-98 · Session 2026-08-18 |
| Scope & Closure Visualizer | `/tools/scope-closure` | *(none — new)* | D-100 · Session 2026-08-18 |

⚠️ **Not pushed yet.** The three rows above (Sessions 26–27) are committed locally only (see
D-49, D-50) — they don't exist on the live site until pushed. Once they are, add all three
to the header nav via Admin → Menu (O-18, O-19); every earlier tool has already had its nav
entry added by hand through the live admin backend, so this note only concerns these three.

| Tool | Live link (once pushed) |
|---|---|
| CSS Specificity Calculator | `https://lca-docs.vercel.app/tools/specificity` · `https://lca-docs.vercel.app/bn/tools/specificity` |
| Colour & Contrast Studio | `https://lca-docs.vercel.app/tools/colour` · `https://lca-docs.vercel.app/bn/tools/colour` |
| Grid Generator | `https://lca-docs.vercel.app/tools/grid` · `https://lca-docs.vercel.app/bn/tools/grid` |

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

**The site itself now uses the pattern this tool teaches.** `app/globals.css` has a
site-wide minimal scrollbar (thin, transparent track, one thumb colour that darkens on
hover, light/dark variants) applied via `*::-webkit-scrollbar` and `html`'s
`scrollbar-color` — not the tool's own generated output, but the same shape of rule, on
every scrollable element on the site rather than one opted-in class (D-49).

Closes the old Jekyll nav's last unfulfilled promise (see D-48 in `docs/DECISIONS.md`) — no
tool the old site advertised and never built remains 404ing.

**CSS Specificity Calculator** — a real tokenizer against the CSS Selectors spec, not a
regex shortcut, verified against 14 test cases before any UI was written — including the
parts most calculators get wrong: `:not()`/`:is()`/`:has()` score as their *most specific*
argument, never summed; `:where()` always contributes zero, even with an ID inside;
combinators contribute nothing. Two modes: Calculate (paste a selector or comma-list, get a
colour-coded `(a, b, c)` breakdown) and Compare (two selectors side by side, a clear winner
call-out naming which column decided it). 5 clickable examples. Links to a real lesson —
`css/specificity`.

**Colour & Contrast Studio** — a palette from one base colour via hue rotation
(complementary / triadic / analogous / split-complementary) plus a tint/shade ramp, a real
WCAG contrast checker (normal text, large text, UI components, each with its own AA/AAA
threshold — verified against the well-known `#767676`-on-white 4.54:1 boundary case), a live
text preview at the sizes that actually matter, and a colour-blindness simulation
(protanopia/deuteranopia/tritanopia) that makes the point WCAG numbers alone can miss — the
red-on-green preset passes no threshold at all *and* collapses to a muddy, indistinguishable
pair under deuteranopia, verified live. Export as CSS variables or a Tailwind `@theme` block
(this project's own Tailwind v4 convention, not the legacy JS config format). Links to a
real lesson — `css/colors`.

Both close out Tier 1 of the original roadmap. Full build notes — including the WCAG
luminance formula's deliberate 0.03928 threshold (not the "true" sRGB 0.04045 lib/color.ts
uses for OKLCH) and the colour-blind simulation's documented approximation — in D-49.

**Grid Generator** — the first of Tier 1's two roadmap tools; CSS Units Playground is the
other, still unbuilt. Track model (`fr`/`px`/`auto`/`minmax()`) for both columns and rows,
explicit 1-indexed grid-line item placement. **Real drag-to-place, not typed line numbers
first** — the canvas is one actual `display: grid`, items and empty-cell drag markers as
siblings in it, so dragging across empty cells previews and creates an item on release; a
drag that crosses an already-placed item is rejected with an explanatory note rather than
silently clipped. Existing items are click-to-select and edited with numeric line sliders,
never drag-resized — same simplification the flexbox playground already made for `order`.
**`grid-template-areas` is derived one-way from the layout**, never the reverse — reverse-
parsing arbitrary typed ASCII art into a valid placement is a real constraint-solving
problem the tool deliberately doesn't take on; duplicate names or overlapping placements
show an explanatory note instead of a broken string. Verified against known cases (holy
grail, an overlap, a duplicate name) in a standalone script before any UI existed. 5
presets: Holy grail layout (the one Flexbox's flat model couldn't do), Bootstrap-style
12-column (explicit replacement for the dropped Bootstrap grid), Dashboard, Named areas
demo, Photo grid (documents `repeat(auto-fill, …)` dynamic track counts are out of scope).
Three output formats — CSS, Tailwind, React style. Links to a real lesson —
`css/display-visibility`. Full build notes, including an honest note on what the live
browser pass could and couldn't verify for the drag interaction, in D-50.

**CSS Clamp Generator** — not on the roadmap list above; added on request (2026-08-17). Fluid
`clamp()` values for either `font-size` or a generic spacing property, from a min/max
viewport-width pair and a min/max value pair — the standard Utopia-style fluid formula (a
`rem`-based line through both endpoints, expressed as `rem + vw`), verified against known
values by hand before shipping. **The live preview is a real `<iframe>`, not a scaled
container** — `vw` units only mean "percent of viewport width" relative to whatever document
they're evaluated in, so simulating a narrower viewport genuinely requires a separate
document at that width, not a `transform: scale()` trick that would silently misrepresent the
math. The iframe's own `getComputedStyle` reads back the true rendered pixel value at the
chosen width and reports it next to the preview — house rule 4's "measure, don't
re-simulate" applied across a document boundary. A `MutationObserver` on `<html>`'s `class`
threads the site's dark-mode toggle into the iframe's srcDoc, since being a separate document
means it doesn't inherit the page's theme through CSS the way every other tool's real-DOM
preview does. Width shortcuts for Mobile/Tablet/Desktop (375/768/1440), 5 presets (body text,
hero heading, section heading, small caption, section spacing). Four output formats — raw
value, full CSS declaration, CSS custom property, Tailwind arbitrary value (`text-[clamp(…)]`
/ `p-[clamp(…)]`, correctly underscore-escaped). Links to a real lesson — `css/units`.

**CSS Animation Studio** — the biggest tool on the site to date; scoped via `AskUserQuestion`
before building rather than assumed, given "much much more features than W3Schools' tool"
covers a lot of ground. Multiple independently-animated layers (add/duplicate/delete), a real
drag-to-position `@keyframes` timeline (click "+" to add a stop at the widest gap, drag any
non-endpoint stop to any offset, the fixed 0%/100% ends can't move or delete), per-stop
transform (translate/scale/rotate/skew), opacity, background/text colour, box-shadow, and
border-radius. **Playback is the real Web Animations API, never hand-simulated** — every
layer's keyframes feed `element.animate()` directly, and play/pause/scrub are imperative
calls on the returned `Animation` object, so scrubbing seeks a genuine animation frame. A
**visual cubic-bezier editor** — drag the two control points on a real curve (exact by the
CSS Easing Functions spec, same "compute the fixed constant" reasoning as the Units tool),
with a small dot animated via the same WAAPI call on a loop so "does it actually feel like
that" has a real answer, not just a static picture. 8 presets (`ease` through `back`/
`anticipate`/`sharp`, each stored as its literal `cubic-bezier()` — see the D-80 bug note
below) and a 10-animation preset library (fade/bounce/slide/spin/shake/pulse/flip/zoom).
Output is the real generated `@keyframes` + `animation` CSS for every layer at once — only
property groups that actually change across a layer's stops appear in it, verified against a
constant-value case rather than assumed. **One real bug caught in the live browser pass**: an
easing preset stored as the bare keyword `ease-in-out` couldn't be parsed back into curve
control points, so the editor showed a generic near-linear curve while the button read
"selected" — fixed by storing every preset's literal `cubic-bezier()` equivalent instead (an
exact 1:1 spec substitution, not an approximation). No matching lesson exists — CTA points at
the CSS category listing, same fallback Flexbox uses (D-46).

**CSS Filter Studio** — scoped via `AskUserQuestion` before building, same as Animation Studio
just above. Two independently reorderable stacks — `filter` (the element itself) and a
separate `backdrop-filter` (whatever shows through behind it, the glassmorphism case) — the
standard 8 functions plus `drop-shadow()`, drag-to-reorder via `@dnd-kit` (the exact pattern
already shipped in the Box Shadow Generator, reused rather than reinvented, since order
genuinely changes the result: filter functions compose left-to-right on the *previous*
function's output). The backdrop-filter demo is a real glass panel overlaid on the same
preview, not an isolated second stage. Sample image is a self-contained inline SVG data URI —
no Cloudinary asset, no network request; upload-your-own goes through `FileReader` straight to
a data URL, nothing leaves the browser. Before/after comparison (draggable split line), a
text/UI-card preview mode alongside the image mode, and a 6-preset photo-style library
(vintage/noir/cool/warm/vivid/faded). **Two real bugs caught live**: a `dnd-kit` `DndContext`
hydration mismatch — the first page on the site with two `DndContext`s, whose auto-generated
accessibility id isn't guaranteed stable between server and client render without an explicit
`id` prop (dnd-kit's own documented fix, applied); and a duplicate-id/duplicate-effect bug in
the tool's own "Vintage" preset data (two `sepia()` ops sharing one id, leftover from
hand-editing), caught by reading the actually-applied stack rather than trusting the source.
No matching lesson exists — same CSS-category-listing fallback as Flexbox and Animation Studio.

**Colour Vision Deficiency Simulator** — user explicitly asked to "discuss" before building,
so scoped it as a discussion first: flagged that Colour & Contrast Studio already does a basic
CVD simulation (swatches only, no severity, no images — a different use case, not a duplicate)
and that its underlying math is a labelled approximation, proposed a more accurate approach,
then locked scope via `AskUserQuestion`. Uses the same published protanopia/deuteranopia/
tritanopia matrix coefficients already in `lib/contrast.ts` (the two tools never disagree about
what "protanopia" looks like) but applies them in gamma-decoded linear light rather than raw
sRGB — a known accuracy gap in naive colour-blind simulators. Achromatopsia uses the CSS spec's
own exact grayscale() luma weights. A severity slider makes the anomalous ("weak") forms — the
actually-common case — a real spectrum instead of the binary "blind" forms most simulators only
show. **Three modes, each a genuinely different implementation, not one faking the others**:
Image (real per-pixel canvas simulation of an upload or the bundled sample, 5-condition grid at
once), Palette checker (paste hex colours, pairwise confusability against a labelled heuristic
threshold), Live UI sample (a real DOM dashboard with the *same* SVG filter the copy button
exports applied live via CSS — proving the copied filter is the filter shown). The exported SVG
filter is deliberately less accurate than the canvas simulation — direct on sRGB, no gamma —
because that's genuinely what a real `filter: url(#id)` does in a browser. Caught one real
content issue while verifying, not a code bug: the default palette-checker seed colours
(bright red/green) turned out to survive deuteranopia simulation intact, verified by computing
the actual distance by hand rather than trusting a screenshot — swapped to a muted terracotta/
sage pair that genuinely collapses, so the tool demonstrates finding something on first load.
No matching lesson exists — same fallback as Flexbox/Animation/Filter Studio.

**Shade Scale Generator** — same discuss-first pattern as the CVD Simulator just above: flagged
that Colour & Contrast Studio already has a tint/shade ramp, proposed what would justify a
separate tool (Tailwind-numbered scales, OKLCH vs. HSL vs. naive-RGB comparison, multi-colour,
WCAG badges), locked scope via `AskUserQuestion`. **Mid-build, user reversed one decision** —
"I don't want it to be Tailwind specific" — asked one clarifying round (confirmed only the
step-naming convention was the objection, not the separate "Tailwind @theme" export format
option) before reworking `lib/shades.ts` from a fixed 11-entry `50/…/950`-keyed scale to a
configurable step count (3–15, default 9, plain 1-based indices, even-lightness spacing) — a
real type change, `Record<Step,string>` → `string[]`, propagated through every consumer, not a
label swap. Needed the *inverse* of `lib/color.ts`'s existing `rgbToOklch` (that file only had
the forward sRGB→OKLCH direction); implemented the published inverse of the same Ottosson OKLab
matrices already cited there. **Three algorithms shown stacked for direct comparison**, all
targeting the same nominal lightness at each step on purpose — OKLCH sweep (recommended,
perceptually uniform), HSL sweep (what most quick tools do), naive RGB blend toward white/black
(what the W3Schools reference tool this was built from actually does, included specifically to
show why it looks worse). WCAG AA badges on every swatch (reusing `lib/contrast.ts`'s existing
`contrastRatio`), multi-colour scales with one "focused" colour showing the full comparison and
others collapsed to OKLCH-only, live button/badge preview, four export formats. No matching
lesson exists — same fallback as the tools above it.

**Lorem Ipsum Generator** — requested as a swap-in for a contrast-checker idea the user dropped
mid-scoping (`/tools/colour` already covers WCAG contrast checking, so a dedicated contrast tool
would have duplicated it — flagged before any build started). No overlap here: the roadmap's
"distinctive one," the unbuilt **Bengali Lorem Ipsum Generator**, folded straight into this tool
as its fourth mode rather than shipping as a separate one-off — see "The distinctive one" below,
now struck through. Four text engines sharing one sentence-assembly shape (`lib/lorem.ts`):
Classic (the standard pseudo-Latin word pool every lorem generator draws from) and Gibberish
(syllable-built nonsense, no real vocabulary) are word salad by design — no grammar, which is
what placeholder text is supposed to be. Realistic and Bengali instead pick from small subject/
verb/object word banks slotted into sentence templates, Bengali in its own subject-object-verb
order rather than English's subject-verb-object, so they read as plausible sentences without
ever being real content. Four output units (words/sentences/paragraphs/list items), HTML tag
wrapping (`<p>`/`<li>`/`<h1-3>`), an exact character-count target (regenerates until the target
is crossed, trims at the nearest word boundary — documented as approximate, not exact), and the
classic mode's canonical opener as a toggle. **First `/tools` demo with genuinely randomised
content** (`Math.random()`-based, not user-driven state) — found and fixed a real hydration
mismatch this caused (server and client each drew different random words on first render); fix
was generating the content in a client-only `useEffect` instead of during the shared render
pass, so both environments' first render agree on empty before the real content fills in. No
matching lesson exists — falls back to the Design category listing. Full build notes in D-87.

**Placeholder Image Generator** — the first `/tools` demo that isn't fully self-contained: it
builds URLs against two real, free external services rather than computing or storing anything
itself. Photo mode against **Lorem Picsum** (random, seeded for a reproducible pick, or a
specific photo browsed and picked by ID via a real `fetch()` of Picsum's `/v2/list` endpoint,
credited to its real photographer — the first genuine JSON fetch any `/tools` demo makes,
distinct from an `<img src>` the browser fetches to display), with grayscale and blur. Solid/
text mode against **placehold.co** (the maintained successor to the dead `placeholder.com` API
the user actually named — confirmed via `WebFetch` against both services' real docs before
writing any code, not assumed from memory), with background/text colour, custom text, 12 fonts,
six output formats, and retina `@2x`/`@3x`. Shared across both modes: aspect-ratio lock (editing
either dimension recomputes the other), six common-size presets (avatar, thumbnail, card, hero
banner, OG image, favicon), and a responsive srcset generator that scales the same photo or
colours across every breakpoint at a locked ratio. Five copy formats — raw URL, `<img>`, CSS
`background-image`, Next.js `<Image>`, Markdown. No hydration risk despite the "random photo"
source — the randomness happens server-side at picsum.photos when a plain `/w/h` URL is
requested, never in this component's own render output. No matching lesson exists — falls back
to the Design category listing. Full build notes in D-89.

**Placeholder Video Generator** — the video counterpart, built only after user due diligence:
asked directly whether it was worth building at all, given whether "these are even used." The
honest research answer: real demand, but nothing in the video-placeholder space has picsum.photos
or placehold.co's decade of proven uptime. **lorem.video** (primary — resolution presets or
custom size, duration, video/audio codec, container, four content sources), **placeholdervideo.dev**
and **imgsrc.pub** (both real, both selectable, neither battle-tested) are backed by a genuine
automatic fallback — the `<video>` element's own error event walks all three plus a fourth,
always-reliable option in order until one loads, and the tool says which one it landed on rather
than hiding the swap. That fourth option is a single verified file (Big Buck Bunny, Blender
Foundation, mirrored on the Internet Archive) — chosen after the classic Google `gtv-videos-
bucket` sample-video URLs (the thing every HTML5 video tutorial has hotlinked for a decade) were
checked and found dead (`403` on every file). Aspect presets including 9:16 (vertical/Reels/
Shorts), player attribute toggles (autoplay/muted/loop/controls) reflected in both the live
preview and the copied snippet, a rough download-size estimate, and a matching `<video poster>`
image generated by calling the Placeholder Image Generator's own `buildSolidUrl()` directly — a
second Lorem tool reusing the first's logic rather than a fifth external dependency. Four output
formats — URL, `<video>`, React, Markdown (no CSS tab: `background-video` isn't a real CSS
property, so a CSS output would be dishonest, not just unusual). No matching lesson exists —
falls back to the Design category listing. Full build notes in D-91.

**Number System Converter** — built for school-age kids specifically, so the design goal isn't
a correct answer, it's showing the *same method* a kid has to reproduce by hand: the place-
value table converting into decimal, repeated division converting out of it, chained through
decimal for any non-decimal-to-non-decimal pair (binary↔hex, etc.) — deliberately not the
faster 4-bit binary↔hex grouping shortcut some textbooks teach later, so every conversion
follows one consistent, explainable method. A real Prev/Next step-by-step walkthrough reveals
the derivation progressively rather than dumping it all at once. An interactive bit-toggle row
is its own independently-stateful mini-tool (flip a bit, watch the decimal value update live) —
a different, hands-on angle on place value from the algorithmic walkthrough above it, bridged by
an explicit one-way "use this value above" button rather than silently kept in sync. A practice
mode reuses the main converter's own current base selection and conversion logic to pose a
random question, hide the derivation until asked, and check a typed answer — turning the tool
into actual homework practice, not just a checker. Word-size selector (4/8/16-bit, zero-padded)
and a copy-steps-as-text button. No matching lesson exists — falls back to the Computer Basics
category listing (`/basics`) — **shipped first pointing at Design by the tool's default
fallback pattern, corrected same-session** after the user caught it as the wrong category for
this particular tool. Full build notes in D-93.

**Notepad** — requested against W3Schools' bare-bones version (one textarea, autosaves,
nothing else). Deliberately a plain `<textarea>`, not a real code editor — checked the codebase
first and found `docs/UI.md` only *names* CodeMirror 6 as a future plan, never actually
installed, so building "real" syntax editing would mean a genuinely new dependency against the
site's <100 KB JS budget. Scoped that tradeoff honestly via `AskUserQuestion` rather than
assuming; user picked the lighter path. Multiple named notes with independent localStorage
autosave, case/line utilities (UPPERCASE/lowercase/Title Case, trim, remove blank lines, sort,
dedupe) applied to the current selection or the whole note, find & replace, live word/char/line
counts, `.txt` import/export, copy-all. **The optional syntax-highlighted preview reuses this
site's own `lib/shiki.ts`** — the exact highlighter lesson code blocks and the homepage's
animated code demo already ship — rather than adding a code-editor library, after the user
pointed out mid-build that Shiki was already available; verified live with real Shiki
tokens/colours on an actual JS snippet. No matching lesson exists — falls back to the Computer
Basics category listing. Full build notes in D-94.

**Call Stack + Event Loop Visualizer** — grew out of a "what tools would help teachers and
students" discussion, checked against every published lesson across all 26 categories (600+
titles, pulled straight from Supabase) rather than guessed; the user's own idea — "a JavaScript
stack viewer" — turned out to be this roadmap's own hardest-flagged Tier 2 entry, matching three
real lessons at once (`JavaScript Promises and Async`, `JavaScript Events`/`Events Advanced`,
Node.js's own `The Event Loop`). Runs the user's real code (or one of 5 presets) inside a
sandboxed iframe with real `setTimeout`/`Promise` scheduling — the one house rule this tool
can't literally satisfy is "never simulate," since no JS API exposes the engine's real call
stack or task queues; the honest resolution (same one every real event-loop visualizer uses) is
to run the real code and read the real call stack via `new Error().stack`, so the *ordering* and
*timing* shown are genuinely real, not invented — only the "waiting in a queue" box durations
are illustrative, stated plainly in the tool's own UI. Colour-coded, `motion/react`-animated
panels (call stack, Web APIs, microtask queue, console), a Prev/Next/Play step player with speed
control, and a plain-English narration per step. A real bug was caught and fixed during
verification — anonymous/wrapper stack frames were leaking through as garbage text instead of
being dropped — and every preset's actual console output was hand-checked against the textbook-
correct ordering (including the classic microtask-before-macrotask case) rather than assumed
correct from the code alone. One honest, disclosed limitation: V8's internal `await` optimisation
bypasses the tool's `Promise.prototype.then` instrumentation, so the microtask-queue box doesn't
visually populate during the async/await preset even though its final ordering is still correct.
Links to a real lesson category — `/javascript` — the first tool this session with an actual
lesson link instead of a category-listing fallback. Full build notes in D-97.

**Recursion Visualizer** — the sync half of "call stack" the Event Loop Visualizer's async focus
didn't cover, matching the `Recursion` lesson (Programming Basics) directly. Same house-rule
tension, scoped down differently on purpose: real arguments and return values (the actual
teaching point) can't be recovered from `Error().stack` the way call-stack names can, so rather
than build a JS parser to safely auto-instrument arbitrary code, this ships as three curated
presets (Sum 1..n, Factorial, Fibonacci) pre-wrapped with a small `trace()` helper — plus an
"Edit code" escape hatch for anyone following the same wrapping convention. The wrapping itself
has a real, easy-to-get-wrong gotcha, avoided here: a named function expression's own recursive
calls resolve to its own inner unwrapped name unless the recursion goes through an outer `let`
binding instead — all three presets use the `let x; x = trace('x', function (n) {...})` shape
specifically to sidestep that. Call Stack + Call Log panels (the log showing every completed
call as `name(args) → result`, the clearest single view of the unwind), auto-play the moment
"Run" completes, total-calls/max-depth stats, same step player and `motion/react` animation as
the Event Loop Visualizer. Verified live against real arithmetic, not just that something
rendered — Sum 1..n's full correct unwind, and Fibonacci's genuine exponential branching call
pattern caught mid-run. Links to a real lesson category — `/programming`. Full build notes in D-98.

**Scope & Closure Visualizer** — the closure/hoisting half `Recursion` and `Event Loop` didn't
cover, matching `JavaScript Scope Hoisting` and `JavaScript Closures` directly. A firmer scoping
call than the Recursion Visualizer's: there's no runtime API for a scope chain at all (not even
the partial escape hatch `Error().stack` gave the call-stack tools), so this one is presets
only, no free-form code — four of them (block vs function scope, hoisting var-vs-let, closures
via a counter maker, the classic loop+closure var-vs-let gotcha), each with a hand-matched
static scope structure but real values captured live from real code via a `snapshot()` helper
placed by hand at meaningful points, running in the same sandboxed-iframe trust model as the
other two visualizers. **Two real bugs found and fixed during verification**: a preset variable
permanently showed "temporal dead zone" because it was never captured in any snapshot (a
preset-authoring gap); fixing that exposed a genuine one — the variable held a *function*, and
`postMessage` can't clone a function across the iframe boundary at all, crashing the whole trace
until fixed at the source (sanitise inside the iframe, not after). A third fix followed:
`deriveState` was reading only the latest snapshot's values, making anything captured once look
"reverted" the moment a later snapshot didn't re-list it — fixed by accumulating captured values
across every snapshot seen so far. Verified precisely afterward: the real V8 error text
(`Cannot access 'b' before initialization`) for a temporal-dead-zone access, a closure's counter
persisting and incrementing across three real calls after its outer function had already
returned, and the classic `var` (all three closures share one binding, `i = 3` three times) vs
`let` (fresh binding each iteration, `j = 0, 1, 2`) loop gotcha reproduced exactly. Links to a
real lesson category — `/javascript`. Full build notes in D-100.

**CSS Units Converter** — not on the roadmap list below anymore; the last Tier 1 item,
shipped on request the same session as Clamp (2026-08-17). Four categories — Length (21
units: `px em rem % ch vw vh vmin vmax cqw cqh cqi cqb cqmin cqmax pt pc in cm mm q`), Angle
(`deg rad grad turn`), Time (`s ms`), Resolution (`dpi dpcm dppx`) — picked via a segmented
tab, each with its own remembered amount/from/to so switching tabs doesn't lose work. Every
ratio is a fixed CSS-spec constant or pure percentage math against a **configurable**
context (root font-size, the element's own font-size, parent width, viewport width/height,
container width/height) rather than one assumed 16px/1440px setup — that configurability is
the difference from a generic converter and what makes `em` vs `rem` inheritance and
`vw`/`cqw` actually click. **One real exception to the pure-math rule, per house rule 4**:
`ch` (the width of the "0" glyph) is genuinely font-dependent, so its ratio is measured once
from a real, invisible DOM element using the page's own font stack, not assumed. Live
preview — a resizing box for Length, a rotating box for Angle (Time/Resolution have no
meaningful visual analogue, table-only). A conversion table shows the input in **every** unit
in the category at once, with the source and target rows highlighted. Output as raw value,
CSS declaration (with a property picker — `width`/`height`/`font-size`/`padding`/`margin`/
`gap`/`border-radius` — for Length), or a Tailwind arbitrary-value class. 8 presets, 2 per
category. Links to a real lesson — `css/units`.

**SERP Snippet Previewer** — the first `/tools` demo for the `seo` category. Title/URL/description
inputs, live Google-result-style preview (breadcrumb, blue title, description) on desktop and
mobile. **Real browser measurement, not a character-count guess** — an invisible same-font clone
of the title/description text is actually laid out and its rendered pixel width read back via
`getBoundingClientRect()`, the same "measure, don't re-simulate" shape as the Clamp tool's iframe
measurement — commonly-cited desktop/mobile pixel-width guidelines (600px title, 600px×lines
description) compared against that real measurement, with truncation shown via real CSS
line-clamp/ellipsis on the actual preview element. Disclosed honestly as a **guideline, not a
Google rule** — Google has never published a fixed limit and dynamically rewrites/truncates based
on the query. Copy-ready `<title>`/`<meta name="description">` output. **One real layout bug
caught in the live browser pass**: the hidden measuring span, plus a `1fr` grid column whose
default `min-width: auto` let a long `<pre>` line force it past its fair share, together blew the
whole page 500px+ wider than the viewport — fixed with `min-w-0` on the grid item, the standard
CSS Grid "automatic minimum size" gotcha. Links to two lessons — `seo/title-tags` and
`seo/meta-descriptions`.

**WordPress Template Hierarchy Visualizer** — the first of four `/tools` demos for the `wordpress`
category, all necessarily code/decision generators rather than "real browser, real CSS" demos
since there's no live WordPress install to measure from (the encoded-spec-as-data justification is
the same one the Grid Generator and CSS Specificity Calculator already established). Pick a
request type (12 covered: homepage, single post, page, category/tag/taxonomy/author/date archive,
CPT single/archive, search, 404), then check/uncheck which files "exist in the theme" to see the
real first-match-wins fallback resolve live — index.php is always checked and undeletable, since
it's the one truly required template. **Chain data verified against the site's own
`wordpress/template-hierarchy` lesson first** (fetched and read its actual blocks before writing
any data) to guarantee consistency rather than risk an independently-recalled WP-internals detail
disagreeing with already-published content; the extra branches (tag/author/date/search/CPT/
taxonomy) are straightforward extensions of the exact same documented pattern the lesson's own
closing callout names as existing. Links to `wordpress/template-hierarchy`.

**WordPress Hooks Timeline** — the standard, long-stable front-end page-load action-hook firing
order (`muplugins_loaded` through `shutdown`, 15 steps), with a Prev/Next/Play step player (plain
`setInterval`, no new animation dependency) and a ready-to-copy `add_action()` snippet generated
for whichever hook is selected. A separate "common filters" list (`the_title`/`the_content`/
`excerpt_length`) is deliberately kept outside the fixed timeline — filters fire on demand when
their template tag is called, not at one fixed point in page load, so folding them into the same
strict-order list would overclaim. Complements rather than duplicates `wordpress/
wordpress-hooks-actions-and-filters`, which teaches action-vs-filter and custom hooks but not this
firing order — confirmed by reading that lesson's actual content before building. Links to it.
**Expanded on request** (D-132, "as detailed as possible") with a second section — a **Hook
Reference** browsable by 6 categories (Save & Update, User & Auth, Admin Area, Comments, Widgets &
Customizer, Content & Query Filters; ~27 more hooks), each tagged Action/Filter with a colour-coded
badge and a type-aware generated snippet (`add_action()` vs. `add_filter(... return $value; )`).
Kept as browsable categories rather than folded into the fixed timeline, for the same reason the
original filters list was separated — these fire on their own trigger, not one fixed point.

**WP_Query Args Builder** — builds a *secondary* query (`new WP_Query`), explicitly distinguished
in the tool's own UI from the main loop `wordpress/the-loop` teaches (the global `have_posts()`/
`the_post()` form) — confirmed by reading that lesson's code block first, so the tool's framing is
additive, not a contradicting second way to do the same thing. Output is the real generated PHP
with the loop wrapped around it, matching the lesson's own code style. Links to `wordpress/the-loop`.
**Expanded on request** (D-132) from ~10 args to effectively the full commonly-used `WP_Query`
surface: multi-checkbox post status, `paged`/`offset` (with an honest warning about combining
them — WP core itself says it's unreliable), `ignore_sticky_posts`, category/tag include+exclude,
a full add/remove-row **Taxonomy Query** builder (field/operator per row, AND/OR relation), a full
add/remove-row **Meta Query** builder (compare + type per row, relation), a **Date Query** (simple
year/month/day, or after/before range with inclusive toggle), `fields` (all/ids/id=>parent), and
3 performance cache-disable flags. Codegen produces correctly nested/indented PHP arrays for
`tax_query`/`meta_query`/`date_query`, not just a flat list. 8 presets (up from 5).

**WordPress Enqueue Snippet Generator** — add any number of style/script rows, get back a single
correctly-wrapped `functions.php` block. **Output matches `wordpress/enqueuing-assets`'s own code
example exactly in convention** (confirmed by reading it first) — `get_template_directory_uri()`/
`get_template_directory()` (vs. the stylesheet variants, togglable, with a hint on when each
matters for child themes), `filemtime()`-based cache-busting versioning as the default (vs. a
static string or none), dependency arrays, `in_footer`/`media` per-asset, all wrapped in
`add_action( 'wp_enqueue_scripts', ... )`. Links to `wordpress/enqueuing-assets`.

All five built from a direct user request ("build all the WordPress tool, SERP Snippet
Previewer") following an unprompted tool-ideas brainstorm earlier the same session — every
WordPress tool's underlying facts (template hierarchy chains, hook firing order, enqueue
convention) were cross-checked against this site's own already-published lessons before writing
any code, specifically to avoid an independently-recalled WordPress-internals detail silently
disagreeing with content the site already teaches.

---

## Roadmap

Ordered by value. Curriculum links are to lessons that already exist in `_docs/`.

### Tier 1 — highest value, tied to existing lessons

Grid Generator, CSS Clamp Generator and CSS Units Converter shipped — see the **Built**
section above (D-50 and the two 2026-08-17 sessions). Tier 1 is now fully built.

### Tier 2 — JavaScript (little good competition here)

**Event Propagation Visualizer** — `/tools/event-flow`
Nested boxes; click one and watch capture travel down and bubbling travel back up as an
animated trace. Toggle `capture`, fire `stopPropagation()` mid-flight and watch the rest
die. Genuinely hard to teach in prose.
*Lessons:* `javascript-events`, `javascript-advanced-events`

~~**Event Loop / Async Visualizer** — `/tools/event-loop`~~ **Built, D-97.** Call stack + Web
APIs + microtask queue, running the user's own code (or a preset) for real inside a sandboxed
iframe rather than simulating it — see the Built section above for the full write-up.

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

~~**Bengali Lorem Ipsum Generator** — `/tools/bengali-lorem`~~ **Built, D-87** — folded into
the Lorem Ipsum Generator (`/tools/lorem-text`) as its Bengali mode rather than shipping separately.
Words / sentences / paragraphs / list items, Bengali's own subject-object-verb sentence order,
copy button — the idea below is exactly what shipped, just as one mode among four instead of a
standalone tool.

<details><summary>Original pitch (2026-08-17, for the record)</summary>

Nobody has this. Designers mocking up Bengali layouts currently paste English lorem and
discover at the last minute that Bengali conjuncts and matras wreck their line-heights.
Words / sentences / paragraphs, optional Latin mix, copy button. Small, useful, unique, and
it turns the bilingual identity into a feature rather than an obligation.

</details>

---

## Nav & discovery

Tools live under Resources in the header nav as sub-menu items (two-level nesting, D-43) —
**note**: O-15 flagged that a live pass showed a top-level "Tools" dropdown instead, so
confirm the actual current structure in Admin → Menu before adding a new entry. **Adding one
is a direct `nav_items` write, not admin-panel-only** — the working pattern (D-79, D-131) is a
service-role script: find the "Tools" submenu's `parent_id` from an existing tool row, insert
a new row with `label`/`label_bn`/`url`/`sort_order`, revalidate the `nav` tag. See
`scripts/add-tools-nav-items.mjs` for the exact shape to copy.

**`/tools` index page built** (D-49) — a card grid at `/tools` and `/bn/tools`
(`components/tools-index.tsx`, data in `lib/tools-index-i18n.ts`), each card showing the
tool's name, one-line description, and linking straight to it. Both routes are in
`sitemap.ts`. **Update `lib/tools-index-i18n.ts` whenever a tool ships or its description
changes** — it's a plain hand-maintained array, not derived from `docs/TOOLS.md`'s "Built"
table, so the two can drift if only one gets updated.

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
