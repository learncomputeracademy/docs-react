// Number System Converter's own logic — the two methods actually taught in
// school (repeated division for decimal→other, positional place-value for
// other→decimal), unified into one `convert()` so every base pair (binary,
// octal, decimal, hex) routes through decimal rather than needing a third,
// separate technique (the 4-bit binary↔hex grouping shortcut is real but
// deliberately not implemented here — it's a different technique taught
// later, and mixing it in would make "how did the tool get this answer"
// inconsistent across base pairs).

export type Base = 2 | 8 | 10 | 16
export const BASES: Base[] = [2, 8, 10, 16]
export const BASE_LABEL: Record<Base, string> = { 2: 'Binary', 8: 'Octal', 10: 'Decimal', 16: 'Hexadecimal' }
export const BASE_PREFIX: Record<Base, string> = { 2: '0b', 8: '0o', 10: '', 16: '0x' }

export type WordSize = 0 | 4 | 8 | 16 // 0 = no fixed padding
export const WORD_SIZES: WordSize[] = [0, 4, 8, 16]

const DIGIT_CHARS = '0123456789ABCDEF'

export function digitValue(ch: string): number {
  return DIGIT_CHARS.indexOf(ch.toUpperCase())
}

export function isValidDigitsForBase(str: string, base: Base): boolean {
  const upper = str.trim().toUpperCase()
  if (!upper.length) return false
  return [...upper].every((ch) => {
    const v = digitValue(ch)
    return v !== -1 && v < base
  })
}

export function maxValueForWordSize(w: WordSize): number {
  return w === 0 ? Number.MAX_SAFE_INTEGER : 2 ** w - 1
}

// ── Repeated division (decimal → target base) ──────────────────────────
export interface DivisionStep { dividend: number; divisor: number; quotient: number; remainder: number }

export function divisionSteps(n: number, base: Base): DivisionStep[] {
  if (n === 0) return [{ dividend: 0, divisor: base, quotient: 0, remainder: 0 }]
  const steps: DivisionStep[] = []
  let cur = n
  while (cur > 0) {
    const quotient = Math.floor(cur / base)
    const remainder = cur % base
    steps.push({ dividend: cur, divisor: base, quotient, remainder })
    cur = quotient
  }
  return steps
}

export function digitsFromDivisionSteps(steps: DivisionStep[]): string {
  return steps.map((s) => DIGIT_CHARS[s.remainder]).reverse().join('')
}

// ── Positional place-value (source base → decimal) ──────────────────────
export interface WeightStep { position: number; digit: number; digitChar: string; weight: number; value: number }

export function weightSteps(digitsStr: string, base: Base): WeightStep[] {
  const chars = digitsStr.trim().toUpperCase().split('')
  const n = chars.length
  return chars.map((ch, i) => {
    const position = n - 1 - i
    const digit = digitValue(ch)
    const weight = base ** position
    return { position, digit, digitChar: ch, weight, value: digit * weight }
  })
}

export function sumWeightSteps(steps: WeightStep[]): number {
  return steps.reduce((acc, s) => acc + s.value, 0)
}

// ── Unified conversion — chains the two methods above through decimal ──
export interface ConversionResult {
  decimalValue: number
  weightSteps?: WeightStep[] // present when fromBase !== 10
  divisionSteps?: DivisionStep[] // present when toBase !== 10
  resultDigits: string
}

export function convert(inputStr: string, fromBase: Base, toBase: Base): ConversionResult {
  let decimalValue: number
  let wSteps: WeightStep[] | undefined
  if (fromBase === 10) {
    decimalValue = parseInt(inputStr.trim(), 10)
  } else {
    wSteps = weightSteps(inputStr, fromBase)
    decimalValue = sumWeightSteps(wSteps)
  }

  let dSteps: DivisionStep[] | undefined
  let resultDigits: string
  if (toBase === 10) {
    resultDigits = String(decimalValue)
  } else {
    dSteps = divisionSteps(decimalValue, toBase)
    resultDigits = digitsFromDivisionSteps(dSteps)
  }

  return { decimalValue, weightSteps: wSteps, divisionSteps: dSteps, resultDigits }
}

export function padToWordSize(digits: string, base: Base, wordSize: WordSize): string {
  if (wordSize === 0 || base !== 2) return digits
  return digits.padStart(wordSize, '0')
}

// ── Bit toggle row (base-2 only, always word-size-bounded) ─────────────
export function bitsFromDecimal(n: number, size: number): number[] {
  const bits: number[] = []
  for (let i = size - 1; i >= 0; i--) bits.push((n >> i) & 1)
  return bits
}
export function decimalFromBits(bits: number[]): number {
  return bits.reduce((acc, b, i) => acc + b * 2 ** (bits.length - 1 - i), 0)
}

// ── Practice mode ────────────────────────────────────────────────────
export function randomValue(fromBase: Base, wordSize: WordSize): number {
  // Cap "no fixed width" practice questions to something a kid can
  // reasonably work by hand — the point is practice, not a stress test.
  const cap = wordSize === 0 ? (fromBase === 2 ? 255 : 4095) : maxValueForWordSize(wordSize)
  return Math.floor(Math.random() * (cap + 1))
}

// Normalizes for comparing a typed answer against the computed one —
// case, surrounding whitespace, and leading zeros shouldn't count against
// a kid who got the actual value right.
export function normalizeAnswer(str: string): string {
  const upper = str.trim().toUpperCase().replace(/^0+(?=.)/, '')
  return upper || '0'
}

export function stepsAsText(digitsIn: string, fromBase: Base, toBase: Base, result: ConversionResult, labels: { weightHeader: string; divisionHeader: string; readBottomToTop: string; sum: string }): string {
  const lines: string[] = []
  if (result.weightSteps) {
    lines.push(labels.weightHeader)
    for (const s of result.weightSteps) {
      lines.push(`  ${s.digitChar} x ${s.weight} = ${s.value}`)
    }
    lines.push(`  ${labels.sum} = ${result.decimalValue}`)
    lines.push('')
  }
  if (result.divisionSteps) {
    lines.push(labels.divisionHeader)
    for (const s of result.divisionSteps) {
      lines.push(`  ${s.dividend} / ${s.divisor} = ${s.quotient} remainder ${s.remainder}`)
    }
    lines.push(`  ${labels.readBottomToTop}: ${digitsFromDivisionSteps(result.divisionSteps)}`)
  }
  lines.push('')
  lines.push(`${digitsIn} (base ${fromBase}) = ${result.resultDigits} (base ${toBase})`)
  return lines.join('\n')
}
