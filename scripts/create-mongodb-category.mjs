#!/usr/bin/env node
// One-time: creates the "mongodb" category row. Content itself is written by
// scripts/create-mongodb-content.mjs. Idempotent — safe to re-run.
import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const row = {
  slug: 'mongodb',
  title: 'MongoDB',
  title_bn: 'MongoDB',
  description: 'A document database course — collections and documents, CRUD, schema design, indexes, the aggregation pipeline, and using MongoDB from Node.js with the official driver and Mongoose.',
  sort_order: 23,
}

const { data: existing } = await supabase.from('categories').select('id').eq('slug', 'mongodb').maybeSingle()
if (existing) {
  console.log('Category "mongodb" already exists:', existing.id)
  process.exit(0)
}
const { data, error } = await supabase.from('categories').insert(row).select().single()
if (error) { console.error(error); process.exit(1) }
console.log('Created category:', data)
