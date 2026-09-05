// Placeholder Video Generator's own logic. Four sources, none as proven as
// Lorem Picsum/placehold.co (see docs/DECISIONS.md D-9x for the reliability
// research behind that) — so the tool leans on an explicit fallback chain
// rather than pretending any one of them is bulletproof.
import { buildSolidUrl } from './placeholder'

export type LoremVideoSource = 'lorem' | 'placeholdervideo' | 'imgsrc' | 'static'
export const SOURCES: LoremVideoSource[] = ['lorem', 'placeholdervideo', 'imgsrc', 'static']
// Tried in this order when auto-fallback is on, starting from the user's chosen primary.
export const FALLBACK_ORDER: LoremVideoSource[] = ['lorem', 'placeholdervideo', 'imgsrc', 'static']

export type LoremVideoContent = 'bunny' | 'cat' | 'corgi' | 'test'
export type VideoCodec = 'h264' | 'h265' | 'vp9' | 'av1' | 'novideo'
export type Container = 'mp4' | 'webm'

export const LOREM_VIDEO_PRESETS = ['240p', '360p', '480p', '720p', '1080p', '1440p', '4k'] as const
export type LoremVideoPreset = (typeof LOREM_VIDEO_PRESETS)[number]

export interface AspectPreset { label: string; ratio: number }
export const VIDEO_ASPECT_PRESETS: AspectPreset[] = [
  { label: '16:9', ratio: 16 / 9 },
  { label: '9:16', ratio: 9 / 16 }, // vertical — Reels/Shorts/Stories
  { label: '1:1', ratio: 1 },
  { label: '4:3', ratio: 4 / 3 },
]

export interface VideoOptions {
  width: number
  height: number
  usePreset: boolean // lorem.video only — a named preset instead of WxH
  preset: LoremVideoPreset
  duration: number // seconds
  content: LoremVideoContent
  videoCodec: VideoCodec
  container: Container
  // imgsrc.pub only
  fps: number
  bg: string // hex, no '#'
  text: string // hex, no '#'
  overlayText: string
}

export function buildLoremVideoUrl(o: VideoOptions): string {
  const res = o.usePreset ? o.preset : `${o.width}x${o.height}`
  const parts = [o.content, res, o.videoCodec, `${o.duration}s`]
  return `https://lorem.video/${parts.join('_')}.${o.container}`
}

export function buildPlaceholderVideoDevUrl(o: VideoOptions): string {
  // Fixed 10s/30fps/mp4 — the service doesn't take any other params (yet).
  return `https://placeholdervideo.dev/${o.width}x${o.height}`
}

export function buildImgsrcVideoUrl(o: VideoOptions): string {
  const params = new URLSearchParams()
  if (o.duration !== 5) params.set('duration', String(o.duration))
  if (o.fps !== 15) params.set('fps', String(o.fps))
  if (o.bg) params.set('bg', o.bg.replace(/^#/, ''))
  if (o.text) params.set('color', o.text.replace(/^#/, ''))
  if (o.overlayText.trim()) params.set('text', o.overlayText.trim())
  const qs = params.toString()
  return `https://imgsrc.pub/video/${o.width}x${o.height}${qs ? `?${qs}` : ''}`
}

// Exactly one entry — the only source verified end-to-end (200, real
// video/mp4, correct size) while researching this tool. Structured as an
// array so a second verified mirror is a one-line addition, not a rewrite;
// not padded with unverified guesses just to look like a bigger library.
export interface StaticVideo { id: string; label: string; url: string; width: number; height: number }
export const STATIC_VIDEOS: StaticVideo[] = [
  {
    id: 'bigbuckbunny',
    label: 'Big Buck Bunny (Blender Foundation, via Internet Archive)',
    url: 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4',
    width: 640,
    height: 360,
  },
]

export function urlForSource(source: LoremVideoSource, o: VideoOptions): string {
  if (source === 'lorem') return buildLoremVideoUrl(o)
  if (source === 'placeholdervideo') return buildPlaceholderVideoDevUrl(o)
  if (source === 'imgsrc') return buildImgsrcVideoUrl(o)
  return STATIC_VIDEOS[0].url
}

// A matching placehold.co poster frame at the same dimensions, reusing the
// Placeholder Image Generator's own builder rather than duplicating it.
export function buildPosterUrl(width: number, height: number): string {
  return buildSolidUrl({
    width, height, bg: '1e293b', text: '94a3b8', transparent: false,
    customText: 'Loading video…', font: 'Lato', format: 'png', retina: '',
  })
}

// Rough estimate only, clearly labelled as such in the UI — real file size
// depends on the source's actual encoder settings, which none of these
// services document precisely.
const ASSUMED_MBPS: Record<LoremVideoPreset, number> = {
  '240p': 0.5, '360p': 0.8, '480p': 1.2, '720p': 2.5, '1080p': 5, '1440p': 9, '4k': 18,
}
export function estimateSizeMb(o: VideoOptions): number {
  const mbps = o.usePreset ? ASSUMED_MBPS[o.preset] : ASSUMED_MBPS[closestPreset(o.width, o.height)]
  return Math.round(((mbps * o.duration) / 8) * 10) / 10
}
function closestPreset(w: number, h: number): LoremVideoPreset {
  const px = w * h
  if (px <= 426 * 240) return '240p'
  if (px <= 640 * 360) return '360p'
  if (px <= 854 * 480) return '480p'
  if (px <= 1280 * 720) return '720p'
  if (px <= 1920 * 1080) return '1080p'
  if (px <= 2560 * 1440) return '1440p'
  return '4k'
}

export type SnippetFormat = 'url' | 'video' | 'react' | 'markdown'
export interface PlayerAttrs { autoplay: boolean; muted: boolean; loop: boolean; controls: boolean }

export function buildVideoSnippet(format: SnippetFormat, url: string, width: number, height: number, poster: string, attrs: PlayerAttrs): string {
  if (format === 'url') return url
  const attrList = [
    attrs.controls && 'controls',
    attrs.autoplay && 'autoPlay',
    attrs.muted && 'muted',
    attrs.loop && 'loop',
  ].filter(Boolean) as string[]
  if (format === 'react') {
    const props = [`src="${url}"`, `width={${width}}`, `height={${height}}`, `poster="${poster}"`, ...attrList.map((a) => a === 'autoPlay' ? 'autoPlay' : a === 'controls' ? 'controls' : a === 'muted' ? 'muted' : 'loop')]
    return `<video ${props.join(' ')} />`
  }
  if (format === 'markdown') return `[Video](${url})`
  // plain HTML <video>
  const htmlAttrs = attrList.map((a) => a === 'autoPlay' ? 'autoplay' : a).join(' ')
  return `<video src="${url}" width="${width}" height="${height}" poster="${poster}"${htmlAttrs ? ` ${htmlAttrs}` : ''}></video>`
}
