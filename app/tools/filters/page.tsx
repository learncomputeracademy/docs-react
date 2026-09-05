import type { Metadata } from 'next'
import { FilterDemo } from '@/components/tools/filter-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Filter Studio',
  description:
    'Stack, reorder, and combine every CSS filter function — blur, brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, sepia, and drop-shadow() — plus a separate backdrop-filter stack for glass panels. Upload your own image, compare before/after, apply to text and UI elements, and start from a photo-style preset.',
  alternates: buildAlternates('/tools/filters', '/tools/filters', '/bn/tools/filters'),
}

export default function FilterStudioPage() {
  return <FilterDemo locale="en" />
}
