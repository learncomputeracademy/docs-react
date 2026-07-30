import { listNotes } from '@/lib/admin/notes'
import { NotesManager } from '@/components/admin/notes-manager'

export default async function AdminNotesPage() {
  const notes = await listNotes()

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-xl font-bold">Notes</h1>
      <p className="mt-1 text-sm text-muted-foreground">{notes.length} notes — shared across all admins.</p>
      <div className="mt-6">
        <NotesManager notes={notes} />
      </div>
    </main>
  )
}
