import type { Metadata } from 'next'
import { LoremDemo } from '@/components/tools/lorem-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator',
  description:
    'Four text engines, not one static paragraph — classic pseudo-Latin, pure gibberish, template-built realistic English prose, and Bengali. Generate words, sentences, paragraphs or list items, wrap the output in HTML tags, or target an exact character count.',
  alternates: buildAlternates('/tools/lorem-text', '/tools/lorem-text', '/bn/tools/lorem-text'),
}

export default function LoremIpsumGeneratorPage() {
  return <LoremDemo locale="en" />
}
