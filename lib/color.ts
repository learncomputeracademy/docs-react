// Colour math for the box-shadow generator's format switcher (hex8 / rgba /
// hsl / oklch). Pure functions, no DOM — usable from both the client demo
// and (if a future SSR preset ever needs it) the server.

export type RGBA = { r: number; g: number; b: number; a: number }
export type ColorFormat = 'hex8' | 'rgba' | 'hsl' | 'oklch'

export function hexToRgba(hex: string, alpha = 1): RGBA {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const num = parseInt(h, 16) || 0
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: alpha }
}

export function rgbaToHex({ r, g, b }: RGBA): string {
  const h = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

function round(n: number, places: number) {
  const f = 10 ** places
  return Math.round(n * f) / f
}

function rgbToHsl({ r, g, b }: RGBA) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: l * 100 }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return { h: (h / 6) * 360, s: s * 100, l: l * 100 }
}

function srgbToLinear(c: number) {
  c /= 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

// Björn Ottosson's sRGB -> OKLab -> OKLCH matrices (https://bottosson.github.io/posts/oklab/).
function rgbToOklch({ r, g, b }: RGBA) {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b)
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

export function formatColor(rgba: RGBA, format: ColorFormat): string {
  switch (format) {
    case 'hex8': {
      const hex = rgbaToHex(rgba)
      if (rgba.a >= 1) return hex
      return `${hex}${Math.round(rgba.a * 255).toString(16).padStart(2, '0')}`
    }
    case 'rgba':
      return `rgba(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)}, ${round(rgba.a, 2)})`
    case 'hsl': {
      const { h, s, l } = rgbToHsl(rgba)
      return `hsl(${round(h, 0)} ${round(s, 0)}% ${round(l, 0)}%${rgba.a < 1 ? ` / ${round(rgba.a, 2)}` : ''})`
    }
    case 'oklch': {
      const { L, C, H } = rgbToOklch(rgba)
      return `oklch(${round(L * 100, 1)}% ${round(C, 3)} ${round(H, 1)}${rgba.a < 1 ? ` / ${round(rgba.a, 2)}` : ''})`
    }
  }
}

// A handful of named colours a pasted box-shadow might use — enough to not
// silently drop them, not a full CSS colour keyword table.
const NAMED_COLORS: Record<string, string> = {
  black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000',
  blue: '#0000ff', gray: '#808080', grey: '#808080', transparent: '#000000',
}

// Pulls a colour (hex / rgb() / rgba() / a few keywords) out of a shadow
// layer string and returns it plus what's left. Returns black/opaque if the
// layer has no colour at all (`box-shadow` allows that — it means currentColor).
export function extractColor(input: string): { rgba: RGBA; rest: string } {
  const rgbaMatch = input.match(/rgba?\(\s*([\d.]+)\s*,?\s*([\d.]+)\s*,?\s*([\d.]+)\s*(?:[,/]\s*([\d.]+))?\s*\)/i)
  if (rgbaMatch) {
    const [full, r, g, b, a] = rgbaMatch
    return { rgba: { r: Number(r), g: Number(g), b: Number(b), a: a !== undefined ? Number(a) : 1 }, rest: input.replace(full, ' ') }
  }
  const hexMatch = input.match(/#([0-9a-f]{3,8})\b/i)
  if (hexMatch) {
    const hex = hexMatch[1]
    const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : hex.length === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1
    return { rgba: hexToRgba(`#${hex.slice(0, hex.length >= 6 ? 6 : 3)}`, alpha), rest: input.replace(hexMatch[0], ' ') }
  }
  for (const name of Object.keys(NAMED_COLORS)) {
    const re = new RegExp(`\\b${name}\\b`, 'i')
    if (re.test(input)) return { rgba: hexToRgba(NAMED_COLORS[name]), rest: input.replace(re, ' ') }
  }
  return { rgba: { r: 0, g: 0, b: 0, a: 1 }, rest: input }
}
