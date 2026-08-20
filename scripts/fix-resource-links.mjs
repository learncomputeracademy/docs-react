#!/usr/bin/env node
// scripts/fix-resource-links.mjs
// One-off, hand-reviewed corrections from scripts/audit-resource-links.mjs's
// dry-run report (2026-08-20). That script's blanket "cross-domain redirect
// = suspicious" heuristic (correct for the daily automated job, where it's
// just a review flag, never an auto-delete) produced false positives here:
// most of these "offsite redirects" are real rebrands/domain moves to a
// site that's still alive and on-topic, not link rot. Reviewed each one by
// hand (WebSearch to confirm genuine rebrands) rather than trusting the
// heuristic blindly:
//   - Freepik -> rebranded to Magnific (confirmed via WebSearch, April
//     2026) — also now a full AI creative platform, not just stock
//     images, so moved out of "Free Images" into a new "AI Tools" group.
//   - Iconfinder -> also redirects into magnific.com (same consolidation)
//     — relabeled, kept under Free Icons since it's still specifically an
//     icon search entry point.
//   - Landen -> rebranded to Umso (confirmed via WebSearch).
//   - Material Icons / Iconify for HTML / Burst / Swiper Slider -> plain
//     domain/subdomain moves, same brand, same content — URL only.
// Six genuinely dead (timeout/DNS failure/error status on the SAME
// domain, not a redirect) are deleted outright.
//
// Usage: node scripts/fix-resource-links.mjs [--dry-run]

import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const DRY_RUN = process.argv.includes('--dry-run')

async function loadEnv() {
  const text = await fs.readFile(new URL('../.env.local', import.meta.url), 'utf8')
  const env = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}

const DELETE_BY_NAME_URL = [
  ['Shadow Generator', 'https://www.cssmatic.com/box-shadow'],
  ['Triangle Generator', 'http://apps.eky.hk/css-triangle-generator/'],
  ['Gradient Generator', 'https://www.cssmatic.com/gradient-generator'],
  ['CSS Development', 'https://www.outpan.com/'],
  ['Image Hover', 'https://imagehover.io/'],
  ['1001 Fonts', 'https://www.1001fonts.com/'],
]

const UPDATE_BY_NAME_URL = [
  // [oldName, oldUrl, patch]
  ['Freepik', 'https://www.freepik.com/', { name: 'Magnific', url: 'https://www.magnific.com/', group_name: 'AI Tools' }],
  ['Iconfinder', 'https://www.iconfinder.com/', { name: 'Magnific Icons', url: 'https://www.magnific.com/icons' }],
  ['Landen', 'https://www.landen.co/', { name: 'Umso (formerly Landen)', url: 'https://www.umso.com/' }],
  ['Material Icons', 'https://zavoloklom.github.io/material-design-iconic-font/icons.html', { url: 'https://zavoloklom.dev/material-design-iconic-font/icons.html' }],
  ['Iconify for HTML', 'https://iconify.design/icon-sets/', { url: 'https://icon-sets.iconify.design/' }],
  ['Burst', 'https://burst.shopify.com/', { name: 'Shopify Burst', url: 'https://www.shopify.com/stock-photos' }],
  ['Swiper Slider', 'https://idangero.us/swiper/demos/', { url: 'https://swiperjs.com/' }],
]

async function main() {
  const env = await loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

  for (const [name, url] of DELETE_BY_NAME_URL) {
    if (DRY_RUN) {
      console.log(`Would delete: ${name} (${url})`)
      continue
    }
    const { error } = await supabase.from('resources').delete().eq('name', name).eq('url', url)
    if (error) console.error(`Delete failed for ${name}:`, error.message)
    else console.log(`Deleted: ${name}`)
  }

  for (const [name, url, patch] of UPDATE_BY_NAME_URL) {
    if (DRY_RUN) {
      console.log(`Would update: ${name} (${url}) ->`, patch)
      continue
    }
    const { error } = await supabase.from('resources').update(patch).eq('name', name).eq('url', url)
    if (error) console.error(`Update failed for ${name}:`, error.message)
    else console.log(`Updated: ${name} ->`, patch)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
