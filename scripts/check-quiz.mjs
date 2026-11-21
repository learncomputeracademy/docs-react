// Self-check for quiz save rules. Run: node scripts/check-quiz.mjs (Node 22.6+ strips TS types).
import assert from 'node:assert/strict'
import { mergeQuizTranslation as merge } from '../lib/admin/quiz-merge.ts'
import { sanitizeBlock } from '../lib/admin/sanitize.ts'

const en = [
  { id: 'a', prompt: 'Largest heading?', options: ['h6', 'h1', 'head'], answer: 1, explain: 'h1 is biggest' },
  { id: 'b', prompt: 'alt is optional?', options: ['True', 'False'], answer: 1 },
]

// Bengali text kept; answer forced back to English's even if bn tried to change it.
let out = merge(en, [{ id: 'a', prompt: 'সবচেয়ে বড়?', options: ['h6', 'h1', 'হেড', 'extra'], answer: 0, explain: '' }])
assert.equal(out[0].prompt, 'সবচেয়ে বড়?')
assert.equal(out[0].answer, 1, 'answer locked to English')
assert.deepEqual(out[0].options, ['h6', 'h1', 'হেড'], 'option count locked to English')
assert.equal(out[0].explain, 'h1 is biggest', 'empty bn explain falls back to English')
assert.deepEqual(out[1], en[1], 'untranslated question stays English')
assert.equal(merge(en, [{ id: 'gone', prompt: 'x', options: ['a', 'b'], answer: 0 }]).length, 2, 'orphan bn question dropped')

// Sanitizer: strips scripts, keeps <pre><code>, validates answers.
const q = (over) => ({ id: 'z', type: 'quiz', questions: [{ id: 'q', prompt: 'p', options: ['a', 'b'], answer: 0, ...over }] })
const s = sanitizeBlock(q({ prompt: 'x<script>alert(1)</script><pre><code>&lt;p&gt;</code></pre>' }))
assert.equal(s.questions[0].prompt, 'x<pre><code>&lt;p&gt;</code></pre>')
assert.throws(() => sanitizeBlock(q({ answer: 2 })), /correct answer/)
assert.throws(() => sanitizeBlock(q({ options: ['only'] })), /at least 2/)

console.log('quiz: all checks passed')

// Editor text format round-trip (lib/quiz-text.ts).
const { htmlToEditable: toText, editableToHtml: toHtml } = await import('../lib/quiz-text.ts')
for (const html of [
  'Which is a correct comment? <code>&lt;!-- x --&gt;</code>',
  'What shows?<pre><code>&lt;p&gt;Hi&lt;/p&gt;\n&lt;!-- &lt;p&gt;Bye&lt;/p&gt; --&gt;</code></pre>',
  'Plain <em>text</em> &amp; more',
  '<code>a &amp;&amp; b</code>',
  'What logs?<pre><code>console.log(`Hello, ${name}!`)</code></pre> and <code>x</code>',
])assert.equal(toHtml(toText(html)), html, `round-trip: ${html}`)
assert.equal(toText('<code>&lt;p&gt;</code>'), '`<p>`')
assert.equal(toHtml('Use `<br>` here'), 'Use <code>&lt;br&gt;</code> here')
console.log('quiz editor text: all checks passed')
