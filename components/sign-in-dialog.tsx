'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, Cloud, ShieldCheck } from 'lucide-react'
import IconGoogle from '~icons/simple-icons/google'
import IconGithub from '~icons/simple-icons/github'
import Link from '@/components/hover-link'
import { closeSignIn, useAccount, useSignInOpen } from '@/lib/account-state'
import { localeFromPathname } from '@/lib/i18n'

// Sign-in modal (owner request 2026-11-21). Loaded on first open only
// (components/sign-in-host.tsx). Google uses Google Identity Services when
// NEXT_PUBLIC_GOOGLE_CLIENT_ID is set: a Google popup that names our site,
// not the Supabase callback domain, and returns an ID token we pass to
// Supabase. Without the ID it falls back to the normal redirect. GitHub is
// always a redirect back to the page the visitor was on.

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const loadAccount = () => import('@/lib/account')

const T = {
  en: {
    title: 'Save your progress on every device',
    body: 'Sign in to keep your lessons, quiz scores, streak and badges on your phone, laptop and anywhere else. What you have done in this browser is kept, not lost.',
    google: 'Continue with Google',
    github: 'Continue with GitHub',
    opening: 'Opening…',
    perks: 'Free · No password to remember · Optional',
    privacy: 'We only receive your name, email and profile picture.',
    privacyLink: 'Privacy policy',
    close: 'Close',
    failed: 'Sign-in did not complete. Please try again.',
  },
  bn: {
    title: 'সব ডিভাইসে অগ্রগতি সেভ রাখুন',
    body: 'সাইন ইন করলে আপনার পাঠ, কুইজের স্কোর, স্ট্রিক আর ব্যাজ ফোন, ল্যাপটপ আর যেকোনো জায়গায় থাকবে। এই ব্রাউজারে যা করেছেন তা থেকে যাবে, হারাবে না।',
    google: 'Google দিয়ে চালিয়ে যান',
    github: 'GitHub দিয়ে চালিয়ে যান',
    opening: 'খুলছে…',
    perks: 'বিনামূল্যে · মনে রাখার মতো password নেই · ঐচ্ছিক',
    privacy: 'আমরা শুধু আপনার নাম, ইমেল আর প্রোফাইল ছবি পাই।',
    privacyLink: 'গোপনীয়তা নীতি',
    close: 'বন্ধ করুন',
    failed: 'সাইন-ইন সম্পূর্ণ হয়নি। আবার চেষ্টা করুন।',
  },
} as const

type GoogleId = {
  accounts: {
    id: {
      initialize: (o: Record<string, unknown>) => void
      renderButton: (el: HTMLElement, o: Record<string, unknown>) => void
    }
  }
}

let gisPromise: Promise<GoogleId> | null = null
function loadGis(): Promise<GoogleId> {
  gisPromise ??= new Promise((resolve, reject) => {
    const w = window as unknown as { google?: GoogleId }
    if (w.google?.accounts?.id) return resolve(w.google)
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => (w.google ? resolve(w.google) : reject(new Error('GIS unavailable')))
    s.onerror = () => {
      gisPromise = null
      reject(new Error('GIS failed to load'))
    }
    document.head.appendChild(s)
  })
  return gisPromise
}

async function sha256Hex(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function SignInDialog({ logoLightUrl, logoDarkUrl }: { logoLightUrl: string; logoDarkUrl: string }) {
  const open = useSignInOpen()
  const { status } = useAccount()
  const pathname = usePathname()
  const s = T[localeFromPathname(pathname)]
  const ref = useRef<HTMLDialogElement>(null)
  const googleSlot = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState<'google' | 'github' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [gisReady, setGisReady] = useState(false)

  // Open/close the native dialog from the store.
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      setError(null)
      d.showModal()
    } else if (!open && d.open) d.close()
  }, [open])

  // Signed in (Google popup, or a session restored meanwhile): close.
  useEffect(() => {
    if (status === 'signed-in' && open) closeSignIn()
  }, [status, open])

  // Google Identity Services button, rendered into its slot on open.
  useEffect(() => {
    if (!open || !GOOGLE_CLIENT_ID || !googleSlot.current) return
    let cancelled = false
    ;(async () => {
      try {
        const google = await loadGis()
        const rawNonce = crypto.randomUUID()
        const nonce = await sha256Hex(rawNonce)
        if (cancelled || !googleSlot.current) return
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          nonce,
          use_fedcm_for_button: true,
          callback: async (res: { credential?: string }) => {
            if (!res.credential) return
            setBusy('google')
            try {
              await (await loadAccount()).signInWithGoogleToken(res.credential, rawNonce)
            } catch (e) {
              console.warn('[sign-in]', e)
              setError(s.failed)
            } finally {
              setBusy(null)
            }
          },
        })
        const dark = document.documentElement.classList.contains('dark')
        googleSlot.current.replaceChildren()
        google.accounts.id.renderButton(googleSlot.current, {
          theme: dark ? 'filled_black' : 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          logo_alignment: 'center',
          width: Math.min(googleSlot.current.clientWidth || 320, 400),
          locale: localeFromPathname(pathname) === 'bn' ? 'bn' : 'en',
        })
        setGisReady(true)
      } catch (e) {
        console.warn('[sign-in] Google button unavailable, using redirect', e)
        setGisReady(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, pathname, s.failed])

  async function redirect(provider: 'google' | 'github') {
    setBusy(provider)
    setError(null)
    try {
      await (await loadAccount()).signIn(provider, pathname)
    } catch (e) {
      console.warn('[sign-in]', e)
      setError(s.failed)
      setBusy(null)
    }
  }

  const btn =
    'flex h-11 w-full items-center justify-center gap-2.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-60'

  return (
    <dialog
      ref={ref}
      aria-labelledby="sign-in-title"
      onClose={() => closeSignIn()}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSignIn()
      }}
      className="m-auto w-[min(26rem,calc(100%-2rem))] overflow-hidden rounded-3xl border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 h-56 bg-[radial-gradient(60%_60%_at_50%_100%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent)]" />
        <button
          type="button"
          onClick={() => closeSignIn()}
          aria-label={s.close}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="relative px-6 pb-6 pt-9 text-center sm:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element -- same pre-sized Cloudinary logos as the header */}
          <img src={logoLightUrl} alt="" width={8588} height={1498} className="mx-auto block h-9 w-auto dark:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element -- same as above */}
          <img src={logoDarkUrl} alt="" width={8723} height={1850} className="mx-auto hidden h-9 w-auto dark:block" />

          <h2 id="sign-in-title" className="mt-6 text-xl font-semibold tracking-tight text-balance">{s.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>

          <div className="mt-6 space-y-3">
            {GOOGLE_CLIENT_ID && (
              <div ref={googleSlot} className={`flex min-h-11 w-full justify-center ${gisReady ? '' : 'hidden'}`} />
            )}
            {(!GOOGLE_CLIENT_ID || !gisReady) && (
              <button type="button" disabled={busy !== null} onClick={() => redirect('google')} className={`${btn} border bg-card hover:bg-muted`}>
                <IconGoogle className="size-4" aria-hidden />
                {busy === 'google' ? s.opening : s.google}
              </button>
            )}
            <button type="button" disabled={busy !== null} onClick={() => redirect('github')} className={`${btn} bg-[#24292f] text-white hover:bg-[#32383f] dark:bg-white dark:text-[#24292f] dark:hover:bg-white/90`}>
              <IconGithub className="size-4" aria-hidden />
              {busy === 'github' ? s.opening : s.github}
            </button>
          </div>

          {error && <p role="alert" className="mt-4 text-sm font-medium text-destructive">{error}</p>}

          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Cloud className="size-3.5 text-primary" aria-hidden />
            {s.perks}
          </p>
        </div>

        <p className="flex items-center justify-center gap-1.5 border-t bg-muted/40 px-6 py-3 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
          <span>
            {s.privacy}{' '}
            <Link
              href={localeFromPathname(pathname) === 'bn' ? '/bn/privacy' : '/privacy'}
              onClick={() => closeSignIn()}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {s.privacyLink}
            </Link>
          </span>
        </p>
      </div>
    </dialog>
  )
}
