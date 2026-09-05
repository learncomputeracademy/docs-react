// Structured Lessons track — a standard progressive typing curriculum shape
// (home row -> top row -> bottom row -> capitals -> punctuation -> numbers
// -> full sentences), the same order typing courses have used for decades.
// Text is hand-authored drill text, not randomly generated — a lesson has
// to be reproducible and actually target the keys it claims to, which a
// random word-pool pick can't guarantee.

export type Lesson = { id: string; title: string; titleBn: string; text: string }

export const LESSONS: Lesson[] = [
  {
    id: 'home-row',
    title: 'Home Row Basics',
    titleBn: 'Home Row Basics',
    text: 'asdf jkl; asdf jkl; ff jj dd kk ss ll aa ;; fj dk sl a; asdf jkl; fdsa ;lkj asdf jkl; fj fj dk dk sl sl a; a;',
  },
  {
    id: 'home-row-words',
    title: 'Home Row Words',
    titleBn: 'Home Row Words',
    text: 'a sad lad has all salad flask half glass ask fall shall flash gash hash small stall as glad had ask a lass',
  },
  {
    id: 'top-row',
    title: 'Top Row',
    titleBn: 'Top Row',
    text: 'qwer tyui op qwer tyui op qq ww ee rr tt yy uu ii oo pp qw er ty ui op qwer tyui op quiet type youtwo',
  },
  {
    id: 'top-home-words',
    title: 'Top + Home Row Words',
    titleBn: 'Top + Home Row Words',
    text: 'quiet were tie your out put type ripe hate torque top rate write yet quote were true type gate house wait',
  },
  {
    id: 'bottom-row',
    title: 'Bottom Row',
    titleBn: 'Bottom Row',
    text: 'zxcv bnm zxcv bnm zz xx cc vv bb nn mm z x c v b n m zoom mixnvc vanbox count bunny nozzle vixen',
  },
  {
    id: 'full-alphabet',
    title: 'Full Lowercase Alphabet',
    titleBn: 'Full Lowercase Alphabet',
    text: 'the quick brown fox jumps over the lazy dog pack my box with five dozen liquor jugs just keep vexing',
  },
  {
    id: 'capitals',
    title: 'Capital Letters',
    titleBn: 'Capital Letters',
    text: 'Alice went to Paris in June. Then Bob and Carol flew to Tokyo. Finally David stayed home in Ohio.',
  },
  {
    id: 'punctuation',
    title: 'Common Punctuation',
    titleBn: 'Common Punctuation',
    text: 'Wait, is this ready? Yes, it is! "Great," she said, "let\'s go." He wasn\'t sure; she wasn\'t either.',
  },
  {
    id: 'numbers',
    title: 'Numbers Row',
    titleBn: 'Numbers Row',
    text: 'In 2024 we sold 350 units for $1,200 each, a 15% increase over 2023, across 8 stores and 42 cities.',
  },
  {
    id: 'full-sentences',
    title: 'Full Sentences',
    titleBn: 'Full Sentences',
    text: 'Typing well is a skill that rewards patience over speed. Small, steady practice beats one long rushed session every time.',
  },
]

export function lessonIndex(id: string): number {
  return LESSONS.findIndex((l) => l.id === id)
}
