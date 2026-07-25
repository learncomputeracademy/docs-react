import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getSidebarTree } from '@/lib/content'

export async function DocSidebar({ activePath }: { activePath?: string }) {
  const categories = await getSidebarTree()
  return (
    <nav className="w-64 shrink-0 border-r overflow-y-auto py-6 pr-4 text-sm hidden md:block">
      {categories.map((cat) => (
        <div key={cat.id} className="mb-6">
          <h3 className="px-3 mb-1 font-semibold text-foreground">{cat.title}</h3>
          <ul>
            {cat.docs.map((doc) => (
              <li key={doc.path}>
                <Link
                  href={`/${doc.path}`}
                  className={cn(
                    'block rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
                    activePath === doc.path && 'bg-muted text-primary font-medium'
                  )}
                >
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
