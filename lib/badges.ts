// Badges — derived from data already kept in the browser (lib/progress.ts):
// finished lessons, quiz results, best streak, XP. Nothing extra is stored
// except which badges the visitor has already been shown (for the toast).
// Pure functions, checked by `node scripts/check-badges.mjs`.

import type { Locale } from './types'

export type BadgeKind = 'lessons' | 'quiz' | 'streak' | 'xp' | 'subject'
export type Subject = { slug: string; title: string; paths: string[] }
export type QuizResults = Record<string, { best: number; total: number; xp: number }>
export type BadgeInput = { completed: ReadonlySet<string>; quizzes: QuizResults; bestStreak: number; xp: number; subjects: Subject[] }
export type Badge = { id: string; kind: BadgeKind; name: string; desc: string; have: number; need: number; earned: boolean }

const PASS = 0.7

type Def = { id: string; kind: Exclude<BadgeKind, 'subject'>; need: number; en: [string, string]; bn: [string, string] }

const DEFS: Def[] = [
  { id: 'lessons-1', kind: 'lessons', need: 1, en: ['First step', 'Finish your first lesson'], bn: ['প্রথম পদক্ষেপ', 'প্রথম পাঠ শেষ করুন'] },
  { id: 'lessons-10', kind: 'lessons', need: 10, en: ['Getting going', 'Finish 10 lessons'], bn: ['এগিয়ে চলা', '10টি পাঠ শেষ করুন'] },
  { id: 'lessons-50', kind: 'lessons', need: 50, en: ['Bookworm', 'Finish 50 lessons'], bn: ['বইপোকা', '50টি পাঠ শেষ করুন'] },
  { id: 'lessons-100', kind: 'lessons', need: 100, en: ['Century', 'Finish 100 lessons'], bn: ['সেঞ্চুরি', '100টি পাঠ শেষ করুন'] },
  { id: 'lessons-250', kind: 'lessons', need: 250, en: ['Marathon', 'Finish 250 lessons'], bn: ['ম্যারাথন', '250টি পাঠ শেষ করুন'] },
  { id: 'quiz-1', kind: 'quiz', need: 1, en: ['Quiz starter', 'Pass your first quiz'], bn: ['কুইজ শুরু', 'প্রথম কুইজে পাস করুন'] },
  { id: 'quiz-10', kind: 'quiz', need: 10, en: ['Quiz regular', 'Pass 10 quizzes'], bn: ['নিয়মিত কুইজ', '10টি কুইজে পাস করুন'] },
  { id: 'perfect-5', kind: 'quiz', need: 5, en: ['Sharp shooter', 'Get a perfect score on 5 quizzes'], bn: ['নিখুঁত নিশানা', '5টি কুইজে পূর্ণ নম্বর পান'] },
  { id: 'streak-3', kind: 'streak', need: 3, en: ['On a roll', 'Study 3 days in a row'], bn: ['ছন্দে আছেন', 'টানা 3 দিন পড়ুন'] },
  { id: 'streak-7', kind: 'streak', need: 7, en: ['One week', 'Study 7 days in a row'], bn: ['এক সপ্তাহ', 'টানা 7 দিন পড়ুন'] },
  { id: 'streak-30', kind: 'streak', need: 30, en: ['Unstoppable', 'Study 30 days in a row'], bn: ['অপ্রতিরোধ্য', 'টানা 30 দিন পড়ুন'] },
  { id: 'xp-100', kind: 'xp', need: 100, en: ['100 XP', 'Earn 100 XP from quizzes'], bn: ['100 XP', 'কুইজ থেকে 100 XP অর্জন করুন'] },
  { id: 'xp-500', kind: 'xp', need: 500, en: ['500 XP', 'Earn 500 XP from quizzes'], bn: ['500 XP', 'কুইজ থেকে 500 XP অর্জন করুন'] },
  { id: 'xp-1000', kind: 'xp', need: 1000, en: ['1000 XP', 'Earn 1000 XP from quizzes'], bn: ['1000 XP', 'কুইজ থেকে 1000 XP অর্জন করুন'] },
]

export function computeBadges(input: BadgeInput, locale: Locale): Badge[] {
  const quizList = Object.values(input.quizzes)
  const passed = quizList.filter((q) => q.total > 0 && q.best / q.total >= PASS).length
  const perfect = quizList.filter((q) => q.total > 0 && q.best === q.total).length
  const value: Record<string, number> = {
    lessons: input.completed.size,
    streak: input.bestStreak,
    xp: input.xp,
  }

  const fixed = DEFS.map((d) => {
    const have = d.kind === 'quiz' ? (d.id.startsWith('perfect') ? perfect : passed) : value[d.kind]
    const [name, desc] = d[locale]
    return { id: d.id, kind: d.kind, name, desc, have: Math.min(have, d.need), need: d.need, earned: have >= d.need }
  })

  const subjects = input.subjects
    .filter((s) => s.paths.length > 0)
    .map((s) => {
      const have = s.paths.filter((p) => input.completed.has(p)).length
      return {
        id: `subject-${s.slug}`,
        kind: 'subject' as const,
        name: locale === 'bn' ? `${s.title} সম্পূর্ণ` : `${s.title} complete`,
        desc: locale === 'bn' ? `${s.title}-এর সব পাঠ শেষ করুন` : `Finish every ${s.title} lesson`,
        have,
        need: s.paths.length,
        earned: have === s.paths.length,
      }
    })

  return [...fixed, ...subjects]
}
