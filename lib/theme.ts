'use client'

// One place that changes the theme, so every toggle (header, mobile drawer,
// admin) and the account sync (lib/account.ts) stay in step. Applies the
// class, saves the choice in this browser, and announces it.
export type ThemeMode = 'light' | 'dark'
export const THEME_EVENT = 'lca-theme'
export type ThemeEventDetail = { mode: ThemeMode; fromAccount: boolean }

export function storedTheme(): ThemeMode | null {
  try {
    const v = localStorage.getItem('theme')
    return v === 'dark' || v === 'light' ? v : null
  } catch {
    return null
  }
}

export function setTheme(mode: ThemeMode, fromAccount = false) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
  try {
    localStorage.setItem('theme', mode)
  } catch {}
  window.dispatchEvent(new CustomEvent<ThemeEventDetail>(THEME_EVENT, { detail: { mode, fromAccount } }))
}
