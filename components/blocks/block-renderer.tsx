import Image from 'next/image'
import { Info, Lightbulb, TriangleAlert, OctagonAlert } from 'lucide-react'
import type { Block } from '@/lib/types'
import { cldVideoUrl } from '@/lib/cloudinary'
import { highlight } from '@/lib/shiki'
import { CopyButton } from './copy-button'
import { TryItLazy } from './try-it-lazy'

// note/tip/warning/danger — colors follow the same hardcoded-per-badge
// convention already used elsewhere (e.g. admin's "published" status),
// not new design-system tokens for four one-off variants.
const CALLOUT_STYLES = {
  note: { icon: Info, className: 'border-blue-500/40 bg-blue-500/10 text-blue-900 dark:text-blue-200' },
  tip: { icon: Lightbulb, className: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200' },
  warning: { icon: TriangleAlert, className: 'border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200' },
  danger: { icon: OctagonAlert, className: 'border-destructive/40 bg-destructive/10 text-destructive' },
} as const

export async function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent">
      {await Promise.all(blocks.map(async (b) => {
        switch (b.type) {
          case 'heading': {
            const Tag = `h${b.level}` as const
            return <Tag key={b.id} id={b.anchor}>{b.text}</Tag>
          }
          case 'richtext':
            return <div key={b.id} dangerouslySetInnerHTML={{ __html: b.html }} />
          case 'code': {
            const html = await highlight(b.code, b.language)
            return (
              <div key={b.id} className="not-prose relative group my-4">
                <div dangerouslySetInnerHTML={{ __html: html }} className="[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-sm" />
                <CopyButton code={b.code} />
              </div>
            )
          }
          case 'image':
            return (
              <Image
                key={b.id}
                src={b.publicId}
                alt={b.alt}
                width={b.width}
                height={b.height}
                loading="lazy"
                className="rounded-lg"
              />
            )
          case 'loop':
            return (
              <video
                key={b.id}
                autoPlay
                muted
                loop
                playsInline
                aria-label={b.alt}
                width={b.width}
                height={b.height}
                className="not-prose rounded-lg"
              >
                <source src={cldVideoUrl(b.publicId)} type="video/mp4" />
              </video>
            )
          case 'tryit':
            return <TryItLazy key={b.id} mode={b.mode} files={b.files} />
          case 'callout': {
            const style = CALLOUT_STYLES[b.variant]
            const Icon = style.icon
            return (
              <div key={b.id} className={`not-prose my-4 flex gap-3 rounded-lg border p-4 ${style.className}`}>
                <Icon className="mt-0.5 size-5 shrink-0" />
                <div className="min-w-0 [&_p]:m-0">
                  {b.title && <p className="mb-1 font-semibold">{b.title}</p>}
                  <div dangerouslySetInnerHTML={{ __html: b.html }} />
                </div>
              </div>
            )
          }
          case 'video':
            return (
              <div key={b.id} className="not-prose my-4">
                {b.provider === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${b.videoId}`}
                    title={b.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="aspect-video w-full rounded-lg"
                  />
                ) : (
                  <video controls className="w-full rounded-lg">
                    <source src={cldVideoUrl(b.videoId)} type="video/mp4" />
                  </video>
                )}
                {b.title && <p className="mt-2 text-sm text-muted-foreground">{b.title}</p>}
              </div>
            )
          case 'table':
            return (
              <table key={b.id}>
                <thead>
                  <tr>{b.header.map((h, i) => <th key={i} dangerouslySetInnerHTML={{ __html: h }} />)}</tr>
                </thead>
                <tbody>
                  {b.rows.map((row, i) => (
                    <tr key={i}>{row.map((cell, j) => <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />)}</tr>
                  ))}
                </tbody>
              </table>
            )
          default:
            return null
        }
      }))}
    </div>
  )
}
