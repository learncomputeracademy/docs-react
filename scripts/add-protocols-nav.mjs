// One-off: add "Network Protocol Visualizer" to the Tools submenu, last
// position. Same pattern as the earlier add-*-nav.mjs scripts — direct
// insert, bypasses the app's revalidateNav(). Safe to re-run: it does
// nothing if a row for the URL already exists. Afterwards bust the 'nav'
// cache tag on whichever server should show it (POST /api/revalidate).
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = readFileSync('.env.local', 'utf8')
const get = (k) => env.match(new RegExp(`${k}=(.*)`))[1].trim()
const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'))

const TOOLS_PARENT_ID = 'dde48d15-effc-4299-8555-c93447cbecf4'
const URL = '/tools/protocols'

const { data: existing, error: findErr } = await supabase.from('nav_items').select('id, sort_order').eq('url', URL)
if (findErr) throw findErr
if (existing.length) {
  console.log(`Already present (${existing.length} row), nothing inserted.`)
  process.exit(0)
}

const { data: siblings, error: countErr } = await supabase
  .from('nav_items').select('sort_order').eq('parent_id', TOOLS_PARENT_ID).order('sort_order', { ascending: false }).limit(1)
if (countErr) throw countErr
const nextOrder = (siblings[0]?.sort_order ?? 0) + 1

const { error } = await supabase.from('nav_items').insert({
  label: 'Network Protocol Visualizer',
  label_bn: 'Network Protocol ভিজুয়ালাইজার',
  url: URL,
  parent_id: TOOLS_PARENT_ID,
  sort_order: nextOrder,
})
if (error) throw error
console.log(`Inserted "Network Protocol Visualizer" under Tools, sort_order ${nextOrder}.`)
