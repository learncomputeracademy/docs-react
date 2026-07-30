'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadFile, slugifyFilename } from '@/lib/storage'
import { logActivity } from '@/lib/admin/activity'

export type NoteAttachment = { url: string; filename: string; bytes: number; backend: 'cloudinary' | 'r2' }

export type NoteRow = {
  id: string
  title: string
  body_html: string
  attachments: NoteAttachment[]
  created_at: string
  updated_at: string
}

export async function listNotes(): Promise<NoteRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('notes').select('*').order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createNote(): Promise<NoteRow> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('notes').insert({}).select('*').single()
  if (error) throw new Error(error.message)
  await logActivity('created', 'note', data.id, data.title || 'Untitled')
  revalidatePath('/admin/notes')
  return data
}

export async function updateNote(id: string, input: { title: string; bodyHtml: string }) {
  const supabase = await createClient()
  const { error } = await supabase.from('notes').update({ title: input.title, body_html: input.bodyHtml }).eq('id', id)
  if (error) throw new Error(error.message)
  await logActivity('updated', 'note', id, input.title || 'Untitled')
  revalidatePath('/admin/notes')
}

export async function deleteNote(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  await logActivity('deleted', 'note', id, null)
  revalidatePath('/admin/notes')
}

// Attachments live on the note row itself (jsonb array), not the shared
// `media` table — these are private working files for a note, not content
// assets meant to show up in Admin → Media.
export async function uploadNoteAttachment(id: string, formData: FormData): Promise<NoteAttachment> {
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) throw new Error('No file provided')

  const buffer = Buffer.from(await file.arrayBuffer())
  const key = `notes/${id}/${Date.now()}-${slugifyFilename(file.name)}`
  const kind = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'raw'

  let uploaded: { url: string; backend: 'cloudinary' | 'r2' }
  try {
    uploaded = await uploadFile(buffer, key, file.type, kind)
  } catch (e) {
    if (buffer.byteLength >= 10 * 1024 * 1024) {
      throw new Error('This file is 10 MB or larger and needs R2 storage, which is not configured yet. Compress it under 10 MB, or ask to have R2 credentials added.')
    }
    throw e
  }

  const attachment: NoteAttachment = { url: uploaded.url, filename: file.name, bytes: buffer.byteLength, backend: uploaded.backend }

  const supabase = await createClient()
  const { data: note, error: fetchError } = await supabase.from('notes').select('attachments').eq('id', id).single()
  if (fetchError) throw new Error(fetchError.message)
  const next = [...((note?.attachments as NoteAttachment[]) ?? []), attachment]
  const { error } = await supabase.from('notes').update({ attachments: next }).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/notes')
  return attachment
}

export async function removeNoteAttachment(id: string, url: string) {
  const supabase = await createClient()
  const { data: note, error: fetchError } = await supabase.from('notes').select('attachments').eq('id', id).single()
  if (fetchError) throw new Error(fetchError.message)
  const next = ((note?.attachments as NoteAttachment[]) ?? []).filter((a) => a.url !== url)
  const { error } = await supabase.from('notes').update({ attachments: next }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/notes')
}
