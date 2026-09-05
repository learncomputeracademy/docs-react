import type { Metadata } from 'next'
import { LessonsApp } from '@/components/typing-test/lessons-app'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Typing Lessons',
  description:
    'একটা progressive typing course — আগে home row, তারপর পুরো keyboard, capital, punctuation, number, আর full sentence — প্রতিটা lesson-এ আপনার best WPM ও accuracy save সহ।',
  alternates: buildAlternates('/bn/typing-test/lessons', '/typing-test/lessons', '/bn/typing-test/lessons'),
}

export default function TypingLessonsPageBn() {
  return <LessonsApp locale="bn" />
}
