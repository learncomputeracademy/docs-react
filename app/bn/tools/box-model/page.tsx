import type { Metadata } from 'next'
import { BoxModelDemo } from '@/components/tools/box-model-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'ইন্টারঅ্যাক্টিভ CSS বক্স মডেল',
  description:
    'স্লাইডার টেনে দেখুন content, padding, border আর margin কীভাবে বদলায়। বুঝে নিন কেন ৩০০px-এর বাক্স প্রায়ই ৩০০px চওড়া হয় না, আর তৈরি হওয়া CSS কপি করে নিন।',
  alternates: buildAlternates('/bn/tools/box-model', '/tools/box-model', '/bn/tools/box-model'),
}

export default function BoxModelPageBn() {
  return <BoxModelDemo locale="bn" />
}
