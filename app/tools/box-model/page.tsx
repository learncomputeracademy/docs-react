import type { Metadata } from 'next'
import { BoxModelDemo } from '@/components/tools/box-model-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Interactive CSS Box Model',
  description:
    'Drag the sliders and watch content, padding, border and margin change live. See exactly why a 300px box is often not 300px wide, and copy the generated CSS.',
  alternates: buildAlternates('/tools/box-model', '/tools/box-model', '/bn/tools/box-model'),
}

export default function BoxModelPage() {
  return <BoxModelDemo locale="en" />
}
