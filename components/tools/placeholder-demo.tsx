'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight, Shuffle, ImageOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl, Slider } from '@/components/tools/tool-controls'
import { ps } from '@/lib/placeholder-i18n'
import {
  ASPECT_PRESETS, SIZE_PRESETS, SOLID_FONTS, RESPONSIVE_BREAKPOINTS,
  buildPhotoUrl, buildSolidUrl, buildSnippet, buildResponsiveSet, buildResponsiveMarkup,
  type PlaceholderMode, type PhotoSource, type PhotoFormat, type SolidFormat, type Retina,
  type SnippetFormat, type PicsumPhoto,
} from '@/lib/placeholder'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

export function PlaceholderDemo({ locale }: { locale: Locale }) {
  const s = ps(locale)

  const [mode, setMode] = useState<PlaceholderMode>('photo')
  const [width, setWidth] = useState(600)
  const [height, setHeight] = useState(400)
  const [lockAspect, setLockAspect] = useState(true)
  const [aspectLabel, setAspectLabel] = useState('3:2') // matches the 600x400 default

  // photo mode
  const [source, setSource] = useState<PhotoSource>('random')
  const [seed, setSeed] = useState('lorem-picsum')
  const [photoId, setPhotoId] = useState<number | null>(null)
  const [photoAuthor, setPhotoAuthor] = useState<string | null>(null)
  const [grayscale, setGrayscale] = useState(false)
  const [blur, setBlur] = useState(0)
  const [photoFormat, setPhotoFormat] = useState<PhotoFormat>('default')
  const [cacheBust, setCacheBust] = useState(0) // literal 0 by default — never Math.random() during render

  // photo browser
  const [browserOpen, setBrowserOpen] = useState(false)
  const [photos, setPhotos] = useState<PicsumPhoto[] | null>(null)
  const [photosLoading, setPhotosLoading] = useState(false)
  const [photosError, setPhotosError] = useState(false)

  // solid mode
  const [bg, setBg] = useState('#e2e8f0')
  const [text, setText] = useState('#334155')
  const [transparent, setTransparent] = useState(false)
  const [customText, setCustomText] = useState('')
  const [font, setFont] = useState('Lato')
  const [solidFormat, setSolidFormat] = useState<SolidFormat>('svg')
  const [retina, setRetina] = useState<Retina>('')

  // responsive
  const [responsiveOn, setResponsiveOn] = useState(false)
  const [breakpointsText, setBreakpointsText] = useState(RESPONSIVE_BREAKPOINTS.join(', '))

  // output
  const [snippetFormat, setSnippetFormat] = useState<SnippetFormat>('img')
  const [altText, setAltText] = useState('Placeholder')
  const [copied, setCopied] = useState(false)

  function ratioFor(label: string): number | null {
    return ASPECT_PRESETS.find((p) => p.label === label)?.ratio ?? null
  }
  function updateWidth(w: number) {
    setWidth(w)
    const ratio = ratioFor(aspectLabel)
    if (lockAspect && ratio) setHeight(Math.max(1, Math.round(w / ratio)))
  }
  function updateHeight(h: number) {
    setHeight(h)
    const ratio = ratioFor(aspectLabel)
    if (lockAspect && ratio) setWidth(Math.max(1, Math.round(h * ratio)))
  }
  function setAspect(label: string) {
    setAspectLabel(label)
    const ratio = ratioFor(label)
    if (ratio) setHeight(Math.max(1, Math.round(width / ratio)))
  }
  function applySizePreset(w: number, h: number) {
    setWidth(w)
    setHeight(h)
    setAspectLabel('Free') // a named preset's own ratio may not match any aspect option
  }

  async function loadPhotos() {
    setPhotosLoading(true)
    setPhotosError(false)
    try {
      const res = await fetch('https://picsum.photos/v2/list?page=1&limit=30')
      if (!res.ok) throw new Error(String(res.status))
      setPhotos(await res.json())
    } catch {
      setPhotosError(true)
    } finally {
      setPhotosLoading(false)
    }
  }
  function toggleBrowser() {
    const next = !browserOpen
    setBrowserOpen(next)
    if (next && !photos && !photosLoading) loadPhotos()
  }
  function pickPhoto(p: PicsumPhoto) {
    setSource('id')
    setPhotoId(Number(p.id))
    setPhotoAuthor(p.author)
    setBrowserOpen(false)
  }

  const photoOpts = { width, height, source, seed, id: photoId, grayscale, blur, format: photoFormat, cacheBust }
  const solidOpts = { width, height, bg, text, transparent, customText, font, format: solidFormat, retina }

  const previewUrl = mode === 'photo' ? buildPhotoUrl(photoOpts) : buildSolidUrl(solidOpts)
  const snippet = buildSnippet(snippetFormat, previewUrl, width, height, altText || 'Placeholder')

  const breakpoints = useMemo(
    () => breakpointsText.split(',').map((n) => parseInt(n.trim(), 10)).filter((n) => Number.isFinite(n) && n > 0),
    [breakpointsText]
  )
  const responsiveEntries = useMemo(() => {
    if (!responsiveOn || !breakpoints.length) return []
    const ratio = Math.max(width, 1) / Math.max(height, 1)
    const buildUrl = mode === 'photo'
      ? (w: number, h: number) => buildPhotoUrl(photoOpts, w, h)
      : (w: number, h: number) => buildSolidUrl(solidOpts, w, h)
    return buildResponsiveSet(buildUrl, breakpoints, ratio)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responsiveOn, breakpoints, mode, width, height, photoOpts, solidOpts])
  const responsiveMarkup = useMemo(
    () => buildResponsiveMarkup(responsiveEntries, altText || 'Placeholder'),
    [responsiveEntries, altText]
  )

  async function copy(textToCopy: string) {
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const snippetLabel: Record<SnippetFormat, string> = { url: s.outUrl, img: s.outImg, css: s.outCss, nextimage: s.outNext, markdown: s.outMarkdown }

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

      <p className="mx-auto mt-6 max-w-2xl rounded-md bg-muted/50 px-3 py-2 text-center text-xs text-muted-foreground">{s.externalNote}</p>

      <div className="mt-6 space-y-4">
        <Section title={s.mode}>
          <SegmentedControl
            value={mode}
            onChange={setMode}
            options={[{ value: 'photo', label: s.modePhoto }, { value: 'solid', label: s.modeSolid }]}
          />
        </Section>

        <Section title={s.size}>
          <div className="grid grid-cols-2 gap-3">
            <Slider label={s.width} value={width} min={10} max={2000} step={10} onChange={updateWidth} />
            <Slider label={s.height} value={height} min={10} max={2000} step={10} onChange={updateHeight} />
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} />
            {s.lockAspect}
          </label>
          {lockAspect && (
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">{s.aspectRatio}</span>
              <SegmentedControl
                value={aspectLabel}
                onChange={setAspect}
                options={ASPECT_PRESETS.map((p) => ({ value: p.label, label: p.label }))}
              />
            </div>
          )}
          <div>
            <span className="mb-1 block text-xs text-muted-foreground">{s.sizePresets}</span>
            <div className="flex flex-wrap gap-1.5">
              {SIZE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applySizePreset(p.w, p.h)}
                  className="rounded-md border px-2 py-1 text-xs text-muted-foreground hover:border-primary/60 hover:text-foreground"
                >
                  {p.label} <span className="font-mono">{p.w}×{p.h}</span>
                </button>
              ))}
            </div>
          </div>
        </Section>

        {mode === 'photo' && (
          <Section title={s.photoSource} action={<Button size="sm" variant="outline" onClick={toggleBrowser}>{browserOpen ? s.browsePhotosClose : s.browsePhotos}</Button>}>
            <SegmentedControl
              value={source}
              onChange={(v) => setSource(v)}
              options={[{ value: 'random', label: s.photoRandom }, { value: 'seed', label: s.photoSeed }, { value: 'id', label: s.photoId }]}
            />
            {source === 'random' && (
              <Button size="sm" variant="outline" onClick={() => setCacheBust((n) => n + 1)}>
                <Shuffle className="size-3.5" />
              </Button>
            )}
            {source === 'seed' && (
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder={s.seedPlaceholder}
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              />
            )}
            {source === 'id' && photoId != null && (
              <p className="text-xs text-muted-foreground">
                {s.selected}: #{photoId}{photoAuthor && <> — {s.photoBy} {photoAuthor}</>}
              </p>
            )}

            {browserOpen && (
              <div className="max-h-72 overflow-auto rounded-md border p-2">
                {photosLoading && <p className="p-4 text-center text-xs text-muted-foreground">{s.browsePhotosLoading}</p>}
                {photosError && (
                  <div className="p-4 text-center">
                    <ImageOff className="mx-auto mb-2 size-5 text-muted-foreground" />
                    <p className="mb-2 text-xs text-muted-foreground">{s.browsePhotosError}</p>
                    <Button size="sm" variant="outline" onClick={loadPhotos}>{s.browsePhotosRetry}</Button>
                  </div>
                )}
                {photos && !photosError && (
                  <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-6">
                    {photos.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => pickPhoto(p)}
                        title={`${s.photoBy} ${p.author}`}
                        className={cn('aspect-square overflow-hidden rounded-md border', photoId === Number(p.id) && 'ring-2 ring-primary')}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- external, unknown-domain thumbnails; next/image would need a remotePatterns entry per photo host */}
                        <img src={buildPhotoUrl({ ...photoOpts, source: 'id', id: Number(p.id) }, 100, 100)} alt={p.author} className="size-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={grayscale} onChange={(e) => setGrayscale(e.target.checked)} />
              {s.grayscale}
            </label>
            <Slider label={`${s.blur} ${blur === 0 ? `(${s.blurOff})` : ''}`} value={blur} min={0} max={10} step={1} onChange={setBlur} />
            <SegmentedControl
              value={photoFormat}
              onChange={setPhotoFormat}
              options={[{ value: 'default', label: 'JPG' }, { value: 'webp', label: 'WebP' }]}
            />
          </Section>
        )}

        {mode === 'solid' && (
          <Section title={s.modeSolid}>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.solidBg}</span>
                <div className="flex items-center gap-2">
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} disabled={transparent} className="h-8 w-10 cursor-pointer rounded border bg-background disabled:opacity-40" />
                  <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} disabled={transparent} className="w-full rounded-md border bg-background px-2 py-1 font-mono text-xs disabled:opacity-40" />
                </div>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.solidText}</span>
                <div className="flex items-center gap-2">
                  <input type="color" value={text} onChange={(e) => setText(e.target.value)} className="h-8 w-10 cursor-pointer rounded border bg-background" />
                  <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1 font-mono text-xs" />
                </div>
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
              {s.transparent}
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">{s.customText}</span>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={s.customTextPlaceholder}
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">{s.font}</span>
              <select value={font} onChange={(e) => setFont(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                {SOLID_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </label>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">{s.format}</span>
              <SegmentedControl
                value={solidFormat}
                onChange={setSolidFormat}
                options={[
                  { value: 'svg', label: 'SVG' }, { value: 'png', label: 'PNG' }, { value: 'jpg', label: 'JPG' },
                  { value: 'gif', label: 'GIF' }, { value: 'webp', label: 'WebP' }, { value: 'avif', label: 'AVIF' },
                ]}
              />
            </div>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">{s.retina}</span>
              <SegmentedControl
                value={retina}
                onChange={setRetina}
                options={[{ value: '', label: s.retinaNone }, { value: '@2x', label: '2x' }, { value: '@3x', label: '3x' }]}
              />
            </div>
          </Section>
        )}

        <Section title={s.preview}>
          <div className="flex justify-center rounded-md border bg-[repeating-conic-gradient(#80808022_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- external service preview, dimensions are user-controlled and unbounded */}
            <img src={previewUrl} alt={altText || 'Placeholder'} className="max-h-72 max-w-full rounded-md border shadow-sm" />
          </div>
        </Section>

        <Section title={s.responsive}>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={responsiveOn} onChange={(e) => setResponsiveOn(e.target.checked)} />
            {s.responsiveEnable}
          </label>
          {responsiveOn && (
            <>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.breakpoints}</span>
                <input
                  type="text"
                  value={breakpointsText}
                  onChange={(e) => setBreakpointsText(e.target.value)}
                  className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm"
                />
              </label>
              <p className="text-xs text-muted-foreground">{s.responsiveHint}</p>
              <pre className="max-h-48 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed"><code>{responsiveMarkup}</code></pre>
              <Button size="sm" variant="outline" className="w-full" onClick={() => copy(responsiveMarkup)}>
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? s.copied : s.copy}
              </Button>
            </>
          )}
        </Section>

        <Section title={s.output}>
          <label className="block">
            <span className="mb-1 block text-xs text-muted-foreground">{s.altText}</span>
            <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
          </label>
          <SegmentedControl
            value={snippetFormat}
            onChange={setSnippetFormat}
            options={(['url', 'img', 'css', 'nextimage', 'markdown'] as SnippetFormat[]).map((f) => ({ value: f, label: snippetLabel[f] }))}
          />
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed"><code>{snippet}</code></pre>
          <Button size="sm" variant="outline" className="w-full" onClick={() => copy(snippet)}>
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
