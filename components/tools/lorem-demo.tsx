'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight, Dices } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl, Slider } from '@/components/tools/tool-controls'
import { ls } from '@/lib/lorem-i18n'
import {
  MODES, UNITS, HTML_WRAPS, UNIT_RANGE, CHAR_TARGET_RANGE,
  generateLorem, joinBlocks, loremStats,
  type LoremMode, type LoremUnit, type HtmlWrap,
} from '@/lib/lorem'
import type { Locale } from '@/lib/types'

export function LoremDemo({ locale }: { locale: Locale }) {
  const s = ls(locale)
  const [mode, setMode] = useState<LoremMode>('classic')
  const [unit, setUnit] = useState<LoremUnit>('paragraphs')
  const [count, setCount] = useState(UNIT_RANGE.paragraphs.default)
  const [useCharTarget, setUseCharTarget] = useState(false)
  const [charTarget, setCharTarget] = useState(CHAR_TARGET_RANGE.default)
  const [htmlWrap, setHtmlWrap] = useState<HtmlWrap>('none')
  const [startClassic, setStartClassic] = useState(false)
  const [seed, setSeed] = useState(0)
  const [copied, setCopied] = useState(false)

  // Random content (Math.random-based) must never be generated during the
  // shared render pass — the static prerender and the client's first render
  // would each draw different words and hydration would mismatch. Starting
  // from an empty array and filling it in a client-only effect keeps the
  // very first client render identical to the server's, then replaces it
  // post-mount — same fix shape as the documented useState(defaultState) id
  // gotcha, just via an effect instead of a lazy initializer.
  const [blocks, setBlocks] = useState<string[]>([])
  useEffect(() => {
    setBlocks(generateLorem({
      mode, unit, count, htmlWrap,
      charTarget: useCharTarget ? charTarget : null,
      startClassic,
    }))
    // seed exists purely to force regeneration on "Regenerate" clicks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, unit, count, htmlWrap, useCharTarget, charTarget, startClassic, seed])
  const outputText = joinBlocks(blocks, unit)
  const stats = loremStats(outputText)

  function setUnitAndDefault(u: LoremUnit) {
    setUnit(u)
    setCount(UNIT_RANGE[u].default)
  }

  async function copy() {
    await navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const modeLabel: Record<LoremMode, string> = { classic: s.modeClassic, gibberish: s.modeGibberish, realistic: s.modeRealistic, bengali: s.modeBengali }
  const modeDesc: Record<LoremMode, string> = { classic: s.modeClassicDesc, gibberish: s.modeGibberishDesc, realistic: s.modeRealisticDesc, bengali: s.modeBengaliDesc }
  const unitLabel: Record<LoremUnit, string> = { words: s.unitWords, sentences: s.unitSentences, paragraphs: s.unitParagraphs, list: s.unitList }
  const range = UNIT_RANGE[unit]

  const statsText = s.stats
    .replace('{words}', String(stats.words))
    .replace('{chars}', String(stats.chars))
    .replace('{minutes}', String(stats.readingMinutes))

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/design' : '/design'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mt-6 space-y-4">
        <Section title={s.mode}>
          <SegmentedControl value={mode} onChange={setMode} options={MODES.map((m) => ({ value: m, label: modeLabel[m] }))} />
          <p className="text-xs text-muted-foreground">{modeDesc[mode]}</p>
          {mode === 'classic' && (
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={startClassic} onChange={(e) => setStartClassic(e.target.checked)} />
              {s.startClassic}
            </label>
          )}
        </Section>

        <Section title={s.unit} action={<Button size="sm" variant="outline" onClick={() => setSeed((n) => n + 1)}><Dices className="size-3.5" />{s.regenerate}</Button>}>
          <SegmentedControl value={unit} onChange={setUnitAndDefault} options={UNITS.map((u) => ({ value: u, label: unitLabel[u] }))} />

          {!useCharTarget && (
            <Slider label={s.count} value={count} min={range.min} max={range.max} step={1} onChange={setCount} />
          )}
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={useCharTarget} onChange={(e) => setUseCharTarget(e.target.checked)} />
            {s.useCharTarget}
          </label>
          {useCharTarget && (
            <Slider label={s.charTarget} value={charTarget} min={CHAR_TARGET_RANGE.min} max={CHAR_TARGET_RANGE.max} step={10} suffix=" ch" onChange={setCharTarget} />
          )}

          <div>
            <span className="mb-1 block text-xs text-muted-foreground">{s.htmlWrap}</span>
            <SegmentedControl
              value={htmlWrap}
              onChange={setHtmlWrap}
              options={HTML_WRAPS.map((w) => ({ value: w, label: w === 'none' ? s.htmlWrapNone : `<${w}>` }))}
            />
          </div>
        </Section>

        <Section title={s.output}>
          <p className="font-mono text-xs text-muted-foreground">{statsText}</p>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
            <code>{outputText}</code>
          </pre>
          <Button size="sm" variant="outline" className="w-full" onClick={copy}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? s.copied : s.copy}
          </Button>
        </Section>

        <Section title={s.howItWorks}>
          <p className="text-xs text-muted-foreground">{s.howItWorksBody}</p>
        </Section>
      </div>
    </div>
  )
}
