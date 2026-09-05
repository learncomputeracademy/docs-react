// Colour scale generation for the Shade Scale Generator — a different job
// from lib/contrast.ts's generateTintShadeRamp() (a quick 7-step ramp
// feeding one panel of the Colour & Contrast Studio): this produces a
// configurable-length scale across three genuinely different algorithms
// shown side by side, for one or several colours at once — the
// design-system-starter workflow, not a single palette panel.
import { hexToRgba, rgbaToHex, type RGBA } from './color'

export const MIN_STEPS = 3
export const MAX_STEPS = 15
export const DEFAULT_STEPS = 9

const L_LIGHTEST = 0.97
const L_DARKEST = 0.14

// Evenly-spaced target lightness values from light to dark — plain,
// generic, no framework's hand-tuned per-colour curve implied. index is
// 0-based, 0 = lightest.
function targetLightness(index: number, count: number): number {
  if (count <= 1) return (L_LIGHTEST + L_DARKEST) / 2
  return L_LIGHTEST - ((L_LIGHTEST - L_DARKEST) * index) / (count - 1)
}

export type Algorithm = 'oklch' | 'hsl' | 'rgb'
export const ALGORITHMS: Algorithm[] = ['oklch', 'hsl', 'rgb']

function clamp255(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}
function srgbToLinear(c: number): number {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}
function linearToSrgb(v: number): number {
  const s = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(Math.max(0, v), 1 / 2.4) - 0.055
  return clamp255(s * 255)
}

// ── OKLCH ────────────────────────────────────────────────────────────────
// Forward direction (sRGB -> OKLCH) already lives in lib/color.ts's
// rgbToOklch, reused below rather than re-derived. This is that function's
// exact inverse — Björn Ottosson's published OKLab matrices, the same
// public formulas lib/color.ts's forward direction already cites, run
// backwards (OKLCH -> OKLab -> LMS -> linear sRGB -> sRGB).
function oklchToRgb(L: number, C: number, hueDeg: number, alpha = 1): RGBA {
  const hRad = (hueDeg * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3

  const rLin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

  // Out-of-gamut sRGB values (common at high chroma near the light/dark
  // extremes) are clipped, not gamut-mapped — a real limitation of this
  // simple approach, not silently hidden; CSS Color 4's proper gamut-mapping
  // algorithm is out of scope for a generator tool like this one.
  return { r: linearToSrgb(rLin), g: linearToSrgb(gLin), b: linearToSrgb(bLin), a: alpha }
}

function rgbToOklchLocal(rgba: RGBA): { L: number; C: number; H: number } {
  const lr = srgbToLinear(rgba.r), lg = srgbToLinear(rgba.g), lb = srgbToLinear(rgba.b)
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s)
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  const C = Math.sqrt(a * a + bb * bb)
  let H = (Math.atan2(bb, a) * 180) / Math.PI
  if (H < 0) H += 360
  return { L, C, H }
}

// ── HSL ──────────────────────────────────────────────────────────────────
function rgbToHslLocal(rgba: RGBA) {
  const r = rgba.r / 255, g = rgba.g / 255, b = rgba.b / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return { h: h * 60, s, l }
}
function hslToRgbLocal(h: number, s: number, l: number): RGBA {
  h = ((h % 360) + 360) % 360
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [c, 0, x]
  else [r, g, b] = [x, 0, c]
  return { r: clamp255((r + m) * 255), g: clamp255((g + m) * 255), b: clamp255((b + m) * 255), a: 1 }
}

// ── Naive RGB blend (what most quick colour-shade tools, incl. the
// W3Schools reference, actually do — included specifically to show why it
// looks worse: lerping in raw sRGB isn't perceptually or even
// colorimetrically uniform, and visibly desaturates/shifts hue). ──────────
function blendToward(base: RGBA, target: RGBA, frac: number): RGBA {
  return {
    r: clamp255(base.r + (target.r - base.r) * frac),
    g: clamp255(base.g + (target.g - base.g) * frac),
    b: clamp255(base.b + (target.b - base.b) * frac),
    a: 1,
  }
}

export type Scale = string[] // index 0 = lightest .. index N-1 = darkest

export function generateScale(baseHex: string, algorithm: Algorithm, count: number): Scale {
  const base = hexToRgba(baseHex)
  const scale: string[] = []

  if (algorithm === 'oklch') {
    const { C, H } = rgbToOklchLocal(base)
    for (let i = 0; i < count; i++) scale.push(rgbaToHex(oklchToRgb(targetLightness(i, count), C, H)))
  } else if (algorithm === 'hsl') {
    const { h, s } = rgbToHslLocal(base)
    for (let i = 0; i < count; i++) scale.push(rgbaToHex(hslToRgbLocal(h, s, targetLightness(i, count))))
  } else {
    const { L: baseL } = rgbToOklchLocal(base) // same lightness anchor as the other two, for a fair comparison
    const white: RGBA = { r: 255, g: 255, b: 255, a: 1 }
    const black: RGBA = { r: 0, g: 0, b: 0, a: 1 }
    for (let i = 0; i < count; i++) {
      const targetL = targetLightness(i, count)
      if (targetL >= baseL) {
        const frac = baseL >= 1 ? 0 : (targetL - baseL) / (1 - baseL)
        scale.push(rgbaToHex(blendToward(base, white, Math.min(1, Math.max(0, frac)))))
      } else {
        const frac = baseL <= 0 ? 0 : (baseL - targetL) / baseL
        scale.push(rgbaToHex(blendToward(base, black, Math.min(1, Math.max(0, frac)))))
      }
    }
  }
  return scale
}

// Which index's nominal target lightness sits closest to the base colour's
// own — marked as "your colour" in the UI rather than silently included
// unlabelled among N generated neighbours. Returns a 0-based index.
export function closestIndex(baseHex: string, count: number): number {
  const { L } = rgbToOklchLocal(hexToRgba(baseHex))
  let best = 0
  let bestDiff = Infinity
  for (let i = 0; i < count; i++) {
    const diff = Math.abs(targetLightness(i, count) - L)
    if (diff < bestDiff) { bestDiff = diff; best = i }
  }
  return best
}

// ── Export ───────────────────────────────────────────────────────────────
// Plain numbered index (1..N), no framework naming convention implied.
export type NamedScale = { name: string; scale: Scale }

export function toCssVars(colors: NamedScale[]): string {
  return colors
    .map(({ name, scale }) => `:root {\n${scale.map((hex, i) => `  --${name}-${i + 1}: ${hex};`).join('\n')}\n}`)
    .join('\n\n')
}
// Still a valid Tailwind v4 @theme block with non-standard (1..N) numbering
// — Tailwind doesn't require the 50-950 convention, it just generates
// utilities (bg-primary-1, etc.) from whatever custom property names it finds.
export function toTailwindTheme(colors: NamedScale[]): string {
  const lines = colors.flatMap(({ name, scale }) => scale.map((hex, i) => `  --color-${name}-${i + 1}: ${hex};`))
  return `@theme {\n${lines.join('\n')}\n}`
}
export function toScss(colors: NamedScale[]): string {
  return colors.map(({ name, scale }) => scale.map((hex, i) => `$${name}-${i + 1}: ${hex};`).join('\n')).join('\n\n')
}
export function toJson(colors: NamedScale[]): string {
  const obj: Record<string, Record<number, string>> = {}
  for (const { name, scale } of colors) {
    obj[name] = {}
    scale.forEach((hex, i) => { obj[name][i + 1] = hex })
  }
  return JSON.stringify(obj, null, 2)
}
