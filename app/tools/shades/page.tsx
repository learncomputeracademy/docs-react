import type { Metadata } from 'next'
import { ShadesDemo } from '@/components/tools/shades-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Shade Scale Generator',
  description:
    'Generate a configurable-length colour scale — pick the step count — for one colour or a whole design system at once. Compare a perceptually-uniform OKLCH lightness sweep against HSL and naive RGB blending side by side, with WCAG AA badges on every step, a live button/badge preview, and CSS variables / Tailwind @theme / SCSS / JSON export.',
  alternates: buildAlternates('/tools/shades', '/tools/shades', '/bn/tools/shades'),
}

export default function ShadeScaleGeneratorPage() {
  return <ShadesDemo locale="en" />
}
