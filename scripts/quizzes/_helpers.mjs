// Shared helpers for scripts/quizzes/<category>.mjs data files.
export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
export const c = (s) => `<code>${esc(s)}</code>` // inline code
export const pre = (s) => `<pre><code>${esc(s)}</code></pre>` // code sample in a question

// q(enPrompt, bnPrompt, options, answerIndex, enExplain, bnExplain)
// options: string (same in both languages, e.g. code) or [en, bn]
export const q = (en, bn, options, answer, exEn, exBn) => ({ en, bn, options, answer, exEn, exBn })
export const TF = [['True', 'সত্য'], ['False', 'মিথ্যা']]
