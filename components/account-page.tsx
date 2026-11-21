'use client'

import { useRef, useState } from 'react'
import { Download, Trash2, ShieldCheck } from 'lucide-react'
import Link from '@/components/hover-link'
import { Button } from '@/components/ui/button'
import { LEARNING_KEYS, clearLearningData, useCompleted, useXp, useStreak } from '@/lib/progress'
import type { Locale } from '@/lib/types'

// /account and /bn/account (2026-11-21). No sign-in yet, so "your data" is what
// this browser holds. When accounts arrive this page gains the profile, sign
// out, and "delete my account"; "clear my data" then also clears the server copy.

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
    intro: 'There is no sign-in yet. Everything below is stored only in this browser, on this device. Nothing here is sent to us.',
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
  },
  bn: {
    title: 'আমার অ্যাকাউন্ট',
    intro: 'এখনও সাইন-ইন ব্যবস্থা নেই। নিচের সব তথ্য শুধু এই ডিভাইসের এই ব্রাউজারে রাখা আছে। এর কিছুই আমাদের কাছে পাঠানো হয় না।',
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

  function clearNow() {
    clearLearningData()
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
      <p className="mt-3 text-muted-foreground">{s.intro}</p>
      <p className="mt-2 text-sm font-medium tabular-nums">
        {s.summary(completed.size, xp, count)} ·{' '}
        <Link href={`${prefix}/progress`} className="text-primary underline-offset-4 hover:underline">{s.progressLink}</Link>
      </p>

      <div className="mt-8 space-y-4">
        <section className="rounded-xl border bg-card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><Download className="size-4 text-primary" aria-hidden />{s.downloadTitle}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{s.downloadBody}</p>
          <Button variant="outline" className="mt-4 min-h-11" onClick={download}>{s.downloadBtn}</Button>
        </section>

        <section className="rounded-xl border border-destructive/40 bg-card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><Trash2 className="size-4 text-destructive" aria-hidden />{s.clearTitle}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{s.clearBody}</p>
          <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={withTools} onChange={(e) => setWithTools(e.target.checked)} className="mt-0.5 size-4 accent-destructive" />
            {s.clearTools}
          </label>
          <Button className="mt-3 min-h-11 bg-destructive text-white hover:bg-destructive/90" onClick={() => { setCleared(false); dialog.current?.showModal() }}>{s.clearBtn}</Button>
          {cleared && <p role="status" className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">{s.cleared}</p>}
        </section>

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
    </main>
  )
}
