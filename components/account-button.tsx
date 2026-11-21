'use client'

import { UserRound } from 'lucide-react'
import Link from '@/components/hover-link'
import { useAccount } from '@/lib/account-state'
import type { Locale } from '@/lib/types'

// Header entry to /account: the learner's avatar when signed in, a small
// "Sign in" link otherwise. Renders nothing until the state is known, so
// there is no signed-out flash for signed-in visitors.
export function AccountButton({ locale }: { locale: Locale }) {
  const { status, user } = useAccount()
  const href = locale === 'bn' ? '/bn/account' : '/account'
  if (status === 'unknown') return <span className="size-9 shrink-0" aria-hidden />

  if (status === 'signed-in' && user) {
    const label = locale === 'bn' ? 'আমার অ্যাকাউন্ট' : 'My account'
    return (
      <Link href={href} aria-label={label} title={user.name ?? user.email ?? label} className="flex size-9 shrink-0 items-center justify-center rounded-full ring-primary/40 transition hover:ring-2">
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element -- tiny remote avatar from Google/GitHub
          <img src={user.avatar} alt="" width={32} height={32} referrerPolicy="no-referrer" className="size-8 rounded-full object-cover" />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {(user.name ?? user.email ?? '?').slice(0, 1).toUpperCase()}
          </span>
        )}
      </Link>
    )
  }

  const label = locale === 'bn' ? 'সাইন ইন' : 'Sign in'
  return (
    <Link href={href} aria-label={label} className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
      <UserRound className="size-4" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  )
}
