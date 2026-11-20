// Self-check for lib/streak.ts. Run: node scripts/check-streak.mjs (Node 22.6+ strips TS types).
import assert from 'node:assert/strict'
import { recordStudyDay as rec, currentStreak as cur, daysBetween } from '../lib/streak.ts'

assert.equal(daysBetween('2026-02-28', '2026-03-01'), 1)
assert.equal(daysBetween('2026-12-31', '2027-01-01'), 1)

let s = rec(null, '2026-11-01')
assert.deepEqual([s.count, s.best], [1, 1])
assert.equal(rec(s, '2026-11-01'), s, 'same day: unchanged')
s = rec(s, '2026-11-02')
assert.equal(s.count, 2, 'next day: +1')

// One missed day (11-03) is forgiven by grace.
assert.equal(cur(s, '2026-11-04'), 2, 'still alive on grace day')
s = rec(s, '2026-11-04')
assert.deepEqual([s.count, s.grace], [3, '2026-11-04'])

// A second miss within 7 days of the grace breaks it.
assert.equal(cur(s, '2026-11-06'), 0)
s = rec(s, '2026-11-06')
assert.deepEqual([s.count, s.best], [1, 3], 'reset, best kept')

// Grace is available again 7+ days later.
s = { last: '2026-11-10', count: 5, best: 5, grace: '2026-11-04' }
s = rec(s, '2026-11-12')
assert.deepEqual([s.count, s.grace], [6, '2026-11-12'])

// Two missed days always break it.
assert.equal(rec({ last: '2026-11-01', count: 9, best: 9 }, '2026-11-04').count, 1)

console.log('streak: all checks passed')
