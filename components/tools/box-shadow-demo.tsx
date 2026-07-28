'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Copy, Check, RotateCcw, ArrowRight, Lightbulb, Plus, Trash2, Eye, EyeOff,
  GripVertical, Undo2, Redo2, Link2, Pipette, Star, Sparkles, Sun,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider, Section, SegmentedControl } from '@/components/tools/tool-controls'
import { cn } from '@/lib/utils'
import { bs } from '@/lib/box-shadow-i18n'
import type { Locale } from '@/lib/types'
import { hexToRgba, formatColor, type ColorFormat } from '@/lib/color'
import {
  makeLayer, shadowValue, toTailwindArbitrary, parseShadowInput, smoothShadowLayers,
  angleDistanceToOffset, SHADOW_PRESETS, type ShadowLayer, type Unit, type ShadowKind, type PresetKey,
} from '@/lib/box-shadow'

// ── Model ────────────────────────────────────────────────────────────────
// Same principle as the box model demo: real CSS on a real element, browser
// does the work. Mode ('box' | 'text' | 'drop') doubles as the CSS
// property that gets driven — box-shadow, text-shadow, or filter: drop-shadow().

// 'text' mode (the top-level shadow-type switch) drives its own span
// rather than going through the shape selector, so Shape only lists the
// options the <select> actually offers.
type Shape = 'card' | 'button' | 'pill' | 'circle' | 'image'
type CanvasBg = 'solid' | 'checker' | 'gradient'
type FieldKey = 'offsetX' | 'offsetY' | 'blur' | 'spread' | 'color' | 'inset'

type BoxSettings = { width: number; height: number; radius: number; bg: string }

type State = {
  mode: ShadowKind
  unit: Unit
  colorFormat: ColorFormat
  layers: ShadowLayer[]
  activeLayerId: string | null
  soloLayerId: string | null
  lightSourceOn: boolean
  lightAngle: number
  lightDistance: number
  lightElevation: number
  shape: Shape
  box: BoxSettings
  canvasBg: CanvasBg
  canvasBgColor: string
  canvasDark: boolean
  zoom: number
  contentText: string
  fontSize: number
}

const SHAPE_DEFAULTS: Record<Shape, Partial<BoxSettings>> = {
  card: { width: 220, height: 140, radius: 16 },
  button: { width: 160, height: 48, radius: 10 },
  pill: { width: 160, height: 48, radius: 999 },
  circle: { width: 140, height: 140, radius: 999 },
  image: { width: 160, height: 160, radius: 0 },
}

function defaultState(): State {
  const layers = [
    makeLayer({ x: 0, y: 10, blur: 20, spread: 0, color: '#000000', alpha: 0.25 }, 'default-1'),
    makeLayer({ x: 0, y: 4, blur: 6, spread: -2, color: '#000000', alpha: 0.15 }, 'default-2'),
  ]
  return {
    mode: 'box',
    unit: 'px',
    colorFormat: 'rgba',
    layers,
    activeLayerId: layers[0].id,
    soloLayerId: null,
    lightSourceOn: false,
    lightAngle: 315,
    lightDistance: 20,
    lightElevation: 10,
    shape: 'card',
    box: { width: 220, height: 140, radius: 16, bg: '#3b82f6' },
    canvasBg: 'checker',
    canvasBgColor: '#f4f4f5',
    canvasDark: false,
    zoom: 100,
    contentText: 'Shadow',
    fontSize: 64,
  }
}

// URL / localStorage carry a subset — UI-only bits (activeLayerId hover
// state, zoom) aren't worth round-tripping.
type SharedState = Pick<
  State,
  'mode' | 'unit' | 'colorFormat' | 'layers' | 'shape' | 'box' | 'canvasBg' | 'canvasBgColor' | 'canvasDark' | 'contentText' | 'fontSize'
>

const STORAGE_KEY = 'box-shadow-demo-state'

function encodeShareState(s: State): string {
  const shared: SharedState = {
    mode: s.mode, unit: s.unit, colorFormat: s.colorFormat, layers: s.layers, shape: s.shape,
    box: s.box, canvasBg: s.canvasBg, canvasBgColor: s.canvasBgColor, canvasDark: s.canvasDark,
    contentText: s.contentText, fontSize: s.fontSize,
  }
  return encodeURIComponent(btoa(JSON.stringify(shared)))
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

// ── Colour field (hex + alpha, since no browser natively pickers alpha) ──

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
      // user cancelled the picker — nothing to do
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onPointerDown={onDragStart}
          onChange={(e) => onHex(e.target.value)}
          className="h-8 w-10 cursor-pointer rounded border bg-background"
          aria-label={label}
        />
        <input
          type="text"
          value={hex}
          onChange={(e) => { onDragStart(); onHex(e.target.value) }}
          className="w-24 rounded-md border bg-background px-2 py-1 font-mono text-xs"
        />
        {supportsEyedropper && (
          <button type="button" onClick={pick} className="rounded-md border p-1.5 text-muted-foreground hover:text-foreground" title={eyedropperLabel}>
            <Pipette className="size-3.5" />
          </button>
        )}
        <span
          className="ml-auto h-7 w-7 shrink-0 rounded border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:8px_8px]"
          style={{ backgroundColor: undefined }}
        >
          <span className="block h-full w-full rounded" style={{ backgroundColor: formatColor(hexToRgba(hex, alpha), 'rgba') }} />
        </span>
      </div>
      <Slider label={opacityLabel} value={Math.round(alpha * 100)} min={0} max={100} suffix="%" onDragStart={onDragStart} onChange={(n) => onAlpha(n / 100)} />
    </div>
  )
}

// ── Sortable layer row ───────────────────────────────────────────────────

type LayerRowLabels = {
  dragToReorder: string
  solo: string
  unsolo: string
  hide: string
  show: string
  duplicate: string
  delete: string
}

function LayerRowContent({
  layer, active, onSelect, onToggleVisible, onToggleSolo, isSolo, onDelete, onDuplicate, dragHandleProps, canDelete, unit, labels,
}: {
  layer: ShadowLayer
  active: boolean
  onSelect: () => void
  onToggleVisible: () => void
  onToggleSolo: () => void
  isSolo: boolean
  onDelete: () => void
  onDuplicate: () => void
  dragHandleProps?: Record<string, unknown>
  canDelete: boolean
  unit: Unit
  labels: LayerRowLabels
}) {
  const swatch = formatColor(hexToRgba(layer.color, layer.alpha), 'rgba')
  return (
    <div className={cn('flex items-center gap-2 border-b px-2 py-1.5 last:border-0', active && 'bg-muted/60')}>
      <button type="button" {...dragHandleProps} className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing" aria-label={labels.dragToReorder}>
        <GripVertical className="size-3.5" />
      </button>
      <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        <span className="size-4 shrink-0 rounded border" style={{ backgroundColor: swatch }} />
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {layer.inset ? 'inset ' : ''}{layer.x}{unit} {layer.y}{unit} {layer.blur}{unit} {layer.spread}{unit}
        </span>
      </button>
      <button type="button" onClick={onToggleSolo} aria-pressed={isSolo} className={cn('text-muted-foreground hover:text-foreground', isSolo && 'text-primary')} title={isSolo ? labels.unsolo : labels.solo}>
        <Sun className="size-3.5" />
      </button>
      <button type="button" onClick={onToggleVisible} className="text-muted-foreground hover:text-foreground" title={layer.visible ? labels.hide : labels.show}>
        {layer.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
      </button>
      <button type="button" onClick={onDuplicate} className="text-muted-foreground hover:text-foreground" title={labels.duplicate}>
        <Copy className="size-3.5" />
      </button>
      {canDelete && (
        <button type="button" onClick={onDelete} className="text-muted-foreground hover:text-destructive" title={labels.delete}>
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  )
}

function SortableLayerRow(props: Parameters<typeof LayerRowContent>[0] & { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  return (
    <div ref={setNodeRef} style={style}>
      <LayerRowContent {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────

export function BoxShadowDemo({ locale }: { locale: Locale }) {
  const s = bs(locale)
  const [state, setState] = useState<State>(defaultState)
  const [history, setHistory] = useState<{ past: ShadowLayer[][]; future: ShadowLayer[][] }>({ past: [], future: [] })
  const [hintField, setHintField] = useState<FieldKey | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)
  const [format, setFormat] = useState<'css' | 'tailwind' | 'cssvar' | 'react'>('css')
  const [pasteText, setPasteText] = useState('')
  const [pasteError, setPasteError] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [compareA, setCompareA] = useState<ShadowLayer[] | null>(null)
  const dragRef = useRef<{ layerId: string; startX: number; startY: number; origX: number; origY: number } | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  // Hydrate from a share link or localStorage after mount only — matching
  // the server-rendered defaultState() on first paint avoids a hydration
  // mismatch (window isn't available during SSR).
  useEffect(() => {
    const loaded = loadFromUrl() ?? loadFromStorage()
    if (loaded && loaded.layers?.length) {
      setState((prev) => ({ ...prev, ...loaded, activeLayerId: loaded.layers[0]?.id ?? null }))
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const shared: SharedState = {
      mode: state.mode, unit: state.unit, colorFormat: state.colorFormat, layers: state.layers, shape: state.shape,
      box: state.box, canvasBg: state.canvasBg, canvasBgColor: state.canvasBgColor, canvasDark: state.canvasDark,
      contentText: state.contentText, fontSize: state.fontSize,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shared))
  }, [state.mode, state.unit, state.colorFormat, state.layers, state.shape, state.box, state.canvasBg, state.canvasBgColor, state.canvasDark, state.contentText, state.fontSize])

  function patch(p: Partial<State>) {
    setState((prev) => ({ ...prev, ...p }))
    setNote(null)
  }

  function snapshot() {
    setHistory((h) => ({ past: [...h.past, state.layers].slice(-50), future: [] }))
  }

  function undo() {
    if (history.past.length === 0) return
    const prev = history.past[history.past.length - 1]
    setHistory({ past: history.past.slice(0, -1), future: [state.layers, ...history.future].slice(0, 50) })
    setState((s2) => ({ ...s2, layers: prev, activeLayerId: prev.find((l) => l.id === s2.activeLayerId)?.id ?? prev[0]?.id ?? null }))
  }
  function redo() {
    if (history.future.length === 0) return
    const next = history.future[0]
    setHistory({ past: [...history.past, state.layers].slice(-50), future: history.future.slice(1) })
    setState((s2) => ({ ...s2, layers: next, activeLayerId: next.find((l) => l.id === s2.activeLayerId)?.id ?? next[0]?.id ?? null }))
  }

  const activeLayer = state.layers.find((l) => l.id === state.activeLayerId) ?? null

  function patchActiveLayer(p: Partial<ShadowLayer>) {
    if (!activeLayer) return
    patch({ layers: state.layers.map((l) => (l.id === activeLayer.id ? { ...l, ...p } : l)) })
  }

  function addLayer() {
    snapshot()
    const base = activeLayer ?? state.layers[state.layers.length - 1]
    const layer = makeLayer(base ? { x: base.x, y: base.y, blur: base.blur, spread: base.spread, color: base.color, alpha: base.alpha } : {})
    patch({ layers: [...state.layers, layer], activeLayerId: layer.id })
  }
  function duplicateLayer(id: string) {
    snapshot()
    const src = state.layers.find((l) => l.id === id)
    if (!src) return
    const copy = makeLayer({ ...src })
    const idx = state.layers.findIndex((l) => l.id === id)
    const next = [...state.layers]
    next.splice(idx + 1, 0, copy)
    patch({ layers: next, activeLayerId: copy.id })
  }
  function deleteLayer(id: string) {
    snapshot()
    const next = state.layers.filter((l) => l.id !== id)
    patch({ layers: next, activeLayerId: next[0]?.id ?? null, soloLayerId: state.soloLayerId === id ? null : state.soloLayerId })
  }
  function toggleVisible(id: string) {
    snapshot()
    patch({ layers: state.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)) })
  }
  function toggleSolo(id: string) {
    snapshot()
    patch({ soloLayerId: state.soloLayerId === id ? null : id })
  }
  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = state.layers.findIndex((l) => l.id === active.id)
    const newIndex = state.layers.findIndex((l) => l.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    snapshot()
    patch({ layers: arrayMove(state.layers, oldIndex, newIndex) })
  }

  function applyPreset(key: PresetKey, noteText: string) {
    snapshot()
    const layers = SHADOW_PRESETS[key].map((l) => makeLayer(l))
    patch({ layers, activeLayerId: layers[0]?.id ?? null, lightSourceOn: false })
    setNote(noteText)
  }

  function applySmoothShadow() {
    snapshot()
    const colorHex = activeLayer?.color ?? '#000000'
    const layers = smoothShadowLayers(state.lightElevation, colorHex).map((l) => makeLayer(l))
    patch({ layers, activeLayerId: layers[0]?.id ?? null })
    setNote(s.smoothShadowHint)
  }

  function toggleLightSource() {
    const on = !state.lightSourceOn
    if (on) {
      snapshot()
      const { x, y } = angleDistanceToOffset(state.lightAngle, state.lightDistance)
      const blur = Math.round(state.lightDistance * (state.lightElevation / 40))
      patch({ lightSourceOn: true, layers: state.layers.map((l) => ({ ...l, x, y, blur })) })
    } else {
      patch({ lightSourceOn: false })
    }
  }
  function updateLightSource(p: { angle?: number; distance?: number; elevation?: number }) {
    const angle = p.angle ?? state.lightAngle
    const distance = p.distance ?? state.lightDistance
    const elevation = p.elevation ?? state.lightElevation
    const { x, y } = angleDistanceToOffset(angle, distance)
    const blur = Math.round(distance * (elevation / 40))
    setState((prev) => ({
      ...prev,
      lightAngle: angle,
      lightDistance: distance,
      lightElevation: elevation,
      layers: prev.layers.map((l) => ({ ...l, x, y, blur })),
    }))
  }

  function doPasteImport() {
    const parsed = parseShadowInput(pasteText, state.mode === 'text' ? 'text' : 'box')
    if (!parsed) {
      setPasteError(true)
      return
    }
    snapshot()
    setPasteError(false)
    patch({ layers: parsed, activeLayerId: parsed[0]?.id ?? null, lightSourceOn: false })
    setPasteText('')
  }

  function onShapeChange(shape: Shape) {
    patch({ shape, box: { ...state.box, ...SHAPE_DEFAULTS[shape] } })
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

  // Solo overrides every layer's own visibility for CSS output + preview,
  // without touching the underlying `visible` flags the list still shows.
  const effectiveLayers = useMemo(
    () => (state.soloLayerId ? state.layers.map((l) => ({ ...l, visible: l.id === state.soloLayerId })) : state.layers),
    [state.layers, state.soloLayerId]
  )

  const singleLineValue = shadowValue(effectiveLayers, state.unit, state.colorFormat, state.mode, false)
  const prettyValue = shadowValue(effectiveLayers, state.unit, state.colorFormat, state.mode, true)

  const cssBlock = useMemo(() => {
    if (state.mode === 'text') return `.text {\n  text-shadow: ${prettyValue};\n}`
    if (state.mode === 'drop') return `.shape {\n  filter: ${prettyValue || 'none'};\n}`
    return `.box {\n  box-shadow: ${prettyValue};\n}`
  }, [state.mode, prettyValue])

  const tailwindSnippet = useMemo(() => {
    const cls = toTailwindArbitrary(singleLineValue)
    if (state.mode === 'text') return `class="[text-shadow:${cls}]"`
    if (state.mode === 'drop') return `class="[filter:${cls}]"`
    return `class="shadow-[${cls}]"`
  }, [state.mode, singleLineValue])

  const cssVarSnippet = useMemo(() => `--shadow: ${singleLineValue};`, [singleLineValue])

  const reactSnippet = useMemo(() => {
    const prop = state.mode === 'text' ? 'textShadow' : state.mode === 'drop' ? 'filter' : 'boxShadow'
    return `{ ${prop}: '${singleLineValue}' }`
  }, [state.mode, singleLineValue])

  const outputByFormat = { css: cssBlock, tailwind: tailwindSnippet, cssvar: cssVarSnippet, react: reactSnippet }

  const heavyLayerCount = effectiveLayers.filter((l) => l.visible && l.blur > 30).length
  const canvasStyle: React.CSSProperties =
    state.canvasBg === 'solid' ? { backgroundColor: state.canvasBgColor }
    : state.canvasBg === 'gradient' ? { backgroundImage: `linear-gradient(135deg, ${state.canvasBgColor}, transparent)`, backgroundColor: state.canvasDark ? '#0a0a0a' : '#fafafa' }
    : {}

  // Applies to whichever element is the shadow's target — the shape div,
  // the Star (image mode), or the text span. Shared so box-shadow mode
  // never silently no-ops on a non-div target the way it briefly did on
  // the Star before this was unified (box-shadow was only ever wired to
  // shapeStyle(), so switching to the image shape while in box-shadow mode
  // rendered no shadow at all).
  const activeShadowStyle: React.CSSProperties =
    state.mode === 'box' ? { boxShadow: prettyValue }
    : state.mode === 'drop' ? { filter: prettyValue || 'none' }
    : {}

  function shapeStyle(): React.CSSProperties {
    return {
      width: `${state.box.width}px`,
      height: `${state.box.height}px`,
      borderRadius: `${state.box.radius}px`,
      backgroundColor: state.shape === 'image' ? undefined : state.box.bg,
      ...activeShadowStyle,
    }
  }

  function onShapePointerDown(e: React.PointerEvent) {
    if (state.lightSourceOn || !activeLayer) return
    snapshot()
    dragRef.current = { layerId: activeLayer.id, startX: e.clientX, startY: e.clientY, origX: activeLayer.x, origY: activeLayer.y }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  function onShapePointerMove(e: React.PointerEvent) {
    const d = dragRef.current
    if (!d) return
    const dx = Math.round(e.clientX - d.startX)
    const dy = Math.round(e.clientY - d.startY)
    patch({ layers: state.layers.map((l) => (l.id === d.layerId ? { ...l, x: d.origX + dx, y: d.origY + dy } : l)) })
  }
  function onShapePointerUp() {
    dragRef.current = null
  }

  const fieldHintText: Record<FieldKey, string> = {
    offsetX: s.offsetXDesc, offsetY: s.offsetYDesc, blur: s.blurDesc, spread: s.spreadDesc, color: s.colorDesc, inset: s.insetDesc,
  }
  function hintProps(key: FieldKey) {
    return { onMouseEnter: () => setHintField(key), onMouseLeave: () => setHintField(null), onFocus: () => setHintField(key) }
  }

  const presetList: { key: PresetKey; label: string; note: string }[] = [
    { key: 'flat', label: s.presetFlat, note: s.presetFlatNote },
    { key: 'material1', label: s.presetMaterial1, note: s.presetMaterial1Note },
    { key: 'material3', label: s.presetMaterial3, note: s.presetMaterial3Note },
    { key: 'material5', label: s.presetMaterial5, note: s.presetMaterial5Note },
    { key: 'tailwindMd', label: s.presetTailwindMd, note: s.presetTailwindMdNote },
    { key: 'tailwindXl', label: s.presetTailwindXl, note: s.presetTailwindXlNote },
    { key: 'neumorphismRaised', label: s.presetNeumorphismRaised, note: s.presetNeumorphismRaisedNote },
    { key: 'neumorphismPressed', label: s.presetNeumorphismPressed, note: s.presetNeumorphismPressedNote },
    { key: 'glow', label: s.presetGlow, note: s.presetGlowNote },
    { key: 'longShadow', label: s.presetLongShadow, note: s.presetLongShadowNote },
    { key: 'retroHard', label: s.presetRetroHard, note: s.presetRetroHardNote },
    { key: 'pressedButton', label: s.presetPressedButton, note: s.presetPressedButtonNote },
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

      {/* Mode + toolbar */}
      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3">
        <SegmentedControl
          value={state.mode}
          onChange={(v) => patch({ mode: v, soloLayerId: null })}
          options={[{ value: 'box', label: s.modeBox }, { value: 'text', label: s.modeText }, { value: 'drop', label: s.modeDrop }]}
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
      {state.mode === 'drop' && <p className="mx-auto mt-2 max-w-xl text-center text-xs text-muted-foreground">{s.modeDropHint}</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)_24rem]">
        {/* ── Column 1: layers + light source + smooth shadow ────────── */}
        <div className="space-y-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
          <Section
            title={`${s.layers} (${state.layers.length})`}
            action={<button type="button" onClick={addLayer} className="flex items-center gap-1 text-primary hover:underline"><Plus className="size-3.5" /> {s.addLayer}</button>}
          >
            {state.layers.length === 0 ? (
              <p className="py-3 text-center text-xs text-muted-foreground">{s.reset}</p>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext items={state.layers.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                    {state.layers.map((l) => (
                      <SortableLayerRow
                        key={l.id}
                        id={l.id}
                        layer={l}
                        unit={state.unit}
                        active={l.id === state.activeLayerId}
                        onSelect={() => patch({ activeLayerId: l.id })}
                        onToggleVisible={() => toggleVisible(l.id)}
                        onToggleSolo={() => toggleSolo(l.id)}
                        isSolo={state.soloLayerId === l.id}
                        onDuplicate={() => duplicateLayer(l.id)}
                        onDelete={() => deleteLayer(l.id)}
                        canDelete={state.layers.length > 0}
                        labels={{
                          dragToReorder: s.dragToReorder,
                          solo: s.soloLayer,
                          unsolo: s.unsoloLayer,
                          hide: s.hideLayer,
                          show: s.showLayer,
                          duplicate: s.duplicateLayer,
                          delete: s.deleteLayer,
                        }}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </Section>

          {activeLayer && (
            <Section title={`${s.layer} ${state.layers.findIndex((l) => l.id === activeLayer.id) + 1}`}>
              {state.lightSourceOn && state.mode !== 'text' ? (
                <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{s.lightSourceLocked}</p>
              ) : (
                <div {...hintProps('offsetX')}>
                  <Slider label={s.offsetX} value={activeLayer.x} min={-100} max={100} suffix={state.unit} onDragStart={snapshot} onChange={(n) => patchActiveLayer({ x: n })} />
                </div>
              )}
              {!(state.lightSourceOn) && (
                <div {...hintProps('offsetY')}>
                  <Slider label={s.offsetY} value={activeLayer.y} min={-100} max={100} suffix={state.unit} onDragStart={snapshot} onChange={(n) => patchActiveLayer({ y: n })} />
                </div>
              )}
              <div {...hintProps('blur')}>
                <Slider label={s.blur} value={activeLayer.blur} min={0} max={150} suffix={state.unit} onDragStart={snapshot} onChange={(n) => patchActiveLayer({ blur: Math.max(0, n) })} />
              </div>
              {state.mode === 'box' && (
                <div {...hintProps('spread')}>
                  <Slider label={s.spread} value={activeLayer.spread} min={-60} max={60} suffix={state.unit} onDragStart={snapshot} onChange={(n) => patchActiveLayer({ spread: n })} />
                </div>
              )}
              <div {...hintProps('color')}>
                <ColorField
                  label={s.color}
                  opacityLabel={s.opacity}
                  eyedropperLabel={s.eyedropper}
                  hex={activeLayer.color}
                  alpha={activeLayer.alpha}
                  onDragStart={snapshot}
                  onHex={(h) => patchActiveLayer({ color: h })}
                  onAlpha={(a) => patchActiveLayer({ alpha: a })}
                />
              </div>
              {state.mode === 'box' && (
                <label className="flex items-center gap-2 text-xs" {...hintProps('inset')}>
                  <input type="checkbox" checked={activeLayer.inset} onChange={(e) => { snapshot(); patchActiveLayer({ inset: e.target.checked }) }} />
                  {s.inset}
                </label>
              )}
              {hintField && <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{fieldHintText[hintField]}</p>}
            </Section>
          )}

          <Section
            title={s.lightSource}
            action={
              <button type="button" onClick={toggleLightSource} className={cn('text-xs', state.lightSourceOn ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
                {state.lightSourceOn ? '✓ on' : 'off'}
              </button>
            }
          >
            <p className="text-xs text-muted-foreground">{s.lightSourceHint}</p>
            {state.lightSourceOn && (
              <>
                <Slider label={s.angle} value={state.lightAngle} min={0} max={359} suffix="°" onChange={(n) => updateLightSource({ angle: n })} />
                <Slider label={s.distance} value={state.lightDistance} min={0} max={80} suffix={state.unit} onChange={(n) => updateLightSource({ distance: n })} />
                <Slider label={s.elevation} value={state.lightElevation} min={1} max={40} onChange={(n) => updateLightSource({ elevation: n })} />
              </>
            )}
          </Section>

          <Section title={s.smoothShadow}>
            <p className="text-xs text-muted-foreground">{s.smoothShadowHint}</p>
            <Slider label={s.elevation} value={state.lightElevation} min={1} max={40} onChange={(n) => patch({ lightElevation: n })} />
            <Button size="sm" variant="outline" className="w-full" onClick={applySmoothShadow}>
              <Sparkles className="size-3.5" /> {s.apply}
            </Button>
          </Section>

          {state.mode !== 'drop' && (
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
          )}
        </div>

        {/* ── Column 2: canvas ───────────────────────────────────────── */}
        <div className="min-w-0 space-y-4">
          <div
            className={cn(
              'flex min-h-[26rem] items-center justify-center overflow-hidden rounded-xl border p-6',
              state.canvasBg === 'checker' && 'bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]',
              state.canvasDark && 'bg-neutral-950'
            )}
            style={canvasStyle}
          >
            <div style={{ transform: `scale(${state.zoom / 100})` }}>
              {state.mode === 'text' ? (
                <span
                  style={{
                    color: state.box.bg,
                    fontSize: `${state.fontSize}px`,
                    fontWeight: 700,
                    cursor: state.lightSourceOn ? 'default' : 'grab',
                    display: 'inline-block',
                    ...activeShadowStyle,
                  }}
                  onPointerDown={onShapePointerDown}
                  onPointerMove={onShapePointerMove}
                  onPointerUp={onShapePointerUp}
                >
                  {state.contentText}
                </span>
              ) : state.shape === 'image' ? (
                <Star
                  className="select-none"
                  style={{ width: state.box.width, height: state.box.height, cursor: state.lightSourceOn ? 'default' : 'grab', ...activeShadowStyle }}
                  fill={state.box.bg}
                  stroke="none"
                  onPointerDown={onShapePointerDown}
                  onPointerMove={onShapePointerMove}
                  onPointerUp={onShapePointerUp}
                />
              ) : (
                <div
                  style={{ ...shapeStyle(), cursor: state.lightSourceOn ? 'default' : 'grab' }}
                  onPointerDown={onShapePointerDown}
                  onPointerMove={onShapePointerMove}
                  onPointerUp={onShapePointerUp}
                />
              )}
            </div>
          </div>
          {!state.lightSourceOn && <p className="text-center text-xs text-muted-foreground">{s.dragHint}</p>}

          <Section title={s.canvas}>
            <div className="grid grid-cols-2 gap-3">
              <SegmentedControl value={state.unit} onChange={(v) => patch({ unit: v })} options={[{ value: 'px', label: 'px' }, { value: 'rem', label: 'rem' }, { value: 'em', label: 'em' }]} />
              <SegmentedControl value={state.colorFormat} onChange={(v) => patch({ colorFormat: v })} options={[{ value: 'hex8', label: s.hex8 }, { value: 'rgba', label: s.rgba }, { value: 'hsl', label: s.hsl }, { value: 'oklch', label: s.oklch }]} />
            </div>
            {state.mode !== 'text' && (
              <label className="block space-y-1">
                <span className="text-xs text-muted-foreground">{s.shape}</span>
                <select value={state.shape} onChange={(e) => onShapeChange(e.target.value as Shape)} className="w-full rounded-md border bg-background px-2 py-1 text-xs">
                  <option value="card">{s.shapeCard}</option>
                  <option value="button">{s.shapeButton}</option>
                  <option value="pill">{s.shapePill}</option>
                  <option value="circle">{s.shapeCircle}</option>
                  <option value="image">{s.shapeImage}</option>
                </select>
              </label>
            )}
            {state.mode === 'text' && (
              <>
                <label className="block space-y-1">
                  <span className="text-xs text-muted-foreground">{s.textContent}</span>
                  <input value={state.contentText} onChange={(e) => patch({ contentText: e.target.value })} className="w-full rounded-md border bg-background px-2 py-1 text-xs" />
                </label>
                <Slider label={s.fontSize} value={state.fontSize} min={16} max={120} suffix="px" onChange={(n) => patch({ fontSize: n })} />
              </>
            )}
            {state.shape !== 'image' && state.mode !== 'text' && (
              <>
                <Slider label={s.boxWidth} value={state.box.width} min={40} max={500} suffix="px" onChange={(n) => patch({ box: { ...state.box, width: n } })} />
                <Slider label={s.boxHeight} value={state.box.height} min={40} max={500} suffix="px" onChange={(n) => patch({ box: { ...state.box, height: n } })} />
                <Slider label={s.boxRadius} value={state.box.radius} min={0} max={999} suffix="px" onChange={(n) => patch({ box: { ...state.box, radius: n } })} />
              </>
            )}
            <label className="block space-y-1">
              <span className="text-xs text-muted-foreground">{s.boxBackground}</span>
              <input type="color" value={state.box.bg} onChange={(e) => patch({ box: { ...state.box, bg: e.target.value } })} className="h-7 w-full cursor-pointer rounded-md border bg-background" />
            </label>
            <SegmentedControl value={state.canvasBg} onChange={(v) => patch({ canvasBg: v })} options={[{ value: 'checker', label: s.canvasBgChecker }, { value: 'solid', label: s.canvasBgSolid }, { value: 'gradient', label: s.canvasBgGradient }]} />
            {state.canvasBg !== 'checker' && (
              <input type="color" value={state.canvasBgColor} onChange={(e) => patch({ canvasBgColor: e.target.value })} className="h-7 w-full cursor-pointer rounded-md border bg-background" />
            )}
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={state.canvasDark} onChange={(e) => patch({ canvasDark: e.target.checked })} />
              {s.canvasDark}
            </label>
            <Slider label={s.zoom} value={state.zoom} min={50} max={200} suffix="%" onChange={(n) => patch({ zoom: n })} />
          </Section>

          <Section
            title={s.compareMode}
            action={<button type="button" onClick={() => setCompareA(state.layers)} className="text-primary hover:underline">{s.saveAsA}</button>}
          >
            <p className="text-xs text-muted-foreground">{s.compareHint}</p>
            {compareA && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-24 w-24 items-center justify-center rounded-xl border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:14px_14px]">
                    <div style={{ width: 60, height: 40, borderRadius: 8, backgroundColor: state.box.bg, boxShadow: shadowValue(compareA, state.unit, state.colorFormat, 'box') }} />
                  </div>
                  <span className="text-xs text-muted-foreground">A</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-24 w-24 items-center justify-center rounded-xl border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:14px_14px]">
                    <div style={{ width: 60, height: 40, borderRadius: 8, backgroundColor: state.box.bg, boxShadow: shadowValue(state.layers, state.unit, state.colorFormat, 'box') }} />
                  </div>
                  <span className="text-xs text-muted-foreground">B</span>
                </div>
                <Button size="sm" variant="outline" className="col-span-2" onClick={() => { const a = compareA; setCompareA(state.layers); patch({ layers: a ?? state.layers }); }}>
                  {s.swapAB}
                </Button>
              </div>
            )}
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
            <p className="text-xs text-muted-foreground">{s.contrastNote}</p>
            {heavyLayerCount >= 3 && <p className="text-xs text-muted-foreground">{s.perfNote}</p>}
          </Section>
        </div>
      </div>
    </div>
  )
}
