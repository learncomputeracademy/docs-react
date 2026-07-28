import type { Metadata } from 'next'
import { GradientDemo } from '@/components/tools/gradient-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Gradient Generator',
  description:
    'Build linear, radial and conic gradients with unlimited colour stops, drag to edit right on the canvas, and see sRGB vs OKLCH interpolation compared side by side using real browser rendering. Paste-to-import and four output formats included.',
  alternates: buildAlternates('/tools/gradient', '/tools/gradient', '/bn/tools/gradient'),
}

export default function GradientGeneratorPage() {
  return <GradientDemo locale="en" />
}
