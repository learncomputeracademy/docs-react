import type { Metadata } from 'next'
import { SpecificityDemo } from '@/components/tools/specificity-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS স্পেসিফিসিটি ক্যালকুলেটর',
  description:
    'একটি CSS সিলেক্টর পেস্ট করুন আর দেখুন তার (a, b, c) স্পেসিফিসিটি রং-কোডেড ভেঙে দেখানো হচ্ছে, বেশিরভাগ ক্যালকুলেটর যেসব অংশে ভুল করে সেগুলোসহ — :not(), :is(), :where(), আর কম্বিনেটর। দুটো সিলেক্টর তুলনা করে দেখুন আসলে কোনটা জেতে।',
  alternates: buildAlternates('/bn/tools/specificity', '/tools/specificity', '/bn/tools/specificity'),
}

export default function SpecificityCalculatorPageBn() {
  return <SpecificityDemo locale="bn" />
}
