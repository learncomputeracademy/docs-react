'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, RotateCcw, ArrowRight, Lightbulb, Link2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider, Section, SegmentedControl } from '@/components/tools/tool-controls'
import { cn } from '@/lib/utils'
import { ss } from '@/lib/scrollbar-i18n'
import type { Locale } from '@/lib/types'
import {
  defaultScrollbarState, cssVarStyle, generateCss, generateReact, PREVIEW_STYLESHEET,
  SCROLLBAR_PRESETS, type ScrollbarState, type ScrollbarWidthKeyword, type Axis, type PresetKey,
} from '@/lib/scrollbar'

// ── Model ────────────────────────────────────────────────────────────────
// No custom uid() anywhere — this tool has no list of items, just one
// settings object, so the hydration-determinism gotcha from D-47 doesn't
// apply here. Kept in mind anyway for the next tool that does need one.

type FieldKey = 'scrollbarWidth' | 'size' | 'track' | 'thumb' | 'corner' | 'buttons'

type State = ScrollbarState & {
  axis: Axis
  canvasWidth: number
  canvasHeight: number
  canvasDark: boolean
}

function defaultState(): State {
  return { ...defaultScrollbarState(), axis: 'vertical', canvasWidth: 420, canvasHeight: 280, canvasDark: false }
}

type SharedState = State
const STORAGE_KEY = 'scrollbar-demo-state'

function encodeShareState(s: State): string {
  return encodeURIComponent(btoa(JSON.stringify(s)))
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

function PreviewContent({ axis }: { axis: Axis }) {
  if (axis === 'horizontal') {
    return (
      <div className="flex gap-3 p-4" style={{ width: 'max-content' }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="flex h-24 w-40 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-sm font-medium text-muted-foreground">
            Card {i + 1}
          </div>
        ))}
      </div>
    )
  }
  if (axis === 'both') {
    return (
      <div className="grid grid-cols-6 gap-3 p-4" style={{ width: '1100px' }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="flex h-20 items-center justify-center rounded-lg border bg-muted/40 text-xs font-medium text-muted-foreground">
            {i + 1}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 24 }).map((_, i) => (
        <p key={i} className="text-sm text-muted-foreground">
          Line {i + 1} — scroll this box to see the styled scrollbar respond in real time, rendered by the browser itself.
        </p>
      ))}
    </div>
  )
}

export function ScrollbarDemo({ locale }: { locale: Locale }) {
  const s = ss(locale)
  const [state, setState] = useState<State>(defaultState)
  const [hintField, setHintField] = useState<FieldKey | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)
  const [format, setFormat] = useState<'css' | 'react'>('css')
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    const loaded = loadFromUrl() ?? loadFromStorage()
    if (loaded) setState((prev) => ({ ...prev, ...loaded }))
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function patch(p: Partial<State>) {
    setState((prev) => ({ ...prev, ...p }))
    setNote(null)
  }

  function applyPreset(key: PresetKey, noteText: string) {
    patch(SCROLLBAR_PRESETS[key])
    setNote(noteText)
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
    setNote(null)
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY)
  }

  const cssBlock = useMemo(() => generateCss(state), [state])
  const reactBlock = useMemo(() => generateReact(state), [state])
  const outputByFormat = { css: cssBlock, react: reactBlock }

  function hintProps(key: FieldKey) {
    return { onMouseEnter: () => setHintField(key), onMouseLeave: () => setHintField(null), onFocus: () => setHintField(key) }
  }
  const fieldHintText: Record<FieldKey, string> = {
    scrollbarWidth: s.scrollbarWidthDesc, size: s.sizeDesc, track: s.trackDesc,
    thumb: s.thumbDesc, corner: s.cornerDesc, buttons: s.buttonsDesc,
  }

  const overflowStyle: React.CSSProperties =
    state.axis === 'vertical' ? { overflowY: 'auto', overflowX: 'hidden' }
    : state.axis === 'horizontal' ? { overflowX: 'auto', overflowY: 'hidden' }
    : { overflow: 'auto' }

  const presetList: { key: PresetKey; label: string; note: string }[] = [
    { key: 'minimal', label: s.presetMinimal, note: s.presetMinimalNote },
    { key: 'chunky', label: s.presetChunky, note: s.presetChunkyNote },
    { key: 'neon', label: s.presetNeon, note: s.presetNeonNote },
    { key: 'hoverReveal', label: s.presetHoverReveal, note: s.presetHoverRevealNote },
    { key: 'hidden', label: s.presetHidden, note: s.presetHiddenNote },
  ]

  return (
    <div className="mx-auto w-full max-w-[110rem] px-4 py-8 sm:px-6">
      <style>{PREVIEW_STYLESHEET}</style>

      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/css/pseudo-elements' : '/css/pseudo-elements'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2">
        <Button size="sm" variant="outline" onClick={reset}><RotateCcw className="size-3.5" /> {s.reset}</Button>
        <Button size="sm" variant="outline" onClick={copyShareLink}>
          <Link2 className="size-3.5" /> {linkCopied ? s.shareLinkCopied : s.copyShareLink}
        </Button>
      </div>

      <div className="mx-auto mt-6 flex max-w-3xl items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <p className="font-semibold">{s.supportNoteTitle}</p>
          <p className="mt-1 text-muted-foreground">{s.supportNote}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)_24rem]">
        {/* ── Column 1: controls ──────────────────────────────────────── */}
        <div className="space-y-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
          <Section title={s.standardSection}>
            <div {...hintProps('scrollbarWidth')}>
              <span className="mb-1 block text-xs text-muted-foreground">{s.scrollbarWidth}</span>
              <SegmentedControl
                value={state.scrollbarWidth}
                onChange={(v: ScrollbarWidthKeyword) => patch({ scrollbarWidth: v })}
                options={[{ value: 'auto', label: s.widthAuto }, { value: 'thin', label: s.widthThin }, { value: 'none', label: s.widthNone }]}
              />
              {hintField === 'scrollbarWidth' && <p className="mt-1.5 rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{fieldHintText.scrollbarWidth}</p>}
            </div>
          </Section>

          <Section title={s.webkitSection}>
            <div {...hintProps('size')}>
              <Slider label={s.size} value={state.webkitSize} min={0} max={30} suffix="px" onChange={(n) => patch({ webkitSize: n })} />
            </div>
            {hintField === 'size' && <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{fieldHintText.size}</p>}
          </Section>

          <Section title={s.track}>
            <div className="space-y-2.5" {...hintProps('track')}>
              <label className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">{s.trackColor}</span>
                <input type="color" value={state.trackColor} onChange={(e) => patch({ trackColor: e.target.value })} className="h-7 w-16 cursor-pointer rounded-md border bg-background" />
              </label>
              <Slider label={s.trackRadius} value={state.trackRadius} min={0} max={30} suffix="px" onChange={(n) => patch({ trackRadius: n })} />
              <Slider label={s.trackBorderWidth} value={state.trackBorderWidth} min={0} max={6} suffix="px" onChange={(n) => patch({ trackBorderWidth: n })} />
              {state.trackBorderWidth > 0 && (
                <label className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground">{s.trackBorderColor}</span>
                  <input type="color" value={state.trackBorderColor} onChange={(e) => patch({ trackBorderColor: e.target.value })} className="h-7 w-16 cursor-pointer rounded-md border bg-background" />
                </label>
              )}
            </div>
            {hintField === 'track' && <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{fieldHintText.track}</p>}
          </Section>

          <Section title={s.thumb}>
            <div className="space-y-2.5" {...hintProps('thumb')}>
              <label className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">{s.thumbColor}</span>
                <input type="color" value={state.thumbColor} onChange={(e) => patch({ thumbColor: e.target.value })} className="h-7 w-16 cursor-pointer rounded-md border bg-background" />
              </label>
              <label className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">{s.thumbHoverColor}</span>
                <input type="color" value={state.thumbHoverColor} onChange={(e) => patch({ thumbHoverColor: e.target.value })} className="h-7 w-16 cursor-pointer rounded-md border bg-background" />
              </label>
              <Slider label={s.thumbRadius} value={state.thumbRadius} min={0} max={30} suffix="px" onChange={(n) => patch({ thumbRadius: n })} />
              <Slider label={s.thumbBorderWidth} value={state.thumbBorderWidth} min={0} max={6} suffix="px" onChange={(n) => patch({ thumbBorderWidth: n })} />
              {state.thumbBorderWidth > 0 && (
                <label className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground">{s.thumbBorderColor}</span>
                  <input type="color" value={state.thumbBorderColor} onChange={(e) => patch({ thumbBorderColor: e.target.value })} className="h-7 w-16 cursor-pointer rounded-md border bg-background" />
                </label>
              )}
            </div>
            {hintField === 'thumb' && <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{fieldHintText.thumb}</p>}
          </Section>

          <Section title={s.corner}>
            <div {...hintProps('corner')}>
              <label className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">{s.cornerColor}</span>
                <input type="color" value={state.cornerColor} onChange={(e) => patch({ cornerColor: e.target.value })} className="h-7 w-16 cursor-pointer rounded-md border bg-background" />
              </label>
            </div>
            {hintField === 'corner' && <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{fieldHintText.corner}</p>}
          </Section>

          <Section title={s.buttons}>
            <div className="space-y-2.5" {...hintProps('buttons')}>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={state.showButtons} onChange={(e) => patch({ showButtons: e.target.checked })} />
                {s.showButtons}
              </label>
              {state.showButtons && (
                <label className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground">{s.buttonColor}</span>
                  <input type="color" value={state.buttonColor} onChange={(e) => patch({ buttonColor: e.target.value })} className="h-7 w-16 cursor-pointer rounded-md border bg-background" />
                </label>
              )}
            </div>
            {hintField === 'buttons' && <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{fieldHintText.buttons}</p>}
          </Section>
        </div>

        {/* ── Column 2: live preview ──────────────────────────────────── */}
        <div className="min-w-0 space-y-4">
          <div className={cn('flex items-center justify-center rounded-xl border p-6', state.canvasDark && 'bg-neutral-950')}>
            <div
              className="sb-demo rounded-lg border bg-background"
              style={{ ...cssVarStyle(state), ...overflowStyle, width: state.canvasWidth, height: state.canvasHeight }}
            >
              <PreviewContent axis={state.axis} />
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">{s.scrollHint}</p>

          <Section title={s.canvas}>
            <span className="mb-1 block text-xs text-muted-foreground">{s.axis}</span>
            <SegmentedControl
              value={state.axis}
              onChange={(v: Axis) => patch({ axis: v })}
              options={[{ value: 'vertical', label: s.axisVertical }, { value: 'horizontal', label: s.axisHorizontal }, { value: 'both', label: s.axisBoth }]}
            />
            <Slider label={s.canvasWidth} value={state.canvasWidth} min={200} max={800} suffix="px" onChange={(n) => patch({ canvasWidth: n })} />
            <Slider label={s.canvasHeight} value={state.canvasHeight} min={120} max={500} suffix="px" onChange={(n) => patch({ canvasHeight: n })} />
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={state.canvasDark} onChange={(e) => patch({ canvasDark: e.target.checked })} />
              {s.canvasDark}
            </label>
          </Section>
        </div>

        {/* ── Column 3: presets + output ──────────────────────────────── */}
        <div className="space-y-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <Section title={s.presets}>
            <div className="grid grid-cols-1 gap-1.5">
              {presetList.map((p) => (
                <Button key={p.key} size="sm" variant="outline" className="h-auto justify-start py-1.5 text-xs" onClick={() => applyPreset(p.key, p.note)}>
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
            <SegmentedControl value={format} onChange={setFormat} options={[{ value: 'css', label: s.formatCss }, { value: 'react', label: s.formatReact }]} />
            <p className="text-xs text-muted-foreground">{s.noTailwindNote}</p>
            <pre className="max-h-72 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
              <code>{outputByFormat[format]}</code>
            </pre>
            <Button size="sm" variant="outline" className="w-full" onClick={() => copyFormat(outputByFormat[format], format)}>
              {copiedFormat === format ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copiedFormat === format ? s.copied : s.copy}
            </Button>
          </Section>

          <Section title={s.hoverHint}>
            <p className="text-xs text-muted-foreground">{s.buttonsDesc}</p>
          </Section>
        </div>
      </div>
    </div>
  )
}
