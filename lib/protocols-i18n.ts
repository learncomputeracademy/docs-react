import type { Locale } from './types'

// EN + BN interface strings for the Network Protocol Visualizer
// (docs/TOOLS.md house rule 1). Lesson text lives next to the packet data in
// lib/protocols/lessons.ts as { en, bn } pairs, so a step's narration and its
// bytes can't drift apart. Protocol and field names stay English inside
// Bengali sentences — same convention as every other tool.
export const PROTOCOLS_STRINGS = {
  en: {
    title: 'Network Protocol Visualizer',
    subtitle: 'Watch what really happens when you open a web page — one packet at a time, with every byte explained.',
    lessonCta: 'Browse computer basics lessons',
    protocol: 'Protocol',
    network: 'The network',
    steps: 'Steps',
    step: 'Step',
    of: 'of',
    prev: 'Previous',
    next: 'Next',
    play: 'Play',
    pause: 'Pause',
    replay: 'Replay step',
    restart: 'Restart',
    speed: 'Speed',
    keys: 'Tip: use the ← and → keys to move between steps.',
    inspector: 'Inside the packet',
    noPacket: 'Nothing is on the wire in this step — it happens inside one device. Move to a step with a packet to see its bytes.',
    bytes: 'bytes',
    total: 'Total on the wire',
    fieldHint: 'Hover or tap a field — or a byte — to see what it means.',
    hexView: 'Raw bytes',
    lost: 'Lost',
    captureNote: 'Packets are shown as they appear at the laptop’s own network card. Addresses are example values; the checksums are really calculated from the bytes you see.',
    nodes: { laptop: 'Your laptop', router: 'Home router', internet: 'Internet', dns: 'DNS resolver', server: 'Web server' },
    layers: { link: 'Link', ip: 'Internet', transport: 'Transport', app: 'Application' },
  },
  bn: {
    title: 'Network Protocol ভিজুয়ালাইজার',
    subtitle: 'একটা web page খুললে আসলে কী ঘটে দেখুন — একটা একটা packet ধরে, প্রতিটা byte-এর ব্যাখ্যাসহ।',
    lessonCta: 'কম্পিউটার বেসিক্স lesson দেখুন',
    protocol: 'Protocol',
    network: 'নেটওয়ার্ক',
    steps: 'ধাপ',
    step: 'ধাপ',
    of: '/',
    prev: 'আগের',
    next: 'পরের',
    play: 'চালান',
    pause: 'থামান',
    replay: 'ধাপটা আবার',
    restart: 'প্রথম থেকে',
    speed: 'গতি',
    keys: 'টিপ: ধাপ বদলাতে ← আর → key ব্যবহার করুন।',
    inspector: 'packet-এর ভেতরে',
    noPacket: 'এই ধাপে তারে কিছু যাচ্ছে না — এটা একটা ডিভাইসের ভেতরে ঘটছে। byte দেখতে packet আছে এমন ধাপে যান।',
    bytes: 'bytes',
    total: 'তারে মোট',
    fieldHint: 'কোনো field — বা কোনো byte — এর ওপর hover বা tap করুন, তার মানে দেখতে।',
    hexView: 'কাঁচা byte',
    lost: 'হারিয়েছে',
    captureNote: 'packet-গুলো ল্যাপটপের নিজের network card-এ যেমন দেখায় তেমন দেখানো হয়েছে। address-গুলো উদাহরণ; checksum-গুলো আপনি যে byte দেখছেন তা থেকেই সত্যিই হিসেব করা।',
    nodes: { laptop: 'ল্যাপটপ', router: 'বাড়ির router', internet: 'Internet', dns: 'DNS resolver', server: 'Web server' },
    layers: { link: 'Link', ip: 'Internet', transport: 'Transport', app: 'Application' },
  },
} as const

export const pvs = (locale: Locale) => PROTOCOLS_STRINGS[locale]
