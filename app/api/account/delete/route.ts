import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Learner "Delete my account" (lib/account.ts deleteAccount). The caller's
// access token is verified with Supabase before anything is deleted; the
// learner can only ever delete themselves. Staff accounts (any profiles row)
// are refused here and must be removed from the admin panel instead, so a
// stolen learner-side request can never take out an admin.
// learner_progress is removed by its on delete cascade.
export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const admin = createAdminClient()
  const { data, error } = await admin.auth.getUser(token)
  if (error || !data.user) return NextResponse.json({ error: 'Session expired. Sign in again.' }, { status: 401 })

  const { data: staff } = await admin.from('profiles').select('id').eq('id', data.user.id).maybeSingle()
  if (staff) return NextResponse.json({ error: 'Staff accounts are managed from the admin panel.' }, { status: 403 })

  const { error: delError } = await admin.auth.admin.deleteUser(data.user.id)
  if (delError) return NextResponse.json({ error: 'Could not delete the account. Try again later.' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
