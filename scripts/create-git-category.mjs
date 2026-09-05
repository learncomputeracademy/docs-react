#!/usr/bin/env node
// One-time: creates the "git" category row (Git & GitHub, plus other
// version control systems) — user request 2026-09-03, placed in the
// "Start Here" sidebar group per earlier discussion (Git is a fundamental
// tool needed regardless of which language track a student picks next,
// same reasoning as why `programming` sits in Start Here rather than under
// a language). Content itself is written by scripts/create-git-content.mjs.
// Idempotent — safe to re-run.
import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const row = {
  slug: 'git',
  title: 'Git & GitHub',
  title_bn: 'Git ও GitHub',
  description: 'Version control from the ground up — Git fundamentals, branching and merging, GitHub collaboration (forks, pull requests, issues), and a look at other version control tools.',
  sort_order: 25,
}

const { data: existing } = await supabase.from('categories').select('id').eq('slug', 'git').maybeSingle()
if (existing) {
  console.log('Category "git" already exists:', existing.id)
  process.exit(0)
}
const { data, error } = await supabase.from('categories').insert(row).select().single()
if (error) { console.error(error); process.exit(1) }
console.log('Created category:', data)
