'use client'

import { cn } from '@/lib/utils'
import { justCompleted } from '@/lib/progress'

// Check that draws its own stroke — only for the lesson finished just now.
export function DoneCheck({ path }: { path: string }) {
  const animate = justCompleted === path
  return (
    <svg viewBox="0 0 16 16" className="shrink-0 text-emerald-500" aria-label="Completed" role="img">
      <circle cx="8" cy="8" r="7" className={cn('fill-emerald-500/15', animate && 'animate-check-pop')} />
      <path
        d="M4.8 8.3l2.1 2.1 4.3-4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className={cn(animate && 'animate-check-draw')}
        style={{ strokeDasharray: 1 }}
      />
    </svg>
  )
}

// Ring that fills as the category progresses; transitions on every change,
// including 0 → stored value right after hydration.
export function ProgressRing({ done, total }: { done: number; total: number }) {
  const pct = total ? done / total : 0
  const full = pct === 1
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0 -rotate-90" aria-hidden>
      <circle cx="10" cy="10" r="8" fill="none" strokeWidth="2.5" className="stroke-border" />
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        className={cn('transition-[stroke-dashoffset] duration-700 ease-out', full ? 'stroke-amber-500 drop-shadow-[0_0_3px_rgb(245_158_11)]' : 'stroke-primary', done === 0 && 'opacity-0')}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 - pct }}
      />
    </svg>
  )
}
