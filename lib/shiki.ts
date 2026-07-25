import { createHighlighter, type Highlighter } from 'shiki'

let highlighter: Promise<Highlighter> | null = null

const LANGS = ['html', 'css', 'javascript', 'jsx', 'tsx', 'typescript', 'bash', 'json', 'sql', 'python', 'text']

function getHighlighter() {
  highlighter ??= createHighlighter({ themes: ['github-light', 'github-dark'], langs: LANGS })
  return highlighter
}

export async function highlight(code: string, lang: string) {
  const h = await getHighlighter()
  const known = LANGS.includes(lang) ? lang : 'text'
  return h.codeToHtml(code, { lang: known, themes: { light: 'github-light', dark: 'github-dark' } })
}
