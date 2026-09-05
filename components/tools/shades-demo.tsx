'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl, Slider } from '@/components/tools/tool-controls'
import { ss } from '@/lib/shades-i18n'
import {
  ALGORITHMS, MIN_STEPS, MAX_STEPS, DEFAULT_STEPS, generateScale, closestIndex,
  toCssVars, toTailwindTheme, toScss, toJson,
  type Algorithm, type Scale, type NamedScale,
} from '@/lib/shades'
import { hexToRgba } from '@/lib/color'
import { contrastRatio } from '@/lib/contrast'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

type ColorEntry = { id: string; name: string; hex: string }

const DEFAULT_COLORS: ColorEntry[] = [
  { id: 'c-primary', name: 'primary', hex: '#2563eb' },
  { id: 'c-neutral', name: 'neutral', hex: '#64748b' },
]

const WHITE = { r: 255, g: 255, b: 255, a: 1 }
const NEAR_BLACK = { r: 15, g: 23, b: 42, a: 1 }

function bestTextColor(hex: string): 'white' | 'black' {
  const bg = hexToRgba(hex)
  return contrastRatio(bg, WHITE) >= contrastRatio(bg, NEAR_BLACK) ? 'white' : 'black'
}

function ScaleRow({ scale, highlight, showWcag }: { scale: Scale; highlight?: number; showWcag?: boolean }) {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${scale.length}, minmax(0, 1fr))` }}>
      {scale.map((hex, i) => {
        const onWhite = contrastRatio(hexToRgba(hex), WHITE)
        const onBlack = contrastRatio(hexToRgba(hex), NEAR_BLACK)
        const passesWhite = onWhite >= 4.5
        const passesBlack = onBlack >= 4.5
        return (
          <div key={i} className={cn('space-y-0.5', highlight === i && 'ring-2 ring-primary rounded-md')}>
            <div className="aspect-square w-full rounded-md border" style={{ backgroundColor: hex }} title={hex} />
            <p className="text-center font-mono text-xs leading-tight text-muted-foreground">{i + 1}</p>
            {showWcag && (
              <div className="flex justify-center gap-0.5">
                <span className={cn('size-1.5 rounded-full', passesWhite ? 'bg-emerald-500' : 'bg-muted-foreground/30')} />
                <span className={cn('size-1.5 rounded-full', passesBlack ? 'bg-emerald-500' : 'bg-muted-foreground/30')} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function ShadesDemo({ locale }: { locale: Locale }) {
  const s = ss(locale)
  const [colors, setColors] = useState<ColorEntry[]>(DEFAULT_COLORS)
  const [focusedId, setFocusedId] = useState(DEFAULT_COLORS[0].id)
  const [steps, setSteps] = useState(DEFAULT_STEPS)
  const [format, setFormat] = useState<'css' | 'tailwind' | 'scss' | 'json'>('tailwind')
  const [copied, setCopied] = useState(false)

  const focused = colors.find((c) => c.id === focusedId) ?? colors[0]

  const scalesByAlgo = useMemo(() => {
    const out: Record<Algorithm, Scale> = { oklch: [], hsl: [], rgb: [] }
    for (const algo of ALGORITHMS) out[algo] = generateScale(focused.hex, algo, steps)
    return out
  }, [focused.hex, steps])

  const namedScales: NamedScale[] = useMemo(
    () => colors.map((c) => ({ name: c.name || c.id, scale: generateScale(c.hex, 'oklch', steps) })),
    [colors, steps]
  )
  const exportText = useMemo(() => {
    if (format === 'css') return toCssVars(namedScales)
    if (format === 'tailwind') return toTailwindTheme(namedScales)
    if (format === 'scss') return toScss(namedScales)
    return toJson(namedScales)
  }, [namedScales, format])

  function updateColor(id: string, patch: Partial<ColorEntry>) {
    setColors((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }
  function addColor() {
    const id = `c-${Date.now().toString(36)}`
    setColors((prev) => [...prev, { id, name: `color-${prev.length + 1}`, hex: '#d946ef' }])
    setFocusedId(id)
  }
  function removeColor(id: string) {
    if (colors.length <= 1) return
    const next = colors.filter((c) => c.id !== id)
    setColors(next)
    if (focusedId === id) setFocusedId(next[0].id)
  }

  async function copy() {
    await navigator.clipboard.writeText(exportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const midIndex = Math.floor(steps / 2)
  const lightIndex = Math.max(0, midIndex - Math.round(steps * 0.35))
  const previewBg = scalesByAlgo.oklch[midIndex]
  const previewText = bestTextColor(previewBg)
  const previewBadgeBg = scalesByAlgo.oklch[lightIndex]
  const previewBadgeText = scalesByAlgo.oklch[Math.min(steps - 1, midIndex + Math.round(steps * 0.2))]

  const algoLabel: Record<Algorithm, string> = { oklch: s.algoOklch, hsl: s.algoHsl, rgb: s.algoRgb }
  const algoDesc: Record<Algorithm, string> = { oklch: s.algoOklchDesc, hsl: s.algoHslDesc, rgb: s.algoRgbDesc }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/css' : '/css'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mx-auto mt-6 max-w-md">
        <Slider label={s.stepCount} value={steps} min={MIN_STEPS} max={MAX_STEPS} step={1} onChange={setSteps} />
      </div>

      <div className="mt-6 space-y-4">
        <Section
          title={s.colors}
          action={<Button size="sm" variant="outline" onClick={addColor}><Plus className="size-3.5" />{s.addColor}</Button>}
        >
          <div className="space-y-4">
            {colors.map((c) => {
              const idx = closestIndex(c.hex, steps)
              const isFocused = c.id === focusedId
              return (
                <div key={c.id} className={cn('rounded-lg border p-2', isFocused && 'border-primary/60 bg-primary/5')}>
                  <div className="mb-2 flex items-center gap-2">
                    <input type="color" value={c.hex} onChange={(e) => updateColor(c.id, { hex: e.target.value })} className="h-8 w-10 rounded border" />
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateColor(c.id, { name: e.target.value })}
                      className="w-32 rounded-md border bg-background px-2 py-1 text-xs"
                      placeholder={s.colorName}
                    />
                    <button type="button" onClick={() => setFocusedId(c.id)} className="font-mono text-xs text-muted-foreground hover:text-foreground">{c.hex}</button>
                    <span className="text-xs text-muted-foreground">({s.yourColor}: {idx + 1})</span>
                    {colors.length > 1 && (
                      <button type="button" onClick={() => removeColor(c.id)} title={s.removeColor} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
                    )}
                  </div>
                  {!isFocused && <ScaleRow scale={generateScale(c.hex, 'oklch', steps)} highlight={idx} />}
                  {isFocused && (
                    <div className="space-y-3">
                      {ALGORITHMS.map((algo) => (
                        <div key={algo}>
                          <p className="mb-1 text-xs font-semibold">{algoLabel[algo]}</p>
                          <ScaleRow scale={scalesByAlgo[algo]} highlight={idx} showWcag />
                          <p className="mt-1 text-xs text-muted-foreground">{algoDesc[algo]}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Section>

        <Section title={s.preview}>
          <p className="mb-2 text-xs text-muted-foreground">{s.previewHint}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: previewBg, color: previewText === 'white' ? '#ffffff' : '#0f172a' }}
            >
              {focused.name || 'Button'}
            </button>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: previewBadgeBg, color: previewBadgeText }}
            >
              {focused.name || 'Badge'}
            </span>
          </div>
        </Section>

        <Section title={s.output}>
          <SegmentedControl
            value={format}
            onChange={setFormat}
            options={[
              { value: 'tailwind', label: s.formatTailwind }, { value: 'css', label: s.formatCss },
              { value: 'scss', label: s.formatScss }, { value: 'json', label: s.formatJson },
            ]}
          />
          <pre className="max-h-80 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
            <code>{exportText}</code>
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
