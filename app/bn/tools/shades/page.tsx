import type { Metadata } from 'next'
import { ShadesDemo } from '@/components/tools/shades-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Shade Scale জেনারেটর',
  description:
    'একটা রঙের জন্য বা পুরো একটা design system-এর জন্য একসাথে একটা কনফিগারযোগ্য-দৈর্ঘ্যের কালার স্কেল তৈরি করুন — step সংখ্যা বেছে নিন। একটা perceptually-uniform OKLCH lightness sweep-কে HSL আর naive RGB blending-এর সাথে পাশাপাশি তুলনা করুন, প্রতিটা step-এ WCAG AA ব্যাজসহ, একটা লাইভ বাটন/ব্যাজ প্রিভিউসহ, আর CSS variables / Tailwind @theme / SCSS / JSON এক্সপোর্টসহ।',
  alternates: buildAlternates('/bn/tools/shades', '/tools/shades', '/bn/tools/shades'),
}

export default function ShadeScaleGeneratorPageBn() {
  return <ShadesDemo locale="bn" />
}
