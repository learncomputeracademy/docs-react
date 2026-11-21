import type { Metadata } from 'next'
import { AccountPage } from '@/components/account-page'

export const metadata: Metadata = {
  title: 'আমার অ্যাকাউন্ট',
  robots: { index: false, follow: true },
}

export default function Page() {
  return <AccountPage locale="bn" />
}
