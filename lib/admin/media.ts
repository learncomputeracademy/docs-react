'use server'

import * as cheerio from 'cheerio'
import { createClient } from '@/lib/supabase/server'
import { uploadFile, slugifyFilename } from '@/lib/storage'
import { logActivity } from '@/lib/admin/activity'

export type MediaRow = {
  id: string
  backend: 'cloudinary' | 'r2'
  public_id: string
  url: string
  kind: 'image' | 'video' | 'file'
  alt: string | null
  width: number | null
  height: number | null
  bytes: number | null
  created_at: string
}

export async function listMediaForAdmin(): Promise<MediaRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

function kindFromMimeType(mime: string): 'image' | 'video' | 'file' {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  return 'file'
}

export async function uploadMedia(formData: FormData): Promise<MediaRow> {
  const file = formData.get('file')
  const alt = (formData.get('alt') as string) || null
  if (!(file instanceof File) || file.size === 0) throw new Error('No file provided')

  const buffer = Buffer.from(await file.arrayBuffer())
  const key = `media/${Date.now()}-${slugifyFilename(file.name)}`
  const kind = kindFromMimeType(file.type)

  let uploaded: { url: string; backend: 'cloudinary' | 'r2' }
  try {
    uploaded = await uploadFile(buffer, key, file.type, kind === 'file' ? 'raw' : kind)
  } catch (e) {
    // R2 credentials aren't configured in this environment yet (see D-29) —
    // give a specific, actionable error instead of a raw AWS SDK stack trace.
    if (buffer.byteLength >= 10 * 1024 * 1024) {
      throw new Error('This file is 10 MB or larger and needs R2 storage, which is not configured yet. Compress it under 10 MB, or ask to have R2 credentials added.')
    }
    throw e
  }

  const publicId = uploaded.backend === 'cloudinary' ? key.replace(/\.[^.]+$/, '') : key

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('media')
    .insert({
      backend: uploaded.backend,
      public_id: publicId,
      url: uploaded.url,
      kind,
      alt,
      bytes: buffer.byteLength,
    })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  await logActivity('uploaded', 'media', data.id, file.name)
  return data
}

export async function updateMediaAlt(id: string, alt: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('media').update({ alt: alt || null }).eq('id', id)
  if (error) throw new Error(error.message)
}

// Not a jsonb `@>` containment query (ADMIN-PLAN.md §5 suggested one) —
// publicId also shows up as a substring inside full Cloudinary URLs
// embedded in richtext/callout HTML (see scripts/backfill-media.mjs),
// which containment can't match. Scanning in JS against the same two
// tables the backfill reads is the version that's actually correct here.
export async function findMediaReferences(publicId: string): Promise<{ title: string; path: string }[]> {
  const supabase = await createClient()
  const [{ data: docs, error: docsError }, { data: translations, error: trError }] = await Promise.all([
    supabase.from('docs').select('title, path, blocks'),
    supabase.from('doc_translations').select('doc_id, blocks, docs(title, path)'),
  ])
  if (docsError) throw new Error(docsError.message)
  if (trError) throw new Error(trError.message)

  const hits = new Map<string, { title: string; path: string }>()

  function blockReferences(block: { type: string; publicId?: string; html?: string }) {
    if ((block.type === 'image' || block.type === 'loop' || block.type === 'file') && block.publicId === publicId) return true
    if ((block.type === 'richtext' || block.type === 'callout') && block.html?.includes(publicId)) {
      // cheap substring check first, confirm with a real parse to avoid a
      // false positive from an unrelated publicId that happens to contain
      // this one as a substring
      const $ = cheerio.load(block.html)
      return $('img[src], video source[src], a[href]').toArray().some((el) => {
        const url = $(el).attr('src') || $(el).attr('href') || ''
        return url.includes(publicId)
      })
    }
    return false
  }

  for (const doc of docs ?? []) {
    if ((doc.blocks ?? []).some(blockReferences)) hits.set(doc.path, { title: doc.title, path: doc.path })
  }
  for (const row of translations ?? []) {
    const doc = Array.isArray(row.docs) ? row.docs[0] : row.docs
    if (doc && (row.blocks ?? []).some(blockReferences)) hits.set(`bn/${doc.path}`, { title: `${doc.title} (Bengali)`, path: `bn/${doc.path}` })
  }
  return [...hits.values()]
}

// Deletes the DB row only — not the underlying Cloudinary/R2 file. The
// media table is an index the admin panel reads; leaving the original
// file in place is the safe default given findMediaReferences catches
// most but not literally every way a URL could be embedded (e.g. a
// hand-pasted URL that changed since backfill). Actual storage cleanup is
// a manual, deliberate action outside this table.
export async function deleteMedia(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('media').delete().eq('id', id)
  if (error) throw new Error(error.message)
  await logActivity('deleted', 'media', id, null)
}
