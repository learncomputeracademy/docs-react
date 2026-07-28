import type { Metadata } from 'next'
import { ContrastDemo } from '@/components/tools/contrast-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Colour & Contrast Studio',
  description:
    'Build a palette from one colour (complementary, triadic, analogous, split-complementary), check real WCAG AA/AAA contrast math, and preview colours under protanopia, deuteranopia and tritanopia. Export as CSS variables or a Tailwind @theme block.',
  alternates: buildAlternates('/tools/colour', '/tools/colour', '/bn/tools/colour'),
}

export default function ColourContrastStudioPage() {
  return <ContrastDemo locale="en" />
}
