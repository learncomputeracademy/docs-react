'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Lesson image with a shimmer while it downloads. width/height already
// reserve the box, so the shimmer fills the exact final area; it's the
// <img>'s own background, removed on load so transparent PNGs end clean.
// The <img> is still in the server HTML (ISR) — only the shimmer is client state.
export function LessonImage({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      // Already decoded before hydration (cached image): onLoad won't fire.
      ref={(img) => {
        if (img?.complete && img.naturalWidth) setLoaded(true)
      }}
      className={cn(
        'rounded-lg',
        !loaded &&
          'animate-shimmer-sweep bg-muted bg-[length:200%_100%] bg-[linear-gradient(110deg,transparent_35%,color-mix(in_oklch,var(--foreground)_12%,transparent)_50%,transparent_65%)]',
      )}
    />
  )
}
