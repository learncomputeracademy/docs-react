import type { Metadata } from 'next'
import { AccountPage } from '@/components/account-page'

// Personal page: everything on it comes from the visitor's own browser.
export const metadata: Metadata = {
  title: 'My account',
  robots: { index: false, follow: true },
}

export default function Page() {
  return <AccountPage locale="en" />
}
