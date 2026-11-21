'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import StatusMark from '@/components/magic/status-mark'
import { justCompleted } from '@/lib/progress'

// Lesson-done tick: React Bits StatusMark. For the lesson finished just now it
// plays pending (dashed ring) to done (ring closes, check draws); every other
// completed lesson renders already done, no motion.
export function DoneCheck({ path }: { path: string }) {
  const [status, setStatus] = useState<'pending' | 'done'>(() => (justCompleted === path ? 'pending' : 'done'))
  useEffect(() => {
    if (status === 'done') return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setStatus('done')))
    return () => cancelAnimationFrame(id)
  }, [status])
  return <StatusMark status={status} size={16} color="#10b981" doneColor="#10b981" fillOpacity={0.15} className="shrink-0" />
}

// Ring that fills as the category progresses; transitions on every change,
// including 0 → stored value right after hydration.
export function ProgressRing({ done, total }: { done: number; total: number }) {
  const pct = total ? done / total : 0
  const full = pct === 1
  // A finished subject shows the same green done tick as a finished lesson
  // (owner request 2026-11-21), on the homepage cards and in the sidebar.
  if (full) return <StatusMark status="done" size={16} color="#10b981" doneColor="#10b981" fillOpacity={0.15} className="shrink-0" />
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
        className={cn('stroke-primary transition-[stroke-dashoffset] duration-700 ease-out', done === 0 && 'opacity-0')}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 - pct }}
      />
    </svg>
  )
}
