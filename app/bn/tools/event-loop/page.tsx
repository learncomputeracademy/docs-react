import type { Metadata } from 'next'
import { EventLoopDemo } from '@/components/tools/event-loop-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Call Stack + Event Loop ভিজুয়ালাইজার',
  description:
    'আসল JavaScript, সত্যিই চালানো — আপনার নিজের কোড (বা একটা preset) আসলে execute হওয়ার সময় live call stack, Web APIs, আর microtask queue দেখুন, প্রতিটা step-এর জন্য একটা plain-English বর্ণনা আর সম্পূর্ণ animated step-by-step playback-সহ।',
  alternates: buildAlternates('/bn/tools/event-loop', '/tools/event-loop', '/bn/tools/event-loop'),
}

export default function EventLoopVisualizerPageBn() {
  return <EventLoopDemo locale="bn" />
}
