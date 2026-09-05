import type { Metadata } from 'next'
import { PlaceholderDemo } from '@/components/tools/placeholder-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Placeholder Image Generator',
  description:
    'Real photo placeholders from Lorem Picsum, or solid-colour text boxes from placehold.co — with aspect-ratio lock, common-size presets, a real photo browser with photographer credit, grayscale/blur, and a responsive srcset generator.',
  alternates: buildAlternates('/tools/lorem-image', '/tools/lorem-image', '/bn/tools/lorem-image'),
}

export default function PlaceholderImageGeneratorPage() {
  return <PlaceholderDemo locale="en" />
}
