import type { Locale } from './types'

// Kept out of lib/i18n.ts on purpose — that file is site chrome (nav,
// buttons, footer) and is imported by nearly every component. This is one
// page's worth of strings and only the demo loads it.
// Bengali is West Bengal / Indian Bengali per the project's translation
// convention. CSS property names stay English throughout: students type
// `margin`, not `মার্জিন`, and mixing them would teach the wrong token.
export const BOX_MODEL_STRINGS = {
  en: {
    title: 'Interactive CSS Box Model',
    subtitle:
      'Every element on a web page is a box. Drag the sliders and watch how content, padding, border and margin stack up — and why a 200px box is often not 200px wide.',
    lessonCta: 'Read the CSS Box Model lesson',

    layers: 'Layers',
    content: 'Content',
    padding: 'Padding',
    border: 'Border',
    margin: 'Margin',

    contentDesc:
      'The actual content — your text or image. Its size is what `width` and `height` set when `box-sizing: content-box` is used.',
    paddingDesc:
      'Space inside the border, between the border and the content. Padding takes the background colour of the element.',
    borderDesc:
      'The line drawn around the padding. It has a width, a style and a colour — all three must be set for a border to show.',
    marginDesc:
      'Space outside the border, pushing other elements away. Margin is always transparent — the page background shows through.',

    boxSizing: 'box-sizing',
    contentBox: 'content-box',
    borderBox: 'border-box',
    contentBoxHint: 'width sets the content only — padding and border are added on top.',
    borderBoxHint: 'width includes padding and border — the box never grows past it.',

    size: 'Size',
    width: 'Width',
    height: 'Height',
    unit: 'Unit',

    linkAll: 'All',
    linkNone: 'Each',
    linkTb: 'Top / Bottom',
    linkRl: 'Left / Right',
    top: 'Top',
    right: 'Right',
    bottom: 'Bottom',
    left: 'Left',

    borderStyle: 'Style',
    borderColor: 'Colour',
    radius: 'Corner radius',
    topLeft: 'Top left',
    topRight: 'Top right',
    bottomRight: 'Bottom right',
    bottomLeft: 'Bottom left',

    contentSection: 'Content',
    contentText: 'Text',
    fontSize: 'Font size',

    theMath: 'The maths',
    totalWidth: 'Total width',
    totalHeight: 'Total height',
    occupiesWidth: 'Space taken on the page (with margin)',
    generatedCss: 'Generated CSS',
    copy: 'Copy',
    copied: 'Copied',
    reset: 'Reset',

    presets: 'Try these',
    presetDefault: 'Default',
    presetDefaultNote: 'A plain box with a little of everything. Good starting point.',
    presetBorderBox: 'Why border-box exists',
    presetBorderBoxNote:
      'Same numbers, box-sizing: content-box. You asked for 300px wide — the box is actually 360px. Switch to border-box and it becomes exactly 300px. This is why most projects set border-box on everything.',
    presetPaddingVsMargin: 'Padding vs margin',
    presetPaddingVsMarginNote:
      'Big padding, no margin. Notice the background colour fills the padding but would not fill a margin — that is the difference. Padding is inside the element, margin is outside it.',
    presetZeroContent: 'A box with no content',
    presetZeroContentNote:
      'Width and height are 0, yet the box is still visible. Padding and border occupy space even when there is nothing inside — a common surprise.',
    hoverHint: 'Hover or tap a layer to learn what it does.',
    clickLayerHint: 'Selected — click again to clear',
  },
  bn: {
    title: 'ইন্টারঅ্যাক্টিভ CSS বক্স মডেল',
    subtitle:
      'ওয়েব পাতার প্রতিটি এলিমেন্টই একটি বাক্স। স্লাইডার টেনে দেখুন content, padding, border আর margin কীভাবে একটির উপর আরেকটি বসে — আর কেন ২০০px-এর একটি বাক্স প্রায়ই ২০০px চওড়া হয় না।',
    lessonCta: 'CSS বক্স মডেল পাঠটি পড়ুন',

    layers: 'স্তরসমূহ',
    content: 'Content',
    padding: 'Padding',
    border: 'Border',
    margin: 'Margin',

    contentDesc:
      'আসল বিষয়বস্তু — আপনার লেখা বা ছবি। `box-sizing: content-box` ব্যবহার করলে `width` ও `height` এই অংশটির মাপই ঠিক করে।',
    paddingDesc:
      'বর্ডারের ভিতরের ফাঁকা জায়গা, বর্ডার আর কনটেন্টের মাঝখানে। প্যাডিং এলিমেন্টের ব্যাকগ্রাউন্ড রং ধরে রাখে।',
    borderDesc:
      'প্যাডিংয়ের চারপাশে আঁকা রেখা। এর একটি width, একটি style আর একটি colour থাকে — বর্ডার দেখাতে হলে তিনটিই দিতে হয়।',
    marginDesc:
      'বর্ডারের বাইরের ফাঁকা জায়গা, যা অন্য এলিমেন্টকে দূরে ঠেলে দেয়। মার্জিন সবসময় স্বচ্ছ — পাতার ব্যাকগ্রাউন্ড এর ভিতর দিয়ে দেখা যায়।',

    boxSizing: 'box-sizing',
    contentBox: 'content-box',
    borderBox: 'border-box',
    contentBoxHint: 'width শুধু কনটেন্টের মাপ ঠিক করে — padding আর border তার উপরে যোগ হয়।',
    borderBoxHint: 'width-এর ভিতরেই padding আর border ধরা থাকে — বাক্স এর চেয়ে বড় হয় না।',

    size: 'মাপ',
    width: 'প্রস্থ',
    height: 'উচ্চতা',
    unit: 'একক',

    linkAll: 'সব একসাথে',
    linkNone: 'আলাদা',
    linkTb: 'উপর / নিচ',
    linkRl: 'বাঁ / ডান',
    top: 'উপর',
    right: 'ডান',
    bottom: 'নিচ',
    left: 'বাঁ',

    borderStyle: 'ধরন',
    borderColor: 'রং',
    radius: 'কোণের বাঁক',
    topLeft: 'উপর-বাঁ',
    topRight: 'উপর-ডান',
    bottomRight: 'নিচ-ডান',
    bottomLeft: 'নিচ-বাঁ',

    contentSection: 'কনটেন্ট',
    contentText: 'লেখা',
    fontSize: 'ফন্ট সাইজ',

    theMath: 'হিসাবটা',
    totalWidth: 'মোট প্রস্থ',
    totalHeight: 'মোট উচ্চতা',
    occupiesWidth: 'পাতায় দখল করা জায়গা (মার্জিনসহ)',
    generatedCss: 'তৈরি হওয়া CSS',
    copy: 'কপি',
    copied: 'কপি হয়েছে',
    reset: 'রিসেট',

    presets: 'এগুলো দেখুন',
    presetDefault: 'ডিফল্ট',
    presetDefaultNote: 'সাধারণ একটি বাক্স, সবকিছুর একটু একটু করে। শুরু করার ভালো জায়গা।',
    presetBorderBox: 'border-box কেন দরকার',
    presetBorderBoxNote:
      'একই সংখ্যা, box-sizing: content-box। আপনি ৩০০px চওড়া চেয়েছিলেন — বাক্সটি আসলে ৩৬০px। border-box করলেই ঠিক ৩০০px হয়ে যাবে। এই কারণেই বেশিরভাগ প্রজেক্টে সবকিছুতে border-box দেওয়া হয়।',
    presetPaddingVsMargin: 'Padding বনাম margin',
    presetPaddingVsMarginNote:
      'অনেকটা padding, কোনো margin নেই। খেয়াল করুন ব্যাকগ্রাউন্ড রং padding-এর ভিতর ছড়িয়ে যায়, কিন্তু margin-এ যেত না — পার্থক্যটা এখানেই। Padding এলিমেন্টের ভিতরে, margin তার বাইরে।',
    presetZeroContent: 'কনটেন্টহীন বাক্স',
    presetZeroContentNote:
      'width আর height শূন্য, তবুও বাক্সটি দেখা যাচ্ছে। ভিতরে কিছু না থাকলেও padding আর border জায়গা দখল করে — এটি একটি সাধারণ চমক।',
    hoverHint: 'কোন স্তর কী করে জানতে তার উপর মাউস রাখুন বা ট্যাপ করুন।',
    clickLayerHint: 'নির্বাচিত — সরাতে আবার ক্লিক করুন',
  },
} as const

export function bm(locale: Locale) {
  return BOX_MODEL_STRINGS[locale]
}
