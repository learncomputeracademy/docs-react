import type { Metadata } from 'next'
import { FlexboxDemo } from '@/components/tools/flexbox-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'ফ্লেক্সবক্স প্লেগ্রাউন্ড',
  description:
    'প্রতিটি flex কন্টেইনার আর আইটেম প্রপার্টি, লাইভ — direction, wrap, justify-content, align-items/content, gap, grow, shrink, basis, order, align-self। দেখুন কীভাবে order আসল HTML স্পর্শ না করেই দৃশ্যমান অবস্থান বদলায়। প্রিসেট আর CSS/Tailwind/React আউটপুটসহ।',
  alternates: buildAlternates('/bn/tools/flexbox', '/tools/flexbox', '/bn/tools/flexbox'),
}

export default function FlexboxPlaygroundPageBn() {
  return <FlexboxDemo locale="bn" />
}
