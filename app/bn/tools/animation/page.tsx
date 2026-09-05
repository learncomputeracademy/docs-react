import type { Metadata } from 'next'
import { AnimationDemo } from '@/components/tools/animation-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS Animation স্টুডিও',
  description:
    'একাধিক লেয়ার, একটা আসল drag-to-position টাইমলাইন, প্রতিটা stop-এ transform/opacity/রং/shadow/border-radius, একটা visual cubic-bezier easing এডিটর, একটা প্রিসেট অ্যানিমেশন লাইব্রেরি, আর scrubbable Web-Animations-API playback দিয়ে multi-stop @keyframes অ্যানিমেশন বানান। তৈরি হওয়া CSS কপি করুন।',
  alternates: buildAlternates('/bn/tools/animation', '/tools/animation', '/bn/tools/animation'),
}

export default function AnimationStudioPageBn() {
  return <AnimationDemo locale="bn" />
}
