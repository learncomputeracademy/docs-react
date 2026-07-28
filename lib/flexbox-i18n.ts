import type { Locale } from './types'

// Same convention as the other /tools demos: West Bengal / Indian Bengali,
// CSS property/value keywords stay English inside Bengali sentences.
export const FLEXBOX_STRINGS = {
  en: {
    title: 'Flexbox Playground',
    subtitle:
      'Every container and item property, live — drag nothing, just turn the knobs and watch real flexbox do the work. See exactly how order changes what you see without touching what’s actually in the HTML.',
    lessonCta: 'Browse the CSS lessons',
    noLessonNote: 'There isn’t a dedicated flexbox lesson yet — this playground teaches the concept itself through the explanation panel below.',

    container: 'Container',
    direction: 'flex-direction',
    directionRow: 'row',
    directionRowReverse: 'row-reverse',
    directionColumn: 'column',
    directionColumnReverse: 'column-reverse',
    directionDesc: 'The axis items are laid out along, and which end counts as the start. Row is left-to-right (or right-to-left in RTL); column is top-to-bottom.',

    wrap: 'flex-wrap',
    wrapNowrap: 'nowrap',
    wrapWrap: 'wrap',
    wrapReverse: 'wrap-reverse',
    wrapDesc: 'Whether items are forced onto one line, shrinking to fit, or allowed to overflow onto new lines instead.',

    justify: 'justify-content',
    alignItems: 'align-items',
    alignContent: 'align-content',
    gap: 'gap',

    justifyDesc: 'How items are spaced along the main axis — the direction flex-direction points.',
    alignItemsDesc: 'How items are aligned along the cross axis (perpendicular to flex-direction), on a single line.',
    alignContentDesc: 'How multiple lines are spaced along the cross axis. Has no effect with only one line — turn on wrap and add enough items to see it do anything.',
    gapDesc: 'Space between items in both directions. Unlike margin, it never adds space at the very start or end — only between items.',

    justifyStart: 'start', justifyEnd: 'end', justifyCenter: 'center',
    justifyBetween: 'space-between', justifyAround: 'space-around', justifyEvenly: 'space-evenly',
    alignStretch: 'stretch', alignStart: 'start', alignEnd: 'end', alignCenter: 'center', alignBaseline: 'baseline',

    items: 'Items',
    addItem: 'Add item',
    deleteItem: 'Delete',
    item: 'Item',
    domOrderNote: 'Numbers are fixed HTML/DOM order — they never move. Only the visual position changes.',

    grow: 'flex-grow',
    growDesc: 'How much of the leftover space this item claims, relative to other items’ grow values, after every item’s basis size and every gap is accounted for. 0 means it never grows.',
    shrink: 'flex-shrink',
    shrinkDesc: 'How much this item shrinks relative to the others when the container is too small to fit everyone at their basis size. 0 means it never shrinks below its basis.',
    basis: 'flex-basis',
    basisAuto: 'auto',
    basisPx: 'px',
    basisDesc: 'The item’s starting size before grow or shrink is applied — like width, but flex-aware. ‘auto’ means use the item’s natural content size.',
    order: 'order',
    orderDesc: 'Changes this item’s visual position without touching its position in the HTML. Lower numbers come first; every item defaults to 0, so a single item set to -1 moves to the front.',
    alignSelf: 'align-self',
    alignSelfDesc: 'Overrides align-items for just this one item.',
    alignSelfAuto: 'auto',


    canvas: 'Preview',
    canvasSize: 'Container size',
    canvasWidth: 'Width',
    canvasHeight: 'Height',

    generatedCss: 'Generated CSS',
    formatCss: 'CSS',
    formatTailwind: 'Tailwind',
    formatReact: 'React style',
    copy: 'Copy',
    copied: 'Copied',

    reset: 'Reset',
    copyShareLink: 'Copy share link',
    shareLinkCopied: 'Link copied — it reproduces this exact layout',

    presets: 'Presets',
    presetNavbar: 'Navbar',
    presetNavbarNote: 'A fixed-width logo and button with the nav links stretching to fill whatever space is left — justify-content: space-between plus one item with flex-grow does the whole layout.',
    presetSidebar: 'Sidebar layout',
    presetSidebarNote: 'The sidebar has a fixed flex-basis and flex-shrink: 0 so it never gets squeezed; the content area’s flex-grow: 1 claims everything else.',
    presetCentered: 'Centered',
    presetCenteredNote: 'justify-content and align-items both set to center — the two-line fix for the classic "how do I center a div" question.',
    presetEqualColumns: 'Equal columns',
    presetEqualColumnsNote: 'Every item has flex-grow: 1, so leftover space splits evenly — add or remove an item and the rest resize themselves.',
    presetWrapReorder: 'Wrap & reorder',
    presetWrapReorderNote: 'Six items too wide for one line, so flex-wrap moves the overflow to new lines — and one item has order: -1, jumping to the front visually while staying 2nd in the actual HTML (watch the number badges).',

    hoverHint: 'Hover or tap a field to see what it does.',
  },
  bn: {
    title: 'ফ্লেক্সবক্স প্লেগ্রাউন্ড',
    subtitle:
      'কন্টেইনার আর আইটেমের প্রতিটি প্রপার্টি, লাইভ — কিছু টানতে হবে না, শুধু নব ঘোরান আর দেখুন আসল flexbox কাজ করছে। দেখুন কীভাবে order আসল HTML স্পর্শ না করেই আপনি যা দেখছেন তা বদলে দেয়।',
    lessonCta: 'CSS পাঠগুলো দেখুন',
    noLessonNote: 'এখনও নির্দিষ্ট কোনো flexbox পাঠ নেই — নিচের ব্যাখ্যা প্যানেলের মাধ্যমে এই প্লেগ্রাউন্ডই ধারণাটি শেখায়।',

    container: 'কন্টেইনার',
    direction: 'flex-direction',
    directionRow: 'row',
    directionRowReverse: 'row-reverse',
    directionColumn: 'column',
    directionColumnReverse: 'column-reverse',
    directionDesc: 'যে অক্ষ বরাবর আইটেমগুলো সাজানো হয়, আর কোন প্রান্তটি শুরু ধরা হবে। Row মানে বাঁ-থেকে-ডান (RTL-এ ডান-থেকে-বাঁ); column মানে উপর-থেকে-নিচ।',

    wrap: 'flex-wrap',
    wrapNowrap: 'nowrap',
    wrapWrap: 'wrap',
    wrapReverse: 'wrap-reverse',
    wrapDesc: 'আইটেমগুলোকে জোর করে এক লাইনে রাখা হবে (সংকুচিত করে হলেও), নাকি নতুন লাইনে ছড়িয়ে যেতে দেওয়া হবে।',

    justify: 'justify-content',
    alignItems: 'align-items',
    alignContent: 'align-content',
    gap: 'gap',

    justifyDesc: 'মূল অক্ষ বরাবর (যেদিকে flex-direction নির্দেশ করে) আইটেমগুলো কীভাবে ছড়ানো থাকবে।',
    alignItemsDesc: 'ক্রস অক্ষ বরাবর (flex-direction-এর লম্ব দিকে) একটি লাইনে আইটেমগুলো কীভাবে সাজানো থাকবে।',
    alignContentDesc: 'একাধিক লাইন ক্রস অক্ষ বরাবর কীভাবে ছড়ানো থাকবে। একটিমাত্র লাইন থাকলে এর কোনো প্রভাব নেই — wrap চালু করে যথেষ্ট আইটেম যোগ করে দেখুন।',
    gapDesc: 'দুই দিকেই আইটেমগুলোর মধ্যকার ফাঁকা জায়গা। margin-এর মতো নয় — শুরু বা শেষে কখনো জায়গা যোগ করে না, শুধু আইটেমগুলোর মাঝে।',

    justifyStart: 'শুরু', justifyEnd: 'শেষ', justifyCenter: 'কেন্দ্র',
    justifyBetween: 'space-between', justifyAround: 'space-around', justifyEvenly: 'space-evenly',
    alignStretch: 'stretch', alignStart: 'শুরু', alignEnd: 'শেষ', alignCenter: 'কেন্দ্র', alignBaseline: 'baseline',

    items: 'আইটেমসমূহ',
    addItem: 'আইটেম যোগ করুন',
    deleteItem: 'মুছুন',
    item: 'আইটেম',
    domOrderNote: 'সংখ্যাগুলো স্থির HTML/DOM ক্রম — এগুলো কখনো নড়ে না। শুধু দৃশ্যমান অবস্থান বদলায়।',

    grow: 'flex-grow',
    growDesc: 'প্রতিটি আইটেমের basis মাপ আর প্রতিটি gap বাদ দেওয়ার পর, বাকি জায়গার কতটা এই আইটেম নেবে, অন্য আইটেমদের grow মানের তুলনায়। 0 মানে কখনো বাড়বে না।',
    shrink: 'flex-shrink',
    shrinkDesc: 'কন্টেইনার সবার basis মাপে ধরার জন্য ছোট হলে, অন্যদের তুলনায় এই আইটেম কতটা সংকুচিত হবে। 0 মানে কখনো তার basis-এর নিচে যাবে না।',
    basis: 'flex-basis',
    basisAuto: 'auto',
    basisPx: 'px',
    basisDesc: 'grow বা shrink প্রয়োগের আগে আইটেমের শুরুর মাপ — width-এর মতোই, কিন্তু flex-সচেতন। ‘auto’ মানে আইটেমের স্বাভাবিক কনটেন্ট-মাপ ব্যবহার হবে।',
    order: 'order',
    orderDesc: 'HTML-এ আইটেমের অবস্থান স্পর্শ না করেই তার দৃশ্যমান অবস্থান বদলায়। ছোট সংখ্যা আগে আসে; প্রতিটি আইটেমের ডিফল্ট 0, তাই একটি আইটেমকে -1 করলেই সে সবার সামনে চলে আসে।',
    alignSelf: 'align-self',
    alignSelfDesc: 'শুধু এই একটি আইটেমের জন্য align-items-কে override করে।',
    alignSelfAuto: 'auto',


    canvas: 'প্রিভিউ',
    canvasSize: 'কন্টেইনারের মাপ',
    canvasWidth: 'প্রস্থ',
    canvasHeight: 'উচ্চতা',

    generatedCss: 'তৈরি হওয়া CSS',
    formatCss: 'CSS',
    formatTailwind: 'Tailwind',
    formatReact: 'React style',
    copy: 'কপি',
    copied: 'কপি হয়েছে',

    reset: 'রিসেট',
    copyShareLink: 'শেয়ার লিংক কপি করুন',
    shareLinkCopied: 'লিংক কপি হয়েছে — এটি ঠিক এই লেআউটটিই আবার তৈরি করবে',

    presets: 'প্রিসেট',
    presetNavbar: 'নেভবার',
    presetNavbarNote: 'স্থির-প্রস্থের লোগো আর বাটন, নেভ লিংকগুলো বাকি জায়গা জুড়ে ছড়িয়ে যায় — justify-content: space-between আর একটি আইটেমে flex-grow দিয়েই পুরো লেআউট।',
    presetSidebar: 'সাইডবার লেআউট',
    presetSidebarNote: 'সাইডবারের একটি স্থির flex-basis আর flex-shrink: 0 আছে যাতে কখনো চাপা না পড়ে; কনটেন্ট এরিয়ার flex-grow: 1 বাকি সব জায়গা নেয়।',
    presetCentered: 'কেন্দ্রীভূত',
    presetCenteredNote: 'justify-content আর align-items দুটোই center — "একটা div কীভাবে center করব" প্রশ্নের দুই-লাইনের সমাধান।',
    presetEqualColumns: 'সমান কলাম',
    presetEqualColumnsNote: 'প্রতিটি আইটেমে flex-grow: 1, তাই বাকি জায়গা সমানভাবে ভাগ হয় — একটি আইটেম যোগ বা বাদ দিন, বাকিরা নিজেরাই মাপ বদলাবে।',
    presetWrapReorder: 'Wrap ও পুনর্বিন্যাস',
    presetWrapReorderNote: 'ছয়টি আইটেম এক লাইনে ধরার চেয়ে বেশি চওড়া, তাই flex-wrap বাড়তিগুলো নতুন লাইনে সরিয়ে দেয় — আর একটি আইটেমে order: -1, যা দৃশ্যত সামনে চলে আসে কিন্তু আসল HTML-এ ২য় স্থানেই থাকে (সংখ্যা ব্যাজগুলো লক্ষ্য করুন)।',

    hoverHint: 'কোন ফিল্ড কী করে দেখতে তার উপর মাউস রাখুন বা ট্যাপ করুন।',
  },
} as const

export function fs(locale: Locale) {
  return FLEXBOX_STRINGS[locale]
}
