import type { Metadata } from 'next'
import { ProgressPage } from '@/components/progress-page'

export const metadata: Metadata = {
  title: 'আমার অগ্রগতি',
  robots: { index: false, follow: true },
}

export default function Page() {
  return <ProgressPage locale="bn" />
}
