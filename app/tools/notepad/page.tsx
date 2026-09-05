import type { Metadata } from 'next'
import { NotepadDemo } from '@/components/tools/notepad-demo'
import { buildAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Notepad',
  description:
    'A plain-text scratchpad that autosaves in your browser — multiple notes, case/line utilities, find & replace, import/export, and an optional syntax-highlighted preview for code snippets.',
  alternates: buildAlternates('/tools/notepad', '/tools/notepad', '/bn/tools/notepad'),
}

export default function NotepadPage() {
  return <NotepadDemo locale="en" />
}
