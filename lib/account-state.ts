'use client'

import { useSyncExternalStore } from 'react'

// Tiny signed-in state store with no Supabase import, so the header and the
// account page can read it without pulling supabase-js into every page.
// lib/account.ts (loaded on demand) is the only writer.

export type AccountUser = { id: string; email: string | null; name: string | null; avatar: string | null; provider: string | null }
export type AccountState = { status: 'unknown' | 'signed-out' | 'signed-in'; user: AccountUser | null; syncing: boolean }

// The key supabase-js stores the session under (lib/supabase/learner.ts).
export const AUTH_STORAGE_KEY = 'lca-auth'

let state: AccountState = { status: 'unknown', user: null, syncing: false }
const listeners = new Set<() => void>()

export function setAccountState(next: Partial<AccountState>) {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

const SERVER: AccountState = { status: 'unknown', user: null, syncing: false }

export function useAccount(): AccountState {
  return useSyncExternalStore(subscribe, () => state, () => SERVER)
}

// True when this browser holds a saved session, without loading supabase-js.
export function hasStoredSession(): boolean {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) !== null
  } catch {
    return false
  }
}
