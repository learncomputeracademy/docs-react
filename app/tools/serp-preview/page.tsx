import type { Metadata } from 'next'
import { SerpPreviewDemo } from '@/components/tools/serp-preview-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'SERP Snippet Previewer',
  description:
    'See how your title tag and meta description would actually look in a Google search result, on desktop and mobile — with real pixel-width measurement, not a character-count guess.',
  alternates: buildAlternates('/tools/serp-preview', '/tools/serp-preview', '/bn/tools/serp-preview'),
}

export default function SerpPreviewPage() {
  return <SerpPreviewDemo locale="en" />
}
