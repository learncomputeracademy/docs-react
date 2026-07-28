import type { Locale } from './types'

// Same convention as the other /tools demos: West Bengal / Indian Bengali,
// CSS property/value keywords stay English inside Bengali sentences.
export const SCROLLBAR_STRINGS = {
  en: {
    title: 'CSS Scrollbar Styler',
    subtitle:
      'Style every part of a scrollbar — track, thumb, corner, buttons — and see it rendered by the actual browser engine, not a mockup. Two systems, two different sets of browsers: the honest support note below explains which is which.',
    lessonCta: 'Read the pseudo-elements lesson',

    supportNoteTitle: 'Two systems that don’t talk to each other',
    supportNote:
      '`scrollbar-width` and `scrollbar-color` are the standard: Firefox has supported them for years, and Chromium-based browsers (Chrome, Edge, Opera) added them more recently. Safari supports neither. `::-webkit-scrollbar` and its parts are WebKit/Blink-only — Chrome, Edge, Opera and Safari all honour them; Firefox ignores every rule below completely. Ship both, like this tool generates, if you want it to look intentional everywhere — a scrollbar you didn’t style is perfectly fine on the browser you didn’t style it for.',

    standardSection: 'Standard (scrollbar-width / scrollbar-color)',
    scrollbarWidth: 'scrollbar-width',
    widthAuto: 'auto', widthThin: 'thin', widthNone: 'none',
    scrollbarWidthDesc: 'The standard keyword for overall thickness. `none` removes the scrollbar entirely — the element is still scrollable by wheel, touch or keyboard, just with nothing to grab.',

    webkitSection: '::-webkit-scrollbar',
    size: 'width / height',
    sizeDesc: 'The webkit scrollbar’s thickness in pixels — used for the vertical scrollbar’s width and the horizontal one’s height at the same time.',

    track: 'Track',
    trackColor: 'Colour', trackRadius: 'Corner radius', trackBorderWidth: 'Border width', trackBorderColor: 'Border colour',
    trackDesc: 'The channel the thumb slides inside. `::-webkit-scrollbar-track`.',

    thumb: 'Thumb',
    thumbColor: 'Colour', thumbHoverColor: 'Hover colour', thumbRadius: 'Corner radius', thumbBorderWidth: 'Border width', thumbBorderColor: 'Border colour',
    thumbDesc: 'The draggable handle. `::-webkit-scrollbar-thumb` — the border uses background-clip: padding-box so it doesn’t get painted over by the thumb’s own background.',

    corner: 'Corner',
    cornerColor: 'Colour',
    cornerDesc: 'The little square where a vertical and horizontal scrollbar meet. Only visible when both are showing. `::-webkit-scrollbar-corner`.',

    buttons: 'Buttons',
    showButtons: 'Show',
    buttonColor: 'Colour',
    buttonsDesc: 'The up/down/left/right arrow buttons at each end. Hidden by default in most browsers — `::-webkit-scrollbar-button` needs an explicit size to show at all, which is what this toggle sets. Chrome draws its own native arrow glyph on top automatically once the button has a size; you’re only styling the box behind it.',

    axis: 'Scroll axis',
    axisVertical: 'Vertical', axisHorizontal: 'Horizontal', axisBoth: 'Both',
    canvas: 'Preview',
    canvasSize: 'Preview size',
    canvasWidth: 'Width', canvasHeight: 'Height',
    canvasDark: 'Dark preview',
    scrollHint: 'Scroll the box below — this is a real, live scrollbar, not a screenshot.',

    generatedCss: 'Generated CSS',
    formatCss: 'CSS',
    formatReact: 'React (styled-jsx)',
    noTailwindNote: 'No Tailwind tab — core Tailwind has no scrollbar utilities (the popular plugin that adds them isn’t part of this project), so generating classes for it would produce copy that doesn’t work.',
    copy: 'Copy',
    copied: 'Copied',

    reset: 'Reset',
    copyShareLink: 'Copy share link',
    shareLinkCopied: 'Link copied — it reproduces this exact style',

    presets: 'Presets',
    presetMinimal: 'Minimal',
    presetMinimalNote: 'Thin, colourless track, a light grey thumb that darkens on hover. The scrollbar most modern sites actually ship.',
    presetChunky: 'Chunky',
    presetChunkyNote: 'A wide scrollbar with a visible border around the thumb — easier to grab, harder to ignore.',
    presetNeon: 'Neon',
    presetNeonNote: 'Dark track, glowing cyan thumb. Shows the scrollbar can be a deliberate design element, not just plumbing.',
    presetHoverReveal: 'Hover to reveal',
    presetHoverRevealNote: 'The thumb is the same colour as the track until you hover it — a common trick for keeping a scrollbar out of the way until it’s needed.',
    presetHidden: 'Hidden',
    presetHiddenNote: 'scrollbar-width: none plus a zero-size webkit scrollbar. The content is still fully scrollable — try it — there’s just nothing to see or grab.',

    hoverHint: 'Hover or tap a field to see what it does.',
  },
  bn: {
    title: 'CSS স্ক্রলবার স্টাইলার',
    subtitle:
      'স্ক্রলবারের প্রতিটি অংশ স্টাইল করুন — track, thumb, corner, buttons — আর দেখুন এটি আসল ব্রাউজার ইঞ্জিন দিয়ে রেন্ডার হচ্ছে, কোনো মকআপ নয়। দুটো আলাদা সিস্টেম, দুই ধরনের ব্রাউজার — নিচের honest সাপোর্ট নোটে কোনটি কোথায় ব্যাখ্যা করা আছে।',
    lessonCta: 'pseudo-elements পাঠটি পড়ুন',

    supportNoteTitle: 'দুটো সিস্টেম, একে অপরের সাথে কথা বলে না',
    supportNote:
      '`scrollbar-width` আর `scrollbar-color` হলো স্ট্যান্ডার্ড: Firefox বহু বছর ধরে এগুলো সাপোর্ট করে, আর Chromium-ভিত্তিক ব্রাউজার (Chrome, Edge, Opera) আরও সম্প্রতি যোগ করেছে। Safari কোনোটাই সাপোর্ট করে না। `::-webkit-scrollbar` আর তার অংশগুলো শুধু WebKit/Blink-এর — Chrome, Edge, Opera আর Safari সবাই মানে; Firefox নিচের প্রতিটি রুল সম্পূর্ণ উপেক্ষা করে। সবখানে ইচ্ছাকৃত মনে হতে চাইলে দুটোই দিন, যেমন এই টুল তৈরি করে — যে ব্রাউজারে স্টাইল করেননি সেখানে একটি অ-স্টাইল করা স্ক্রলবার একদম ঠিক আছে।',

    standardSection: 'স্ট্যান্ডার্ড (scrollbar-width / scrollbar-color)',
    scrollbarWidth: 'scrollbar-width',
    widthAuto: 'auto', widthThin: 'thin', widthNone: 'none',
    scrollbarWidthDesc: 'সামগ্রিক পুরুত্বের জন্য স্ট্যান্ডার্ড কীওয়ার্ড। `none` স্ক্রলবার সম্পূর্ণ সরিয়ে দেয় — এলিমেন্টটি তখনও হুইল, টাচ বা কীবোর্ড দিয়ে স্ক্রল করা যায়, শুধু ধরার মতো কিছু থাকে না।',

    webkitSection: '::-webkit-scrollbar',
    size: 'width / height',
    sizeDesc: 'webkit স্ক্রলবারের পুরুত্ব, পিক্সেলে — উল্লম্ব স্ক্রলবারের width আর অনুভূমিক স্ক্রলবারের height, দুটোর জন্যই একসাথে ব্যবহৃত হয়।',

    track: 'ট্র্যাক',
    trackColor: 'রং', trackRadius: 'কোণের বাঁক', trackBorderWidth: 'বর্ডার প্রস্থ', trackBorderColor: 'বর্ডার রং',
    trackDesc: 'যে চ্যানেলের ভিতর thumb চলে। `::-webkit-scrollbar-track`।',

    thumb: 'থাম্ব',
    thumbColor: 'রং', thumbHoverColor: 'হোভার রং', thumbRadius: 'কোণের বাঁক', thumbBorderWidth: 'বর্ডার প্রস্থ', thumbBorderColor: 'বর্ডার রং',
    thumbDesc: 'টেনে নড়ানোর হ্যান্ডেল। `::-webkit-scrollbar-thumb` — বর্ডারে background-clip: padding-box ব্যবহার হয় যাতে thumb-এর নিজের ব্যাকগ্রাউন্ড এটি ঢেকে না দেয়।',

    corner: 'কোণ',
    cornerColor: 'রং',
    cornerDesc: 'উল্লম্ব আর অনুভূমিক স্ক্রলবার যেখানে মেলে সেই ছোট বর্গক্ষেত্র। দুটোই দেখা গেলে তবেই দৃশ্যমান। `::-webkit-scrollbar-corner`।',

    buttons: 'বাটন',
    showButtons: 'দেখান',
    buttonColor: 'রং',
    buttonsDesc: 'দুই প্রান্তের উপর/নিচ/বাঁ/ডান তীর বাটন। বেশিরভাগ ব্রাউজারে ডিফল্টভাবে লুকানো থাকে — `::-webkit-scrollbar-button` দেখাতে হলে স্পষ্ট মাপ লাগবে, এই টগলটি সেটাই ঠিক করে। বাটনের মাপ পেলেই Chrome নিজে থেকে তার native তীরের আইকন এর উপর এঁকে দেয়; আপনি শুধু আইকনের পেছনের বাক্সটি স্টাইল করছেন।',

    axis: 'স্ক্রল অক্ষ',
    axisVertical: 'উল্লম্ব', axisHorizontal: 'অনুভূমিক', axisBoth: 'উভয়',
    canvas: 'প্রিভিউ',
    canvasSize: 'প্রিভিউর মাপ',
    canvasWidth: 'প্রস্থ', canvasHeight: 'উচ্চতা',
    canvasDark: 'ডার্ক প্রিভিউ',
    scrollHint: 'নিচের বাক্সটি স্ক্রল করুন — এটি একটি আসল, লাইভ স্ক্রলবার, স্ক্রিনশট নয়।',

    generatedCss: 'তৈরি হওয়া CSS',
    formatCss: 'CSS',
    formatReact: 'React (styled-jsx)',
    noTailwindNote: 'কোনো Tailwind ট্যাব নেই — মূল Tailwind-এ কোনো স্ক্রলবার ইউটিলিটি নেই (যে জনপ্রিয় প্লাগইন এগুলো যোগ করে সেটি এই প্রজেক্টের অংশ নয়), তাই এর জন্য ক্লাস তৈরি করলে এমন কোড হতো যা কাজ করে না।',
    copy: 'কপি',
    copied: 'কপি হয়েছে',

    reset: 'রিসেট',
    copyShareLink: 'শেয়ার লিংক কপি করুন',
    shareLinkCopied: 'লিংক কপি হয়েছে — এটি ঠিক এই স্টাইলটিই আবার তৈরি করবে',

    presets: 'প্রিসেট',
    presetMinimal: 'মিনিমাল',
    presetMinimalNote: 'পাতলা, রংহীন ট্র্যাক, হালকা ধূসর থাম্ব যা হোভারে গাঢ় হয়। বেশিরভাগ আধুনিক সাইট আসলে এই স্ক্রলবারটিই ব্যবহার করে।',
    presetChunky: 'মোটা',
    presetChunkyNote: 'থাম্বের চারপাশে স্পষ্ট বর্ডারসহ একটি চওড়া স্ক্রলবার — ধরা সহজ, উপেক্ষা করা কঠিন।',
    presetNeon: 'নিয়ন',
    presetNeonNote: 'গাঢ় ট্র্যাক, জ্বলজ্বলে সায়ান থাম্ব। দেখায় স্ক্রলবার শুধু প্লাম্বিং নয়, একটি ইচ্ছাকৃত ডিজাইন এলিমেন্টও হতে পারে।',
    presetHoverReveal: 'হোভারে প্রকাশ',
    presetHoverRevealNote: 'হোভার না করা পর্যন্ত থাম্বের রং ট্র্যাকের মতোই — যতক্ষণ না দরকার ততক্ষণ স্ক্রলবারকে আড়ালে রাখার একটি পরিচিত কৌশল।',
    presetHidden: 'লুকানো',
    presetHiddenNote: 'scrollbar-width: none আর শূন্য-মাপের webkit স্ক্রলবার। কনটেন্ট তখনও সম্পূর্ণ স্ক্রল করা যায় — চেষ্টা করে দেখুন — শুধু দেখার বা ধরার মতো কিছু নেই।',

    hoverHint: 'কোন ফিল্ড কী করে দেখতে তার উপর মাউস রাখুন বা ট্যাপ করুন।',
  },
} as const

export function ss(locale: Locale) {
  return SCROLLBAR_STRINGS[locale]
}
