import type { Metadata } from 'next'
import { CvdDemo } from '@/components/tools/cvd-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Colour Vision Deficiency Simulator',
  description:
    'Simulate protanopia, deuteranopia, tritanopia, and achromatopsia — with a real severity slider for the anomalous (weak) forms — on your own uploaded photo, a live UI mockup, or a pasted colour palette with pairwise confusability checks. Download simulated images or copy the exact SVG filter to preview live on your own site.',
  alternates: buildAlternates('/tools/colorblind', '/tools/colorblind', '/bn/tools/colorblind'),
}

export default function CvdSimulatorPage() {
  return <CvdDemo locale="en" />
}
