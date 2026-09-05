'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl } from '@/components/tools/tool-controls'
import { sps } from '@/lib/serp-preview-i18n'
import type { Locale } from '@/lib/types'
import { cn } from '@/lib/utils'

type Device = 'desktop' | 'mobile'

// Commonly-used practical guidelines (Moz/SEO-community convention), not an
// official Google API — Google has never published a fixed pixel limit and
// dynamically rewrites/truncates based on the query. Disclosed plainly in
// the UI rather than presented as a hard rule.
const LIMITS: Record<Device, { title: number; desc: number; descLines: number }> = {
  desktop: { title: 600, desc: 600, descLines: 2 },
  mobile: { title: 380, desc: 380, descLines: 3 },
}

// House rule 4 ("measure, don't re-simulate"): rather than counting
// characters and guessing a cutoff, an invisible same-font clone is
// actually laid out by the browser and its real rendered width is read
// back via getBoundingClientRect — the same shape as the Clamp tool's
// iframe measurement, just via a hidden span instead of a hidden document.
function useMeasuredWidth(text: string, deps: unknown[]) {
  const ref = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState<number | null>(null)
  useEffect(() => {
    if (ref.current) setWidth(ref.current.getBoundingClientRect().width)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, ...deps])
  return { ref, width }
}

export function SerpPreviewDemo({ locale }: { locale: Locale }) {
  const s = sps(locale)
  const [device, setDevice] = useState<Device>('desktop')
  const [domain, setDomain] = useState<string>(s.sampleDomain)
  const [path, setPath] = useState<string>(s.samplePath)
  const [title, setTitle] = useState<string>(s.sampleTitle)
  const [description, setDescription] = useState<string>(s.sampleDesc)
  const [hintField, setHintField] = useState<null | 'title' | 'desc'>(null)
  const [copied, setCopied] = useState(false)

  const limit = LIMITS[device]
  const titleFont = device === 'desktop' ? '20px arial,sans-serif' : '18px arial,sans-serif'
  const descFont = device === 'desktop' ? '14px arial,sans-serif' : '14px arial,sans-serif'
  const titleMeasure = useMeasuredWidth(title, [device])
  const descMeasure = useMeasuredWidth(description, [device])

  const breadcrumb = [domain.replace(/^https?:\/\//, '').replace(/\/$/, ''), ...path.split('/').filter(Boolean)].join(' › ')

  async function copyTags() {
    await navigator.clipboard.writeText(`<title>${title}</title>\n<meta name="description" content="${description}">`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function hintProps(key: NonNullable<typeof hintField>) {
    return { onFocus: () => setHintField(key), onBlur: () => setHintField(null) }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h1>
        <p className="mt-3 text-muted-foreground">{s.subtitle}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={locale === 'bn' ? '/bn/seo/title-tags' : '/seo/title-tags'}>{s.lessonCtaTitle} <ArrowRight className="size-3.5" /></Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={locale === 'bn' ? '/bn/seo/meta-descriptions' : '/seo/meta-descriptions'}>{s.lessonCtaDesc} <ArrowRight className="size-3.5" /></Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto mt-8 flex max-w-xs justify-center">
        <SegmentedControl value={device} onChange={setDevice} options={[{ value: 'desktop', label: s.desktop }, { value: 'mobile', label: s.mobile }]} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Preview */}
        {/* min-w-0: a grid item's default `min-width: auto` lets it claim
            its content's full min-content size as a floor — here that's the
            <pre><code> block's longest unwrapped line (the generated
            <meta description>), which was forcing this 1fr track past its
            fair share and overflowing the whole grid. Real bug caught live:
            the page was 500px+ wider than the viewport. */}
        <div className="min-w-0 space-y-3">
          <Section title={s.preview}>
            <div className={cn('overflow-hidden rounded-md border bg-white p-4 dark:bg-neutral-900', device === 'mobile' && 'max-w-sm')}>
              <div className="flex items-center gap-2 text-sm text-[#4d5156] dark:text-neutral-400">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f1f3f4] text-[10px] font-semibold text-[#4d5156] dark:bg-neutral-800 dark:text-neutral-300">
                  {breadcrumb.charAt(0).toUpperCase()}
                </span>
                <span className="truncate">{breadcrumb}</span>
              </div>
              <div
                className="mt-1 truncate text-[#1a0dab] hover:underline dark:text-[#8ab4f8]"
                style={{ font: titleFont, maxWidth: limit.title }}
              >
                {title || '—'}
              </div>
              <p
                className="mt-1 overflow-hidden text-[#4d5156] dark:text-neutral-400"
                style={{ font: descFont, maxWidth: limit.desc, display: '-webkit-box', WebkitLineClamp: limit.descLines, WebkitBoxOrient: 'vertical' }}
              >
                {description || '—'}
              </p>
            </div>
          </Section>

          <Section title={s.generatedTags}>
            <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
              <code>{`<title>${title}</title>\n<meta name="description" content="${description}">`}</code>
            </pre>
            <Button size="sm" variant="outline" className="w-full" onClick={copyTags}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? s.copied : s.copy}
            </Button>
          </Section>

          <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">{s.disclaimer}</p>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <Section title={s.urlSection}>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">{s.domain}</span>
              <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">{s.path}</span>
              <input type="text" value={path} onChange={(e) => setPath(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
            </label>
          </Section>

          <Section
            title={s.titleSection}
            action={
              <span className={cn('font-mono text-[10px] normal-case', titleMeasure.width && titleMeasure.width > limit.title ? 'text-destructive' : 'text-muted-foreground')}>
                {titleMeasure.width ? Math.round(titleMeasure.width) : '—'}/{limit.title}{s.pxUsed}
              </span>
            }
          >
            <textarea
              {...hintProps('title')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-md border bg-background p-2 text-sm"
            />
            {/* Measuring span: a `relative` wrapper keeps this absolutely-
                positioned clone contained to this spot instead of escaping
                to the document root (no ancestor here sets `position`
                otherwise) and inflating the page's horizontal scroll range
                — a real bug caught in the live browser pass. */}
            <div className="relative h-0 overflow-hidden">
              <span aria-hidden ref={titleMeasure.ref} className="pointer-events-none absolute left-0 whitespace-nowrap" style={{ font: titleFont }}>{title}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {title.length} {s.charCount} ·{' '}
              {titleMeasure.width && titleMeasure.width > limit.title ? s.overGuideline : s.withinGuideline} ({s.guideline})
            </p>
          </Section>

          <Section
            title={s.descSection}
            action={
              <span className={cn('font-mono text-[10px] normal-case', descMeasure.width && descMeasure.width > limit.desc * limit.descLines ? 'text-destructive' : 'text-muted-foreground')}>
                {descMeasure.width ? Math.round(descMeasure.width) : '—'}/{limit.desc * limit.descLines}{s.pxUsed}
              </span>
            }
          >
            <textarea
              {...hintProps('desc')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border bg-background p-2 text-sm"
            />
            <div className="relative h-0 overflow-hidden">
              <span aria-hidden ref={descMeasure.ref} className="pointer-events-none absolute left-0 whitespace-nowrap" style={{ font: descFont }}>{description}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {description.length} {s.charCount} ·{' '}
              {descMeasure.width && descMeasure.width > limit.desc * limit.descLines ? s.overGuideline : s.withinGuideline} ({s.guideline})
            </p>
          </Section>

          {hintField && <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{hintField === 'title' ? s.titleHint : s.descHint}</p>}
        </div>
      </div>
    </div>
  )
}
