import type { Metadata } from 'next'
import { BoxShadowDemo } from '@/components/tools/box-shadow-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Box Shadow Generator',
  description:
    'Stack multiple box-shadow layers, drag the shadow right on the shape, and copy CSS, Tailwind, a CSS variable, or a React style object. Presets, a paste-to-import parser, and a smooth-shadow generator included.',
  alternates: buildAlternates('/tools/box-shadow-generator', '/tools/box-shadow-generator', '/bn/tools/box-shadow-generator'),
}

export default function BoxShadowGeneratorPage() {
  return <BoxShadowDemo locale="en" />
}
