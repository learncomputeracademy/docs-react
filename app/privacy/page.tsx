import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import { PrivacyContent } from '@/components/privacy-content'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What docs.learncomputer.in collects, why, and your rights.',
  alternates: buildAlternates('/privacy', '/privacy', '/bn/privacy'),
}

export default function Page() {
  return <PrivacyContent locale="en" />
}
