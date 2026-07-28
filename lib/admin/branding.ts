'use server'

import { uploadFile } from '@/lib/storage'
import { getSettingsForAdmin, saveSettings } from '@/lib/admin/settings'

export type BrandingSettings = { logoLightPublicId: string | null; logoDarkPublicId: string | null }

// Fixed key per variant, not media/<timestamp>-... (contrast lib/admin/
// media.ts's uploadMedia) — every re-upload overwrites the same Cloudinary
// asset (uploadFile -> uploadToCloudinary always passes overwrite: true),
// so the header's stored public_id never needs to change on a re-upload,
// only the bytes behind it do, and saveSettings' revalidatePath makes that
// show up everywhere at once.
export async function uploadLogo(variant: 'light' | 'dark', formData: FormData): Promise<string> {
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) throw new Error('No file provided')
  if (!file.type.startsWith('image/')) throw new Error('Logo must be an image file')

  const buffer = Buffer.from(await file.arrayBuffer())
  const key = variant === 'light' ? 'docs/img/site/logo-light.png' : 'docs/img/site/logo-dark.png'
  const uploaded = await uploadFile(buffer, key, file.type, 'image')
  const publicId = key.replace(/\.[^.]+$/, '')

  const current = (await getSettingsForAdmin('branding')) as Partial<BrandingSettings>
  const next: BrandingSettings = {
    logoLightPublicId: current.logoLightPublicId ?? null,
    logoDarkPublicId: current.logoDarkPublicId ?? null,
  }
  next[variant === 'light' ? 'logoLightPublicId' : 'logoDarkPublicId'] = publicId
  await saveSettings('branding', next)
  return uploaded.url
}
