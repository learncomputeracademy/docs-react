'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Maximize2, Pause, Play, RotateCcw, ScanSearch, Search, StepForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, Slider } from '@/components/tools/tool-controls'
import { Inspector } from '@/components/tools/protocols-inspector'
import { ProtocolScene } from '@/components/tools/protocols-scene'
import { pvs } from '@/lib/protocols-i18n'
import { CATEGORIES, FIRST_LESSONS, loadAllLessons } from '@/lib/protocols/lessons'
import type { CategoryId, Lesson } from '@/lib/protocols/net'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

// The chosen lesson lives in the URL hash (#dns) so a lesson can be linked
// to and the back button works.
const subscribeHash = (fn: () => void) => {
  window.addEventListener('hashchange', fn)
  return () => window.removeEventListener('hashchange', fn)
}
const readHash = () => window.location.hash.slice(1)

// ── lesson browser ──────────────────────────────────────────────────────
function Browser({ lessons, current, locale, onPick }: { lessons: Lesson[]; current: string; locale: Locale; onPick: (id: string) => void }) {
  const s = pvs(locale)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<CategoryId | 'all'>('all')
  const q = query.trim().toLowerCase()
  const shown = lessons.filter((l) => (cat === 'all' || l.category === cat) && (!q || `${l.name} ${l.tagline.en} ${l.tagline.bn}`.toLowerCase().includes(q)))

  return (
    <Section title={`${s.protocol} · ${lessons.length}`} className="lg:sticky lg:top-20 lg:self-start">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={s.search}
          aria-label={s.search}
          className="w-full rounded-md border bg-background py-1.5 pl-7 pr-2 text-xs"
        />
      </label>
      <div className="flex flex-wrap gap-1">
        {(['all', ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={cn('rounded-full border px-2 py-0.5 text-xs transition-colors', cat === c ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            {c === 'all' ? s.all : s.categories[c]}
          </button>
        ))}
      </div>
      <ul className="-mx-1 max-h-56 space-y-0.5 overflow-y-auto px-1 lg:max-h-[30rem]">
        {shown.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              aria-current={l.id === current ? 'true' : undefined}
              onClick={() => onPick(l.id)}
              className={cn('w-full rounded-md px-2 py-1.5 text-left transition-colors', l.id === current ? 'bg-primary/10 ring-1 ring-primary/40' : 'hover:bg-muted/60')}
            >
              <span className="block font-mono text-xs font-bold">{l.name}</span>
              <span className="block text-xs text-muted-foreground">{l.tagline[locale]}</span>
            </button>
          </li>
        ))}
        {shown.length === 0 && <li className="px-2 py-3 text-xs text-muted-foreground">{s.noMatch}</li>}
      </ul>
    </Section>
  )
}

// ── one lesson, playing ─────────────────────────────────────────────────
function Player({ lesson, locale }: { lesson: Lesson; locale: Locale }) {
  const s = pvs(locale)
  const reduced = Boolean(useReducedMotion())
  const [stepIndex, setStepIndex] = useState(0)
  const [runKey, setRunKey] = useState(0)
  const [arrived, setArrived] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [follow, setFollow] = useState(true)

  const step = lesson.steps[stepIndex]
  const last = lesson.steps.length - 1

  const go = useCallback((i: number) => {
    setStepIndex(i)
    setArrived(false)
    setRunKey((k) => k + 1)
  }, [])
  const onDone = useCallback(() => setArrived(true), [])

  // a step with no packet "finishes" after a reading pause
  useEffect(() => {
    if (step.to) return
    const id = setTimeout(() => setArrived(true), 2600 / speed)
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

  const name = (id: string) => lesson.topo.nodes[id].label[locale]

  return (
    <div className="min-w-0 space-y-4">
      <div>
        <h2 className="font-mono text-xl font-bold">{lesson.name} <span className="font-sans text-sm font-normal text-muted-foreground">· {lesson.tagline[locale]}</span></h2>
        <p className="mt-1 text-sm text-muted-foreground">{lesson.intro[locale]}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_16rem]">
        <Section
          title={s.network}
          action={
            <button type="button" onClick={() => setFollow((v) => !v)} aria-pressed={follow} className="flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-normal normal-case tracking-normal text-muted-foreground hover:text-foreground">
              {follow ? <Maximize2 className="size-3" /> : <ScanSearch className="size-3" />} {follow ? s.whole : s.follow}
            </button>
          }
        >
          <ProtocolScene
            topo={lesson.topo}
            step={step}
            sceneKey={lesson.id}
            runKey={runKey}
            speed={speed}
            locale={locale}
            lostText={s.lost}
            follow={follow}
            reduced={reduced}
            arrived={arrived}
            onDone={onDone}
            label={`${lesson.name}: ${step.title[locale]}`}
          />

          <div className="flex gap-1" aria-hidden>
            {lesson.steps.map((_, i) => (
              <button key={i} type="button" tabIndex={-1} onClick={() => { setPlaying(false); go(i) }} className={cn('h-1.5 flex-1 rounded-full transition-colors', i < stepIndex ? 'bg-primary/50' : i === stepIndex ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/30')} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={stepIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="min-h-24" aria-live="polite">
              <p className="text-xs text-muted-foreground">{s.step} {stepIndex + 1} {s.of} {lesson.steps.length}</p>
              <h3 className="mt-0.5 text-base font-semibold">{step.title[locale]}</h3>
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

        {/* step list — doubles as a scrubber */}
        <Section title={s.steps} className="xl:self-start">
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
                    {st.to && <span className="mt-0.5 block font-mono text-xs font-normal text-muted-foreground">{name(st.from)} → {name(st.to)}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      <Section title={s.inspector}>
        {step.layers ? <Inspector key={stepIndex} layers={step.layers} locale={locale} /> : <p className="text-sm text-muted-foreground">{s.noPacket}</p>}
        <p className="text-xs text-muted-foreground">{s.captureNote}</p>
      </Section>
    </div>
  )
}

// ── the tool ────────────────────────────────────────────────────────────
export function ProtocolsDemo({ locale }: { locale: Locale }) {
  const s = pvs(locale)
  const hash = useSyncExternalStore(subscribeHash, readHash, () => '')
  // six lessons ship with the page; the rest arrive right after first paint
  const [lessons, setLessons] = useState(FIRST_LESSONS)
  useEffect(() => {
    let live = true
    loadAllLessons().then((all) => { if (live) setLessons(all) })
    return () => { live = false }
  }, [])
  const lesson = lessons.find((l) => l.id === hash) ?? lessons[0]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/basics' : '/basics'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mt-8 grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <Browser lessons={lessons} current={lesson.id} locale={locale} onPick={(id) => { window.location.hash = id }} />
        <Player key={lesson.id} lesson={lesson} locale={locale} />
      </div>
    </div>
  )
}
