import { splitTopLevel } from '@/lib/color'

// CSS specificity calculator — a real tokenizer against the CSS Selectors
// spec, not a regex shortcut, because the interesting cases (:not(), :is(),
// :where(), :has()) all have real, non-obvious rules the shortcut version
// gets wrong. Pragmatic within that: doesn't resolve nesting (&) context,
// and treats :nth-child(An+B of S) without weighing the "of S" selector —
// both documented, deliberate simplifications, same tradeoff as the other
// /tools parsers in this project.

export type Specificity = { a: number; b: number; c: number }

// Pseudo-elements count toward `c` (same tier as type selectors) — the
// double-colon ones always do; these single-colon legacy forms
// (:before, :after, ...) are pseudo-elements too, not pseudo-classes.
const LEGACY_PSEUDO_ELEMENTS = new Set([
  'before', 'after', 'first-line', 'first-letter', 'placeholder', 'selection', 'marker', 'backdrop', 'file-selector-button',
])

function specKey(s: Specificity) {
  return s.a * 1_000_000 + s.b * 1_000 + s.c
}

function maxSpec(list: Specificity[]): Specificity {
  return list.reduce((best, s) => (specKey(s) > specKey(best) ? s : best), { a: 0, b: 0, c: 0 })
}

function addSpec(x: Specificity, y: Specificity): Specificity {
  return { a: x.a + y.a, b: x.b + y.b, c: x.c + y.c }
}

function findMatchingParen(s: string, openIdx: number): number {
  let depth = 0
  for (let j = openIdx; j < s.length; j++) {
    if (s[j] === '(') depth++
    else if (s[j] === ')') {
      depth--
      if (depth === 0) return j
    }
  }
  return s.length
}

// Specificity of one complex selector (no top-level commas — a selector
// LIST is split before this is called). Sums every simple selector across
// every combinator in the chain.
export function computeComplexSpecificity(selector: string): Specificity {
  let spec: Specificity = { a: 0, b: 0, c: 0 }
  const s = selector.trim()
  let i = 0

  while (i < s.length) {
    const ch = s[i]

    if (/\s/.test(ch) || ch === '>' || ch === '+' || ch === '~' || ch === '*' || ch === '&' || ch === '|') {
      i++
      continue
    }

    if (ch === '#') {
      const m = s.slice(i).match(/^#[-\w\\]+/)
      if (m) { spec.a++; i += m[0].length; continue }
      i++
      continue
    }

    if (ch === '.') {
      const m = s.slice(i).match(/^\.[-\w\\]+/)
      if (m) { spec.b++; i += m[0].length; continue }
      i++
      continue
    }

    if (ch === '[') {
      const end = s.indexOf(']', i)
      if (end === -1) { i = s.length; continue }
      spec.b++
      i = end + 1
      continue
    }

    if (ch === ':') {
      const isDouble = s[i + 1] === ':'
      const nameStart = isDouble ? i + 2 : i + 1
      const nameMatch = s.slice(nameStart).match(/^[-\w]+/)
      if (!nameMatch) { i++; continue }
      const name = nameMatch[0].toLowerCase()
      let cursor = nameStart + name.length
      let argContent: string | null = null
      if (s[cursor] === '(') {
        const closeIdx = findMatchingParen(s, cursor)
        argContent = s.slice(cursor + 1, closeIdx)
        cursor = closeIdx + 1
      }

      if (isDouble || LEGACY_PSEUDO_ELEMENTS.has(name)) {
        spec.c++
      } else if (name === 'where') {
        // :where() always contributes zero, per spec — even with an ID inside.
      } else if ((name === 'not' || name === 'is' || name === 'has') && argContent !== null) {
        const branches = splitTopLevel(argContent, ',').map(computeComplexSpecificity)
        spec = addSpec(spec, maxSpec(branches.length ? branches : [{ a: 0, b: 0, c: 0 }]))
      } else {
        spec.b++ // an ordinary pseudo-class (:hover, :nth-child(2n+1), :focus, ...)
      }
      i = cursor
      continue
    }

    const typeMatch = s.slice(i).match(/^[A-Za-z_][-\w]*/)
    if (typeMatch) { spec.c++; i += typeMatch[0].length; continue }
    i++ // unrecognised character — skip rather than throw, same graceful-degrade convention as the other parsers
  }

  return spec
}

export type SelectorResult = { selector: string; spec: Specificity }

// Splits a selector LIST on top-level commas; each branch gets its own
// specificity (never summed across the comma).
export function computeSpecificity(input: string): SelectorResult[] {
  const cleaned = input.trim().replace(/[{;][\s\S]*$/, '').trim()
  if (!cleaned) return []
  return splitTopLevel(cleaned, ',')
    .map((sel) => sel.trim())
    .filter(Boolean)
    .map((selector) => ({ selector, spec: computeComplexSpecificity(selector) }))
}

export function compareSpecificity(x: Specificity, y: Specificity): -1 | 0 | 1 {
  if (x.a !== y.a) return x.a > y.a ? 1 : -1
  if (x.b !== y.b) return x.b > y.b ? 1 : -1
  if (x.c !== y.c) return x.c > y.c ? 1 : -1
  return 0
}

export function specificityToString(s: Specificity): string {
  return `(${s.a}, ${s.b}, ${s.c})`
}

// ── Display tokenizer ────────────────────────────────────────────────────
// A second, simpler walk over the same selector — not reused from
// computeComplexSpecificity on purpose. That function's job is to produce
// one correct number (already verified against 14 spec test cases,
// including the :is()/:not() max-branch rule); this one's job is to
// produce colour-coded text segments for the UI. Trying to make one
// function serve both jobs would have made the scoring logic harder to
// verify for no real benefit — a `:where(...)`'s contents, for instance,
// need to be visually present (dimmed) but must never reach the score.
export type TokenKind = 'id' | 'class' | 'attr' | 'pseudo-class' | 'pseudo-element' | 'type' | 'zero' | 'punct'
export type Token = { text: string; kind: TokenKind }

export function tokenizeForDisplay(selector: string): Token[] {
  const tokens: Token[] = []
  const s = selector
  let i = 0

  while (i < s.length) {
    const ch = s[i]

    if (/\s/.test(ch)) {
      let j = i
      while (j < s.length && /\s/.test(s[j])) j++
      tokens.push({ text: s.slice(i, j), kind: 'punct' })
      i = j
      continue
    }
    if (ch === '>' || ch === '+' || ch === '~' || ch === '*' || ch === '&' || ch === '|') {
      tokens.push({ text: ch, kind: 'punct' })
      i++
      continue
    }
    if (ch === '#') {
      const m = s.slice(i).match(/^#[-\w\\]+/)
      if (m) { tokens.push({ text: m[0], kind: 'id' }); i += m[0].length; continue }
      tokens.push({ text: ch, kind: 'punct' }); i++; continue
    }
    if (ch === '.') {
      const m = s.slice(i).match(/^\.[-\w\\]+/)
      if (m) { tokens.push({ text: m[0], kind: 'class' }); i += m[0].length; continue }
      tokens.push({ text: ch, kind: 'punct' }); i++; continue
    }
    if (ch === '[') {
      const end = s.indexOf(']', i)
      if (end === -1) { tokens.push({ text: s.slice(i), kind: 'attr' }); i = s.length; continue }
      tokens.push({ text: s.slice(i, end + 1), kind: 'attr' })
      i = end + 1
      continue
    }
    if (ch === ':') {
      const isDouble = s[i + 1] === ':'
      const nameStart = isDouble ? i + 2 : i + 1
      const nameMatch = s.slice(nameStart).match(/^[-\w]+/)
      if (!nameMatch) { tokens.push({ text: ch, kind: 'punct' }); i++; continue }
      const name = nameMatch[0].toLowerCase()
      let cursor = nameStart + name.length
      const isPseudoElement = isDouble || LEGACY_PSEUDO_ELEMENTS.has(name)
      const isZero = name === 'where'
      tokens.push({ text: s.slice(i, cursor), kind: isPseudoElement ? 'pseudo-element' : isZero ? 'zero' : 'pseudo-class' })
      if (s[cursor] === '(') {
        const closeIdx = findMatchingParen(s, cursor)
        const inner = s.slice(cursor + 1, closeIdx)
        tokens.push({ text: '(', kind: 'punct' })
        if (isZero) tokens.push({ text: inner, kind: 'zero' })
        else tokens.push(...tokenizeForDisplay(inner))
        tokens.push({ text: ')', kind: 'punct' })
        cursor = closeIdx + 1
      }
      i = cursor
      continue
    }
    const typeMatch = s.slice(i).match(/^[A-Za-z_][-\w]*/)
    if (typeMatch) { tokens.push({ text: typeMatch[0], kind: 'type' }); i += typeMatch[0].length; continue }
    tokens.push({ text: ch, kind: 'punct' })
    i++
  }

  return tokens
}
