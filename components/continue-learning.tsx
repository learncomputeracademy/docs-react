'use client'

import Link from '@/components/hover-link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompleted, useContinueTarget } from '@/lib/progress'
import { ProgressRing } from '@/components/progress-marks'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/types'

// Hero primary button: "Start learning" for new visitors, "Continue learning"
// for returning ones. Fixed short label so it never wraps the button row; the
// lesson title goes in ProgressLine below.
export function ContinueButton({ startHref, prefix, locale }: { startHref: string; prefix: string; locale: Locale }) {
  const target = useContinueTarget()
  const s = t(locale)
  return (
    <Button asChild size="lg">
      <Link href={target ? `${prefix}/${target.path}` : startHref}>
        {target ? s.continueLearning : s.startLearning}
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

// With a lesson to continue: "Next up: <title> · 27/730 done". When that
// lesson opens a new category, name the category instead ("Next subject:
// Git & GitHub") — a first-chapter title alone doesn't say what it's about.
export function ProgressLine({ paths, prefix, locale, fallback, subjectTitles }: { paths: string[]; prefix: string; locale: Locale; fallback: string; subjectTitles: Record<string, string> }) {
  const done = useDoneCount(paths)
  const target = useContinueTarget()
  const total = paths.length
  const s = t(locale)
  if (!done && !target) return <p className="mt-4 text-sm text-muted-foreground">{fallback}</p>
  return (
    <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
      <span className="mt-0.5"><ProgressRing done={done} total={total} /></span>
      <span>
        {target ? (
          <>
            {target.newSubject ? s.nextSubject : s.nextUp}:{' '}
            <Link href={`${prefix}/${target.path}`} className="font-medium text-foreground underline-offset-4 hover:underline">
              {(target.newSubject && subjectTitles[target.path.split('/')[0]]) || target.title}
            </Link>
            {done > 0 && (
              <>
                {' · '}
                <Link href={`${prefix}/progress`} className="underline-offset-4 hover:text-foreground hover:underline">
                  {s.doneShort(done, total)}
                </Link>
              </>
            )}
          </>
        ) : (
          <Link href={`${prefix}/progress`} className="underline-offset-4 hover:text-foreground hover:underline">
            {s.lessonsDone(done, total)}
          </Link>
        )}
      </span>
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
