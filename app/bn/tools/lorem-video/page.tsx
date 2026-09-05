import type { Metadata } from 'next'
import { LoremVideoDemo } from '@/components/tools/lorem-video-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Placeholder Video জেনারেটর',
  description:
    'lorem.video, placeholdervideo.dev বা imgsrc.pub থেকে আসল টেস্ট ভিডিও, তিনটার উপর একটা automatic fallback chain-সহ, সাথে একটা verified archived ফাইল (Big Buck Bunny, Internet Archive-এ)। Vertical-সহ aspect preset, একটা মিলে যাওয়া poster ছবি, আর URL/<video>/React/Markdown আউটপুট।',
  alternates: buildAlternates('/bn/tools/lorem-video', '/tools/lorem-video', '/bn/tools/lorem-video'),
}

export default function PlaceholderVideoGeneratorPageBn() {
  return <LoremVideoDemo locale="bn" />
}
