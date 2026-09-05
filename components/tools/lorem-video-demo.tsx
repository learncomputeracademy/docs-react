'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SegmentedControl, Slider } from '@/components/tools/tool-controls'
import { lvs } from '@/lib/lorem-video-i18n'
import {
  SOURCES, FALLBACK_ORDER, LOREM_VIDEO_PRESETS, VIDEO_ASPECT_PRESETS, STATIC_VIDEOS,
  urlForSource, buildPosterUrl, estimateSizeMb, buildVideoSnippet,
  type LoremVideoSource, type LoremVideoContent, type VideoCodec, type Container,
  type LoremVideoPreset, type SnippetFormat, type PlayerAttrs, type VideoOptions,
} from '@/lib/lorem-video'
import type { Locale } from '@/lib/types'

export function LoremVideoDemo({ locale }: { locale: Locale }) {
  const s = lvs(locale)

  const [primarySource, setPrimarySource] = useState<LoremVideoSource>('lorem')
  const [activeSource, setActiveSource] = useState<LoremVideoSource>('lorem')
  const [autoFallback, setAutoFallback] = useState(true)
  const [failedSources, setFailedSources] = useState<Set<LoremVideoSource>>(new Set())

  const [width, setWidth] = useState(640)
  const [height, setHeight] = useState(360)
  const [aspectLabel, setAspectLabel] = useState('16:9')
  const [usePreset, setUsePreset] = useState(false)
  const [preset, setPreset] = useState<LoremVideoPreset>('480p')
  const [duration, setDuration] = useState(10)
  const [content, setContent] = useState<LoremVideoContent>('bunny')
  const [videoCodec, setVideoCodec] = useState<VideoCodec>('h264')
  const [container, setContainer] = useState<Container>('mp4')
  const [fps, setFps] = useState(15)
  const [bg, setBg] = useState('#1e293b')
  const [text, setText] = useState('#94a3b8')
  const [overlayText, setOverlayText] = useState('')

  const [playerAttrs, setPlayerAttrs] = useState<PlayerAttrs>({ autoplay: false, muted: true, loop: true, controls: true })
  const [snippetFormat, setSnippetFormat] = useState<SnippetFormat>('video')
  const [copied, setCopied] = useState(false)

  function ratioFor(label: string): number {
    return VIDEO_ASPECT_PRESETS.find((p) => p.label === label)?.ratio ?? 16 / 9
  }
  function updateWidth(w: number) {
    setWidth(w)
    setHeight(Math.max(1, Math.round(w / ratioFor(aspectLabel))))
  }
  function updateHeight(h: number) {
    setHeight(h)
    setWidth(Math.max(1, Math.round(h * ratioFor(aspectLabel))))
  }
  function setAspect(label: string) {
    setAspectLabel(label)
    setHeight(Math.max(1, Math.round(width / ratioFor(label))))
  }
  function choosePrimary(src: LoremVideoSource) {
    setPrimarySource(src)
    setActiveSource(src)
    setFailedSources(new Set())
  }

  function handleVideoError() {
    if (!autoFallback) return
    const failed = new Set(failedSources)
    failed.add(activeSource)
    const startIdx = FALLBACK_ORDER.indexOf(primarySource)
    const ordered = [...FALLBACK_ORDER.slice(startIdx), ...FALLBACK_ORDER.slice(0, startIdx)]
    const next = ordered.find((src) => !failed.has(src))
    setFailedSources(failed)
    if (next && next !== activeSource) setActiveSource(next)
  }

  const opts: VideoOptions = {
    width, height, usePreset, preset, duration, content, videoCodec, container,
    fps, bg: bg.replace(/^#/, ''), text: text.replace(/^#/, ''), overlayText,
  }
  const videoUrl = useMemo(() => urlForSource(activeSource, opts), [activeSource, opts])
  const dims = activeSource === 'static' ? { w: STATIC_VIDEOS[0].width, h: STATIC_VIDEOS[0].height } : { w: width, h: height }
  const posterUrl = useMemo(() => buildPosterUrl(dims.w, dims.h), [dims.w, dims.h])
  const sizeEstimate = useMemo(() => estimateSizeMb(opts), [opts])
  const snippet = buildVideoSnippet(snippetFormat, videoUrl, dims.w, dims.h, posterUrl, playerAttrs)

  async function copy() {
    await navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const sourceLabel: Record<LoremVideoSource, string> = { lorem: s.srcLorem, placeholdervideo: s.srcPlaceholderVideo, imgsrc: s.srcImgsrc, static: s.srcStatic }
  const contentLabel: Record<LoremVideoContent, string> = { bunny: s.contentBunny, cat: s.contentCat, corgi: s.contentCorgi, test: s.contentTest }
  const snippetLabel: Record<SnippetFormat, string> = { url: s.outUrl, video: s.outVideo, react: s.outReact, markdown: s.outMarkdown }
  const usedFallback = activeSource !== primarySource

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

      <p className="mx-auto mt-6 flex max-w-2xl items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
        {s.reliabilityNote}
      </p>

      <div className="mt-6 space-y-4">
        <Section title={s.source}>
          <SegmentedControl value={primarySource} onChange={choosePrimary} options={SOURCES.map((src) => ({ value: src, label: sourceLabel[src] }))} />
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={autoFallback} onChange={(e) => setAutoFallback(e.target.checked)} />
            {s.autoFallback}
          </label>
          <p className="text-xs text-muted-foreground">
            {s.activeSource}: <span className="font-medium text-foreground">{sourceLabel[activeSource]}</span>
            {usedFallback && <span className="ml-1">{s.fallbackHappened}</span>}
          </p>
        </Section>

        {activeSource !== 'static' && (
          <Section title={s.size}>
            {activeSource === 'lorem' && (
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={usePreset} onChange={(e) => setUsePreset(e.target.checked)} />
                {s.usePreset}
              </label>
            )}
            {activeSource === 'lorem' && usePreset ? (
              <div>
                <span className="mb-1 block text-xs text-muted-foreground">{s.preset}</span>
                <SegmentedControl value={preset} onChange={setPreset} options={LOREM_VIDEO_PRESETS.map((p) => ({ value: p, label: p }))} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Slider label={s.width} value={width} min={16} max={1920} step={16} onChange={updateWidth} />
                  <Slider label={s.height} value={height} min={16} max={1920} step={16} onChange={updateHeight} />
                </div>
                <div>
                  <span className="mb-1 block text-xs text-muted-foreground">{s.aspectPresets}</span>
                  <SegmentedControl value={aspectLabel} onChange={setAspect} options={VIDEO_ASPECT_PRESETS.map((p) => ({ value: p.label, label: p.label }))} />
                </div>
              </>
            )}
          </Section>
        )}

        {activeSource === 'lorem' && (
          <Section title={sourceLabel.lorem}>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">{s.content}</span>
              <SegmentedControl value={content} onChange={setContent} options={(['bunny', 'cat', 'corgi', 'test'] as LoremVideoContent[]).map((c) => ({ value: c, label: contentLabel[c] }))} />
            </div>
            <Slider label={`${s.duration} (${s.seconds})`} value={duration} min={1} max={60} step={1} onChange={setDuration} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="mb-1 block text-xs text-muted-foreground">{s.videoCodec}</span>
                <select value={videoCodec} onChange={(e) => setVideoCodec(e.target.value as VideoCodec)} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                  {(['h264', 'h265', 'vp9', 'av1', 'novideo'] as VideoCodec[]).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <span className="mb-1 block text-xs text-muted-foreground">{s.container}</span>
                <SegmentedControl value={container} onChange={setContainer} options={[{ value: 'mp4', label: 'MP4' }, { value: 'webm', label: 'WebM' }]} />
              </div>
            </div>
          </Section>
        )}

        {activeSource === 'imgsrc' && (
          <Section title={sourceLabel.imgsrc}>
            <Slider label={`${s.duration} (${s.seconds})`} value={duration} min={1} max={30} step={1} onChange={setDuration} />
            <Slider label={s.fps} value={fps} min={1} max={30} step={1} onChange={setFps} />
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.bg}</span>
                <div className="flex items-center gap-2">
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-8 w-10 cursor-pointer rounded border bg-background" />
                  <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1 font-mono text-xs" />
                </div>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{s.textColor}</span>
                <div className="flex items-center gap-2">
                  <input type="color" value={text} onChange={(e) => setText(e.target.value)} className="h-8 w-10 cursor-pointer rounded border bg-background" />
                  <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-md border bg-background px-2 py-1 font-mono text-xs" />
                </div>
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">{s.overlayText}</span>
              <input type="text" value={overlayText} onChange={(e) => setOverlayText(e.target.value)} placeholder={s.overlayTextPlaceholder} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
            </label>
          </Section>
        )}

        {activeSource !== 'static' && (
          <p className="text-xs text-muted-foreground">{s.sizeEstimate}: ~{sizeEstimate} MB <span className="text-muted-foreground/70">{s.sizeEstimateNote}</span></p>
        )}

        <Section title={s.preview}>
          <video
            key={videoUrl}
            src={videoUrl}
            poster={posterUrl}
            width={dims.w}
            height={dims.h}
            controls={playerAttrs.controls}
            autoPlay={playerAttrs.autoplay}
            muted={playerAttrs.muted}
            loop={playerAttrs.loop}
            onError={handleVideoError}
            className="mx-auto max-h-72 w-full max-w-full rounded-md border shadow-sm"
          />
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4">
            {(['controls', 'autoplay', 'muted', 'loop'] as (keyof PlayerAttrs)[]).map((k) => (
              <label key={k} className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={playerAttrs[k]} onChange={(e) => setPlayerAttrs((p) => ({ ...p, [k]: e.target.checked }))} />
                {k === 'controls' ? s.playerControls : k === 'autoplay' ? s.playerAutoplay : k === 'muted' ? s.playerMuted : s.playerLoop}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{s.posterHint}</p>
        </Section>

        <Section title={s.output}>
          <SegmentedControl
            value={snippetFormat}
            onChange={setSnippetFormat}
            options={(['url', 'video', 'react', 'markdown'] as SnippetFormat[]).map((f) => ({ value: f, label: snippetLabel[f] }))}
          />
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed"><code>{snippet}</code></pre>
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
