'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, RotateCcw, ArrowRight, Lightbulb, Link2, ArrowLeftRight, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl } from '@/components/tools/tool-controls'
import { cn } from '@/lib/utils'
import { cs } from '@/lib/contrast-i18n'
import type { Locale } from '@/lib/types'
import { hexToRgba } from '@/lib/color'
import {
  contrastRatio, wcagLevelNormalText, wcagLevelLargeText, wcagLevelUiComponent,
  generatePalette, generateTintShadeRamp, simulateColorBlindness,
  type PaletteScheme, type ColorBlindType, type WcagLevel,
} from '@/lib/contrast'

type State = {
  baseHex: string
  scheme: PaletteScheme
  fgHex: string
  bgHex: string
}

function defaultState(): State {
  return { baseHex: '#3366ff', scheme: 'complementary', fgHex: '#111827', bgHex: '#ffffff' }
}

const STORAGE_KEY = 'contrast-demo-state'

function encodeShareState(s: State): string {
  return encodeURIComponent(btoa(JSON.stringify(s)))
}
function decodeShareState(raw: string): State | null {
  try {
    return JSON.parse(atob(decodeURIComponent(raw)))
  } catch {
    return null
  }
}
function loadFromUrl(): State | null {
  if (typeof window === 'undefined') return null
  const s = new URLSearchParams(window.location.search).get('s')
  return s ? decodeShareState(s) : null
}
function loadFromStorage(): State | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const LEVEL_STYLE: Record<WcagLevel, string> = {
  fail: 'bg-destructive/10 text-destructive border-destructive/30',
  aa: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  aaa: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
}

function LevelBadge({ label, level, levelLabel }: { label: string; level: WcagLevel; levelLabel: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-xs', LEVEL_STYLE[level])}>
      <span>{label}</span>
      <span className="font-semibold uppercase">{levelLabel}</span>
    </div>
  )
}

function Swatch({ hex, onClick, label }: { hex: string; onClick?: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label ?? hex}
      className="group flex flex-col items-center gap-1"
    >
      <span className="size-10 rounded-md border shadow-sm transition-transform group-hover:scale-105" style={{ backgroundColor: hex }} />
      <span className="font-mono text-[10px] text-muted-foreground">{hex}</span>
    </button>
  )
}

export function ContrastDemo({ locale }: { locale: Locale }) {
  const s = cs(locale)
  const [state, setState] = useState<State>(defaultState)
  const [note, setNote] = useState<string | null>(null)
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)
  const [copiedSwatch, setCopiedSwatch] = useState<string | null>(null)
  const [format, setFormat] = useState<'cssvar' | 'tailwind'>('cssvar')
  const [linkCopied, setLinkCopied] = useState(false)
  const [cbType, setCbType] = useState<ColorBlindType | 'none'>('none')

  useEffect(() => {
    const loaded = loadFromUrl() ?? loadFromStorage()
    if (loaded) setState((prev) => ({ ...prev, ...loaded }))
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function patch(p: Partial<State>) {
    setState((prev) => ({ ...prev, ...p }))
    setNote(null)
  }

  const palette = useMemo(() => generatePalette(state.baseHex, state.scheme), [state.baseHex, state.scheme])
  const ramp = useMemo(() => generateTintShadeRamp(state.baseHex), [state.baseHex])

  const ratio = useMemo(() => contrastRatio(hexToRgba(state.fgHex), hexToRgba(state.bgHex)), [state.fgHex, state.bgHex])
  const levelNormal = wcagLevelNormalText(ratio)
  const levelLarge = wcagLevelLargeText(ratio)
  const levelUi = wcagLevelUiComponent(ratio)
  const levelLabel: Record<WcagLevel, string> = { fail: s.levelFail, aa: s.levelAA, aaa: s.levelAAA }

  const cbFg = cbType === 'none' ? state.fgHex : (() => {
    const sim = simulateColorBlindness(hexToRgba(state.fgHex), cbType)
    return `rgb(${sim.r}, ${sim.g}, ${sim.b})`
  })()
  const cbBg = cbType === 'none' ? state.bgHex : (() => {
    const sim = simulateColorBlindness(hexToRgba(state.bgHex), cbType)
    return `rgb(${sim.r}, ${sim.g}, ${sim.b})`
  })()

  async function copySwatch(hex: string) {
    await navigator.clipboard.writeText(hex)
    setCopiedSwatch(hex)
    setTimeout(() => setCopiedSwatch(null), 1200)
  }

  function applyPreset(fgHex: string, bgHex: string, noteText: string) {
    patch({ fgHex, bgHex })
    setNote(noteText)
  }

  async function copyFormat(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopiedFormat(key)
    setTimeout(() => setCopiedFormat(null), 1500)
  }
  async function copyShareLink() {
    const url = `${window.location.origin}${window.location.pathname}?s=${encodeShareState(state)}`
    await navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }
  function reset() {
    setState(defaultState())
    setNote(null)
    setCbType('none')
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY)
  }

  const cssVarBlock = useMemo(() => {
    const lines = [':root {', `  --color-base: ${state.baseHex};`]
    palette.forEach((hex, i) => lines.push(`  --color-scheme-${i + 1}: ${hex};`))
    lines.push(`  --color-text: ${state.fgHex};`, `  --color-background: ${state.bgHex};`, '}')
    return lines.join('\n')
  }, [state, palette])

  const tailwindBlock = useMemo(() => {
    const lines = ['@theme {', `  --color-base: ${state.baseHex};`]
    palette.forEach((hex, i) => lines.push(`  --color-scheme-${i + 1}: ${hex};`))
    lines.push(`  --color-text: ${state.fgHex};`, `  --color-background: ${state.bgHex};`, '}')
    return lines.join('\n')
  }, [state, palette])

  const outputByFormat = { cssvar: cssVarBlock, tailwind: tailwindBlock }

  const presetList: { fg: string; bg: string; label: string; note: string }[] = [
    { fg: '#000000', bg: '#ffffff', label: s.presetAAA, note: s.presetAAANote },
    { fg: '#767676', bg: '#ffffff', label: s.presetAAPass, note: s.presetAAPassNote },
    { fg: '#949494', bg: '#ffffff', label: s.presetLargeOnly, note: s.presetLargeOnlyNote },
    { fg: '#cccccc', bg: '#ffffff', label: s.presetFailsAll, note: s.presetFailsAllNote },
    { fg: '#e53e3e', bg: '#38a169', label: s.presetColourblindTrap, note: s.presetColourblindTrapNote },
  ]

  return (
    <div className="mx-auto w-full max-w-[110rem] px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/css/colors' : '/css/colors'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2">
        <Button size="sm" variant="outline" onClick={reset}><RotateCcw className="size-3.5" /> {s.reset}</Button>
        <Button size="sm" variant="outline" onClick={copyShareLink}>
          <Link2 className="size-3.5" /> {linkCopied ? s.shareLinkCopied : s.copyShareLink}
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)_24rem]">
        {/* ── Column 1: palette ────────────────────────────────────────── */}
        <div className="space-y-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
          <Section title={s.baseColour}>
            <input
              type="color"
              value={state.baseHex}
              onChange={(e) => patch({ baseHex: e.target.value })}
              className="h-9 w-full cursor-pointer rounded-md border bg-background"
            />
            <input
              type="text"
              value={state.baseHex}
              onChange={(e) => patch({ baseHex: e.target.value })}
              className="w-full rounded-md border bg-background px-2 py-1 font-mono text-xs"
            />
          </Section>

          <Section title={s.scheme}>
            <SegmentedControl
              value={state.scheme}
              onChange={(v: PaletteScheme) => patch({ scheme: v })}
              options={[
                { value: 'complementary', label: s.schemeComplementary },
                { value: 'triadic', label: s.schemeTriadic },
                { value: 'analogous', label: s.schemeAnalogous },
                { value: 'splitComplementary', label: s.schemeSplit },
              ]}
            />
            <p className="text-xs text-muted-foreground">{s.schemeDesc}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              {palette.map((hex, i) => (
                <div key={i} className="relative">
                  <Swatch hex={hex} onClick={() => copySwatch(hex)} />
                  {copiedSwatch === hex && <span className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background">{s.copiedSwatch}</span>}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{s.clickToCopy}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => patch({ fgHex: palette[0] })}>{s.useAsForeground}</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => patch({ bgHex: palette[0] })}>{s.useAsBackground}</Button>
            </div>
          </Section>

          <Section title={s.tintsShades}>
            <p className="text-xs text-muted-foreground">{s.tintsShadesDesc}</p>
            <div className="flex flex-wrap gap-2">
              {ramp.map((hex, i) => (
                <div key={i} className="relative">
                  <Swatch hex={hex} onClick={() => copySwatch(hex)} />
                  {copiedSwatch === hex && <span className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background">{s.copiedSwatch}</span>}
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* ── Column 2: contrast checker ───────────────────────────────── */}
        <div className="min-w-0 space-y-4">
          <Section title={s.contrastChecker}>
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <span className="text-xs text-muted-foreground">{s.foreground}</span>
                <div className="flex gap-1.5">
                  <input type="color" value={state.fgHex} onChange={(e) => patch({ fgHex: e.target.value })} className="h-8 w-10 cursor-pointer rounded border bg-background" />
                  <input type="text" value={state.fgHex} onChange={(e) => patch({ fgHex: e.target.value })} className="w-full rounded-md border bg-background px-2 py-1 font-mono text-xs" />
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => patch({ fgHex: state.bgHex, bgHex: state.fgHex })} title={s.swap}>
                <ArrowLeftRight className="size-3.5" />
              </Button>
              <div className="flex-1 space-y-1">
                <span className="text-xs text-muted-foreground">{s.background}</span>
                <div className="flex gap-1.5">
                  <input type="color" value={state.bgHex} onChange={(e) => patch({ bgHex: e.target.value })} className="h-8 w-10 cursor-pointer rounded border bg-background" />
                  <input type="text" value={state.bgHex} onChange={(e) => patch({ bgHex: e.target.value })} className="w-full rounded-md border bg-background px-2 py-1 font-mono text-xs" />
                </div>
              </div>
            </div>

            <div
              className="rounded-lg border p-6 text-center"
              style={{ backgroundColor: state.bgHex, color: state.fgHex }}
            >
              <p className="text-lg">{s.previewNormal}</p>
              <p className="mt-2 text-2xl font-bold">{s.previewLarge}</p>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">{s.ratio}</span>
              <span className="font-mono text-2xl font-bold">{ratio.toFixed(2)}:1</span>
            </div>
            <div className="space-y-1.5">
              <LevelBadge label={s.normalText} level={levelNormal} levelLabel={levelLabel[levelNormal]} />
              <LevelBadge label={s.largeText} level={levelLarge} levelLabel={levelLabel[levelLarge]} />
              <LevelBadge label={s.uiComponent} level={levelUi} levelLabel={levelLabel[levelUi]} />
            </div>
          </Section>

          <Section title={s.colourBlindness}>
            <p className="text-xs text-muted-foreground">{s.colourBlindnessDesc}</p>
            <SegmentedControl
              value={cbType}
              onChange={setCbType}
              options={[
                { value: 'none', label: s.cbNone },
                { value: 'protanopia', label: s.cbProtanopia },
                { value: 'deuteranopia', label: s.cbDeuteranopia },
                { value: 'tritanopia', label: s.cbTritanopia },
              ]}
            />
            <div className="rounded-lg border p-6 text-center transition-colors" style={{ backgroundColor: cbBg, color: cbFg }}>
              <p className="text-lg">{s.previewNormal}</p>
            </div>
            <p className="text-xs text-muted-foreground">{s.cbApproxNote}</p>
          </Section>
        </div>

        {/* ── Column 3: presets + export ──────────────────────────────── */}
        <div className="space-y-3 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <Section title={s.presets}>
            <div className="grid grid-cols-1 gap-1.5">
              {presetList.map((p) => (
                <Button key={p.label} size="sm" variant="outline" className="h-auto justify-start gap-2 py-1.5 text-xs" onClick={() => applyPreset(p.fg, p.bg, p.note)}>
                  <span className="flex shrink-0 -space-x-1">
                    <span className="size-3 rounded-full border" style={{ backgroundColor: p.fg }} />
                    <span className="size-3 rounded-full border" style={{ backgroundColor: p.bg }} />
                  </span>
                  {p.label}
                </Button>
              ))}
            </div>
            {note && (
              <p className="mt-1 flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{note}</span>
              </p>
            )}
          </Section>

          <Section title={s.exportTitle}>
            <SegmentedControl value={format} onChange={setFormat} options={[{ value: 'cssvar', label: s.formatCssVar }, { value: 'tailwind', label: s.formatTailwind }]} />
            <pre className="max-h-64 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
              <code>{outputByFormat[format]}</code>
            </pre>
            <Button size="sm" variant="outline" className="w-full" onClick={() => copyFormat(outputByFormat[format], format)}>
              {copiedFormat === format ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copiedFormat === format ? s.copied : s.copy}
            </Button>
          </Section>

          <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-muted-foreground">
              {s.luminanceNote.replace('{fg}', state.fgHex).replace('{bg}', state.bgHex)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
