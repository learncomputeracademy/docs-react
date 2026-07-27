import { getResources } from '@/lib/content'
import { buildAlternates } from '@/lib/seo'

export const metadata = {
  title: 'Resources',
  description: 'Free tools and resources for web design and development.',
  alternates: buildAlternates('/resources', '/resources'),
}

export default async function ResourcesPage() {
  const resources = await getResources()
  const groups = new Map<string, typeof resources>()
  for (const r of resources) {
    if (!groups.has(r.group_name)) groups.set(r.group_name, [])
    groups.get(r.group_name)!.push(r)
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
      <p className="mt-2 text-muted-foreground">Free tools and resources, grouped by category.</p>

      {resources.length === 0 && <p className="mt-8 text-muted-foreground">Nothing here yet — check back soon.</p>}

      <div className="mt-8 space-y-10">
        {[...groups.entries()].map(([groupName, items]) => (
          <section key={groupName}>
            <h2 className="text-xl font-semibold">{groupName}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  {r.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.thumbnail_url} alt="" className="size-10 shrink-0 rounded-md object-cover" />
                  )}
                  <span className="min-w-0 truncate font-medium">{r.name}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
