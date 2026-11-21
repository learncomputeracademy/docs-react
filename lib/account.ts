'use client'

import type { Session } from '@supabase/supabase-js'
import { learnerClient } from '@/lib/supabase/learner'
import { setAccountState, type AccountUser } from '@/lib/account-state'
import { clearLearningData, exportLearningData, importLearningData, onLearningChange, type LearningData } from '@/lib/progress'
import { EMPTY_LEARNING, mergeLearningData } from '@/lib/progress-merge'

// Learner accounts (phase 1, 2026-11-21): Google / GitHub sign-in, progress
// kept in step between this browser and the learner_progress row. Loaded on
// demand (components/account-sync.tsx, the account page), never in the
// main bundle, so signed-out visitors download none of this.

export type Provider = 'google' | 'github'

const SYNC_DELAY_MS = 2500
let started = false
let syncedUserId: string | null = null
let pushTimer: ReturnType<typeof setTimeout> | null = null
let stopWatching: (() => void) | null = null
let applyingRemote = false

function toUser(session: Session): AccountUser {
  const u = session.user
  const meta = u.user_metadata ?? {}
  return {
    id: u.id,
    email: u.email ?? null,
    name: (meta.full_name as string) || (meta.name as string) || (meta.user_name as string) || null,
    avatar: (meta.avatar_url as string) || (meta.picture as string) || null,
    provider: (u.app_metadata?.provider as string) ?? null,
  }
}

type Row = { completed: string[]; quiz: LearningData['quiz']; streak: LearningData['streak']; last_lesson: LearningData['last']; badges_seen: string[] }

function fromRow(r: Row | null): LearningData {
  if (!r) return EMPTY_LEARNING
  return { completed: r.completed ?? [], quiz: r.quiz ?? {}, streak: r.streak ?? null, last: r.last_lesson ?? null, badgesSeen: r.badges_seen ?? [] }
}

async function push(userId: string) {
  const d = exportLearningData()
  const { error } = await learnerClient()
    .from('learner_progress')
    .upsert({ user_id: userId, completed: d.completed, quiz: d.quiz, streak: d.streak, last_lesson: d.last, badges_seen: d.badgesSeen, updated_at: new Date().toISOString() })
  if (error) console.warn('[account] save failed', error.message)
}

function schedulePush(userId: string) {
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => void push(userId), SYNC_DELAY_MS)
}

// First sync for a session on this device: merge both sides, save both.
async function syncIn(userId: string) {
  if (syncedUserId === userId) return
  syncedUserId = userId
  setAccountState({ syncing: true })
  const { data, error } = await learnerClient().from('learner_progress').select('completed, quiz, streak, last_lesson, badges_seen').eq('user_id', userId).maybeSingle()
  if (error) {
    console.warn('[account] load failed', error.message)
    syncedUserId = null
    setAccountState({ syncing: false })
    return
  }
  const merged = mergeLearningData(exportLearningData(), fromRow(data as Row | null))
  applyingRemote = true
  importLearningData(merged)
  applyingRemote = false
  await push(userId)
  stopWatching?.()
  stopWatching = onLearningChange(() => {
    if (!applyingRemote) schedulePush(userId)
  })
  setAccountState({ syncing: false })
}

function stopSync() {
  stopWatching?.()
  stopWatching = null
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = null
  syncedUserId = null
}

// Idempotent. Restores a saved session (or finishes an OAuth redirect on
// /account) and keeps the account state store up to date.
export function startAccount() {
  if (started) return
  started = true
  const sb = learnerClient()
  sb.auth.onAuthStateChange((event, session) => {
    if (session) {
      setAccountState({ status: 'signed-in', user: toUser(session) })
      // Defer: Supabase recommends not awaiting other calls inside this callback.
      setTimeout(() => void syncIn(session.user.id), 0)
    } else {
      stopSync()
      setAccountState({ status: 'signed-out', user: null, syncing: false })
    }
  })
}

export async function signIn(provider: Provider, returnPath: string) {
  startAccount()
  const redirectTo = `${window.location.origin}${returnPath}`
  const { error } = await learnerClient().auth.signInWithOAuth({ provider, options: { redirectTo } })
  if (error) throw error
}

// Flush any pending save first so nothing from this session is lost.
export async function signOut() {
  const userId = syncedUserId
  if (pushTimer && userId) {
    clearTimeout(pushTimer)
    pushTimer = null
    await push(userId)
  }
  await learnerClient().auth.signOut()
}

// Clear my data while signed in: browser copy and account copy, keep the login.
export async function clearAccountData() {
  const userId = syncedUserId
  applyingRemote = true
  clearLearningData()
  applyingRemote = false
  if (!userId) return
  const { error } = await learnerClient().from('learner_progress').delete().eq('user_id', userId)
  if (error) throw error
}

// Delete my account: the server verifies the token and removes the auth
// user; learner_progress goes with it (on delete cascade).
export async function deleteAccount() {
  const sb = learnerClient()
  const { data } = await sb.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Not signed in')
  stopSync()
  const res = await fetch('/api/account/delete', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Delete failed (${res.status})`)
  }
  clearLearningData()
  await sb.auth.signOut({ scope: 'local' })
}
