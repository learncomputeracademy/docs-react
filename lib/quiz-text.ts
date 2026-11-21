// Quiz text is stored as HTML (<code>, <pre><code>), but typing &lt;p&gt; in
// the admin editor is painful. The editor shows and accepts backticks instead:
//   `<p>`            ↔ <code>&lt;p&gt;</code>
//   ```<p>Hi</p>```  ↔ <pre><code>&lt;p&gt;Hi&lt;/p&gt;</code></pre>
// Text outside backticks is kept as-is (so <em>/<strong> still work).
// Checked by scripts/check-quiz.mjs.

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const unesc = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')

export function htmlToEditable(html: string): string {
  return html
    .replace(/<pre><code(?: class="language-\w+")?>([\s\S]*?)<\/code><\/pre>/g, (_, c) => '```' + unesc(c) + '```')
    .replace(/<code(?: class="language-\w+")?>([\s\S]*?)<\/code>/g, (_, c) => '`' + unesc(c) + '`')
}

export function editableToHtml(text: string): string {
  // Split out ``` samples first, so backticks inside them (JS template
  // literals) are never read as inline-code markers.
  return text
    .split(/(```\n?[\s\S]*?\n?```)/)
    .map((part) => {
      const block = part.match(/^```\n?([\s\S]*?)\n?```$/)
      if (block) return `<pre><code>${esc(block[1])}</code></pre>`
      return part.replace(/`([^`\n]+)`/g, (_, c) => `<code>${esc(c)}</code>`)
    })
    .join('')
}
