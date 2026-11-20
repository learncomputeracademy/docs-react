'use client'

import { useEffect, useState } from 'react'
import { justCompleted, useCompleted } from '@/lib/progress'
import type { SidebarCategory } from '@/lib/content'
import type { Locale } from '@/lib/types'

// Fires once, at the moment the lesson that finishes a whole category is
// completed: confetti + a short toast. Never on page load — justCompleted
// is only set by a completion in this tab. Mounted by the category layouts
// (not the sidebar, which isn't mounted on mobile while its sheet is closed).
export function CategoryCelebration({ categories, locale }: { categories: SidebarCategory[]; locale: Locale }) {
  const completed = useCompleted()
  const [done, setDone] = useState<{ title: string; count: number } | null>(null)

  useEffect(() => {
    if (!justCompleted || !completed.has(justCompleted)) return
    const cat = categories.find((c) => c.docs.some((d) => d.path === justCompleted))
    if (!cat || !cat.docs.every((d) => completed.has(d.path))) return
    // Same lesson can't celebrate twice (e.g. re-render, or store event from another tab).
    const key = `celebrated:${cat.slug}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to an external store change
    setDone({ title: cat.title, count: cat.docs.length })
    import('canvas-confetti').then(({ default: confetti }) => {
      const opts = { disableForReducedMotion: true, colors: ['#f97316', '#f59e0b', '#10b981', '#ffffff'] }
      confetti({ ...opts, particleCount: 90, spread: 70, startVelocity: 45, origin: { x: 0.5, y: 0.9 } })
      setTimeout(() => {
        confetti({ ...opts, particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.8 } })
        confetti({ ...opts, particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.8 } })
      }, 250)
    })
    const t = setTimeout(() => setDone(null), 4500)
    return () => clearTimeout(t)
  }, [completed, categories])

  if (!done) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-celebrate-in fixed inset-x-0 bottom-20 z-50 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-full border border-amber-500/40 bg-background/90 px-5 py-2.5 text-sm font-medium shadow-lg backdrop-blur-md md:bottom-8"
    >
      🎉 {locale === 'bn' ? `${done.title} সম্পূর্ণ! ${done.count}টি পাঠ শেষ` : `${done.title} complete! All ${done.count} lessons done`}
    </div>
  )
}
