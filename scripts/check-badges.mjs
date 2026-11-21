// Self-check for lib/badges.ts. Run: node scripts/check-badges.mjs (Node 22.6+ strips TS types).
import assert from 'node:assert/strict'
import { computeBadges } from '../lib/badges.ts'

const subjects = [{ slug: 'html', title: 'HTML', paths: ['html/a', 'html/b'] }, { slug: 'empty', title: 'Empty', paths: [] }]
const get = (badges, id) => badges.find((b) => b.id === id)

let b = computeBadges({ completed: new Set(), quizzes: {}, bestStreak: 0, xp: 0, subjects }, 'en')
assert.ok(b.every((x) => !x.earned), 'nothing earned at start')
assert.equal(get(b, 'subject-empty'), undefined, 'subjects with no lessons are skipped')

b = computeBadges({
  completed: new Set(['html/a', 'html/b', 'css/x']),
  quizzes: {
    'html/a#q': { best: 4, total: 4, xp: 40 }, // passed, perfect
    'html/b#q': { best: 3, total: 4, xp: 30 }, // passed (75%)
    'css/x#q': { best: 2, total: 4, xp: 20 }, // failed (50%)
  },
  bestStreak: 7,
  xp: 90,
  subjects,
}, 'en')
assert.equal(get(b, 'lessons-1').earned, true)
assert.deepEqual([get(b, 'lessons-10').have, get(b, 'lessons-10').earned], [3, false])
assert.deepEqual([get(b, 'quiz-1').earned, get(b, 'quiz-10').have], [true, 2], '70% pass mark')
assert.equal(get(b, 'perfect-5').have, 1)
assert.deepEqual([get(b, 'streak-7').earned, get(b, 'streak-30').earned], [true, false])
assert.deepEqual([get(b, 'xp-100').earned, get(b, 'xp-100').have], [false, 90])
assert.equal(get(b, 'subject-html').earned, true)
assert.equal(get(b, 'subject-html').name, 'HTML complete')
assert.equal(computeBadges({ completed: new Set(), quizzes: {}, bestStreak: 0, xp: 0, subjects }, 'bn')[0].name, 'প্রথম পদক্ষেপ')

console.log('badges: all checks passed')
