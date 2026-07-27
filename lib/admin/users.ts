'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logActivity } from '@/lib/admin/activity'

// service-role (createAdminClient) bypasses RLS entirely — auth.admin.*
// has no RLS to bypass in the first place, it's a separate GoTrue API.
// profiles.role/status enforce app-layer visibility, but every export
// here must re-check the caller is an active admin itself, the same way
// proxy.ts and the RLS policies do for everything else.
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  const { data: profile } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
  if (profile?.role !== 'admin' || profile?.status !== 'active') throw new Error('Admin access required')
  return user
}

export type UserRow = {
  id: string
  email: string
  name: string | null
  role: 'admin' | 'editor'
  status: 'active' | 'blocked'
  created_at: string
  last_sign_in_at: string | null
}

export async function listUsers(): Promise<UserRow[]> {
  await requireAdmin()
  const admin = createAdminClient()
  const supabase = await createClient()

  const [{ data: authUsers, error: authError }, { data: profiles, error: profileError }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 200 }),
    supabase.from('profiles').select('id, name, role, status, created_at'),
  ])
  if (authError) throw new Error(authError.message)
  if (profileError) throw new Error(profileError.message)

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]))
  return authUsers.users.map((u) => {
    const p = profileById.get(u.id)
    return {
      id: u.id,
      email: u.email ?? '(no email)',
      name: p?.name ?? null,
      role: (p?.role as 'admin' | 'editor') ?? 'editor',
      status: (p?.status as 'active' | 'blocked') ?? 'active',
      created_at: p?.created_at ?? u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
    }
  })
}

function generateTempPassword() {
  // Not shown to anyone but the admin creating the account, once, in the
  // create-user response — handed over out-of-band (WhatsApp/in person)
  // per the chosen onboarding flow. 16 chars from a wide alphabet is
  // plenty for a password that's changed on first real login anyway.
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'
  return Array.from(crypto.getRandomValues(new Uint32Array(16)), (n) => chars[n % chars.length]).join('')
}

export type CreateUserInput = { email: string; name: string; role: 'admin' | 'editor' }

export async function createUser(input: CreateUserInput): Promise<{ email: string; tempPassword: string }> {
  await requireAdmin()
  const admin = createAdminClient()
  const tempPassword = generateTempPassword()

  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { name: input.name },
  })
  if (error) throw new Error(error.message)

  // handle_new_user() trigger already inserted a default profile row
  // (role='editor', status='active') — update it to the role actually
  // requested, since the trigger has no way to know that.
  if (input.role !== 'editor') {
    const { error: roleError } = await admin.from('profiles').update({ role: input.role }).eq('id', data.user.id)
    if (roleError) throw new Error(roleError.message)
  }

  await logActivity('invited', 'user', data.user.id, input.email)
  return { email: input.email, tempPassword }
}

export async function updateUserRole(id: string, role: 'admin' | 'editor') {
  const admin = await requireAdmin()
  if (id === admin.id && role !== 'admin') throw new Error("You can't demote your own account.")
  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
  if (error) throw new Error(error.message)
  await logActivity('role_changed', 'user', id, null, { role })
}

export async function setUserStatus(id: string, status: 'active' | 'blocked') {
  const admin = await requireAdmin()
  if (id === admin.id && status === 'blocked') throw new Error("You can't block your own account.")
  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  await logActivity(status === 'blocked' ? 'blocked' : 'unblocked', 'user', id, null)
}

export async function deleteUser(id: string, email: string) {
  const admin = await requireAdmin()
  if (id === admin.id) throw new Error("You can't delete your own account.")

  const adminClient = createAdminClient()
  // Deleting an admin account can't be a single accidental click — the
  // target must be demoted to editor first, a deliberate separate step.
  // Blocking it here (not just graying out the button) is what makes it
  // real: the UI hint is a courtesy, this is the actual guard.
  const { data: profile, error: profileError } = await adminClient.from('profiles').select('role').eq('id', id).single()
  if (profileError) throw new Error(profileError.message)
  if (profile.role === 'admin') {
    throw new Error('This account is an admin. Change its role to Editor first, then delete it — this prevents deleting an admin by mistake.')
  }

  const { error } = await adminClient.auth.admin.deleteUser(id)
  if (error) throw new Error(error.message)
  await logActivity('deleted', 'user', id, email)
}
