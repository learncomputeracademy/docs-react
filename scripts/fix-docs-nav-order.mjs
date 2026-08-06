// One-off: dedupe the "Docs" dropdown's WordPress row and reorder its
// children to the sequence the user specified. Data-only — nav_items is
// hand-maintained, not derived from categories, and this table's ISR tag
// ('nav') means the change is live without a redeploy.
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = readFileSync('.env.local', 'utf8')
const get = (k) => env.match(new RegExp(`${k}=(.*)`))[1].trim()
const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'))

// Older duplicate WordPress row — no Bengali label, superseded by the
// 2026-08-05 row (20596b15…) added alongside the other new categories.
const DUPLICATE_WORDPRESS_ID = '4a4501a1-2808-4c2c-b88c-29c42ecc02c8'

const ORDER = [
  'a2f704ae-3625-494e-a1cc-2fed02a25207', // Computer Basics
  '93edd7a8-351f-47b0-a76b-1d6c0a3b55fd', // Graphic Design
  'ed899048-5916-4096-9ce3-5629eda288cc', // Photoshop
  '61f59d5c-90dd-43a9-ac07-c80df937376e', // Intro to Programming
  'cfdc135a-f34d-4c2f-9658-a9a03ebb9092', // HTML
  'f9afa78c-d7c4-4a10-a375-5b74d22161e3', // CSS
  '42fccfe9-a051-47d7-a787-8442dc5ed6ac', // JavaScript
  'a7bf8fa5-4061-43f9-b59c-2b6d478dff41', // React
  '10dd5529-bdf7-43b0-a007-e6bfd8d611ca', // PHP
  '455754aa-6961-432e-bb75-5d849bbe90ec', // SQL
  '20596b15-5a5c-4c03-891b-b9b96ccabcbf', // WordPress (kept)
  '02532cae-b898-4011-bb80-eb8aa2d422e8', // Python
  'a7b58466-24da-4a81-b038-1120e5a1f562', // Artificial Intelligence
  'a38e2e32-7d6c-4c6a-b40f-abe2a3b80129', // Node JS
  '922fcd53-d3ea-49c5-b294-b3ed26f8b22b', // Hosting & Deployment
  'bd9610fc-018e-412a-b663-e8a1c41b1150', // Digital Marketing
  'c30ab48d-717c-47d2-a80a-33a0f13bbc66', // SEO
  'bec31362-9437-44c7-87c8-071d333f2e43', // Career Skills
]

const { error: delError } = await supabase.from('nav_items').delete().eq('id', DUPLICATE_WORDPRESS_ID)
if (delError) throw delError
console.log('Deleted duplicate WordPress row', DUPLICATE_WORDPRESS_ID)

for (let i = 0; i < ORDER.length; i++) {
  const { error } = await supabase.from('nav_items').update({ sort_order: i + 1 }).eq('id', ORDER[i])
  if (error) throw error
}
console.log(`Reordered ${ORDER.length} Docs children.`)
