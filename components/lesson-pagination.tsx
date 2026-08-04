'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, PanelLeft } from 'lucide-react'
import { startRouteProgress } from '@/components/magic/route-progress'
import { useSidebar } from '@/components/magic/sidebar'

type Adjacent = { path: string; title: string } | null

export function LessonPagination({
  prev,
  next,
  prefix,
  previousLabel,
  nextLabel,
  menuLabel,
  browseLessonsLabel,
}: {
  prev: Adjacent
  next: Adjacent
  prefix: string
  previousLabel: string
  nextLabel: string
  menuLabel: string
  browseLessonsLabel: string
}) {
  const router = useRouter()
  const { toggleSidebar } = useSidebar()

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
      {/* Desktop/tablet — full cards with titles, room to spare. */}
      <div className="mt-12 hidden grid-cols-2 gap-4 border-t pt-6 md:grid">
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
          needs a scroll to the bottom of a long page. */}
      <nav
        aria-label={browseLessonsLabel}
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border/60 bg-background/75 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
      >
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={browseLessonsLabel}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-muted-foreground transition-colors active:bg-accent/60"
        >
          <PanelLeft className="size-4" />
          <span className="text-[10px] font-medium leading-none">{menuLabel}</span>
        </button>
        <div className="w-px shrink-0 bg-border/60" aria-hidden />
        {prev ? (
          <Link
            href={`${prefix}/${prev.path}`}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-muted-foreground transition-colors active:bg-accent/60"
          >
            <ArrowLeft className="size-4" />
            <span className="max-w-full truncate px-2 text-[10px] font-medium leading-none">{previousLabel}</span>
          </Link>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-muted-foreground/30">
            <ArrowLeft className="size-4" />
            <span className="text-[10px] font-medium leading-none">{previousLabel}</span>
          </div>
        )}
        <div className="w-px shrink-0 bg-border/60" aria-hidden />
        {next ? (
          <Link
            href={`${prefix}/${next.path}`}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-muted-foreground transition-colors active:bg-accent/60"
          >
            <ArrowRight className="size-4" />
            <span className="max-w-full truncate px-2 text-[10px] font-medium leading-none">{nextLabel}</span>
          </Link>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-muted-foreground/30">
            <ArrowRight className="size-4" />
            <span className="text-[10px] font-medium leading-none">{nextLabel}</span>
          </div>
        )}
      </nav>
    </>
  )
}
