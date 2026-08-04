'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { startRouteProgress } from '@/components/magic/route-progress'

type Adjacent = { path: string; title: string } | null

export function LessonPagination({
  prev,
  next,
  prefix,
  previousLabel,
  nextLabel,
}: {
  prev: Adjacent
  next: Adjacent
  prefix: string
  previousLabel: string
  nextLabel: string
}) {
  const router = useRouter()

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
    <div className="mt-12 grid grid-cols-2 gap-4 border-t pt-6">
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
  )
}
