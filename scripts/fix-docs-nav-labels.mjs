// One-off: trim stray whitespace in Docs dropdown labels and normalize
// PHP's url to a bare /php (every other entry is a bare /slug; PHP alone
// pointed at /php/introduction, its first lesson, instead of the category
// page — confirmed /php exists as a category before making this change).
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const env = readFileSync('.env.local', 'utf8')
const get = (k) => env.match(new RegExp(`${k}=(.*)`))[1].trim()
const supabase = createClient(get('NEXT_PUBLIC_SUPABASE_URL'), get('SUPABASE_SERVICE_ROLE_KEY'))

const FIXES = [
  { id: 'cfdc135a-f34d-4c2f-9658-a9a03ebb9092', label_bn: 'এইচটিএমএল' }, // HTML
  { id: 'f9afa78c-d7c4-4a10-a375-5b74d22161e3', label: 'CSS' },
  { id: 'a7bf8fa5-4061-43f9-b59c-2b6d478dff41', label: 'React', label_bn: 'রিয়্যাক্ট' },
  { id: '10dd5529-bdf7-43b0-a007-e6bfd8d611ca', label_bn: 'PHP', url: '/php' },
  { id: '455754aa-6961-432e-bb75-5d849bbe90ec', label: 'SQL' },
  { id: '02532cae-b898-4011-bb80-eb8aa2d422e8', label: 'Python' },
]

for (const { id, ...patch } of FIXES) {
  const { error } = await supabase.from('nav_items').update(patch).eq('id', id)
  if (error) throw error
  console.log('Updated', id, patch)
}
