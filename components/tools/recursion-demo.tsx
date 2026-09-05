'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl, Slider } from '@/components/tools/tool-controls'
import { rvs } from '@/lib/recursion-i18n'
import { buildRecursionDoc, deriveState, frameLabel, PRESETS, type TraceEvent, type PresetId } from '@/lib/recursion'
import type { Locale } from '@/lib/types'

function narrate(e: TraceEvent | null, s: ReturnType<typeof rvs>): string {
  if (!e) return ''
  const argsStr = (e.args ?? []).map(String).join(', ')
  if (e.type === 'call') return s.narrateCall.replace('{name}', e.name).replace('{args}', argsStr)
  if (e.type === 'return') return s.narrateReturn.replace('{name}', e.name).replace('{args}', argsStr).replace('{result}', String(e.result))
  if (e.type === 'error') return s.narrateError.replace('{text}', e.text ?? '')
  return ''
}

export function RecursionDemo({ locale }: { locale: Locale }) {
  const s = rvs(locale)
  const [presetId, setPresetId] = useState<PresetId>('sum')
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]
  const [n, setN] = useState(preset.defaultN)
  const [editMode, setEditMode] = useState(false)
  const [customCode, setCustomCode] = useState(preset.buildCode(preset.defaultN))
  const [events, setEvents] = useState<TraceEvent[]>([])
  const [running, setRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  function loadPreset(id: PresetId) {
    const p = PRESETS.find((pp) => pp.id === id) ?? PRESETS[0]
    setPresetId(id)
    setN(p.defaultN)
    setEditMode(false)
    setEvents([])
    setStepIndex(-1)
    setPlaying(false)
  }
  function updateN(v: number) {
    setN(v)
    setEvents([])
    setStepIndex(-1)
    setPlaying(false)
  }
  function toggleEdit() {
    if (!editMode) setCustomCode(preset.buildCode(n))
    setEditMode((v) => !v)
    setEvents([])
    setStepIndex(-1)
    setPlaying(false)
  }

  function run() {
    setEvents([])
    setStepIndex(-1)
    setPlaying(false)
    setRunning(true)
    const code = editMode ? customCode : preset.buildCode(n)
    if (iframeRef.current) iframeRef.current.srcdoc = buildRecursionDoc(code)
  }

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== iframeRef.current?.contentWindow) return
      const data = e.data
      if (!data || data.source !== 'recursion') return
      const evs = (data.events ?? []) as TraceEvent[]
      setEvents(evs)
      setRunning(false)
      if (evs.length) {
        setStepIndex(0)
        setPlaying(true) // auto-play once so "Run" is an immediate animated payoff
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (!playing) return
    if (stepIndex >= events.length - 1) { setPlaying(false); return }
    const id = setTimeout(() => setStepIndex((i) => Math.min(events.length - 1, i + 1)), 500 / speed)
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
          <Link href={locale === 'bn' ? '/bn/programming' : '/programming'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <p className="mx-auto mt-6 flex max-w-2xl items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
        {s.realNote}
      </p>

      <div className="mt-6 space-y-4">
        <Section
          title={s.code}
          action={
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" onClick={toggleEdit}>{s.editCode}</Button>
              <Button size="sm" onClick={run} disabled={running}>{running ? s.running : s.run}</Button>
            </div>
          }
        >
          <div>
            <span className="mb-1 block text-xs text-muted-foreground">{s.preset}</span>
            <SegmentedControl
              value={presetId}
              onChange={loadPreset}
              options={[
                { value: 'sum', label: s.presetSum },
                { value: 'factorial', label: s.presetFactorial },
                { value: 'fibonacci', label: s.presetFibonacci },
              ]}
            />
          </div>
          {!editMode && <Slider label={s.input} value={n} min={preset.minN} max={preset.maxN} step={1} onChange={updateN} />}
          {editMode ? (
            <textarea
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              spellCheck={false}
              className="h-48 w-full resize-y rounded-md border bg-background p-3 font-mono text-sm leading-relaxed"
            />
          ) : (
            <pre className="max-h-48 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed"><code>{preset.buildCode(n)}</code></pre>
          )}
          <iframe ref={iframeRef} sandbox="allow-scripts" className="hidden" title="recursion-sandbox" />
        </Section>

        {events.length > 0 && (
          <>
            <Section title={s.visualization}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border-2 border-blue-500/40 bg-blue-500/5 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">{s.callStack}</p>
                  <div className="flex min-h-12 flex-col-reverse gap-1.5">
                    <AnimatePresence initial={false}>
                      {state.callStack.map((frame) => (
                        <motion.div
                          key={frame.id}
                          layout
                          initial={{ opacity: 0, x: -12, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 12, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-md border border-blue-500/50 bg-background px-2 py-1 font-mono text-xs shadow-sm"
                        >
                          {frameLabel(frame)}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {state.callStack.length === 0 && <p className="text-xs italic text-muted-foreground">{s.callStackEmpty}</p>}
                  </div>
                </div>

                <div className="rounded-lg border-2 border-emerald-500/40 bg-emerald-500/5 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{s.callLog}</p>
                  <div className="flex min-h-12 flex-col gap-1">
                    <AnimatePresence initial={false}>
                      {state.log.map((entry) => (
                        <motion.div
                          key={entry.seq}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-mono text-xs"
                        >
                          {entry.text}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {state.log.length === 0 && <p className="text-xs italic text-muted-foreground">{s.callLogEmpty}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span>{s.totalCalls}: <span className="font-mono font-semibold text-foreground">{state.totalCalls}</span></span>
                <span>{s.maxDepth}: <span className="font-mono font-semibold text-foreground">{state.maxDepth}</span></span>
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
            </Section>
          </>
        )}

        {state.errors.length > 0 && (
          <Section title={s.errors}>
            {state.errors.map((err, i) => <p key={i} className="text-xs text-destructive">{err}</p>)}
          </Section>
        )}

        <Section title={s.howItWorks}>
          <p className="text-xs text-muted-foreground">{s.howItWorksBody}</p>
        </Section>
      </div>
    </div>
  )
}
