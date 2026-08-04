import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/supabase/public'
import { submitToIndexNow } from '@/lib/indexnow'
import { absoluteUrl } from '@/lib/seo'

// Publish → Supabase Database Webhook → this route → revalidateTag → that
// ONE page regenerates on next request. See docs/DECISIONS.md's revalidation
// diagram. Auth is a single shared secret header, not Supabase's webhook
// signing (dashboard-configured custom header is simpler and sufficient for
// a single trusted caller — see docs/ADMIN.md for the exact setup steps).
type WebhookPayload = {
  table?: string
  record?: Record<string, unknown> | null
  old_record?: Record<string, unknown> | null
  tag?: string
  path?: string
}

export async function POST(req: Request) {
  if (req.headers.get('x-revalidate-secret') !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'invalid secret' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as WebhookPayload | null
  if (!body) return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })

  const { tags, paths } = await resolveTargets(body)
  // { expire: 0 }, not the 'max' profile: per Next's own revalidate.js,
  // a string profile like 'max' is treated as stale-while-revalidate and
  // does NOT mark the route for immediate regeneration (only expire===0
  // does). The design here is "publish -> that ONE page regenerates now",
  // not "eventually within some staleness window" — expire:0 is what
  // actually produces that.
  tags.forEach((tag) => revalidateTag(tag, { expire: 0 }))
  // Also revalidatePath the exact route(s): revalidateTag alone leaves
  // generateMetadata's <title>/<meta> stale for one extra cycle (verified
  // against a production build — the page body updates immediately via the
  // tag, but metadata resolution doesn't pick up the same invalidation).
  // revalidatePath forces the whole route, metadata included.
  paths.forEach((path) => revalidatePath(path, 'page'))

  // Same trigger as the revalidation itself — a doc publish, edit, or
  // delete. IndexNow doesn't distinguish "changed" from "removed": a ping
  // just tells the engine to recrawl, and a deleted/unpublished page
  // dropping out on its own is the correct outcome either way. Awaited
  // (not fire-and-forget) so it actually happens before this function
  // returns, given Vercel doesn't guarantee background work survives past
  // the response — the cost is one external POST, not a page render.
  await submitToIndexNow(paths.map((path) => absoluteUrl(path)))

  return NextResponse.json({ revalidated: tags.length > 0 || paths.length > 0, tags, paths })
}

// Accepts either a Supabase Database Webhook payload (table/record/old_record)
// or a manual { tag, path } body — the latter for testing now and for any
// future admin-panel "publish" action that wants to call this directly
// instead of waiting on a DB webhook round trip.
async function resolveTargets(body: WebhookPayload): Promise<{ tags: string[]; paths: string[] }> {
  if (body.tag || body.path) {
    return { tags: body.tag ? [body.tag] : [], paths: body.path ? [body.path] : [] }
  }

  const row = body.record ?? body.old_record
  if (!row) return { tags: [], paths: [] }

  switch (body.table) {
    case 'docs': {
      const path = row.path
      return typeof path === 'string'
        ? { tags: [`doc:${path}`, 'sidebar'], paths: [`/${path}`, `/bn/${path}`] }
        : { tags: ['sidebar'], paths: [] }
    }
    case 'doc_translations': {
      const docId = row.doc_id
      const path = typeof docId === 'string' ? await pathForDocId(docId) : null
      return path
        ? { tags: [`doc:${path}`, 'sidebar'], paths: [`/${path}`, `/bn/${path}`] }
        : { tags: ['sidebar'], paths: [] }
    }
    case 'categories':
      return { tags: ['sidebar'], paths: [] }
    default:
      return { tags: [], paths: [] }
  }
}

async function pathForDocId(docId: string): Promise<string | null> {
  const supabase = createPublicClient()
  const { data } = await supabase.from('docs').select('path').eq('id', docId).maybeSingle()
  return (data as { path: string } | null)?.path ?? null
}
