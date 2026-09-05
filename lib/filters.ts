// Data model + CSS generation for the CSS Filter Studio. Two independent
// stacks share this same model: `filter` (applies to the element itself)
// and `backdrop-filter` (applies to whatever shows through behind it) —
// different CSS property, same function set, same serializer.

export type FilterFnType =
  | 'blur' | 'brightness' | 'contrast' | 'grayscale' | 'hue-rotate'
  | 'invert' | 'opacity' | 'saturate' | 'sepia' | 'drop-shadow'

export const FILTER_TYPES: FilterFnType[] = [
  'blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', 'opacity', 'saturate', 'sepia', 'drop-shadow',
]

export type ShadowAmount = { x: number; y: number; blur: number; color: string }

export type FilterOp = {
  id: string
  type: FilterFnType
  enabled: boolean
  amount: number // unused when type === 'drop-shadow'
  shadow: ShadowAmount // unused otherwise
}

type SliderDef = { min: number; max: number; step: number; unit: string; default: number }

// Defaults are deliberately NOT the identity value (0% grayscale, 100%
// brightness, …) — clicking "Add filter" should visibly do something
// immediately, not silently add a no-op the user then has to go find and
// drag themselves.
export const FILTER_DEFS: Record<Exclude<FilterFnType, 'drop-shadow'>, SliderDef> = {
  blur: { min: 0, max: 20, step: 0.5, unit: 'px', default: 4 },
  brightness: { min: 0, max: 200, step: 1, unit: '%', default: 130 },
  contrast: { min: 0, max: 200, step: 1, unit: '%', default: 130 },
  grayscale: { min: 0, max: 100, step: 1, unit: '%', default: 60 },
  'hue-rotate': { min: 0, max: 360, step: 1, unit: 'deg', default: 90 },
  invert: { min: 0, max: 100, step: 1, unit: '%', default: 80 },
  opacity: { min: 0, max: 100, step: 1, unit: '%', default: 60 },
  saturate: { min: 0, max: 200, step: 1, unit: '%', default: 150 },
  sepia: { min: 0, max: 100, step: 1, unit: '%', default: 70 },
}

// Fixed literal ids only for default-state factories (docs/TOOLS.md's
// `useState` hydration gotcha) — "Add filter" click handlers pass no id and
// get a fresh `uid()` from lib/utils.ts instead, safe because they only ever
// run client-side.
export function makeFilterOp(type: FilterFnType, id?: string): FilterOp {
  return {
    id: id ?? type,
    type,
    enabled: true,
    amount: type === 'drop-shadow' ? 0 : FILTER_DEFS[type].default,
    shadow: { x: 4, y: 4, blur: 6, color: '#00000080' },
  }
}

function opCssValue(op: FilterOp): string {
  if (!op.enabled) return ''
  if (op.type === 'drop-shadow') {
    const sh = op.shadow
    return sh.blur === 0 && sh.x === 0 && sh.y === 0 ? '' : `drop-shadow(${sh.x}px ${sh.y}px ${sh.blur}px ${sh.color})`
  }
  const def = FILTER_DEFS[op.type]
  return `${op.type}(${op.amount}${def.unit})`
}

export function buildFilterCss(stack: FilterOp[]): string {
  const parts = stack.map(opCssValue).filter(Boolean)
  return parts.length ? parts.join(' ') : 'none'
}

// ── Photo-style presets ─────────────────────────────────────────────────
// Each a curated `filter` stack (never backdrop-filter — presets are about
// "how does the photo look", the glass-panel use case is a different,
// deliberately separate control) built with fixed ids so re-applying the
// same preset twice doesn't churn keys needlessly.
export type FilterPreset = { key: string; labelKey: string; build: () => FilterOp[] }

export const FILTER_PRESETS: FilterPreset[] = [
  { key: 'vintage', labelKey: 'presetVintage', build: () => [{ ...makeFilterOp('sepia', 'p-sepia'), amount: 45 }, { ...makeFilterOp('contrast', 'p-contrast'), amount: 90 }, { ...makeFilterOp('brightness', 'p-brightness'), amount: 105 }, { ...makeFilterOp('saturate', 'p-saturate'), amount: 80 }] },
  { key: 'noir', labelKey: 'presetNoir', build: () => [{ ...makeFilterOp('grayscale', 'p-grayscale'), amount: 100 }, { ...makeFilterOp('contrast', 'p-contrast'), amount: 140 }, { ...makeFilterOp('brightness', 'p-brightness'), amount: 95 }] },
  { key: 'cool', labelKey: 'presetCool', build: () => [{ ...makeFilterOp('hue-rotate', 'p-hue'), amount: 190 }, { ...makeFilterOp('saturate', 'p-saturate'), amount: 120 }, { ...makeFilterOp('brightness', 'p-brightness'), amount: 105 }] },
  { key: 'warm', labelKey: 'presetWarm', build: () => [{ ...makeFilterOp('hue-rotate', 'p-hue'), amount: 330 }, { ...makeFilterOp('saturate', 'p-saturate'), amount: 130 }, { ...makeFilterOp('sepia', 'p-sepia'), amount: 20 }] },
  { key: 'vivid', labelKey: 'presetVivid', build: () => [{ ...makeFilterOp('saturate', 'p-saturate'), amount: 180 }, { ...makeFilterOp('contrast', 'p-contrast'), amount: 115 }, { ...makeFilterOp('brightness', 'p-brightness'), amount: 105 }] },
  { key: 'faded', labelKey: 'presetFaded', build: () => [{ ...makeFilterOp('contrast', 'p-contrast'), amount: 80 }, { ...makeFilterOp('brightness', 'p-brightness'), amount: 115 }, { ...makeFilterOp('saturate', 'p-saturate'), amount: 70 }] },
]
