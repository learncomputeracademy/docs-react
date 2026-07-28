import type { Locale } from './types'

// Same convention as the other /tools demos: West Bengal / Indian Bengali,
// CSS syntax and property/value keywords stay English inside Bengali text.
export const SPECIFICITY_STRINGS = {
  en: {
    title: 'CSS Specificity Calculator',
    subtitle:
      'Paste a selector and see exactly which parts count, coloured by tier — or compare two selectors and find out which one actually wins.',
    lessonCta: 'Read the specificity lesson',

    mode: 'Mode',
    modeCalculate: 'Calculate',
    modeCompare: 'Compare',

    inputLabel: 'Selector (or a comma-separated list)',
    inputPlaceholder: 'header .nav > ul li.active a:hover::after',
    inputHint: 'Paste a full rule (selector { … }) and everything from the { onward is ignored automatically.',

    compareA: 'Selector A',
    compareB: 'Selector B',
    winner: 'Winner',
    winnerA: 'A wins',
    winnerB: 'B wins',
    tie: 'Tie — whichever rule appears later in the stylesheet wins',
    decidedBy: 'Decided by the {tier} column: {x} vs {y}.',

    tierId: 'ID',
    tierClass: 'Class, attribute, pseudo-class',
    tierType: 'Type, pseudo-element',
    tierIdDesc: '#id selectors. Worth more than any number of classes.',
    tierClassDesc: '.class, [attribute], and pseudo-classes like :hover, :not(), :nth-child(). Worth more than any number of type selectors.',
    tierTypeDesc: 'Element type selectors (div, a, p, …) and pseudo-elements (::before, ::after, ::first-line).',

    howCompared: 'How the three numbers are compared',
    howComparedDesc:
      'Specificity is never added up into one number — (0, 5, 0) beats (0, 0, 100) every time. Compare the first number; if it\'s tied, compare the second; only if that\'s also tied does the third number matter.',

    specialCases: 'The parts most calculators get wrong',
    notIsHas: ':not(), :is(), :has()',
    notIsHasDesc: 'These don\'t add their own weight — the whole pseudo-class is replaced by the specificity of its most specific argument. :is(#a, .b) scores exactly like #a alone; the .b branch is simply ignored for scoring.',
    whereZero: ':where()',
    whereZeroDesc: 'Always contributes zero, even with an ID inside — :where(#a) scores (0, 0, 0). It exists specifically for writing selectors that never fight the cascade.',
    combinatorsZero: 'Combinators',
    combinatorsZeroDesc: 'Descendant ( ), child (>), sibling (+, ~) combinators and the universal selector (*) contribute nothing on their own — only the simple selectors on either side of them count.',
    beyondSpecificity: 'Outside specificity entirely',
    beyondSpecificityDesc: 'An inline style="…" attribute and !important both override specificity completely rather than out-scoring it — a single-class rule marked !important beats every un-marked ID selector on the page, however high its (a, b, c) is.',

    examples: 'Try these',
    example1: 'ID vs classes',
    example2: ':is() picks the strongest branch',
    example3: ':where() is always zero',
    example4: 'Combinators don\'t count',
    example5: 'Pseudo-element',

    hoverHint: 'Hover or tap a tier in the legend to see what counts toward it.',
    parseEmpty: 'Paste a selector to see its specificity.',
  },
  bn: {
    title: 'CSS স্পেসিফিসিটি ক্যালকুলেটর',
    subtitle:
      'একটি সিলেক্টর পেস্ট করুন আর দেখুন ঠিক কোন অংশগুলো গণনায় ধরা হচ্ছে, স্তর অনুযায়ী রং-কোডেড — অথবা দুটো সিলেক্টর তুলনা করে দেখুন আসলে কোনটা জেতে।',
    lessonCta: 'স্পেসিফিসিটি পাঠটি পড়ুন',

    mode: 'মোড',
    modeCalculate: 'গণনা করুন',
    modeCompare: 'তুলনা করুন',

    inputLabel: 'সিলেক্টর (অথবা কমা-দেওয়া তালিকা)',
    inputPlaceholder: 'header .nav > ul li.active a:hover::after',
    inputHint: 'পুরো একটি রুল পেস্ট করলেও (selector { … }) { থেকে যা কিছু আছে স্বয়ংক্রিয়ভাবে বাদ যাবে।',

    compareA: 'সিলেক্টর A',
    compareB: 'সিলেক্টর B',
    winner: 'বিজয়ী',
    winnerA: 'A জিতেছে',
    winnerB: 'B জিতেছে',
    tie: 'টাই — স্টাইলশিটে যে রুলটি পরে আসে সেটাই জিতবে',
    decidedBy: '{tier} কলাম দিয়ে নির্ধারিত: {x} বনাম {y}।',

    tierId: 'ID',
    tierClass: 'ক্লাস, অ্যাট্রিবিউট, সিউডো-ক্লাস',
    tierType: 'টাইপ, সিউডো-এলিমেন্ট',
    tierIdDesc: '#id সিলেক্টর। যেকোনো সংখ্যক ক্লাসের চেয়ে বেশি মূল্যবান।',
    tierClassDesc: '.class, [attribute], আর :hover, :not(), :nth-child()-এর মতো সিউডো-ক্লাস। যেকোনো সংখ্যক টাইপ সিলেক্টরের চেয়ে বেশি মূল্যবান।',
    tierTypeDesc: 'এলিমেন্ট টাইপ সিলেক্টর (div, a, p, …) আর সিউডো-এলিমেন্ট (::before, ::after, ::first-line)।',

    howCompared: 'তিনটি সংখ্যা কীভাবে তুলনা হয়',
    howComparedDesc:
      'স্পেসিফিসিটি কখনো যোগ করে একটি সংখ্যায় পরিণত হয় না — (0, 5, 0) সবসময় (0, 0, 100)-কে হারায়। প্রথম সংখ্যাটি তুলনা করুন; সমান হলে দ্বিতীয়টি; সেটাও সমান হলে তবেই তৃতীয় সংখ্যাটি গুরুত্বপূর্ণ হয়।',

    specialCases: 'যে অংশগুলোতে বেশিরভাগ ক্যালকুলেটর ভুল করে',
    notIsHas: ':not(), :is(), :has()',
    notIsHasDesc: 'এগুলো নিজের কোনো ওজন যোগ করে না — পুরো সিউডো-ক্লাসটি তার সবচেয়ে specific আর্গুমেন্টের স্পেসিফিসিটি দিয়ে প্রতিস্থাপিত হয়। :is(#a, .b) ঠিক #a-এর মতোই স্কোর করে; .b শাখাটি স্কোরিংয়ের জন্য সম্পূর্ণ উপেক্ষিত হয়।',
    whereZero: ':where()',
    whereZeroDesc: 'সবসময় শূন্য অবদান রাখে, ভিতরে ID থাকলেও — :where(#a)-এর স্কোর (0, 0, 0)। এটি বিশেষভাবে এমন সিলেক্টর লেখার জন্য তৈরি যা কখনো cascade-এর সাথে লড়াই করে না।',
    combinatorsZero: 'কম্বিনেটর',
    combinatorsZeroDesc: 'Descendant ( ), child (>), sibling (+, ~) কম্বিনেটর আর universal সিলেক্টর (*) নিজে থেকে কিছুই যোগ করে না — শুধু এদের দুই পাশের সাধারণ সিলেক্টরগুলোই গণনায় ধরা হয়।',
    beyondSpecificity: 'স্পেসিফিসিটির সম্পূর্ণ বাইরে',
    beyondSpecificityDesc: 'একটি ইনলাইন style="…" অ্যাট্রিবিউট আর !important দুটোই স্পেসিফিসিটিকে বেশি স্কোর করে হারায় না, সম্পূর্ণ override করে — !important চিহ্নিত একটি এক-ক্লাসের রুল পাতার যেকোনো আন-মার্কড ID সিলেক্টরকে হারিয়ে দেয়, তার (a, b, c) যত বেশিই হোক না কেন।',

    examples: 'এগুলো চেষ্টা করুন',
    example1: 'ID বনাম ক্লাস',
    example2: ':is() সবচেয়ে শক্তিশালী শাখা বেছে নেয়',
    example3: ':where() সবসময় শূন্য',
    example4: 'কম্বিনেটর গণনায় ধরা হয় না',
    example5: 'সিউডো-এলিমেন্ট',

    hoverHint: 'কোন স্তরে কী গণনা হয় দেখতে লেজেন্ডের উপর মাউস রাখুন বা ট্যাপ করুন।',
    parseEmpty: 'স্পেসিফিসিটি দেখতে একটি সিলেক্টর পেস্ট করুন।',
  },
} as const

export function spis(locale: Locale) {
  return SPECIFICITY_STRINGS[locale]
}
