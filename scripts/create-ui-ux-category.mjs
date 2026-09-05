#!/usr/bin/env node
// New "UI/UX Design Principles" category — digital product design process
// (usability, interaction design, wireframing/prototyping, design systems,
// accessibility), distinct from the existing `design` category which is
// print/graphic design fundamentals (color theory, typography, vector/raster,
// brochure/flyer/poster exercises). Scoped with the user 2026-08-18.
//
// Usage: node scripts/create-ui-ux-category.mjs

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const row = {
  slug: 'ui-ux',
  title: 'UI/UX Design Principles',
  title_bn: 'UI/UX ডিজাইন নীতিমালা',
  description: 'The digital product design process — usability heuristics, interaction design, user research, wireframing and prototyping, design systems, and accessibility.',
  sort_order: 22,
}

const { data: existing } = await supabase.from('categories').select('id').eq('slug', row.slug).maybeSingle()
if (existing) {
  const { error } = await supabase.from('categories').update(row).eq('id', existing.id)
  if (error) { console.error('Update failed:', error.message); process.exit(1) }
  console.log(`Updated category "${row.slug}" — id ${existing.id}`)
} else {
  const { data, error } = await supabase.from('categories').insert(row).select('id').single()
  if (error) { console.error('Insert failed:', error.message); process.exit(1) }
  console.log(`Created category "${row.slug}" — id ${data.id}`)
}
