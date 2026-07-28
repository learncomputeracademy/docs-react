import type { Metadata } from 'next'
import { GridDemo } from '@/components/tools/grid-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'গ্রিড জেনারেটর',
  description:
    'সেলের উপর টেনে (drag করে) আইটেম বসিয়ে একটি আসল CSS Grid তৈরি করুন — fr, px, auto, আর minmax() ট্র্যাক মিশিয়ে ব্যবহার করুন, আর তৈরি হওয়া grid-template-areas সহ CSS, Tailwind, React আউটপুট এক্সপোর্ট করুন।',
  alternates: buildAlternates('/bn/tools/grid', '/tools/grid', '/bn/tools/grid'),
}

export default function GridGeneratorPageBn() {
  return <GridDemo locale="bn" />
}
