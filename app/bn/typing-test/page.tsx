import type { Metadata } from 'next'
import { TypingTestApp } from '@/components/typing-test/typing-test-app'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Typing Test',
  description:
    'আপনার typing speed আর accuracy টেস্ট করুন — time, words, quote, zen, বা আপনার নিজের custom text দিয়ে, লাইভ WPM, একটা results graph, একটা keyboard error heatmap, আর locally-saved history সহ।',
  alternates: buildAlternates('/bn/typing-test', '/typing-test', '/bn/typing-test'),
}

export default function TypingTestPageBn() {
  return <TypingTestApp locale="bn" />
}
