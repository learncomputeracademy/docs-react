// Placeholder Image Generator's own logic — pure URL builders against two
// real external services (Lorem Picsum for photos, placehold.co for solid/
// text boxes), plus the snippet formatters and responsive srcset builder.
// No image processing happens here; the browser fetches the real thing.

export type PlaceholderMode = 'photo' | 'solid'
export type PhotoSource = 'random' | 'seed' | 'id'
export type PhotoFormat = 'default' | 'webp'
export type SolidFormat = 'svg' | 'png' | 'jpg' | 'gif' | 'webp' | 'avif'
export type Retina = '' | '@2x' | '@3x'
export type SnippetFormat = 'url' | 'img' | 'css' | 'nextimage' | 'markdown'

export interface AspectPreset { label: string; ratio: number | null } // null = free
export const ASPECT_PRESETS: AspectPreset[] = [
  { label: 'Free', ratio: null },
  { label: '1:1', ratio: 1 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '3:2', ratio: 3 / 2 },
  { label: '16:9', ratio: 16 / 9 },
  { label: '21:9', ratio: 21 / 9 },
]

export interface SizePreset { label: string; w: number; h: number }
export const SIZE_PRESETS: SizePreset[] = [
  { label: 'Avatar', w: 100, h: 100 },
  { label: 'Thumbnail', w: 300, h: 200 },
  { label: 'Card', w: 400, h: 300 },
  { label: 'Hero banner', w: 1920, h: 1080 },
  { label: 'OG image', w: 1200, h: 630 },
  { label: 'Favicon', w: 32, h: 32 },
]

// placehold.co's documented font list (default Lato).
export const SOLID_FONTS = [
  'Lato', 'Lora', 'Montserrat', 'Noto Sans', 'Open Sans', 'Oswald',
  'Playfair Display', 'Poppins', 'PT Sans', 'Raleway', 'Roboto', 'Source Sans Pro',
]

export const RESPONSIVE_BREAKPOINTS = [320, 640, 768, 1024, 1280, 1920]

export interface PhotoOptions {
  width: number
  height: number
  source: PhotoSource
  seed: string
  id: number | null
  grayscale: boolean
  blur: number // 0 = off, 1-10
  format: PhotoFormat
  cacheBust?: number // appended as ?random=N to force a fresh image on "random" source
}

export function buildPhotoUrl(opts: PhotoOptions, w = opts.width, h = opts.height): string {
  const { source, seed, id, grayscale, blur, format, cacheBust } = opts
  let path: string
  if (source === 'id' && id != null) path = `/id/${id}/${w}/${h}`
  else if (source === 'seed' && seed.trim()) path = `/seed/${encodeURIComponent(seed.trim())}/${w}/${h}`
  else path = `/${w}/${h}`
  if (format === 'webp') path += '.webp'
  const params: string[] = []
  if (grayscale) params.push('grayscale')
  if (blur > 0) params.push(`blur=${blur}`)
  if (source === 'random' && cacheBust) params.push(`random=${cacheBust}`)
  return `https://picsum.photos${path}${params.length ? `?${params.join('&')}` : ''}`
}

export interface SolidOptions {
  width: number
  height: number
  bg: string // hex, no '#'
  text: string // hex, no '#'
  transparent: boolean
  customText: string
  font: string
  format: SolidFormat
  retina: Retina
}

function fontParam(font: string): string {
  return font.toLowerCase().replace(/\s+/g, '-')
}

export function buildSolidUrl(opts: SolidOptions, w = opts.width, h = opts.height): string {
  const { bg, text, transparent, customText, font, format, retina } = opts
  const bgSeg = transparent ? 'transparent' : bg.replace(/^#/, '')
  const textSeg = text.replace(/^#/, '')
  let path = `/${w}x${h}${retina}/${bgSeg}/${textSeg}`
  if (format !== 'svg') path += `.${format}`
  const params: string[] = []
  if (customText.trim()) {
    // placehold.co represents line breaks as a literal "\n" in the text param.
    const withBreaks = customText.trim().replace(/\r?\n/g, '\\n')
    params.push(`text=${encodeURIComponent(withBreaks).replace(/%20/g, '+')}`)
  }
  if (font !== 'Lato') params.push(`font=${fontParam(font)}`)
  return `https://placehold.co${path}${params.length ? `?${params.join('&')}` : ''}`
}

export function buildSnippet(format: SnippetFormat, url: string, width: number, height: number, alt: string): string {
  if (format === 'url') return url
  if (format === 'img') return `<img src="${url}" width="${width}" height="${height}" alt="${alt}" />`
  if (format === 'css') return `background-image: url('${url}');`
  if (format === 'nextimage') return `<Image src="${url}" width={${width}} height={${height}} alt="${alt}" />`
  return `![${alt}](${url})`
}

export interface ResponsiveEntry { width: number; height: number; url: string }

export function buildResponsiveSet(
  buildUrl: (w: number, h: number) => string,
  breakpoints: number[],
  aspectRatio: number
): ResponsiveEntry[] {
  return breakpoints
    .filter((w) => w > 0)
    .sort((a, b) => a - b)
    .map((w) => {
      const h = Math.max(1, Math.round(w / aspectRatio))
      return { width: w, height: h, url: buildUrl(w, h) }
    })
}

export function buildResponsiveMarkup(entries: ResponsiveEntry[], alt: string): string {
  if (!entries.length) return ''
  const largest = entries[entries.length - 1]
  const srcset = entries.map((e) => `${e.url} ${e.width}w`).join(',\n          ')
  return `<img\n  srcset="${srcset}"\n  sizes="100vw"\n  src="${largest.url}"\n  width="${largest.width}"\n  height="${largest.height}"\n  alt="${alt}"\n/>`
}

// Lorem Picsum's /v2/list photo entry shape — used by the photo browser.
export interface PicsumPhoto {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}
