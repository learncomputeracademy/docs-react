#!/usr/bin/env node
// One-time: creates the "figma" category row. Content itself is written by
// scripts/create-figma-content.mjs. Idempotent — safe to re-run.
import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const row = {
  slug: 'figma',
  title: 'Figma',
  title_bn: 'Figma',
  description: 'Interface design and prototyping in Figma — frames, the pen tool, Auto Layout, components, prototyping, and handing off to developers.',
  sort_order: 20,
}

const { data: existing } = await supabase.from('categories').select('id').eq('slug', 'figma').maybeSingle()
if (existing) {
  console.log('Category "figma" already exists:', existing.id)
  process.exit(0)
}
const { data, error } = await supabase.from('categories').insert(row).select().single()
if (error) { console.error(error); process.exit(1) }
console.log('Created category:', data)
