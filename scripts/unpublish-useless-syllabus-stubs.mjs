#!/usr/bin/env node
// Unpublishes 3 leftover "syllabus" stub pages found while auditing content
// 2026-09-03 — user asked "what is the use of this chapter
// http://localhost:3000/css/syllabus, if its useless remove it, also find
// if similar chapters are there in other subjects too". Checked all 5
// `syllabus`-slugged docs across the site:
//   - css/syllabus       — 2 blocks, literally just a heading + one sentence
//                          pointing to /css/intro. Useless.
//   - html/syllabus      — 3 blocks, a "file/folder structure" heading with
//                          no actual structure shown, sits at sort_order 1
//                          (top of the HTML sidebar). Useless.
//   - javascript/syllabus — 45 blocks, but it's the exact "Chapter 1,
//                          Chapter 2..." dead table-of-contents pattern
//                          D-63 already flagged and unpublished for
//                          react/syllabus — no links to real lessons, out
//                          of sync with the real lesson structure, sits at
//                          sort_order 1. Useless, same reason as react's.
//   - photoshop/syllabus — 9 blocks, genuinely real content (Photoshop use
//                          cases + Windows/Mac system requirements) —
//                          misleadingly named "Syllabus" but NOT useless.
//                          Left alone; a rename is a separate, smaller task
//                          if wanted later.
//   - react/syllabus     — already unpublished per D-63 (2026-07-30), no
//                          action needed here.
//
// Verified before running: no other doc's blocks link to any of the 3
// targets, and no nav_items row references them either — safe to remove
// with no dead links left behind.
//
// Unpublish (status: 'draft'), not delete — same reasoning as D-63:
// docs_delete_restore_guard (D-37) requires auth.uid(), which a
// service-role script never has, so a hard-delete from here is blocked.
// Unpublishing has the identical practical effect on the live site (public
// reads require status = 'published') and is not blocked by that trigger.
// Hard-delete via /admin is still the correct final step, just not
// something this script can do itself.
//
// Usage: node scripts/unpublish-useless-syllabus-stubs.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')
const TARGETS = ['css/syllabus', 'html/syllabus', 'javascript/syllabus']

for (const path of TARGETS) {
  const { data: doc, error } = await supabase.from('docs').select('id,status').eq('path', path).single()
  if (error || !doc) { console.error(`✗ ${path} — not found:`, error?.message); continue }
  if (doc.status === 'draft') { console.log(`  = ${path} — already unpublished`); continue }

  if (DRY_RUN) { console.log(`  [dry-run] would unpublish ${path} (id ${doc.id})`); continue }

  const { error: updErr } = await supabase.from('docs').update({ status: 'draft' }).eq('id', doc.id)
  if (updErr) { console.error(`✗ ${path} — failed:`, updErr.message); continue }
  console.log(`  ✓ ${path} — unpublished`)
}

console.log(DRY_RUN ? '\n[dry-run] no writes made.' : '\n✅ Done.')
