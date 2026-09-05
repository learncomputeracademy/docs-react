// One-off: the Lorem Ipsum Generator's route was renamed /tools/lorem ->
// /tools/lorem-text (to read as a matched pair with the new Placeholder
// Image Generator, itself being renamed to /tools/lorem-image) — the
// nav_items row inserted by scripts/add-lorem-nav.mjs still points at the
// old URL and needs updating to match. Direct update, same
// bypasses-revalidateNav() reasoning as every add-*-nav.mjs script.
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = readFileSync('.env.local', 'utf8')
const get = (k) => env.match(new RegExp(`${k}=(.*)`))[1].trim()
const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'))

const { data, error } = await supabase
  .from('nav_items')
  .update({ url: '/tools/lorem-text' })
  .eq('url', '/tools/lorem')
  .select()
if (error) throw error
if (!data.length) throw new Error('No nav_items row had url=/tools/lorem — nothing updated.')
console.log(`Updated nav_items row ${data[0].id}: url now /tools/lorem-text.`)
