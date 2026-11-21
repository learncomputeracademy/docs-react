'use client'

import { useEffect } from 'react'
import { hasStoredSession, setAccountState } from '@/lib/account-state'

// Mounted once in the site chrome. Loads the account code only when this
// browser has a saved session (or is returning from a sign-in redirect);
// everyone else just gets "signed-out" and downloads nothing extra.
export function AccountSync() {
  useEffect(() => {
    const returning = new URLSearchParams(window.location.search).has('code')
    if (hasStoredSession() || returning) {
      import('@/lib/account').then((m) => m.startAccount())
    } else {
      setAccountState({ status: 'signed-out' })
    }
  }, [])
  return null
}
