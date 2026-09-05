import type { Metadata } from 'next'
import { ScopeClosureDemo } from '@/components/tools/scope-closure-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Scope & Closure Visualizer',
  description:
    'See the scope chain build up and tear down as real code runs — every variable’s real value, the real ReferenceError a temporal dead zone throws, and exactly what a closure keeps alive after its outer function has already returned.',
  alternates: buildAlternates('/tools/scope-closure', '/tools/scope-closure', '/bn/tools/scope-closure'),
}

export default function ScopeClosureVisualizerPage() {
  return <ScopeClosureDemo locale="en" />
}
