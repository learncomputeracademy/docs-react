// Daily study streak — pure logic, no React or storage, so it can be checked
// with `node scripts/check-streak.mjs`.
//
// A study day = a day with at least one lesson finished. Days are local
// calendar dates ("YYYY-MM-DD"), not UTC, so 11 pm in India counts as today.
// Grace: one missed day is forgiven if no grace was used in the last 7 days.

export type Streak = { last: string; count: number; best: number; grace?: string }

export function localDay(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function daysBetween(a: string, b: string): number {
  const [y1, m1, d1] = a.split('-').map(Number)
  const [y2, m2, d2] = b.split('-').map(Number)
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000)
}

function graceAvailable(s: Streak, today: string) {
  return !s.grace || daysBetween(s.grace, today) >= 7
}

// Called when a lesson is finished on `today`.
export function recordStudyDay(prev: Streak | null, today: string): Streak {
  if (!prev) return { last: today, count: 1, best: 1 }
  const gap = daysBetween(prev.last, today)
  if (gap <= 0) return prev
  let next: Streak
  if (gap === 1) next = { ...prev, last: today, count: prev.count + 1 }
  else if (gap === 2 && graceAvailable(prev, today)) next = { ...prev, last: today, count: prev.count + 1, grace: today }
  else next = { ...prev, last: today, count: 1 }
  return { ...next, best: Math.max(next.best, next.count) }
}

// The streak as it stands on `today` — 0 once it can no longer be continued.
export function currentStreak(s: Streak | null, today: string): number {
  if (!s) return 0
  const gap = daysBetween(s.last, today)
  if (gap <= 1) return s.count
  if (gap === 2 && graceAvailable(s, today)) return s.count
  return 0
}
