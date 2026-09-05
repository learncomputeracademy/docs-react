'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/tools/tool-controls'
import { tts } from '@/lib/typing-test-i18n'
import { LESSONS, lessonIndex, type Lesson } from '@/lib/typing-test-lessons'
import { wordCells, calculateWpm, calculateAccuracy, loadLessonProgress, saveLessonResult, type LessonProgress } from '@/lib/typing-test-engine'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

export function LessonsApp({ locale }: { locale: Locale }) {
  const s = tts(locale)
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({})
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => { setProgress(loadLessonProgress()) }, [])

  const active = activeId ? LESSONS.find((l) => l.id === activeId) : null

  function finishLesson(wpm: number, accuracy: number) {
    if (!active) return
    setProgress(saveLessonResult(active.id, wpm, accuracy))
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.lessonsTitle}</h1>
        <p className="mt-3 text-muted-foreground">{s.lessonsSubtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/typing-test' : '/typing-test'}>{s.backToTypingTest}</Link>
        </Button>
      </header>

      {active ? (
        <LessonRunner
          key={active.id}
          lesson={active}
          locale={locale}
          s={s}
          onComplete={finishLesson}
          onNext={() => {
            const idx = lessonIndex(active.id)
            const next = LESSONS[idx + 1]
            setActiveId(next ? next.id : null)
          }}
          onBack={() => setActiveId(null)}
          hasNext={lessonIndex(active.id) < LESSONS.length - 1}
        />
      ) : (
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
          {LESSONS.map((lesson, i) => {
            const p = progress[lesson.id]
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setActiveId(lesson.id)}
                className="flex items-center justify-between gap-3 rounded-lg border p-4 text-left hover:border-primary/50 hover:bg-accent/50"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-medium">
                    {p?.completed && <CheckCircle2 className="size-4 text-primary" />}
                    {i + 1}. {locale === 'bn' ? lesson.titleBn : lesson.title}
                  </div>
                  {p && <div className="mt-1 text-xs text-muted-foreground">{s.lessonBest}: {p.bestWpm} wpm · {p.bestAccuracy}%</div>}
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function LessonRunner({
  lesson, locale, s, onComplete, onNext, onBack, hasNext,
}: {
  lesson: Lesson
  locale: Locale
  s: ReturnType<typeof tts>
  onComplete: (wpm: number, accuracy: number) => void
  onNext: () => void
  onBack: () => void
  hasNext: boolean
}) {
  const words = lesson.text.split(' ')
  const [wordIndex, setWordIndex] = useState(0)
  const [typedWords, setTypedWords] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const [stats, setStats] = useState<{ wpm: number; accuracy: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { requestAnimationFrame(() => inputRef.current?.focus()) }, [])

  function finish(finalInput: string) {
    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0.001
    const allTyped = [...typedWords]
    allTyped[wordIndex] = finalInput
    let correct = 0, total = 0
    for (let i = 0; i < allTyped.length; i++) {
      for (const cell of wordCells(words[i] ?? '', allTyped[i] ?? '')) {
        total++
        if (cell.status === 'correct') correct++
      }
      // Space between words counts as one correctly-typed character too —
      // real bug, caught live: this incremented `correct` without a
      // matching `total`, so accuracy (correct/total) could read over
      // 100%. Both must move together.
      if (i < allTyped.length - 1) { correct++; total++ }
    }
    const wpm = calculateWpm(correct, elapsed)
    const accuracy = calculateAccuracy(correct, total)
    setStats({ wpm, accuracy })
    setDone(true)
    onComplete(wpm, accuracy)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (done) return
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (currentInput.length > 0) setCurrentInput((v) => v.slice(0, -1))
      else if (wordIndex > 0) {
        setWordIndex((i) => i - 1)
        setCurrentInput(typedWords[wordIndex - 1] ?? '')
        setTypedWords((tw) => tw.slice(0, -1))
      }
      return
    }
    if (e.key === ' ') {
      e.preventDefault()
      if (currentInput.length === 0) return
      if (wordIndex === words.length - 1) { finish(currentInput); return }
      setTypedWords((tw) => { const n = [...tw]; n[wordIndex] = currentInput; return n })
      setWordIndex((i) => i + 1)
      setCurrentInput('')
      return
    }
    if (e.key.length !== 1) return
    if (!startTime) setStartTime(Date.now())
    const target = words[wordIndex] ?? ''
    const next = currentInput + e.key
    setCurrentInput(next)
    if (wordIndex === words.length - 1 && next.length >= target.length) {
      setTimeout(() => finish(next), 0)
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {locale === 'bn' ? lesson.titleBn : lesson.title}
      </h2>

      {!done ? (
        <div className="relative mt-4" onClick={() => inputRef.current?.focus()}>
          <input ref={inputRef} type="text" autoFocus value={currentInput} onKeyDown={handleKeyDown} onChange={() => {}} onPaste={(e) => e.preventDefault()} className="absolute inset-0 h-1 w-1 opacity-0" aria-label="lesson typing input" />
          <p className="flex flex-wrap gap-x-[0.5ch] gap-y-1.5 rounded-lg border p-4 font-mono text-xl leading-relaxed">
            {words.map((w, wi) => {
              const typed = wi === wordIndex ? currentInput : (typedWords[wi] ?? '')
              const cells = wi <= wordIndex ? wordCells(w, typed) : w.split('').map((c) => ({ char: c, status: 'pending' as const }))
              const caretPos = wi === wordIndex ? currentInput.length : -1
              const caret = <span className="inline-block h-[1.2em] w-0.5 animate-pulse rounded-full bg-primary align-middle" />
              return (
                <span key={wi} className={cn('relative', wi === wordIndex && 'rounded bg-primary/5 px-0.5')}>
                  {cells.map((cell, ci) => (
                    <span key={ci} className="inline-flex items-center">
                      {ci === caretPos && caret}
                      <span className={cn(
                        cell.status === 'correct' && 'text-foreground',
                        cell.status === 'incorrect' && 'text-destructive underline decoration-destructive',
                        cell.status === 'extra' && 'text-destructive/70',
                        cell.status === 'pending' && 'text-muted-foreground/50'
                      )}>{cell.char}</span>
                    </span>
                  ))}
                  {caretPos >= cells.length && caret}
                </span>
              )
            })}
          </p>
        </div>
      ) : (
        <Section title={s.lessonDone}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3 text-center">
              <div className="font-mono text-2xl font-bold text-primary">{stats?.wpm}</div>
              <div className="text-xs text-muted-foreground">{s.wpm}</div>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <div className="font-mono text-2xl font-bold">{stats?.accuracy}%</div>
              <div className="text-xs text-muted-foreground">{s.accuracy}</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onBack}>{s.lessonBackToList}</Button>
            {hasNext && <Button size="sm" onClick={onNext}>{s.lessonNext} <ArrowRight className="size-3.5" /></Button>}
          </div>
        </Section>
      )}

      {!done && (
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={onBack}><RotateCcw className="size-3.5" /> {s.lessonBackToList}</Button>
        </div>
      )}
    </div>
  )
}
