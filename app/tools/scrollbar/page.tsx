import type { Metadata } from 'next'
import { ScrollbarDemo } from '@/components/tools/scrollbar-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Scrollbar Styler',
  description:
    'Style every part of a scrollbar — track, thumb, corner, buttons — with ::-webkit-scrollbar and the standard scrollbar-width/scrollbar-color, rendered live by the real browser engine. An honest note on which browsers support which system, presets, and CSS/React output.',
  alternates: buildAlternates('/tools/scrollbar', '/tools/scrollbar', '/bn/tools/scrollbar'),
}

export default function ScrollbarStylerPage() {
  return <ScrollbarDemo locale="en" />
}
