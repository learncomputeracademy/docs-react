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

// Typing test: results joined without duplicates, newest first, max 300.
const h = (date, wpm) => ({ date, mode: 'time', label: '30s', wpm, accuracy: 95, consistency: 80 })
const ty = (o) => ({ ...E, typing: { history: [], weakKeys: {}, lessons: {}, settings: null, daily: {}, ...o } })
const m5 = merge(ty({ history: [h(3, 40), h(1, 30)] }), ty({ history: [h(2, 35), h(1, 30)] }))
assert.deepEqual(m5.typing.history.map((x) => x.date), [3, 2, 1])
const many = Array.from({ length: 200 }, (_, i) => h(i, 50))
const many2 = Array.from({ length: 200 }, (_, i) => h(1000 + i, 50))
assert.equal(merge(ty({ history: many }), ty({ history: many2 })).typing.history.length, 300)
// Daily totals: higher value per field, per day; days from both sides kept.
const dl = merge(
  ty({ daily: { '2026-11-20': { tests: 3, secs: 90, started: 5 } } }),
  ty({ daily: { '2026-11-20': { tests: 4, secs: 60, started: 4 }, '2026-11-21': { tests: 1, secs: 30, started: 1 } } }),
).typing.daily
assert.deepEqual(dl, { '2026-11-20': { tests: 4, secs: 90, started: 5 }, '2026-11-21': { tests: 1, secs: 30, started: 1 } })
// Weak keys take the higher count, so repeated merges never inflate them.
const wk = merge(ty({ weakKeys: { e: 5, a: 1 } }), ty({ weakKeys: { e: 3, z: 2 } })).typing.weakKeys
assert.deepEqual(wk, { e: 5, a: 1, z: 2 })
assert.deepEqual(merge(ty({ weakKeys: wk }), ty({ weakKeys: wk })).typing.weakKeys, wk)
// Typing lessons keep the best scores; this device's settings win.
const tl = merge(
  ty({ lessons: { l1: { completed: true, bestWpm: 30, bestAccuracy: 99 } }, settings: { sound: false } }),
  ty({ lessons: { l1: { completed: true, bestWpm: 45, bestAccuracy: 90 }, l2: { completed: true, bestWpm: 20, bestAccuracy: 80 } }, settings: { sound: true } }),
).typing
assert.deepEqual(tl.lessons.l1, { completed: true, bestWpm: 45, bestAccuracy: 99 })
assert.ok(tl.lessons.l2)
assert.deepEqual(tl.settings, { sound: false })

console.log('progress-merge: all checks passed')
