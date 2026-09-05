import type { Metadata } from 'next'
import { RecursionDemo } from '@/components/tools/recursion-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Recursion Visualizer',
  description:
    'Watch a recursive function’s call stack really grow and shrink, with the real arguments and real return value shown on every frame — and the exact moment it unwinds back into an answer. Sum, factorial and Fibonacci presets, plus editable code.',
  alternates: buildAlternates('/tools/recursion', '/tools/recursion', '/bn/tools/recursion'),
}

export default function RecursionVisualizerPage() {
  return <RecursionDemo locale="en" />
}
