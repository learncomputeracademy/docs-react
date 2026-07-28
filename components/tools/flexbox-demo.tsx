'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, RotateCcw, ArrowRight, Lightbulb, Plus, Trash2, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider, Section, SegmentedControl } from '@/components/tools/tool-controls'
import { cn } from '@/lib/utils'
import { fs } from '@/lib/flexbox-i18n'
import type { Locale } from '@/lib/types'
import {
  makeItem, containerStyle, itemStyle, generateCss, generateTailwind, generateReact,
  ITEM_COLORS, FLEX_PRESETS, type Container, type FlexItem, type Direction, type Wrap,
  type Justify, type AlignItems, type AlignContent, type AlignSelf, type PresetKey,
} from '@/lib/flexbox'

// ── Model ────────────────────────────────────────────────────────────────
// Item array order is the fixed HTML/DOM order and never changes — the
// number badge on each item is that array index, always. Only `order`
// (an editable per-item property, like any other) moves the item visually.
// Deliberately no drag-to-reorder: dragging would imply direct positional
// control, but that's exactly the thing `order` is NOT — the whole
// teaching point is that visual position and source order can diverge.

type FieldKey = 'direction' | 'wrap' | 'justify' | 'alignItems' | 'alignContent' | 'gap' | 'grow' | 'shrink' | 'basis' | 'order' | 'alignSelf'

type State = {
  container: Container
  items: FlexItem[]
  activeItemId: string | null
  canvasWidth: number
  canvasHeight: number
}

function defaultState(): State {
  const items = [
    makeItem({ grow: 1 }),
    makeItem({ grow: 1 }),
    makeItem({ grow: 1 }),
  ]
  return {
    container: { direction: 'row', wrap: 'nowrap', justify: 'space-between', alignItems: 'stretch', alignContent: 'stretch', gap: 12 },
    items,
    activeItemId: items[0].id,
    canvasWidth: 560,
    canvasHeight: 260,
  }
}

type SharedState = Pick<State, 'container' | 'items' | 'canvasWidth' | 'canvasHeight'>
const STORAGE_KEY = 'flexbox-demo-state'

function toShared(s: State): SharedState {
  return { container: s.container, items: s.items, canvasWidth: s.canvasWidth, canvasHeight: s.canvasHeight }
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

export function FlexboxDemo({ locale }: { locale: Locale }) {
  const s = fs(locale)
  const [state, setState] = useState<State>(defaultState)
  const [hintField, setHintField] = useState<FieldKey | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)
  const [format, setFormat] = useState<'css' | 'tailwind' | 'react'>('css')
  const [linkCopied, setLinkCopied] = useState(false)
  const [measured, setMeasured] = useState<Record<string, { w: number; h: number }>>({})
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const roRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    const loaded = loadFromUrl() ?? loadFromStorage()
    if (loaded?.items?.length) {
      setState((prev) => ({ ...prev, ...loaded, activeItemId: loaded.items[0]?.id ?? null }))
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toShared(state)))
  }, [state])

  // One ResizeObserver instance watches every item element — real measured
  // size, never computed from the flex values (which could drift from
  // what's actually rendered, same reasoning as every other tool here).
  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      setMeasured((prev) => {
        const next = { ...prev }
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.itemId
          if (id) next[id] = { w: Math.round(entry.contentRect.width), h: Math.round(entry.contentRect.height) }
        }
        return next
      })
    })
    roRef.current = ro
    itemRefs.current.forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [state.items.length, state.container, state.canvasWidth, state.canvasHeight])

  function setItemRef(id: string, el: HTMLDivElement | null) {
    if (el) {
      itemRefs.current.set(id, el)
      roRef.current?.observe(el)
    } else {
      itemRefs.current.delete(id)
    }
  }

  function patch(p: Partial<State>) {
    setState((prev) => ({ ...prev, ...p }))
    setNote(null)
  }
  function patchContainer(p: Partial<Container>) {
    patch({ container: { ...state.container, ...p } })
  }
  const activeItem = state.items.find((it) => it.id === state.activeItemId) ?? null
  function patchActiveItem(p: Partial<FlexItem>) {
    if (!activeItem) return
    patch({ items: state.items.map((it) => (it.id === activeItem.id ? { ...it, ...p } : it)) })
  }
  function addItem() {
    const item = makeItem()
    patch({ items: [...state.items, item], activeItemId: item.id })
  }
  function deleteItem(id: string) {
    if (state.items.length <= 1) return
    const next = state.items.filter((it) => it.id !== id)
    patch({ items: next, activeItemId: next[0]?.id ?? null })
  }

  function applyPreset(key: PresetKey, noteText: string) {
    const preset = FLEX_PRESETS[key]
    const items = preset.items.map((it) => makeItem(it))
    patch({ container: preset.container, items, activeItemId: items[0]?.id ?? null })
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

  const cssBlock = useMemo(() => generateCss(state.container, state.items), [state.container, state.items])
  const tailwindBlock = useMemo(() => generateTailwind(state.container, state.items), [state.container, state.items])
  const reactBlock = useMemo(() => generateReact(state.container, state.items), [state.container, state.items])
  const outputByFormat = { css: cssBlock, tailwind: tailwindBlock, react: reactBlock }

  function hintProps(key: FieldKey) {
    return { onMouseEnter: () => setHintField(key), onMouseLeave: () => setHintField(null), onFocus: () => setHintField(key) }
  }
  const fieldHintText: Record<FieldKey, string> = {
    direction: s.directionDesc, wrap: s.wrapDesc, justify: s.justifyDesc, alignItems: s.alignItemsDesc,
    alignContent: s.alignContentDesc, gap: s.gapDesc, grow: s.growDesc, shrink: s.shrinkDesc,
    basis: s.basisDesc, order: s.orderDesc, alignSelf: s.alignSelfDesc,
  }

  const presetList: { key: PresetKey; label: string; note: string }[] = [
    { key: 'navbar', label: s.presetNavbar, note: s.presetNavbarNote },
    { key: 'sidebar', label: s.presetSidebar, note: s.presetSidebarNote },
    { key: 'centered', label: s.presetCentered, note: s.presetCenteredNote },
    { key: 'equalColumns', label: s.presetEqualColumns, note: s.presetEqualColumnsNote },
    { key: 'wrapReorder', label: s.presetWrapReorder, note: s.presetWrapReorderNote },
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
        <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground">{s.noLessonNote}</p>
      </header>

      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2">
        <Button size="sm" variant="outline" onClick={reset}><RotateCcw className="size-3.5" /> {s.reset}</Button>
        <Button size="sm" variant="outline" onClick={copyShareLink}>
          <Link2 className="size-3.5" /> {linkCopied ? s.shareLinkCopied : s.copyShareLink}
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)_24rem]">
        {/* ── Column 1: container + items ─────────────────────────────── */}
        <div className="space-y-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
          <Section title={s.container}>
            <div {...hintProps('direction')}>
              <span className="mb-1 block text-xs text-muted-foreground">{s.direction}</span>
              <SegmentedControl
                value={state.container.direction}
                onChange={(v: Direction) => patchContainer({ direction: v })}
                options={[
                  { value: 'row', label: s.directionRow }, { value: 'row-reverse', label: s.directionRowReverse },
                  { value: 'column', label: s.directionColumn }, { value: 'column-reverse', label: s.directionColumnReverse },
                ]}
              />
            </div>
            <div {...hintProps('wrap')}>
              <span className="mb-1 block text-xs text-muted-foreground">{s.wrap}</span>
              <SegmentedControl
                value={state.container.wrap}
                onChange={(v: Wrap) => patchContainer({ wrap: v })}
                options={[{ value: 'nowrap', label: s.wrapNowrap }, { value: 'wrap', label: s.wrapWrap }, { value: 'wrap-reverse', label: s.wrapReverse }]}
              />
            </div>
            <div {...hintProps('justify')}>
              <span className="mb-1 block text-xs text-muted-foreground">{s.justify}</span>
              <SegmentedControl
                value={state.container.justify}
                onChange={(v: Justify) => patchContainer({ justify: v })}
                options={[
                  { value: 'flex-start', label: s.justifyStart }, { value: 'flex-end', label: s.justifyEnd }, { value: 'center', label: s.justifyCenter },
                  { value: 'space-between', label: s.justifyBetween }, { value: 'space-around', label: s.justifyAround }, { value: 'space-evenly', label: s.justifyEvenly },
                ]}
              />
            </div>
            <div {...hintProps('alignItems')}>
              <span className="mb-1 block text-xs text-muted-foreground">{s.alignItems}</span>
              <SegmentedControl
                value={state.container.alignItems}
                onChange={(v: AlignItems) => patchContainer({ alignItems: v })}
                options={[
                  { value: 'stretch', label: s.alignStretch }, { value: 'flex-start', label: s.alignStart }, { value: 'flex-end', label: s.alignEnd },
                  { value: 'center', label: s.alignCenter }, { value: 'baseline', label: s.alignBaseline },
                ]}
              />
            </div>
            <div {...hintProps('alignContent')} className={cn(state.container.wrap === 'nowrap' && 'opacity-50')}>
              <span className="mb-1 block text-xs text-muted-foreground">{s.alignContent}</span>
              <SegmentedControl
                value={state.container.alignContent}
                onChange={(v: AlignContent) => patchContainer({ alignContent: v })}
                options={[
                  { value: 'stretch', label: s.alignStretch }, { value: 'flex-start', label: s.alignStart }, { value: 'flex-end', label: s.alignEnd },
                  { value: 'center', label: s.alignCenter }, { value: 'space-between', label: s.justifyBetween }, { value: 'space-around', label: s.justifyAround },
                ]}
              />
            </div>
            <div {...hintProps('gap')}>
              <Slider label={s.gap} value={state.container.gap} min={0} max={60} suffix="px" onChange={(n) => patchContainer({ gap: n })} />
            </div>
            {hintField && ['direction', 'wrap', 'justify', 'alignItems', 'alignContent', 'gap'].includes(hintField) && (
              <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{fieldHintText[hintField]}</p>
            )}
          </Section>

          <Section
            title={`${s.items} (${state.items.length})`}
            action={<button type="button" onClick={addItem} className="flex items-center gap-1 text-primary hover:underline"><Plus className="size-3.5" /> {s.addItem}</button>}
          >
            <p className="text-xs text-muted-foreground">{s.domOrderNote}</p>
            <div className="overflow-hidden rounded-lg border">
              {state.items.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => patch({ activeItemId: it.id })}
                  className={cn('flex w-full items-center gap-2 border-b px-2 py-1.5 text-left last:border-0', it.id === state.activeItemId && 'bg-muted/60')}
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold text-white" style={{ backgroundColor: ITEM_COLORS[i % ITEM_COLORS.length] }}>
                    {i + 1}
                  </span>
                  <span className="flex-1 font-mono text-[11px] text-muted-foreground">
                    grow:{it.grow} shrink:{it.shrink} order:{it.order}
                  </span>
                  {state.items.length > 1 && (
                    <span onClick={(e) => { e.stopPropagation(); deleteItem(it.id) }} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-3.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Section>

          {activeItem && (
            <Section title={`${s.item} ${state.items.findIndex((it) => it.id === activeItem.id) + 1}`}>
              <div {...hintProps('grow')}>
                <Slider label={s.grow} value={activeItem.grow} min={0} max={5} onChange={(n) => patchActiveItem({ grow: n })} />
              </div>
              <div {...hintProps('shrink')}>
                <Slider label={s.shrink} value={activeItem.shrink} min={0} max={5} onChange={(n) => patchActiveItem({ shrink: n })} />
              </div>
              <div {...hintProps('basis')} className="space-y-1.5">
                <span className="block text-xs text-muted-foreground">{s.basis}</span>
                <SegmentedControl
                  value={activeItem.basisMode}
                  onChange={(v: 'auto' | 'px') => patchActiveItem({ basisMode: v })}
                  options={[{ value: 'auto', label: s.basisAuto }, { value: 'px', label: s.basisPx }]}
                />
                {activeItem.basisMode === 'px' && (
                  <Slider label={s.basis} value={activeItem.basisPx} min={0} max={400} suffix="px" onChange={(n) => patchActiveItem({ basisPx: n })} />
                )}
              </div>
              <div {...hintProps('order')}>
                <Slider label={s.order} value={activeItem.order} min={-5} max={5} onChange={(n) => patchActiveItem({ order: n })} />
              </div>
              <div {...hintProps('alignSelf')}>
                <span className="mb-1 block text-xs text-muted-foreground">{s.alignSelf}</span>
                <SegmentedControl
                  value={activeItem.alignSelf}
                  onChange={(v: AlignSelf) => patchActiveItem({ alignSelf: v })}
                  options={[
                    { value: 'auto', label: s.alignSelfAuto }, { value: 'stretch', label: s.alignStretch }, { value: 'flex-start', label: s.alignStart },
                    { value: 'flex-end', label: s.alignEnd }, { value: 'center', label: s.alignCenter }, { value: 'baseline', label: s.alignBaseline },
                  ]}
                />
              </div>
              {hintField && ['grow', 'shrink', 'basis', 'order', 'alignSelf'].includes(hintField) && (
                <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{fieldHintText[hintField]}</p>
              )}
            </Section>
          )}
        </div>

        {/* ── Column 2: live canvas ────────────────────────────────────── */}
        <div className="min-w-0 space-y-4">
          <div className="flex items-center justify-center overflow-auto rounded-xl border bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-6">
            <div style={{ ...containerStyle(state.container), width: state.canvasWidth, height: state.canvasHeight }} className="rounded-lg border-2 border-dashed border-foreground/20 bg-background/60 p-2">
              {state.items.map((it, i) => (
                <div
                  key={it.id}
                  ref={(el) => setItemRef(it.id, el)}
                  data-item-id={it.id}
                  onClick={() => patch({ activeItemId: it.id })}
                  style={{ ...itemStyle(it), backgroundColor: ITEM_COLORS[i % ITEM_COLORS.length] }}
                  className={cn(
                    'flex min-h-10 min-w-10 cursor-pointer flex-col items-center justify-center rounded-md text-xs font-semibold text-white/95 shadow-sm transition-shadow',
                    it.id === state.activeItemId && 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                  )}
                >
                  <span className="text-base">{i + 1}</span>
                  <span className="font-mono text-[10px] font-normal opacity-90">
                    {measured[it.id] ? `${measured[it.id].w}×${measured[it.id].h}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Section title={s.canvasSize}>
            <Slider label={s.canvasWidth} value={state.canvasWidth} min={200} max={900} suffix="px" onChange={(n) => patch({ canvasWidth: n })} />
            <Slider label={s.canvasHeight} value={state.canvasHeight} min={120} max={600} suffix="px" onChange={(n) => patch({ canvasHeight: n })} />
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

          <Section title={s.hoverHint}>
            <p className="text-xs text-muted-foreground">{s.domOrderNote}</p>
          </Section>
        </div>
      </div>
    </div>
  )
}
