'use client'

import { useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Check, RotateCcw, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PASS_RATIO, recordQuiz, setCompleted, useQuizResult } from '@/lib/progress'
import { t } from '@/lib/i18n'
import { trackEvent } from '@/lib/analytics'
import type { QuizQuestion } from '@/lib/types'

// End-of-lesson quiz. Questions are in the server HTML (props of a client
// component render on the server too); answering is client state only.
// Each question locks after one pick and shows right/wrong + explanation.
// When all are answered: score, XP (first attempt only), and a pass
// (>= 70%) marks the lesson complete, which also feeds the streak.
export function Quiz({ id, questions }: { id: string; questions: QuizQuestion[] }) {
  const pathname = usePathname()
  const locale = pathname.startsWith('/bn') ? 'bn' : 'en'
  const docPath = pathname.replace(/^\/bn(\/|$)/, '/').replace(/^\/|\/$/g, '')
  const key = `${docPath}#${id}`
  const s = t(locale)
  const result = useQuizResult(key)

  const [picks, setPicks] = useState<(number | null)[]>(() => questions.map(() => null))
  // Mirror of picks for the click handler, so two picks before a re-render
  // can't overwrite each other through a stale closure.
  const picksRef = useRef(picks)
  const [earned, setEarned] = useState<number | null>(null)
  const [attempt, setAttempt] = useState(0)

  const total = questions.length
  const score = picks.filter((p, i) => p === questions[i].answer).length
  const finished = picks.every((p) => p !== null)
  const need = Math.ceil(total * PASS_RATIO)
  const passed = score >= need

  function pick(qi: number, oi: number) {
    if (picksRef.current[qi] !== null) return
    const next = picksRef.current.map((p, i) => (i === qi ? oi : p))
    picksRef.current = next
    setPicks(next)
    if (next.every((p) => p !== null)) {
      const finalScore = next.filter((p, i) => p === questions[i].answer).length
      const xp = recordQuiz(key, finalScore, total)
      setEarned(xp)
      if (finalScore >= need) setCompleted(docPath, true)
      trackEvent('quiz_complete', {
        lesson: docPath,
        locale,
        score: finalScore,
        total,
        percent: Math.round((finalScore / total) * 100),
        result: finalScore >= need ? 'pass' : 'fail',
        attempt: attempt + 1,
        xp,
      })
      if (finalScore === total) {
        import('canvas-confetti').then(({ default: confetti }) =>
          confetti({ disableForReducedMotion: true, particleCount: 60, spread: 60, origin: { y: 0.8 }, colors: ['#f97316', '#10b981', '#ffffff'] }),
        )
      }
    }
  }

  function retry() {
    picksRef.current = questions.map(() => null)
    setPicks(picksRef.current)
    setEarned(null)
    setAttempt((a) => a + 1)
  }

  return (
    <section aria-label={s.quizTitle} className="not-prose my-10 rounded-xl border bg-card p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">{s.quizTitle}</h2>
        {result && <span className="text-sm text-muted-foreground tabular-nums">{s.quizBest(result.best, result.total)}</span>}
      </div>

      <ol key={attempt} className="mt-5 space-y-6">
        {questions.map((q, qi) => {
          const chosen = picks[qi]
          const answered = chosen !== null
          return (
            <li key={q.id}>
              <div className="flex gap-2 font-medium [&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-[0.9em]">
                <span className="text-muted-foreground tabular-nums">{qi + 1}.</span>
                <div className="min-w-0 [&_pre]:mt-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:text-sm" dangerouslySetInnerHTML={{ __html: q.prompt }} />
              </div>
              <div role="group" className="mt-3 grid gap-2">
                {q.options.map((opt, oi) => {
                  const isAnswer = oi === q.answer
                  const isChosen = oi === chosen
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={answered}
                      aria-pressed={isChosen}
                      onClick={() => pick(qi, oi)}
                      className={cn(
                        'flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm sm:px-4 transition-colors [&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1',
                        !answered && 'hover:border-primary/50 hover:bg-accent/50',
                        answered && isAnswer && 'border-emerald-500/60 bg-emerald-500/10',
                        answered && isChosen && !isAnswer && 'animate-quiz-shake border-destructive/60 bg-destructive/10',
                        answered && !isAnswer && !isChosen && 'opacity-60',
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold text-muted-foreground',
                          answered && isAnswer && 'animate-check-pop border-emerald-500 bg-emerald-500 text-white',
                          answered && isChosen && !isAnswer && 'border-destructive bg-destructive text-white',
                        )}
                        aria-hidden
                      >
                        {answered && isAnswer ? <Check className="size-3" /> : answered && isChosen ? <X className="size-3" /> : String.fromCharCode(65 + oi)}
                      </span>
                      <span className="min-w-0" dangerouslySetInnerHTML={{ __html: opt }} />
                    </button>
                  )
                })}
              </div>
              {answered && q.explain && (
                <div
                  className="animate-fade-in mt-2 rounded-md bg-muted/60 px-4 py-2.5 text-sm text-muted-foreground [&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1"
                  dangerouslySetInnerHTML={{ __html: q.explain }}
                />
              )}
            </li>
          )
        })}
      </ol>

      {finished && (
        <div role="status" className="animate-celebrate-in mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <div>
            <p className="font-semibold tabular-nums">{s.quizScore(score, total)}</p>
            <p className={cn('text-sm', passed ? 'text-emerald-600 dark:text-emerald-500' : 'text-muted-foreground')}>
              {passed ? s.quizPassed : s.quizNeed(need)}
              {earned ? <span className="ml-2 font-semibold text-primary">{s.quizXp(earned)}</span> : null}
            </p>
          </div>
          {score < total && (
            <button
              type="button"
              onClick={retry}
              className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent/50"
            >
              <RotateCcw className="size-4" /> {s.quizRetry}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
