import type { Metadata } from 'next'
import { NotepadDemo } from '@/components/tools/notepad-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Notepad',
  description:
    'আপনার ব্রাউজারে autosave হওয়া একটা plain-text scratchpad — একাধিক note, case/line utility, find & replace, import/export, আর code snippet-এর জন্য একটা ঐচ্ছিক syntax-highlighted প্রিভিউ।',
  alternates: buildAlternates('/bn/tools/notepad', '/tools/notepad', '/bn/tools/notepad'),
}

export default function NotepadPageBn() {
  return <NotepadDemo locale="bn" />
}
