import { uid } from '@/lib/utils'

// CSS Grid model + generation for the grid generator. Pure functions, no
// DOM — same separation as lib/flexbox.ts.

export type TrackMode = 'fr' | 'px' | 'auto' | 'minmax'

export type Track = {
  id: string
  mode: TrackMode
  fr: number         // used when mode === 'fr'
  px: number         // used when mode === 'px'
  minmaxMinPx: number // used when mode === 'minmax' — the min() side
  minmaxMaxFr: number // used when mode === 'minmax' — the max() side, always in fr:
  // minmax(150px, 1fr) is overwhelmingly the common real-world case, so the
  // min side is fixed to px and the max side fixed to fr rather than
  // offering a full unit picker on both ends of every track.
}

export function makeTrack(partial: Partial<Omit<Track, 'id'>> = {}, id?: string): Track {
  return { id: id ?? uid(), mode: 'fr', fr: 1, px: 100, minmaxMinPx: 150, minmaxMaxFr: 1, ...partial }
}

export function trackToCss(t: Track): string {
  switch (t.mode) {
    case 'fr': return `${t.fr}fr`
    case 'px': return `${t.px}px`
    case 'auto': return 'auto'
    case 'minmax': return `minmax(${t.minmaxMinPx}px, ${t.minmaxMaxFr}fr)`
  }
}

export type JustifyItems = 'stretch' | 'start' | 'end' | 'center'
export type AlignItems = 'stretch' | 'start' | 'end' | 'center'
export type ContentDistribution = 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly'
export type SelfAlign = 'auto' | 'start' | 'end' | 'center' | 'stretch'

export type Container = {
  columns: Track[]
  rows: Track[]
  columnGap: number
  rowGap: number
  justifyItems: JustifyItems
  alignItems: AlignItems
  justifyContent: ContentDistribution
  alignContent: ContentDistribution
}

export type GridItem = {
  id: string
  name: string
  colStart: number // 1-indexed grid line
  colEnd: number   // exclusive end line, colEnd > colStart
  rowStart: number
  rowEnd: number
  justifySelf: SelfAlign
  alignSelf: SelfAlign
}

export function makeItem(partial: Partial<Omit<GridItem, 'id'>> = {}, id?: string): GridItem {
  return { id: id ?? uid(), name: 'item', colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2, justifySelf: 'auto', alignSelf: 'auto', ...partial }
}

// Cycled by array index — same convention as lib/flexbox.ts's ITEM_COLORS.
export const GRID_ITEM_COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#fb923c', '#22d3ee', '#f87171']

// ── CSS generation ──────────────────────────────────────────────────────
// Only emits declarations that differ from the grid default — same "the
// way a person would actually write it" convention as the other /tools
// generators.

function containerCssLines(c: Container): string[] {
  const lines = [
    'display: grid;',
    `grid-template-columns: ${c.columns.map(trackToCss).join(' ')};`,
    `grid-template-rows: ${c.rows.map(trackToCss).join(' ')};`,
  ]
  if (c.columnGap === c.rowGap) {
    if (c.columnGap > 0) lines.push(`gap: ${c.columnGap}px;`)
  } else {
    if (c.rowGap > 0) lines.push(`row-gap: ${c.rowGap}px;`)
    if (c.columnGap > 0) lines.push(`column-gap: ${c.columnGap}px;`)
  }
  if (c.justifyItems !== 'stretch') lines.push(`justify-items: ${c.justifyItems};`)
  if (c.alignItems !== 'stretch') lines.push(`align-items: ${c.alignItems};`)
  if (c.justifyContent !== 'start') lines.push(`justify-content: ${c.justifyContent};`)
  if (c.alignContent !== 'start') lines.push(`align-content: ${c.alignContent};`)
  return lines
}

function itemCssDecls(it: GridItem): string[] {
  const decls = [`grid-column: ${it.colStart} / ${it.colEnd};`, `grid-row: ${it.rowStart} / ${it.rowEnd};`]
  if (it.justifySelf !== 'auto') decls.push(`justify-self: ${it.justifySelf};`)
  if (it.alignSelf !== 'auto') decls.push(`align-self: ${it.alignSelf};`)
  return decls
}

export function generateCss(c: Container, items: GridItem[]): string {
  const rules = [`.container {\n  ${containerCssLines(c).join('\n  ')}\n}`]
  items.forEach((it) => {
    rules.push(`.${slugify(it.name) || 'item'} {\n  ${itemCssDecls(it).join('\n  ')}\n}`)
  })
  return rules.join('\n\n')
}

// ── Tailwind ─────────────────────────────────────────────────────────────
// Arbitrary values throughout — Tailwind's named grid-cols-N/col-span-N
// scale tops out at 12 and can't express fr/px/minmax track mixes or
// explicit line placement, so arbitrary properties are the only form
// that's always correct here, same convention as the flexbox tool.

const JUSTIFY_ITEMS_TW: Record<JustifyItems, string> = { stretch: 'justify-items-stretch', start: 'justify-items-start', end: 'justify-items-end', center: 'justify-items-center' }
const ALIGN_ITEMS_TW: Record<AlignItems, string> = { stretch: 'items-stretch', start: 'items-start', end: 'items-end', center: 'items-center' }
const CONTENT_TW: Record<ContentDistribution, string> = {
  start: 'start', end: 'end', center: 'center', stretch: 'stretch',
  'space-between': 'between', 'space-around': 'around', 'space-evenly': 'evenly',
}
const SELF_TW: Record<SelfAlign, string> = { auto: 'self-auto', start: 'self-start', end: 'self-end', center: 'self-center', stretch: 'self-stretch' }

function containerTailwindClasses(c: Container): string[] {
  const classes = [`grid`, `grid-cols-[${c.columns.map(trackToCss).join('_')}]`, `grid-rows-[${c.rows.map(trackToCss).join('_')}]`]
  if (c.columnGap === c.rowGap) { if (c.columnGap > 0) classes.push(`gap-[${c.columnGap}px]`) }
  else {
    if (c.rowGap > 0) classes.push(`gap-y-[${c.rowGap}px]`)
    if (c.columnGap > 0) classes.push(`gap-x-[${c.columnGap}px]`)
  }
  if (c.justifyItems !== 'stretch') classes.push(JUSTIFY_ITEMS_TW[c.justifyItems])
  if (c.alignItems !== 'stretch') classes.push(ALIGN_ITEMS_TW[c.alignItems])
  if (c.justifyContent !== 'start') classes.push(`justify-${CONTENT_TW[c.justifyContent]}`)
  if (c.alignContent !== 'start') classes.push(`content-${CONTENT_TW[c.alignContent]}`)
  return classes
}

function itemTailwindClasses(it: GridItem): string[] {
  const classes = [`[grid-column:${it.colStart}/${it.colEnd}]`, `[grid-row:${it.rowStart}/${it.rowEnd}]`]
  if (it.justifySelf !== 'auto') classes.push(SELF_TW[it.justifySelf].replace('self-', 'justify-self-'))
  if (it.alignSelf !== 'auto') classes.push(SELF_TW[it.alignSelf])
  return classes
}

export function generateTailwind(c: Container, items: GridItem[]): string {
  const lines = [`<div class="${containerTailwindClasses(c).join(' ')}">`]
  items.forEach((it) => lines.push(`  <div class="${itemTailwindClasses(it).join(' ')}"></div>`))
  lines.push('</div>')
  return lines.join('\n')
}

// ── React style objects ──────────────────────────────────────────────────

export function containerStyle(c: Container): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: c.columns.map(trackToCss).join(' '),
    gridTemplateRows: c.rows.map(trackToCss).join(' '),
    rowGap: c.rowGap,
    columnGap: c.columnGap,
    justifyItems: c.justifyItems,
    alignItems: c.alignItems,
    justifyContent: c.justifyContent,
    alignContent: c.alignContent,
  }
}

export function itemStyle(it: GridItem): React.CSSProperties {
  return {
    gridColumn: `${it.colStart} / ${it.colEnd}`,
    gridRow: `${it.rowStart} / ${it.rowEnd}`,
    justifySelf: it.justifySelf,
    alignSelf: it.alignSelf,
  }
}

function styleObjectLiteral(style: React.CSSProperties): string {
  const entries = Object.entries(style).filter(([, v]) => v !== undefined)
  return `{ ${entries.map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : v}`).join(', ')} }`
}

export function generateReact(c: Container, items: GridItem[]): string {
  const lines = [`const containerStyle = ${styleObjectLiteral(containerStyle(c))}`, '', 'const itemStyles = [']
  items.forEach((it) => lines.push(`  ${styleObjectLiteral(itemStyle(it))}, // ${it.name}`))
  lines.push(']')
  return lines.join('\n')
}

// ── Derived grid-template-areas ─────────────────────────────────────────
// One-way only: items -> area string, never the reverse. Reverse-parsing
// arbitrary typed ASCII art back into a coherent, non-overlapping item
// layout is a real constraint-solving problem; deriving the area string
// FROM an already-valid rectangle layout is just filling a matrix. The
// pedagogical payoff — seeing what your dragged layout looks like as
// grid-template-areas — comes from the derivation, not from typing it by
// hand, so the harder direction isn't worth building.

// Cell -> item id (or null), 0-indexed by row/col. Used by the canvas to
// know which cells are empty (drag targets) vs. already covered by an item.
export function occupiedCells(c: Container, items: GridItem[]): (string | null)[][] {
  const numRows = c.rows.length
  const numCols = c.columns.length
  const matrix: (string | null)[][] = Array.from({ length: numRows }, () => Array(numCols).fill(null))
  for (const it of items) {
    const r0 = Math.max(0, it.rowStart - 1), r1 = Math.min(numRows, it.rowEnd - 1)
    const c0 = Math.max(0, it.colStart - 1), c1 = Math.min(numCols, it.colEnd - 1)
    for (let r = r0; r < r1; r++) for (let col = c0; col < c1; col++) matrix[r][col] = it.id
  }
  return matrix
}

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'area'
}

export type AreaResult = { ok: true; css: string } | { ok: false; reason: 'overlap' | 'duplicate-name' }

export function deriveGridTemplateAreas(c: Container, items: GridItem[]): AreaResult {
  const numRows = c.rows.length
  const numCols = c.columns.length
  const matrix: (string | null)[][] = Array.from({ length: numRows }, () => Array(numCols).fill(null))

  const nameByItem = new Map<string, string>()
  for (const it of items) nameByItem.set(it.id, slugify(it.name))
  const seen = new Set<string>()
  for (const slug of nameByItem.values()) {
    if (seen.has(slug)) return { ok: false, reason: 'duplicate-name' }
    seen.add(slug)
  }

  for (const it of items) {
    const slug = nameByItem.get(it.id)!
    const r0 = Math.max(0, it.rowStart - 1), r1 = Math.min(numRows, it.rowEnd - 1)
    const c0 = Math.max(0, it.colStart - 1), c1 = Math.min(numCols, it.colEnd - 1)
    for (let r = r0; r < r1; r++) {
      for (let col = c0; col < c1; col++) {
        if (matrix[r][col] !== null) return { ok: false, reason: 'overlap' }
        matrix[r][col] = slug
      }
    }
  }

  const rowStrings = matrix.map((row) => `"${row.map((cell) => cell ?? '.').join(' ')}"`)
  return { ok: true, css: `grid-template-areas:\n  ${rowStrings.join('\n  ')};` }
}

// ── Presets ──────────────────────────────────────────────────────────────

export type PresetKey = 'holyGrail' | 'twelveColumn' | 'dashboard' | 'namedAreas' | 'photoGrid'

type PresetSpec = { container: Container; items: Omit<GridItem, 'id'>[] }

const T = (p: Partial<Track> = {}): Track => ({ mode: 'fr', fr: 1, px: 100, minmaxMinPx: 150, minmaxMaxFr: 1, id: '', ...p })
const GC = (p: Partial<Container> = {}): Container => ({
  columns: [T(), T(), T()], rows: [T(), T(), T()], columnGap: 16, rowGap: 16,
  justifyItems: 'stretch', alignItems: 'stretch', justifyContent: 'start', alignContent: 'start', ...p,
})
const GI = (p: Partial<Omit<GridItem, 'id'>>): Omit<GridItem, 'id'> => ({
  name: 'item', colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 2, justifySelf: 'auto', alignSelf: 'auto', ...p,
})

export const GRID_PRESETS: Record<PresetKey, PresetSpec> = {
  holyGrail: {
    container: GC({ columns: [T({ mode: 'px', px: 180 }), T(), T({ mode: 'px', px: 180 })], rows: [T({ mode: 'auto' }), T(), T({ mode: 'auto' })] }),
    items: [
      GI({ name: 'header', colStart: 1, colEnd: 4, rowStart: 1, rowEnd: 2 }),
      GI({ name: 'sidebar', colStart: 1, colEnd: 2, rowStart: 2, rowEnd: 3 }),
      GI({ name: 'main', colStart: 2, colEnd: 3, rowStart: 2, rowEnd: 3 }),
      GI({ name: 'aside', colStart: 3, colEnd: 4, rowStart: 2, rowEnd: 3 }),
      GI({ name: 'footer', colStart: 1, colEnd: 4, rowStart: 3, rowEnd: 4 }),
    ],
  },
  twelveColumn: {
    container: GC({ columns: Array.from({ length: 12 }, () => T()), rows: [T({ mode: 'auto' })], columnGap: 24, rowGap: 0 }),
    items: [
      GI({ name: 'a', colStart: 1, colEnd: 5, rowStart: 1, rowEnd: 2 }),
      GI({ name: 'b', colStart: 5, colEnd: 9, rowStart: 1, rowEnd: 2 }),
      GI({ name: 'c', colStart: 9, colEnd: 13, rowStart: 1, rowEnd: 2 }),
    ],
  },
  dashboard: {
    container: GC({ columns: [T({ mode: 'px', px: 220 }), T(), T()], rows: [T({ mode: 'auto' }), T(), T()] }),
    items: [
      GI({ name: 'nav', colStart: 1, colEnd: 2, rowStart: 1, rowEnd: 4 }),
      GI({ name: 'stat1', colStart: 2, colEnd: 3, rowStart: 1, rowEnd: 2 }),
      GI({ name: 'stat2', colStart: 3, colEnd: 4, rowStart: 1, rowEnd: 2 }),
      GI({ name: 'chart', colStart: 2, colEnd: 4, rowStart: 2, rowEnd: 4 }),
    ],
  },
  namedAreas: {
    container: GC({ columns: [T(), T()], rows: [T({ mode: 'auto' }), T({ mode: 'auto' })] }),
    items: [
      GI({ name: 'title', colStart: 1, colEnd: 3, rowStart: 1, rowEnd: 2 }),
      GI({ name: 'left', colStart: 1, colEnd: 2, rowStart: 2, rowEnd: 3 }),
      GI({ name: 'right', colStart: 2, colEnd: 3, rowStart: 2, rowEnd: 3 }),
    ],
  },
  photoGrid: {
    container: GC({ columns: [T(), T(), T(), T()], rows: [T({ mode: 'px', px: 120 }), T({ mode: 'px', px: 120 })], columnGap: 8, rowGap: 8 }),
    items: [
      GI({ name: 'p1', colStart: 1, colEnd: 3, rowStart: 1, rowEnd: 3 }),
      GI({ name: 'p2', colStart: 3, colEnd: 4, rowStart: 1, rowEnd: 2 }),
      GI({ name: 'p3', colStart: 4, colEnd: 5, rowStart: 1, rowEnd: 2 }),
      GI({ name: 'p4', colStart: 3, colEnd: 5, rowStart: 2, rowEnd: 3 }),
    ],
  },
}
