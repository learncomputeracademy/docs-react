'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Sucrase (JSX transform for React-mode Try It) is real weight and only a
// handful of lessons use it — code-split out of every other page's bundle.
// This wrapper exists (rather than importing TryIt straight into
// block-renderer) because next/dynamic needs a client-boundary caller.
//
// Deliberately NOT passing `ssr: false` here, despite that being the
// documented way to skip server rendering for a browser-only widget:
// verified broken in this Next.js version (16.2.11, webpack) for
// generateStaticParams-prerendered routes — with it, the loading fallback
// never resolves, in both dev and a real production build (`next build &&
// next start`), with zero console/server errors. Bisected with a trivial
// stub component (worked) vs the real one (hung) to confirm `ssr:false`
// itself was the variable that mattered. Since this component touches no
// server-unsafe APIs outside effects/handlers, plain SSR of the initial
// (pre-"Run") state is harmless, so dropping the flag is a safe workaround.
const TryIt = dynamic(() => import('./try-it').then((m) => m.TryIt), {
  loading: () => <Skeleton className="not-prose my-6 h-[320px] w-full rounded-lg" />,
})

export { TryIt as TryItLazy }
