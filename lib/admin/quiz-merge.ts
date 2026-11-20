import type { QuizQuestion } from '@/lib/types'

// Bengali quiz = English structure + Bengali text. Question ids, option
// count and the correct answer always come from English, so a translation
// can never change which answer is right. A question English no longer has
// is dropped; one English added since stays English until translated; an
// empty Bengali field falls back to English rather than rendering blank.
export function mergeQuizTranslation(en: QuizQuestion[], bn: QuizQuestion[]): QuizQuestion[] {
  const bnById = new Map(bn.map((q) => [q.id, q]))
  return en.map((eq) => {
    const bq = bnById.get(eq.id)
    if (!bq) return eq
    return {
      id: eq.id,
      prompt: bq.prompt || eq.prompt,
      options: eq.options.map((o, i) => bq.options[i] || o),
      answer: eq.answer,
      explain: eq.explain ? bq.explain || eq.explain : undefined,
    }
  })
}
