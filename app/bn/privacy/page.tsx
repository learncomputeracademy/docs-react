import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import { PrivacyContent } from '@/components/privacy-content'

export const metadata: Metadata = {
  title: 'গোপনীয়তা নীতি',
  description: 'docs.learncomputer.in কী তথ্য সংগ্রহ করে, কেন করে, আর আপনার অধিকার কী।',
  alternates: buildAlternates('/bn/privacy', '/privacy', '/bn/privacy'),
}

export default function Page() {
  return <PrivacyContent locale="bn" />
}
