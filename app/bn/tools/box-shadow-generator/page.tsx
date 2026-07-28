import type { Metadata } from 'next'
import { BoxShadowDemo } from '@/components/tools/box-shadow-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS বক্স শ্যাডো জেনারেটর',
  description:
    'একাধিক box-shadow লেয়ার সাজান, shape-এর উপর সরাসরি শ্যাডো টেনে সরান, আর CSS, Tailwind, CSS ভেরিয়েবল বা React style অবজেক্ট কপি করুন। প্রিসেট, পেস্ট-করে-ইমপোর্ট, আর স্মুথ-শ্যাডো জেনারেটরসহ।',
  alternates: buildAlternates('/bn/tools/box-shadow-generator', '/tools/box-shadow-generator', '/bn/tools/box-shadow-generator'),
}

export default function BoxShadowGeneratorPageBn() {
  return <BoxShadowDemo locale="bn" />
}
