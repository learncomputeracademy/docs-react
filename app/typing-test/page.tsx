import type { Metadata } from 'next'
import { TypingTestApp } from '@/components/typing-test/typing-test-app'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Typing Test',
  description:
    'Test your typing speed and accuracy — time, words, quote, zen, or your own custom text, with live WPM, a results graph, a keyboard error heatmap, and locally-saved history.',
  alternates: buildAlternates('/typing-test', '/typing-test', '/bn/typing-test'),
}

export default function TypingTestPage() {
  return <TypingTestApp locale="en" />
}
