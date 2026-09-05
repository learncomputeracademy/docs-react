'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight, Plus, Trash2, Play, Pause, RotateCcw, Layers as LayersIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider, Section, SegmentedControl } from '@/components/tools/tool-controls'
import { BezierEditor } from '@/components/tools/animation-bezier-editor'
import { as } from '@/lib/animation-i18n'
import {
  type Layer, type KeyframeStop, type Direction, type FillMode,
  defaultLayer, makeKeyframe, uid, buildFullCss, layerToWaapiKeyframes, layerToWaapiOptions,
  EASING_PRESETS, PRESET_ANIMATIONS,
} from '@/lib/animation'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

function sortedKfs(layer: Layer): KeyframeStop[] {
  return [...layer.keyframes].sort((a, b) => a.offset - b.offset)
}

const ITERATION_CHOICES = ['1', '2', '3', '5', '10', '∞'] as const

export function AnimationDemo({ locale }: { locale: Locale }) {
  const s = as(locale)
  const [layers, setLayers] = useState<Layer[]>(() => [defaultLayer()])
  const [selectedLayerId, setSelectedLayerId] = useState('layer-1')
  const [selectedKfId, setSelectedKfId] = useState('layer-1-kf-0')
  const [playing, setPlaying] = useState(false)
  const [scrubMs, setScrubMs] = useState(0)
  const [dragKfId, setDragKfId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const elRefs = useRef(new Map<string, HTMLDivElement>())
  const animRefs = useRef(new Map<string, Animation>())
  const trackRef = useRef<HTMLDivElement>(null)

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) ?? layers[0]
  const kfs = sortedKfs(selectedLayer)
  const selectedKf = kfs.find((k) => k.id === selectedKfId) ?? kfs[0]
  const kfIndex = kfs.findIndex((k) => k.id === selectedKf.id)

  function updateLayer(id: string, patch: Partial<Layer> | ((l: Layer) => Layer)) {
    setLayers((prev) => prev.map((l) => (l.id === id ? (typeof patch === 'function' ? patch(l) : { ...l, ...patch }) : l)))
  }
  function updateKeyframe(layerId: string, kfId: string, patch: Partial<KeyframeStop> | ((k: KeyframeStop) => KeyframeStop)) {
    updateLayer(layerId, (l) => ({
      ...l,
      keyframes: l.keyframes.map((k) => (k.id === kfId ? (typeof patch === 'function' ? patch(k) : { ...k, ...patch }) : k)),
    }))
  }
  const patchKf = (patch: Partial<KeyframeStop>) => updateKeyframe(selectedLayerId, selectedKf.id, patch)
  const patchTransform = (patch: Partial<KeyframeStop['transform']>) =>
    updateKeyframe(selectedLayerId, selectedKf.id, (k) => ({ ...k, transform: { ...k.transform, ...patch } }))
  const patchShadow = (patch: Partial<KeyframeStop['boxShadow']>) =>
    updateKeyframe(selectedLayerId, selectedKf.id, (k) => ({ ...k, boxShadow: { ...k.boxShadow, ...patch } }))

  // ── Layers ──────────────────────────────────────────────────────────
  function addLayer() {
    const id = uid('layer')
    const layer = defaultLayer(id)
    layer.name = `Box ${layers.length + 1}`
    layer.delayMs = layers.length * 150
    setLayers((prev) => [...prev, layer])
    setSelectedLayerId(id)
    setSelectedKfId(layer.keyframes[0].id)
  }
  function duplicateLayer(id: string) {
    const src = layers.find((l) => l.id === id)
    if (!src) return
    const newId = uid('layer')
    const clone: Layer = { ...src, id: newId, name: `${src.name} copy`, keyframes: src.keyframes.map((k) => ({ ...k, id: uid('kf') })) }
    setLayers((prev) => [...prev, clone])
    setSelectedLayerId(newId)
    setSelectedKfId(clone.keyframes[0].id)
  }
  function deleteLayer(id: string) {
    if (layers.length <= 1) return
    const remaining = layers.filter((l) => l.id !== id)
    setLayers(remaining)
    if (id === selectedLayerId) {
      setSelectedLayerId(remaining[0].id)
      setSelectedKfId(remaining[0].keyframes[0].id)
    }
  }

  // ── Keyframes ───────────────────────────────────────────────────────
  function addKeyframe() {
    let bestGap = -1
    let mid = 50
    for (let i = 0; i < kfs.length - 1; i++) {
      const gap = kfs[i + 1].offset - kfs[i].offset
      if (gap > bestGap) { bestGap = gap; mid = (kfs[i].offset + kfs[i + 1].offset) / 2 }
    }
    const nearest = kfs.reduce((a, b) => (Math.abs(a.offset - mid) < Math.abs(b.offset - mid) ? a : b))
    const newKf = makeKeyframe(Math.round(mid), {
      transform: { ...nearest.transform }, opacity: nearest.opacity, backgroundColor: nearest.backgroundColor,
      color: nearest.color, boxShadow: { ...nearest.boxShadow }, borderRadius: nearest.borderRadius,
    })
    updateLayer(selectedLayerId, (l) => ({ ...l, keyframes: [...l.keyframes, newKf] }))
    setSelectedKfId(newKf.id)
  }
  function deleteKeyframe(kfId: string) {
    const kf = kfs.find((k) => k.id === kfId)
    if (!kf || kf.offset === 0 || kf.offset === 100) return
    updateLayer(selectedLayerId, (l) => ({ ...l, keyframes: l.keyframes.filter((k) => k.id !== kfId) }))
    if (selectedKfId === kfId) setSelectedKfId(kfs[0].id)
  }
  function handleTrackPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragKfId || !trackRef.current) return
    const idx = kfs.findIndex((k) => k.id === dragKfId)
    if (idx <= 0 || idx >= kfs.length - 1) return
    const rect = trackRef.current.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    const min = kfs[idx - 1].offset + 1
    const max = kfs[idx + 1].offset - 1
    updateKeyframe(selectedLayerId, dragKfId, { offset: Math.round(Math.min(max, Math.max(min, pct))) })
  }

  function applyPreset(key: string) {
    const preset = PRESET_ANIMATIONS.find((p) => p.key === key)
    if (!preset) return
    const id = uid('kf')
    const built = preset.build(id)
    updateLayer(selectedLayerId, (l) => ({ ...l, keyframes: built }))
    setSelectedKfId(built[0].id)
  }

  // ── Real playback: Web Animations API, never hand-simulated ──────────
  // Rebuilds every layer's Animation object whenever the underlying data
  // changes, paused at the current scrub position — play/pause/scrub
  // themselves are imperative calls on the existing objects (see below),
  // never a rebuild, so dragging the scrubber doesn't fight this effect.
  useEffect(() => {
    const liveIds = new Set(layers.map((l) => l.id))
    for (const [id, anim] of animRefs.current) {
      if (!liveIds.has(id)) { anim.cancel(); animRefs.current.delete(id) }
    }
    for (const layer of layers) {
      const el = elRefs.current.get(layer.id)
      if (!el) continue
      animRefs.current.get(layer.id)?.cancel()
      const anim = el.animate(layerToWaapiKeyframes(layer), layerToWaapiOptions(layer))
      anim.pause()
      anim.currentTime = Math.max(0, scrubMs - layer.delayMs)
      animRefs.current.set(layer.id, anim)
    }
    if (playing) for (const anim of animRefs.current.values()) anim.play()
    // scrubMs/playing deliberately excluded — applied imperatively by
    // togglePlay/handleScrub instead of forcing a full rebuild every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers])

  useEffect(() => {
    if (!playing) return
    let raf: number
    const tick = () => {
      const anim = animRefs.current.get(selectedLayerId)
      if (anim && typeof anim.currentTime === 'number') setScrubMs(Math.max(0, anim.currentTime + selectedLayer.delayMs))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, selectedLayerId, selectedLayer.delayMs])

  function togglePlay() {
    const next = !playing
    setPlaying(next)
    for (const anim of animRefs.current.values()) next ? anim.play() : anim.pause()
  }
  function handleScrub(ms: number) {
    setPlaying(false)
    setScrubMs(ms)
    for (const [id, anim] of animRefs.current) {
      const layer = layers.find((l) => l.id === id)
      if (!layer) continue
      anim.pause()
      anim.currentTime = Math.max(0, ms - layer.delayMs)
    }
  }
  function restart() { handleScrub(0) }

  const scrubMax = selectedLayer.delayMs + selectedLayer.durationMs
  const css = useMemo(() => buildFullCss(layers), [layers])

  async function copy() {
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const iterationChoice = selectedLayer.iterationCount === 'infinite' ? '∞' : String(selectedLayer.iterationCount)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/css' : '/css'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Left: layers, stage, timeline, keyframe properties */}
        <div className="space-y-3">
          <Section
            title={s.layers}
            action={<Button size="sm" variant="outline" onClick={addLayer}><Plus className="size-3.5" />{s.addLayer}</Button>}
          >
            <div className="flex flex-wrap gap-2">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className={cn(
                    'flex items-center gap-1 rounded-md border px-2 py-1 text-xs',
                    layer.id === selectedLayerId ? 'border-primary bg-primary/10' : 'hover:bg-accent/50'
                  )}
                >
                  <button type="button" className="flex items-center gap-1" onClick={() => { setSelectedLayerId(layer.id); setSelectedKfId(sortedKfs(layer)[0].id) }}>
                    <LayersIcon className="size-3" /> {layer.name}
                  </button>
                  <button type="button" title={s.duplicateLayer} onClick={() => duplicateLayer(layer.id)} className="text-muted-foreground hover:text-foreground"><Copy className="size-3" /></button>
                  {layers.length > 1 && (
                    <button type="button" title={s.deleteLayer} onClick={() => deleteLayer(layer.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3" /></button>
                  )}
                </div>
              ))}
            </div>
          </Section>

          <Section
            title={s.stage}
            action={
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" onClick={restart}><RotateCcw className="size-3.5" /></Button>
                <Button size="sm" variant="outline" onClick={togglePlay}>{playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}{playing ? s.pause : s.play}</Button>
              </div>
            }
          >
            <div className="relative flex h-56 items-center gap-6 overflow-hidden rounded-md border bg-muted/20 px-8">
              {layers.map((layer) => {
                const base = sortedKfs(layer)[0]
                return (
                  <div
                    key={layer.id}
                    ref={(el) => { if (el) elRefs.current.set(layer.id, el); else elRefs.current.delete(layer.id) }}
                    onClick={() => { setSelectedLayerId(layer.id); setSelectedKfId(sortedKfs(layer)[0].id) }}
                    className={cn('flex size-16 shrink-0 cursor-pointer items-center justify-center text-xs font-medium text-white', layer.id === selectedLayerId && 'ring-2 ring-primary ring-offset-2 ring-offset-background')}
                    style={{ backgroundColor: base.backgroundColor, color: base.color, opacity: base.opacity, borderRadius: base.borderRadius }}
                  >
                    {layer.name}
                  </div>
                )
              })}
            </div>
            <Slider label={s.scrubber} value={Math.round(scrubMs)} min={0} max={Math.max(1, scrubMax)} step={10} suffix="ms" onChange={handleScrub} />
          </Section>

          <Section
            title={s.timeline}
            action={<Button size="sm" variant="outline" onClick={addKeyframe}><Plus className="size-3.5" />{s.addKeyframe}</Button>}
          >
            <p className="text-xs text-muted-foreground">{s.timelineHint}</p>
            <div
              ref={trackRef}
              className="relative mt-3 h-10 rounded-md border bg-muted/20"
              onPointerMove={handleTrackPointerMove}
              onPointerUp={() => setDragKfId(null)}
              onPointerLeave={() => setDragKfId(null)}
            >
              {kfs.map((kf) => {
                const isEndpoint = kf.offset === 0 || kf.offset === 100
                return (
                  <button
                    key={kf.id}
                    type="button"
                    title={`${kf.offset}%`}
                    onPointerDown={(e) => { if (!isEndpoint) { e.currentTarget.setPointerCapture(e.pointerId); setDragKfId(kf.id) } }}
                    onClick={() => setSelectedKfId(kf.id)}
                    className={cn(
                      'absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow',
                      kf.id === selectedKf.id ? 'z-10 bg-primary' : 'bg-foreground/40 hover:bg-foreground/60',
                      !isEndpoint && 'cursor-grab active:cursor-grabbing'
                    )}
                    style={{ left: `${kf.offset}%` }}
                  />
                )
              })}
            </div>
          </Section>

          <Section
            title={`${s.keyframeAt} ${selectedKf.offset}%`}
            action={kfIndex > 0 && kfIndex < kfs.length - 1 ? (
              <Button size="sm" variant="outline" onClick={() => deleteKeyframe(selectedKf.id)}><Trash2 className="size-3.5" />{s.deleteKeyframe}</Button>
            ) : undefined}
          >
            <p className="mb-2 text-xs text-muted-foreground">{s.propertiesHint}</p>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.transform}</p>
            <div className="grid grid-cols-2 gap-x-3">
              <Slider label={s.translateX} value={selectedKf.transform.x} min={-300} max={300} step={1} suffix="px" onChange={(x) => patchTransform({ x })} />
              <Slider label={s.translateY} value={selectedKf.transform.y} min={-300} max={300} step={1} suffix="px" onChange={(y) => patchTransform({ y })} />
              <Slider label={s.scale} value={selectedKf.transform.scale} min={0} max={3} step={0.05} onChange={(scale) => patchTransform({ scale })} />
              <Slider label={s.rotate} value={selectedKf.transform.rotate} min={-360} max={360} step={1} suffix="deg" onChange={(rotate) => patchTransform({ rotate })} />
              <Slider label={s.skewX} value={selectedKf.transform.skewX} min={-60} max={60} step={1} suffix="deg" onChange={(skewX) => patchTransform({ skewX })} />
              <Slider label={s.skewY} value={selectedKf.transform.skewY} min={-60} max={60} step={1} suffix="deg" onChange={(skewY) => patchTransform({ skewY })} />
            </div>
            <Slider label={s.opacity} value={selectedKf.opacity} min={0} max={1} step={0.01} onChange={(opacity) => patchKf({ opacity })} />
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs">
                <span className="mb-1 block text-muted-foreground">{s.backgroundColor}</span>
                <input type="color" value={selectedKf.backgroundColor} onChange={(e) => patchKf({ backgroundColor: e.target.value })} className="h-8 w-full rounded-md border" />
              </label>
              <label className="block text-xs">
                <span className="mb-1 block text-muted-foreground">{s.textColor}</span>
                <input type="color" value={selectedKf.color} onChange={(e) => patchKf({ color: e.target.value })} className="h-8 w-full rounded-md border" />
              </label>
            </div>
            <Slider label={s.borderRadius} value={selectedKf.borderRadius} min={0} max={50} step={1} suffix="px" onChange={(borderRadius) => patchKf({ borderRadius })} />
            <p className="mb-1 mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.shadow}</p>
            <div className="grid grid-cols-2 gap-x-3">
              <Slider label={s.shadowX} value={selectedKf.boxShadow.x} min={-40} max={40} step={1} suffix="px" onChange={(x) => patchShadow({ x })} />
              <Slider label={s.shadowY} value={selectedKf.boxShadow.y} min={-40} max={40} step={1} suffix="px" onChange={(y) => patchShadow({ y })} />
              <Slider label={s.shadowBlur} value={selectedKf.boxShadow.blur} min={0} max={60} step={1} suffix="px" onChange={(blur) => patchShadow({ blur })} />
              <Slider label={s.shadowSpread} value={selectedKf.boxShadow.spread} min={-20} max={20} step={1} suffix="px" onChange={(spread) => patchShadow({ spread })} />
            </div>
            <label className="block text-xs">
              <span className="mb-1 block text-muted-foreground">{s.shadowColor}</span>
              <input type="color" value={selectedKf.boxShadow.color.slice(0, 7)} onChange={(e) => patchShadow({ color: e.target.value })} className="h-8 w-full rounded-md border" />
            </label>
          </Section>
        </div>

        {/* Right: timing, easing, presets, output */}
        <div className="space-y-4">
          <Section title={s.timing}>
            <Slider label={s.duration} value={selectedLayer.durationMs} min={100} max={5000} step={50} suffix="ms" onChange={(durationMs) => updateLayer(selectedLayerId, { durationMs })} />
            <p className="mb-2 text-xs text-muted-foreground">{s.durationDesc}</p>
            <Slider label={s.delay} value={selectedLayer.delayMs} min={0} max={3000} step={50} suffix="ms" onChange={(delayMs) => updateLayer(selectedLayerId, { delayMs })} />
            <p className="mb-2 text-xs text-muted-foreground">{s.delayDesc}</p>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">{s.iterationCount}</span>
              <SegmentedControl
                value={iterationChoice}
                onChange={(v) => updateLayer(selectedLayerId, { iterationCount: v === '∞' ? 'infinite' : Number(v) })}
                options={ITERATION_CHOICES.map((v) => ({ value: v, label: v }))}
              />
              <p className="mb-2 mt-1 text-xs text-muted-foreground">{s.iterationCountDesc}</p>
            </div>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">{s.direction}</span>
              <SegmentedControl
                value={selectedLayer.direction}
                onChange={(direction: Direction) => updateLayer(selectedLayerId, { direction })}
                options={[
                  { value: 'normal', label: s.directionNormal }, { value: 'reverse', label: s.directionReverse },
                  { value: 'alternate', label: s.directionAlternate }, { value: 'alternate-reverse', label: s.directionAlternateReverse },
                ]}
              />
              <p className="mb-2 mt-1 text-xs text-muted-foreground">{s.directionDesc}</p>
            </div>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">{s.fillMode}</span>
              <SegmentedControl
                value={selectedLayer.fillMode}
                onChange={(fillMode: FillMode) => updateLayer(selectedLayerId, { fillMode })}
                options={[
                  { value: 'none', label: s.fillNone }, { value: 'forwards', label: s.fillForwards },
                  { value: 'backwards', label: s.fillBackwards }, { value: 'both', label: s.fillBoth },
                ]}
              />
              <p className="mt-1 text-xs text-muted-foreground">{s.fillModeDesc}</p>
            </div>
          </Section>

          <Section title={s.easing}>
            <p className="mb-2 text-xs text-muted-foreground">{s.easingDesc}</p>
            <div className="mb-3 grid grid-cols-2 gap-1.5">
              {EASING_PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => updateLayer(selectedLayerId, { easing: p.value })}
                  className={cn('rounded-md border px-2 py-1 text-xs', selectedLayer.easing === p.value ? 'border-primary bg-primary/10 font-medium' : 'hover:bg-accent/50')}
                >
                  {s[p.labelKey as keyof typeof s]}
                </button>
              ))}
            </div>
            <BezierEditor value={selectedLayer.easing} onChange={(easing) => updateLayer(selectedLayerId, { easing })} />
          </Section>

          <Section title={s.presets}>
            <p className="mb-2 text-xs text-muted-foreground">{s.presetsHint}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_ANIMATIONS.map((p) => (
                <button key={p.key} type="button" onClick={() => applyPreset(p.key)} className="rounded-md border px-2 py-1.5 text-left text-xs hover:border-primary/50 hover:bg-accent/50">
                  {s[p.labelKey as keyof typeof s]}
                </button>
              ))}
            </div>
          </Section>

          <Section title={s.output}>
            <pre className="max-h-96 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
              <code>{css}</code>
            </pre>
            <Button size="sm" variant="outline" className="w-full" onClick={copy}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? s.copied : s.copy}
            </Button>
          </Section>
        </div>
      </div>
    </div>
  )
}
