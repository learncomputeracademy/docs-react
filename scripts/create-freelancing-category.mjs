#!/usr/bin/env node
// One-time: creates the "freelancing" category row. Content itself is written by
// scripts/create-freelancing-content.mjs. Idempotent — safe to re-run.
import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const row = {
  slug: 'freelancing',
  title: 'Freelancing & Client Work',
  title_bn: 'ফ্রিল্যান্সিং ও ক্লায়েন্ট ওয়ার্ক',
  description: 'Getting hired on Fiverr, Upwork, and Freelancer, pricing and proposals, contracts and getting paid, and everything about working with real clients.',
  sort_order: 21,
}

const { data: existing } = await supabase.from('categories').select('id').eq('slug', 'freelancing').maybeSingle()
if (existing) {
  console.log('Category "freelancing" already exists:', existing.id)
  process.exit(0)
}
const { data, error } = await supabase.from('categories').insert(row).select().single()
if (error) { console.error(error); process.exit(1) }
console.log('Created category:', data)
