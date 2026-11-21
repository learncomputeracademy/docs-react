'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from '@/components/hover-link'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import { streakJustBumped, useStreak, useXp } from '@/lib/progress'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/types'

// Header flame, shown from a 2-day streak up. Pops when today's first lesson
// bumps it; every 7th day also shows a short toast.
export function StreakBadge({ locale }: { locale: Locale }) {
  const { count, best } = useStreak()
  const s = t(locale)
  const bumped = streakJustBumped
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (!bumped || count < 7 || count % 7 !== 0) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to an external store change
    setToast(true)
    const id = setTimeout(() => setToast(false), 4000)
    return () => clearTimeout(id)
  }, [bumped, count])

  if (count < 2) return null
  const title = s.streakTitle(count, best)
  return (
    <>
      <Link
        key={count}
        href={locale === 'bn' ? '/bn/progress' : '/progress'}
        title={title}
        aria-label={title}
        className={cn(
          'flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-1 text-xs font-semibold tabular-nums text-orange-500 sm:px-2.5 sm:text-sm',
          bumped && 'animate-streak-pop',
        )}
      >
        <Flame className={cn('size-4', count >= 7 && 'fill-orange-500/30')} aria-hidden />
        {count}
      </Link>
      {/* Portal: the sticky header's backdrop-blur makes it the containing
          block for fixed children, which would pin this toast to the header. */}
      {toast &&
        createPortal(
          <div
            role="status"
            className="animate-celebrate-in fixed inset-x-0 bottom-20 z-50 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-full border border-orange-500/40 bg-background/90 px-5 py-2.5 text-sm font-medium shadow-lg backdrop-blur-md md:bottom-8"
          >
            🔥 {s.streakMilestone(count)}
          </div>,
          document.body,
        )}
    </>
  )
}

// Quiz XP total, shown once any is earned. Compact on phones.
export function XpBadge({ locale }: { locale: Locale }) {
  const xp = useXp()
  if (!xp) return null
  const title = t(locale).xpTitle(xp)
  return (
    <Link
      href={locale === 'bn' ? '/bn/progress' : '/progress'}
      title={title}
      aria-label={title}
      className="flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold tabular-nums text-primary transition-colors hover:bg-primary/20 sm:px-2.5 sm:text-sm"
    >
      {xp} XP
    </Link>
  )
}
