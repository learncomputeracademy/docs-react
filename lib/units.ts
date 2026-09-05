// Conversion math for the CSS Units Converter tool (docs/TOOLS.md "CSS Units
// Playground", D-?? pending). Every ratio below is a CSS-spec-fixed constant
// (1in = 96px, 1turn = 360deg, 1s = 1000ms, …) — computing them in JS is not
// "simulating browser behaviour" the way box-model or shadow rendering would
// be (house rule 4), it's applying the same fixed numbers the spec itself
// defines. The one unit that genuinely depends on real font metrics — `ch`,
// the width of the "0" glyph — is measured from the live DOM instead of
// guessed; see `measureChPx` in units-demo.tsx.

export type LengthUnit =
  | 'px' | 'em' | 'rem' | '%' | 'ch'
  | 'vw' | 'vh' | 'vmin' | 'vmax'
  | 'cqw' | 'cqh' | 'cqi' | 'cqb' | 'cqmin' | 'cqmax'
  | 'pt' | 'pc' | 'in' | 'cm' | 'mm' | 'q'

export type AngleUnit = 'deg' | 'rad' | 'grad' | 'turn'
export type TimeUnit = 's' | 'ms'
export type ResolutionUnit = 'dpi' | 'dpcm' | 'dppx'

export type Category = 'length' | 'angle' | 'time' | 'resolution'

export const LENGTH_UNITS: LengthUnit[] = [
  'px', 'em', 'rem', '%', 'ch',
  'vw', 'vh', 'vmin', 'vmax',
  'cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax',
  'pt', 'pc', 'in', 'cm', 'mm', 'q',
]
export const ANGLE_UNITS: AngleUnit[] = ['deg', 'rad', 'grad', 'turn']
export const TIME_UNITS: TimeUnit[] = ['s', 'ms']
export const RESOLUTION_UNITS: ResolutionUnit[] = ['dpi', 'dpcm', 'dppx']

// Fixed px-per-unit for the absolute length units (CSS Values spec §6.2).
const ABSOLUTE_PX: Record<'pt' | 'pc' | 'in' | 'cm' | 'mm' | 'q', number> = {
  in: 96,
  pt: 96 / 72,
  pc: 16, // 96/72 * 12
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  q: 96 / 25.4 / 4,
}

export type LengthContext = {
  rootPx: number      // html font-size → rem
  elementPx: number   // the box's own font-size → em
  parentWidthPx: number // containing block width → %
  viewportW: number   // → vw/vmin/vmax
  viewportH: number   // → vh/vmin/vmax
  containerW: number  // nearest query-container inline size → cqw/cqi/cqmin/cqmax
  containerH: number  // → cqh/cqb/cqmin/cqmax
  chPx: number        // real measured width of "0" in the current font → ch
}

export const DEFAULT_LENGTH_CONTEXT: LengthContext = {
  rootPx: 16,
  elementPx: 16,
  parentWidthPx: 800,
  viewportW: 1440,
  viewportH: 900,
  containerW: 400,
  containerH: 300,
  chPx: 8,
}

export function lengthToPx(value: number, unit: LengthUnit, ctx: LengthContext): number {
  switch (unit) {
    case 'px': return value
    case 'em': return value * ctx.elementPx
    case 'rem': return value * ctx.rootPx
    case '%': return (value / 100) * ctx.parentWidthPx
    case 'ch': return value * ctx.chPx
    case 'vw': return (value / 100) * ctx.viewportW
    case 'vh': return (value / 100) * ctx.viewportH
    case 'vmin': return (value / 100) * Math.min(ctx.viewportW, ctx.viewportH)
    case 'vmax': return (value / 100) * Math.max(ctx.viewportW, ctx.viewportH)
    case 'cqw': case 'cqi': return (value / 100) * ctx.containerW
    case 'cqh': case 'cqb': return (value / 100) * ctx.containerH
    case 'cqmin': return (value / 100) * Math.min(ctx.containerW, ctx.containerH)
    case 'cqmax': return (value / 100) * Math.max(ctx.containerW, ctx.containerH)
    default: return value * ABSOLUTE_PX[unit]
  }
}

export function pxToLength(px: number, unit: LengthUnit, ctx: LengthContext): number {
  switch (unit) {
    case 'px': return px
    case 'em': return px / ctx.elementPx
    case 'rem': return px / ctx.rootPx
    case '%': return (px / ctx.parentWidthPx) * 100
    case 'ch': return px / ctx.chPx
    case 'vw': return (px / ctx.viewportW) * 100
    case 'vh': return (px / ctx.viewportH) * 100
    case 'vmin': return (px / Math.min(ctx.viewportW, ctx.viewportH)) * 100
    case 'vmax': return (px / Math.max(ctx.viewportW, ctx.viewportH)) * 100
    case 'cqw': case 'cqi': return (px / ctx.containerW) * 100
    case 'cqh': case 'cqb': return (px / ctx.containerH) * 100
    case 'cqmin': return (px / Math.min(ctx.containerW, ctx.containerH)) * 100
    case 'cqmax': return (px / Math.max(ctx.containerW, ctx.containerH)) * 100
    default: return px / ABSOLUTE_PX[unit]
  }
}

export function convertLength(value: number, from: LengthUnit, to: LengthUnit, ctx: LengthContext): number {
  return pxToLength(lengthToPx(value, from, ctx), to, ctx)
}

// deg is the pivot unit for angles.
const DEG_PER: Record<AngleUnit, number> = { deg: 1, rad: 180 / Math.PI, grad: 0.9, turn: 360 }
export function convertAngle(value: number, from: AngleUnit, to: AngleUnit): number {
  return (value * DEG_PER[from]) / DEG_PER[to]
}

const MS_PER: Record<TimeUnit, number> = { ms: 1, s: 1000 }
export function convertTime(value: number, from: TimeUnit, to: TimeUnit): number {
  return (value * MS_PER[from]) / MS_PER[to]
}

// dppx (aka "x", the resolution unit behind image-set()) is the pivot.
const DPPX_PER: Record<ResolutionUnit, number> = { dppx: 1, dpi: 1 / 96, dpcm: 2.54 / 96 }
export function convertResolution(value: number, from: ResolutionUnit, to: ResolutionUnit): number {
  return (value * DPPX_PER[from]) / DPPX_PER[to]
}

// Trims float noise (0.1 + 0.2 territory) without truncating legitimate
// precision — same rounding shape as the clamp tool's `trim`.
export function trim(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.round(n * 100000) / 100000
}

export function formatUnitValue(n: number): string {
  const t = trim(n)
  if (Number.isInteger(t)) return String(t)
  return t.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')
}
