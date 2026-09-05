'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight, Upload, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl } from '@/components/tools/tool-controls'
import { FilterStack } from '@/components/tools/filter-stack'
import { fs } from '@/lib/filters-i18n'
import { makeFilterOp, buildFilterCss, FILTER_PRESETS, type FilterOp } from '@/lib/filters'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

// A self-contained sample "photo" — no external request, no Cloudinary asset
// needed for a tool this small (docs/TOOLS.md: public/ stays under 5MB,
// and this project's Try-It philosophy is browser-only). A simple sunset
// scene, chosen for saturated, varied colour so every filter's effect —
// hue-rotate, sepia, invert, grayscale — is obviously visible, not subtle.
const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4c6ef5"/>
      <stop offset="55%" stop-color="#ff922b"/>
      <stop offset="100%" stop-color="#ffd43b"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#sky)"/>
  <circle cx="200" cy="180" r="55" fill="#ffe066"/>
  <path d="M0 220 L70 140 L130 210 L190 120 L260 220 L330 150 L400 220 L400 300 L0 300 Z" fill="#495057"/>
  <path d="M0 250 L90 190 L160 240 L230 170 L300 245 L400 200 L400 300 L0 300 Z" fill="#343a40"/>
  <circle cx="90" cy="60" r="18" fill="#ffffff" opacity="0.8"/>
  <circle cx="115" cy="65" r="24" fill="#ffffff" opacity="0.8"/>
  <circle cx="300" cy="45" r="14" fill="#ffffff" opacity="0.7"/>
  <circle cx="320" cy="50" r="20" fill="#ffffff" opacity="0.7"/>
</svg>`
const SAMPLE_IMAGE = `data:image/svg+xml,${encodeURIComponent(SAMPLE_SVG)}`

export function FilterDemo({ locale }: { locale: Locale }) {
  const s = fs(locale)
  const [filterStack, setFilterStack] = useState<FilterOp[]>(() => [{ ...makeFilterOp('saturate', 'f-saturate'), amount: 150 }])
  const [backdropStack, setBackdropStack] = useState<FilterOp[]>(() => [makeFilterOp('blur', 'b-blur')])
  const [mode, setMode] = useState<'image' | 'text'>('image')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [compareOn, setCompareOn] = useState(false)
  const [split, setSplit] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filterCss = useMemo(() => buildFilterCss(filterStack), [filterStack])
  const backdropCss = useMemo(() => buildFilterCss(backdropStack), [backdropStack])
  const imageSrc = uploadedImage ?? SAMPLE_IMAGE

  function handleUpload(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleSplitMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging || !previewRef.current) return
    const rect = previewRef.current.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    setSplit(Math.min(100, Math.max(0, pct)))
  }

  function applyPreset(key: string) {
    const preset = FILTER_PRESETS.find((p) => p.key === key)
    if (preset) setFilterStack(preset.build())
  }

  const outputCss = `filter: ${filterCss};\nbackdrop-filter: ${backdropCss};`
  async function copy() {
    await navigator.clipboard.writeText(outputCss)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

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

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Left: preview */}
        <div className="space-y-3">
          <Section
            title={s.preview}
            action={
              <div className="flex items-center gap-2">
                <SegmentedControl value={mode} onChange={setMode} options={[{ value: 'image', label: s.previewImage }, { value: 'text', label: s.previewText }]} />
                {mode === 'image' && (
                  <>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0] ?? null)} />
                    <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="size-3.5" />{s.upload}</Button>
                    {uploadedImage && <Button size="sm" variant="outline" onClick={() => setUploadedImage(null)}><RotateCcw className="size-3.5" />{s.reset}</Button>}
                  </>
                )}
              </div>
            }
          >
            <div
              ref={previewRef}
              className="relative h-80 select-none overflow-hidden rounded-md border bg-muted/20"
              onPointerMove={handleSplitMove}
              onPointerUp={() => setDragging(false)}
              onPointerLeave={() => setDragging(false)}
            >
              {mode === 'image' ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user-uploaded/data-URI image, next/image's optimizer doesn't apply */}
                  <img src={imageSrc} alt="" className="absolute inset-0 size-full object-cover" style={{ filter: filterCss }} />
                  {compareOn && (
                    <>
                      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageSrc} alt="" className="absolute inset-0 size-full object-cover" />
                      </div>
                      <div
                        className="absolute inset-y-0 w-1 cursor-ew-resize bg-background shadow"
                        style={{ left: `${split}%` }}
                        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true) }}
                      />
                    </>
                  )}
                </>
              ) : (
                <div className="flex size-full items-center justify-center p-6" style={{ filter: filterCss }}>
                  <div className="w-full max-w-xs rounded-xl border bg-card p-5 text-center shadow-sm">
                    <h3 className="text-lg font-semibold">Card title</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Filters apply to entire elements, including text, borders, and children — not just photos.</p>
                    <Button size="sm" className="mt-3">Button</Button>
                  </div>
                </div>
              )}

              {/* Glass panel — the backdrop-filter demo, overlaid on the same preview */}
              <div
                className="absolute inset-x-4 bottom-4 rounded-lg border border-white/30 p-3 text-center text-xs font-medium text-white shadow"
                style={{ backdropFilter: backdropCss, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                backdrop-filter: {backdropCss}
              </div>
            </div>

            {mode === 'image' && (
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={compareOn} onChange={(e) => setCompareOn(e.target.checked)} />
                {s.compare}
              </label>
            )}
            {compareOn && mode === 'image' && <p className="text-xs text-muted-foreground">{s.compareHint}</p>}
          </Section>

          <Section title={s.presets}>
            <p className="text-xs text-muted-foreground">{s.presetsHint}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {FILTER_PRESETS.map((p) => (
                <button key={p.key} type="button" onClick={() => applyPreset(p.key)} className="rounded-md border px-2 py-1.5 text-xs hover:border-primary/50 hover:bg-accent/50">
                  {s[p.labelKey as keyof typeof s] as string}
                </button>
              ))}
            </div>
          </Section>

          <Section title={s.howItWorks}>
            <p className="text-xs text-muted-foreground">{s.orderMatters}</p>
          </Section>
        </div>

        {/* Right: stacks + output */}
        <div className="space-y-4">
          <FilterStack dndId="filter" title={s.filterStack} description={s.filterStackDesc} stack={filterStack} onChange={setFilterStack} s={s} />
          <FilterStack dndId="backdrop-filter" title={s.backdropStack} description={s.backdropStackDesc} stack={backdropStack} onChange={setBackdropStack} s={s} />

          <Section title={s.output}>
            <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
              <code>{outputCss}</code>
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
