import type { Locale } from './types'

// Same convention as the other /tools demos: West Bengal / Indian Bengali,
// CSS/WCAG terms stay English inside Bengali text.
export const CONTRAST_STRINGS = {
  en: {
    title: 'Colour & Contrast Studio',
    subtitle:
      'Build a palette from one colour, check real WCAG contrast math against it, and see how it holds up under colour blindness — not just a pass/fail badge, but why.',
    lessonCta: 'Read the CSS colours lesson',

    baseColour: 'Base colour',
    scheme: 'Palette scheme',
    schemeComplementary: 'Complementary',
    schemeTriadic: 'Triadic',
    schemeAnalogous: 'Analogous',
    schemeSplit: 'Split-complementary',
    schemeDesc: 'Every swatch shares the base colour’s saturation and lightness — only the hue rotates around the colour wheel.',
    tintsShades: 'Tints & shades',
    tintsShadesDesc: 'The same hue and saturation, lightness stepped from near-white to near-black.',
    clickToCopy: 'Click a swatch to copy its hex code.',
    copiedSwatch: 'Copied',
    useAsForeground: 'Use as text',
    useAsBackground: 'Use as background',

    contrastChecker: 'Contrast checker',
    foreground: 'Text colour',
    background: 'Background colour',
    swap: 'Swap',
    ratio: 'Contrast ratio',
    luminanceNote: 'Relative luminance: {fg} (text) vs {bg} (background) — the ratio is (lighter + 0.05) / (darker + 0.05).',

    normalText: 'Normal text',
    largeText: 'Large text (18pt+/24px, or 14pt+ bold)',
    uiComponent: 'UI components & graphics',
    levelFail: 'Fail',
    levelAA: 'AA',
    levelAAA: 'AAA',

    previewNormal: 'The quick brown fox jumps over the lazy dog.',
    previewLarge: 'The quick brown fox jumps over the lazy dog.',

    colourBlindness: 'Colour-blindness simulation',
    colourBlindnessDesc: 'A ratio can pass WCAG and still be a real problem — two colours that are only distinguished by hue can become indistinguishable here, even with a fine numeric contrast.',
    cbNone: 'Typical vision',
    cbProtanopia: 'Protanopia',
    cbDeuteranopia: 'Deuteranopia',
    cbTritanopia: 'Tritanopia',
    cbApproxNote: 'An approximation (a common web-simulator matrix applied to sRGB directly) — good enough to show a real problem, not a clinical diagnostic tool.',

    presets: 'Try these',
    presetAAA: 'Passes AAA',
    presetAAANote: 'Black on white: 21:1, the maximum possible contrast ratio.',
    presetAAPass: 'Just passes AA',
    presetAAPassNote: '#767676 on white lands at 4.54:1 — one hex step darker and it would fail. This is the boundary most "is my gray text okay" questions live right on.',
    presetLargeOnly: 'Large text only',
    presetLargeOnlyNote: '3.03:1 — passes AA for large/bold text (3:1 minimum) but fails AA for normal text (4.5:1 minimum). The same colour pair, two different verdicts, depending on font size.',
    presetFailsAll: 'Fails everything',
    presetFailsAllNote: '1.61:1 — light gray on white. Fails AA and AAA at every text size.',
    presetColourblindTrap: 'The colour-blind trap',
    presetColourblindTrapNote: 'Red on green: fails WCAG contrast outright (1.27:1) — but even with fine contrast, hue-only differentiation like this is unreadable for red-green colour blindness. Check the simulation below.',

    exportTitle: 'Export',
    formatCssVar: 'CSS variables',
    formatTailwind: 'Tailwind (@theme)',
    copy: 'Copy',
    copied: 'Copied',

    reset: 'Reset',
    copyShareLink: 'Copy share link',
    shareLinkCopied: 'Link copied — it reproduces this exact palette and pair',

  },
  bn: {
    title: 'কালার ও কনট্রাস্ট স্টুডিও',
    subtitle:
      'একটি রং থেকে প্যালেট তৈরি করুন, তার বিরুদ্ধে আসল WCAG কনট্রাস্ট ম্যাথ যাচাই করুন, আর দেখুন colour blindness-এ এটি কেমন টেকে — শুধু pass/fail ব্যাজ নয়, কেন তা-ও।',
    lessonCta: 'CSS রং পাঠটি পড়ুন',

    baseColour: 'মূল রং',
    scheme: 'প্যালেট স্কিম',
    schemeComplementary: 'Complementary',
    schemeTriadic: 'Triadic',
    schemeAnalogous: 'Analogous',
    schemeSplit: 'Split-complementary',
    schemeDesc: 'প্রতিটি সোয়াচ মূল রঙের saturation আর lightness একই রাখে — শুধু hue রং-চাকার চারপাশে ঘোরে।',
    tintsShades: 'Tints ও shades',
    tintsShadesDesc: 'একই hue আর saturation, lightness প্রায়-সাদা থেকে প্রায়-কালো পর্যন্ত ধাপে ধাপে বদলায়।',
    clickToCopy: 'হেক্স কোড কপি করতে একটি সোয়াচে ক্লিক করুন।',
    copiedSwatch: 'কপি হয়েছে',
    useAsForeground: 'লেখার রং হিসেবে ব্যবহার করুন',
    useAsBackground: 'ব্যাকগ্রাউন্ড হিসেবে ব্যবহার করুন',

    contrastChecker: 'কনট্রাস্ট চেকার',
    foreground: 'লেখার রং',
    background: 'ব্যাকগ্রাউন্ড রং',
    swap: 'অদলবদল',
    ratio: 'কনট্রাস্ট রেশিও',
    luminanceNote: 'Relative luminance: {fg} (লেখা) বনাম {bg} (ব্যাকগ্রাউন্ড) — রেশিও হলো (উজ্জ্বলতর + 0.05) / (গাঢ়তর + 0.05)।',

    normalText: 'সাধারণ লেখা',
    largeText: 'বড় লেখা (18pt+/24px, বা 14pt+ বোল্ড)',
    uiComponent: 'UI কম্পোনেন্ট ও গ্রাফিক্স',
    levelFail: 'ফেল',
    levelAA: 'AA',
    levelAAA: 'AAA',

    previewNormal: 'দ্রুত বাদামি শিয়াল অলস কুকুরের উপর দিয়ে লাফ দেয়।',
    previewLarge: 'দ্রুত বাদামি শিয়াল অলস কুকুরের উপর দিয়ে লাফ দেয়।',

    colourBlindness: 'কালার-ব্লাইন্ডনেস সিমুলেশন',
    colourBlindnessDesc: 'একটি রেশিও WCAG পাস করেও আসল সমস্যা থেকে যেতে পারে — শুধু hue দিয়ে আলাদা করা দুটো রং এখানে একরকম হয়ে যেতে পারে, ভালো সংখ্যাগত কনট্রাস্ট থাকলেও।',
    cbNone: 'সাধারণ দৃষ্টি',
    cbProtanopia: 'Protanopia',
    cbDeuteranopia: 'Deuteranopia',
    cbTritanopia: 'Tritanopia',
    cbApproxNote: 'একটি আনুমানিক হিসাব (sRGB-এ সরাসরি প্রয়োগ করা একটি সাধারণ ওয়েব-সিমুলেটর ম্যাট্রিক্স) — আসল সমস্যা দেখানোর জন্য যথেষ্ট, কোনো ক্লিনিক্যাল ডায়াগনস্টিক টুল নয়।',

    presets: 'এগুলো চেষ্টা করুন',
    presetAAA: 'AAA পাস করে',
    presetAAANote: 'সাদার উপর কালো: 21:1, সর্বোচ্চ সম্ভাব্য কনট্রাস্ট রেশিও।',
    presetAAPass: 'AA ঠিক পাস করে',
    presetAAPassNote: 'সাদার উপর #767676 দাঁড়ায় 4.54:1-এ — একধাপ গাঢ় হলেই ফেল করত। "আমার ধূসর লেখা কি ঠিক আছে" প্রশ্নগুলো ঠিক এই সীমানায় থাকে।',
    presetLargeOnly: 'শুধু বড় লেখায়',
    presetLargeOnlyNote: '3.03:1 — বড়/বোল্ড লেখার জন্য AA পাস করে (ন্যূনতম 3:1) কিন্তু সাধারণ লেখার জন্য AA ফেল করে (ন্যূনতম 4.5:1)। একই রঙের জোড়া, ফন্ট সাইজের উপর নির্ভর করে দুটো ভিন্ন রায়।',
    presetFailsAll: 'সবকিছুতে ফেল',
    presetFailsAllNote: '1.61:1 — সাদার উপর হালকা ধূসর। প্রতিটি লেখার মাপে AA আর AAA দুটোই ফেল করে।',
    presetColourblindTrap: 'কালার-ব্লাইন্ড ফাঁদ',
    presetColourblindTrapNote: 'সবুজের উপর লাল: সরাসরি WCAG কনট্রাস্ট ফেল করে (1.27:1) — কিন্তু ভালো কনট্রাস্ট থাকলেও শুধু hue দিয়ে এমন পার্থক্য red-green colour blindness-এর জন্য পড়া অসম্ভব। নিচের সিমুলেশনটি দেখুন।',

    exportTitle: 'এক্সপোর্ট',
    formatCssVar: 'CSS ভেরিয়েবল',
    formatTailwind: 'Tailwind (@theme)',
    copy: 'কপি',
    copied: 'কপি হয়েছে',

    reset: 'রিসেট',
    copyShareLink: 'শেয়ার লিংক কপি করুন',
    shareLinkCopied: 'লিংক কপি হয়েছে — এটি ঠিক এই প্যালেট আর জোড়াটিই আবার তৈরি করবে',

  },
} as const

export function cs(locale: Locale) {
  return CONTRAST_STRINGS[locale]
}
