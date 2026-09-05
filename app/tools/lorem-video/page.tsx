import type { Metadata } from 'next'
import { LoremVideoDemo } from '@/components/tools/lorem-video-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Placeholder Video Generator',
  description:
    'Real test videos from lorem.video, placeholdervideo.dev or imgsrc.pub, with an automatic fallback chain across all three plus one verified archived file (Big Buck Bunny, via Internet Archive). Aspect presets incl. vertical, a matching poster image, and URL/<video>/React/Markdown output.',
  alternates: buildAlternates('/tools/lorem-video', '/tools/lorem-video', '/bn/tools/lorem-video'),
}

export default function PlaceholderVideoGeneratorPage() {
  return <LoremVideoDemo locale="en" />
}
