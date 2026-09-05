import type { Metadata } from 'next'
import { AnimationDemo } from '@/components/tools/animation-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Animation Studio',
  description:
    'Build multi-stop @keyframes animations with multiple layers, a real drag-to-position timeline, transform/opacity/colour/shadow/border-radius per stop, a visual cubic-bezier easing editor, a preset animation library, and scrubbable Web-Animations-API playback. Copy the generated CSS.',
  alternates: buildAlternates('/tools/animation', '/tools/animation', '/bn/tools/animation'),
}

export default function AnimationStudioPage() {
  return <AnimationDemo locale="en" />
}
