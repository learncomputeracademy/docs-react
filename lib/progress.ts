'use client'

import { useSyncExternalStore } from 'react'
import { currentStreak, localDay, recordStudyDay, type Streak } from '@/lib/streak'

// Prototype (2026-11-20): lesson completion kept in localStorage only — no
// account, no server. Keys are locale-free doc paths ("css/css-intro"), so
// English and Bengali share one progress record.
// ponytail: localStorage only; sync to a user_progress table once accounts exist.

const KEY = 'lca-progress-v1'
const EMPTY: ReadonlySet<string> = new Set()
const listeners = new Set<() => void>()
let cache: ReadonlySet<string> | null = null

// The one path completed during this page session, so only it plays the
// draw-in animation; checks restored from storage on load appear static.
export let justCompleted: string | null = null

function read(): ReadonlySet<string> {
  if (cache) return cache
  try {
    cache = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[])
  } catch {
    cache = EMPTY
  }
  return cache
}

function write(next: Set<string>) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify([...next]))
  } catch {
    // private mode / blocked storage — progress lives for this tab only
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null
      l()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    window.removeEventListener('storage', onStorage)
  }
}

export function useCompleted(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function setCompleted(path: string, done: boolean) {
  const cur = read()
  if (cur.has(path) === done) return
  const next = new Set(cur)
  if (done) {
    next.add(path)
    justCompleted = path
    bumpStreak()
  } else {
    next.delete(path)
  }
  write(next)
}

// Last lesson opened, for "Continue where you left off". Saved with its
// title and the lesson after it, so pages outside the lesson tree (home)
// can link to it without loading every doc title.
export type LastLesson = { path: string; title: string; next: { path: string; title: string } | null }
const LAST_KEY = 'lca-last-v1'

export function setLastLesson(l: LastLesson) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(l))
  } catch {}
}

function readLastRaw() {
  try {
    return localStorage.getItem(LAST_KEY)
  } catch {
    return null
  }
}

// Where to send the visitor: the last lesson, or the one after it if the
// last one is already finished. Null when there's nothing to continue.
// newSubject: the next lesson starts a different category than the last one.
export function useContinueTarget(): { path: string; title: string; newSubject: boolean } | null {
  const completed = useCompleted()
  const raw = useSyncExternalStore(subscribe, readLastRaw, () => null)
  if (!raw) return null
  try {
    const last = JSON.parse(raw) as LastLesson
    if (!completed.has(last.path)) return { ...last, newSubject: false }
    if (!last.next || completed.has(last.next.path)) return null
    const newSubject = last.next.path.split('/')[0] !== last.path.split('/')[0]
    return { ...last.next, newSubject }
  } catch {
    return null
  }
}

// Daily streak (rules in lib/streak.ts). Bumped by the first lesson finished each day.
const STREAK_KEY = 'lca-streak-v1'
// True only in the tab where today's bump just happened — drives the pop animation.
export let streakJustBumped = false

function readStreakRaw() {
  try {
    return localStorage.getItem(STREAK_KEY)
  } catch {
    return null
  }
}

function parseStreak(raw: string | null): Streak | null {
  try {
    return raw ? (JSON.parse(raw) as Streak) : null
  } catch {
    return null
  }
}

function bumpStreak() {
  const prev = parseStreak(readStreakRaw())
  const next = recordStudyDay(prev, localDay())
  if (next === prev) return
  streakJustBumped = true
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(next))
  } catch {}
}

export function useStreak(): { count: number; best: number } {
  const raw = useSyncExternalStore(subscribe, readStreakRaw, () => null)
  const s = parseStreak(raw)
  return { count: currentStreak(s, localDay()), best: s?.best ?? 0 }
}

// Quiz results, keyed "<doc path>#<block id>". xp is fixed by the first
// attempt (10 per correct answer); later attempts only raise `best`.
type QuizResult = { best: number; total: number; xp: number }
const QUIZ_KEY = 'lca-quiz-v1'
export const XP_PER_ANSWER = 10
export const PASS_RATIO = 0.7

function readQuizRaw() {
  try {
    return localStorage.getItem(QUIZ_KEY)
  } catch {
    return null
  }
}

function parseQuiz(raw: string | null): Record<string, QuizResult> {
  try {
    return raw ? (JSON.parse(raw) as Record<string, QuizResult>) : {}
  } catch {
    return {}
  }
}

// Records an attempt; returns the XP it earned (0 for any retry).
export function recordQuiz(key: string, score: number, total: number): number {
  const all = parseQuiz(readQuizRaw())
  const prev = all[key]
  const xp = prev ? 0 : score * XP_PER_ANSWER
  all[key] = { best: Math.max(prev?.best ?? 0, score), total, xp: prev ? prev.xp : xp }
  try {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(all))
  } catch {}
  listeners.forEach((l) => l())
  return xp
}

export function useQuizResult(key: string): QuizResult | null {
  const raw = useSyncExternalStore(subscribe, readQuizRaw, () => null)
  return parseQuiz(raw)[key] ?? null
}

export function useXp(): number {
  const raw = useSyncExternalStore(subscribe, readQuizRaw, () => null)
  return Object.values(parseQuiz(raw)).reduce((sum, r) => sum + r.xp, 0)
}

export function useQuizResults(): Record<string, QuizResult> {
  const raw = useSyncExternalStore(subscribe, readQuizRaw, () => null)
  return parseQuiz(raw)
}

// Everything the learning features keep in this browser. Used by /account to
// download or clear it. The badge "seen" list lives in components/badges.tsx
// but is learning data too, so it is listed here.
export const LEARNING_KEYS = [KEY, LAST_KEY, STREAK_KEY, QUIZ_KEY, 'lca-badges-seen-v1'] as const

// Wipes learning data from this browser and refreshes every open view.
export function clearLearningData() {
  for (const k of LEARNING_KEYS) {
    try {
      localStorage.removeItem(k)
    } catch {}
  }
  cache = null
  justCompleted = null
  streakJustBumped = false
  listeners.forEach((l) => l())
}

// ── Account sync (lib/account.ts) ───────────────────────────
// The browser copy stays the working copy; a signed-in learner's row in
// learner_progress mirrors it. These read/write every learning key at once.
// The typing test's own browser data (lib/typing-test-engine.ts keys), kept
// as plain JSON here so this module doesn't depend on the typing engine.
export type TypingData = {
  history: { date: number; mode: string; label: string; wpm: number; accuracy: number; consistency: number }[]
  weakKeys: Record<string, number>
  lessons: Record<string, { completed: boolean; bestWpm: number; bestAccuracy: number }>
  settings: Record<string, unknown> | null
}

export type LearningData = {
  completed: string[]
  quiz: Record<string, QuizResult>
  streak: Streak | null
  last: LastLesson | null
  badgesSeen: string[]
  typing: TypingData
}

const TYPING_KEYS = {
  history: 'typing-test-history-v1',
  weakKeys: 'typing-test-weak-keys-v1',
  lessons: 'typing-test-lesson-progress-v1',
  settings: 'typing-test-settings-v1',
} as const

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function exportLearningData(): LearningData {
  return {
    completed: [...read()],
    quiz: parseQuiz(readQuizRaw()),
    streak: parseStreak(readStreakRaw()),
    last: readJson<LastLesson | null>(LAST_KEY, null),
    badgesSeen: readJson<string[]>('lca-badges-seen-v1', []),
    typing: {
      history: readJson<TypingData['history']>(TYPING_KEYS.history, []),
      weakKeys: readJson<TypingData['weakKeys']>(TYPING_KEYS.weakKeys, {}),
      lessons: readJson<TypingData['lessons']>(TYPING_KEYS.lessons, {}),
      settings: readJson<TypingData['settings']>(TYPING_KEYS.settings, null),
    },
  }
}

export function importLearningData(d: LearningData) {
  const put = (k: string, v: unknown) => {
    try {
      if (v === null) localStorage.removeItem(k)
      else localStorage.setItem(k, JSON.stringify(v))
    } catch {}
  }
  put(KEY, d.completed)
  put(QUIZ_KEY, d.quiz)
  put(STREAK_KEY, d.streak)
  put(LAST_KEY, d.last)
  put('lca-badges-seen-v1', d.badgesSeen)
  put(TYPING_KEYS.history, d.typing.history)
  put(TYPING_KEYS.weakKeys, d.typing.weakKeys)
  put(TYPING_KEYS.lessons, d.typing.lessons)
  if (d.typing.settings) put(TYPING_KEYS.settings, d.typing.settings)
  cache = null
  listeners.forEach((l) => l())
}

// For other stores worth syncing (the typing test) to say "I changed".
export function notifyLearningChange() {
  listeners.forEach((l) => l())
}

// Notified on lesson completion, quiz results and clears (the changes worth
// syncing). Returns an unsubscribe function.
export function onLearningChange(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
