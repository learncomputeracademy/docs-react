'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { saveSettings } from '@/lib/admin/settings'

type SeoSettings = { googleVerification: string; bingVerification: string }

function fromValue(value: Record<string, unknown>): SeoSettings {
  return {
    googleVerification: (value.googleVerification as string) ?? '',
    bingVerification: (value.bingVerification as string) ?? '',
  }
}

export function SeoManager({ initial }: { initial: Record<string, unknown> }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [values, setValues] = useState(fromValue(initial))

  function onSave() {
    setError(null)
    startTransition(async () => {
      try {
        await saveSettings('seo', values)
        setSaved(true)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Save failed')
      }
    })
  }

  function field(key: keyof SeoSettings, label: string, placeholder: string) {
    return (
      <label className="block space-y-1">
        <span className="text-xs font-medium">{label}</span>
        <input
          value={values[key]}
          onChange={(e) => { setValues((prev) => ({ ...prev, [key]: e.target.value })); setSaved(false) }}
          placeholder={placeholder}
          className="w-full rounded-md border bg-background px-2 py-1.5 text-sm font-mono"
        />
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

      <div className="max-w-lg space-y-4 rounded-lg border p-4">
        {field(
          'googleVerification',
          'Google Search Console verification',
          'the content= value from the HTML tag method'
        )}
        {field(
          'bingVerification',
          'Bing Webmaster Tools verification',
          'the content= value from the HTML tag method'
        )}
        <p className="text-xs text-muted-foreground">
          When you add the site in Search Console / Bing Webmaster Tools, choose the &quot;HTML
          tag&quot; verification method — it gives you a snippet like{' '}
          <code className="rounded bg-muted px-1">&lt;meta name=&quot;google-site-verification&quot; content=&quot;XXXX&quot;/&gt;</code>.
          Paste just the <code className="rounded bg-muted px-1">XXXX</code> part here, not the whole tag.
        </p>
      </div>
    </div>
  )
}
