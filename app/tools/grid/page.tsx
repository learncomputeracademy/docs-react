import type { Metadata } from 'next'
import { GridDemo } from '@/components/tools/grid-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Grid Generator',
  description:
    'Build a real CSS Grid by dragging across cells to place items — mix fr, px, auto, and minmax() tracks, and export the derived grid-template-areas alongside CSS, Tailwind, and React output.',
  alternates: buildAlternates('/tools/grid', '/tools/grid', '/bn/tools/grid'),
}

export default function GridGeneratorPage() {
  return <GridDemo locale="en" />
}
