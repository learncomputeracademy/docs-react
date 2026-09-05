// One-off: add "Units Converter" to the Tools submenu, last position (D-79/O-29).
// Direct insert, bypasses the app's revalidateNav() on purpose — CLAUDE.md's
// active ISR-quota constraint says not to trigger the revalidateTag/
// revalidatePath webhook right now. Shows immediately in local dev (no ISR
// caching there); production nav stays as cached until quota clears and
// someone hits /api/revalidate for the 'nav' tag, or any other nav edit does.
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = readFileSync('.env.local', 'utf8')
const get = (k) => env.match(new RegExp(`${k}=(.*)`))[1].trim()
const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'))

const TOOLS_PARENT_ID = 'dde48d15-effc-4299-8555-c93447cbecf4'

const { error } = await supabase.from('nav_items').insert({
  label: 'Units Converter',
  label_bn: 'Units কনভার্টার',
  url: '/tools/units',
  parent_id: TOOLS_PARENT_ID,
  sort_order: 10,
})
if (error) throw error
console.log('Inserted "Units Converter" under Tools, sort_order 10.')
