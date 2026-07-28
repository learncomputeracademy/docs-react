import type { Metadata } from 'next'
import { FlexboxDemo } from '@/components/tools/flexbox-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Flexbox Playground',
  description:
    'Every flex container and item property, live — direction, wrap, justify-content, align-items/content, gap, grow, shrink, basis, order, align-self. See exactly how order changes visual position without touching the HTML. Presets and CSS/Tailwind/React output included.',
  alternates: buildAlternates('/tools/flexbox', '/tools/flexbox', '/bn/tools/flexbox'),
}

export default function FlexboxPlaygroundPage() {
  return <FlexboxDemo locale="en" />
}
