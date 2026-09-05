import type { Metadata } from 'next'
import { CvdDemo } from '@/components/tools/cvd-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Colour Vision Deficiency সিমুলেটর',
  description:
    'Protanopia, deuteranopia, tritanopia, আর achromatopsia সিমুলেট করুন — anomalous (weak) রূপের জন্য একটা আসল severity স্লাইডারসহ — নিজের আপলোড করা ছবিতে, একটা live UI mockup-এ, বা pairwise confusability চেকসহ একটা পেস্ট করা কালার প্যালেটে। সিমুলেট করা ছবি ডাউনলোড করুন বা নিজের সাইটে লাইভ প্রিভিউ করতে ঠিক সেই SVG filter কপি করুন।',
  alternates: buildAlternates('/bn/tools/colorblind', '/tools/colorblind', '/bn/tools/colorblind'),
}

export default function CvdSimulatorPageBn() {
  return <CvdDemo locale="bn" />
}
