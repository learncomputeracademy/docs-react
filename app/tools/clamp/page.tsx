import type { Metadata } from 'next'
import { ClampDemo } from '@/components/tools/clamp-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Clamp Generator',
  description:
    'Build a fluid clamp() value for font-size or spacing that scales smoothly between a minimum and maximum viewport width, no media queries needed. Live preview in a real resizable frame, presets, CSS/CSS-variable/Tailwind output.',
  alternates: buildAlternates('/tools/clamp', '/tools/clamp', '/bn/tools/clamp'),
}

export default function ClampGeneratorPage() {
  return <ClampDemo locale="en" />
}
