import type { Metadata } from 'next'
import { UnitsDemo } from '@/components/tools/units-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Units কনভার্টার',
  description:
    'প্রতিটি CSS length, angle, time আর resolution unit-এর মধ্যে কনভার্ট করুন — px, em, rem, %, vw/vh, container query units, pt/cm/in, deg/rad/turn, s/ms, dpi/dppx — একটা আসল, কনফিগারযোগ্য root font-size, viewport আর container context সহ, একটা লাইভ প্রিভিউ আর সম্পূর্ণ conversion টেবিলসহ।',
  alternates: buildAlternates('/bn/tools/units', '/tools/units', '/bn/tools/units'),
}

export default function UnitsConverterPageBn() {
  return <UnitsDemo locale="bn" />
}
