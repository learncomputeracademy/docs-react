'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { BookOpen, Flame, GraduationCap, Lock, Sparkles, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { computeBadges, type Badge, type BadgeKind, type Subject } from '@/lib/badges'
import { useCompleted, useQuizResults, useStreak, useXp } from '@/lib/progress'
import type { Locale } from '@/lib/types'

const ICON: Record<BadgeKind, typeof BookOpen> = { lessons: BookOpen, quiz: Target, streak: Flame, xp: Sparkles, subject: GraduationCap }
const TONE: Record<BadgeKind, string> = {
  lessons: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  quiz: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  streak: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  xp: 'bg-primary/15 text-primary',
  subject: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
}

export function useBadges(subjects: Subject[], locale: Locale): Badge[] {
  const completed = useCompleted()
  const quizzes = useQuizResults()
  const { best } = useStreak()
  const xp = useXp()
  return computeBadges({ completed, quizzes, bestStreak: best, xp, subjects }, locale)
}

export function BadgeIcon({ badge, size = 'md' }: { badge: Badge; size?: 'md' | 'lg' }) {
  const Icon = badge.earned ? ICON[badge.kind] : Lock
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full',
        size === 'lg' ? 'size-14' : 'size-11',
        badge.earned ? TONE[badge.kind] : 'bg-muted text-muted-foreground',
      )}
      aria-hidden
    >
      <Icon className={size === 'lg' ? 'size-7' : 'size-5'} />
    </span>
  )
}

const SEEN_KEY = 'lca-badges-seen-v1'
const noopSubscribe = () => () => {}

// Shows "Badge unlocked" for badges earned during this visit. On the very
// first run it records everything already earned silently, so existing
// learners aren't hit with a burst of old badges.
export function BadgeWatcher({ subjects, locale }: { subjects: Subject[]; locale: Locale }) {
  const badges = useBadges(subjects, locale)
  const earnedIds = badges.filter((b) => b.earned).map((b) => b.id).join(',')
  const [toast, setToast] = useState<Badge | null>(null)
  // The hydration render uses the stores' empty server snapshot; comparing
  // that against "seen" would wipe it and re-announce every badge.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false)

  useEffect(() => {
    if (!hydrated) return
    let seen: string[] | null = null
    try {
      const raw = localStorage.getItem(SEEN_KEY)
      seen = raw ? (JSON.parse(raw) as string[]) : null
    } catch {}
    const earned = earnedIds ? earnedIds.split(',') : []
    const fresh = seen ? earned.filter((id) => !seen.includes(id)) : []
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(earned))
    } catch {}
    if (!fresh.length) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to a change in browser-stored progress
    setToast(badges.find((b) => b.id === fresh[0]) ?? null)
    const id = setTimeout(() => setToast(null), 4500)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- earnedIds is the real dependency; badges is rebuilt every render
  }, [earnedIds, hydrated])

  if (!toast) return null
  return createPortal(
    <a
      href={locale === 'bn' ? '/bn/progress' : '/progress'}
      role="status"
      className="animate-celebrate-in fixed inset-x-0 bottom-20 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-3 rounded-full border bg-background/95 py-2 pl-2 pr-5 shadow-lg backdrop-blur-md md:bottom-8"
    >
      <span className="animate-check-pop">
        <BadgeIcon badge={toast} />
      </span>
      <span className="text-sm">
        <span className="block text-xs text-muted-foreground">{locale === 'bn' ? 'নতুন ব্যাজ' : 'Badge unlocked'}</span>
        <span className="font-semibold">{toast.name}</span>
      </span>
    </a>,
    document.body,
  )
}

export function ProgressOverview({ subjects, locale }: { subjects: Subject[]; locale: Locale }) {
  const badges = useBadges(subjects, locale)
  const completed = useCompleted()
  const xp = useXp()
  const { count, best } = useStreak()
  const quizzes = useQuizResults()
  const passed = Object.values(quizzes).filter((q) => q.total > 0 && q.best / q.total >= 0.7).length
  const bn = locale === 'bn'

  const stats = [
    { label: bn ? 'শেষ করা পাঠ' : 'Lessons finished', value: completed.size },
    { label: bn ? 'পাস করা কুইজ' : 'Quizzes passed', value: passed },
    { label: 'XP', value: xp },
    { label: bn ? 'ধারা (সেরা)' : 'Streak (best)', value: `${count} (${best})` },
  ]
  const earned = badges.filter((b) => b.earned)
  const fixed = badges.filter((b) => b.kind !== 'subject')
  const subjectBadges = badges.filter((b) => b.kind === 'subject')

  return (
    <div className="space-y-10">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4">
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section>
        <h2 className="text-lg font-semibold">
          {bn ? 'ব্যাজ' : 'Badges'}{' '}
          <span className="text-sm font-normal text-muted-foreground tabular-nums">
            {earned.length}/{badges.length}
          </span>
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fixed.map((b) => (
            <BadgeRow key={b.id} badge={b} />
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">{bn ? 'বিষয়' : 'Subjects'}</h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjectBadges.map((b) => (
            <BadgeRow key={b.id} badge={b} />
          ))}
        </ul>
      </section>

      <p className="text-xs text-muted-foreground">
        {bn
          ? 'আপনার অগ্রগতি শুধু এই ব্রাউজারে সংরক্ষিত থাকে। ব্রাউজারের ডেটা মুছলে এটাও মুছে যাবে।'
          : 'Your progress is saved in this browser only. Clearing your browser data clears it too.'}
      </p>
    </div>
  )
}

function BadgeRow({ badge }: { badge: Badge }) {
  const pct = Math.round((badge.have / badge.need) * 100)
  return (
    <li className={cn('flex items-center gap-3 rounded-xl border bg-card p-3', !badge.earned && 'opacity-80')}>
      <BadgeIcon badge={badge} />
      <div className="min-w-0 flex-1">
        <p className={cn('truncate font-medium', !badge.earned && 'text-muted-foreground')}>{badge.name}</p>
        <p className="truncate text-xs text-muted-foreground">{badge.desc}</p>
        {!badge.earned && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {badge.have}/{badge.need}
            </span>
          </div>
        )}
      </div>
    </li>
  )
}
