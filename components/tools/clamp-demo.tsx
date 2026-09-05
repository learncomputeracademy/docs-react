'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider, Section, SegmentedControl } from '@/components/tools/tool-controls'
import { cs } from '@/lib/clamp-i18n'
import type { Locale } from '@/lib/types'

type Target = 'font' | 'spacing'
type Format = 'value' | 'css' | 'cssvar' | 'tailwind'

// Standard fluid-value formula (the same one Utopia.fyi and every other
// clamp() calculator uses): a line through (minViewport, minValue) and
// (maxViewport, maxValue), expressed as `rem + vw`, clamped at both ends.
// Working in rem for the fixed endpoints (not px) is what makes the output
// still respect a visitor's own browser font-size setting.
function computeClamp(minVw: number, maxVw: number, minVal: number, maxVal: number, root: number) {
  const slope = (maxVal - minVal) / (maxVw - minVw)
  const yIntersection = -minVw * slope + minVal
  const trim = (n: number) => Math.round(n * 10000) / 10000
  const minRem = trim(minVal / root)
  const maxRem = trim(maxVal / root)
  const preferredRem = trim(yIntersection / root)
  const vw = trim(slope * 100)
  const sign = vw >= 0 ? '+' : '-'
  const value = `clamp(${minRem}rem, ${preferredRem}rem ${sign} ${Math.abs(vw)}vw, ${maxRem}rem)`
  return { minRem, maxRem, preferredRem, vw, value }
}

const PRESETS = [
  { key: 'body', target: 'font' as Target, minVw: 375, maxVw: 1440, minVal: 16, maxVal: 18 },
  { key: 'h1', target: 'font' as Target, minVw: 375, maxVw: 1440, minVal: 32, maxVal: 64 },
  { key: 'h2', target: 'font' as Target, minVw: 375, maxVw: 1440, minVal: 24, maxVal: 40 },
  { key: 'caption', target: 'font' as Target, minVw: 375, maxVw: 1440, minVal: 12, maxVal: 14 },
  { key: 'spacing', target: 'spacing' as Target, minVw: 375, maxVw: 1440, minVal: 24, maxVal: 80 },
] as const

function iframeSrcDoc(target: Target, value: string, sampleText: string, dark: boolean) {
  const bg = dark ? '#0a0a0a' : '#ffffff'
  const fg = dark ? '#fafafa' : '#0a0a0a'
  const accent = dark ? '#fb923c' : '#f97316'
  const body = target === 'font'
    ? `<p id="el" style="margin:0;font-family:ui-sans-serif,system-ui,sans-serif;font-size:${value};color:${fg};line-height:1.2;">${sampleText}</p>`
    : `<div id="el" style="display:inline-block;padding:${value};border-radius:8px;background:${accent}22;border:2px dashed ${accent};color:${fg};font-family:ui-sans-serif,system-ui,sans-serif;">box</div>`
  return `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:${bg};">${body}<script>
    var el = document.getElementById('el');
    function report() {
      var cs = getComputedStyle(el);
      var px = ${target === 'font'} ? cs.fontSize : cs.paddingTop;
      parent.postMessage({ clampDemo: true, px: px }, '*');
    }
    report();
    addEventListener('resize', report);
  </script></body></html>`
}

export function ClampDemo({ locale }: { locale: Locale }) {
  const s = cs(locale)
  const [target, setTarget] = useState<Target>('font')
  const [minVw, setMinVw] = useState(375)
  const [maxVw, setMaxVw] = useState(1440)
  const [minVal, setMinVal] = useState(16)
  const [maxVal, setMaxVal] = useState(32)
  const [root, setRoot] = useState(16)
  const [previewWidth, setPreviewWidth] = useState(760)
  const [hintField, setHintField] = useState<null | 'minVw' | 'maxVw' | 'minVal' | 'maxVal' | 'root'>(null)
  const [format, setFormat] = useState<Format>('value')
  const [copied, setCopied] = useState(false)
  const [computedPx, setComputedPx] = useState<string | null>(null)
  const [dark, setDark] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // The preview is a separate document (an iframe, needed so `vw` inside it
  // is relative to the iframe's own width, not the outer window — see the
  // comment on iframeSrcDoc). That means it doesn't inherit the page's dark
  // class through CSS the way every other tool's real-DOM preview does, so
  // the header's theme toggle needs to be watched explicitly and threaded
  // through to re-render the srcDoc with the right colors.
  useEffect(() => {
    const update = () => setDark(document.documentElement.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const invalid = maxVw <= minVw
  const result = useMemo(
    () => (invalid ? null : computeClamp(minVw, maxVw, minVal, maxVal, root)),
    [minVw, maxVw, minVal, maxVal, root, invalid]
  )

  const property = target === 'font' ? 'font-size' : 'padding'
  const varName = target === 'font' ? '--fluid-font-size' : '--fluid-space'
  const outputByFormat: Record<Format, string> = result
    ? {
        value: result.value,
        css: `${property}: ${result.value};`,
        cssvar: `${varName}: ${result.value};\n${property}: var(${varName});`,
        tailwind: `${target === 'font' ? 'text' : 'p'}-[clamp(${result.minRem}rem,_${result.preferredRem}rem_${result.vw >= 0 ? '+' : '-'}_${Math.abs(result.vw)}vw,_${result.maxRem}rem)]`,
      }
    : { value: '', css: '', cssvar: '', tailwind: '' }

  // Real browser computation, not JS arithmetic re-simulated for display
  // (docs/TOOLS.md house rule 4) — the iframe actually renders the clamp()
  // value at its own width (vw inside an iframe is relative to the iframe,
  // not the outer window), and getComputedStyle reads the true rendered
  // pixel value back out.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.clampDemo) setComputedPx(e.data.px)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  function applyPreset(p: (typeof PRESETS)[number]) {
    setTarget(p.target)
    setMinVw(p.minVw)
    setMaxVw(p.maxVw)
    setMinVal(p.minVal)
    setMaxVal(p.maxVal)
    setPreviewWidth(Math.round((p.minVw + p.maxVw) / 2))
  }

  async function copy() {
    await navigator.clipboard.writeText(outputByFormat[format])
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function hintProps(key: NonNullable<typeof hintField>) {
    return { onMouseEnter: () => setHintField(key), onMouseLeave: () => setHintField(null), onFocus: () => setHintField(key) }
  }
  const hintText: Record<NonNullable<typeof hintField>, string> = {
    minVw: s.minViewportDesc, maxVw: s.maxViewportDesc, minVal: s.minValueDesc, maxVal: s.maxValueDesc, root: s.rootFontSizeDesc,
  }

  const presetLabels: Record<(typeof PRESETS)[number]['key'], { label: string; note: string }> = {
    body: { label: s.presetBody, note: s.presetBodyNote },
    h1: { label: s.presetH1, note: s.presetH1Note },
    h2: { label: s.presetH2, note: s.presetH2Note },
    caption: { label: s.presetCaption, note: s.presetCaptionNote },
    spacing: { label: s.presetSpacing, note: s.presetSpacingNote },
  }

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

      <div className="mx-auto mt-8 flex max-w-xs justify-center">
        <SegmentedControl
          value={target}
          onChange={setTarget}
          options={[{ value: 'font', label: s.targetFont }, { value: 'spacing', label: s.targetSpacing }]}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Preview */}
        <div className="space-y-3">
          <Section
            title={s.preview}
            action={computedPx && <span className="font-mono text-xs text-muted-foreground">{s.computedAt}: {computedPx}</span>}
          >
            <div className="overflow-hidden rounded-md border">
              {invalid ? (
                <p className="p-6 text-center text-sm text-destructive">{s.invalidRange}</p>
              ) : (
                <iframe
                  ref={iframeRef}
                  key={target}
                  title="clamp preview"
                  srcDoc={iframeSrcDoc(target, result!.value, s.sampleText, dark)}
                  style={{ width: previewWidth, maxWidth: '100%', height: 220 }}
                  className="mx-auto block border-0"
                />
              )}
            </div>
            <Slider label={s.previewWidth} value={previewWidth} min={320} max={1920} step={10} suffix="px" onChange={setPreviewWidth} />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setPreviewWidth(375)}>{s.mobile}</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setPreviewWidth(768)}>{s.tablet}</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setPreviewWidth(1440)}>{s.desktop}</Button>
            </div>
          </Section>

          <Section title={s.presets}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="rounded-md border p-2 text-left text-xs hover:border-primary/50 hover:bg-accent/50"
                >
                  <div className="font-medium">{presetLabels[p.key].label}</div>
                  <div className="text-muted-foreground">{presetLabels[p.key].note}</div>
                </button>
              ))}
            </div>
          </Section>

          <Section title={s.howItWorks}>
            <p className="text-xs text-muted-foreground">{s.howItWorksBody}</p>
          </Section>
        </div>

        {/* Controls + output */}
        <div className="space-y-4">
          <Section title={s.minViewport}><div {...hintProps('minVw')}><Slider label={s.minViewport} value={minVw} min={200} max={1200} step={5} suffix="px" onChange={setMinVw} /></div></Section>
          <Section title={s.maxViewport}><div {...hintProps('maxVw')}><Slider label={s.maxViewport} value={maxVw} min={600} max={2560} step={5} suffix="px" onChange={setMaxVw} /></div></Section>
          <Section title={s.minValue}><div {...hintProps('minVal')}><Slider label={s.minValue} value={minVal} min={4} max={200} step={1} suffix="px" onChange={setMinVal} /></div></Section>
          <Section title={s.maxValue}><div {...hintProps('maxVal')}><Slider label={s.maxValue} value={maxVal} min={4} max={200} step={1} suffix="px" onChange={setMaxVal} /></div></Section>
          <Section title={s.rootFontSize}><div {...hintProps('root')}><Slider label={s.rootFontSize} value={root} min={10} max={24} step={1} suffix="px" onChange={setRoot} /></div></Section>

          {hintField && <p className="rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground">{hintText[hintField]}</p>}

          <Section title={s.generatedCss}>
            <SegmentedControl
              value={format}
              onChange={setFormat}
              options={[
                { value: 'value', label: s.formatValue },
                { value: 'css', label: s.formatCss },
                { value: 'cssvar', label: s.formatCssVar },
                { value: 'tailwind', label: s.formatTailwind },
              ]}
            />
            <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed">
              <code>{outputByFormat[format] || '—'}</code>
            </pre>
            <Button size="sm" variant="outline" className="w-full" disabled={invalid} onClick={copy}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? s.copied : s.copy}
            </Button>
          </Section>
        </div>
      </div>
    </div>
  )
}
