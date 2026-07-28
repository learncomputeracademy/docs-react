import { hexToRgba, rgbaToHex, extractColor, formatColor, splitTopLevel, type ColorFormat } from '@/lib/color'
import { uid } from '@/lib/utils'

// Gradient math + CSS generation for the gradient generator. Same
// separation as lib/box-shadow.ts: pure functions, no DOM, so the paste
// parser and CSS generation are independently reasoned about (and tested)
// from the component that renders them.

export type GradientKind = 'linear' | 'radial' | 'conic'
export type RadialShape = 'circle' | 'ellipse'
export type RadialSize = 'closest-side' | 'closest-corner' | 'farthest-side' | 'farthest-corner'
// The CSS Color 4 `in <colorspace>` interpolation hint — real browser
// syntax (`linear-gradient(45deg in oklch, red, blue)`), not simulated.
// 'srgb' omits the hint entirely (the default; how a person would write a
// plain gradient), matching the "generate CSS the way a person would write
// it" convention from the other tools.
export type Interpolation = 'srgb' | 'oklch'

export type Stop = { id: string; color: string; alpha: number; position: number }

export type GradientSpec = {
  kind: GradientKind
  angle: number // linear: direction; conic: from-angle. Unused by radial.
  radialShape: RadialShape
  radialSize: RadialSize
  posX: number // 0-100, radial/conic center
  posY: number
  stops: Stop[]
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

// id override exists for defaultState()'s initial stops — see the same
// note on lib/box-shadow.ts's makeLayer().
export function makeStop(partial: Partial<Omit<Stop, 'id'>> = {}, id?: string): Stop {
  return { id: id ?? uid(), color: '#6366f1', alpha: 1, position: 50, ...partial }
}

function sortedStops(stops: Stop[]) {
  return [...stops].sort((a, b) => a.position - b.position)
}

function interpHint(interp: Interpolation) {
  return interp === 'oklch' ? ' in oklch' : ''
}

function stopToCss(s: Stop, colorFormat: ColorFormat): string {
  return `${formatColor(hexToRgba(s.color, s.alpha), colorFormat)} ${round1(s.position)}%`
}

export function gradientValue(spec: GradientSpec, colorFormat: ColorFormat, interpolation: Interpolation): string {
  const stopsCss = sortedStops(spec.stops).map((s) => stopToCss(s, colorFormat)).join(', ')
  const hint = interpHint(interpolation)
  if (spec.kind === 'linear') return `linear-gradient(${round1(spec.angle)}deg${hint}, ${stopsCss})`
  if (spec.kind === 'radial') return `radial-gradient(${spec.radialShape} ${spec.radialSize} at ${round1(spec.posX)}% ${round1(spec.posY)}%${hint}, ${stopsCss})`
  return `conic-gradient(from ${round1(spec.angle)}deg at ${round1(spec.posX)}% ${round1(spec.posY)}%${hint}, ${stopsCss})`
}

export function toTailwindArbitrary(cssValue: string): string {
  return cssValue.replace(/\s+/g, '_')
}

// Linear-interpolates a colour at an arbitrary position between the two
// neighbouring stops — used to give a newly-inserted stop (click on the
// gradient bar) a sensible starting colour instead of always defaulting to
// white. Plain sRGB lerp: good enough for "reasonable default", not meant
// to be colour-accurate the way the OKLCH preview comparison is.
export function colorAtPosition(stops: Stop[], position: number): { color: string; alpha: number } {
  const sorted = sortedStops(stops)
  if (sorted.length === 0) return { color: '#ffffff', alpha: 1 }
  if (position <= sorted[0].position) return { color: sorted[0].color, alpha: sorted[0].alpha }
  const last = sorted[sorted.length - 1]
  if (position >= last.position) return { color: last.color, alpha: last.alpha }
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i], b = sorted[i + 1]
    if (position >= a.position && position <= b.position) {
      const t = (position - a.position) / (b.position - a.position || 1)
      const ca = hexToRgba(a.color, a.alpha)
      const cb = hexToRgba(b.color, b.alpha)
      const lerp = (x: number, y: number) => x + (y - x) * t
      return {
        color: rgbaToHex({ r: Math.round(lerp(ca.r, cb.r)), g: Math.round(lerp(ca.g, cb.g)), b: Math.round(lerp(ca.b, cb.b)), a: 1 }),
        alpha: lerp(ca.a, cb.a),
      }
    }
  }
  return { color: '#ffffff', alpha: 1 }
}

// ── Paste-to-import ──────────────────────────────────────────────────────
// Pragmatic, not a full CSS grammar parser — same documented tradeoff as
// lib/box-shadow.ts's parser. Handles the realistic cases: an angle or
// `to <side>` (linear), `circle`/`ellipse` + a size keyword + `at X% Y%`
// (radial), `from <angle>deg at X% Y%` (conic), an optional `in oklch`
// hint, and colour stops with or without an explicit position.

function extractOuterCall(str: string): { name: string; inner: string } | null {
  const m = str.match(/^(linear-gradient|radial-gradient|conic-gradient)\s*\(/i)
  if (!m) return null
  let depth = 1
  let i = m[0].length
  for (; i < str.length; i++) {
    if (str[i] === '(') depth++
    else if (str[i] === ')') {
      depth--
      if (depth === 0) break
    }
  }
  if (depth !== 0) return null
  return { name: m[1].toLowerCase(), inner: str.slice(m[0].length, i) }
}

export function parseGradientInput(input: string): { spec: GradientSpec; interpolation: Interpolation } | null {
  const cleaned = input.replace(/^\s*background(-image)?\s*:/i, '').replace(/;\s*$/, '').trim()
  const call = extractOuterCall(cleaned)
  if (!call) return null
  const kind: GradientKind = call.name === 'linear-gradient' ? 'linear' : call.name === 'radial-gradient' ? 'radial' : 'conic'

  const segments = splitTopLevel(call.inner, ',')
  if (segments.length === 0) return null

  let interpolation: Interpolation = 'srgb'
  let angle = kind === 'conic' ? 0 : 180
  let radialShape: RadialShape = 'ellipse'
  let radialSize: RadialSize = 'farthest-corner'
  let posX = 50
  let posY = 50
  let stopSegments = segments

  const first = segments[0]
  const interpMatch = first.match(/\bin\s+(oklch|srgb|oklab|lab|lch|hsl)\b/i)
  const firstRemainder = interpMatch ? first.replace(interpMatch[0], '').trim() : first
  if (interpMatch?.[1].toLowerCase() === 'oklch') interpolation = 'oklch'

  const looksLikeSpec =
    (kind === 'linear' && /^(-?[\d.]+deg|to\s+(top|bottom|left|right))/i.test(firstRemainder)) ||
    (kind === 'radial' && /circle|ellipse|closest-|farthest-|at\s+/i.test(firstRemainder)) ||
    (kind === 'conic' && /^from\s+-?[\d.]+deg|at\s+/i.test(firstRemainder)) ||
    (Boolean(interpMatch) && firstRemainder === '')

  if (looksLikeSpec) {
    stopSegments = segments.slice(1)
    if (kind === 'linear') {
      const degMatch = firstRemainder.match(/(-?[\d.]+)deg/i)
      if (degMatch) angle = Number(degMatch[1])
      else {
        const sideMap: Record<string, number> = { top: 0, right: 90, bottom: 180, left: 270 }
        const toMatch = firstRemainder.match(/to\s+(top|bottom|left|right)/i)
        if (toMatch) angle = sideMap[toMatch[1].toLowerCase()]
      }
    } else if (kind === 'conic') {
      const degMatch = firstRemainder.match(/from\s+(-?[\d.]+)deg/i)
      if (degMatch) angle = Number(degMatch[1])
    }
    if (kind !== 'linear') {
      const shapeMatch = firstRemainder.match(/\b(circle|ellipse)\b/i)
      if (shapeMatch) radialShape = shapeMatch[1].toLowerCase() as RadialShape
      const sizeMatch = firstRemainder.match(/\b(closest-side|closest-corner|farthest-side|farthest-corner)\b/i)
      if (sizeMatch) radialSize = sizeMatch[1].toLowerCase() as RadialSize
      const posMatch = firstRemainder.match(/at\s+([\d.]+)%\s+([\d.]+)%/i)
      if (posMatch) {
        posX = Number(posMatch[1])
        posY = Number(posMatch[2])
      }
    }
  }
  if (stopSegments.length === 0) return null

  type ParsedStop = { color: string; alpha: number; position: number }
  const parsed: ParsedStop[] = stopSegments.map((seg) => {
    const { rgba, rest } = extractColor(seg)
    const posMatch = rest.match(/(-?[\d.]+)%/)
    return { color: rgbaToHex(rgba), alpha: rgba.a, position: posMatch ? Number(posMatch[1]) : -1 }
  })

  // Auto-distribute stops that had no explicit position — mirrors the CSS
  // spec's own default-position behaviour (evenly spaced, endpoints at 0/100).
  parsed.forEach((s, i) => {
    if (s.position !== -1) return
    s.position = parsed.length === 1 ? 0 : Math.round((i / (parsed.length - 1)) * 100)
  })

  const stops = parsed.map((s) => makeStop(s))
  return { spec: { kind, angle, radialShape, radialSize, posX, posY, stops }, interpolation }
}

// ── Presets ──────────────────────────────────────────────────────────────

export type PresetKey = 'sunset' | 'ocean' | 'forest' | 'candy' | 'uiSubtle' | 'glass' | 'mesh' | 'mono'

type PresetSpec = Omit<GradientSpec, 'stops'> & { stops: Omit<Stop, 'id'>[] }

const P = (kind: GradientKind, stops: Omit<Stop, 'id'>[], extra: Partial<PresetSpec> = {}): PresetSpec => ({
  kind,
  angle: 180,
  radialShape: 'circle',
  radialSize: 'farthest-corner',
  posX: 50,
  posY: 50,
  stops,
  ...extra,
})

export const GRADIENT_PRESETS: Record<PresetKey, PresetSpec> = {
  sunset: P('linear', [
    { color: '#ff7e5f', alpha: 1, position: 0 },
    { color: '#feb47b', alpha: 1, position: 55 },
    { color: '#6a3093', alpha: 1, position: 100 },
  ], { angle: 165 }),
  ocean: P('linear', [
    { color: '#2193b0', alpha: 1, position: 0 },
    { color: '#6dd5ed', alpha: 1, position: 100 },
  ], { angle: 120 }),
  forest: P('linear', [
    { color: '#134e5e', alpha: 1, position: 0 },
    { color: '#71b280', alpha: 1, position: 100 },
  ], { angle: 160 }),
  candy: P('linear', [
    { color: '#ff9a9e', alpha: 1, position: 0 },
    { color: '#fecfef', alpha: 1, position: 50 },
    { color: '#a18cd1', alpha: 1, position: 100 },
  ], { angle: 45 }),
  uiSubtle: P('linear', [
    { color: '#f8fafc', alpha: 1, position: 0 },
    { color: '#e2e8f0', alpha: 1, position: 100 },
  ], { angle: 180 }),
  glass: P('linear', [
    { color: '#ffffff', alpha: 0.35, position: 0 },
    { color: '#ffffff', alpha: 0.05, position: 100 },
  ], { angle: 135 }),
  // Not a real CSS mesh gradient (that needs multiple stacked
  // background-image layers) — one off-centre radial with saturated,
  // partly-transparent stops reads close enough at a fraction of the
  // complexity, and stays inside this tool's single-gradient model.
  mesh: P('radial', [
    { color: '#f472b6', alpha: 0.8, position: 0 },
    { color: '#818cf8', alpha: 0.6, position: 50 },
    { color: '#38bdf8', alpha: 0.35, position: 100 },
  ], { radialShape: 'circle', radialSize: 'farthest-corner', posX: 30, posY: 30 }),
  mono: P('conic', [
    { color: '#0f172a', alpha: 1, position: 0 },
    { color: '#ffffff', alpha: 1, position: 50 },
    { color: '#0f172a', alpha: 1, position: 100 },
  ], { angle: 0, posX: 50, posY: 50 }),
}
