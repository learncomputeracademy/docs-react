import type { Metadata } from 'next'
import { ToolsIndex } from '@/components/tools-index'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'টুলস',
  description:
    'যে CSS একটা স্ক্রিনশট থেকে শেখা যায় না তার জন্য ইন্টারঅ্যাক্টিভ টুল — box model, box shadow, gradient, flexbox, scrollbar, specificity আর কালার কনট্রাস্ট। প্রতিটি সংশ্লিষ্ট পাঠের সাথে যুক্ত আর সম্পূর্ণ বাংলায় কাজ করে।',
  alternates: buildAlternates('/bn/tools', '/tools', '/bn/tools'),
}

export default function ToolsIndexPageBn() {
  return <ToolsIndex locale="bn" />
}
