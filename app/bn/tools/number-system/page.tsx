import type { Metadata } from 'next'
import { NumberSystemDemo } from '@/components/tools/number-system-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Number System কনভার্টার',
  description:
    'Binary, octal, decimal আর hexadecimal-এর মধ্যে ঠিক যেভাবে স্কুলে শেখানো হয় সেভাবে কনভার্ট করুন — repeated division আর place-value table, একবারে এক step। সাথে একটা interactive bit-toggle row আর হোমওয়ার্কের জন্য একটা practice mode।',
  alternates: buildAlternates('/bn/tools/number-system', '/tools/number-system', '/bn/tools/number-system'),
}

export default function NumberSystemConverterPageBn() {
  return <NumberSystemDemo locale="bn" />
}
