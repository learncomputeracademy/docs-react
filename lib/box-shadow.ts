import { hexToRgba, rgbaToHex, extractColor, formatColor, type ColorFormat } from '@/lib/color'

// Shadow math + CSS generation for the box-shadow generator. Pure functions
// only (no DOM) so they're usable from the component and, if it's ever
// needed, from a server action — same separation as lib/box-model logic
// being inline in the component was fine for one shape, but this tool has
// three output modes (box/text/drop-shadow) and a paste-import parser, so
// it earns its own module.

export type Unit = 'px' | 'rem' | 'em'
export type ShadowKind = 'box' | 'text' | 'drop'

export type ShadowLayer = {
  id: string
  x: number
  y: number
  blur: number
  spread: number
  color: string // hex, no alpha
  alpha: number // 0-1
  inset: boolean
  visible: boolean
}

function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}
function round2(n: number) {
  return Math.round(n * 100) / 100
}
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function makeLayer(partial: Partial<Omit<ShadowLayer, 'id'>> = {}): ShadowLayer {
  return {
    id: uid(),
    x: 0,
    y: 4,
    blur: 8,
    spread: 0,
    color: '#000000',
    alpha: 0.25,
    inset: false,
    visible: true,
    ...partial,
  }
}

// ── CSS generation ──────────────────────────────────────────────────────

function unitStr(n: number, unit: Unit) {
  return `${n}${n === 0 ? '' : unit}`
}

function layerToCss(l: ShadowLayer, unit: Unit, colorFormat: ColorFormat, kind: ShadowKind): string {
  const color = formatColor(hexToRgba(l.color, l.alpha), colorFormat)
  const u = (n: number) => unitStr(n, unit)
  if (kind === 'text') return `${u(l.x)} ${u(l.y)} ${u(l.blur)} ${color}`
  if (kind === 'drop') return `drop-shadow(${u(l.x)} ${u(l.y)} ${u(l.blur)} ${color})`
  return `${l.inset ? 'inset ' : ''}${u(l.x)} ${u(l.y)} ${u(l.blur)} ${u(l.spread)} ${color}`
}

// pretty=true joins with a newline+indent for the readable CSS block;
// pretty=false gives the single-line value Tailwind/CSS-var/React need.
export function shadowValue(
  layers: ShadowLayer[],
  unit: Unit,
  colorFormat: ColorFormat,
  kind: ShadowKind,
  pretty = false
): string {
  const visible = layers.filter((l) => l.visible)
  if (visible.length === 0) return kind === 'drop' ? '' : 'none'
  const parts = visible.map((l) => layerToCss(l, unit, colorFormat, kind))
  if (kind === 'drop') return parts.join(' ')
  return parts.join(pretty ? ',\n  ' : ', ')
}

export function toTailwindArbitrary(singleLineValue: string): string {
  return singleLineValue.replace(/\s+/g, '_')
}

// ── Paste-to-import ─────────────────────────────────────────────────────
// Splits on top-level commas only (not commas inside rgba()/hsl()/etc).

function splitTopLevel(str: string, sep: string): string[] {
  const out: string[] = []
  let depth = 0
  let current = ''
  for (const ch of str) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === sep && depth === 0) {
      out.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  out.push(current)
  return out.map((s) => s.trim()).filter(Boolean)
}

function parseLayerSegment(raw: string, kind: 'box' | 'text'): ShadowLayer | null {
  let seg = raw.trim()
  const inset = /\binset\b/i.test(seg)
  seg = seg.replace(/\binset\b/i, ' ')
  const { rgba, rest } = extractColor(seg)

  const nums: number[] = []
  for (const tok of rest.trim().split(/\s+/).filter(Boolean)) {
    const m = tok.match(/^(-?[\d.]+)(px|rem|em)?$/)
    if (!m) return null
    const val = Number(m[1])
    nums.push(m[2] === 'rem' || m[2] === 'em' ? val * 16 : val)
  }
  if (nums.length < 2) return null
  const [x = 0, y = 0, blur = 0, spread = 0] = nums

  return makeLayer({
    x,
    y,
    blur,
    spread: kind === 'box' ? spread : 0,
    color: rgbaToHex(rgba),
    alpha: rgba.a,
    inset: kind === 'box' ? inset : false,
  })
}

// Accepts a bare value ("10px 10px 5px rgba(0,0,0,.25)") or a full
// declaration ("box-shadow: …;") — paste either, both work.
export function parseShadowInput(input: string, kind: 'box' | 'text' = 'box'): ShadowLayer[] | null {
  const cleaned = input.replace(/^\s*(box-shadow|text-shadow)\s*:/i, '').replace(/;\s*$/, '').trim()
  if (!cleaned) return null
  const layers = splitTopLevel(cleaned, ',').map((s) => parseLayerSegment(s, kind))
  if (layers.length === 0 || layers.some((l) => l === null)) return null
  return layers as ShadowLayer[]
}

// ── Smooth shadow (elevation -> soft realistic stack) ──────────────────
// The "shadows.brumm.af" technique: several shadows on an easing curve
// (offset/blur grow, opacity falls) reads as one soft, physically
// plausible shadow instead of a single flat blurred blob.
export function smoothShadowLayers(elevation: number, colorHex = '#000000', layerCount = 5): Omit<ShadowLayer, 'id'>[] {
  const layers: Omit<ShadowLayer, 'id'>[] = []
  for (let i = 1; i <= layerCount; i++) {
    const t = i / layerCount
    layers.push({
      x: 0,
      y: round1(Math.pow(t, 1.6) * elevation),
      blur: round1(Math.pow(t, 1.4) * elevation * 1.8),
      spread: 0,
      color: colorHex,
      alpha: round2(clamp(0.18 * (1 - t * 0.6), 0.02, 0.3) * clamp(elevation / 12, 0.4, 1.4)),
      inset: false,
      visible: true,
    })
  }
  return layers
}

// ── Light-source mode ────────────────────────────────────────────────────
// angleDeg: direction the light comes FROM (0 = top, 90 = right, clockwise —
// matches how a clock face reads, which is the mental model most people
// already have). The shadow falls on the opposite side.
export function angleDistanceToOffset(angleDeg: number, distance: number): { x: number; y: number } {
  const rad = ((angleDeg + 180) * Math.PI) / 180
  return { x: round1(Math.sin(rad) * distance), y: round1(-Math.cos(rad) * distance) }
}

// ── Presets ──────────────────────────────────────────────────────────────

export type PresetKey =
  | 'flat'
  | 'material1'
  | 'material3'
  | 'material5'
  | 'tailwindMd'
  | 'tailwindXl'
  | 'neumorphismRaised'
  | 'neumorphismPressed'
  | 'glow'
  | 'longShadow'
  | 'retroHard'
  | 'pressedButton'

const L = (p: Partial<Omit<ShadowLayer, 'id'>>): Omit<ShadowLayer, 'id'> => ({
  x: 0, y: 0, blur: 0, spread: 0, color: '#000000', alpha: 1, inset: false, visible: true, ...p,
})

export const SHADOW_PRESETS: Record<PresetKey, Omit<ShadowLayer, 'id'>[]> = {
  flat: [L({ y: 1, blur: 2, alpha: 0.18 })],
  material1: [L({ y: 1, blur: 2, alpha: 0.24 }), L({ y: 1, blur: 3, alpha: 0.12 })],
  material3: [L({ y: 3, blur: 6, alpha: 0.16 }), L({ y: 3, blur: 6, alpha: 0.23 })],
  material5: [L({ y: 19, blur: 38, alpha: 0.3 }), L({ y: 15, blur: 12, alpha: 0.22 })],
  tailwindMd: [L({ y: 4, blur: 6, spread: -1, alpha: 0.1 }), L({ y: 2, blur: 4, spread: -2, alpha: 0.1 })],
  tailwindXl: [L({ y: 20, blur: 25, spread: -5, alpha: 0.1 }), L({ y: 8, blur: 10, spread: -6, alpha: 0.1 })],
  neumorphismRaised: [
    L({ x: -9, y: -9, blur: 16, color: '#ffffff', alpha: 0.7 }),
    L({ x: 9, y: 9, blur: 16, color: '#a3b1c6', alpha: 0.6 }),
  ],
  neumorphismPressed: [
    L({ x: -9, y: -9, blur: 16, color: '#ffffff', alpha: 0.7, inset: true }),
    L({ x: 9, y: 9, blur: 16, color: '#a3b1c6', alpha: 0.6, inset: true }),
  ],
  glow: [
    L({ blur: 40, spread: 4, color: '#8b5cf6', alpha: 0.55 }),
    L({ blur: 12, color: '#8b5cf6', alpha: 0.9 }),
  ],
  // 20 stacked 1px steps, not 40+ — enough to read as a solid retro
  // long-shadow while staying scrollable/editable as a real layer list.
  longShadow: Array.from({ length: 20 }, (_, i) => L({ x: i + 1, y: i + 1, alpha: 0.06 })),
  retroHard: [L({ x: 8, y: 8, color: '#111111', alpha: 1 })],
  pressedButton: [
    L({ y: 2, blur: 4, alpha: 0.35, inset: true }),
    L({ y: -1, color: '#ffffff', alpha: 0.15, inset: true }),
  ],
}
