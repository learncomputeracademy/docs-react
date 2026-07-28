import { uid } from '@/lib/utils'

// Flexbox model + CSS/Tailwind/React generation for the flexbox playground.
// Pure functions, no DOM — same separation as lib/box-shadow.ts and
// lib/gradient.ts.

export type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse'
export type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse'
export type Justify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
export type AlignItems = 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline'
export type AlignContent = 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
export type AlignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
export type BasisMode = 'auto' | 'px'

export type FlexItem = {
  id: string
  grow: number
  shrink: number
  basisMode: BasisMode
  basisPx: number
  order: number
  alignSelf: AlignSelf
}

export type Container = {
  direction: Direction
  wrap: Wrap
  justify: Justify
  alignItems: AlignItems
  alignContent: AlignContent
  gap: number
}

// Cycled by array index, not stored per-item — purely decorative, and
// staying index-based means colours never need migrating when items are
// added or removed.
export const ITEM_COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#fb923c', '#22d3ee', '#f87171']

// id override exists for defaultState()'s initial items — see the same
// note on lib/box-shadow.ts's makeLayer().
export function makeItem(partial: Partial<Omit<FlexItem, 'id'>> = {}, id?: string): FlexItem {
  return { id: id ?? uid(), grow: 0, shrink: 1, basisMode: 'auto', basisPx: 100, order: 0, alignSelf: 'auto', ...partial }
}

// ── CSS generation ──────────────────────────────────────────────────────
// Only emits declarations that differ from the flex default — matches how
// a person would actually write it, and makes the diff between items
// visible instead of repeating every property on every item.

export function containerStyle(c: Container): React.CSSProperties {
  return {
    display: 'flex',
    flexDirection: c.direction,
    flexWrap: c.wrap,
    justifyContent: c.justify,
    alignItems: c.alignItems,
    alignContent: c.alignContent,
    gap: c.gap,
  }
}

export function itemStyle(it: FlexItem): React.CSSProperties {
  return {
    flexGrow: it.grow,
    flexShrink: it.shrink,
    flexBasis: it.basisMode === 'auto' ? 'auto' : `${it.basisPx}px`,
    order: it.order,
    alignSelf: it.alignSelf,
  }
}

function containerCssLines(c: Container): string[] {
  const lines = ['display: flex;']
  if (c.direction !== 'row') lines.push(`flex-direction: ${c.direction};`)
  if (c.wrap !== 'nowrap') lines.push(`flex-wrap: ${c.wrap};`)
  if (c.justify !== 'flex-start') lines.push(`justify-content: ${c.justify};`)
  if (c.alignItems !== 'stretch') lines.push(`align-items: ${c.alignItems};`)
  if (c.wrap !== 'nowrap' && c.alignContent !== 'stretch') lines.push(`align-content: ${c.alignContent};`)
  if (c.gap > 0) lines.push(`gap: ${c.gap}px;`)
  return lines
}

function itemCssDecls(it: FlexItem): string[] {
  const decls: string[] = []
  if (it.grow !== 0) decls.push(`flex-grow: ${it.grow};`)
  if (it.shrink !== 1) decls.push(`flex-shrink: ${it.shrink};`)
  if (it.basisMode === 'px') decls.push(`flex-basis: ${it.basisPx}px;`)
  if (it.order !== 0) decls.push(`order: ${it.order};`)
  if (it.alignSelf !== 'auto') decls.push(`align-self: ${it.alignSelf};`)
  return decls
}

export function generateCss(c: Container, items: FlexItem[]): string {
  const rules = [`.container {\n  ${containerCssLines(c).join('\n  ')}\n}`]
  items.forEach((it, i) => {
    const decls = itemCssDecls(it)
    if (decls.length) rules.push(`.item:nth-child(${i + 1}) {\n  ${decls.join('\n  ')}\n}`)
  })
  return rules.join('\n\n')
}

// ── Tailwind ─────────────────────────────────────────────────────────────
// Named utilities where Tailwind has one; arbitrary-value brackets for
// pixel-exact gap/basis, same convention as the shadow/gradient tools.

const JUSTIFY_TW: Record<Justify, string> = {
  'flex-start': 'justify-start', 'flex-end': 'justify-end', center: 'justify-center',
  'space-between': 'justify-between', 'space-around': 'justify-around', 'space-evenly': 'justify-evenly',
}
const ALIGN_ITEMS_TW: Record<AlignItems, string> = {
  stretch: 'items-stretch', 'flex-start': 'items-start', 'flex-end': 'items-end', center: 'items-center', baseline: 'items-baseline',
}
const ALIGN_CONTENT_TW: Record<AlignContent, string> = {
  stretch: 'content-stretch', 'flex-start': 'content-start', 'flex-end': 'content-end',
  center: 'content-center', 'space-between': 'content-between', 'space-around': 'content-around',
}
const DIRECTION_TW: Record<Direction, string> = {
  row: 'flex-row', 'row-reverse': 'flex-row-reverse', column: 'flex-col', 'column-reverse': 'flex-col-reverse',
}
const WRAP_TW: Record<Wrap, string> = { nowrap: 'flex-nowrap', wrap: 'flex-wrap', 'wrap-reverse': 'flex-wrap-reverse' }
const ALIGN_SELF_TW: Record<AlignSelf, string> = {
  auto: 'self-auto', 'flex-start': 'self-start', 'flex-end': 'self-end', center: 'self-center', baseline: 'self-baseline', stretch: 'self-stretch',
}

function containerTailwindClasses(c: Container): string[] {
  const classes = ['flex']
  if (c.direction !== 'row') classes.push(DIRECTION_TW[c.direction])
  if (c.wrap !== 'nowrap') classes.push(WRAP_TW[c.wrap])
  if (c.justify !== 'flex-start') classes.push(JUSTIFY_TW[c.justify])
  if (c.alignItems !== 'stretch') classes.push(ALIGN_ITEMS_TW[c.alignItems])
  if (c.wrap !== 'nowrap' && c.alignContent !== 'stretch') classes.push(ALIGN_CONTENT_TW[c.alignContent])
  if (c.gap > 0) classes.push(`gap-[${c.gap}px]`)
  return classes
}

function itemTailwindClasses(it: FlexItem): string[] {
  const classes: string[] = []
  if (it.grow !== 0) classes.push(it.grow === 1 ? 'grow' : `grow-[${it.grow}]`)
  if (it.shrink !== 1) classes.push(it.shrink === 0 ? 'shrink-0' : `shrink-[${it.shrink}]`)
  if (it.basisMode === 'px') classes.push(`basis-[${it.basisPx}px]`)
  if (it.order !== 0) classes.push(`order-[${it.order}]`)
  if (it.alignSelf !== 'auto') classes.push(ALIGN_SELF_TW[it.alignSelf])
  return classes
}

export function generateTailwind(c: Container, items: FlexItem[]): string {
  const lines = [`<div class="${containerTailwindClasses(c).join(' ')}">`]
  items.forEach((it) => {
    const classes = itemTailwindClasses(it)
    lines.push(classes.length ? `  <div class="${classes.join(' ')}"></div>` : '  <div></div>')
  })
  lines.push('</div>')
  return lines.join('\n')
}

// ── React style objects ──────────────────────────────────────────────────

function styleObjectLiteral(style: React.CSSProperties): string {
  const entries = Object.entries(style).filter(([, v]) => v !== undefined)
  return `{ ${entries.map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : v}`).join(', ')} }`
}

export function generateReact(c: Container, items: FlexItem[]): string {
  const lines = [`const containerStyle = ${styleObjectLiteral(containerStyle(c))}`, '', 'const itemStyles = [']
  items.forEach((it) => lines.push(`  ${styleObjectLiteral(itemStyle(it))},`))
  lines.push(']')
  return lines.join('\n')
}

// ── Presets ──────────────────────────────────────────────────────────────
// "Holy grail" and "sticky footer" (as originally scoped) need nested
// containers or a margin-auto push — outside what a single flat
// container + N items can honestly demonstrate. Swapped for presets that
// actually fit this tool's model, same as gradient.ts's "mesh-ish" note.

export type PresetKey = 'navbar' | 'sidebar' | 'centered' | 'equalColumns' | 'wrapReorder'

type PresetSpec = { container: Container; items: Omit<FlexItem, 'id'>[] }

const C = (p: Partial<Container> = {}): Container => ({
  direction: 'row', wrap: 'nowrap', justify: 'flex-start', alignItems: 'stretch', alignContent: 'stretch', gap: 0, ...p,
})
const I = (p: Partial<Omit<FlexItem, 'id'>> = {}): Omit<FlexItem, 'id'> => ({
  grow: 0, shrink: 1, basisMode: 'auto', basisPx: 100, order: 0, alignSelf: 'auto', ...p,
})

export const FLEX_PRESETS: Record<PresetKey, PresetSpec> = {
  navbar: {
    container: C({ justify: 'space-between', alignItems: 'center', gap: 16 }),
    items: [I({ basisMode: 'px', basisPx: 80 }), I({ grow: 1 }), I({ basisMode: 'px', basisPx: 100 })],
  },
  sidebar: {
    container: C({ alignItems: 'stretch' }),
    items: [I({ basisMode: 'px', basisPx: 200, shrink: 0 }), I({ grow: 1 })],
  },
  centered: {
    container: C({ justify: 'center', alignItems: 'center' }),
    items: [I({ basisMode: 'px', basisPx: 140 })],
  },
  equalColumns: {
    container: C({ gap: 16 }),
    items: [I({ grow: 1 }), I({ grow: 1 }), I({ grow: 1 }), I({ grow: 1 })],
  },
  wrapReorder: {
    container: C({ wrap: 'wrap', gap: 12, alignContent: 'flex-start' }),
    items: [
      I({ basisMode: 'px', basisPx: 150 }), I({ basisMode: 'px', basisPx: 150, order: -1 }),
      I({ basisMode: 'px', basisPx: 150 }), I({ basisMode: 'px', basisPx: 150 }),
      I({ basisMode: 'px', basisPx: 150 }), I({ basisMode: 'px', basisPx: 150 }),
    ],
  },
}
