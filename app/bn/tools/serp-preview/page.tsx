import type { Metadata } from 'next'
import { SerpPreviewDemo } from '@/components/tools/serp-preview-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'SERP Snippet প্রিভিউয়ার',
  description:
    'আপনার title tag আর meta description আসলে Google search result-এ, desktop আর mobile দুটোতেই, কেমন দেখাবে দেখুন — আসল pixel-width measurement দিয়ে, character-count আন্দাজ করে না।',
  alternates: buildAlternates('/bn/tools/serp-preview', '/tools/serp-preview', '/bn/tools/serp-preview'),
}

export default function SerpPreviewPageBn() {
  return <SerpPreviewDemo locale="bn" />
}
