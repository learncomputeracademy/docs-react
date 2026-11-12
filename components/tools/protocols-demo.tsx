'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, BookOpen, Check, Cloud, Laptop, Pause, Play, RotateCcw, Router, Server, StepForward, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, Slider } from '@/components/tools/tool-controls'
import { pvs } from '@/lib/protocols-i18n'
import { LESSONS, flatten, type NodeId, type Step } from '@/lib/protocols/lessons'
import { hex, size, type Layer, type LayerKind } from '@/lib/protocols/packet'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

// ── topology ────────────────────────────────────────────────────────────
type Pt = { x: number; y: number }
const VIEW = { w: 760, h: 340 }
const NODES: Record<NodeId, Pt & { icon: LucideIcon; sub: string }> = {
  laptop: { x: 80, y: 170, icon: Laptop, sub: '192.168.1.10' },
  router: { x: 250, y: 170, icon: Router, sub: '192.168.1.1' },
  internet: { x: 430, y: 170, icon: Cloud, sub: '' },
  dns: { x: 660, y: 72, icon: BookOpen, sub: '1.1.1.1' },
  server: { x: 660, y: 268, icon: Server, sub: 'example.com' },
}
const NODE_IDS = Object.keys(NODES) as NodeId[]
const LINKS: [NodeId, NodeId][] = [['laptop', 'router'], ['router', 'internet'], ['internet', 'dns'], ['internet', 'server']]
const CHAINS: NodeId[][] = [['laptop', 'router', 'internet', 'dns'], ['laptop', 'router', 'internet', 'server']]

function route(from: NodeId, to: NodeId): NodeId[] {
  const chain = CHAINS.find((c) => c.includes(from) && c.includes(to)) ?? CHAINS[0]
  const [i, j] = [chain.indexOf(from), chain.indexOf(to)]
  return i <= j ? chain.slice(i, j + 1) : chain.slice(j, i + 1).reverse()
}

/** Nodes a step's packet passes through; a lost packet dies at the internet. */
function stepRoute(step: Step): NodeId[] {
  if (!step.to) return [step.from]
  const r = route(step.from, step.to)
  return step.lost ? r.slice(0, r.indexOf('internet') + 1) : r
}

function along(pts: Pt[], p: number): Pt {
  const lens = pts.slice(1).map((b, i) => Math.hypot(b.x - pts[i].x, b.y - pts[i].y))
  let d = p * lens.reduce((a, b) => a + b, 0)
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const k = lens[i] ? d / lens[i] : 0
      return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * k, y: pts[i].y + (pts[i + 1].y - pts[i].y) * k }
    }
    d -= lens[i]
  }
  return pts[pts.length - 1]
}

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

// ── the travelling packet ───────────────────────────────────────────────
// Owns its own requestAnimationFrame clock so only this small subtree
// re-renders per frame, not the whole tool.
function PacketFlight({ pts, duration, label, lost, lostText, onDone }: { pts: Pt[]; duration: number; label: string; lost: boolean; lostText: string; onDone: () => void }) {
  const [p, setP] = useState(duration <= 0 ? 1 : 0)

  useEffect(() => {
    if (duration <= 0) { onDone(); return }
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const x = Math.min(1, (now - start) / duration)
      setP(x)
      if (x < 1) raf = requestAnimationFrame(tick)
      else onDone()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, onDone])

  const e = easeInOut(p)
  const pos = along(pts, e)
  const end = pts[pts.length - 1]
  const d = pts.map((q, i) => `${i ? 'L' : 'M'}${q.x} ${q.y}`).join(' ')
  const done = p >= 1
  const text = done && lost ? `${label} · ${lostText}` : label
  const w = text.length * 6.4 + 18
  // keep the label inside the drawing
  const lx = Math.max(w / 2 + 4, Math.min(VIEW.w - w / 2 - 4, pos.x))

  return (
    <g className={lost && done ? 'text-red-500' : 'text-primary'}>
      {/* trail: the part of the route already covered */}
      <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - e} fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={done ? 0.35 : 0.7} />
      {done && (
        <motion.circle cx={end.x} cy={end.y} fill="none" stroke="currentColor" strokeWidth={2} initial={{ r: 12, opacity: 0.9 }} animate={{ r: 54, opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} />
      )}
      {done && lost && (
        <motion.g initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ transformOrigin: `${end.x}px ${end.y}px` }} stroke="currentColor" strokeWidth={4} strokeLinecap="round">
          <line x1={end.x - 10} y1={end.y - 10} x2={end.x + 10} y2={end.y + 10} />
          <line x1={end.x + 10} y1={end.y - 10} x2={end.x - 10} y2={end.y + 10} />
        </motion.g>
      )}
      {!(done && lost) && (
        <g opacity={done ? 0 : 1} style={{ transition: 'opacity 200ms' }}>
          <circle cx={pos.x} cy={pos.y} r={13} fill="currentColor" opacity={0.2} />
          <circle cx={pos.x} cy={pos.y} r={7} fill="currentColor" />
        </g>
      )}
      <g transform={`translate(${lx} ${pos.y - 48})`} opacity={done && !lost ? 0 : 1} style={{ transition: 'opacity 300ms' }}>
        <rect x={-w / 2} y={-11} width={w} height={22} rx={11} fill="currentColor" />
        <text textAnchor="middle" dominantBaseline="central" className="fill-background font-mono text-[11px] font-semibold">{text}</text>
      </g>
    </g>
  )
}

function Ripples({ at }: { at: Pt }) {
  return (
    <g className="text-primary">
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} cx={at.x} cy={at.y} fill="none" stroke="currentColor" strokeWidth={1.5} initial={{ r: 20, opacity: 0.6 }} animate={{ r: 130, opacity: 0 }} transition={{ duration: 1.6, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }} />
      ))}
    </g>
  )
}

// ── packet inspector ────────────────────────────────────────────────────
const LAYER_STYLE: Record<LayerKind, { chip: string; byte: string; on: string }> = {
  link: { chip: 'border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-300', byte: 'bg-slate-500/10', on: 'bg-slate-600 text-white' },
  ip: { chip: 'border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300', byte: 'bg-sky-500/10', on: 'bg-sky-600 text-white' },
  transport: { chip: 'border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300', byte: 'bg-violet-500/10', on: 'bg-violet-600 text-white' },
  app: { chip: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300', byte: 'bg-amber-500/10', on: 'bg-amber-600 text-white' },
}

function Inspector({ layers, locale }: { layers: Layer[]; locale: Locale }) {
  const s = pvs(locale)
  const [active, setActive] = useState<string | null>(null)
  const { bytes, fields } = useMemo(() => flatten(layers), [layers])
  const id = (l: number, fi: number) => `${l}:${fi}`
  const current = fields.find((x) => id(x.layer, x.field) === active)
  const currentField = current ? layers[current.layer].fields[current.field] : null

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        {layers.map((layer, li) => (
          <div key={li} className={cn('overflow-hidden rounded-md border', LAYER_STYLE[layer.kind].chip)}>
            <div className="flex items-baseline justify-between gap-2 px-2.5 py-1.5 text-xs font-semibold">
              <span>{layer.name} <span className="font-normal opacity-70">· {s.layers[layer.kind]}</span></span>
              <span className="font-mono font-normal tabular-nums opacity-70">{size(layer.fields)} {s.bytes}</span>
            </div>
            <div className="divide-y bg-background text-foreground">
              {layer.fields.map((fd, fi) => (
                <button
                  key={fi}
                  type="button"
                  onMouseEnter={() => setActive(id(li, fi))}
                  onFocus={() => setActive(id(li, fi))}
                  onClick={() => setActive(id(li, fi))}
                  className={cn('flex w-full items-baseline justify-between gap-3 px-2.5 py-1 text-left text-xs transition-colors', active === id(li, fi) ? 'bg-muted' : 'hover:bg-muted/50')}
                >
                  <span className="shrink-0 text-muted-foreground">{fd.name}</span>
                  <span className="min-w-0 break-words text-right font-mono">{fd.value}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 lg:sticky lg:top-20 lg:self-start">
        <div className="min-h-28 rounded-md border bg-muted/40 p-3 text-sm" aria-live="polite">
          {currentField && current ? (
            <>
              <p className="flex flex-wrap items-baseline gap-x-2 font-semibold">
                {currentField.name}
                <span className={cn('rounded border px-1.5 py-0.5 text-xs font-medium', LAYER_STYLE[layers[current.layer].kind].chip)}>{layers[current.layer].name}</span>
                <span className="font-mono text-xs font-normal text-muted-foreground">{current.length} {s.bytes}</span>
              </p>
              <p className="mt-1.5 text-muted-foreground">{currentField.note[locale]}</p>
            </>
          ) : (
            <p className="text-muted-foreground">{s.fieldHint}</p>
          )}
        </div>

        <div>
          <p className="mb-1.5 flex items-baseline justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>{s.hexView}</span>
            <span className="font-mono font-normal normal-case tabular-nums">{s.total}: {bytes.length} {s.bytes}</span>
          </p>
          <div className="max-h-80 overflow-y-auto rounded-md border bg-background p-2 font-mono text-xs leading-6">
            {fields.map((x) => {
              const kind = layers[x.layer].kind
              const fid = id(x.layer, x.field)
              const chunk = bytes.slice(x.offset, x.offset + x.length)
              // a long run of one value (DHCP's 192 zero bytes) is one token
              const run = chunk.length > 24 && chunk.every((b) => b === chunk[0])
              return (
                <span
                  key={fid}
                  onMouseEnter={() => setActive(fid)}
                  onClick={() => setActive(fid)}
                  className={cn('cursor-pointer rounded-sm transition-colors [box-decoration-break:clone]', active === fid ? LAYER_STYLE[kind].on : LAYER_STYLE[kind].byte)}
                >
                  {run ? ` ${hex(chunk[0])} × ${chunk.length} ` : chunk.map((b) => ` ${hex(b)}`).join('') + ' '}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── the tool ────────────────────────────────────────────────────────────
export function ProtocolsDemo({ locale }: { locale: Locale }) {
  const s = pvs(locale)
  const reduced = useReducedMotion()
  const [lessonId, setLessonId] = useState(LESSONS[0].id)
  const [stepIndex, setStepIndex] = useState(0)
  const [runKey, setRunKey] = useState(0)
  const [arrived, setArrived] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const lesson = LESSONS.find((l) => l.id === lessonId) ?? LESSONS[0]
  const step = lesson.steps[stepIndex]
  const last = lesson.steps.length - 1
  const path = stepRoute(step)
  // a lost packet dies on the link just before the internet, where the ✕ is visible
  const pts = path.map((n, i): Pt => {
    const prev = NODES[path[i - 1] ?? n]
    return step.lost && i === path.length - 1 ? { x: (prev.x + NODES[n].x) / 2 + 20, y: (prev.y + NODES[n].y) / 2 } : NODES[n]
  })

  const go = useCallback((i: number) => {
    setStepIndex(i)
    setArrived(false)
    setRunKey((k) => k + 1)
  }, [])

  function pickLesson(id: string) {
    setLessonId(id)
    setPlaying(false)
    go(0)
  }

  const onDone = useCallback(() => setArrived(true), [])

  // a step with no packet "finishes" after a reading pause
  useEffect(() => {
    if (step.to) return
    const id = setTimeout(() => setArrived(true), 1800 / speed)
    return () => clearTimeout(id)
  }, [step, runKey, speed])

  // autoplay: once the current step has landed, wait a beat, then advance
  useEffect(() => {
    if (!playing || !arrived) return
    const id = setTimeout(() => (stepIndex >= last ? setPlaying(false) : go(stepIndex + 1)), 1300 / speed)
    return () => clearTimeout(id)
  }, [playing, arrived, stepIndex, last, speed, go])

  // ← / → step through, unless the user is typing somewhere
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      if (e.key === 'ArrowRight' && stepIndex < last) { setPlaying(false); go(stepIndex + 1) }
      if (e.key === 'ArrowLeft' && stepIndex > 0) { setPlaying(false); go(stepIndex - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, stepIndex, last])

  const duration = reduced ? 0 : (450 + 420 * (pts.length - 1)) / speed
  const onRoute = (a: NodeId, b: NodeId) => path.some((n, i) => (n === a && path[i + 1] === b) || (n === b && path[i + 1] === a))

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/basics' : '/basics'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      {/* protocol picker */}
      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" role="tablist" aria-label={s.protocol}>
        {LESSONS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={l.id === lesson.id}
            onClick={() => pickLesson(l.id)}
            className={cn('rounded-lg border p-2.5 text-left transition-colors', l.id === lesson.id ? 'border-primary bg-primary/5 shadow-sm' : 'hover:bg-muted/50')}
          >
            <span className="block font-mono text-sm font-bold">{l.name}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{l.tagline[locale]}</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{lesson.intro[locale]}</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4">
          <Section title={s.network}>
            <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="w-full" role="img" aria-label={`${lesson.name}: ${step.title[locale]}`}>
              {LINKS.map(([a, b]) => {
                const used = lesson.nodes.includes(a) && lesson.nodes.includes(b)
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
                    className={cn('transition-all duration-300', onRoute(a, b) ? 'stroke-primary/40' : 'stroke-border', !used && 'opacity-30')}
                    strokeWidth={2}
                    strokeDasharray={a === 'laptop' ? '2 6' : undefined}
                    strokeLinecap="round"
                  />
                )
              })}

              {step.broadcast && !arrived && <Ripples key={`r${runKey}`} at={NODES[step.from]} />}

              {/* under the nodes, so a packet leaves one box and enters the next */}
              {step.to && (
                <PacketFlight key={`${lesson.id}-${stepIndex}-${runKey}-${speed}`} pts={pts} duration={duration} label={step.label ?? ''} lost={Boolean(step.lost)} lostText={s.lost} onDone={onDone} />
              )}

              {NODE_IDS.map((nid) => {
                const n = NODES[nid]
                const Icon = n.icon
                const used = lesson.nodes.includes(nid)
                const ends = nid === step.from || nid === step.to
                const thinking = !step.to && nid === step.from
                return (
                  <g key={nid} className={cn('transition-opacity duration-300', !used && 'opacity-30')}>
                    {thinking && !reduced && (
                      <motion.rect key={`t${runKey}`} x={n.x - 42} y={n.y - 32} width={84} height={64} rx={14} fill="none" className="stroke-primary" strokeWidth={2} initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.35, opacity: 0 }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut' }} style={{ transformOrigin: `${n.x}px ${n.y}px` }} />
                    )}
                    <rect x={n.x - 42} y={n.y - 32} width={84} height={64} rx={14} strokeWidth={ends ? 2.5 : 1.5} className={cn('fill-background transition-colors duration-300', ends ? 'stroke-primary' : 'stroke-border')} />
                    <Icon x={n.x - 13} y={n.y - 24} width={26} height={26} className={cn('transition-colors duration-300', ends ? 'text-primary' : 'text-muted-foreground')} />
                    <text x={n.x} y={n.y + 18} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">{s.nodes[nid]}</text>
                    {n.sub && <text x={n.x} y={n.y + 48} textAnchor="middle" className="fill-muted-foreground font-mono text-[10px]">{n.sub}</text>}
                  </g>
                )
              })}

            </svg>

            {/* progress */}
            <div className="flex gap-1" aria-hidden>
              {lesson.steps.map((_, i) => (
                <button key={i} type="button" tabIndex={-1} onClick={() => { setPlaying(false); go(i) }} className={cn('h-1.5 flex-1 rounded-full transition-colors', i < stepIndex ? 'bg-primary/50' : i === stepIndex ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/30')} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={`${lesson.id}-${stepIndex}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="min-h-24" aria-live="polite">
                <p className="text-xs text-muted-foreground">{s.step} {stepIndex + 1} {s.of} {lesson.steps.length}</p>
                <h2 className="mt-0.5 text-base font-semibold">{step.title[locale]}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.body[locale]}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" disabled={stepIndex <= 0} onClick={() => { setPlaying(false); go(stepIndex - 1) }}>
                <ArrowLeft className="size-3.5" /> {s.prev}
              </Button>
              <Button size="sm" onClick={() => { if (!playing && stepIndex >= last) go(0); setPlaying((p) => !p) }}>
                {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />} {playing ? s.pause : s.play}
              </Button>
              <Button size="sm" variant="outline" disabled={stepIndex >= last} onClick={() => { setPlaying(false); go(stepIndex + 1) }}>
                {s.next} <ArrowRight className="size-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => go(stepIndex)}>
                <StepForward className="size-3.5" /> {s.replay}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setPlaying(false); go(0) }}>
                <RotateCcw className="size-3.5" /> {s.restart}
              </Button>
              <div className="ml-auto w-32">
                <Slider label={s.speed} value={speed} min={0.5} max={3} step={0.5} suffix="x" onChange={setSpeed} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{s.keys}</p>
          </Section>
        </div>

        {/* step list — doubles as a scrubber */}
        <Section title={`${lesson.name} · ${s.steps}`} className="lg:self-start">
          <ol className="space-y-1">
            {lesson.steps.map((st, i) => (
              <li key={i}>
                <button
                  type="button"
                  aria-current={i === stepIndex ? 'step' : undefined}
                  onClick={() => { setPlaying(false); go(i) }}
                  className={cn('flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors', i === stepIndex ? 'bg-primary/10 font-medium' : 'hover:bg-muted/60', i > stepIndex && 'text-muted-foreground')}
                >
                  <span className={cn('mt-px flex size-5 shrink-0 items-center justify-center rounded-full border text-xs tabular-nums', i === stepIndex && 'border-primary bg-primary text-primary-foreground', i < stepIndex && 'border-primary/50 text-primary')}>
                    {i < stepIndex ? <Check className="size-2.5" /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    {st.title[locale]}
                    {st.to && (
                      <span className="mt-0.5 block font-mono text-xs font-normal text-muted-foreground">
                        {s.nodes[st.from]} → {s.nodes[st.to]}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      <Section title={s.inspector} className="mt-4">
        {step.layers ? (
          <Inspector key={`${lesson.id}-${stepIndex}`} layers={step.layers} locale={locale} />
        ) : (
          <p className="text-sm text-muted-foreground">{s.noPacket}</p>
        )}
        <p className="text-xs text-muted-foreground">{s.captureNote}</p>
      </Section>
    </div>
  )
}
