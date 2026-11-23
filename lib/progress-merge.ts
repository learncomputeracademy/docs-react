// Merging this browser's learning data with the copy saved in the learner's
// account (first sign-in on a device, or a second device). Nothing is ever
// lost: lessons done on either side count, the better quiz result wins, the
// more recent streak wins (keeping the higher best), badges seen are joined.
// Checked by scripts/check-progress-merge.mjs.
import type { LearningData } from '@/lib/progress'

type Quiz = LearningData['quiz']

function mergeQuiz(a: Quiz, b: Quiz): Quiz {
  const out: Quiz = { ...a }
  for (const [k, r] of Object.entries(b)) {
    const l = out[k]
    out[k] = l ? { best: Math.max(l.best, r.best), total: Math.max(l.total, r.total), xp: Math.max(l.xp, r.xp) } : r
  }
  return out
}

function mergeStreak(a: LearningData['streak'], b: LearningData['streak']): LearningData['streak'] {
  if (!a) return b
  if (!b) return a
  // Dates are YYYY-MM-DD, so string comparison orders them.
  const newer = a.last > b.last ? a : b.last > a.last ? b : a.count >= b.count ? a : b
  return { ...newer, best: Math.max(a.best, b.best, newer.count) }
}

type Typing = LearningData['typing']

// Typing test: results from both devices joined (deduplicated, newest 300),
// best lesson scores kept, weak-key counts take the higher of the two (not a
// sum: merging runs on every visit, a sum would keep doubling), this
// device's settings win.
function mergeTyping(local: Typing, remote: Typing): Typing {
  const seen = new Set<string>()
  const history = [...local.history, ...remote.history]
    .filter((h) => {
      const k = `${h.date}|${h.mode}|${h.label}|${h.wpm}`
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    .sort((a, b) => b.date - a.date)
    .slice(0, 300) // MAX_HISTORY in lib/typing-test-engine.ts
  const weakKeys: Typing['weakKeys'] = { ...remote.weakKeys }
  for (const [k, v] of Object.entries(local.weakKeys)) weakKeys[k] = Math.max(weakKeys[k] ?? 0, v)
  const lessons: Typing['lessons'] = { ...remote.lessons }
  for (const [k, l] of Object.entries(local.lessons)) {
    const r = lessons[k]
    lessons[k] = r ? { completed: l.completed || r.completed, bestWpm: Math.max(l.bestWpm, r.bestWpm), bestAccuracy: Math.max(l.bestAccuracy, r.bestAccuracy) } : l
  }
  // Per-day totals: higher of the two per field (same reason as weak keys).
  const daily: Typing['daily'] = { ...remote.daily }
  for (const [day, l] of Object.entries(local.daily)) {
    const r = daily[day]
    daily[day] = r ? { tests: Math.max(l.tests, r.tests), secs: Math.max(l.secs, r.secs), started: Math.max(l.started, r.started) } : l
  }
  return { history, weakKeys, lessons, settings: local.settings ?? remote.settings, daily }
}

export function mergeLearningData(local: LearningData, remote: LearningData): LearningData {
  return {
    completed: [...new Set([...remote.completed, ...local.completed])].sort(),
    quiz: mergeQuiz(remote.quiz, local.quiz),
    streak: mergeStreak(local.streak, remote.streak),
    // No timestamp on "last lesson": this device's is what the learner was
    // just doing, so it wins; fall back to the account's.
    last: local.last ?? remote.last,
    badgesSeen: [...new Set([...remote.badgesSeen, ...local.badgesSeen])].sort(),
    typing: mergeTyping(local.typing, remote.typing),
  }
}

export const EMPTY_TYPING: LearningData['typing'] = { history: [], weakKeys: {}, lessons: {}, settings: null, daily: {} }
export const EMPTY_LEARNING: LearningData = { completed: [], quiz: {}, streak: null, last: null, badgesSeen: [], typing: EMPTY_TYPING }
