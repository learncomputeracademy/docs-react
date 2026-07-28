import type { Locale } from './types'

// Same convention as the other /tools demos: West Bengal / Indian Bengali,
// CSS property/value keywords stay English inside Bengali sentences.
export const GRID_STRINGS = {
  en: {
    title: 'Grid Generator',
    subtitle:
      'Drag across cells to place items on a real CSS Grid — no typed line numbers required to get started. Add tracks, mix fr/px/auto/minmax, and watch grid-template-areas build itself from what you drew.',
    lessonCta: 'Read the display & visibility lesson',

    columns: 'Columns', rows: 'Rows',
    addTrack: 'Add track', track: 'Track',
    trackMode: 'Size',
    modeFr: 'fr', modePx: 'px', modeAuto: 'auto', modeMinmax: 'minmax',
    tracksDesc: 'Each track is one column (or row) width. fr shares leftover space by ratio; px is a fixed size; auto fits content; minmax(150px, 1fr) never shrinks below its minimum.',

    gap: 'Gap', rowGap: 'Row gap', columnGap: 'Column gap',
    justifyItems: 'justify-items', alignItems: 'align-items',
    justifyContent: 'justify-content', alignContent: 'align-content',
    justifyItemsDesc: 'How each item is positioned inside its own cell along the row axis, when the item is narrower than the cell.',
    alignItemsDesc: 'How each item is positioned inside its own cell along the column axis, when the item is shorter than the cell.',
    justifyContentDesc: 'How the whole track grid is positioned inside the container when the tracks add up to less than the container width.',
    alignContentDesc: 'How the whole track grid is positioned inside the container when the tracks add up to less than the container height.',
    stretch: 'stretch', start: 'start', end: 'end', center: 'center',
    spaceBetween: 'space-between', spaceAround: 'space-around', spaceEvenly: 'space-evenly',

    canvas: 'Preview — drag across empty cells to place an item',
    dragHint: 'Click and drag across empty cells, then release to place an item there.',
    overlapNote: 'That drag crossed an existing item, so nothing was placed. Delete the item in the way first, or draw inside empty cells only.',

    items: 'Items', item: 'Item', deleteItem: 'Delete', itemName: 'Name',
    itemPlacement: 'Placement (grid lines, 1-indexed)',
    colStart: 'Column start', colEnd: 'Column end', rowStart: 'Row start', rowEnd: 'Row end',
    justifySelf: 'justify-self', alignSelf: 'align-self', auto: 'auto',
    noItemsNote: 'No items yet — drag across empty cells in the preview to create one.',

    areas: 'grid-template-areas (derived from your layout)',
    areasDuplicate: 'Two items share the same name — areas can’t be derived until every item name is unique.',
    areasOverlap: 'Items overlap — areas can’t be derived until placements stop overlapping.',

    generatedCss: 'Generated CSS',
    formatCss: 'CSS', formatTailwind: 'Tailwind', formatReact: 'React style',
    copy: 'Copy', copied: 'Copied',

    reset: 'Reset', copyShareLink: 'Copy share link', shareLinkCopied: 'Link copied — it reproduces this exact layout',

    presets: 'Presets',
    presetHolyGrail: 'Holy grail layout',
    presetHolyGrailNote: 'Header and footer span the full width; a fixed-width sidebar, flexible main, and fixed-width aside share the middle row — the layout Flexbox’s single flat container could never quite do.',
    presetTwelveColumn: 'Bootstrap-style 12-column',
    presetTwelveColumnNote: 'Twelve equal fr tracks, the way Bootstrap’s grid divided a row into 12 with float and margin math — this replaces that with three lines of real CSS Grid.',
    presetDashboard: 'Dashboard',
    presetDashboardNote: 'A fixed-width nav column, two stat cards, and one chart area spanning two rows and two columns underneath them.',
    presetNamedAreas: 'Named areas demo',
    presetNamedAreasNote: 'A simple 2×2 layout chosen to make the derived grid-template-areas easy to read at a glance — check the areas panel below.',
    presetPhotoGrid: 'Photo grid',
    presetPhotoGridNote: 'One large photo spanning 2×2 cells next to three smaller ones — fixed track counts only; repeat(auto-fill, …) dynamic columns are outside what this tool builds.',
  },
  bn: {
    title: 'গ্রিড জেনারেটর',
    subtitle:
      'আসল CSS Grid-এর সেলগুলোর উপর টেনে (drag করে) আইটেম বসান — শুরু করতে টাইপ করা লাইন নম্বরের দরকার নেই। ট্র্যাক যোগ করুন, fr/px/auto/minmax মিশিয়ে ব্যবহার করুন, আর দেখুন আপনার আঁকা লেআউট থেকে grid-template-areas নিজে থেকেই তৈরি হচ্ছে।',
    lessonCta: 'display ও visibility পাঠ পড়ুন',

    columns: 'কলাম', rows: 'সারি',
    addTrack: 'ট্র্যাক যোগ করুন', track: 'ট্র্যাক',
    trackMode: 'মাপ',
    modeFr: 'fr', modePx: 'px', modeAuto: 'auto', modeMinmax: 'minmax',
    tracksDesc: 'প্রতিটি ট্র্যাক একটি কলাম (বা সারি)-এর মাপ। fr অনুপাত অনুযায়ী বাকি জায়গা ভাগ করে; px একটি স্থির মাপ; auto কনটেন্ট অনুযায়ী মাপ নেয়; minmax(150px, 1fr) তার সর্বনিম্ন মাপের নিচে কখনো যায় না।',

    gap: 'ফাঁক', rowGap: 'সারির ফাঁক', columnGap: 'কলামের ফাঁক',
    justifyItems: 'justify-items', alignItems: 'align-items',
    justifyContent: 'justify-content', alignContent: 'align-content',
    justifyItemsDesc: 'আইটেম তার নিজের সেলের চেয়ে সরু হলে, row অক্ষ বরাবর সেলের ভেতরে তার অবস্থান কেমন হবে।',
    alignItemsDesc: 'আইটেম তার নিজের সেলের চেয়ে খাটো হলে, column অক্ষ বরাবর সেলের ভেতরে তার অবস্থান কেমন হবে।',
    justifyContentDesc: 'সব ট্র্যাক মিলিয়ে কন্টেইনারের প্রস্থের চেয়ে কম হলে, পুরো ট্র্যাক-গ্রিডটি কন্টেইনারের ভেতরে কোথায় বসবে।',
    alignContentDesc: 'সব ট্র্যাক মিলিয়ে কন্টেইনারের উচ্চতার চেয়ে কম হলে, পুরো ট্র্যাক-গ্রিডটি কন্টেইনারের ভেতরে কোথায় বসবে।',
    stretch: 'stretch', start: 'শুরু', end: 'শেষ', center: 'কেন্দ্র',
    spaceBetween: 'space-between', spaceAround: 'space-around', spaceEvenly: 'space-evenly',

    canvas: 'প্রিভিউ — খালি সেলের উপর টেনে আইটেম বসান',
    dragHint: 'খালি সেলের উপর ক্লিক করে টানুন, তারপর ছেড়ে দিলে সেখানে একটি আইটেম বসবে।',
    overlapNote: 'এই টানাটি একটি আগের আইটেমের উপর দিয়ে গেছে, তাই কিছু বসেনি। আগে পথের আইটেমটি মুছুন, বা শুধু খালি সেলের ভেতরেই আঁকুন।',

    items: 'আইটেমসমূহ', item: 'আইটেম', deleteItem: 'মুছুন', itemName: 'নাম',
    itemPlacement: 'অবস্থান (গ্রিড লাইন, 1 থেকে শুরু)',
    colStart: 'কলাম শুরু', colEnd: 'কলাম শেষ', rowStart: 'সারি শুরু', rowEnd: 'সারি শেষ',
    justifySelf: 'justify-self', alignSelf: 'align-self', auto: 'auto',
    noItemsNote: 'এখনও কোনো আইটেম নেই — প্রিভিউতে খালি সেলের উপর টেনে একটি তৈরি করুন।',

    areas: 'grid-template-areas (আপনার লেআউট থেকে তৈরি)',
    areasDuplicate: 'দুটি আইটেমের নাম একই — প্রতিটি আইটেমের নাম আলাদা না হওয়া পর্যন্ত areas তৈরি করা যাবে না।',
    areasOverlap: 'আইটেমগুলো একে অপরের উপর বসে আছে — অবস্থান আলাদা না হওয়া পর্যন্ত areas তৈরি করা যাবে না।',

    generatedCss: 'তৈরি হওয়া CSS',
    formatCss: 'CSS', formatTailwind: 'Tailwind', formatReact: 'React style',
    copy: 'কপি', copied: 'কপি হয়েছে',

    reset: 'রিসেট', copyShareLink: 'শেয়ার লিংক কপি করুন', shareLinkCopied: 'লিংক কপি হয়েছে — এটি ঠিক এই লেআউটটিই আবার তৈরি করবে',

    presets: 'প্রিসেট',
    presetHolyGrail: 'Holy grail লেআউট',
    presetHolyGrailNote: 'হেডার আর ফুটার পুরো প্রস্থ জুড়ে; মাঝের সারিতে স্থির-প্রস্থের সাইডবার, নমনীয় মেইন, আর স্থির-প্রস্থের এসাইড — এই লেআউট Flexbox-এর একক ফ্ল্যাট কন্টেইনার দিয়ে কখনো ঠিকমতো করা যেত না।',
    presetTwelveColumn: 'Bootstrap-ধাঁচের 12-কলাম',
    presetTwelveColumnNote: 'বারোটি সমান fr ট্র্যাক — Bootstrap-এর গ্রিড যেভাবে float আর margin দিয়ে একটি সারিকে ১২ ভাগ করত, তার বদলে মাত্র তিন লাইনের আসল CSS Grid।',
    presetDashboard: 'ড্যাশবোর্ড',
    presetDashboardNote: 'একটি স্থির-প্রস্থের nav কলাম, দুটি stat কার্ড, আর নিচে দুই সারি-দুই কলাম জুড়ে একটি চার্ট এরিয়া।',
    presetNamedAreas: 'নামযুক্ত areas ডেমো',
    presetNamedAreasNote: 'একটি সহজ 2×2 লেআউট, যাতে তৈরি হওয়া grid-template-areas এক নজরে পড়া সহজ হয় — নিচের areas প্যানেল দেখুন।',
    presetPhotoGrid: 'ফটো গ্রিড',
    presetPhotoGridNote: '2×2 সেল জুড়ে একটি বড় ছবি, পাশে তিনটি ছোট ছবি — শুধু স্থির ট্র্যাক সংখ্যা; repeat(auto-fill, …) দিয়ে গতিশীল কলাম এই টুলের আওতার বাইরে।',
  },
} as const

export function gs(locale: Locale) {
  return GRID_STRINGS[locale]
}
