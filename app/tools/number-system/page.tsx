import type { Metadata } from 'next'
import { NumberSystemDemo } from '@/components/tools/number-system-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Number System Converter',
  description:
    'Convert between binary, octal, decimal and hexadecimal the way it’s actually taught — repeated division and the place-value table, one step at a time. Plus an interactive bit-toggle row and a practice mode for homework.',
  alternates: buildAlternates('/tools/number-system', '/tools/number-system', '/bn/tools/number-system'),
}

export default function NumberSystemConverterPage() {
  return <NumberSystemDemo locale="en" />
}
