// Self-check for lib/progress-merge.ts. Run: node scripts/check-progress-merge.mjs
import assert from 'node:assert/strict'
import { mergeLearningData as merge, EMPTY_LEARNING as E } from '../lib/progress-merge.ts'

// Lessons from both sides count; nothing is lost.
const m1 = merge({ ...E, completed: ['css/intro', 'html/intro'] }, { ...E, completed: ['html/intro', 'js/intro'] })
assert.deepEqual(m1.completed, ['css/intro', 'html/intro', 'js/intro'])

// Better quiz result wins per field; one-sided results are kept.
const m2 = merge(
  { ...E, quiz: { 'a#q': { best: 2, total: 4, xp: 20 }, 'b#q': { best: 1, total: 4, xp: 10 } } },
  { ...E, quiz: { 'a#q': { best: 4, total: 4, xp: 30 }, 'c#q': { best: 3, total: 4, xp: 30 } } },
)
assert.deepEqual(m2.quiz['a#q'], { best: 4, total: 4, xp: 30 })
assert.deepEqual(m2.quiz['b#q'], { best: 1, total: 4, xp: 10 })
assert.deepEqual(m2.quiz['c#q'], { best: 3, total: 4, xp: 30 })

// The more recent streak wins, keeping the higher best.
const m3 = merge(
  { ...E, streak: { last: '2026-11-20', count: 2, best: 2 } },
  { ...E, streak: { last: '2026-11-21', count: 1, best: 9 } },
)
assert.deepEqual(m3.streak, { last: '2026-11-21', count: 1, best: 9 })
assert.equal(merge({ ...E }, { ...E, streak: { last: '2026-11-01', count: 3, best: 3 } }).streak.count, 3)
assert.equal(merge({ ...E }, { ...E }).streak, null)

// This device's last lesson wins; otherwise the account's.
const L = { path: 'css/intro', title: 'Intro', next: null }
const R = { path: 'js/intro', title: 'JS', next: null }
assert.equal(merge({ ...E, last: L }, { ...E, last: R }).last, L)
assert.equal(merge({ ...E }, { ...E, last: R }).last, R)

// Badges seen are joined.
assert.deepEqual(merge({ ...E, badgesSeen: ['b'] }, { ...E, badgesSeen: ['a', 'b'] }).badgesSeen, ['a', 'b'])

// Merging is stable: merging the result again changes nothing.
const once = merge({ ...E, completed: ['x'], quiz: { 'k': { best: 1, total: 4, xp: 10 } } }, { ...E, completed: ['y'] })
assert.deepEqual(merge(once, once), once)

console.log('progress-merge: all checks passed')
