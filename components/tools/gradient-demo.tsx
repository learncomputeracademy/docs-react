'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, RotateCcw, ArrowRight, Lightbulb, Plus, Trash2, Undo2, Redo2, Link2, Pipette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider, Section, SegmentedControl } from '@/components/tools/tool-controls'
import { cn } from '@/lib/utils'
import { gs } from '@/lib/gradient-i18n'
import type { Locale } from '@/lib/types'
import { hexToRgba, formatColor, type ColorFormat } from '@/lib/color'
import {
  makeStop, gradientValue, toTailwindArbitrary, colorAtPosition, parseGradientInput,
  GRADIENT_PRESETS, type Stop, type GradientSpec, type GradientKind, type RadialShape,
  type RadialSize, type Interpolation, type PresetKey,
} from '@/lib/gradient'

// ── Model ────────────────────────────────────────────────────────────────
// Same principle as the box model / box shadow demos: real browser CSS, not
// a simulation. The sRGB-vs-OKLCH comparison in particular only works
// because both swatches are the browser's own `in oklch` interpolation
// (CSS Color 4), not two hand-rolled gradients.

type CanvasBg = 'checker' | 'solid'
type FieldKey = 'angle' | 'position' | 'color' | 'stopPosition'

type State = {
  spec: GradientSpec
  activeStopId: string | null
  colorFormat: ColorFormat
  interpolation: Interpolation
  canvasWidth: number
  canvasHeight: number
  radius: number
  canvasBg: CanvasBg
  canvasDark: boolean
  zoom: number
}

function defaultState(): State {
  const stops: Stop[] = [
    makeStop({ color: '#6366f1', alpha: 1, position: 0 }, 'default-1'),
    makeStop({ color: '#ec4899', alpha: 1, position: 100 }, 'default-2'),
  ]
  return {
    spec: { kind: 'linear', angle: 135, radialShape: 'circle', radialSize: 'farthest-corner', posX: 50, posY: 50, stops },
    activeStopId: stops[0].id,
    colorFormat: 'hex8',
    interpolation: 'srgb',
    canvasWidth: 320,
    canvasHeight: 220,
    radius: 16,
    canvasBg: 'checker',
    canvasDark: false,
    zoom: 100,
  }
}

type SharedState = Pick<State, 'spec' | 'colorFormat' | 'interpolation' | 'canvasWidth' | 'canvasHeight' | 'radius' | 'canvasBg' | 'canvasDark'>
const STORAGE_KEY = 'gradient-demo-state'

function toShared(s: State): SharedState {
  return {
    spec: s.spec, colorFormat: s.colorFormat, interpolation: s.interpolation,
    canvasWidth: s.canvasWidth, canvasHeight: s.canvasHeight, radius: s.radius,
    canvasBg: s.canvasBg, canvasDark: s.canvasDark,
  }
}
function encodeShareState(s: State): string {
  return encodeURIComponent(btoa(JSON.stringify(toShared(s))))
}
function decodeShareState(raw: string): SharedState | null {
  try {
    return JSON.parse(atob(decodeURIComponent(raw)))
  } catch {
    return null
  }
}
function loadFromUrl(): SharedState | null {
  if (typeof window === 'undefined') return null
  const s = new URLSearchParams(window.location.search).get('s')
  return s ? decodeShareState(s) : null
}
function loadFromStorage(): SharedState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// ── Colour field (hex + alpha — same pattern as the box-shadow generator) ─

function ColorField({
  hex, alpha, onHex, onAlpha, onDragStart, label, opacityLabel, eyedropperLabel,
}: {
  hex: string
  alpha: number
  onHex: (h: string) => void
  onAlpha: (a: number) => void
  onDragStart: () => void
  label: string
  opacityLabel: string
  eyedropperLabel: string
}) {
  const [supportsEyedropper, setSupportsEyedropper] = useState(false)
  useEffect(() => setSupportsEyedropper(typeof window !== 'undefined' && 'EyeDropper' in window), [])

  async function pick() {
    type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> }
    const Ctor = (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper
    if (!Ctor) return
    try {
      const result = await new Ctor().open()
      onDragStart()
      onHex(result.sRGBHex)
    } catch {
      // user cancelled the picker
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input type="color" value={hex} onPointerDown={onDragStart} onChange={(e) => onHex(e.target.value)} className="h-8 w-10 cursor-pointer rounded border bg-background" aria-label={label} />
        <input type="text" value={hex} onChange={(e) => { onDragStart(); onHex(e.target.value) }} className="w-24 rounded-md border bg-background px-2 py-1 font-mono text-xs" />
        {supportsEyedropper && (
          <button type="button" onClick={pick} className="rounded-md border p-1.5 text-muted-foreground hover:text-foreground" title={eyedropperLabel}>
            <Pipette className="size-3.5" />
          </button>
        )}
        <span className="ml-auto h-7 w-7 shrink-0 rounded border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:8px_8px]">
          <span className="block h-full w-full rounded" style={{ backgroundColor: formatColor(hexToRgba(hex, alpha), 'rgba') }} />
        </span>
      </div>
      <Slider label={opacityLabel} value={Math.round(alpha * 100)} min={0} max={100} suffix="%" onDragStart={onDragStart} onChange={(n) => onAlpha(n / 100)} />
    </div>
  )
}

// ── Gradient bar — click to add a stop, drag a handle to move one ────────

function GradientBar({
  stops, activeId, barCss, onSelect, onMove, onInsert, hint,
}: {
  stops: Stop[]
  activeId: string | null
  barCss: string
  onSelect: (id: string) => void
  onMove: (id: string, position: number) => void
  onInsert: (position: number) => void
  hint: string
}) {
  const barRef = useRef<HTMLDivElement>(null)
  const draggingId = useRef<string | null>(null)

  function positionFromClientX(clientX: number) {
    const rect = barRef.current?.getBoundingClientRect()
    if (!rect) return 0
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
  }

  return (
    <div className="space-y-1.5">
      <div
        ref={barRef}
        className="relative h-9 w-full cursor-copy rounded-md border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:10px_10px]"
        onClick={(e) => onInsert(positionFromClientX(e.clientX))}
        onPointerMove={(e) => {
          if (draggingId.current) onMove(draggingId.current, positionFromClientX(e.clientX))
        }}
        onPointerUp={() => {
          draggingId.current = null
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-md" style={{ backgroundImage: barCss }} />
        {stops.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => {
              e.stopPropagation()
              draggingId.current = s.id
              onSelect(s.id)
              ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
            }}
            style={{ left: `${s.position}%`, backgroundColor: formatColor(hexToRgba(s.color, s.alpha), 'rgba') }}
            className={cn(
              'absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-white shadow active:cursor-grabbing dark:border-neutral-900',
              s.id === activeId && 'ring-2 ring-foreground ring-offset-1 ring-offset-background'
            )}
            aria-label={`${Math.round(s.position)}%`}
          />
        ))}
      </div>
      <p className="text-center text-[11px] text-muted-foreground">{hint}</p>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────

export function GradientDemo({ locale }: { locale: Locale }) {
  const s = gs(locale)
  const [state, setState] = useState<State>(defaultState)
  const [history, setHistory] = useState<{ past: GradientSpec[]; future: GradientSpec[] }>({ past: [], future: [] })
  const [hintField, setHintField] = useState<FieldKey | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)
  const [format, setFormat] = useState<'css' | 'tailwind' | 'cssvar' | 'react'>('css')
  const [pasteText, setPasteText] = useState('')
  const [pasteError, setPasteError] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number } | null>(null)

  useEffect(() => {
    const loaded = loadFromUrl() ?? loadFromStorage()
    if (loaded?.spec?.stops?.length) {
      setState((prev) => ({ ...prev, ...loaded, activeStopId: loaded.spec.stops[0]?.id ?? null }))
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toShared(state)))
  }, [state])

  function patch(p: Partial<State>) {
    setState((prev) => ({ ...prev, ...p }))
    setNote(null)
  }
  function patchSpec(p: Partial<GradientSpec>) {
    patch({ spec: { ...state.spec, ...p } })
  }
  function snapshot() {
    setHistory((h) => ({ past: [...h.past, state.spec].slice(-50), future: [] }))
  }
  function undo() {
    if (history.past.length === 0) return
    const prev = history.past[history.past.length - 1]
    setHistory({ past: history.past.slice(0, -1), future: [state.spec, ...history.future].slice(0, 50) })
    setState((s2) => ({ ...s2, spec: prev, activeStopId: prev.stops.find((st) => st.id === s2.activeStopId)?.id ?? prev.stops[0]?.id ?? null }))
  }
  function redo() {
    if (history.future.length === 0) return
    const next = history.future[0]
    setHistory({ past: [...history.past, state.spec].slice(-50), future: history.future.slice(1) })
    setState((s2) => ({ ...s2, spec: next, activeStopId: next.stops.find((st) => st.id === s2.activeStopId)?.id ?? next.stops[0]?.id ?? null }))
  }

  const activeStop = state.spec.stops.find((st) => st.id === state.activeStopId) ?? null

  function patchActiveStop(p: Partial<Stop>) {
    if (!activeStop) return
    patchSpec({ stops: state.spec.stops.map((st) => (st.id === activeStop.id ? { ...st, ...p } : st)) })
  }

  function addStop() {
    snapshot()
    const position = activeStop ? Math.min(100, activeStop.position + 15) : 50
    const c = colorAtPosition(state.spec.stops, position)
    const stop = makeStop({ ...c, position })
    patchSpec({ stops: [...state.spec.stops, stop] })
    patch({ activeStopId: stop.id })
  }
  function insertStopAt(position: number) {
    snapshot()
    const c = colorAtPosition(state.spec.stops, position)
    const stop = makeStop({ ...c, position })
    patchSpec({ stops: [...state.spec.stops, stop] })
    patch({ activeStopId: stop.id })
  }
  function moveStop(id: string, position: number) {
    patchSpec({ stops: state.spec.stops.map((st) => (st.id === id ? { ...st, position } : st)) })
  }
  function deleteStop(id: string) {
    if (state.spec.stops.length <= 2) return
    snapshot()
    const next = state.spec.stops.filter((st) => st.id !== id)
    patchSpec({ stops: next })
    patch({ activeStopId: next[0]?.id ?? null })
  }

  function applyPreset(key: PresetKey, noteText: string) {
    snapshot()
    const preset = GRADIENT_PRESETS[key]
    const stops = preset.stops.map((st) => makeStop(st))
    patch({ spec: { ...preset, stops }, activeStopId: stops[0]?.id ?? null })
    setNote(noteText)
  }

  function doPasteImport() {
    const parsed = parseGradientInput(pasteText)
    if (!parsed) {
      setPasteError(true)
      return
    }
    snapshot()
    setPasteError(false)
    patch({ spec: parsed.spec, interpolation: parsed.interpolation, activeStopId: parsed.spec.stops[0]?.id ?? null })
    setPasteText('')
  }

  async function copyFormat(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopiedFormat(key)
    setTimeout(() => setCopiedFormat(null), 1500)
  }
  async function copyShareLink() {
    const url = `${window.location.origin}${window.location.pathname}?s=${encodeShareState(state)}`
    await navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }
  function reset() {
    setState(defaultState())
    setHistory({ past: [], future: [] })
    setNote(null)
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY)
  }

  const cssSrgb = useMemo(() => gradientValue(state.spec, state.colorFormat, 'srgb'), [state.spec, state.colorFormat])
  const cssOklch = useMemo(() => gradientValue(state.spec, state.colorFormat, 'oklch'), [state.spec, state.colorFormat])
  const cssSelected = state.interpolation === 'oklch' ? cssOklch : cssSrgb
  const cssSingleLine = useMemo(() => gradientValue(state.spec, state.colorFormat, state.interpolation), [state.spec, state.colorFormat, state.interpolation])
  const barCss = useMemo(() => gradientValue({ ...state.spec, kind: 'linear', angle: 90 }, 'rgba', 'srgb'), [state.spec])

  const cssBlock = `.gradient {\n  background-image: ${cssSelected};\n}`
  const tailwindSnippet = `class="bg-[${toTailwindArbitrary(cssSingleLine)}]"`
  const cssVarSnippet = `--gradient: ${cssSingleLine};`
  const reactSnippet = `{ backgroundImage: '${cssSingleLine}' }`
  const outputByFormat = { css: cssBlock, tailwind: tailwindSnippet, cssvar: cssVarSnippet, react: reactSnippet }

  function onSwatchPointerDown(e: React.PointerEvent) {
    snapshot()
    dragRef.current = { startX: e.clientX, startY: e.clientY }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }
  function onSwatchPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    if (state.spec.kind === 'linear') {
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const deg = (Math.atan2(dx, -dy) * 180) / Math.PI
      patchSpec({ angle: Math.round((deg + 360) % 360) })
    } else {
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      patchSpec({ posX: Math.round(Math.max(0, Math.min(100, x))), posY: Math.round(Math.max(0, Math.min(100, y))) })
    }
  }
  function onSwatchPointerUp() {
    dragRef.current = null
  }

  function hintProps(key: FieldKey) {
    return { onMouseEnter: () => setHintField(key), onMouseLeave: () => setHintField(null), onFocus: () => setHintField(key) }
  }
  const fieldHintText: Record<FieldKey, string> = {
    angle: state.spec.kind === 'conic' ? s.angleConicHint : s.angleLinearHint,
    position: s.dragPositionHint,
    color: s.colorDesc,
    stopPosition: s.clickBarHint,
  }

  const swatchStyle = (css: string): React.CSSProperties => ({
    width: state.canvasWidth,
    height: state.canvasHeight,
    borderRadius: state.radius,
    backgroundImage: css,
    cursor: 'grab',
  })

  const presetList: { key: PresetKey; label: string; note: string }[] = [
    { key: 'sunset', label: s.presetSunset, note: s.presetSunsetNote },
    { key: 'ocean', label: s.presetOcean, note: s.presetOceanNote },
    { key: 'forest', label: s.presetForest, note: s.presetForestNote },
    { key: 'candy', label: s.presetCandy, note: s.presetCandyNote },
    { key: 'uiSubtle', label: s.presetUiSubtle, note: s.presetUiSubtleNote },
    { key: 'glass', label: s.presetGlass, note: s.presetGlassNote },
    { key: 'mesh', label: s.presetMesh, note: s.presetMeshNote },
    { key: 'mono', label: s.presetMono, note: s.presetMonoNote },
  ]

  return (
    <div className="mx-auto w-full max-w-[110rem] px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/css' : '/css'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3">
        <SegmentedControl
          value={state.spec.kind}
          onChange={(v: GradientKind) => patchSpec({ kind: v })}
          options={[{ value: 'linear', label: s.typeLinear }, { value: 'radial', label: s.typeRadial }, { value: 'conic', label: s.typeConic }]}
        />
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" disabled={history.past.length === 0} onClick={undo} title={s.undo}><Undo2 className="size-3.5" /></Button>
          <Button size="sm" variant="outline" disabled={history.future.length === 0} onClick={redo} title={s.redo}><Redo2 className="size-3.5" /></Button>
          <Button size="sm" variant="outline" onClick={reset}><RotateCcw className="size-3.5" /> {s.reset}</Button>
          <Button size="sm" variant="outline" onClick={copyShareLink}>
            <Link2 className="size-3.5" /> {linkCopied ? s.shareLinkCopied : s.copyShareLink}
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)_24rem]">
        {/* ── Column 1: type controls + stops ─────────────────────────── */}
        <div className="space-y-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
          {state.spec.kind === 'linear' ? (
            <Section title={s.angle}>
              <div {...hintProps('angle')}>
                <Slider label={s.angle} value={state.spec.angle} min={0} max={359} suffix="°" onChange={(n) => patchSpec({ angle: n })} />
              </div>
            </Section>
          ) : (
            <Section title={state.spec.kind === 'conic' ? s.angle : s.position}>
              {state.spec.kind === 'conic' && (
                <div {...hintProps('angle')}>
                  <Slider label={s.angle} value={state.spec.angle} min={0} max={359} suffix="°" onChange={(n) => patchSpec({ angle: n })} />
                </div>
              )}
              {state.spec.kind === 'radial' && (
                <>
                  <SegmentedControl value={state.spec.radialShape} onChange={(v: RadialShape) => patchSpec({ radialShape: v })} options={[{ value: 'circle', label: s.shapeCircle }, { value: 'ellipse', label: s.shapeEllipse }]} />
                  <SegmentedControl
                    value={state.spec.radialSize}
                    onChange={(v: RadialSize) => patchSpec({ radialSize: v })}
                    options={[
                      { value: 'closest-side', label: s.sizeClosestSide },
                      { value: 'closest-corner', label: s.sizeClosestCorner },
                      { value: 'farthest-side', label: s.sizeFarthestSide },
                      { value: 'farthest-corner', label: s.sizeFarthestCorner },
                    ]}
                  />
                </>
              )}
              <div {...hintProps('position')}>
                <Slider label={s.positionX} value={state.spec.posX} min={0} max={100} suffix="%" onChange={(n) => patchSpec({ posX: n })} />
                <Slider label={s.positionY} value={state.spec.posY} min={0} max={100} suffix="%" onChange={(n) => patchSpec({ posY: n })} />
              </div>
            </Section>
          )}

          <Section
            title={`${s.stops} (${state.spec.stops.length})`}
            action={<button type="button" onClick={addStop} className="flex items-center gap-1 text-primary hover:underline"><Plus className="size-3.5" /> {s.addStop}</button>}
          >
            <div {...hintProps('stopPosition')}>
              <GradientBar
                stops={state.spec.stops}
                activeId={state.activeStopId}
                barCss={barCss}
                hint={s.clickBarHint}
                onSelect={(id) => patch({ activeStopId: id })}
                onMove={(id, pos) => moveStop(id, pos)}
                onInsert={insertStopAt}
              />
            </div>
            <div className="overflow-hidden rounded-lg border">
              {[...state.spec.stops].sort((a, b) => a.position - b.position).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => patch({ activeStopId: st.id })}
                  className={cn('flex w-full items-center gap-2 border-b px-2 py-1.5 text-left last:border-0', st.id === state.activeStopId && 'bg-muted/60')}
                >
                  <span className="size-4 shrink-0 rounded border" style={{ backgroundColor: formatColor(hexToRgba(st.color, st.alpha), 'rgba') }} />
                  <span className="flex-1 font-mono text-[11px] text-muted-foreground">{Math.round(st.position)}%</span>
                  {state.spec.stops.length > 2 && (
                    <span onClick={(e) => { e.stopPropagation(); deleteStop(st.id) }} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-3.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            {state.spec.stops.length <= 2 && <p className="text-xs text-muted-foreground">{s.minStopsHint}</p>}
          </Section>

          {activeStop && (
            <Section title={`${s.stop} ${Math.round(activeStop.position)}%`}>
              <Slider label={s.stopPosition} value={Math.round(activeStop.position)} min={0} max={100} suffix="%" onDragStart={snapshot} onChange={(n) => patchActiveStop({ position: n })} />
              <div {...hintProps('color')}>
                <ColorField label={s.color} opacityLabel={s.opacity} eyedropperLabel={s.eyedropper} hex={activeStop.color} alpha={activeStop.alpha} onDragStart={snapshot} onHex={(h) => patchActiveStop({ color: h })} onAlpha={(a) => patchActiveStop({ alpha: a })} />
              </div>
              {hintField && <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{fieldHintText[hintField]}</p>}
            </Section>
          )}

          <Section title={s.pasteImport}>
            <textarea
              value={pasteText}
              onChange={(e) => { setPasteText(e.target.value); setPasteError(false) }}
              placeholder={s.pasteImportPlaceholder}
              rows={3}
              className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-xs"
            />
            {pasteError && <p className="text-xs text-destructive">{s.pasteImportError}</p>}
            <Button size="sm" variant="outline" className="w-full" onClick={doPasteImport} disabled={!pasteText.trim()}>
              {s.pasteImportButton}
            </Button>
          </Section>
        </div>

        {/* ── Column 2: sRGB vs OKLCH comparison canvas ───────────────── */}
        <div className="min-w-0 space-y-4">
          <div className={cn('rounded-xl border p-6', state.canvasDark && 'bg-neutral-950')}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn('flex items-center justify-center overflow-hidden', state.canvasBg === 'checker' && 'bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]')}
                  style={{ borderRadius: state.radius }}
                >
                  <div style={{ ...swatchStyle(cssSrgb), transform: `scale(${state.zoom / 100})` }} onPointerDown={onSwatchPointerDown} onPointerMove={onSwatchPointerMove} onPointerUp={onSwatchPointerUp} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{s.srgb}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn('flex items-center justify-center overflow-hidden', state.canvasBg === 'checker' && 'bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]')}
                  style={{ borderRadius: state.radius }}
                >
                  <div style={{ ...swatchStyle(cssOklch), transform: `scale(${state.zoom / 100})` }} onPointerDown={onSwatchPointerDown} onPointerMove={onSwatchPointerMove} onPointerUp={onSwatchPointerUp} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{s.oklchOption}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-sm font-semibold">{s.comparisonTitle}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.comparisonHint}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{s.oklchUnsupportedNote}</p>
          </div>

          <Section title={s.canvas}>
            <div className="grid grid-cols-2 gap-3">
              <SegmentedControl value={state.colorFormat} onChange={(v: ColorFormat) => patch({ colorFormat: v })} options={[{ value: 'hex8', label: s.hex8 }, { value: 'rgba', label: s.rgba }, { value: 'hsl', label: s.hsl }, { value: 'oklch', label: s.oklch }]} />
              <SegmentedControl value={state.interpolation} onChange={(v: Interpolation) => patch({ interpolation: v })} options={[{ value: 'srgb', label: s.srgb }, { value: 'oklch', label: s.oklchOption }]} />
            </div>
            <p className="text-xs text-muted-foreground">{s.interpolationHint}</p>
            <Slider label={s.canvasSize} value={state.canvasWidth} min={120} max={500} suffix="px" onChange={(n) => patch({ canvasWidth: n })} />
            <Slider label={s.radius} value={state.radius} min={0} max={999} suffix="px" onChange={(n) => patch({ radius: n })} />
            <SegmentedControl value={state.canvasBg} onChange={(v: CanvasBg) => patch({ canvasBg: v })} options={[{ value: 'checker', label: s.canvasBgChecker }, { value: 'solid', label: s.canvasBgSolid }]} />
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={state.canvasDark} onChange={(e) => patch({ canvasDark: e.target.checked })} />
              {s.canvasDark}
            </label>
            <Slider label={s.zoom} value={state.zoom} min={50} max={150} suffix="%" onChange={(n) => patch({ zoom: n })} />
          </Section>
        </div>

        {/* ── Column 3: presets + output ─────────────────────────────── */}
        <div className="space-y-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <Section title={s.presets}>
            <div className="grid grid-cols-2 gap-1.5">
              {presetList.map((p) => (
                <Button key={p.key} size="sm" variant="outline" className="h-auto py-1.5 text-xs" onClick={() => applyPreset(p.key, p.note)}>
                  {p.label}
                </Button>
              ))}
            </div>
            {note && (
              <p className="mt-1 flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{note}</span>
              </p>
            )}
          </Section>

          <Section title={s.generatedCss}>
            <SegmentedControl
              value={format}
              onChange={setFormat}
              options={[{ value: 'css', label: s.formatCss }, { value: 'tailwind', label: s.formatTailwind }, { value: 'cssvar', label: s.formatCssVar }, { value: 'react', label: s.formatReact }]}
            />
            <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
              <code>{outputByFormat[format]}</code>
            </pre>
            <Button size="sm" variant="outline" className="w-full" onClick={() => copyFormat(outputByFormat[format], format)}>
              {copiedFormat === format ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copiedFormat === format ? s.copied : s.copy}
            </Button>
          </Section>

          <Section title={s.hoverHint}>
            <p className="text-xs text-muted-foreground">{s.perfNote}</p>
          </Section>
        </div>
      </div>
    </div>
  )
}
