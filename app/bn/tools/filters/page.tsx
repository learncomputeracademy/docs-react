import type { Metadata } from 'next'
import { FilterDemo } from '@/components/tools/filter-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Filter স্টুডিও',
  description:
    'প্রতিটি CSS filter function সাজান, রিঅর্ডার করুন, আর একসাথে মেশান — blur, brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, sepia, আর drop-shadow() — সাথে glass panel-এর জন্য আলাদা একটা backdrop-filter স্ট্যাক। নিজের ছবি আপলোড করুন, before/after তুলনা করুন, টেক্সট আর UI এলিমেন্টে প্রয়োগ করুন, আর একটা photo-style প্রিসেট থেকে শুরু করুন।',
  alternates: buildAlternates('/bn/tools/filters', '/tools/filters', '/bn/tools/filters'),
}

export default function FilterStudioPageBn() {
  return <FilterDemo locale="bn" />
}
