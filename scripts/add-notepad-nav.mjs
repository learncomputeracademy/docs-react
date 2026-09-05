// One-off: add "Notepad" to the Tools submenu, last position (D-94). Same
// pattern as the prior ten add-*-nav.mjs scripts — direct insert, bypasses
// the app's revalidateNav() on purpose (CLAUDE.md's active ISR-quota
// constraint). Caller busts the local dev server's 'nav' cache tag
// afterward via POST /api/revalidate {tag:"nav"} against localhost only.
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = readFileSync('.env.local', 'utf8')
const get = (k) => env.match(new RegExp(`${k}=(.*)`))[1].trim()
const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'))

const TOOLS_PARENT_ID = 'dde48d15-effc-4299-8555-c93447cbecf4'

const { data: siblings, error: countErr } = await supabase
  .from('nav_items').select('sort_order').eq('parent_id', TOOLS_PARENT_ID).order('sort_order', { ascending: false }).limit(1)
if (countErr) throw countErr
const nextOrder = (siblings[0]?.sort_order ?? 0) + 1

const { error } = await supabase.from('nav_items').insert({
  label: 'Notepad',
  label_bn: 'Notepad',
  url: '/tools/notepad',
  parent_id: TOOLS_PARENT_ID,
  sort_order: nextOrder,
})
if (error) throw error
console.log(`Inserted "Notepad" under Tools, sort_order ${nextOrder}.`)
