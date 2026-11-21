'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useSignInOpen } from '@/lib/account-state'

// Mounts the sign-in modal the first time anything opens it, so pages that
// never show it don't download it.
const SignInDialog = dynamic(() => import('./sign-in-dialog'), { ssr: false })

export function SignInHost({ logoLightUrl, logoDarkUrl }: { logoLightUrl: string; logoDarkUrl: string }) {
  const open = useSignInOpen()
  const [mounted, setMounted] = useState(false)
  if (open && !mounted) setMounted(true)
  return mounted ? <SignInDialog logoLightUrl={logoLightUrl} logoDarkUrl={logoDarkUrl} /> : null
}
