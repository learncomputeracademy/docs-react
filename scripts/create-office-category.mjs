#!/usr/bin/env node
// One-time: creates the "office" category row. Content itself is written by
// scripts/create-office-skills-content.mjs. Idempotent — safe to re-run.
import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const row = {
  slug: 'office',
  title: 'Office Skills',
  title_bn: 'অফিস স্কিলস',
  description: 'MS Paint, Word, Excel, and PowerPoint from the ground up — plus where LibreOffice and Google\'s free alternatives fit in.',
  sort_order: 19,
}

const { data: existing } = await supabase.from('categories').select('id').eq('slug', 'office').maybeSingle()
if (existing) {
  console.log('Category "office" already exists:', existing.id)
  process.exit(0)
}
const { data, error } = await supabase.from('categories').insert(row).select().single()
if (error) { console.error(error); process.exit(1) }
console.log('Created category:', data)
