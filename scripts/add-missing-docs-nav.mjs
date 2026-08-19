// One-off: 5 categories (office, figma, freelancing, ui-ux, mongodb) have
// real content — 17 to 36 docs each — but were never given a nav_items row,
// so they were unreachable from any nav (flat or mega), only by typing the
// URL directly. Found while building the Docs mega-menu (2026-08-19): the
// grouping in lib/nav-megamenu.ts only ever sees children that already
// exist in nav_items.
//
// Same pattern as the prior add-*-nav.mjs scripts — direct insert, bypasses
// the app's revalidateNav() on purpose (CLAUDE.md's active ISR-quota
// constraint). Idempotent (checks by url first). Caller busts the local dev
// server's 'nav' cache tag afterward via POST /api/revalidate {tag:"nav"}
// against localhost only.
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = readFileSync('.env.local', 'utf8')
const get = (k) => env.match(new RegExp(`${k}=(.*)`))[1].trim()
const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'))

const DOCS_PARENT_ID = 'bc658b53-8adf-43ff-9d57-df7d0c70ce9c'

const NEW_ITEMS = [
  { label: 'Office Skills', label_bn: 'অফিস স্কিলস', url: '/office' },
  { label: 'Figma', label_bn: null, url: '/figma' },
  { label: 'UI/UX Design Principles', label_bn: 'UI/UX ডিজাইন নীতি', url: '/ui-ux' },
  { label: 'MongoDB', label_bn: null, url: '/mongodb' },
  { label: 'Freelancing & Client Work', label_bn: 'ফ্রিল্যান্সিং ও ক্লায়েন্ট ওয়ার্ক', url: '/freelancing' },
]

const { data: siblings, error: countErr } = await supabase
  .from('nav_items').select('sort_order').eq('parent_id', DOCS_PARENT_ID).order('sort_order', { ascending: false }).limit(1)
if (countErr) throw countErr
let nextOrder = (siblings[0]?.sort_order ?? 0) + 1

for (const item of NEW_ITEMS) {
  const { data: existing } = await supabase.from('nav_items').select('id').eq('url', item.url).maybeSingle()
  if (existing) {
    console.log(`Skipped "${item.label}" — nav_items row already exists (${existing.id}).`)
    continue
  }
  const { error } = await supabase.from('nav_items').insert({
    label: item.label,
    label_bn: item.label_bn,
    url: item.url,
    parent_id: DOCS_PARENT_ID,
    sort_order: nextOrder,
  })
  if (error) throw error
  console.log(`Inserted "${item.label}" under Docs, sort_order ${nextOrder}.`)
  nextOrder++
}
