'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, RotateCcw, ArrowRight, Lightbulb, Plus, Trash2, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider, Section, SegmentedControl } from '@/components/tools/tool-controls'
import { cn } from '@/lib/utils'
import { gs } from '@/lib/grid-i18n'
import type { Locale } from '@/lib/types'
import {
  makeTrack, makeItem, containerStyle, itemStyle, generateCss, generateTailwind, generateReact,
  deriveGridTemplateAreas, occupiedCells, GRID_PRESETS, GRID_ITEM_COLORS,
  type Container, type GridItem, type Track, type TrackMode, type PresetKey,
  type JustifyItems, type AlignItems, type ContentDistribution, type SelfAlign,
} from '@/lib/grid'

// ── Model ────────────────────────────────────────────────────────────────
// Items live in a real CSS Grid alongside "empty cell" markers — one grid,
// not two overlaid layers, since every cell is either covered by an item or
// isn't; no cell is ever both. Dragging across empty-cell markers previews
// and then creates a new item; existing items are click-to-select and
// edited with numeric line inputs, never drag-resized (same reasoning as
// the flexbox playground's no-drag-reorder: explicit inputs are simpler
// and no less honest about what's actually happening).

type Cell = { row: number; col: number }
type Drag = { anchor: Cell; current: Cell } | null

type State = {
  container: Container
  items: GridItem[]
  activeItemId: string | null
}

function defaultState(): State {
  const container: Container = {
    columns: [makeTrack({ mode: 'fr', fr: 1 }, 'col-1'), makeTrack({ mode: 'fr', fr: 1 }, 'col-2'), makeTrack({ mode: 'fr', fr: 1 }, 'col-3')],
    rows: [makeTrack({ mode: 'auto' }, 'row-1'), makeTrack({ mode: 'fr', fr: 1 }, 'row-2')],
    columnGap: 16, rowGap: 16, justifyItems: 'stretch', alignItems: 'stretch', justifyContent: 'start', alignContent: 'start',
  }
  const items = [
    makeItem({ name: 'header', colStart: 1, colEnd: 4, rowStart: 1, rowEnd: 2 }, 'default-1'),
    makeItem({ name: 'main', colStart: 1, colEnd: 3, rowStart: 2, rowEnd: 3 }, 'default-2'),
    makeItem({ name: 'aside', colStart: 3, colEnd: 4, rowStart: 2, rowEnd: 3 }, 'default-3'),
  ]
  return { container, items, activeItemId: items[0].id }
}

type SharedState = State
const STORAGE_KEY = 'grid-demo-state'

function encodeShareState(s: State): string {
  return encodeURIComponent(btoa(JSON.stringify({ container: s.container, items: s.items })))
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

const TRACK_MODE_OPTIONS: { value: TrackMode; labelKey: 'modeFr' | 'modePx' | 'modeAuto' | 'modeMinmax' }[] = [
  { value: 'fr', labelKey: 'modeFr' }, { value: 'px', labelKey: 'modePx' },
  { value: 'auto', labelKey: 'modeAuto' }, { value: 'minmax', labelKey: 'modeMinmax' },
]

export function GridDemo({ locale }: { locale: Locale }) {
  const s = gs(locale)
  const [state, setState] = useState<State>(defaultState)
  const [drag, setDrag] = useState<Drag>(null)
  const [note, setNote] = useState<string | null>(null)
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)
  const [format, setFormat] = useState<'css' | 'tailwind' | 'react'>('css')
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    const loaded = loadFromUrl() ?? loadFromStorage()
    if (loaded?.items?.length) setState((prev) => ({ ...prev, ...loaded, activeItemId: loaded.items[0]?.id ?? null }))
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ container: state.container, items: state.items }))
  }, [state])

  // Commit the drag on release anywhere in the window, not just over a
  // marker — a fast drag can outrun pointerenter events and end up outside
  // the last cell it visited.
  useEffect(() => {
    if (!drag) return
    function commit() {
      setState((prev) => {
        const rowMin = Math.min(drag!.anchor.row, drag!.current.row)
        const rowMax = Math.max(drag!.anchor.row, drag!.current.row)
        const colMin = Math.min(drag!.anchor.col, drag!.current.col)
        const colMax = Math.max(drag!.anchor.col, drag!.current.col)
        const matrix = occupiedCells(prev.container, prev.items)
        for (let r = rowMin; r <= rowMax; r++) {
          for (let c = colMin; c <= colMax; c++) {
            if (matrix[r][c]) {
              setNote(s.overlapNote)
              return prev
            }
          }
        }
        const item = makeItem({ name: `item-${prev.items.length + 1}`, colStart: colMin + 1, colEnd: colMax + 2, rowStart: rowMin + 1, rowEnd: rowMax + 2 })
        setNote(null)
        return { ...prev, items: [...prev.items, item], activeItemId: item.id }
      })
      setDrag(null)
    }
    window.addEventListener('pointerup', commit)
    return () => window.removeEventListener('pointerup', commit)
  }, [drag, s.overlapNote])

  function patch(p: Partial<State>) {
    setState((prev) => ({ ...prev, ...p }))
  }
  function patchContainer(p: Partial<Container>) {
    patch({ container: { ...state.container, ...p } })
  }
  const activeItem = state.items.find((it) => it.id === state.activeItemId) ?? null
  function patchActiveItem(p: Partial<GridItem>) {
    if (!activeItem) return
    patch({ items: state.items.map((it) => (it.id === activeItem.id ? { ...it, ...p } : it)) })
  }
  function deleteItem(id: string) {
    const next = state.items.filter((it) => it.id !== id)
    patch({ items: next, activeItemId: next[0]?.id ?? null })
  }

  function addTrack(axis: 'columns' | 'rows') {
    patchContainer({ [axis]: [...state.container[axis], makeTrack()] })
  }
  function removeTrack(axis: 'columns' | 'rows', id: string) {
    const tracks = state.container[axis]
    if (tracks.length <= 1) return
    patchContainer({ [axis]: tracks.filter((t) => t.id !== id) })
  }
  function patchTrack(axis: 'columns' | 'rows', id: string, p: Partial<Track>) {
    patchContainer({ [axis]: state.container[axis].map((t) => (t.id === id ? { ...t, ...p } : t)) })
  }

  function applyPreset(key: PresetKey, noteText: string) {
    const preset = GRID_PRESETS[key]
    const columns = preset.container.columns.map((t) => makeTrack(t))
    const rows = preset.container.rows.map((t) => makeTrack(t))
    const items = preset.items.map((it) => makeItem(it))
    patch({ container: { ...preset.container, columns, rows }, items, activeItemId: items[0]?.id ?? null })
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
    setDrag(null)
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY)
  }

  const cssBlock = useMemo(() => generateCss(state.container, state.items), [state.container, state.items])
  const tailwindBlock = useMemo(() => generateTailwind(state.container, state.items), [state.container, state.items])
  const reactBlock = useMemo(() => generateReact(state.container, state.items), [state.container, state.items])
  const outputByFormat = { css: cssBlock, tailwind: tailwindBlock, react: reactBlock }
  const areas = useMemo(() => deriveGridTemplateAreas(state.container, state.items), [state.container, state.items])
  const occupied = useMemo(() => occupiedCells(state.container, state.items), [state.container, state.items])

  const numRows = state.container.rows.length
  const numCols = state.container.columns.length

  function isInDragRect(row: number, col: number) {
    if (!drag) return false
    const rowMin = Math.min(drag.anchor.row, drag.current.row), rowMax = Math.max(drag.anchor.row, drag.current.row)
    const colMin = Math.min(drag.anchor.col, drag.current.col), colMax = Math.max(drag.anchor.col, drag.current.col)
    return row >= rowMin && row <= rowMax && col >= colMin && col <= colMax
  }

  const presetList: { key: PresetKey; label: string; note: string }[] = [
    { key: 'holyGrail', label: s.presetHolyGrail, note: s.presetHolyGrailNote },
    { key: 'twelveColumn', label: s.presetTwelveColumn, note: s.presetTwelveColumnNote },
    { key: 'dashboard', label: s.presetDashboard, note: s.presetDashboardNote },
    { key: 'namedAreas', label: s.presetNamedAreas, note: s.presetNamedAreasNote },
    { key: 'photoGrid', label: s.presetPhotoGrid, note: s.presetPhotoGridNote },
  ]

  function renderTrackList(axis: 'columns' | 'rows', label: string) {
    const tracks = state.container[axis]
    return (
      <Section title={label} action={<button type="button" onClick={() => addTrack(axis)} className="flex items-center gap-1 text-primary hover:underline"><Plus className="size-3.5" /> {s.addTrack}</button>}>
        {tracks.map((t, i) => (
          <div key={t.id} className="space-y-1.5 rounded-md border p-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-muted-foreground">{s.track} {i + 1}</span>
              {tracks.length > 1 && (
                <button type="button" onClick={() => removeTrack(axis, t.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
              )}
            </div>
            <SegmentedControl
              value={t.mode}
              onChange={(v: TrackMode) => patchTrack(axis, t.id, { mode: v })}
              options={TRACK_MODE_OPTIONS.map((o) => ({ value: o.value, label: s[o.labelKey] }))}
            />
            {t.mode === 'fr' && <Slider label="fr" value={t.fr} min={1} max={6} onChange={(n) => patchTrack(axis, t.id, { fr: n })} />}
            {t.mode === 'px' && <Slider label="px" value={t.px} min={20} max={400} suffix="px" onChange={(n) => patchTrack(axis, t.id, { px: n })} />}
            {t.mode === 'minmax' && (
              <>
                <Slider label="min" value={t.minmaxMinPx} min={20} max={400} suffix="px" onChange={(n) => patchTrack(axis, t.id, { minmaxMinPx: n })} />
                <Slider label="max" value={t.minmaxMaxFr} min={1} max={6} suffix="fr" onChange={(n) => patchTrack(axis, t.id, { minmaxMaxFr: n })} />
              </>
            )}
          </div>
        ))}
        <p className="text-xs text-muted-foreground">{s.tracksDesc}</p>
      </Section>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[110rem] px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/css/display-visibility' : '/css/display-visibility'}>
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

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)_24rem]">
        {/* ── Column 1: tracks + alignment ─────────────────────────────── */}
        <div className="space-y-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
          {renderTrackList('columns', s.columns)}
          {renderTrackList('rows', s.rows)}

          <Section title={s.gap}>
            <Slider label={s.columnGap} value={state.container.columnGap} min={0} max={60} suffix="px" onChange={(n) => patchContainer({ columnGap: n })} />
            <Slider label={s.rowGap} value={state.container.rowGap} min={0} max={60} suffix="px" onChange={(n) => patchContainer({ rowGap: n })} />
          </Section>

          <Section title={s.justifyItems}>
            <SegmentedControl
              value={state.container.justifyItems}
              onChange={(v: JustifyItems) => patchContainer({ justifyItems: v })}
              options={[{ value: 'stretch', label: s.stretch }, { value: 'start', label: s.start }, { value: 'end', label: s.end }, { value: 'center', label: s.center }]}
            />
            <p className="text-xs text-muted-foreground">{s.justifyItemsDesc}</p>
          </Section>
          <Section title={s.alignItems}>
            <SegmentedControl
              value={state.container.alignItems}
              onChange={(v: AlignItems) => patchContainer({ alignItems: v })}
              options={[{ value: 'stretch', label: s.stretch }, { value: 'start', label: s.start }, { value: 'end', label: s.end }, { value: 'center', label: s.center }]}
            />
            <p className="text-xs text-muted-foreground">{s.alignItemsDesc}</p>
          </Section>
          <Section title={s.justifyContent}>
            <SegmentedControl
              value={state.container.justifyContent}
              onChange={(v: ContentDistribution) => patchContainer({ justifyContent: v })}
              options={[
                { value: 'start', label: s.start }, { value: 'end', label: s.end }, { value: 'center', label: s.center }, { value: 'stretch', label: s.stretch },
                { value: 'space-between', label: s.spaceBetween }, { value: 'space-around', label: s.spaceAround }, { value: 'space-evenly', label: s.spaceEvenly },
              ]}
            />
            <p className="text-xs text-muted-foreground">{s.justifyContentDesc}</p>
          </Section>
          <Section title={s.alignContent}>
            <SegmentedControl
              value={state.container.alignContent}
              onChange={(v: ContentDistribution) => patchContainer({ alignContent: v })}
              options={[
                { value: 'start', label: s.start }, { value: 'end', label: s.end }, { value: 'center', label: s.center }, { value: 'stretch', label: s.stretch },
                { value: 'space-between', label: s.spaceBetween }, { value: 'space-around', label: s.spaceAround }, { value: 'space-evenly', label: s.spaceEvenly },
              ]}
            />
            <p className="text-xs text-muted-foreground">{s.alignContentDesc}</p>
          </Section>
        </div>

        {/* ── Column 2: canvas + items ─────────────────────────────────── */}
        <div className="min-w-0 space-y-4">
          <div>
            <p className="mb-2 text-center text-xs text-muted-foreground">{s.dragHint}</p>
            <div className="select-none overflow-auto rounded-xl border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-4">
              <div style={containerStyle(state.container)} className="min-h-[16rem] rounded-lg border-2 border-dashed border-foreground/20 bg-background/60 p-2">
                {state.items.map((it, i) => (
                  <div
                    key={it.id}
                    onPointerDown={() => patch({ activeItemId: it.id })}
                    style={{ ...itemStyle(it), backgroundColor: GRID_ITEM_COLORS[i % GRID_ITEM_COLORS.length] }}
                    className={cn(
                      'flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-md px-2 text-center text-xs font-semibold text-white/95 shadow-sm',
                      it.id === state.activeItemId && 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                    )}
                  >
                    {it.name}
                  </div>
                ))}
                {Array.from({ length: numRows }).map((_, row) =>
                  Array.from({ length: numCols }).map((_, col) => {
                    if (occupied[row][col]) return null
                    return (
                      <div
                        key={`${row}-${col}`}
                        onPointerDown={() => setDrag({ anchor: { row, col }, current: { row, col } })}
                        onPointerEnter={() => drag && setDrag((d) => (d ? { ...d, current: { row, col } } : d))}
                        style={{ gridColumn: `${col + 1} / ${col + 2}`, gridRow: `${row + 1} / ${row + 2}` }}
                        className={cn(
                          'min-h-10 min-w-10 cursor-crosshair rounded-md border border-dashed border-foreground/15 bg-foreground/[0.03] transition-colors hover:bg-foreground/10',
                          isInDragRect(row, col) && 'border-primary bg-primary/20'
                        )}
                      />
                    )
                  })
                )}
              </div>
            </div>
          </div>

          <Section
            title={`${s.items} (${state.items.length})`}
          >
            {state.items.length === 0 && <p className="text-xs text-muted-foreground">{s.noItemsNote}</p>}
            {state.items.length > 0 && (
              <div className="overflow-hidden rounded-lg border">
                {state.items.map((it, i) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => patch({ activeItemId: it.id })}
                    className={cn('flex w-full items-center gap-2 border-b px-2 py-1.5 text-left last:border-0', it.id === state.activeItemId && 'bg-muted/60')}
                  >
                    <span className="size-3 shrink-0 rounded-sm" style={{ backgroundColor: GRID_ITEM_COLORS[i % GRID_ITEM_COLORS.length] }} />
                    <span className="flex-1 truncate font-mono text-[11px] text-muted-foreground">
                      {it.name} — col {it.colStart}/{it.colEnd}, row {it.rowStart}/{it.rowEnd}
                    </span>
                    <span onClick={(e) => { e.stopPropagation(); deleteItem(it.id) }} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </Section>

          {activeItem && (
            <Section title={`${s.item}: ${activeItem.name}`}>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.itemName}</span>
                <input
                  type="text"
                  value={activeItem.name}
                  onChange={(e) => patchActiveItem({ name: e.target.value })}
                  className="w-full rounded-md border bg-background px-2 py-1 text-sm"
                />
              </label>
              <p className="text-xs text-muted-foreground">{s.itemPlacement}</p>
              <div className="grid grid-cols-2 gap-x-3">
                <Slider label={s.colStart} value={activeItem.colStart} min={1} max={numCols} onChange={(n) => patchActiveItem({ colStart: n, colEnd: Math.max(activeItem.colEnd, n + 1) })} />
                <Slider label={s.colEnd} value={activeItem.colEnd} min={2} max={numCols + 1} onChange={(n) => patchActiveItem({ colEnd: n, colStart: Math.min(activeItem.colStart, n - 1) })} />
                <Slider label={s.rowStart} value={activeItem.rowStart} min={1} max={numRows} onChange={(n) => patchActiveItem({ rowStart: n, rowEnd: Math.max(activeItem.rowEnd, n + 1) })} />
                <Slider label={s.rowEnd} value={activeItem.rowEnd} min={2} max={numRows + 1} onChange={(n) => patchActiveItem({ rowEnd: n, rowStart: Math.min(activeItem.rowStart, n - 1) })} />
              </div>
              <div>
                <span className="mb-1 block text-xs text-muted-foreground">{s.justifySelf}</span>
                <SegmentedControl
                  value={activeItem.justifySelf}
                  onChange={(v: SelfAlign) => patchActiveItem({ justifySelf: v })}
                  options={[{ value: 'auto', label: s.auto }, { value: 'stretch', label: s.stretch }, { value: 'start', label: s.start }, { value: 'end', label: s.end }, { value: 'center', label: s.center }]}
                />
              </div>
              <div>
                <span className="mb-1 block text-xs text-muted-foreground">{s.alignSelf}</span>
                <SegmentedControl
                  value={activeItem.alignSelf}
                  onChange={(v: SelfAlign) => patchActiveItem({ alignSelf: v })}
                  options={[{ value: 'auto', label: s.auto }, { value: 'stretch', label: s.stretch }, { value: 'start', label: s.start }, { value: 'end', label: s.end }, { value: 'center', label: s.center }]}
                />
              </div>
            </Section>
          )}
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

          <Section title={s.areas}>
            {areas.ok ? (
              <pre className="max-h-48 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed"><code>{areas.css}</code></pre>
            ) : (
              <p className="text-xs text-muted-foreground">{areas.reason === 'duplicate-name' ? s.areasDuplicate : s.areasOverlap}</p>
            )}
          </Section>

          <Section title={s.generatedCss}>
            <SegmentedControl
              value={format}
              onChange={setFormat}
              options={[{ value: 'css', label: s.formatCss }, { value: 'tailwind', label: s.formatTailwind }, { value: 'react', label: s.formatReact }]}
            />
            <pre className="max-h-72 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
              <code>{outputByFormat[format]}</code>
            </pre>
            <Button size="sm" variant="outline" className="w-full" onClick={() => copyFormat(outputByFormat[format], format)}>
              {copiedFormat === format ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copiedFormat === format ? s.copied : s.copy}
            </Button>
          </Section>
        </div>
      </div>
    </div>
  )
}
