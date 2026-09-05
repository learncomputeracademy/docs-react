#!/usr/bin/env node
// Adds "Typing Test" as a top-level nav item (parent_id: null), a standalone
// app — not under Tools or Docs, per the user's explicit ask. Appended after
// the last top-level item (Contact Us, sort_order 5) rather than inserted
// mid-list, to avoid any sort_order collision risk (same reasoning D-126
// already documented after a real bug from inserting mid-list elsewhere).
// Usage: node scripts/add-typing-test-nav-item.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const DRY_RUN = process.argv.includes('--dry-run')

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  const { data: existing } = await supabase.from('nav_items').select('id').eq('url', '/typing-test').maybeSingle()
  if (existing) { console.log('= already in nav, skipped'); return }

  const { data: topLevel } = await supabase.from('nav_items').select('sort_order').is('parent_id', null).order('sort_order', { ascending: false }).limit(1)
  const nextSort = (topLevel?.[0]?.sort_order ?? 0) + 1

  const item = { label: 'Typing Test', label_bn: 'Typing Test', url: '/typing-test', sort_order: nextSort, parent_id: null }

  if (DRY_RUN) { console.log(`[dry-run] would insert: ${item.label} -> ${item.url} (sort_order ${nextSort})`); return }

  const { error } = await supabase.from('nav_items').insert(item)
  if (error) { console.error('✗', error.message); process.exit(1) }
  console.log(`✓ Typing Test -> /typing-test (sort_order ${nextSort})`)
}

main().catch(err => { console.error(err); process.exit(1) })
