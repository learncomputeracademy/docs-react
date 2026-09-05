// Data model + CSS/WAAPI generation for the CSS Animation Studio.
//
// Two independent serializers read the same `Layer`/`KeyframeStop` data
// (docs/TOOLS.md house rule 4 — never let two renderings of the same thing
// drift): `layerToWaapiKeyframes`/`layerToWaapiOptions` feed the *real*
// browser Web Animations API for the interactive preview (play/pause/scrub
// all come from the browser's own `Animation` object, never hand-rolled
// interpolation), and `buildKeyframesCss`/`buildAnimationShorthand` build the
// copyable `@keyframes` text. Both walk the same `layer.keyframes` array.

export type TransformProps = { x: number; y: number; scale: number; rotate: number; skewX: number; skewY: number }
export type ShadowProps = { x: number; y: number; blur: number; spread: number; color: string }

export const DEFAULT_TRANSFORM: TransformProps = { x: 0, y: 0, scale: 1, rotate: 0, skewX: 0, skewY: 0 }
export const DEFAULT_SHADOW: ShadowProps = { x: 0, y: 0, blur: 0, spread: 0, color: '#00000000' }

export type KeyframeStop = {
  id: string
  offset: number // 0-100
  transform: TransformProps
  opacity: number // 0-1
  backgroundColor: string // hex
  color: string // hex
  boxShadow: ShadowProps
  borderRadius: number // px, 0-50
}

export type Direction = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
export type FillMode = 'none' | 'forwards' | 'backwards' | 'both'

export type Layer = {
  id: string
  name: string
  keyframes: KeyframeStop[] // always includes offset 0 and offset 100, sorted
  durationMs: number
  delayMs: number
  iterationCount: number | 'infinite'
  direction: Direction
  fillMode: FillMode
  easing: string // CSS keyword or cubic-bezier(...)
}

let uidCounter = 0
export function uid(prefix: string): string {
  uidCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${uidCounter}`
}

export function makeKeyframe(offset: number, overrides: Partial<KeyframeStop> = {}, id?: string): KeyframeStop {
  return {
    id: id ?? uid('kf'),
    offset,
    transform: { ...DEFAULT_TRANSFORM },
    opacity: 1,
    backgroundColor: '#f97316',
    color: '#ffffff',
    boxShadow: { ...DEFAULT_SHADOW },
    borderRadius: 8,
    ...overrides,
  }
}

// Fixed literal ids for the initial state (docs/TOOLS.md's `useState`
// hydration gotcha) — every OTHER call site (Add keyframe, Add layer
// buttons) is a client-only event handler, safe to call uid() there.
export function defaultLayer(id = 'layer-1'): Layer {
  return {
    id,
    name: 'Box 1',
    keyframes: [
      makeKeyframe(0, {}, `${id}-kf-0`),
      makeKeyframe(100, { transform: { ...DEFAULT_TRANSFORM, x: 200 } }, `${id}-kf-100`),
    ],
    durationMs: 1500,
    delayMs: 0,
    iterationCount: 'infinite',
    direction: 'alternate',
    fillMode: 'none',
    easing: 'cubic-bezier(0.42, 0, 0.58, 1)', // ease-in-out's exact spec equivalent
  }
}

function sortedKeyframes(layer: Layer): KeyframeStop[] {
  return [...layer.keyframes].sort((a, b) => a.offset - b.offset)
}

// Which property groups actually change across the layer's stops — the
// only groups worth emitting in either serialization. Animating a constant
// is dead weight in the output and confusing in the preview.
export type AnimatedFlags = {
  x: boolean; y: boolean; scale: boolean; rotate: boolean; skewX: boolean; skewY: boolean
  opacity: boolean; backgroundColor: boolean; color: boolean; boxShadow: boolean; borderRadius: boolean
}
export function animatedFlags(layer: Layer): AnimatedFlags {
  const kfs = sortedKeyframes(layer)
  const differs = <T,>(get: (k: KeyframeStop) => T) => {
    const first = get(kfs[0])
    return kfs.some((k) => JSON.stringify(get(k)) !== JSON.stringify(first))
  }
  return {
    x: differs((k) => k.transform.x),
    y: differs((k) => k.transform.y),
    scale: differs((k) => k.transform.scale),
    rotate: differs((k) => k.transform.rotate),
    skewX: differs((k) => k.transform.skewX),
    skewY: differs((k) => k.transform.skewY),
    opacity: differs((k) => k.opacity),
    backgroundColor: differs((k) => k.backgroundColor),
    color: differs((k) => k.color),
    boxShadow: differs((k) => k.boxShadow),
    borderRadius: differs((k) => k.borderRadius),
  }
}

function transformString(kf: KeyframeStop, flags: AnimatedFlags): string {
  const parts: string[] = []
  if (flags.x || flags.y) parts.push(`translate(${kf.transform.x}px, ${kf.transform.y}px)`)
  if (flags.rotate) parts.push(`rotate(${kf.transform.rotate}deg)`)
  if (flags.scale) parts.push(`scale(${kf.transform.scale})`)
  if (flags.skewX || flags.skewY) parts.push(`skew(${kf.transform.skewX}deg, ${kf.transform.skewY}deg)`)
  return parts.join(' ')
}

function shadowString(s: ShadowProps): string {
  return `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`
}

// Real, copyable CSS text.
export function buildKeyframesCss(layer: Layer, name: string): string {
  const flags = animatedFlags(layer)
  const hasTransform = flags.x || flags.y || flags.scale || flags.rotate || flags.skewX || flags.skewY
  const lines = sortedKeyframes(layer).map((kf) => {
    const decls: string[] = []
    if (hasTransform) decls.push(`    transform: ${transformString(kf, flags)};`)
    if (flags.opacity) decls.push(`    opacity: ${kf.opacity};`)
    if (flags.backgroundColor) decls.push(`    background-color: ${kf.backgroundColor};`)
    if (flags.color) decls.push(`    color: ${kf.color};`)
    if (flags.boxShadow) decls.push(`    box-shadow: ${shadowString(kf.boxShadow)};`)
    if (flags.borderRadius) decls.push(`    border-radius: ${kf.borderRadius}px;`)
    return `  ${kf.offset}% {\n${decls.join('\n')}\n  }`
  })
  return `@keyframes ${name} {\n${lines.join('\n')}\n}`
}

export function buildAnimationShorthand(layer: Layer, name: string): string {
  const iter = layer.iterationCount === 'infinite' ? 'infinite' : String(layer.iterationCount)
  return `animation: ${name} ${layer.durationMs}ms ${layer.easing} ${layer.delayMs}ms ${iter} ${layer.direction} ${layer.fillMode};`
}

export function buildFullCss(layers: Layer[]): string {
  return layers
    .map((layer, i) => {
      const name = `${slug(layer.name)}-${i + 1}`
      return `.${name} {\n  ${buildAnimationShorthand(layer, name)}\n}\n\n${buildKeyframesCss(layer, name)}`
    })
    .join('\n\n')
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'box'
}

// Real Web Animations API keyframes — same property names CSS uses, just
// camelCase per the WAAPI spec, fed straight to `element.animate()`. The
// browser does the actual interpolation; nothing here is hand-simulated.
export function layerToWaapiKeyframes(layer: Layer): Keyframe[] {
  const flags = animatedFlags(layer)
  const hasTransform = flags.x || flags.y || flags.scale || flags.rotate || flags.skewX || flags.skewY
  return sortedKeyframes(layer).map((kf) => {
    const frame: Keyframe = { offset: kf.offset / 100 }
    if (hasTransform) frame.transform = transformString(kf, flags) || 'none'
    if (flags.opacity) frame.opacity = kf.opacity
    if (flags.backgroundColor) frame.backgroundColor = kf.backgroundColor
    if (flags.color) frame.color = kf.color
    if (flags.boxShadow) frame.boxShadow = shadowString(kf.boxShadow)
    if (flags.borderRadius) frame.borderRadius = `${kf.borderRadius}px`
    return frame
  })
}

export function layerToWaapiOptions(layer: Layer): KeyframeAnimationOptions {
  return {
    duration: layer.durationMs,
    delay: layer.delayMs,
    iterations: layer.iterationCount === 'infinite' ? Infinity : layer.iterationCount,
    direction: layer.direction,
    fill: layer.fillMode,
    easing: layer.easing,
  }
}

// ── Cubic-bezier math ───────────────────────────────────────────────────
// cubic-bezier(x1,y1,x2,y2) is a fixed parametric curve through (0,0) and
// (1,1) — exact by spec (CSS Easing Functions §8.2). The editor's SVG path
// draws it directly via the native `C` command (no JS sampling needed); the
// *actual* easing applied to the preview element goes through the real
// `animation-timing-function` / WAAPI `easing`, not a re-derived one.

// Every preset stores its literal cubic-bezier() equivalent, not the bare
// CSS keyword (`ease-in-out` etc.) — these are exact 1:1 substitutions per
// spec, not approximations, but storing the keyword form meant the bezier
// editor couldn't parse it back into control points and silently fell back
// to a generic near-linear curve, so "Ease in-out" looked selected while
// showing the wrong shape. Caught live in the browser pass, not by reading
// the code (docs/TOOLS.md's own gotcha note proved true again).
export type EasingPreset = { key: string; value: string; labelKey: string }
export const EASING_PRESETS: EasingPreset[] = [
  { key: 'linear', value: 'cubic-bezier(0, 0, 1, 1)', labelKey: 'easingLinear' },
  { key: 'ease', value: 'cubic-bezier(0.25, 0.1, 0.25, 1)', labelKey: 'easingEase' },
  { key: 'easeIn', value: 'cubic-bezier(0.42, 0, 1, 1)', labelKey: 'easingEaseIn' },
  { key: 'easeOut', value: 'cubic-bezier(0, 0, 0.58, 1)', labelKey: 'easingEaseOut' },
  { key: 'easeInOut', value: 'cubic-bezier(0.42, 0, 0.58, 1)', labelKey: 'easingEaseInOut' },
  { key: 'back', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', labelKey: 'easingBack' },
  { key: 'anticipate', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', labelKey: 'easingAnticipate' },
  { key: 'sharp', value: 'cubic-bezier(0.4, 0, 0.2, 1)', labelKey: 'easingSharp' },
]

// Parses `cubic-bezier(a, b, c, d)` back into control points for the editor;
// falls back to a straight line (linear) for CSS keywords it can't invert.
export function parseBezier(value: string): [number, number, number, number] {
  const m = value.match(/cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/)
  if (!m) return [0.25, 0.25, 0.75, 0.75]
  return [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])]
}

// ── Preset animation library (Animate.css-style starters) ─────────────
export type PresetAnimation = { key: string; labelKey: string; build: (id: string) => KeyframeStop[] }

export const PRESET_ANIMATIONS: PresetAnimation[] = [
  { key: 'fadeIn', labelKey: 'presetFadeIn', build: (id) => [makeKeyframe(0, { opacity: 0 }, `${id}-0`), makeKeyframe(100, { opacity: 1 }, `${id}-100`)] },
  { key: 'fadeOut', labelKey: 'presetFadeOut', build: (id) => [makeKeyframe(0, { opacity: 1 }, `${id}-0`), makeKeyframe(100, { opacity: 0 }, `${id}-100`)] },
  {
    key: 'bounce', labelKey: 'presetBounce', build: (id) => [
      makeKeyframe(0, { transform: { ...DEFAULT_TRANSFORM, y: 0 } }, `${id}-0`),
      makeKeyframe(30, { transform: { ...DEFAULT_TRANSFORM, y: -40 } }, `${id}-30`),
      makeKeyframe(55, { transform: { ...DEFAULT_TRANSFORM, y: 0 } }, `${id}-55`),
      makeKeyframe(75, { transform: { ...DEFAULT_TRANSFORM, y: -15 } }, `${id}-75`),
      makeKeyframe(100, { transform: { ...DEFAULT_TRANSFORM, y: 0 } }, `${id}-100`),
    ],
  },
  { key: 'slideInLeft', labelKey: 'presetSlideInLeft', build: (id) => [makeKeyframe(0, { transform: { ...DEFAULT_TRANSFORM, x: -150 }, opacity: 0 }, `${id}-0`), makeKeyframe(100, { transform: { ...DEFAULT_TRANSFORM, x: 0 }, opacity: 1 }, `${id}-100`)] },
  { key: 'slideInRight', labelKey: 'presetSlideInRight', build: (id) => [makeKeyframe(0, { transform: { ...DEFAULT_TRANSFORM, x: 150 }, opacity: 0 }, `${id}-0`), makeKeyframe(100, { transform: { ...DEFAULT_TRANSFORM, x: 0 }, opacity: 1 }, `${id}-100`)] },
  { key: 'spin', labelKey: 'presetSpin', build: (id) => [makeKeyframe(0, { transform: { ...DEFAULT_TRANSFORM, rotate: 0 } }, `${id}-0`), makeKeyframe(100, { transform: { ...DEFAULT_TRANSFORM, rotate: 360 } }, `${id}-100`)] },
  {
    key: 'shake', labelKey: 'presetShake', build: (id) => [
      makeKeyframe(0, { transform: { ...DEFAULT_TRANSFORM, x: 0 } }, `${id}-0`),
      makeKeyframe(20, { transform: { ...DEFAULT_TRANSFORM, x: -10 } }, `${id}-20`),
      makeKeyframe(40, { transform: { ...DEFAULT_TRANSFORM, x: 10 } }, `${id}-40`),
      makeKeyframe(60, { transform: { ...DEFAULT_TRANSFORM, x: -10 } }, `${id}-60`),
      makeKeyframe(80, { transform: { ...DEFAULT_TRANSFORM, x: 10 } }, `${id}-80`),
      makeKeyframe(100, { transform: { ...DEFAULT_TRANSFORM, x: 0 } }, `${id}-100`),
    ],
  },
  { key: 'pulse', labelKey: 'presetPulse', build: (id) => [makeKeyframe(0, { transform: { ...DEFAULT_TRANSFORM, scale: 1 } }, `${id}-0`), makeKeyframe(50, { transform: { ...DEFAULT_TRANSFORM, scale: 1.1 } }, `${id}-50`), makeKeyframe(100, { transform: { ...DEFAULT_TRANSFORM, scale: 1 } }, `${id}-100`)] },
  { key: 'flip', labelKey: 'presetFlip', build: (id) => [makeKeyframe(0, { transform: { ...DEFAULT_TRANSFORM, skewY: 0, scale: 1 } }, `${id}-0`), makeKeyframe(50, { transform: { ...DEFAULT_TRANSFORM, scale: 0.7 }, opacity: 0.6 }, `${id}-50`), makeKeyframe(100, { transform: { ...DEFAULT_TRANSFORM, scale: 1 }, opacity: 1 }, `${id}-100`)] },
  { key: 'zoomIn', labelKey: 'presetZoomIn', build: (id) => [makeKeyframe(0, { transform: { ...DEFAULT_TRANSFORM, scale: 0 }, opacity: 0 }, `${id}-0`), makeKeyframe(100, { transform: { ...DEFAULT_TRANSFORM, scale: 1 }, opacity: 1 }, `${id}-100`)] },
]
