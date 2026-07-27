'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { restoreDoc, type TrashedDocRow } from '@/lib/admin/docs'

export function TrashList({ docs }: { docs: TrashedDocRow[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function onRestore(id: string) {
    startTransition(async () => {
      await restoreDoc(id)
      router.refresh()
    })
  }

  if (docs.length === 0) {
    return <p className="text-sm text-muted-foreground">Trash is empty.</p>
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      {docs.map((doc) => (
        <div key={doc.id} className="flex items-center gap-3 border-b bg-background px-4 py-2.5 last:border-0">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{doc.title}</p>
            <p className="font-mono text-xs text-muted-foreground">/{doc.path}{doc.category ? '' : ' (standalone)'}</p>
          </div>
          <span className="text-xs text-muted-foreground">Deleted {new Date(doc.deleted_at).toLocaleDateString()}</span>
          <Button size="sm" variant="outline" disabled={pending} onClick={() => onRestore(doc.id)}>Restore</Button>
        </div>
      ))}
    </div>
  )
}
