import { createHighlighter, type BundledLanguage, type Highlighter } from 'shiki'

let highlighter: Promise<Highlighter> | null = null

export const LANGS = ['html', 'css', 'javascript', 'jsx', 'tsx', 'typescript', 'bash', 'json', 'sql', 'python', 'php', 'text']

function getHighlighter() {
  highlighter ??= createHighlighter({ themes: ['ayu-light', 'dracula'], langs: LANGS })
  return highlighter
}

export async function highlight(code: string, lang: string) {
  const h = await getHighlighter()
  const known = LANGS.includes(lang) ? lang : 'text'
  return h.codeToHtml(code, { lang: known, themes: { light: 'ayu-light', dark: 'dracula' } })
}

// Token form for the homepage code window, which types snippets out character
// by character (components/magic/animated-code.tsx). Same markup as
// codeToHtml (shiki-themes classes, --shiki-dark vars) so `.dark .shiki` applies.
export type CodeTokens = { pre: string; lines: { content: string; style: string }[][] }

export async function tokenize(code: string, lang: string): Promise<CodeTokens> {
  const h = await getHighlighter()
  const r = h.codeToTokens(code, { lang: (LANGS.includes(lang) ? lang : 'text') as BundledLanguage, themes: { light: 'ayu-light', dark: 'dracula' } })
  const styleOf = (s?: Record<string, string>) => Object.entries(s ?? {}).map(([k, v]) => `${k}:${v}`).join(';')
  return {
    pre: `<pre class="shiki shiki-themes ayu-light dracula" style="background-color:${r.bg};color:${r.fg};${r.rootStyle || ''}">`,
    lines: r.tokens.map((line) => line.map((t) => ({ content: t.content, style: styleOf(t.htmlStyle) || `color:${t.color}` }))),
  }
}
