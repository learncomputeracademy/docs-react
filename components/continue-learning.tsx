'use client'

import Link from '@/components/hover-link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompleted, useContinueTarget } from '@/lib/progress'
import { ProgressRing } from '@/components/progress-marks'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/types'

// Hero primary button: "Start learning" for new visitors, "Continue: <lesson>"
// for returning ones. Same size either way, so nothing shifts on hydration.
export function ContinueButton({ startHref, prefix, locale }: { startHref: string; prefix: string; locale: Locale }) {
  const target = useContinueTarget()
  const s = t(locale)
  return (
    <Button asChild size="lg" className="max-w-full">
      <Link href={target ? `${prefix}/${target.path}` : startHref}>
        <span className="truncate">{target ? `${s.continueLesson}: ${target.title}` : s.startLearning}</span>
        <ArrowRight className="size-4" />
      </Link>
    </Button>
  )
}

// Line under the hero buttons: site totals for new visitors, own progress for returning ones.
// Counts only paths that exist today, so finished-then-removed lessons don't inflate it.
function useDoneCount(paths: string[]) {
  const completed = useCompleted()
  return paths.filter((p) => completed.has(p)).length
}

export function ProgressLine({ paths, locale, fallback }: { paths: string[]; locale: Locale; fallback: string }) {
  const done = useDoneCount(paths)
  const total = paths.length
  if (!done) return <p className="mt-4 text-sm text-muted-foreground">{fallback}</p>
  return (
    <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
      <ProgressRing done={done} total={total} />
      {t(locale).lessonsDone(done, total)}
    </p>
  )
}

// "4/49" + ring for a subject card; plain lesson count until something is done.
export function CategoryProgress({ paths, label }: { paths: string[]; label: string }) {
  const done = useDoneCount(paths)
  const total = paths.length
  if (!done) return <>{total} {label}</>
  return (
    <span className="flex items-center gap-1.5 tabular-nums">
      <ProgressRing done={done} total={total} />
      {done}/{total}
    </span>
  )
}

export function LessonTick({ path }: { path: string }) {
  const done = useCompleted().has(path)
  if (!done) return null
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-emerald-500" aria-label="Completed" role="img">
      <circle cx="8" cy="8" r="7" className="fill-emerald-500/15" />
      <path d="M4.8 8.3l2.1 2.1 4.3-4.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
