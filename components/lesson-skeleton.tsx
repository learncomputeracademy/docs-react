import { Skeleton } from '@/components/ui/skeleton'

// Sidebar now lives in layout.tsx, outside this Suspense fallback, so it
// never flashes/reloads on navigation — only main + TOC need a skeleton.
export function LessonSkeleton() {
  return (
    <>
      <main className="min-w-0 flex-1 py-8" aria-hidden>
        <Skeleton className="h-9 w-2/3" />
        <div className="mt-8 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-6 h-40 w-full" />
          <Skeleton className="mt-6 h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </main>

      <aside className="hidden w-56 shrink-0 py-8 xl:block" aria-hidden>
        <Skeleton className="mb-3 h-4 w-24" />
        <div className="space-y-2 border-l pl-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-full" />
          ))}
        </div>
      </aside>
    </>
  )
}
