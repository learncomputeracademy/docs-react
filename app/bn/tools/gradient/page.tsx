import type { Metadata } from 'next'
import { GradientDemo } from '@/components/tools/gradient-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS গ্রেডিয়েন্ট জেনারেটর',
  description:
    'অসীম সংখ্যক কালার স্টপ দিয়ে linear, radial আর conic গ্রেডিয়েন্ট তৈরি করুন, ক্যানভাসে সরাসরি টেনে এডিট করুন, আর real browser rendering দিয়ে sRGB বনাম OKLCH interpolation পাশাপাশি দেখুন। পেস্ট-করে-ইমপোর্ট আর চারটি আউটপুট ফরম্যাটসহ।',
  alternates: buildAlternates('/bn/tools/gradient', '/tools/gradient', '/bn/tools/gradient'),
}

export default function GradientGeneratorPageBn() {
  return <GradientDemo locale="bn" />
}
