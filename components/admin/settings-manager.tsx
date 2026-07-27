'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { saveSettings } from '@/lib/admin/settings'

type LocaleOverrides = {
  heroTitle1: string
  heroTitle2: string
  heroSub: string
  aboutBandTitle: string
  aboutBandBody: string
}

function emptyOverrides(): LocaleOverrides {
  return { heroTitle1: '', heroTitle2: '', heroSub: '', aboutBandTitle: '', aboutBandBody: '' }
}

function fromValue(value: Record<string, unknown>, locale: 'en' | 'bn'): LocaleOverrides {
  const raw = (value[locale] as Partial<LocaleOverrides>) ?? {}
  return { ...emptyOverrides(), ...raw }
}

// Only the plain-text fields are here — feature cards and the coming-soon
// list keep hardcoded icons (CLAUDE.md §4 bans runtime icon loading), so
// there's no safe way to make those admin-editable without either a
// second icon-delivery mechanism or a fixed icon-per-slot convention this
// phase didn't need to invent.
export function SettingsManager({ initial }: { initial: Record<string, unknown> }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [en, setEn] = useState(fromValue(initial, 'en'))
  const [bn, setBn] = useState(fromValue(initial, 'bn'))

  function onSave() {
    setError(null)
    startTransition(async () => {
      try {
        await saveSettings('home', { en, bn })
        setSaved(true)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Save failed')
      }
    })
  }

  function field(
    locale: 'en' | 'bn',
    key: keyof LocaleOverrides,
    label: string,
    placeholder: string,
    multiline = false
  ) {
    const state = locale === 'en' ? en : bn
    const setState = locale === 'en' ? setEn : setBn
    const value = state[key]
    const onChange = (v: string) => {
      setState((prev) => ({ ...prev, [key]: v }))
      setSaved(false)
    }
    return (
      <label className="block space-y-1">
        <span className="text-xs font-medium">{label}</span>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="w-full resize-y rounded-md border bg-background px-2 py-1.5 text-sm"
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          />
        )}
        <span className="block text-xs text-muted-foreground">Empty = use the site default</span>
      </label>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {!saved && <span className="text-xs text-muted-foreground">Unsaved changes</span>}
        <Button size="sm" disabled={pending} onClick={onSave} className="ml-auto">Save</Button>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="font-semibold">English</h2>
          {field('en', 'heroTitle1', 'Hero title (part 1)', 'Learn to build ')}
          {field('en', 'heroTitle2', 'Hero title (part 2, accent color)', 'for the web')}
          {field('en', 'heroSub', 'Hero subtitle', 'Free lessons on...', true)}
          {field('en', 'aboutBandTitle', 'About band title', 'From the team behind...')}
          {field('en', 'aboutBandBody', 'About band body', 'A hands-on training institute...', true)}
        </div>
        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="font-semibold">বাংলা</h2>
          {field('bn', 'heroTitle1', 'Hero title (part 1)', 'ওয়েবের জন্য ')}
          {field('bn', 'heroTitle2', 'Hero title (part 2, accent color)', 'তৈরি করা শিখুন')}
          {field('bn', 'heroSub', 'Hero subtitle', '...', true)}
          {field('bn', 'aboutBandTitle', 'About band title', '...')}
          {field('bn', 'aboutBandBody', 'About band body', '...', true)}
        </div>
      </div>
    </div>
  )
}
