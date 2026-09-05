// Pure logic for the Typing Test app — no React, no DOM (other than
// localStorage), so it's independently testable and keeps the component
// focused on rendering. Real formulas (industry-standard, not invented):
// WPM = (correct chars / 5) / minutes elapsed — 5 chars is the conventional
// "average word length" unit typing tests have used for decades, which is
// why WPM is comparable across tools that all use the same convention.

export type Mode = 'time' | 'words' | 'quote' | 'zen' | 'custom' | 'weakkeys'
export type Difficulty = 'normal' | 'expert' | 'master'
export type CharStatus = 'pending' | 'correct' | 'incorrect' | 'extra'
export type CharCell = { char: string; status: CharStatus }

// Shared by the main app and the Lessons runner — diffs what was typed
// against the target word, character by character. Extra characters typed
// past the target's length are marked 'extra' rather than dropped, so a
// word can be over-typed without losing what was actually pressed.
export function wordCells(target: string, typed: string): CharCell[] {
  const cells: CharCell[] = []
  const len = Math.max(target.length, typed.length)
  for (let i = 0; i < len; i++) {
    if (i < target.length && i < typed.length) cells.push({ char: target[i], status: typed[i] === target[i] ? 'correct' : 'incorrect' })
    else if (i < target.length) cells.push({ char: target[i], status: 'pending' })
    else cells.push({ char: typed[i], status: 'extra' })
  }
  return cells
}

export type TestConfig = {
  mode: Mode
  duration: number // seconds, for 'time' mode (ignored when unlimited is true)
  unlimited: boolean // time mode with no cap — counts up, ends manually (Enter), unlike Zen it still tracks accuracy against real target words
  wordCount: number // for 'words' mode
  quoteLength: 'short' | 'medium' | 'long'
  difficulty: Difficulty
  punctuation: boolean
  numbers: boolean
}

export const DEFAULT_CONFIG: TestConfig = {
  mode: 'time', duration: 30, unlimited: false, wordCount: 25, quoteLength: 'medium',
  difficulty: 'normal', punctuation: false, numbers: false,
}

// Adds occasional capitalization + terminal punctuation and, if enabled,
// swaps in a random number — the same shape monkeytype's own punctuation/
// numbers toggles produce, without claiming to reproduce its exact algorithm.
export function decorateWords(words: string[], punctuation: boolean, numbers: boolean): string[] {
  const out = [...words]
  if (punctuation) {
    let sinceComma = 0
    for (let i = 0; i < out.length; i++) {
      sinceComma++
      if (i === 0) out[i] = capitalize(out[i])
      if (i === out.length - 1) {
        out[i] = out[i] + '.'
      } else if (sinceComma > 5 && Math.random() < 0.15) {
        out[i] = out[i] + ','
        sinceComma = 0
      } else if (Math.random() < 0.04) {
        out[i] = out[i] + '.'
        out[i + 1] = capitalize(out[i + 1] ?? out[i + 1])
      }
    }
  }
  if (numbers) {
    for (let i = 0; i < out.length; i++) {
      if (Math.random() < 0.08) out[i] = String(Math.floor(Math.random() * 999) + 1)
    }
  }
  return out
}

function capitalize(w: string | undefined): string {
  if (!w) return w ?? ''
  return w.charAt(0).toUpperCase() + w.slice(1)
}

export function calculateWpm(correctChars: number, seconds: number): number {
  if (seconds <= 0) return 0
  return Math.round((correctChars / 5) / (seconds / 60))
}

export function calculateRawWpm(totalTyped: number, seconds: number): number {
  if (seconds <= 0) return 0
  return Math.round((totalTyped / 5) / (seconds / 60))
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total <= 0) return 100
  return Math.round((correct / total) * 100)
}

// A simplified consistency score: how steady WPM stayed across the run,
// expressed 0-100 (100 = perfectly even pace). Same coefficient-of-variation
// shape monkeytype's own consistency metric uses, not a literal port of it.
export function calculateConsistency(wpmSamples: number[]): number {
  if (wpmSamples.length < 2) return 100
  const mean = wpmSamples.reduce((a, b) => a + b, 0) / wpmSamples.length
  if (mean === 0) return 100
  const variance = wpmSamples.reduce((a, b) => a + (b - mean) ** 2, 0) / wpmSamples.length
  const stddev = Math.sqrt(variance)
  const cv = stddev / mean
  return Math.max(0, Math.round(100 - cv * 100))
}

export type TestResult = {
  wpm: number
  rawWpm: number
  accuracy: number
  consistency: number
  correctChars: number
  incorrectChars: number
  extraChars: number
  missedChars: number
  timeSeconds: number
  wpmHistory: { t: number; wpm: number }[]
  errorsByChar: Record<string, number>
  mode: Mode
}

// --- localStorage history (v1 scope: no backend, per D-133) ---

export type HistoryEntry = {
  date: number
  mode: Mode
  label: string // e.g. "30s" or "25 words" — for display, not parsed back
  wpm: number
  accuracy: number
  consistency: number
}

const HISTORY_KEY = 'typing-test-history-v1'
const MAX_HISTORY = 100

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  const history = [entry, ...loadHistory()].slice(0, MAX_HISTORY)
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // localStorage can throw (private mode, quota) — history just won't persist
  }
  return history
}

export function personalBest(history: HistoryEntry[], mode: Mode, label: string): number | null {
  const matches = history.filter((h) => h.mode === mode && h.label === label)
  if (matches.length === 0) return null
  return Math.max(...matches.map((h) => h.wpm))
}

// --- Weak-key stats (cumulative, across every run — feeds the "Weak Keys"
// practice mode) — a separate localStorage key from run history, since this
// tallies error counts per letter across every run rather than one summary
// row per run. ---

const WEAK_KEY_STORAGE_KEY = 'typing-test-weak-keys-v1'
const MIN_ERRORS_FOR_WEAK_KEY_MODE = 5 // below this, the sample is too small to target meaningfully

export function loadKeyErrorStats(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(WEAK_KEY_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export function recordKeyErrors(errorsByChar: Record<string, number>): Record<string, number> {
  const stats = loadKeyErrorStats()
  for (const [k, v] of Object.entries(errorsByChar)) stats[k] = (stats[k] ?? 0) + v
  try {
    window.localStorage.setItem(WEAK_KEY_STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // ignore — same as history, this is a nice-to-have, not critical data
  }
  return stats
}

export function topWeakKeys(stats: Record<string, number>, n = 6): string[] {
  return Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k)
}

export function totalKeyErrors(stats: Record<string, number>): number {
  return Object.values(stats).reduce((a, b) => a + b, 0)
}

export function hasEnoughDataForWeakKeyMode(stats: Record<string, number>): boolean {
  return totalKeyErrors(stats) >= MIN_ERRORS_FOR_WEAK_KEY_MODE
}

// --- Lesson progress (Structured Lessons track) ---

export type LessonProgress = { completed: boolean; bestWpm: number; bestAccuracy: number }

const LESSON_PROGRESS_KEY = 'typing-test-lesson-progress-v1'

export function loadLessonProgress(): Record<string, LessonProgress> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(LESSON_PROGRESS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export function saveLessonResult(lessonId: string, wpm: number, accuracy: number): Record<string, LessonProgress> {
  const progress = loadLessonProgress()
  const prev = progress[lessonId]
  progress[lessonId] = {
    completed: true,
    bestWpm: Math.max(prev?.bestWpm ?? 0, wpm),
    bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, accuracy),
  }
  try {
    window.localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    // ignore
  }
  return progress
}

// --- Customize-panel settings (sound/caret/font-size/focus/colors) —
// previously plain useState that reset on every page load; persisted here
// so a visitor's chosen typing-text colors (the actual fix for "sometimes
// not visible" — the default pending-text color is a low-opacity gray that
// can wash out depending on monitor/theme) survive a refresh. ---

export type AccentTheme = 'orange' | 'blue' | 'green' | 'purple'

export type TypingTestSettings = {
  soundOn: boolean
  smoothCaret: boolean
  fontSize: number
  focusMode: boolean
  pendingColor: string | null // null = use the theme default
  typedColor: string | null
  accent: AccentTheme
}

export const DEFAULT_SETTINGS: TypingTestSettings = {
  soundOn: false, smoothCaret: true, fontSize: 20, focusMode: false, pendingColor: null, typedColor: null, accent: 'orange',
}

// Accent theme presets — same recipe as the site's own `--primary` token in
// app/globals.css (same lightness/chroma, 0.57 light / 0.75 dark, 0.171
// chroma), just a rotated hue per accent, so every accent reads as "equally
// vivid" as the default orange rather than an arbitrarily-picked hex that
// might be duller or garish in comparison. `--primary-foreground` is reused
// unchanged from the site's own tokens (near-white on light-mode's primary,
// near-black on dark-mode's lighter primary) — it's neutral, not hue-
// dependent, so one pair covers every accent.
export const ACCENT_THEMES: Record<AccentTheme, { light: string; dark: string }> = {
  orange: { light: 'oklch(0.57 0.171 53)', dark: 'oklch(0.75 0.171 53)' },
  blue: { light: 'oklch(0.57 0.171 255)', dark: 'oklch(0.75 0.171 255)' },
  green: { light: 'oklch(0.57 0.171 145)', dark: 'oklch(0.75 0.171 145)' },
  purple: { light: 'oklch(0.57 0.171 300)', dark: 'oklch(0.75 0.171 300)' },
}
export const ACCENT_FOREGROUND = { light: 'oklch(0.985 0 0)', dark: 'oklch(0.145 0 0)' }

const SETTINGS_KEY = 'typing-test-settings-v1'

export function loadSettings(): TypingTestSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: TypingTestSettings) {
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // ignore — same as history/progress, a nice-to-have, not critical data
  }
}
