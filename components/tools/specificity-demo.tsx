'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl } from '@/components/tools/tool-controls'
import { cn } from '@/lib/utils'
import { spis } from '@/lib/specificity-i18n'
import type { Locale } from '@/lib/types'
import {
  computeSpecificity, compareSpecificity, specificityToString, tokenizeForDisplay,
  type Specificity, type TokenKind, type SelectorResult,
} from '@/lib/specificity'

type Mode = 'calculate' | 'compare'
type TierKey = 'id' | 'class' | 'type'

const TOKEN_COLOR: Record<TokenKind, string> = {
  id: 'text-rose-600 dark:text-rose-400 font-semibold',
  class: 'text-emerald-600 dark:text-emerald-400 font-semibold',
  attr: 'text-emerald-600 dark:text-emerald-400 font-semibold',
  'pseudo-class': 'text-emerald-600 dark:text-emerald-400 font-semibold',
  type: 'text-sky-600 dark:text-sky-400 font-semibold',
  'pseudo-element': 'text-sky-600 dark:text-sky-400 font-semibold',
  zero: 'text-muted-foreground/50 line-through decoration-1',
  punct: 'text-muted-foreground',
}

const EXAMPLES = [
  { key: 'example1', selector: '#nav .item.active' },
  { key: 'example2', selector: 'a:is(#special, .plain)' },
  { key: 'example3', selector: ':where(#a, .b, div) span' },
  { key: 'example4', selector: 'header > .nav ul li a' },
  { key: 'example5', selector: 'p::first-line' },
] as const

function SelectorTokens({ selector }: { selector: string }) {
  const tokens = useMemo(() => tokenizeForDisplay(selector), [selector])
  return (
    <code className="block overflow-x-auto whitespace-pre rounded-md bg-muted/50 p-3 font-mono text-sm">
      {tokens.map((t, i) => (
        <span key={i} className={TOKEN_COLOR[t.kind]}>{t.text}</span>
      ))}
    </code>
  )
}

function SpecBadge({ spec }: { spec: Specificity }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border font-mono text-sm">
      <span className="rounded-l-md bg-rose-500/10 px-2 py-1 text-rose-600 dark:text-rose-400">{spec.a}</span>
      <span className="bg-emerald-500/10 px-2 py-1 text-emerald-600 dark:text-emerald-400">{spec.b}</span>
      <span className="rounded-r-md bg-sky-500/10 px-2 py-1 text-sky-600 dark:text-sky-400">{spec.c}</span>
    </span>
  )
}

function ResultRow({ result }: { result: SelectorResult }) {
  return (
    <div className="space-y-1.5 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-3">
        <SpecBadge spec={result.spec} />
        <span className="font-mono text-xs text-muted-foreground">{specificityToString(result.spec)}</span>
      </div>
      <SelectorTokens selector={result.selector} />
    </div>
  )
}

export function SpecificityDemo({ locale }: { locale: Locale }) {
  const s = spis(locale)
  const [mode, setMode] = useState<Mode>('calculate')
  const [input, setInput] = useState('header .nav > ul li.active a:hover::after')
  const [inputA, setInputA] = useState('#nav .item.active')
  const [inputB, setInputB] = useState('a:is(#special, .plain)')
  const [hintTier, setHintTier] = useState<TierKey | null>(null)

  const results = useMemo(() => computeSpecificity(input), [input])
  const resultsA = useMemo(() => computeSpecificity(inputA), [inputA])
  const resultsB = useMemo(() => computeSpecificity(inputB), [inputB])

  const specA = resultsA[0]?.spec ?? { a: 0, b: 0, c: 0 }
  const specB = resultsB[0]?.spec ?? { a: 0, b: 0, c: 0 }
  const cmp = compareSpecificity(specA, specB)

  const decidedByTier = useMemo(() => {
    if (specA.a !== specB.a) return { tier: s.tierId, x: specA.a, y: specB.a }
    if (specA.b !== specB.b) return { tier: s.tierClass, x: specA.b, y: specB.b }
    if (specA.c !== specB.c) return { tier: s.tierType, x: specA.c, y: specB.c }
    return null
  }, [specA, specB, s])

  const decidedText = decidedByTier
    ? s.decidedBy.replace('{tier}', decidedByTier.tier).replace('{x}', String(decidedByTier.x)).replace('{y}', String(decidedByTier.y))
    : null

  const tierHints: Record<TierKey, string> = { id: s.tierIdDesc, class: s.tierClassDesc, type: s.tierTypeDesc }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/css/specificity' : '/css/specificity'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mx-auto mt-8 flex max-w-2xl justify-center">
        <SegmentedControl value={mode} onChange={setMode} options={[{ value: 'calculate', label: s.modeCalculate }, { value: 'compare', label: s.modeCompare }]} />
      </div>

      <div className="mx-auto mt-6 max-w-2xl space-y-4">
        {mode === 'calculate' ? (
          <Section title={s.inputLabel}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={s.inputPlaceholder}
              rows={2}
              className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">{s.inputHint}</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.key}
                  type="button"
                  onClick={() => setInput(ex.selector)}
                  className="rounded-md border px-2 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
                >
                  {s[ex.key as keyof typeof s] as string}
                </button>
              ))}
            </div>

            <div className="mt-2 space-y-2">
              {results.length === 0 ? (
                <p className="text-sm text-muted-foreground">{s.parseEmpty}</p>
              ) : (
                results.map((r, i) => <ResultRow key={i} result={r} />)
              )}
            </div>
          </Section>
        ) : (
          <>
            <Section title={s.compareA}>
              <textarea
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                rows={2}
                className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
              />
              <ResultRow result={{ selector: inputA, spec: specA }} />
            </Section>
            <Section title={s.compareB}>
              <textarea
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                rows={2}
                className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
              />
              <ResultRow result={{ selector: inputB, spec: specB }} />
            </Section>

            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-lg font-semibold">
                {cmp === 0 ? s.tie : cmp > 0 ? s.winnerA : s.winnerB}
              </p>
              {cmp !== 0 && decidedText && <p className="mt-1 text-sm text-muted-foreground">{decidedText}</p>}
            </div>
          </>
        )}

        <Section title={s.howCompared}>
          <p className="text-sm text-muted-foreground">{s.howComparedDesc}</p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {(['id', 'class', 'type'] as TierKey[]).map((tier) => (
              <button
                key={tier}
                type="button"
                onMouseEnter={() => setHintTier(tier)}
                onMouseLeave={() => setHintTier(null)}
                onFocus={() => setHintTier(tier)}
                className={cn(
                  'rounded-md border px-2 py-2 text-center text-xs font-medium',
                  tier === 'id' && 'border-rose-500/30 text-rose-600 dark:text-rose-400',
                  tier === 'class' && 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
                  tier === 'type' && 'border-sky-500/30 text-sky-600 dark:text-sky-400'
                )}
              >
                {tier === 'id' ? s.tierId : tier === 'class' ? s.tierClass : s.tierType}
              </button>
            ))}
          </div>
          {hintTier && <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{tierHints[hintTier]}</p>}
        </Section>

        <Section title={s.specialCases}>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-mono font-semibold text-foreground">{s.notIsHas}</p>
              <p className="text-muted-foreground">{s.notIsHasDesc}</p>
            </div>
            <div>
              <p className="font-mono font-semibold text-foreground">{s.whereZero}</p>
              <p className="text-muted-foreground">{s.whereZeroDesc}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">{s.combinatorsZero}</p>
              <p className="text-muted-foreground">{s.combinatorsZeroDesc}</p>
            </div>
          </div>
        </Section>

        <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="font-semibold">{s.beyondSpecificity}</p>
            <p className="mt-1 text-muted-foreground">{s.beyondSpecificityDesc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
