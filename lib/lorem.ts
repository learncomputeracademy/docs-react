// Lorem Ipsum Generator's own generation logic. Four text engines sharing one
// sentence-assembly shape (docs/TOOLS.md house rule: much more than a single
// static passage) — classic pseudo-Latin word salad, syllable-built
// gibberish, template-built "realistic" English prose, and Bengali (folds in
// the roadmap's unbuilt Bengali Lorem Ipsum idea rather than leaving it
// stranded as a separate tool).

export type LoremMode = 'classic' | 'gibberish' | 'realistic' | 'bengali'
export type LoremUnit = 'words' | 'sentences' | 'paragraphs' | 'list'
export type HtmlWrap = 'none' | 'p' | 'li' | 'h1' | 'h2' | 'h3'

export const MODES: LoremMode[] = ['classic', 'gibberish', 'realistic', 'bengali']
export const UNITS: LoremUnit[] = ['words', 'sentences', 'paragraphs', 'list']
export const HTML_WRAPS: HtmlWrap[] = ['none', 'p', 'li', 'h1', 'h2', 'h3']

// Count-slider bounds per unit — a paragraph slider doesn't want the same
// 1–300 range a word slider does.
export const UNIT_RANGE: Record<LoremUnit, { min: number; max: number; default: number }> = {
  words: { min: 1, max: 300, default: 50 },
  sentences: { min: 1, max: 50, default: 5 },
  paragraphs: { min: 1, max: 20, default: 3 },
  list: { min: 1, max: 30, default: 8 },
}
export const CHAR_TARGET_RANGE = { min: 20, max: 2000, default: 280 }

export interface LoremOptions {
  mode: LoremMode
  unit: LoremUnit
  count: number
  htmlWrap: HtmlWrap
  charTarget: number | null // when set, overrides count entirely
  startClassic: boolean // classic mode only — prepend the canonical opener
}

export const CLASSIC_OPENER = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

// The standard pseudo-Latin lorem ipsum word pool — the same de facto word
// set virtually every lorem generator draws from (including the W3Schools
// tool this was built from). Placeholder filler by convention, not a quoted
// literary work.
const CLASSIC_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos', 'accusamus', 'iusto', 'odio',
  'dignissimos', 'ducimus', 'blanditiis', 'praesentium', 'voluptatum', 'deleniti', 'atque',
  'corrupti', 'quos', 'quas', 'molestias', 'excepturi', 'occaecati', 'cupiditate', 'provident',
  'similique', 'debitis', 'rerum', 'necessitatibus', 'saepe', 'eveniet', 'voluptates',
  'repudiandae', 'recusandae', 'itaque', 'earum', 'hic', 'tenetur', 'sapiente', 'delectus',
  'reiciendis', 'maiores', 'alias', 'perferendis', 'doloribus', 'asperiores', 'repellat',
]

const REALISTIC_SUBJECTS = [
  'the team', 'our customers', 'this approach', 'the market', 'every project', 'the design',
  'a good plan', 'most teams', 'the data', 'this feature', 'our process', 'the results',
  'a strong brand', 'the interface', 'each release', 'good feedback',
]
const REALISTIC_VERBS = [
  'delivers', 'improves', 'requires', 'changes', 'supports', 'depends on', 'builds on',
  'simplifies', 'affects', 'reflects', 'shapes', 'drives', 'reveals', 'balances', 'strengthens',
]
const REALISTIC_OBJECTS = [
  'clear results', 'a better outcome', 'the overall experience', 'long-term value',
  'real user needs', 'a simpler workflow', 'the core problem', 'steady growth',
  'honest feedback', 'the bigger picture', 'everyday use', 'the final decision',
]
const REALISTIC_ADJECTIVES = [
  'reliable', 'simple', 'modern', 'careful', 'practical', 'consistent', 'flexible',
  'thoughtful', 'efficient', 'genuine', 'durable', 'clear',
]
const REALISTIC_CONNECTORS = [
  'In practice,', 'Over time,', 'As a result,', 'In most cases,', 'Even so,',
  'More importantly,', 'At the same time,', 'In the end,',
]

const BN_SUBJECTS = ['এই প্রকল্পটি', 'আমাদের দল', 'এই পদ্ধতি', 'বাজার', 'প্রতিটি ধারণা', 'এই নকশা', 'একটা ভালো পরিকল্পনা', 'বেশিরভাগ দল', 'এই তথ্য', 'এই বৈশিষ্ট্য']
const BN_OBJECTS = ['ভালো ফলাফল', 'দীর্ঘমেয়াদী মূল্য', 'সামগ্রিক অভিজ্ঞতা', 'স্পষ্ট দিকনির্দেশনা', 'প্রকৃত ব্যবহারকারীর চাহিদা', 'সহজ প্রক্রিয়া', 'মূল সমস্যা', 'স্থির বৃদ্ধি']
const BN_VERBS = ['উন্নতি করে', 'পরিবর্তন করে', 'সমর্থন করে', 'প্রভাব ফেলে', 'তৈরি করে', 'প্রতিফলিত করে', 'শক্তিশালী করে', 'সহজ করে']
const BN_WORDS = [
  'কথা', 'মানুষ', 'সময়', 'কাজ', 'জীবন', 'পৃথিবী', 'আলো', 'স্বপ্ন', 'ভালোবাসা', 'বই',
  'জল', 'আকাশ', 'মন', 'পথ', 'গান', 'সমাজ', 'সংস্কৃতি', 'ইতিহাস', 'ভাষা', 'প্রকৃতি',
  'সূর্য', 'চাঁদ', 'নদী', 'গ্রাম', 'শহর', 'বাড়ি', 'খাবার', 'সংগীত', 'শিল্প', 'জ্ঞান',
  'সত্য', 'সৌন্দর্য', 'আনন্দ', 'দুঃখ', 'আশা', 'সাহস', 'বিশ্বাস', 'স্মৃতি', 'চিন্তা', 'পরিবার',
]

const CONSONANTS = 'bcdfghjklmnpqrstvwxyz'
const VOWELS = 'aeiou'

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)]
}
function cap(w: string): string {
  return w.length ? w.charAt(0).toUpperCase() + w.slice(1) : w
}

function randomGibberishWord(): string {
  const syllables = randInt(1, 3)
  let w = ''
  for (let i = 0; i < syllables; i++) {
    w += pick(CONSONANTS.split('')) + pick(VOWELS.split(''))
    if (Math.random() < 0.35) w += pick(CONSONANTS.split(''))
  }
  return w
}

function nextWord(mode: LoremMode): string {
  if (mode === 'classic') return pick(CLASSIC_WORDS)
  if (mode === 'gibberish') return randomGibberishWord()
  if (mode === 'bengali') return pick(BN_WORDS)
  return pick([...REALISTIC_SUBJECTS, ...REALISTIC_OBJECTS, ...REALISTIC_ADJECTIVES].flatMap((s) => s.split(' ')))
}

// Builds one word-salad sentence from a word generator — shared shape for
// classic and gibberish, the two modes that don't need real grammar.
function buildSentence(wordGen: () => string, min: number, max: number, endPunct = '.'): string {
  const n = randInt(min, max)
  const words = Array.from({ length: n }, wordGen)
  words[0] = cap(words[0])
  let out = words.join(' ')
  if (n > 8) {
    const cut = Math.floor(n / 2)
    const parts = out.split(' ')
    parts[cut - 1] += ','
    out = parts.join(' ')
  }
  return out + endPunct
}

function realisticSentence(): string {
  const subj = pick(REALISTIC_SUBJECTS)
  const verb = pick(REALISTIC_VERBS)
  const obj = pick(REALISTIC_OBJECTS)
  const pattern = randInt(0, 2)
  const raw =
    pattern === 0 ? `${subj} ${verb} ${obj}.`
    : pattern === 1 ? `${subj} ${verb} ${pick(REALISTIC_ADJECTIVES)} ${obj}.`
    : `${pick(REALISTIC_CONNECTORS)} ${subj} ${verb} ${obj}.`
  return cap(raw)
}

function bengaliSentence(): string {
  // Bengali is SOV — subject, object, verb — unlike the SVO templates above.
  return `${pick(BN_SUBJECTS)} ${pick(BN_OBJECTS)} ${pick(BN_VERBS)}।`
}

function sentenceFor(mode: LoremMode): string {
  if (mode === 'classic') return buildSentence(() => pick(CLASSIC_WORDS), 6, 16)
  if (mode === 'gibberish') return buildSentence(randomGibberishWord, 5, 12)
  if (mode === 'bengali') return bengaliSentence()
  return realisticSentence()
}

function listItem(mode: LoremMode): string {
  if (mode === 'classic') return buildSentence(() => pick(CLASSIC_WORDS), 2, 5, '')
  if (mode === 'gibberish') return buildSentence(randomGibberishWord, 2, 4, '')
  if (mode === 'bengali') return `${pick(BN_OBJECTS)} ${pick(BN_VERBS)}`
  return cap(`${pick(REALISTIC_ADJECTIVES)} ${pick(REALISTIC_OBJECTS)}`)
}

// ponytail: charTarget collapses to "stop once the running total crosses the
// target, trim the last block at a word boundary" rather than precisely
// distributing an exact count across every block — simplest correct
// behaviour for a mockup-filler tool; revisit only if someone needs exact
// per-block sizing.
function trimToTarget(blocks: string[], target: number, unit: LoremUnit): string[] {
  if (unit === 'words' || unit === 'sentences') {
    const joined = blocks[0] ?? ''
    if (joined.length <= target) return [joined]
    let cut = joined.slice(0, target)
    const lastSpace = cut.lastIndexOf(' ')
    if (lastSpace > target * 0.6) cut = cut.slice(0, lastSpace)
    return [cut.trim()]
  }
  let total = 0
  const kept: string[] = []
  for (const b of blocks) {
    if (total >= target) break
    kept.push(b)
    total += b.length
  }
  return kept.length ? kept : blocks.slice(0, 1)
}

export function generateLorem(opts: LoremOptions): string[] {
  const { mode, unit, htmlWrap, startClassic } = opts
  const target = opts.charTarget && opts.charTarget > 0 ? opts.charTarget : null
  const count = target ? Infinity : Math.max(1, opts.count)

  let blocks: string[] = []
  let total = 0

  if (unit === 'words') {
    const words: string[] = []
    for (let i = 0; i < count && (!target || total < target); i++) {
      const w = nextWord(mode)
      words.push(w)
      total += w.length + 1
    }
    if (mode !== 'bengali' && words.length) words[0] = cap(words[0])
    blocks = [words.join(' ')]
  } else if (unit === 'sentences') {
    const sentences: string[] = []
    if (startClassic && mode === 'classic') sentences.push(CLASSIC_OPENER)
    for (let i = 0; i < count && (!target || sentences.join(' ').length < target); i++) {
      sentences.push(sentenceFor(mode))
    }
    blocks = [sentences.join(' ')]
  } else if (unit === 'paragraphs') {
    for (let p = 0; p < count && (!target || total < target); p++) {
      const sentences = Array.from({ length: randInt(3, 7) }, () => sentenceFor(mode))
      if (p === 0 && startClassic && mode === 'classic') sentences.unshift(CLASSIC_OPENER)
      const block = sentences.join(' ')
      blocks.push(block)
      total += block.length
    }
  } else {
    for (let i = 0; i < count && (!target || total < target); i++) {
      const block = listItem(mode)
      blocks.push(block)
      total += block.length
    }
  }

  if (target) blocks = trimToTarget(blocks, target, unit)
  if (htmlWrap !== 'none') blocks = blocks.map((b) => `<${htmlWrap}>${b}</${htmlWrap}>`)
  return blocks
}

export function joinBlocks(blocks: string[], unit: LoremUnit): string {
  if (unit === 'paragraphs') return blocks.join('\n\n')
  if (unit === 'list') return blocks.join('\n')
  return blocks[0] ?? ''
}

export interface LoremStats {
  words: number
  chars: number
  readingMinutes: number
}

export function loremStats(text: string): LoremStats {
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  return { words, chars: text.length, readingMinutes: Math.max(1, Math.round(words / 200)) }
}
