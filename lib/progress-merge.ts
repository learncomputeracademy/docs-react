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

export function mergeLearningData(local: LearningData, remote: LearningData): LearningData {
  return {
    completed: [...new Set([...remote.completed, ...local.completed])].sort(),
    quiz: mergeQuiz(remote.quiz, local.quiz),
    streak: mergeStreak(local.streak, remote.streak),
    // No timestamp on "last lesson": this device's is what the learner was
    // just doing, so it wins; fall back to the account's.
    last: local.last ?? remote.last,
    badgesSeen: [...new Set([...remote.badgesSeen, ...local.badgesSeen])].sort(),
  }
}

export const EMPTY_LEARNING: LearningData = { completed: [], quiz: {}, streak: null, last: null, badgesSeen: [] }
