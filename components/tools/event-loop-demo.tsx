'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl, Slider } from '@/components/tools/tool-controls'
import { els } from '@/lib/event-loop-i18n'
import { buildEventLoopDoc, deriveState, PRESETS, type TraceEvent } from '@/lib/event-loop'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

function narrate(e: TraceEvent | null, s: ReturnType<typeof els>): string {
  if (!e) return ''
  const map: Partial<Record<TraceEvent['type'], string>> = {
    'script-start': s.narrateScriptStart,
    'script-sync-end': s.narrateScriptSyncEnd,
    log: s.narrateLog,
    'timer-queued': s.narrateTimerQueued,
    'timer-fire-start': s.narrateTimerFireStart,
    'timer-fire-end': s.narrateTimerFireEnd,
    'microtask-queued': s.narrateMicrotaskQueued,
    'microtask-run-start': s.narrateMicrotaskRunStart,
    'microtask-run-end': s.narrateMicrotaskRunEnd,
    error: s.narrateError,
  }
  let text = map[e.type] ?? ''
  if (e.delay !== undefined) text = text.replace('{delay}', String(e.delay))
  if (e.text !== undefined) text = text.replace('{text}', e.text)
  return text
}

function QueueBox({ title, items, empty, colorClass }: { title: string; items: { id: number; label: string; delay?: number }[]; empty: string; colorClass: string }) {
  return (
    <div className={cn('rounded-lg border p-3', colorClass)}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide">{title}</p>
      <div className="flex min-h-12 flex-wrap gap-1.5">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.7, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className="rounded-md border bg-background px-2 py-1 font-mono text-xs shadow-sm"
            >
              {item.label}{item.delay !== undefined ? ` (${item.delay}ms)` : ''}
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && <p className="text-xs italic text-muted-foreground">{empty}</p>}
      </div>
    </div>
  )
}

export function EventLoopDemo({ locale }: { locale: Locale }) {
  const s = els(locale)
  const [code, setCode] = useState(PRESETS[0].code)
  const [events, setEvents] = useState<TraceEvent[]>([])
  const [running, setRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  function loadPreset(id: string) {
    const p = PRESETS.find((p) => p.id === id) ?? PRESETS[0]
    setCode(p.code)
    setEvents([])
    setStepIndex(-1)
    setPlaying(false)
  }

  function run() {
    setEvents([])
    setStepIndex(-1)
    setPlaying(false)
    setRunning(true)
    if (iframeRef.current) iframeRef.current.srcdoc = buildEventLoopDoc(code)
  }

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== iframeRef.current?.contentWindow) return
      const data = e.data
      if (!data || data.source !== 'eventloop') return
      if (data.event) setEvents((prev) => [...prev, data.event as TraceEvent])
      else if (data.done) setRunning(false)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Track the latest event live while the trace is still recording.
  useEffect(() => {
    if (running) setStepIndex(events.length - 1)
  }, [events, running])

  useEffect(() => {
    if (!playing) return
    if (stepIndex >= events.length - 1) { setPlaying(false); return }
    const id = setTimeout(() => setStepIndex((i) => Math.min(events.length - 1, i + 1)), 900 / speed)
    return () => clearTimeout(id)
  }, [playing, stepIndex, events.length, speed])

  const state = useMemo(() => deriveState(events, stepIndex), [events, stepIndex])
  const currentEvent = stepIndex >= 0 && stepIndex < events.length ? events[stepIndex] : null

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/javascript' : '/javascript'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <p className="mx-auto mt-6 flex max-w-2xl items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
        {s.realNote}
      </p>

      <div className="mt-6 space-y-4">
        <Section title={s.code} action={<Button size="sm" onClick={run} disabled={running}>{running ? s.running : s.run}</Button>}>
          <div>
            <span className="mb-1 block text-xs text-muted-foreground">{s.preset}</span>
            <SegmentedControl value="" onChange={loadPreset} options={PRESETS.map((p) => ({ value: p.id, label: p.label }))} />
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="h-48 w-full resize-y rounded-md border bg-background p-3 font-mono text-sm leading-relaxed"
          />
          <iframe ref={iframeRef} sandbox="allow-scripts" className="hidden" title="event-loop-sandbox" />
        </Section>

        {events.length > 0 && (
          <>
            <Section title={s.visualization}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border-2 border-blue-500/40 bg-blue-500/5 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">{s.callStack}</p>
                  <div className="flex min-h-12 flex-col-reverse gap-1.5">
                    <AnimatePresence initial={false}>
                      {state.callStack.map((frame, i) => (
                        <motion.div
                          key={`${i}-${frame}`}
                          layout
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-md border border-blue-500/50 bg-background px-2 py-1 font-mono text-xs shadow-sm"
                        >
                          {frame}()
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {state.callStack.length === 0 && <p className="text-xs italic text-muted-foreground">{s.callStackEmpty}</p>}
                  </div>
                </div>

                <QueueBox title={s.webApis} items={state.webApis} empty={s.webApisEmpty} colorClass="border-2 border-purple-500/40 bg-purple-500/5 text-purple-700 dark:text-purple-400" />
                <QueueBox title={s.microtaskQueue} items={state.microtaskQueue} empty={s.microtaskQueueEmpty} colorClass="border-2 border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400" />

                <div className="rounded-lg border-2 border-slate-400/40 bg-slate-400/5 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">{s.console}</p>
                  <div className="flex min-h-12 flex-col gap-1">
                    <AnimatePresence initial={false}>
                      {state.consoleLines.map((line) => (
                        <motion.div
                          key={line.seq}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-mono text-xs"
                        >
                          {'> '}{line.text}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {state.consoleLines.length === 0 && <p className="text-xs italic text-muted-foreground">{s.consoleEmpty}</p>}
                  </div>
                </div>
              </div>
            </Section>

            <Section title={s.narration}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="min-h-10 text-sm"
                >
                  {narrate(currentEvent, s)}
                </motion.p>
              </AnimatePresence>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Button size="sm" variant="outline" disabled={stepIndex <= 0} onClick={() => { setPlaying(false); setStepIndex((i) => Math.max(0, i - 1)) }}>
                  <ArrowLeft className="size-3.5" /> {s.prev}
                </Button>
                <span className="text-xs text-muted-foreground">{s.step} {Math.max(0, stepIndex + 1)} {s.of} {events.length}</span>
                <Button size="sm" variant="outline" disabled={stepIndex >= events.length - 1} onClick={() => { setPlaying(false); setStepIndex((i) => Math.min(events.length - 1, i + 1)) }}>
                  {s.next} <ArrowRight className="size-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setPlaying((p) => !p)} disabled={stepIndex >= events.length - 1 && !playing}>
                  {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />} {playing ? s.pause : s.play}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setPlaying(false); setStepIndex(0) }}>
                  <RotateCcw className="size-3.5" /> {s.reset}
                </Button>
                <div className="ml-auto w-32">
                  <Slider label={s.speed} value={speed} min={0.5} max={3} step={0.5} suffix="x" onChange={setSpeed} />
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">{s.recorded.replace('{n}', String(events.length))}</p>
            </Section>
          </>
        )}

        <Section title={s.howItWorks}>
          <p className="text-xs text-muted-foreground">{s.howItWorksBody}</p>
        </Section>
      </div>
    </div>
  )
}
