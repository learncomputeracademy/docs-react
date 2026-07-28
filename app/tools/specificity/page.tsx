import type { Metadata } from 'next'
import { SpecificityDemo } from '@/components/tools/specificity-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Specificity Calculator',
  description:
    'Paste a CSS selector and see its (a, b, c) specificity broken down and colour-coded, including the parts most calculators get wrong — :not(), :is(), :where(), and combinators. Compare two selectors to see which one actually wins.',
  alternates: buildAlternates('/tools/specificity', '/tools/specificity', '/bn/tools/specificity'),
}

export default function SpecificityCalculatorPage() {
  return <SpecificityDemo locale="en" />
}
