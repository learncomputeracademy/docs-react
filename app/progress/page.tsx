import type { Metadata } from 'next'
import { ProgressPage } from '@/components/progress-page'

// Personal page: everything on it comes from the visitor's own browser.
export const metadata: Metadata = {
  title: 'My progress',
  robots: { index: false, follow: true },
}

export default function Page() {
  return <ProgressPage locale="en" />
}
