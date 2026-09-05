'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight, ArrowLeft, RotateCcw, ListChecks } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl } from '@/components/tools/tool-controls'
import { nss } from '@/lib/number-system-i18n'
import {
  BASES, BASE_LABEL, WORD_SIZES,
  isValidDigitsForBase, convert, padToWordSize, bitsFromDecimal, decimalFromBits,
  randomValue, normalizeAnswer, stepsAsText,
  type Base, type WordSize,
} from '@/lib/number-system'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

export function NumberSystemDemo({ locale }: { locale: Locale }) {
  const s = nss(locale)

  const [fromBase, setFromBase] = useState<Base>(10)
  const [toBase, setToBase] = useState<Base>(2)
  const [inputValue, setInputValue] = useState('84')
  const [wordSize, setWordSize] = useState<WordSize>(8)
  const [stepIndex, setStepIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const [bitRowValue, setBitRowValue] = useState(84) // fixed literal default — never Math.random() at initial render

  const [practiceQuestion, setPracticeQuestion] = useState<{ value: number; digitsIn: string } | null>(null)
  const [practiceAnswer, setPracticeAnswer] = useState('')
  const [practiceChecked, setPracticeChecked] = useState<'correct' | 'incorrect' | null>(null)
  const [practiceShowSteps, setPracticeShowSteps] = useState(false)
  const [streak, setStreak] = useState(0)
  const [attempted, setAttempted] = useState(0)

  const digitsIn = inputValue.trim().toUpperCase()
  const validInput = isValidDigitsForBase(digitsIn, fromBase)
  const result = useMemo(() => (validInput ? convert(digitsIn, fromBase, toBase) : null), [digitsIn, fromBase, toBase, validInput])
  const resultPadded = result ? padToWordSize(result.resultDigits, toBase, wordSize) : ''

  const weightLen = result?.weightSteps?.length ?? 0
  const divisionLen = result?.divisionSteps?.length ?? 0
  const totalSteps = weightLen + divisionLen
  const revealedWeight = Math.min(stepIndex, weightLen)
  const revealedDivision = Math.max(0, Math.min(stepIndex - weightLen, divisionLen))

  function setFrom(b: Base) { setFromBase(b); setStepIndex(0) }
  function setTo(b: Base) { setToBase(b); setStepIndex(0) }
  function setInput(v: string) { setInputValue(v); setStepIndex(0) }

  const bitRowSize = wordSize === 0 ? 8 : wordSize
  const bits = bitsFromDecimal(bitRowValue % 2 ** bitRowSize, bitRowSize)
  function toggleBit(i: number) {
    const next = [...bits]
    next[i] = next[i] ? 0 : 1
    setBitRowValue(decimalFromBits(next))
  }
  function useBitRowValue() {
    setFromBase(2)
    setInputValue(bits.join(''))
    setStepIndex(0)
  }

  function newQuestion() {
    const value = randomValue(fromBase, wordSize)
    setPracticeQuestion({ value, digitsIn: value.toString(fromBase).toUpperCase() })
    setPracticeAnswer('')
    setPracticeChecked(null)
    setPracticeShowSteps(false)
  }
  const practiceResult = useMemo(
    () => (practiceQuestion ? convert(practiceQuestion.digitsIn, fromBase, toBase) : null),
    [practiceQuestion, fromBase, toBase]
  )
  function checkAnswer() {
    if (!practiceResult) return
    const isCorrect = normalizeAnswer(practiceAnswer) === normalizeAnswer(practiceResult.resultDigits)
    setPracticeChecked(isCorrect ? 'correct' : 'incorrect')
    setAttempted((a) => a + 1)
    setStreak((st) => (isCorrect ? st + 1 : 0))
  }

  async function copySteps() {
    if (!result) return
    const text = stepsAsText(digitsIn, fromBase, toBase, result, {
      weightHeader: s.weightHeader, divisionHeader: s.divisionHeader, readBottomToTop: s.readBottomToTop, sum: s.sum,
    })
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/basics' : '/basics'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mt-6 space-y-4">
        <Section title={s.result}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">{s.fromBase}</span>
              <SegmentedControl value={String(fromBase)} onChange={(v) => setFrom(Number(v) as Base)} options={BASES.map((b) => ({ value: String(b), label: BASE_LABEL[b] }))} />
            </div>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">{s.toBase}</span>
              <SegmentedControl value={String(toBase)} onChange={(v) => setTo(Number(v) as Base)} options={BASES.map((b) => ({ value: String(b), label: BASE_LABEL[b] }))} />
            </div>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs text-muted-foreground">{s.input}</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInput(e.target.value)}
              placeholder={s.inputPlaceholder}
              className={cn('w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm', !validInput && 'border-destructive')}
            />
            {!validInput && <p className="mt-1 text-xs text-destructive">{s.invalidInput}</p>}
          </label>
          <div>
            <span className="mb-1 block text-xs text-muted-foreground">{s.wordSize}</span>
            <SegmentedControl
              value={String(wordSize)}
              onChange={(v) => setWordSize(Number(v) as WordSize)}
              options={WORD_SIZES.map((w) => ({ value: String(w), label: w === 0 ? s.wordSizeNone : `${w}-${s.wordSizeBits}` }))}
            />
          </div>
          {result && (
            <div className="rounded-lg border bg-primary/5 p-3 text-center">
              <span className="font-mono text-2xl font-bold tracking-wide">{resultPadded}</span>
              <span className="ml-2 text-xs text-muted-foreground">({BASE_LABEL[toBase]})</span>
            </div>
          )}
        </Section>

        {result && totalSteps > 0 && (
          <Section
            title={s.walkthrough}
            action={
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" onClick={() => setStepIndex(0)} title={s.reset}><RotateCcw className="size-3.5" /></Button>
                <Button size="sm" variant="outline" onClick={() => setStepIndex(totalSteps)} title={s.playAll}><ListChecks className="size-3.5" /></Button>
              </div>
            }
          >
            {result.weightSteps && result.divisionSteps && <p className="text-xs text-muted-foreground">{s.viaDecimal}</p>}

            {result.weightSteps && (
              <div>
                <p className="mb-1 text-xs font-medium">{s.weightHeader}</p>
                <div className="overflow-x-auto">
                  <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${weightLen}, minmax(2.5rem, 1fr))` }}>
                    {result.weightSteps.map((w, i) => (
                      <div key={i} className="border-b py-1 text-center font-mono text-sm">{i < revealedWeight ? w.digitChar : '·'}</div>
                    ))}
                    {result.weightSteps.map((w, i) => (
                      <div key={i} className="py-1 text-center font-mono text-xs text-muted-foreground">{i < revealedWeight ? `×${w.weight}` : ''}</div>
                    ))}
                    {result.weightSteps.map((w, i) => (
                      <div key={i} className={cn('py-1 text-center font-mono text-xs', i < revealedWeight ? 'font-semibold text-primary' : '')}>{i < revealedWeight ? w.value : ''}</div>
                    ))}
                  </div>
                </div>
                {revealedWeight === weightLen && weightLen > 0 && (
                  <p className="mt-1 text-right font-mono text-xs">{s.sum} = {result.decimalValue}</p>
                )}
              </div>
            )}

            {result.divisionSteps && (
              <div className="space-y-0.5">
                <p className="mb-1 text-xs font-medium">{s.divisionHeader}</p>
                {result.divisionSteps.slice(0, revealedDivision).map((d, i) => (
                  <p key={i} className="font-mono text-xs">
                    {d.dividend} ÷ {d.divisor} = {d.quotient} <span className="text-primary">remainder {d.remainder}</span>
                  </p>
                ))}
                {revealedDivision === divisionLen && divisionLen > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">{s.readBottomToTop}: <span className="font-mono font-semibold text-foreground">{result.resultDigits}</span></p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              <Button size="sm" variant="outline" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>
                <ArrowLeft className="size-3.5" /> {s.prev}
              </Button>
              <span className="text-xs text-muted-foreground">{s.step} {Math.min(stepIndex, totalSteps)} {s.of} {totalSteps}</span>
              <Button size="sm" variant="outline" disabled={stepIndex >= totalSteps} onClick={() => setStepIndex((i) => Math.min(totalSteps, i + 1))}>
                {s.next} <ArrowRight className="size-3.5" />
              </Button>
            </div>

            <Button size="sm" variant="outline" className="w-full" onClick={copySteps}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? s.copied : s.copySteps}
            </Button>
          </Section>
        )}

        <Section title={s.bitRow}>
          <p className="text-xs text-muted-foreground">{s.bitRowHint}</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {bits.map((bit, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleBit(i)}
                className={cn(
                  'flex size-10 items-center justify-center rounded-md border font-mono text-lg font-bold transition-colors',
                  bit ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:border-primary/60'
                )}
              >
                {bit}
              </button>
            ))}
          </div>
          <p className="text-center text-sm">{s.bitRowValue}: <span className="font-mono font-semibold">{bitRowValue}</span></p>
          <Button size="sm" variant="outline" className="w-full" onClick={useBitRowValue}>{s.bitRowSendToConverter}</Button>
        </Section>

        <Section title={s.practice} action={<Button size="sm" variant="outline" onClick={newQuestion}>{s.newQuestion}</Button>}>
          <p className="text-xs text-muted-foreground">{s.practiceHint}</p>
          {practiceQuestion && practiceResult && (
            <div className="space-y-2.5">
              <p className="text-center font-mono text-lg">
                {practiceQuestion.digitsIn} <span className="text-xs text-muted-foreground">({BASE_LABEL[fromBase]})</span> → ? <span className="text-xs text-muted-foreground">({BASE_LABEL[toBase]})</span>
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  placeholder={s.yourAnswer}
                  className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
                />
                <Button size="sm" onClick={checkAnswer}>{s.check}</Button>
              </div>
              {practiceChecked === 'correct' && <p className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">{s.correct}</p>}
              {practiceChecked === 'incorrect' && (
                <p className="text-center text-sm font-medium text-destructive">{s.incorrect} <span className="font-mono">{practiceResult.resultDigits}</span></p>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{s.streak}: {streak}</span>
                <span>{s.attempted}: {attempted}</span>
                <button type="button" onClick={() => setPracticeShowSteps(true)} className="underline hover:text-foreground">{s.showSteps}</button>
              </div>
              {practiceShowSteps && (
                <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
                  <code>{stepsAsText(practiceQuestion.digitsIn, fromBase, toBase, practiceResult, { weightHeader: s.weightHeader, divisionHeader: s.divisionHeader, readBottomToTop: s.readBottomToTop, sum: s.sum })}</code>
                </pre>
              )}
            </div>
          )}
        </Section>

        <Section title={s.howItWorks}>
          <p className="text-xs text-muted-foreground">{s.howItWorksBody}</p>
        </Section>
      </div>
    </div>
  )
}
