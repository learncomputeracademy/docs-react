import type { Metadata } from 'next'
import { ScrollbarDemo } from '@/components/tools/scrollbar-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'CSS স্ক্রলবার স্টাইলার',
  description:
    'স্ক্রলবারের প্রতিটি অংশ স্টাইল করুন — track, thumb, corner, buttons — ::-webkit-scrollbar আর স্ট্যান্ডার্ড scrollbar-width/scrollbar-color দিয়ে, আসল ব্রাউজার ইঞ্জিনে লাইভ রেন্ডার করা। কোন ব্রাউজার কোন সিস্টেম সাপোর্ট করে তার honest নোট, প্রিসেট, আর CSS/React আউটপুটসহ।',
  alternates: buildAlternates('/bn/tools/scrollbar', '/tools/scrollbar', '/bn/tools/scrollbar'),
}

export default function ScrollbarStylerPageBn() {
  return <ScrollbarDemo locale="bn" />
}
