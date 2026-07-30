'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { TocItem } from '@/lib/types'

// Scroll-spy + a shared-layout sliding indicator between whichever heading
// is currently active — same idea as fumadocs' right-hand TOC
// (https://www.fumadocs.dev/docs). Tracks every heading currently inside a
// shrunk "active zone" near the top of the viewport (rootMargin), rather
// than just the entries IntersectionObserver happened to report this
// callback, so the highlight doesn't get stuck once you've scrolled past
// the last heading.
export function Toc({ items, title }: { items: TocItem[]; title: string }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null)

  useEffect(() => {
    const headingEls = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => !!el)
    if (headingEls.length === 0) return

    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const firstVisible = items.find((item) => visible.has(item.id))
        if (firstVisible) setActiveId(firstVisible.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    headingEls.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  return (
    <div className="sticky top-20 text-sm">
      <p className="mb-2 font-semibold">{title}</p>
      <ul className="relative space-y-1 border-l">
        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <li key={item.id} className="relative" style={{ paddingLeft: `${(item.level - 2) * 0.75 + 0.75}rem` }}>
              {isActive && (
                <motion.div
                  layoutId="toc-active-indicator"
                  className="absolute -left-px top-0 h-full w-px bg-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <a
                href={`#${item.id}`}
                className={cn('block py-0.5 transition-colors', isActive ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground')}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
