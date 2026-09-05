'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl, Slider } from '@/components/tools/tool-controls'
import { scs } from '@/lib/scope-closure-i18n'
import { buildScopeDoc, deriveState, formatVarValue, PRESETS, type TraceEvent, type ScopeType } from '@/lib/scope-closure'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

const SCOPE_COLOR: Record<ScopeType, string> = {
  global: 'border-slate-400/40 bg-slate-400/5 text-slate-600 dark:text-slate-400',
  function: 'border-blue-500/40 bg-blue-500/5 text-blue-700 dark:text-blue-400',
  block: 'border-purple-500/40 bg-purple-500/5 text-purple-700 dark:text-purple-400',
}

function narrate(e: TraceEvent | null, s: ReturnType<typeof scs>): string {
  if (!e) return ''
  if (e.type === 'log') return s.narrateLog.replace('{text}', e.text)
  return s.narrateSnapshot
}

export function ScopeClosureDemo({ locale }: { locale: Locale }) {
  const s = scs(locale)
  const [presetId, setPresetId] = useState(PRESETS[0].id)
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]
  const [events, setEvents] = useState<TraceEvent[]>([])
  const [running, setRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  function loadPreset(id: string) {
    setPresetId(id)
    setEvents([])
    setStepIndex(-1)
    setPlaying(false)
  }

  function run() {
    setEvents([])
    setStepIndex(-1)
    setPlaying(false)
    setRunning(true)
    if (iframeRef.current) iframeRef.current.srcdoc = buildScopeDoc(preset.code)
  }

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== iframeRef.current?.contentWindow) return
      const data = e.data
      if (!data || data.source !== 'scope') return
      if (data.event) setEvents((prev) => [...prev, data.event as TraceEvent])
      else if (data.done) setRunning(false)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (running) setStepIndex(events.length - 1)
  }, [events, running])

  useEffect(() => {
    if (!playing) return
    if (stepIndex >= events.length - 1) { setPlaying(false); return }
    const id = setTimeout(() => setStepIndex((i) => Math.min(events.length - 1, i + 1)), 700 / speed)
    return () => clearTimeout(id)
  }, [playing, stepIndex, events.length, speed])

  const state = useMemo(() => deriveState(events, stepIndex, preset.scopes), [events, stepIndex, preset.scopes])
  const currentEvent = stepIndex >= 0 && stepIndex < events.length ? events[stepIndex] : null

  const kindLabel: Record<string, string> = { var: s.kindVar, let: s.kindLet, const: s.kindConst, param: s.kindParam, function: s.kindFunction }

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
            <SegmentedControl
              value={presetId}
              onChange={loadPreset}
              options={PRESETS.map((p) => ({
                value: p.id,
                label: p.id === 'block-vs-function' ? s.presetBlockVsFunction
                  : p.id === 'hoisting' ? s.presetHoisting
                  : p.id === 'closure-counter' ? s.presetClosureCounter
                  : s.presetLoopClosure,
              }))}
            />
          </div>
          <pre className="max-h-56 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed"><code>{preset.code}</code></pre>
          <iframe ref={iframeRef} sandbox="allow-scripts" className="hidden" title="scope-sandbox" />
        </Section>

        {events.length > 0 && (
          <>
            <Section title={s.visualization}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.scopeChain}</p>
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {state.scopeBoxes.map((box) => (
                    <motion.div
                      key={box.id}
                      layout
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.2 }}
                      className={cn('rounded-lg border-2 p-2.5', SCOPE_COLOR[box.type])}
                      style={{ marginLeft: `${state.scopeBoxes.indexOf(box) * 12}px` }}
                    >
                      <p className="mb-1 text-xs font-semibold">{box.label}</p>
                      {box.vars.length === 0 && <p className="text-xs italic opacity-60">—</p>}
                      <div className="flex flex-wrap gap-1.5">
                        {box.vars.map((v) => (
                          <span key={v.name} className="rounded-md border bg-background px-1.5 py-0.5 font-mono text-xs text-foreground">
                            {v.kind} {v.name} = {v.captured
                              ? formatVarValue(v.value)
                              : (v.kind === 'let' || v.kind === 'const') ? s.tdz : s.hoistedUndefined}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {state.scopeBoxes.length === 0 && <p className="text-xs italic text-muted-foreground">{s.scopeChainEmpty}</p>}
              </div>

              <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.console}</p>
              <div className="rounded-lg border bg-muted/30 p-2.5">
                <div className="flex min-h-8 flex-col gap-1">
                  <AnimatePresence initial={false}>
                    {state.logLines.map((line) => (
                      <motion.div key={line.seq} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="font-mono text-xs">
                        {'> '}{line.text}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {state.logLines.length === 0 && <p className="text-xs italic text-muted-foreground">{s.consoleEmpty}</p>}
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
