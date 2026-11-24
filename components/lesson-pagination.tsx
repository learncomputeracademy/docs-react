'use client'

import { useEffect, useRef, useState } from 'react'
import Link from '@/components/hover-link'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, PanelLeft } from 'lucide-react'
import { startRouteProgress } from '@/components/magic/route-progress'
import { useSidebar } from '@/components/magic/sidebar'
import { setCompleted, setLastLesson, useCompleted } from '@/lib/progress'
import { t } from '@/lib/i18n'

type Adjacent = { path: string; title: string } | null
type Position = { index: number; total: number } | null

export function LessonPagination({
  title,
  prev,
  next,
  prefix,
  previousLabel,
  nextLabel,
  position,
  browseLessonsLabel,
}: {
  title: string
  prev: Adjacent
  next: Adjacent
  prefix: string
  previousLabel: string
  nextLabel: string
  position: Position
  browseLessonsLabel: string
}) {
  const router = useRouter()
  const { toggleSidebar } = useSidebar()
  const docPath = usePathname().replace(/^\/bn(\/|$)/, '/').replace(/^\/|\/$/g, '')

  const s = t(prefix === '/bn' ? 'bn' : 'en')
  const done = useCompleted().has(docPath)
  // Set once the visitor toggles completion by hand on this visit, so the
  // scroll-to-end auto-complete doesn't immediately undo an "un-mark".
  const manual = useRef(false)
  function toggleDone() {
    manual.current = true
    setCompleted(docPath, !done)
  }

  useEffect(() => {
    setLastLesson({ path: docPath, title, next: next && { path: next.path, title: next.title } })
  }, [docPath, title, next])

  // Reading progress — how far down THIS lesson you are, not the whole
  // page (header/footer chrome above and below the article shouldn't
  // count). Drawn as a hairline along the top edge of the bottom bar.
  const [progress, setProgress] = useState(0)
  const articleRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    // Two nested <main> elements exist on a lesson page — SidebarInset's
    // outer layout shell, and this lesson's own — so an id is used instead
    // of the tag name to avoid grabbing the wrong (outer) one.
    articleRef.current = document.getElementById('lesson-article')
    manual.current = false
    let ticking = false
    function measure() {
      ticking = false
      const el = articleRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const scrolled = -rect.top
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 1
      setProgress(p)
      // Reaching the end of the lesson counts as finishing it.
      if (p >= 0.9 && !manual.current) setCompleted(docPath, true)
    }
    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(measure)
      }
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [docPath])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return

      if ((e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') && prev) {
        startRouteProgress()
        router.push(`${prefix}/${prev.path}`)
      } else if ((e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') && next) {
        startRouteProgress()
        router.push(`${prefix}/${next.path}`)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [prev, next, prefix, router])

  return (
    <>
      {/* Completion toggle — all widths. Auto-complete covers the usual case;
          this is for marking by hand or undoing it. */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t pt-6 text-sm">
        {done ? (
          <>
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-500">
              <Check className="size-4" /> {s.lessonCompleted}
            </span>
            <button type="button" onClick={toggleDone} className="-my-2 min-h-11 rounded-md px-2 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              {s.markNotDone}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={toggleDone}
            className="flex min-h-11 items-center gap-1.5 rounded-md border px-4 font-medium transition-colors hover:border-primary/40 hover:bg-accent/50"
          >
            <Check className="size-4" /> {s.markComplete}
          </button>
        )}
      </div>

      {/* Desktop/tablet — full cards with titles, room to spare. */}
      <div className="mt-6 hidden grid-cols-2 gap-4 md:grid">
        {prev ? (
          <Link href={`${prefix}/${prev.path}`} className="group flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-accent/50">
            <span className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ArrowLeft className="size-3.5" /> {previousLabel}
              </span>
              <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">← P</kbd>
            </span>
            <span className="font-medium group-hover:text-primary">{prev.title}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`${prefix}/${next.path}`} className="group flex flex-col items-end gap-1 rounded-lg border p-4 text-right transition-colors hover:border-primary/40 hover:bg-accent/50">
            <span className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
              <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">N →</kbd>
              <span className="flex items-center gap-1">
                {nextLabel} <ArrowRight className="size-3.5" />
              </span>
            </span>
            <span className="font-medium group-hover:text-primary">{next.title}</span>
          </Link>
        ) : <div />}
      </div>

      {/* Mobile — fixed bottom bar: sidebar + prev + next in one thin,
          glassy strip, so getting to the next lesson or the syllabus never
          needs a scroll to the bottom of a long page. A hairline along the
          top edge doubles as a reading-progress indicator for this lesson. */}
      <nav
        aria-label={browseLessonsLabel}
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-2 border-t bg-background px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.35)] md:hidden"
      >
        {/* Solid bar, Next as the filled main action (2026-11-24: the
            translucent grey version was hard to see). */}
        <div className="absolute inset-x-0 -top-px h-0.5 bg-border/40" aria-hidden>
          <div className="h-full bg-primary transition-[width] duration-150 ease-out" style={{ width: `${progress * 100}%` }} />
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={position ? `${browseLessonsLabel} — ${position.index}/${position.total}` : browseLessonsLabel}
          className="flex min-h-11 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl text-foreground transition-colors active:bg-accent"
        >
          <PanelLeft className="size-5" />
          <span className="text-xs font-semibold leading-none tabular-nums">
            {position ? `${position.index}/${position.total}` : browseLessonsLabel}
          </span>
        </button>
        {prev ? (
          <Link
            href={`${prefix}/${prev.path}`}
            className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border text-sm font-medium text-foreground transition-colors active:bg-accent"
          >
            <ArrowLeft className="size-4 shrink-0" />
            <span className="truncate">{previousLabel}</span>
          </Link>
        ) : (
          <div className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-dashed text-sm font-medium text-muted-foreground/50">
            <ArrowLeft className="size-4 shrink-0" />
            <span className="truncate">{previousLabel}</span>
          </div>
        )}
        {next ? (
          <Link
            href={`${prefix}/${next.path}`}
            className="flex min-h-11 flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-transform active:scale-[0.98]"
          >
            <span className="truncate">{nextLabel}</span>
            <ArrowRight className="size-4 shrink-0" />
          </Link>
        ) : (
          <div className="flex min-h-11 flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-muted text-sm font-medium text-muted-foreground/60">
            <span className="truncate">{nextLabel}</span>
            <ArrowRight className="size-4 shrink-0" />
          </div>
        )}
      </nav>
    </>
  )
}
