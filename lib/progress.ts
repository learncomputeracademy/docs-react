'use client'

import { useSyncExternalStore } from 'react'

// Prototype (2026-11-20): lesson completion kept in localStorage only — no
// account, no server. Keys are locale-free doc paths ("css/css-intro"), so
// English and Bengali share one progress record.
// ponytail: localStorage only; sync to a user_progress table once accounts exist.

const KEY = 'lca-progress-v1'
const EMPTY: ReadonlySet<string> = new Set()
const listeners = new Set<() => void>()
let cache: ReadonlySet<string> | null = null

// The one path completed during this page session, so only it plays the
// draw-in animation; checks restored from storage on load appear static.
export let justCompleted: string | null = null

function read(): ReadonlySet<string> {
  if (cache) return cache
  try {
    cache = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[])
  } catch {
    cache = EMPTY
  }
  return cache
}

function write(next: Set<string>) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify([...next]))
  } catch {
    // private mode / blocked storage — progress lives for this tab only
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null
      l()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    window.removeEventListener('storage', onStorage)
  }
}

export function useCompleted(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function setCompleted(path: string, done: boolean) {
  const cur = read()
  if (cur.has(path) === done) return
  const next = new Set(cur)
  if (done) {
    next.add(path)
    justCompleted = path
  } else {
    next.delete(path)
  }
  write(next)
}
