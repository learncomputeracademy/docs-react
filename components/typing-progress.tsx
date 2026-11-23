'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { Keyboard } from 'lucide-react'
import Link from '@/components/hover-link'
import { onLearningChange, type TypingData } from '@/lib/progress'
import { LESSONS } from '@/lib/typing-test-lessons'
import type { Locale } from '@/lib/types'

// Typing test section of /progress (2026-11-23). Reads the typing test's own
// browser stores (synced to the account for signed-in learners), refreshes
// when a test or lesson is saved.

const KEYS = ['typing-test-history-v1', 'typing-test-lesson-progress-v1', 'typing-test-weak-keys-v1'] as const

function readRaw(): string {
  try {
    return KEYS.map((k) => localStorage.getItem(k) ?? '').join('\u0000')
  } catch {
    return ''
  }
}

function parse<T>(raw: string, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function subscribe(l: () => void) {
  const off = onLearningChange(l)
  const onStorage = (e: StorageEvent) => {
    if (e.key && (KEYS as readonly string[]).includes(e.key)) l()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    off()
    window.removeEventListener('storage', onStorage)
  }
}

const T = {
  en: {
    title: 'Typing test',
    tests: 'Tests taken',
    bestWpm: 'Best WPM',
    avgWpm: 'Average WPM (last 10)',
    avgAcc: 'Average accuracy (last 10)',
    lessons: 'Typing lessons',
    weak: 'Keys you miss most',
    recent: 'Recent results',
    empty: 'No typing tests yet.',
    start: 'Take a typing test',
    openLessons: 'Open typing lessons',
    wpm: 'WPM',
    acc: 'accuracy',
  },
  bn: {
    title: 'টাইপিং টেস্ট',
    tests: 'দেওয়া টেস্ট',
    bestWpm: 'সেরা WPM',
    avgWpm: 'গড় WPM (শেষ ১০টি)',
    avgAcc: 'গড় নির্ভুলতা (শেষ ১০টি)',
    lessons: 'টাইপিং পাঠ',
    weak: 'যে কী-গুলো বেশি ভুল হয়',
    recent: 'সাম্প্রতিক ফল',
    empty: 'এখনও কোনো টাইপিং টেস্ট দেননি।',
    start: 'টাইপিং টেস্ট দিন',
    openLessons: 'টাইপিং পাঠ খুলুন',
    wpm: 'WPM',
    acc: 'নির্ভুলতা',
  },
} as const

export function TypingProgress({ locale }: { locale: Locale }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => '')
  const s = T[locale]
  const prefix = locale === 'bn' ? '/bn' : ''

  const data = useMemo(() => {
    const [h, l, w] = raw.split('\u0000')
    const history = parse<TypingData['history']>(h ?? '', [])
    const lessons = parse<TypingData['lessons']>(l ?? '', {})
    const weak = parse<TypingData['weakKeys']>(w ?? '', {})
    const last10 = history.slice(0, 10)
    const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0)
    return {
      history,
      best: history.length ? Math.max(...history.map((x) => x.wpm)) : 0,
      avgWpm: avg(last10.map((x) => x.wpm)),
      avgAcc: avg(last10.map((x) => x.accuracy)),
      lessonsDone: LESSONS.filter((x) => lessons[x.id]?.completed).length,
      weakKeys: Object.entries(weak)
        .filter(([k]) => k.trim())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6),
    }
  }, [raw])

  const fmtDate = (ms: number) =>
    new Date(ms).toLocaleDateString(locale === 'bn' ? 'bn-IN' : 'en-IN', { day: 'numeric', month: 'short' })
  const lessonPct = Math.round((data.lessonsDone / LESSONS.length) * 100)

  return (
    <section>
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Keyboard className="size-5 text-primary" aria-hidden />
        {s.title}
      </h2>

      {data.history.length === 0 && data.lessonsDone === 0 ? (
        <div className="mt-4 rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">{s.empty}</p>
          <Link href={`${prefix}/typing-test`} className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
            {s.start}
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: s.tests, value: data.history.length },
              { label: s.bestWpm, value: data.best },
              { label: s.avgWpm, value: data.avgWpm },
              { label: s.avgAcc, value: `${data.avgAcc}%` },
            ].map((x) => (
              <div key={x.label} className="rounded-xl border bg-card p-4">
                <dt className="text-xs text-muted-foreground">{x.label}</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">{x.value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium">{s.lessons}</h3>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {data.lessonsDone}/{LESSONS.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${lessonPct}%` }} />
              </div>
              <Link href={`${prefix}/typing-test/lessons`} className="mt-3 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline">
                {s.openLessons}
              </Link>

              {data.weakKeys.length > 0 && (
                <>
                  <h3 className="mt-4 text-sm font-medium">{s.weak}</h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {data.weakKeys.map(([k, n]) => (
                      <li key={k} className="flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-1 font-mono text-sm">
                        {k}
                        <span className="text-xs text-muted-foreground tabular-nums">×{n}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {data.history.length > 0 && (
              <div className="rounded-xl border bg-card p-4">
                <h3 className="text-sm font-medium">{s.recent}</h3>
                <ul className="mt-2 divide-y text-sm">
                  {data.history.slice(0, 5).map((x) => (
                    <li key={`${x.date}-${x.wpm}`} className="flex items-center justify-between gap-3 py-2">
                      <span className="text-muted-foreground">
                        {fmtDate(x.date)} · {x.label}
                      </span>
                      <span className="tabular-nums">
                        <span className="font-semibold">{x.wpm}</span> {s.wpm} · {x.accuracy}% {s.acc}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={`${prefix}/typing-test`} className="mt-2 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline">
                  {s.start}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
