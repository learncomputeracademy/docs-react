import type { Metadata } from 'next'
import { RecursionDemo } from '@/components/tools/recursion-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Recursion ভিজুয়ালাইজার',
  description:
    'একটা recursive function-এর call stack সত্যিই বাড়তে আর কমতে দেখুন, প্রতিটা frame-এ আসল argument আর আসল return value দেখানোসহ — আর ঠিক যে মুহূর্তে এটা unwind করে একটা উত্তরে পরিণত হয়। Sum, factorial আর Fibonacci preset, সাথে editable কোড।',
  alternates: buildAlternates('/bn/tools/recursion', '/tools/recursion', '/bn/tools/recursion'),
}

export default function RecursionVisualizerPageBn() {
  return <RecursionDemo locale="bn" />
}
