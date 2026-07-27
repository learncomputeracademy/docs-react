import Image from 'next/image'
import type { Block } from '@/lib/types'
import { cldVideoUrl } from '@/lib/cloudinary'
import { highlight } from '@/lib/shiki'
import { CopyButton } from './copy-button'
import { TryItLazy } from './try-it-lazy'

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
