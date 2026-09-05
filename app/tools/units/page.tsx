import type { Metadata } from 'next'
import { UnitsDemo } from '@/components/tools/units-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Units Converter',
  description:
    'Convert between every CSS length, angle, time and resolution unit — px, em, rem, %, vw/vh, container query units, pt/cm/in, deg/rad/turn, s/ms, dpi/dppx — with a real, configurable root font-size, viewport and container context, plus a live preview and full conversion table.',
  alternates: buildAlternates('/tools/units', '/tools/units', '/bn/tools/units'),
}

export default function UnitsConverterPage() {
  return <UnitsDemo locale="en" />
}
