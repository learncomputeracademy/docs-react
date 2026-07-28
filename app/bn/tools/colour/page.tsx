import type { Metadata } from 'next'
import { ContrastDemo } from '@/components/tools/contrast-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'কালার ও কনট্রাস্ট স্টুডিও',
  description:
    'একটি রং থেকে প্যালেট তৈরি করুন (complementary, triadic, analogous, split-complementary), আসল WCAG AA/AAA কনট্রাস্ট ম্যাথ যাচাই করুন, আর protanopia, deuteranopia, tritanopia-তে রং কেমন দেখায় প্রিভিউ করুন। CSS ভেরিয়েবল বা Tailwind @theme ব্লক হিসেবে এক্সপোর্ট করুন।',
  alternates: buildAlternates('/bn/tools/colour', '/tools/colour', '/bn/tools/colour'),
}

export default function ColourContrastStudioPageBn() {
  return <ContrastDemo locale="bn" />
}
