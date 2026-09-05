import type { Metadata } from 'next'
import { ClampDemo } from '@/components/tools/clamp-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Clamp জেনারেটর',
  description:
    'font-size বা spacing-এর জন্য একটি fluid clamp() ভ্যালু বানান যা ন্যূনতম আর সর্বোচ্চ viewport width-এর মধ্যে মসৃণভাবে স্কেল করে, কোনো media query ছাড়াই। আসল resizable ফ্রেমে লাইভ প্রিভিউ, প্রিসেট, CSS/CSS-ভেরিয়েবল/Tailwind আউটপুট।',
  alternates: buildAlternates('/bn/tools/clamp', '/tools/clamp', '/bn/tools/clamp'),
}

export default function ClampGeneratorPageBn() {
  return <ClampDemo locale="bn" />
}
