import { hexToRgba, rgbaToHex, rgbToHsl, hslToRgb, type RGBA } from '@/lib/color'

// Colour & Contrast Studio's own logic: WCAG contrast math, a hue-rotation
// palette generator, and a colour-blindness simulation. Sits on top of
// lib/color.ts's shared conversions rather than duplicating them.

// ── WCAG contrast ───────────────────────────────────────────────────────
// Deliberately NOT reusing lib/color.ts's private srgbToLinear (used for
// OKLCH conversion) — that function uses the true sRGB EOTF threshold
// (0.04045). WCAG 2.x's own published formula uses 0.03928, a well-known
// discrepancy in the spec text that every contrast checker in the wild
// (axe-core, Lighthouse, browser devtools, Lea Verou's contrast checker)
// replicates literally rather than "fixing" — matching their number is the
// point, so this is its own function, not a shared one.
function wcagChannelToLinear(c255: number): number {
  const c = c255 / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function relativeLuminance(rgba: RGBA): number {
  const r = wcagChannelToLinear(rgba.r)
  const g = wcagChannelToLinear(rgba.g)
  const b = wcagChannelToLinear(rgba.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: RGBA, b: RGBA): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

export type WcagLevel = 'fail' | 'aa' | 'aaa'

// WCAG 2.x thresholds. "Large text" = 18pt+ (24px+), or 14pt+ bold (~18.66px+).
// UI/graphics uses the WCAG 2.1 non-text contrast minimum (1.4.11).
export function wcagLevelNormalText(ratio: number): WcagLevel {
  return ratio >= 7 ? 'aaa' : ratio >= 4.5 ? 'aa' : 'fail'
}
export function wcagLevelLargeText(ratio: number): WcagLevel {
  return ratio >= 4.5 ? 'aaa' : ratio >= 3 ? 'aa' : 'fail'
}
export function wcagLevelUiComponent(ratio: number): WcagLevel {
  return ratio >= 3 ? 'aa' : 'fail' // AAA defines no separate UI-component threshold
}

// ── Palette generation ──────────────────────────────────────────────────
// Rotates hue at the base colour's own saturation/lightness — the simplest
// version of "harmonious palette" that's still honest about what it's
// doing (a colour wheel, not a curated designer palette).

export type PaletteScheme = 'complementary' | 'triadic' | 'analogous' | 'splitComplementary'

export function generatePalette(baseHex: string, scheme: PaletteScheme): string[] {
  const { h, s, l } = rgbToHsl(hexToRgba(baseHex))
  const offsets: number[] = {
    complementary: [0, 180],
    triadic: [0, 120, 240],
    analogous: [-30, 0, 30],
    splitComplementary: [0, 150, 210],
  }[scheme]
  return offsets.map((offset) => rgbaToHex(hslToRgb(h + offset, s, l)))
}

// A tint/shade ramp at the base hue — separate from the harmony schemes
// above (this varies lightness, not hue), but the same "one colour in,
// several out" idea, and cheap to add on top of hslToRgb.
export function generateTintShadeRamp(baseHex: string, steps = 7): string[] {
  const { h, s } = rgbToHsl(hexToRgba(baseHex))
  const ramp: string[] = []
  for (let i = 0; i < steps; i++) {
    const l = 95 - (90 / (steps - 1)) * i // 95% down to 5%
    ramp.push(rgbaToHex(hslToRgb(h, s, l)))
  }
  return ramp
}

// ── Colour-blindness simulation ─────────────────────────────────────────
// Applied directly to gamma-corrected sRGB (0-255), not linearised first —
// the widely-circulated web-simulator approach (what most browser
// extensions and online simulators use). A rigorous simulation works in
// LMS cone-response space on linear RGB; this is a deliberately simpler
// approximation, good enough to show "these two colours become much
// harder to tell apart," not a clinical diagnostic tool.

export type ColorBlindType = 'protanopia' | 'deuteranopia' | 'tritanopia'

const CVD_MATRICES: Record<ColorBlindType, [number, number, number][]> = {
  protanopia: [
    [0.567, 0.433, 0.000],
    [0.558, 0.442, 0.000],
    [0.000, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0.000],
    [0.700, 0.300, 0.000],
    [0.000, 0.300, 0.700],
  ],
  tritanopia: [
    [0.950, 0.050, 0.000],
    [0.000, 0.433, 0.567],
    [0.000, 0.475, 0.525],
  ],
}

function clamp255(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}

export function simulateColorBlindness(rgba: RGBA, type: ColorBlindType): RGBA {
  const [row0, row1, row2] = CVD_MATRICES[type]
  const { r, g, b } = rgba
  return {
    r: clamp255(row0[0] * r + row0[1] * g + row0[2] * b),
    g: clamp255(row1[0] * r + row1[1] * g + row1[2] * b),
    b: clamp255(row2[0] * r + row2[1] * g + row2[2] * b),
    a: rgba.a,
  }
}
