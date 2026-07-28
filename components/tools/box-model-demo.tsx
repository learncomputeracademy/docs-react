'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, RotateCcw, ArrowRight, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider, Section, SegmentedControl } from '@/components/tools/tool-controls'
import { cn } from '@/lib/utils'
import { bm } from '@/lib/box-model-i18n'
import type { Locale } from '@/lib/types'

// ── Model ────────────────────────────────────────────────────────────────
// The visual is driven by REAL CSS applied to real elements — the browser
// does every calculation (box-sizing, units, calc). Nothing here re-implements
// the box model in JS the way the old jQuery demo did, so what students see
// is what a browser actually does, and the measured numbers below the box
// come from getBoundingClientRect rather than arithmetic that could drift.

type Sides = { top: number; right: number; bottom: number; left: number }
type Corners = { tl: number; tr: number; br: number; bl: number }
type Layer = 'content' | 'padding' | 'border' | 'margin'
type LinkMode = 'none' | 'all' | 'tb' | 'rl'

type State = {
  boxSizing: 'content-box' | 'border-box'
  width: number
  height: number
  sizeUnit: 'px' | '%' | 'em' | 'rem'
  spacingUnit: 'px' | 'em' | 'rem'
  padding: Sides
  margin: Sides
  border: Sides
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'none'
  borderColor: string
  radius: Corners
  contentText: string
  fontSize: number
  linkPadding: LinkMode
  linkMargin: LinkMode
  linkBorder: LinkMode
}

const DEFAULT_STATE: State = {
  boxSizing: 'content-box',
  width: 220,
  height: 140,
  sizeUnit: 'px',
  spacingUnit: 'px',
  padding: { top: 20, right: 20, bottom: 20, left: 20 },
  margin: { top: 24, right: 24, bottom: 24, left: 24 },
  border: { top: 8, right: 8, bottom: 8, left: 8 },
  borderStyle: 'solid',
  borderColor: '#f59e0b',
  radius: { tl: 8, tr: 8, br: 8, bl: 8 },
  contentText: 'Content',
  fontSize: 16,
  linkPadding: 'all',
  linkMargin: 'all',
  linkBorder: 'all',
}

// Hues follow the Chrome DevTools convention students will meet later
// (blue content, green padding, amber border, orange margin) — but the
// margin tone is deliberately the *least* saturated of the four, light in
// light mode and deep in dark mode. The border colour is user-editable, so
// it's the one layer whose contrast can't be guaranteed; keeping margin as
// a muted backdrop means whatever the student picks still reads clearly
// against it. An earlier saturated-orange margin made a default amber
// border nearly invisible in dark mode.
const LAYER_SWATCH: Record<Layer, string> = {
  content: 'bg-sky-400 dark:bg-sky-600',
  padding: 'bg-emerald-300 dark:bg-emerald-700',
  border: 'bg-amber-400 dark:bg-amber-500',
  margin: 'bg-orange-200 dark:bg-orange-900',
}

// ── Presets ──────────────────────────────────────────────────────────────

type PresetKey = 'default' | 'borderBox' | 'paddingVsMargin' | 'zeroContent'

const PRESETS: Record<PresetKey, Partial<State>> = {
  default: DEFAULT_STATE,
  // 300 + 40 padding + 20 border = 360. The whole point of border-box.
  borderBox: {
    boxSizing: 'content-box',
    width: 300,
    height: 120,
    sizeUnit: 'px',
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
    border: { top: 10, right: 10, bottom: 10, left: 10 },
    margin: { top: 16, right: 16, bottom: 16, left: 16 },
    linkPadding: 'all',
    linkBorder: 'all',
    linkMargin: 'all',
  },
  paddingVsMargin: {
    boxSizing: 'border-box',
    width: 260,
    height: 160,
    padding: { top: 40, right: 40, bottom: 40, left: 40 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    border: { top: 4, right: 4, bottom: 4, left: 4 },
    linkPadding: 'all',
    linkBorder: 'all',
    linkMargin: 'all',
  },
  zeroContent: {
    boxSizing: 'content-box',
    width: 0,
    height: 0,
    padding: { top: 30, right: 30, bottom: 30, left: 30 },
    border: { top: 10, right: 10, bottom: 10, left: 10 },
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    linkPadding: 'all',
    linkBorder: 'all',
    linkMargin: 'all',
  },
}

// ── CSS generation ───────────────────────────────────────────────────────

// Collapses 4 values the way a person would write them: 20px, or
// "20px 10px", or "20px 10px 5px", or all four.
function shorthand(s: Sides, unit: string) {
  const { top, right, bottom, left } = s
  const u = (n: number) => `${n}${n === 0 ? '' : unit}`
  if (top === right && right === bottom && bottom === left) return u(top)
  if (top === bottom && left === right) return `${u(top)} ${u(right)}`
  if (left === right) return `${u(top)} ${u(right)} ${u(bottom)}`
  return `${u(top)} ${u(right)} ${u(bottom)} ${u(left)}`
}

function radiusShorthand(r: Corners) {
  const u = (n: number) => `${n}${n === 0 ? '' : 'px'}`
  if (r.tl === r.tr && r.tr === r.br && r.br === r.bl) return u(r.tl)
  return `${u(r.tl)} ${u(r.tr)} ${u(r.br)} ${u(r.bl)}`
}

function generateCss(s: State) {
  const lines = ['.box {']
  if (s.boxSizing === 'border-box') lines.push('  box-sizing: border-box;')
  lines.push(`  width: ${s.width}${s.width === 0 ? '' : s.sizeUnit};`)
  lines.push(`  height: ${s.height}${s.height === 0 ? '' : s.sizeUnit};`)
  lines.push(`  padding: ${shorthand(s.padding, s.spacingUnit)};`)
  if (s.borderStyle !== 'none') {
    lines.push(`  border-width: ${shorthand(s.border, 'px')};`)
    lines.push(`  border-style: ${s.borderStyle};`)
    lines.push(`  border-color: ${s.borderColor};`)
  } else {
    lines.push('  border: none;')
  }
  const r = radiusShorthand(s.radius)
  if (r !== '0') lines.push(`  border-radius: ${r};`)
  lines.push(`  margin: ${shorthand(s.margin, s.spacingUnit)};`)
  lines.push(`  font-size: ${s.fontSize}px;`)
  lines.push('}')
  return lines.join('\n')
}

// ── Small controls ───────────────────────────────────────────────────────
// Slider / Section / SegmentedControl now live in tool-controls.tsx, shared
// with the box-shadow generator.

// Padding/margin/border all share the same "link the sides together" idea
// the old demo had — it stays because typing four identical numbers is the
// single most common thing a student does with these properties.
function SidesControl({
  sides,
  link,
  max,
  suffix,
  labels,
  onSides,
  onLink,
}: {
  sides: Sides
  link: LinkMode
  max: number
  suffix: string
  labels: { all: string; none: string; tb: string; rl: string; top: string; right: string; bottom: string; left: string }
  onSides: (s: Sides) => void
  onLink: (m: LinkMode) => void
}) {
  function set(key: keyof Sides, n: number) {
    if (link === 'all') return onSides({ top: n, right: n, bottom: n, left: n })
    if (link === 'tb' && (key === 'top' || key === 'bottom')) return onSides({ ...sides, top: n, bottom: n })
    if (link === 'rl' && (key === 'left' || key === 'right')) return onSides({ ...sides, left: n, right: n })
    onSides({ ...sides, [key]: n })
  }

  return (
    <div className="space-y-2.5">
      <SegmentedControl
        value={link}
        onChange={onLink}
        options={[
          { value: 'all', label: labels.all },
          { value: 'tb', label: labels.tb },
          { value: 'rl', label: labels.rl },
          { value: 'none', label: labels.none },
        ]}
      />
      {link === 'all' ? (
        <Slider label={labels.all} value={sides.top} min={0} max={max} suffix={suffix} onChange={(n) => set('top', n)} />
      ) : (
        <>
          <Slider label={labels.top} value={sides.top} min={0} max={max} suffix={suffix} onChange={(n) => set('top', n)} />
          {link !== 'tb' && (
            <Slider label={labels.bottom} value={sides.bottom} min={0} max={max} suffix={suffix} onChange={(n) => set('bottom', n)} />
          )}
          <Slider label={labels.right} value={sides.right} min={0} max={max} suffix={suffix} onChange={(n) => set('right', n)} />
          {link !== 'rl' && (
            <Slider label={labels.left} value={sides.left} min={0} max={max} suffix={suffix} onChange={(n) => set('left', n)} />
          )}
        </>
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────

export function BoxModelDemo({ locale }: { locale: Locale }) {
  const s = bm(locale)
  const [state, setState] = useState<State>(DEFAULT_STATE)
  const [hovered, setHovered] = useState<Layer | null>(null)
  const [pinned, setPinned] = useState<Layer | null>(null)
  const [presetNote, setPresetNote] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [measured, setMeasured] = useState({ w: 0, h: 0, outerW: 0, outerH: 0 })

  const boxRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const active = pinned ?? hovered
  const css = useMemo(() => generateCss(state), [state])

  function patch(p: Partial<State>) {
    setState((prev) => ({ ...prev, ...p }))
    setPresetNote(null)
  }

  // Measured, not calculated — the browser is the source of truth for what
  // these numbers actually are, including when units are % / em / rem.
  const measure = useCallback(() => {
    const box = boxRef.current
    const wrap = wrapRef.current
    if (!box || !wrap) return
    const b = box.getBoundingClientRect()
    const w = wrap.getBoundingClientRect()
    setMeasured({
      w: Math.round(b.width),
      h: Math.round(b.height),
      outerW: Math.round(w.width),
      outerH: Math.round(w.height),
    })
  }, [])

  useEffect(() => {
    measure()
    const box = boxRef.current
    if (!box || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [measure, state])

  // One handler, three bands, exact geometry — the border, padding and
  // content regions are all on one element (they must be, for box-sizing to
  // behave like real CSS), so which layer the pointer is over is a
  // coordinate question rather than an event-target question.
  function bandAt(e: React.MouseEvent<HTMLDivElement>): Layer {
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const { top: bt, right: br, bottom: bb, left: bl } = state.border
    const { top: pt, right: pr, bottom: pb, left: pl } = state.padding
    if (y < bt || y > r.height - bb || x < bl || x > r.width - br) return 'border'
    if (y < bt + pt || y > r.height - bb - pb || x < bl + pl || x > r.width - br - pr) return 'padding'
    return 'content'
  }

  function applyPreset(key: PresetKey, note: string) {
    setState((prev) => ({ ...prev, ...DEFAULT_STATE, ...PRESETS[key] }))
    setPresetNote(note)
    setPinned(null)
  }

  async function copyCss() {
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const su = state.spacingUnit
  const zu = state.sizeUnit

  const descriptions: Record<Layer, string> = {
    content: s.contentDesc,
    padding: s.paddingDesc,
    border: s.borderDesc,
    margin: s.marginDesc,
  }
  const layerNames: Record<Layer, string> = {
    content: s.content,
    padding: s.padding,
    border: s.border,
    margin: s.margin,
  }

  // w-full is load-bearing, not decorative: this div is a flex item of
  // <body class="flex flex-col">, and align-items:stretch alone doesn't
  // reliably resolve to a content-independent width here — the grid below
  // would visibly resize whenever a descendant's intrinsic size changed
  // (e.g. the hover ring on the canvas box). w-full pins it.
  return (
    <div className="mx-auto w-full max-w-[110rem] px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/css/boxmodel' : '/css/boxmodel'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      {/* Presets */}
      <div className="mx-auto mt-8 max-w-4xl">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{s.presets}:</span>
          <Button size="sm" variant="outline" onClick={() => applyPreset('default', s.presetDefaultNote)}>{s.presetDefault}</Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('borderBox', s.presetBorderBoxNote)}>{s.presetBorderBox}</Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('paddingVsMargin', s.presetPaddingVsMarginNote)}>{s.presetPaddingVsMargin}</Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('zeroContent', s.presetZeroContentNote)}>{s.presetZeroContent}</Button>
        </div>
        {presetNote && (
          <p className="mt-3 flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{presetNote}</span>
          </p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[19rem_minmax(0,1fr)_22rem]">
        {/* ── Column 1: controls ─────────────────────────────────────── */}
        <div className="space-y-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
          <Section title={s.boxSizing}>
            <SegmentedControl
              value={state.boxSizing}
              onChange={(v) => patch({ boxSizing: v })}
              options={[
                { value: 'content-box', label: s.contentBox },
                { value: 'border-box', label: s.borderBox },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              {state.boxSizing === 'border-box' ? s.borderBoxHint : s.contentBoxHint}
            </p>
          </Section>

          <Section title={s.size}>
            <SegmentedControl
              value={state.sizeUnit}
              onChange={(v) => patch({ sizeUnit: v })}
              options={[
                { value: 'px', label: 'px' },
                { value: '%', label: '%' },
                { value: 'em', label: 'em' },
                { value: 'rem', label: 'rem' },
              ]}
            />
            <Slider
              label={s.width}
              value={state.width}
              min={0}
              max={zu === 'px' ? 600 : zu === '%' ? 100 : 40}
              suffix={zu}
              onChange={(n) => patch({ width: n })}
            />
            <Slider
              label={s.height}
              value={state.height}
              min={0}
              max={zu === 'px' ? 400 : zu === '%' ? 100 : 30}
              suffix={zu}
              onChange={(n) => patch({ height: n })}
            />
          </Section>

          <Section title={`${s.padding} + ${s.margin} ${s.unit}`}>
            <SegmentedControl
              value={state.spacingUnit}
              onChange={(v) => patch({ spacingUnit: v })}
              options={[
                { value: 'px', label: 'px' },
                { value: 'em', label: 'em' },
                { value: 'rem', label: 'rem' },
              ]}
            />
          </Section>

          <Section title={s.padding}>
            <SidesControl
              sides={state.padding}
              link={state.linkPadding}
              max={su === 'px' ? 80 : 6}
              suffix={su}
              labels={{ all: s.linkAll, none: s.linkNone, tb: s.linkTb, rl: s.linkRl, top: s.top, right: s.right, bottom: s.bottom, left: s.left }}
              onSides={(v) => patch({ padding: v })}
              onLink={(m) => patch({ linkPadding: m })}
            />
          </Section>

          <Section title={s.border}>
            <SidesControl
              sides={state.border}
              link={state.linkBorder}
              max={30}
              suffix="px"
              labels={{ all: s.linkAll, none: s.linkNone, tb: s.linkTb, rl: s.linkRl, top: s.top, right: s.right, bottom: s.bottom, left: s.left }}
              onSides={(v) => patch({ border: v })}
              onLink={(m) => patch({ linkBorder: m })}
            />
            <div className="grid grid-cols-2 gap-2 pt-1">
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">{s.borderStyle}</span>
                <select
                  value={state.borderStyle}
                  onChange={(e) => patch({ borderStyle: e.target.value as State['borderStyle'] })}
                  className="w-full rounded-md border bg-background px-2 py-1 text-xs"
                >
                  {(['solid', 'dashed', 'dotted', 'double', 'groove', 'none'] as const).map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">{s.borderColor}</span>
                <input
                  type="color"
                  value={state.borderColor}
                  onChange={(e) => patch({ borderColor: e.target.value })}
                  className="h-[26px] w-full cursor-pointer rounded-md border bg-background"
                />
              </label>
            </div>
          </Section>

          <Section title={s.margin}>
            <SidesControl
              sides={state.margin}
              link={state.linkMargin}
              max={su === 'px' ? 80 : 6}
              suffix={su}
              labels={{ all: s.linkAll, none: s.linkNone, tb: s.linkTb, rl: s.linkRl, top: s.top, right: s.right, bottom: s.bottom, left: s.left }}
              onSides={(v) => patch({ margin: v })}
              onLink={(m) => patch({ linkMargin: m })}
            />
          </Section>

          <Section title={s.radius}>
            <Slider label={s.topLeft} value={state.radius.tl} min={0} max={80} suffix="px" onChange={(n) => patch({ radius: { ...state.radius, tl: n } })} />
            <Slider label={s.topRight} value={state.radius.tr} min={0} max={80} suffix="px" onChange={(n) => patch({ radius: { ...state.radius, tr: n } })} />
            <Slider label={s.bottomRight} value={state.radius.br} min={0} max={80} suffix="px" onChange={(n) => patch({ radius: { ...state.radius, br: n } })} />
            <Slider label={s.bottomLeft} value={state.radius.bl} min={0} max={80} suffix="px" onChange={(n) => patch({ radius: { ...state.radius, bl: n } })} />
          </Section>

          <Section title={s.contentSection}>
            <label className="block space-y-1">
              <span className="text-xs text-muted-foreground">{s.contentText}</span>
              <input
                value={state.contentText}
                onChange={(e) => patch({ contentText: e.target.value })}
                className="w-full rounded-md border bg-background px-2 py-1 text-xs"
              />
            </label>
            <Slider label={s.fontSize} value={state.fontSize} min={8} max={48} suffix="px" onChange={(n) => patch({ fontSize: n })} />
          </Section>

          <Button variant="outline" size="sm" className="w-full" onClick={() => { setState(DEFAULT_STATE); setPresetNote(null); setPinned(null) }}>
            <RotateCcw className="size-3.5" /> {s.reset}
          </Button>
        </div>

        {/* ── Column 2: canvas ───────────────────────────────────────── */}
        <div className="min-w-0">
          <div
            className="flex min-h-[26rem] items-center justify-center overflow-auto rounded-xl border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-6"
            onMouseLeave={() => setHovered(null)}
          >
            {/* Margin region — its own element, since margin is genuinely
                outside the box and can't be a band of it. */}
            <div
              ref={wrapRef}
              className={cn(
                'relative transition-shadow',
                LAYER_SWATCH.margin,
                active === 'margin' && 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
              )}
              style={{
                paddingTop: `${state.margin.top}${su}`,
                paddingRight: `${state.margin.right}${su}`,
                paddingBottom: `${state.margin.bottom}${su}`,
                paddingLeft: `${state.margin.left}${su}`,
              }}
              onMouseMove={(e) => {
                if (e.target === e.currentTarget) setHovered('margin')
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setPinned((p) => (p === 'margin' ? null : 'margin'))
              }}
            >
              <span className="pointer-events-none absolute left-1 top-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange-900/70 dark:text-orange-50/70">
                {s.margin}
              </span>

              {/* The box itself: box-sizing, width/height, padding and border
                  all on one element so the browser applies real CSS semantics.
                  Its background is the padding colour — the content child
                  covers the content area, so what shows through is exactly
                  the padding region. */}
              <div
                ref={boxRef}
                className={cn(
                  'relative transition-shadow',
                  LAYER_SWATCH.padding,
                  (active === 'padding' || active === 'border' || active === 'content') &&
                    'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                )}
                style={{
                  boxSizing: state.boxSizing,
                  width: `${state.width}${zu}`,
                  height: `${state.height}${zu}`,
                  paddingTop: `${state.padding.top}${su}`,
                  paddingRight: `${state.padding.right}${su}`,
                  paddingBottom: `${state.padding.bottom}${su}`,
                  paddingLeft: `${state.padding.left}${su}`,
                  borderTopWidth: `${state.border.top}px`,
                  borderRightWidth: `${state.border.right}px`,
                  borderBottomWidth: `${state.border.bottom}px`,
                  borderLeftWidth: `${state.border.left}px`,
                  borderStyle: state.borderStyle,
                  borderColor: state.borderColor,
                  borderRadius: `${state.radius.tl}px ${state.radius.tr}px ${state.radius.br}px ${state.radius.bl}px`,
                  fontSize: `${state.fontSize}px`,
                }}
                onMouseMove={(e) => setHovered(bandAt(e))}
                onClick={(e) => {
                  const band = bandAt(e)
                  setPinned((p) => (p === band ? null : band))
                }}
              >
                <div
                  className={cn('flex h-full w-full items-center justify-center overflow-hidden text-center', LAYER_SWATCH.content)}
                >
                  <span className="px-1 font-medium text-sky-950 dark:text-sky-50">{state.contentText}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend — also a control surface, so the layers are reachable
              without pointing at a small region (and by keyboard). */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(['content', 'padding', 'border', 'margin'] as Layer[]).map((layer) => (
              <button
                key={layer}
                type="button"
                onMouseEnter={() => setHovered(layer)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setPinned((p) => (p === layer ? null : layer))}
                aria-pressed={pinned === layer}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs transition-colors',
                  active === layer ? 'border-foreground bg-muted' : 'hover:bg-muted/50'
                )}
              >
                <span className={cn('size-3 shrink-0 rounded-sm', LAYER_SWATCH[layer])} />
                <span className="font-medium">{layerNames[layer]}</span>
              </button>
            ))}
          </div>

          {/* Explanation panel */}
          <div className="mt-3 min-h-[5.5rem] rounded-lg border bg-muted/30 p-3">
            {active ? (
              <>
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <span className={cn('size-3 rounded-sm', LAYER_SWATCH[active])} />
                  {layerNames[active]}
                  {pinned === active && <span className="text-xs font-normal text-muted-foreground">· {s.clickLayerHint}</span>}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">{descriptions[active]}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{s.hoverHint}</p>
            )}
          </div>
        </div>

        {/* ── Column 3: maths + code ─────────────────────────────────── */}
        <div className="space-y-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <Section title={s.theMath}>
            <dl className="space-y-1.5 text-sm">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground">{s.totalWidth}</dt>
                <dd className="font-mono font-semibold tabular-nums">{measured.w}px</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground">{s.totalHeight}</dt>
                <dd className="font-mono font-semibold tabular-nums">{measured.h}px</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2 border-t pt-1.5">
                <dt className="text-muted-foreground">{s.occupiesWidth}</dt>
                <dd className="font-mono font-semibold tabular-nums">{measured.outerW} × {measured.outerH}px</dd>
              </div>
            </dl>

            {/* The arithmetic spelled out — this is the bit that makes
                content-box vs border-box click. */}
            <div className="mt-3 space-y-1 rounded-md bg-muted/50 p-2 font-mono text-[11px] leading-relaxed">
              {state.boxSizing === 'content-box' ? (
                <>
                  <p><span className="text-sky-600 dark:text-sky-400">content {state.width}{zu}</span></p>
                  <p>+ <span className="text-emerald-600 dark:text-emerald-400">padding {state.padding.left}+{state.padding.right}{su}</span></p>
                  <p>+ <span className="text-amber-600 dark:text-amber-400">border {state.border.left}+{state.border.right}px</span></p>
                  <p className="border-t pt-1 font-semibold">= {measured.w}px</p>
                </>
              ) : (
                <>
                  <p><span className="font-semibold">width {state.width}{zu}</span> = {measured.w}px</p>
                  <p className="text-muted-foreground">
                    <span className="text-emerald-600 dark:text-emerald-400">padding</span> +{' '}
                    <span className="text-amber-600 dark:text-amber-400">border</span> fit inside
                  </p>
                  <p className="border-t pt-1"><span className="text-sky-600 dark:text-sky-400">content</span> = what is left over</p>
                </>
              )}
            </div>
          </Section>

          <Section title={s.generatedCss}>
            <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
              <code>{css}</code>
            </pre>
            <Button size="sm" variant="outline" className="w-full" onClick={copyCss}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? s.copied : s.copy}
            </Button>
          </Section>
        </div>
      </div>
    </div>
  )
}
