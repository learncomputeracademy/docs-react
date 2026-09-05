#!/usr/bin/env node
// One-time: creates the "cybersecurity" category row. Content itself is
// written by scripts/create-cybersecurity-content.mjs. Idempotent — safe to
// re-run. See D-108 in docs/DECISIONS.md for the full plan.
import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const row = {
  slug: 'cybersecurity',
  title: 'Cybersecurity',
  title_bn: 'সাইবার সিকিউরিটি',
  description: 'Practical, everyday cybersecurity — threats, passwords, 2FA, safe browsing, email, mobile, Wi-Fi/VPNs, backups, privacy, and what to do when something goes wrong, plus the command-line basics behind it.',
  sort_order: 24,
}

const { data: existing } = await supabase.from('categories').select('id').eq('slug', 'cybersecurity').maybeSingle()
if (existing) {
  console.log('Category "cybersecurity" already exists:', existing.id)
  process.exit(0)
}
const { data, error } = await supabase.from('categories').insert(row).select().single()
if (error) { console.error(error); process.exit(1) }
console.log('Created category:', data)
