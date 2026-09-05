// One-off: adds a nav_items row for /cybersecurity under the Docs mega-menu
// parent, same pattern as scripts/add-missing-docs-nav.mjs. Without this row
// the category has real content but is unreachable from any nav (flat or
// mega), only by typing the URL directly — lib/nav-megamenu.ts only ever
// groups children that already exist in nav_items.
//
// Direct insert, bypasses the app's revalidateNav() on purpose (CLAUDE.md's
// active ISR-quota constraint). Idempotent (checks by url first). Caller
// busts the local dev server's 'nav' cache tag afterward via
// POST /api/revalidate {tag:"nav"} against localhost only.
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = readFileSync('.env.local', 'utf8')
const get = (k) => env.match(new RegExp(`${k}=(.*)`))[1].trim()
const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'))

const DOCS_PARENT_ID = 'bc658b53-8adf-43ff-9d57-df7d0c70ce9c'

const { data: siblings, error: countErr } = await supabase
  .from('nav_items').select('sort_order').eq('parent_id', DOCS_PARENT_ID).order('sort_order', { ascending: false }).limit(1)
if (countErr) throw countErr
const nextOrder = (siblings[0]?.sort_order ?? 0) + 1

const item = { label: 'Cybersecurity', label_bn: 'সাইবার সিকিউরিটি', url: '/cybersecurity' }
const { data: existing } = await supabase.from('nav_items').select('id').eq('url', item.url).maybeSingle()
if (existing) {
  console.log(`Skipped "${item.label}" — nav_items row already exists (${existing.id}).`)
} else {
  const { error } = await supabase.from('nav_items').insert({
    label: item.label,
    label_bn: item.label_bn,
    url: item.url,
    parent_id: DOCS_PARENT_ID,
    sort_order: nextOrder,
  })
  if (error) throw error
  console.log(`Inserted "${item.label}" under Docs, sort_order ${nextOrder}.`)
}
