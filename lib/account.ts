'use client'

import type { Session } from '@supabase/supabase-js'
import { learnerClient } from '@/lib/supabase/learner'
import { setAccountState, type AccountUser } from '@/lib/account-state'
import { clearLearningData, exportLearningData, importLearningData, onLearningChange, type LearningData } from '@/lib/progress'
import { EMPTY_LEARNING, EMPTY_TYPING, mergeLearningData } from '@/lib/progress-merge'
import { setTheme, storedTheme, THEME_EVENT, type ThemeEventDetail, type ThemeMode } from '@/lib/theme'

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
let stopThemeWatch: (() => void) | null = null

// Theme sync: the choice lives in the account's user metadata (no table
// needed). On sign-in the account's choice wins if it has one; otherwise
// this browser's saved choice is stored in the account. Later toggles on
// any signed-in device are saved too.
async function syncTheme(accountTheme: unknown) {
  const sb = learnerClient()
  const local = storedTheme()
  if (accountTheme === 'dark' || accountTheme === 'light') {
    const shown: ThemeMode = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    if (accountTheme !== shown || accountTheme !== local) setTheme(accountTheme, true)
  } else if (local) {
    await sb.auth.updateUser({ data: { theme: local } })
  }
  stopThemeWatch?.()
  const onTheme = (e: Event) => {
    const d = (e as CustomEvent<ThemeEventDetail>).detail
    if (!d.fromAccount) void sb.auth.updateUser({ data: { theme: d.mode } })
  }
  window.addEventListener(THEME_EVENT, onTheme)
  stopThemeWatch = () => window.removeEventListener(THEME_EVENT, onTheme)
}

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

type Row = { completed: string[]; quiz: LearningData['quiz']; streak: LearningData['streak']; last_lesson: LearningData['last']; badges_seen: string[]; typing?: LearningData['typing'] | null }

function fromRow(r: Row | null): LearningData {
  if (!r) return EMPTY_LEARNING
  const t = r.typing
  return {
    completed: r.completed ?? [],
    quiz: r.quiz ?? {},
    streak: r.streak ?? null,
    last: r.last_lesson ?? null,
    badgesSeen: r.badges_seen ?? [],
    typing: t ? { history: t.history ?? [], weakKeys: t.weakKeys ?? {}, lessons: t.lessons ?? {}, settings: t.settings ?? null } : EMPTY_TYPING,
  }
}

// The typing column comes from migration 014. Until it is run, everything
// else keeps syncing without it (Postgres 42703 = undefined column).
let typingColumn = true
const BASE_COLUMNS = 'completed, quiz, streak, last_lesson, badges_seen'
const isMissingColumn = (e: { code?: string; message?: string } | null) => !!e && (e.code === '42703' || e.code === 'PGRST204' || /typing/.test(e.message ?? ''))

async function push(userId: string) {
  const d = exportLearningData()
  const row: Record<string, unknown> = { user_id: userId, completed: d.completed, quiz: d.quiz, streak: d.streak, last_lesson: d.last, badges_seen: d.badgesSeen, updated_at: new Date().toISOString() }
  if (typingColumn) row.typing = d.typing
  let { error } = await learnerClient().from('learner_progress').upsert(row)
  if (error && typingColumn && isMissingColumn(error)) {
    typingColumn = false
    delete row.typing
    ;({ error } = await learnerClient().from('learner_progress').upsert(row))
  }
  if (error) console.warn('[account] save failed', error.message)
}

function schedulePush(userId: string) {
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => void push(userId), SYNC_DELAY_MS)
}

// First sync for a session on this device: merge both sides, save both.
async function syncIn(userId: string, accountTheme?: unknown) {
  if (syncedUserId === userId) return
  syncedUserId = userId
  void syncTheme(accountTheme).catch((e) => console.warn('[account] theme sync failed', e))
  setAccountState({ syncing: true })
  const load = (cols: string) => learnerClient().from('learner_progress').select(cols).eq('user_id', userId).maybeSingle()
  let { data, error } = await load(typingColumn ? `${BASE_COLUMNS}, typing` : BASE_COLUMNS)
  if (error && typingColumn && isMissingColumn(error)) {
    typingColumn = false
    ;({ data, error } = await load(BASE_COLUMNS))
  }
  if (error) {
    console.warn('[account] load failed', error.message)
    syncedUserId = null
    setAccountState({ syncing: false })
    return
  }
  const merged = mergeLearningData(exportLearningData(), fromRow(data as unknown as Row | null))
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
  stopThemeWatch?.()
  stopThemeWatch = null
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
      // Back from a GitHub/Google redirect: tidy ?code=… out of the address bar.
      if (event === 'SIGNED_IN' && new URLSearchParams(window.location.search).has('code')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.hash)
      }
      // Defer: Supabase recommends not awaiting other calls inside this callback.
      setTimeout(() => void syncIn(session.user.id, session.user.user_metadata?.theme), 0)
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

// Google Identity Services button (components/sign-in-dialog.tsx): Google
// hands us an ID token in a popup, no redirect, and its screen names our
// site rather than the Supabase callback domain. The raw nonce is checked by
// Supabase against the hashed one Google embedded in the token.
export async function signInWithGoogleToken(credential: string, rawNonce: string) {
  startAccount()
  const { error } = await learnerClient().auth.signInWithIdToken({ provider: 'google', token: credential, nonce: rawNonce })
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
