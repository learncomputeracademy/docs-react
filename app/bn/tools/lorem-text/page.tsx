import type { Metadata } from 'next'
import { LoremDemo } from '@/components/tools/lorem-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Lorem Ipsum জেনারেটর',
  description:
    'একটা স্ট্যাটিক প্যারাগ্রাফ নয়, চারটা টেক্সট ইঞ্জিন — classic pseudo-Latin, pure gibberish, template-built realistic ইংরেজি prose, আর বাংলা। Words, sentences, paragraphs বা list item তৈরি করুন, HTML ট্যাগে wrap করুন, বা একটা নির্দিষ্ট character count টার্গেট করুন।',
  alternates: buildAlternates('/bn/tools/lorem-text', '/tools/lorem-text', '/bn/tools/lorem-text'),
}

export default function LoremIpsumGeneratorPageBn() {
  return <LoremDemo locale="bn" />
}
