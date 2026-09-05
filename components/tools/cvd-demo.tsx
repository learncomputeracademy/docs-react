'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight, Upload, Download, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider, Section, SegmentedControl } from '@/components/tools/tool-controls'
import { cs } from '@/lib/cvd-i18n'
import {
  CVD_TYPES, CVD_PREVALENCE, simulate, simulateImageData, svgFilterMatrixValues, cvdName,
  type CvdType, type RGBA,
} from '@/lib/cvd'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

// Self-contained sample "photo" — a traffic light plus a small bar chart,
// deliberately red/green/orange/blue so the classic confusability cases
// (red vs. green, red vs. brown) are obvious, not subtle. No external
// asset, same reasoning as the Filter Studio's sample image.
const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">
  <rect width="400" height="260" fill="#eef1f5"/>
  <rect x="24" y="20" width="70" height="180" rx="14" fill="#343a40"/>
  <circle cx="59" cy="55" r="20" fill="#e03131"/>
  <circle cx="59" cy="110" r="20" fill="#f08c00"/>
  <circle cx="59" cy="165" r="20" fill="#2f9e44"/>
  <text x="140" y="40" font-family="sans-serif" font-size="14" fill="#343a40">Quarterly results</text>
  <rect x="140" y="150" width="30" height="70" fill="#e03131"/>
  <rect x="185" y="110" width="30" height="110" fill="#2f9e44"/>
  <rect x="230" y="90" width="30" height="130" fill="#e03131"/>
  <rect x="275" y="60" width="30" height="160" fill="#2f9e44"/>
  <rect x="320" y="130" width="30" height="90" fill="#f08c00"/>
  <line x1="140" y1="220" x2="360" y2="220" stroke="#868e96" stroke-width="1"/>
</svg>`
const SAMPLE_IMAGE = `data:image/svg+xml,${encodeURIComponent(SAMPLE_SVG)}`

// Deliberately NOT fire-engine red/pure green — those stay far enough apart
// in luminance to survive deuteranopia simulation intact (verified: >120
// units apart on the 0-441 scale below). #9c6b52/#7d9459 are muted, closer
// in lightness, and genuinely collapse (~25 units) — the kind of desaturated
// brand-palette pair that actually causes real accessibility bugs, so the
// default view demonstrates the tool finding something on first load.
const DEFAULT_PALETTE = ['#9c6b52', '#7d9459', '#f08c00', '#1971c2']

function hexToRgba(hex: string): RGBA {
  const h = hex.replace('#', '')
  const num = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16) || 0
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 1 }
}
function rgbaToHex({ r, g, b }: RGBA): string {
  const h = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}
function dist(a: RGBA, b: RGBA): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)
}
// Heuristic threshold on a 0-441 Euclidean RGB scale — "looks the same at a
// glance", not a certified perceptual-difference metric (that would need a
// proper colour-difference space like CIEDE2000, out of scope here).
const CONFUSABLE_THRESHOLD = 30

export function CvdDemo({ locale }: { locale: Locale }) {
  const s = cs(locale)
  const [mode, setMode] = useState<'image' | 'palette' | 'sample'>('image')
  const [severityPct, setSeverityPct] = useState(100)
  const severity = severityPct / 100
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [paletteType, setPaletteType] = useState<Exclude<CvdType, 'normal'>>('deutan')
  const [colors, setColors] = useState<string[]>(DEFAULT_PALETTE)
  const [copiedType, setCopiedType] = useState<CvdType | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRefs = useRef(new Map<CvdType, HTMLCanvasElement>())
  const imageSrc = uploadedImage ?? SAMPLE_IMAGE

  const typeLabel = (t: Exclude<CvdType, 'normal'>) => {
    const name = cvdName(t, severity)
    if (t === 'protan') return name === 'opia' ? s.protanOpia : s.protanAnomaly
    if (t === 'deutan') return name === 'opia' ? s.deutanOpia : s.deutanAnomaly
    if (t === 'tritan') return name === 'opia' ? s.tritanOpia : s.tritanAnomaly
    return s.achromatopsia
  }
  const cellLabel = (t: CvdType) => (t === 'normal' ? s.normal : typeLabel(t))

  // Image mode: draw once to an offscreen canvas to read real pixels, then
  // simulate each condition in linear light and paint each grid cell's own
  // canvas — real per-pixel canvas work, not a CSS approximation (that's
  // what the Live UI sample mode is for instead).
  useEffect(() => {
    if (mode !== 'image') return
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (cancelled) return
      const off = document.createElement('canvas')
      off.width = img.naturalWidth
      off.height = img.naturalHeight
      const octx = off.getContext('2d')
      if (!octx) return
      octx.drawImage(img, 0, 0)
      const base = octx.getImageData(0, 0, off.width, off.height)
      for (const type of CVD_TYPES) {
        const canvas = canvasRefs.current.get(type)
        if (!canvas) continue
        canvas.width = off.width
        canvas.height = off.height
        const ctx = canvas.getContext('2d')
        if (!ctx) continue
        const clone = new ImageData(new Uint8ClampedArray(base.data), base.width, base.height)
        simulateImageData(clone, type, severity)
        ctx.putImageData(clone, 0, 0)
      }
    }
    img.src = imageSrc
    return () => { cancelled = true }
  }, [mode, imageSrc, severity])

  function handleUpload(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }
  function downloadCell(type: CvdType) {
    const canvas = canvasRefs.current.get(type)
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `${type}.png`
    a.click()
  }
  async function copyFilter(type: CvdType) {
    await navigator.clipboard.writeText(`filter: url(#cvd-${type});`)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 1500)
  }

  const pairwise = useMemo(() => {
    const out: { a: string; b: string; simA: string; simB: string; d: number }[] = []
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const simA = simulate(hexToRgba(colors[i]), paletteType, severity)
        const simB = simulate(hexToRgba(colors[j]), paletteType, severity)
        out.push({ a: colors[i], b: colors[j], simA: rgbaToHex(simA), simB: rgbaToHex(simB), d: dist(simA, simB) })
      }
    }
    return out
  }, [colors, paletteType, severity])

  const sampleFilterStyle = (type: CvdType): React.CSSProperties => (type === 'normal' ? {} : { filter: `url(#cvd-${type})` })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      {/* Shared SVG filter defs — feeds both the Live UI sample preview and
          the "Copy SVG filter" buttons everywhere else on the page; one
          source of truth for the matrix values. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          {CVD_TYPES.filter((t) => t !== 'normal').map((t) => (
            <filter key={t} id={`cvd-${t}`}>
              <feColorMatrix type="matrix" values={svgFilterMatrixValues(t, severity)} />
            </filter>
          ))}
        </defs>
      </svg>

      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href={locale === 'bn' ? '/bn/css' : '/css'}>
            {s.lessonCta} <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="mx-auto mt-8 flex max-w-md justify-center">
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[{ value: 'image', label: s.modeImage }, { value: 'palette', label: s.modePalette }, { value: 'sample', label: s.modeSample }]}
        />
      </div>

      <div className="mx-auto mt-6 max-w-2xl space-y-1">
        <Slider label={s.severity} value={severityPct} min={10} max={100} step={5} suffix="%" onChange={setSeverityPct} />
        <p className="text-xs text-muted-foreground">{s.severityDesc}</p>
      </div>

      {mode === 'image' && (
        <>
          <div className="mt-4 flex justify-center gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0] ?? null)} />
            <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="size-3.5" />{s.upload}</Button>
            {uploadedImage && <Button size="sm" variant="outline" onClick={() => setUploadedImage(null)}>{s.useSample}</Button>}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CVD_TYPES.map((type) => (
              <div key={type} className="rounded-lg border p-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold">{cellLabel(type)}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => downloadCell(type)} title={s.download} className="text-muted-foreground hover:text-foreground"><Download className="size-3.5" /></button>
                    {type !== 'normal' && (
                      <button type="button" onClick={() => copyFilter(type)} title={s.copySvgFilter} className="text-muted-foreground hover:text-foreground">
                        {copiedType === type ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
                <canvas ref={(el) => { if (el) canvasRefs.current.set(type, el); else canvasRefs.current.delete(type) }} className="w-full rounded-md border" />
                {CVD_PREVALENCE[type] && <p className="mt-1 text-xs text-muted-foreground">{s.prevalence}: {CVD_PREVALENCE[type]}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'sample' && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CVD_TYPES.map((type) => (
            <div key={type} className="rounded-lg border p-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold">{cellLabel(type)}</span>
                {type !== 'normal' && (
                  <button type="button" onClick={() => copyFilter(type)} title={s.copySvgFilter} className="text-muted-foreground hover:text-foreground">
                    {copiedType === type ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  </button>
                )}
              </div>
              <div style={sampleFilterStyle(type)} className="space-y-2 rounded-md border bg-card p-3">
                <p className="text-xs font-semibold">{s.sampleTitle}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-medium text-white">{s.sampleStatusOk}</span>
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-medium text-white">{s.sampleStatusWarn}</span>
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">{s.sampleStatusDown}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-600" />{s.sampleLegendA}</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-600" />{s.sampleLegendB}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {mode === 'sample' && <p className="mt-3 text-center text-xs text-muted-foreground">{s.sampleHint}</p>}

      {mode === 'palette' && (
        <div className="mx-auto mt-4 max-w-3xl space-y-4">
          <Section title={s.paletteTitle}>
            <p className="text-xs text-muted-foreground">{s.paletteHint}</p>
            <div className="flex flex-wrap items-center gap-2">
              {colors.map((c, i) => (
                <div key={i} className="flex items-center gap-1 rounded-md border p-1">
                  <input type="color" value={c} onChange={(e) => setColors(colors.map((x, xi) => (xi === i ? e.target.value : x)))} className="size-7 rounded border-0" />
                  <button type="button" onClick={() => setColors(colors.filter((_, xi) => xi !== i))} title={s.removeColor} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => setColors([...colors, '#868e96'])}><Plus className="size-3.5" />{s.addColor}</Button>
            </div>
            <SegmentedControl
              value={paletteType}
              onChange={setPaletteType}
              options={[
                { value: 'protan', label: typeLabel('protan') }, { value: 'deutan', label: typeLabel('deutan') },
                { value: 'tritan', label: typeLabel('tritan') }, { value: 'achromatopsia', label: s.achromatopsia },
              ]}
            />
          </Section>

          <Section title={s.pairwiseTitle}>
            <div className="space-y-1.5">
              {pairwise.map((p, i) => {
                const confusable = p.d < CONFUSABLE_THRESHOLD
                return (
                  <div key={i} className={cn('flex items-center gap-2 rounded-md border p-1.5 text-xs', confusable && 'border-destructive/50 bg-destructive/5')}>
                    <span className="size-5 rounded" style={{ backgroundColor: p.a }} />
                    <span className="size-5 rounded" style={{ backgroundColor: p.b }} />
                    <ArrowRight className="size-3 text-muted-foreground" />
                    <span className="size-5 rounded border" style={{ backgroundColor: p.simA }} />
                    <span className="size-5 rounded border" style={{ backgroundColor: p.simB }} />
                    <span className={cn('ml-auto font-medium', confusable ? 'text-destructive' : 'text-muted-foreground')}>
                      {confusable ? s.confusable : s.distinct}
                    </span>
                  </div>
                )
              })}
            </div>
          </Section>
        </div>
      )}

      <div className="mx-auto mt-6 max-w-3xl">
        <Section title={s.howItWorks}>
          <p className="text-xs text-muted-foreground">{s.howItWorksBody}</p>
          <p className="mt-2 text-xs text-muted-foreground">{s.svgFilterHint}</p>
        </Section>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(['protan', 'deutan', 'tritan', 'achromatopsia'] as const).map((t) => (
            <div key={t} className="rounded-md border p-2 text-xs">
              <p className="font-semibold">{typeLabel(t)}</p>
              <p className="mt-0.5 text-muted-foreground">{s.typeDesc[t]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
