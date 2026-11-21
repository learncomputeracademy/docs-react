'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Trash2, ShieldCheck, LogOut, Cloud, UserX } from 'lucide-react'
import { openSignIn, useAccount } from '@/lib/account-state'
import Link from '@/components/hover-link'
import { Button } from '@/components/ui/button'
import { LEARNING_KEYS, clearLearningData, useCompleted, useXp, useStreak } from '@/lib/progress'

const loadAccount = () => import('@/lib/account')
import type { Locale } from '@/lib/types'

// /account and /bn/account (2026-11-21). Signed out: "your data" is what this
// browser holds. Signed in (Google/GitHub, lib/account.ts): profile, sign out,
// "delete my account", and "clear my data" also clears the account copy.

// Tool data: notes, typing-test history, saved tool settings. Cleared only when
// the visitor ticks the box — notes are their own writing, not progress.
const TOOL_KEYS = [
  'lca-notepad-notes-v1',
  'lca-notepad-active-v1',
  'typing-test-history-v1',
  'typing-test-weak-keys-v1',
  'typing-test-lesson-progress-v1',
  'typing-test-settings-v1',
  'box-shadow-demo-state',
  'contrast-demo-state',
  'flexbox-demo-state',
  'gradient-demo-state',
  'grid-demo-state',
  'scrollbar-demo-state',
]

const T = {
  en: {
    title: 'My account',
    intro: 'You are not signed in. Your progress is stored only in this browser, on this device, and nothing is sent to us.',
    summary: (lessons: number, xp: number, streak: number) => `${lessons} lessons done · ${xp} XP · ${streak}-day streak`,
    downloadTitle: 'Download my data',
    downloadBody: 'Save a copy of your progress, quiz scores, streak, badges and tool data as a file. Keep it as a backup.',
    downloadBtn: 'Download (.json)',
    clearTitle: 'Clear my data',
    clearBody: 'Remove your progress, quiz scores, XP, streak and badges from this browser. You start fresh. This cannot be undone, so download a copy first if you might want it.',
    clearTools: 'Also delete my notes, typing-test history and saved tool settings',
    clearBtn: 'Clear my data',
    confirmTitle: 'Clear all your data?',
    confirmBody: 'Your progress, quiz scores, XP, streak and badges will be removed from this browser. This cannot be undone.',
    confirmToolsToo: 'Your notes, typing-test history and saved tool settings will be deleted too.',
    cancel: 'Cancel',
    confirm: 'Yes, clear it',
    cleared: 'Done. Your data has been cleared from this browser.',
    privacyTitle: 'Privacy',
    privacyBody: 'What this site collects, why, and your rights.',
    privacyLink: 'Read the privacy policy',
    progressLink: 'See my progress',
    introSignedIn: 'Your progress is saved to your account and kept in step on every device you sign in on.',
    signInTitle: 'Save your progress across devices',
    signInBody: 'Sign in to keep your lessons, quiz scores, streak and badges on your phone, laptop and any other device. What you have done in this browser is added to your account, not lost. Free, and optional.',
    signInBtn: 'Sign in with Google or GitHub',
    signInNote: 'We only receive your name, email address and profile picture. See the privacy policy.',
    signedInAs: 'Signed in as',
    syncing: 'Syncing…',
    synced: 'Progress saved to your account',
    signOut: 'Sign out',
    clearBodySignedIn: 'Remove your progress, quiz scores, XP, streak and badges from this browser and from your account. You stay signed in and start fresh. This cannot be undone.',
    deleteTitle: 'Delete my account',
    deleteBody: 'Permanently delete your account and everything saved in it. Progress in this browser is cleared too. This cannot be undone.',
    deleteBtn: 'Delete my account',
    deleteConfirmTitle: 'Delete your account?',
    deleteConfirmBody: 'Your account and all saved progress will be permanently deleted. Type DELETE to confirm.',
    deleteWord: 'DELETE',
    deleteConfirm: 'Delete permanently',
    deleted: 'Your account has been deleted.',
    failed: 'Something went wrong. Please try again.',
  },
  bn: {
    title: 'আমার অ্যাকাউন্ট',
    intro: 'আপনি সাইন ইন করেননি। আপনার অগ্রগতি শুধু এই ডিভাইসের এই ব্রাউজারে রাখা আছে, আমাদের কাছে কিছু পাঠানো হয় না।',
    summary: (lessons: number, xp: number, streak: number) => `${lessons}টি পাঠ শেষ · ${xp} XP · ${streak} দিনের স্ট্রিক`,
    downloadTitle: 'আমার তথ্য ডাউনলোড করুন',
    downloadBody: 'আপনার অগ্রগতি, কুইজের স্কোর, স্ট্রিক, ব্যাজ আর টুলের তথ্যের একটি কপি ফাইল হিসেবে সেভ করুন। ব্যাকআপ হিসেবে রেখে দিন।',
    downloadBtn: 'ডাউনলোড (.json)',
    clearTitle: 'আমার তথ্য মুছে ফেলুন',
    clearBody: 'এই ব্রাউজার থেকে আপনার অগ্রগতি, কুইজের স্কোর, XP, স্ট্রিক আর ব্যাজ মুছে যাবে। আপনি নতুন করে শুরু করবেন। এটি ফেরানো যায় না, তাই দরকার মনে হলে আগে একটি কপি ডাউনলোড করে নিন।',
    clearTools: 'আমার নোট, টাইপিং টেস্টের ইতিহাস আর টুলের সেভ করা সেটিংসও মুছে ফেলুন',
    clearBtn: 'আমার তথ্য মুছুন',
    confirmTitle: 'আপনার সব তথ্য মুছে ফেলবেন?',
    confirmBody: 'এই ব্রাউজার থেকে আপনার অগ্রগতি, কুইজের স্কোর, XP, স্ট্রিক আর ব্যাজ মুছে যাবে। এটি ফেরানো যায় না।',
    confirmToolsToo: 'আপনার নোট, টাইপিং টেস্টের ইতিহাস আর টুলের সেভ করা সেটিংসও মুছে যাবে।',
    cancel: 'বাতিল',
    confirm: 'হ্যাঁ, মুছে ফেলুন',
    cleared: 'হয়ে গেছে। এই ব্রাউজার থেকে আপনার তথ্য মুছে ফেলা হয়েছে।',
    privacyTitle: 'গোপনীয়তা',
    privacyBody: 'এই সাইট কী তথ্য সংগ্রহ করে, কেন করে, আর আপনার অধিকার কী।',
    privacyLink: 'গোপনীয়তা নীতি পড়ুন',
    progressLink: 'আমার অগ্রগতি দেখুন',
    introSignedIn: 'আপনার অগ্রগতি অ্যাকাউন্টে সেভ থাকে আর যে ডিভাইসেই সাইন ইন করুন সেখানে মিলে থাকে।',
    signInTitle: 'সব ডিভাইসে অগ্রগতি সেভ রাখুন',
    signInBody: 'সাইন ইন করলে আপনার পাঠ, কুইজের স্কোর, স্ট্রিক আর ব্যাজ ফোন, ল্যাপটপ আর অন্য যেকোনো ডিভাইসে থাকবে। এই ব্রাউজারে যা করেছেন তা অ্যাকাউন্টে যোগ হবে, হারাবে না। বিনামূল্যে, আর ঐচ্ছিক।',
    signInBtn: 'Google বা GitHub দিয়ে সাইন ইন',
    signInNote: 'আমরা শুধু আপনার নাম, ইমেল ঠিকানা আর প্রোফাইল ছবি পাই। গোপনীয়তা নীতি দেখুন।',
    signedInAs: 'সাইন ইন করা আছে',
    syncing: 'মিলিয়ে নেওয়া হচ্ছে…',
    synced: 'অগ্রগতি আপনার অ্যাকাউন্টে সেভ আছে',
    signOut: 'সাইন আউট',
    clearBodySignedIn: 'এই ব্রাউজার আর আপনার অ্যাকাউন্ট থেকে অগ্রগতি, কুইজের স্কোর, XP, স্ট্রিক আর ব্যাজ মুছে যাবে। আপনি সাইন ইন থাকবেন আর নতুন করে শুরু করবেন। এটি ফেরানো যায় না।',
    deleteTitle: 'আমার অ্যাকাউন্ট মুছে ফেলুন',
    deleteBody: 'আপনার অ্যাকাউন্ট আর তাতে সেভ করা সবকিছু চিরতরে মুছে যাবে। এই ব্রাউজারের অগ্রগতিও মুছে যাবে। এটি ফেরানো যায় না।',
    deleteBtn: 'আমার অ্যাকাউন্ট মুছুন',
    deleteConfirmTitle: 'আপনার অ্যাকাউন্ট মুছে ফেলবেন?',
    deleteConfirmBody: 'আপনার অ্যাকাউন্ট আর সব সেভ করা অগ্রগতি চিরতরে মুছে যাবে। নিশ্চিত করতে DELETE লিখুন।',
    deleteWord: 'DELETE',
    deleteConfirm: 'চিরতরে মুছুন',
    deleted: 'আপনার অ্যাকাউন্ট মুছে ফেলা হয়েছে।',
    failed: 'কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।',
  },
} as const

function readAll(keys: readonly string[]) {
  const out: Record<string, unknown> = {}
  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k)
      if (raw === null) continue
      try {
        out[k] = JSON.parse(raw)
      } catch {
        out[k] = raw
      }
    } catch {}
  }
  return out
}

export function AccountPage({ locale }: { locale: Locale }) {
  const s = T[locale]
  const prefix = locale === 'bn' ? '/bn' : ''
  const completed = useCompleted()
  const xp = useXp()
  const { count } = useStreak()
  const [withTools, setWithTools] = useState(false)
  const [cleared, setCleared] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const deleteDialog = useRef<HTMLDialogElement>(null)
  const { status, user, syncing } = useAccount()
  const signedIn = status === 'signed-in' && !!user
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleted, setDeleted] = useState(false)
  const [typed, setTyped] = useState('')

  // Back from Google/GitHub: drop ?code=… from the address bar once signed in.
  useEffect(() => {
    if (signedIn && window.location.search.includes('code=')) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [signedIn])

  async function run(key: string, fn: () => Promise<void>) {
    setBusy(key)
    setError(null)
    try {
      await fn()
    } catch (e) {
      console.warn('[account]', e)
      setError(s.failed)
    } finally {
      setBusy(null)
    }
  }

  function download() {
    const data = {
      site: 'docs.learncomputer.in',
      exportedAt: new Date().toISOString(),
      learning: readAll(LEARNING_KEYS),
      tools: readAll(TOOL_KEYS),
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `learncomputer-docs-data-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function clearNow() {
    if (signedIn) {
      try {
        await (await loadAccount()).clearAccountData()
      } catch (e) {
        console.warn('[account]', e)
        setError(s.failed)
      }
    } else {
      clearLearningData()
    }
    if (withTools) {
      for (const k of TOOL_KEYS) {
        try {
          localStorage.removeItem(k)
        } catch {}
      }
    }
    dialog.current?.close()
    setCleared(true)
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">{s.title}</h1>
      <p className="mt-3 text-muted-foreground">{signedIn ? s.introSignedIn : s.intro}</p>
      <p className="mt-2 text-sm font-medium tabular-nums">
        {s.summary(completed.size, xp, count)} ·{' '}
        <Link href={`${prefix}/progress`} className="text-primary underline-offset-4 hover:underline">{s.progressLink}</Link>
      </p>

      <div className="mt-8 space-y-4">
        {deleted && <p role="status" className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm font-medium">{s.deleted}</p>}
        {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-medium text-destructive">{error}</p>}

        {signedIn ? (
          <section className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-5">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote avatar from Google/GitHub
              <img src={user.avatar} alt="" width={48} height={48} referrerPolicy="no-referrer" className="size-12 rounded-full object-cover" />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">{(user.name ?? user.email ?? '?').slice(0, 1).toUpperCase()}</span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">{s.signedInAs}</p>
              <p className="truncate font-semibold">{user.name ?? user.email}</p>
              {user.name && user.email && <p className="truncate text-sm text-muted-foreground">{user.email}</p>}
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Cloud className="size-3.5" aria-hidden />{syncing ? s.syncing : s.synced}</p>
            </div>
            <Button variant="outline" className="min-h-11" disabled={busy !== null} onClick={() => run('out', async () => (await loadAccount()).signOut())}>
              <LogOut className="size-4" aria-hidden />{s.signOut}
            </Button>
          </section>
        ) : status === 'signed-out' ? (
          <section className="rounded-xl border border-primary/40 bg-card p-5">
            <h2 className="font-semibold">{s.signInTitle}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.signInBody}</p>
            <Button className="mt-4 min-h-11" onClick={openSignIn}>{s.signInBtn}</Button>
            <p className="mt-3 text-xs text-muted-foreground">
              <Link href={`${prefix}/privacy`} className="underline-offset-4 hover:text-foreground hover:underline">{s.signInNote}</Link>
            </p>
          </section>
        ) : (
          <div className="h-36 animate-pulse rounded-xl border bg-card" aria-hidden />
        )}

        <section className="rounded-xl border bg-card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><Download className="size-4 text-primary" aria-hidden />{s.downloadTitle}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{s.downloadBody}</p>
          <Button variant="outline" className="mt-4 min-h-11" onClick={download}>{s.downloadBtn}</Button>
        </section>

        <section className="rounded-xl border border-destructive/40 bg-card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><Trash2 className="size-4 text-destructive" aria-hidden />{s.clearTitle}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{signedIn ? s.clearBodySignedIn : s.clearBody}</p>
          <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={withTools} onChange={(e) => setWithTools(e.target.checked)} className="mt-0.5 size-4 accent-destructive" />
            {s.clearTools}
          </label>
          <Button className="mt-3 min-h-11 bg-destructive text-white hover:bg-destructive/90" onClick={() => { setCleared(false); dialog.current?.showModal() }}>{s.clearBtn}</Button>
          {cleared && <p role="status" className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">{s.cleared}</p>}
        </section>

        {signedIn && (
          <section className="rounded-xl border border-destructive/40 bg-card p-5">
            <h2 className="flex items-center gap-2 font-semibold"><UserX className="size-4 text-destructive" aria-hidden />{s.deleteTitle}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.deleteBody}</p>
            <Button className="mt-4 min-h-11 bg-destructive text-white hover:bg-destructive/90" onClick={() => { setTyped(''); deleteDialog.current?.showModal() }}>{s.deleteBtn}</Button>
          </section>
        )}

        <section className="rounded-xl border bg-card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-4 text-primary" aria-hidden />{s.privacyTitle}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{s.privacyBody}</p>
          <Link href={`${prefix}/privacy`} className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">{s.privacyLink}</Link>
        </section>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="clear-title"
        className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-xl border bg-background p-6 text-foreground shadow-xl backdrop:bg-black/50"
      >
        <h2 id="clear-title" className="text-lg font-semibold">{s.confirmTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{s.confirmBody}</p>
        {withTools && <p className="mt-2 text-sm font-medium text-destructive">{s.confirmToolsToo}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="outline" className="min-h-11" autoFocus onClick={() => dialog.current?.close()}>{s.cancel}</Button>
          <Button className="min-h-11 bg-destructive text-white hover:bg-destructive/90" onClick={clearNow}>{s.confirm}</Button>
        </div>
      </dialog>

      <dialog
        ref={deleteDialog}
        aria-labelledby="delete-title"
        className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-xl border bg-background p-6 text-foreground shadow-xl backdrop:bg-black/50"
      >
        <h2 id="delete-title" className="text-lg font-semibold">{s.deleteConfirmTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{s.deleteConfirmBody}</p>
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          aria-label={s.deleteWord}
          autoComplete="off"
          className="mt-4 h-11 w-full rounded-lg border bg-card px-3 text-sm outline-none focus:border-destructive/60 focus:ring-2 focus:ring-destructive/20"
        />
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="outline" className="min-h-11" autoFocus onClick={() => deleteDialog.current?.close()}>{s.cancel}</Button>
          <Button
            className="min-h-11 bg-destructive text-white hover:bg-destructive/90"
            disabled={typed.trim() !== s.deleteWord || busy !== null}
            onClick={() =>
              run('delete', async () => {
                await (await loadAccount()).deleteAccount()
                deleteDialog.current?.close()
                setDeleted(true)
              })
            }
          >
            {s.deleteConfirm}
          </Button>
        </div>
      </dialog>
    </main>
  )
}
