// Notepad's own logic — multi-note localStorage persistence, plain-string
// text utilities, and find/replace. Deliberately a plain <textarea>, not a
// real code editor (no new dependency for that) — the syntax-highlighted
// preview reuses lib/shiki.ts, already shipped for lesson content and the
// homepage's animated code block, rather than adding CodeMirror.

export interface Note { id: string; title: string; content: string; updatedAt: number }

export const NOTES_KEY = 'lca-notepad-notes-v1'
export const ACTIVE_KEY = 'lca-notepad-active-v1'

// Fixed literal id — never Date.now()/uid() in a value used as initial
// render state, or SSR and the client's first render would disagree (the
// documented useState(defaultState) hydration gotcha).
export const DEFAULT_NOTE: Note = { id: 'note-1', title: 'Untitled', content: '', updatedAt: 0 }

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY)
    if (!raw) return [DEFAULT_NOTE]
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : [DEFAULT_NOTE]
  } catch {
    return [DEFAULT_NOTE]
  }
}
export function loadActiveId(): string {
  try {
    return localStorage.getItem(ACTIVE_KEY) || DEFAULT_NOTE.id
  } catch {
    return DEFAULT_NOTE.id
  }
}
export function saveNotes(notes: Note[]) {
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)) } catch { /* storage full/blocked — note stays in memory for this session */ }
}
export function saveActiveId(id: string) {
  try { localStorage.setItem(ACTIVE_KEY, id) } catch { /* same as above */ }
}

export function newNoteId(): string {
  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

// ── Text utilities — apply to a selection if there is one, else the whole
// note (the caller decides which; these are pure string transforms) ──────
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}
export function trimEachLine(str: string): string {
  return str.split('\n').map((l) => l.trim()).join('\n')
}
export function removeBlankLines(str: string): string {
  return str.split('\n').filter((l) => l.trim() !== '').join('\n')
}
export function sortLines(str: string, ascending: boolean): string {
  const lines = str.split('\n')
  lines.sort((a, b) => a.localeCompare(b))
  if (!ascending) lines.reverse()
  return lines.join('\n')
}
export function dedupeLines(str: string): string {
  const seen = new Set<string>()
  return str.split('\n').filter((l) => {
    if (seen.has(l)) return false
    seen.add(l)
    return true
  }).join('\n')
}

export interface Stats { words: number; chars: number; charsNoSpaces: number; lines: number; readingMinutes: number }
export function computeStats(str: string): Stats {
  const trimmed = str.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  return {
    words,
    chars: str.length,
    charsNoSpaces: str.replace(/\s/g, '').length,
    lines: str ? str.split('\n').length : 0,
    readingMinutes: Math.max(0, Math.round(words / 200)),
  }
}

// ── Find & replace ───────────────────────────────────────────────────
export function replaceAll(str: string, find: string, replaceWith: string, caseInsensitive: boolean): string {
  if (!find) return str
  const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(escaped, caseInsensitive ? 'gi' : 'g')
  return str.replace(re, replaceWith)
}

// Next [start, end] match after `from`, wrapping around to the top; null
// if the term doesn't appear at all.
export function findNext(str: string, find: string, from: number, caseInsensitive: boolean): [number, number] | null {
  if (!find) return null
  const hay = caseInsensitive ? str.toLowerCase() : str
  const needle = caseInsensitive ? find.toLowerCase() : find
  let idx = hay.indexOf(needle, from)
  if (idx === -1) idx = hay.indexOf(needle, 0)
  if (idx === -1) return null
  return [idx, idx + find.length]
}
