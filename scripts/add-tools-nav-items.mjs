#!/usr/bin/env node
// Adds the 5 newly-shipped tools to the "Tools" nav submenu (nav_items),
// same pattern as D-79's CSS Units Converter nav addition — a direct
// service-role script write, not an admin-panel-only action.
// Usage: node scripts/add-tools-nav-items.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const DRY_RUN = process.argv.includes('--dry-run')
const TOOLS_PARENT_ID = 'dde48d15-effc-4299-8555-c93447cbecf4'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const items = [
  { label: 'SERP Snippet Previewer', label_bn: 'SERP Snippet প্রিভিউয়ার', url: '/tools/serp-preview', sort_order: 23 },
  { label: 'WP Template Hierarchy Visualizer', label_bn: 'WP Template Hierarchy ভিজুয়ালাইজার', url: '/tools/wp-template-hierarchy', sort_order: 24 },
  { label: 'WordPress Hooks Timeline', label_bn: 'WordPress Hooks টাইমলাইন', url: '/tools/wp-hooks-timeline', sort_order: 25 },
  { label: 'WP_Query Args Builder', label_bn: 'WP_Query Args বিল্ডার', url: '/tools/wp-query-builder', sort_order: 26 },
  { label: 'Enqueue Snippet Generator', label_bn: 'Enqueue Snippet জেনারেটর', url: '/tools/wp-enqueue-generator', sort_order: 27 },
]

async function main() {
  for (const item of items) {
    const { data: existing } = await supabase.from('nav_items').select('id').eq('url', item.url).maybeSingle()
    if (existing) { console.log(`  = ${item.url} — already in nav, skipped`); continue }

    if (DRY_RUN) { console.log(`  [dry-run] would insert: ${item.label} -> ${item.url} (sort_order ${item.sort_order})`); continue }

    const { error } = await supabase.from('nav_items').insert({ ...item, parent_id: TOOLS_PARENT_ID })
    if (error) { console.error(`✗ ${item.url}:`, error.message); continue }
    console.log(`  ✓ ${item.label} -> ${item.url}`)
  }
  console.log(DRY_RUN ? '\n[dry-run] no writes made.' : '\n✅ Done.')
}

main().catch(err => { console.error(err); process.exit(1) })
