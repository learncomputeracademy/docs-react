import { listMediaForAdmin } from '@/lib/admin/media'
import { MediaLibrary } from '@/components/admin/media-library'

export default async function AdminMediaPage() {
  const media = await listMediaForAdmin()

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-xl font-bold">Media</h1>
      <p className="mt-1 text-sm text-muted-foreground">{media.length} assets.</p>
      <div className="mt-6">
        <MediaLibrary media={media} />
      </div>
    </main>
  )
}
