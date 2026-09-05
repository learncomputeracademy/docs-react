'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider, Section, SegmentedControl } from '@/components/tools/tool-controls'
import { us, UNIT_DESCRIPTIONS } from '@/lib/units-i18n'
import {
  LENGTH_UNITS, ANGLE_UNITS, TIME_UNITS, RESOLUTION_UNITS,
  convertLength, convertAngle, convertTime, convertResolution, formatUnitValue,
  type Category, type LengthUnit, type AngleUnit, type TimeUnit, type ResolutionUnit, type LengthContext,
} from '@/lib/units'
import type { Locale } from '@/lib/types'

const UNITS_BY_CATEGORY: Record<Category, readonly string[]> = {
  length: LENGTH_UNITS, angle: ANGLE_UNITS, time: TIME_UNITS, resolution: RESOLUTION_UNITS,
}

type LenProp = 'width' | 'height' | 'font-size' | 'padding' | 'margin' | 'gap' | 'border-radius'
const LEN_PROPERTIES: { value: LenProp; twPrefix: string }[] = [
  { value: 'width', twPrefix: 'w' },
  { value: 'height', twPrefix: 'h' },
  { value: 'font-size', twPrefix: 'text' },
  { value: 'padding', twPrefix: 'p' },
  { value: 'margin', twPrefix: 'm' },
  { value: 'gap', twPrefix: 'gap' },
  { value: 'border-radius', twPrefix: 'rounded' },
]

type Preset = { category: Category; amount: number; from: string; to: string; labelKey: string; noteKey: string }
const PRESETS: Preset[] = [
  { category: 'length', amount: 16, from: 'px', to: 'rem', labelKey: 'presetLength1', noteKey: 'presetLength1Note' },
  { category: 'length', amount: 50, from: 'vw', to: 'px', labelKey: 'presetLength2', noteKey: 'presetLength2Note' },
  { category: 'angle', amount: 90, from: 'deg', to: 'turn', labelKey: 'presetAngle1', noteKey: 'presetAngle1Note' },
  { category: 'angle', amount: 180, from: 'deg', to: 'rad', labelKey: 'presetAngle2', noteKey: 'presetAngle2Note' },
  { category: 'time', amount: 150, from: 'ms', to: 's', labelKey: 'presetTime1', noteKey: 'presetTime1Note' },
  { category: 'time', amount: 300, from: 'ms', to: 's', labelKey: 'presetTime2', noteKey: 'presetTime2Note' },
  { category: 'resolution', amount: 1, from: 'dppx', to: 'dpi', labelKey: 'presetRes1', noteKey: 'presetRes1Note' },
  { category: 'resolution', amount: 2, from: 'dppx', to: 'dpi', labelKey: 'presetRes2', noteKey: 'presetRes2Note' },
]

function convertGeneric(value: number, from: string, to: string, category: Category, ctx: LengthContext): number {
  switch (category) {
    case 'length': return convertLength(value, from as LengthUnit, to as LengthUnit, ctx)
    case 'angle': return convertAngle(value, from as AngleUnit, to as AngleUnit)
    case 'time': return convertTime(value, from as TimeUnit, to as TimeUnit)
    case 'resolution': return convertResolution(value, from as ResolutionUnit, to as ResolutionUnit)
  }
}

export function UnitsDemo({ locale }: { locale: Locale }) {
  const s = us(locale)
  const [category, setCategory] = useState<Category>('length')
  const [amountByCat, setAmountByCat] = useState<Record<Category, number>>({ length: 16, angle: 90, time: 300, resolution: 2 })
  const [fromByCat, setFromByCat] = useState<Record<Category, string>>({ length: 'px', angle: 'deg', time: 'ms', resolution: 'dppx' })
  const [toByCat, setToByCat] = useState<Record<Category, string>>({ length: 'rem', angle: 'turn', time: 's', resolution: 'dpi' })
  const [property, setProperty] = useState<LenProp>('width')
  const [format, setFormat] = useState<'value' | 'css' | 'tailwind'>('value')
  const [copied, setCopied] = useState(false)
  const [hintField, setHintField] = useState<null | keyof LengthContext>(null)

  const [ctx, setCtx] = useState<Omit<LengthContext, 'chPx'>>({
    rootPx: 16, elementPx: 16, parentWidthPx: 800, viewportW: 1440, viewportH: 900, containerW: 400, containerH: 300,
  })
  // ch genuinely depends on the loaded font's glyph metrics (house rule 4 —
  // measure, don't assume). Measured once from a real, invisible DOM element
  // using the page's own font stack, then reused as a per-px ratio so it
  // scales with the "Element font size" control without re-measuring.
  const [chRatio, setChRatio] = useState(0.5)
  useEffect(() => {
    const probe = document.createElement('span')
    probe.textContent = '0'
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:inherit;font-size:16px;left:-9999px;top:-9999px;'
    document.body.appendChild(probe)
    const w = probe.getBoundingClientRect().width
    document.body.removeChild(probe)
    if (w > 0) setChRatio(w / 16)
  }, [])

  const fullCtx: LengthContext = useMemo(() => ({ ...ctx, chPx: chRatio * ctx.elementPx }), [ctx, chRatio])

  const amount = amountByCat[category]
  const fromUnit = fromByCat[category]
  const toUnit = toByCat[category]
  const units = UNITS_BY_CATEGORY[category]

  function setAmount(n: number) { setAmountByCat((p) => ({ ...p, [category]: n })) }
  function setFromUnit(u: string) { setFromByCat((p) => ({ ...p, [category]: u })) }
  function setToUnit(u: string) { setToByCat((p) => ({ ...p, [category]: u })) }

  const tableRows = useMemo(
    () => units.map((u) => ({ unit: u, value: convertGeneric(amount, fromUnit, u, category, fullCtx) })),
    [units, amount, fromUnit, category, fullCtx]
  )
  const outputValue = convertGeneric(amount, fromUnit, toUnit, category, fullCtx)
  const outputStr = `${formatUnitValue(outputValue)}${toUnit}`

  const lenProp = LEN_PROPERTIES.find((p) => p.value === property)!
  const cssLine =
    category === 'length' ? `${property}: ${outputStr};`
    : category === 'angle' ? `transform: rotate(${outputStr});`
    : category === 'time' ? `transition-duration: ${outputStr};`
    : `@media (min-resolution: ${outputStr}) {\n  /* … */\n}`
  const tailwindLine = `${lenProp.twPrefix}-[${outputStr}]`
  const outputByFormat: Record<'value' | 'css' | 'tailwind', string> = { value: outputStr, css: cssLine, tailwind: tailwindLine }

  async function copy() {
    await navigator.clipboard.writeText(outputByFormat[format])
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function applyPreset(p: Preset) {
    setCategory(p.category)
    setAmountByCat((prev) => ({ ...prev, [p.category]: p.amount }))
    setFromByCat((prev) => ({ ...prev, [p.category]: p.from }))
    setToByCat((prev) => ({ ...prev, [p.category]: p.to }))
  }

  function hintProps(key: keyof LengthContext) {
    return { onMouseEnter: () => setHintField(key), onMouseLeave: () => setHintField(null), onFocus: () => setHintField(key) }
  }
  const contextHint: Partial<Record<keyof LengthContext, string>> = {
    rootPx: s.rootFontSizeDesc, elementPx: s.elementFontSizeDesc, parentWidthPx: s.parentWidthDesc,
    viewportW: s.viewportWidthDesc, viewportH: s.viewportHeightDesc, containerW: s.containerWidthDesc, containerH: s.containerHeightDesc,
  }

  const unitDesc = UNIT_DESCRIPTIONS[fromUnit]?.[locale]
  const howItWorks = category === 'length' ? s.howItWorksLength : category === 'angle' ? s.howItWorksAngle : category === 'time' ? s.howItWorksTime : s.howItWorksResolution

  const previewPx = category === 'length' ? convertLength(amount, fromUnit as LengthUnit, 'px', fullCtx) : 0
  const previewDeg = category === 'angle' ? convertAngle(amount, fromUnit as AngleUnit, 'deg') : 0

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/css/units' : '/css/units'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mx-auto mt-8 flex max-w-md justify-center">
        <SegmentedControl
          value={category}
          onChange={(v) => setCategory(v)}
          options={[
            { value: 'length', label: s.categoryLength },
            { value: 'angle', label: s.categoryAngle },
            { value: 'time', label: s.categoryTime },
            { value: 'resolution', label: s.categoryResolution },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Left: input, preview, table */}
        <div className="space-y-3">
          <Section title={s.input}>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.amount}</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.fromUnit}</span>
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                  {units.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </label>
            </div>
            {unitDesc && <p className="mt-2 rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{unitDesc}</p>}
          </Section>

          {(category === 'length' || category === 'angle') && (
            <Section title={s.preview}>
              <p className="mb-2 text-xs text-muted-foreground">{category === 'length' ? s.previewNoteLength : s.previewNoteAngle}</p>
              {category === 'length' ? (
                <div className="overflow-x-auto rounded-md border bg-muted/20 p-4">
                  <div
                    className="h-16 rounded-md border-2 border-dashed border-primary bg-primary/10"
                    style={{ width: Math.max(0, Math.min(previewPx, 640)) }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-md border bg-muted/20 p-8">
                  <div
                    className="flex size-16 items-center justify-center rounded-md border-2 border-dashed border-primary bg-primary/10 text-xl"
                    style={{ transform: `rotate(${previewDeg}deg)` }}
                  >
                    ↑
                  </div>
                </div>
              )}
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {category === 'length' ? `${formatUnitValue(previewPx)}px` : `${formatUnitValue(previewDeg)}deg`}
              </p>
            </Section>
          )}

          <Section title={s.table}>
            <div className="max-h-80 overflow-y-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/70 text-xs text-muted-foreground backdrop-blur">
                  <tr><th className="px-3 py-1.5 text-left font-medium">{s.tableUnit}</th><th className="px-3 py-1.5 text-right font-medium">{s.tableValue}</th></tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr
                      key={row.unit}
                      className={
                        row.unit === toUnit ? 'bg-primary/10 font-medium'
                        : row.unit === fromUnit ? 'bg-muted/40'
                        : ''
                      }
                    >
                      <td className="px-3 py-1 font-mono">{row.unit}</td>
                      <td className="px-3 py-1 text-right font-mono tabular-nums">{formatUnitValue(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title={s.presets}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRESETS.map((p) => (
                <button
                  key={p.labelKey}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="rounded-md border p-2 text-left text-xs hover:border-primary/50 hover:bg-accent/50"
                >
                  <div className="font-medium">{s[p.labelKey as keyof typeof s]}</div>
                  <div className="text-muted-foreground">{s[p.noteKey as keyof typeof s]}</div>
                </button>
              ))}
            </div>
          </Section>

          <Section title={s.howItWorks}>
            <p className="text-xs text-muted-foreground">{howItWorks}</p>
            {category === 'length' && chRatio === 0.5 && (
              <p className="mt-1 text-xs text-muted-foreground">{s.chMeasuredNote}</p>
            )}
          </Section>
        </div>

        {/* Right: context (length only) + output */}
        <div className="space-y-4">
          {category === 'length' && (
            <Section title={s.context}>
              <div {...hintProps('rootPx')}><Slider label={s.rootFontSize} value={ctx.rootPx} min={8} max={32} step={1} suffix="px" onChange={(n) => setCtx((c) => ({ ...c, rootPx: n }))} /></div>
              <div {...hintProps('elementPx')}><Slider label={s.elementFontSize} value={ctx.elementPx} min={8} max={72} step={1} suffix="px" onChange={(n) => setCtx((c) => ({ ...c, elementPx: n }))} /></div>
              <div {...hintProps('parentWidthPx')}><Slider label={s.parentWidth} value={ctx.parentWidthPx} min={100} max={1600} step={10} suffix="px" onChange={(n) => setCtx((c) => ({ ...c, parentWidthPx: n }))} /></div>
              <div {...hintProps('viewportW')}><Slider label={s.viewportWidth} value={ctx.viewportW} min={320} max={2560} step={10} suffix="px" onChange={(n) => setCtx((c) => ({ ...c, viewportW: n }))} /></div>
              <div {...hintProps('viewportH')}><Slider label={s.viewportHeight} value={ctx.viewportH} min={320} max={1600} step={10} suffix="px" onChange={(n) => setCtx((c) => ({ ...c, viewportH: n }))} /></div>
              <div {...hintProps('containerW')}><Slider label={s.containerWidth} value={ctx.containerW} min={50} max={1200} step={10} suffix="px" onChange={(n) => setCtx((c) => ({ ...c, containerW: n }))} /></div>
              <div {...hintProps('containerH')}><Slider label={s.containerHeight} value={ctx.containerH} min={50} max={1200} step={10} suffix="px" onChange={(n) => setCtx((c) => ({ ...c, containerH: n }))} /></div>
              {hintField && <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{contextHint[hintField]}</p>}
            </Section>
          )}

          <Section title={s.output}>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">{s.toUnit}</span>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </label>

            {category === 'length' && (
              <label className="mt-2 block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.property}</span>
                <select value={property} onChange={(e) => setProperty(e.target.value as LenProp)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                  {LEN_PROPERTIES.map((p) => <option key={p.value} value={p.value}>{p.value}</option>)}
                </select>
              </label>
            )}

            <div className="mt-3">
              <SegmentedControl
                value={format}
                onChange={setFormat}
                options={
                  category === 'length'
                    ? [{ value: 'value', label: s.formatValue }, { value: 'css', label: s.formatCss }, { value: 'tailwind', label: s.formatTailwind }]
                    : [{ value: 'value', label: s.formatValue }, { value: 'css', label: s.formatCss }]
                }
              />
            </div>
            <pre className="mt-2 overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
              <code>{outputByFormat[format]}</code>
            </pre>
            <Button size="sm" variant="outline" className="w-full" onClick={copy}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? s.copied : s.copy}
            </Button>
          </Section>
        </div>
      </div>
    </div>
  )
}
