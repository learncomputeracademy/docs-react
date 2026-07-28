'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { uploadLogo, type BrandingSettings } from '@/lib/admin/branding'
import { cldUrl, DEFAULT_LOGO_LIGHT_PUBLIC_ID, DEFAULT_LOGO_DARK_PUBLIC_ID } from '@/lib/cloudinary'

type Variant = 'light' | 'dark'

function LogoUploader({
  variant,
  label,
  publicId,
  swatchClass,
}: {
  variant: Variant
  label: string
  publicId: string
  swatchClass: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const file = inputRef.current?.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.set('file', file)
    startTransition(async () => {
      try {
        await uploadLogo(variant, formData)
        e.currentTarget.reset()
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      }
    })
  }

  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-medium">{label}</p>
      <div className={`mt-3 flex items-center justify-center rounded-md p-4 ${swatchClass}`}>
        {/* Same f_auto,q_auto,c_limit,w_480 transform the live header
            requests (app/layout.tsx) — this preview is what visitors
            actually get, not a separate admin-only rendering. */}
        <img src={cldUrl(publicId, 'f_auto,q_auto,c_limit,w_480')} alt={`${label} preview`} className="h-8 w-auto" />
      </div>
      <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
        <input ref={inputRef} type="file" accept="image/*" required className="min-w-0 flex-1 text-xs" />
        <Button type="submit" size="sm" disabled={pending}>Upload</Button>
      </form>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}

// The logo itself is the text — both PNGs have "Learn Computer Academy"
// baked into the artwork, one in black (light mode), one in white (dark
// mode) — so this only ever needs the file, never a text field, unlike
// SeoManager/other settings sections in this admin.
export function BrandingManager({ initial }: { initial: Partial<BrandingSettings> }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <LogoUploader
        variant="light"
        label="Light-mode logo (dark text, for the light-theme header)"
        publicId={initial.logoLightPublicId || DEFAULT_LOGO_LIGHT_PUBLIC_ID}
        swatchClass="bg-white"
      />
      <LogoUploader
        variant="dark"
        label="Dark-mode logo (light text, for the dark-theme header)"
        publicId={initial.logoDarkPublicId || DEFAULT_LOGO_DARK_PUBLIC_ID}
        swatchClass="bg-neutral-900"
      />
    </div>
  )
}
