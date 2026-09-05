import type { Metadata } from 'next'
import { LessonsApp } from '@/components/typing-test/lessons-app'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Typing Lessons',
  description:
    'A progressive typing course — home row first, then the full keyboard, capitals, punctuation, numbers, and full sentences, with your best WPM and accuracy saved per lesson.',
  alternates: buildAlternates('/typing-test/lessons', '/typing-test/lessons', '/bn/typing-test/lessons'),
}

export default function TypingLessonsPage() {
  return <LessonsApp locale="en" />
}
