// Byte-level packet builders for the Network Protocol Visualizer
// (/tools/protocols). Every hex byte the tool shows is produced here from the
// same values the field list displays, so the two can never disagree — and
// the IPv4/UDP/TCP checksums are really computed, not made up.

export type L = { en: string; bn: string }

export interface Field {
  name: string
  value: string
  bytes: number[]
  note: L
}

export type LayerKind = 'link' | 'ip' | 'transport' | 'app'

export interface Layer {
  kind: LayerKind
  name: string
  fields: Field[]
}

export const t = (en: string, bn: string): L => ({ en, bn })

// ── primitives ──────────────────────────────────────────────────────────
export const u8 = (n: number) => [n & 0xff]
export const u16 = (n: number) => [(n >> 8) & 0xff, n & 0xff]
export const u24 = (n: number) => [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
export const u32 = (n: number) => [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]
export const ipBytes = (ip: string) => ip.split('.').map(Number)
export const macBytes = (mac: string) => mac.split(':').map((h) => parseInt(h, 16))
export const ascii = (s: string) => Array.from(s, (c) => c.charCodeAt(0) & 0xff)
export const zeros = (n: number) => new Array<number>(n).fill(0)
export const hex = (n: number, width = 2) => n.toString(16).padStart(width, '0')
export const hex0x = (n: number, width = 4) => `0x${hex(n, width)}`
export const size = (fields: Field[]) => fields.reduce((n, f) => n + f.bytes.length, 0)
export const flat = (fields: Field[]) => fields.flatMap((f) => f.bytes)

// Deterministic "random-looking" bytes (keys, nonces, ciphertext). Seeded so
// server render and client render produce identical output — Math.random()
// here would be a hydration mismatch.
export function noise(n: number, seed: number): number[] {
  let x = seed >>> 0
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0
    out.push(x >>> 24)
  }
  return out
}

// RFC 1071 Internet checksum — one's-complement sum of 16-bit words.
export function checksum(bytes: number[]): number {
  let sum = 0
  for (let i = 0; i < bytes.length; i += 2) sum += (bytes[i] << 8) | (bytes[i + 1] ?? 0)
  while (sum >> 16) sum = (sum & 0xffff) + (sum >> 16)
  return ~sum & 0xffff
}

// ── addresses used by every lesson ──────────────────────────────────────
export const ADDR = {
  laptopIp: '192.168.1.10',
  laptopMac: '3c:22:fb:10:20:30',
  routerIp: '192.168.1.1',
  routerMac: 'a4:91:b1:00:00:01',
  dnsIp: '1.1.1.1',
  serverIp: '93.184.216.34',
  broadcastIp: '255.255.255.255',
  broadcastMac: 'ff:ff:ff:ff:ff:ff',
  noIp: '0.0.0.0',
}

// ── Ethernet ────────────────────────────────────────────────────────────
export function ethernet(srcMac: string, dstMac: string): Layer {
  const broadcast = dstMac === ADDR.broadcastMac
  return {
    kind: 'link',
    name: 'Ethernet',
    fields: [
      {
        name: 'Destination MAC', value: dstMac, bytes: macBytes(dstMac),
        note: broadcast
          ? t('All ones = broadcast. Every device on the local network receives this frame.', 'সব bit 1 মানে broadcast। লোকাল নেটওয়ার্কের প্রতিটা ডিভাইস এই frame পায়।')
          : t('The hardware address of the next device on this link — not the final destination. On a home network that is the router (going out) or your laptop (coming in).', 'এই link-এর পরের ডিভাইসের hardware address — চূড়ান্ত গন্তব্যের নয়। বাড়ির নেটওয়ার্কে সেটা router (বাইরে যাওয়ার সময়) বা আপনার ল্যাপটপ (ভেতরে আসার সময়)।'),
      },
      {
        name: 'Source MAC', value: srcMac, bytes: macBytes(srcMac),
        note: t('The hardware address of the network card that put this frame on the wire.', 'যে network card এই frame-টা তারে পাঠিয়েছে তার hardware address।'),
      },
      {
        name: 'EtherType', value: '0x0800 (IPv4)', bytes: u16(0x0800),
        note: t('Says what is inside the frame. 0x0800 means an IPv4 packet follows.', 'frame-এর ভেতরে কী আছে তা বলে। 0x0800 মানে এরপর একটা IPv4 packet আছে।'),
      },
    ],
  }
}

// ── IPv4 ────────────────────────────────────────────────────────────────
const PROTO_NAMES: Record<number, string> = { 6: 'TCP', 17: 'UDP' }

export function ipv4(src: string, dst: string, proto: 6 | 17, payloadLen: number, id: number, ttl = 64): Layer {
  const total = 20 + payloadLen
  const head = [...u8(0x45), ...u8(0), ...u16(total), ...u16(id), ...u16(0x4000), ...u8(ttl), ...u8(proto)]
  const tail = [...ipBytes(src), ...ipBytes(dst)]
  const sum = checksum([...head, 0, 0, ...tail])
  return {
    kind: 'ip',
    name: 'IPv4',
    fields: [
      { name: 'Version + header length', value: '4, 20 bytes', bytes: u8(0x45), note: t('First half: IP version 4. Second half: header length in 4-byte words (5 × 4 = 20 bytes).', 'প্রথম অর্ধেক: IP version 4। দ্বিতীয় অর্ধেক: header-এর দৈর্ঘ্য 4-byte word-এ (5 × 4 = 20 bytes)।') },
      { name: 'DSCP / ECN', value: '0', bytes: u8(0), note: t('Priority and congestion hints for routers. Zero means ordinary traffic.', 'router-দের জন্য priority আর congestion-এর ইঙ্গিত। শূন্য মানে সাধারণ traffic।') },
      { name: 'Total length', value: `${total} bytes`, bytes: u16(total), note: t('Size of the whole IP packet: this 20-byte header plus everything after it.', 'পুরো IP packet-এর মাপ: এই 20-byte header আর তার পরের সবকিছু।') },
      { name: 'Identification', value: hex0x(id), bytes: u16(id), note: t('A label used to reassemble the packet if a router has to split it into fragments.', 'কোনো router packet-টাকে টুকরো (fragment) করলে আবার জোড়া লাগানোর জন্য ব্যবহৃত label।') },
      { name: 'Flags + fragment offset', value: "Don't Fragment", bytes: u16(0x4000), note: t('The DF bit is set: routers must not split this packet. If it is too big they drop it and report back.', 'DF bit সেট করা: router এই packet ভাগ করতে পারবে না। বেশি বড় হলে তারা ফেলে দিয়ে খবর পাঠায়।') },
      { name: 'TTL', value: String(ttl), bytes: u8(ttl), note: t('Time To Live. Every router subtracts 1; at 0 the packet is thrown away. It stops lost packets circling forever.', 'Time To Live। প্রতিটা router 1 কমায়; 0 হলে packet ফেলে দেওয়া হয়। এতে হারানো packet চিরকাল ঘুরতে পারে না।') },
      { name: 'Protocol', value: `${proto} (${PROTO_NAMES[proto]})`, bytes: u8(proto), note: t('Which transport protocol is inside: 6 = TCP, 17 = UDP.', 'ভেতরে কোন transport protocol আছে: 6 = TCP, 17 = UDP।') },
      { name: 'Header checksum', value: hex0x(sum), bytes: u16(sum), note: t('Error check over the IP header only. Really computed here: add up the header in 16-bit words and you get all ones.', 'শুধু IP header-এর error check। এখানে সত্যিই হিসেব করা: header-টা 16-bit word-এ যোগ করলে সব bit 1 আসে।') },
      { name: 'Source IP', value: src, bytes: ipBytes(src), note: t('Who sent the packet. Replies come back to this address.', 'packet কে পাঠিয়েছে। উত্তর এই address-এই ফেরত আসে।') },
      { name: 'Destination IP', value: dst, bytes: ipBytes(dst), note: t('Where the packet is going. Every router on the way reads this to choose the next hop.', 'packet কোথায় যাচ্ছে। পথের প্রতিটা router এটা পড়েই পরের ধাপ বেছে নেয়।') },
    ],
  }
}

const pseudoHeader = (src: string, dst: string, proto: number, len: number) => [...ipBytes(src), ...ipBytes(dst), 0, proto, ...u16(len)]

// ── UDP ─────────────────────────────────────────────────────────────────
export function udp(src: string, dst: string, sport: number, dport: number, payload: number[]): Layer {
  const len = 8 + payload.length
  const head = [...u16(sport), ...u16(dport), ...u16(len)]
  const sum = checksum([...pseudoHeader(src, dst, 17, len), ...head, 0, 0, ...payload]) || 0xffff
  return {
    kind: 'transport',
    name: 'UDP',
    fields: [
      { name: 'Source port', value: String(sport), bytes: u16(sport), note: t('The port the sending program is listening on for a reply.', 'পাঠানো program যে port-এ উত্তরের জন্য অপেক্ষা করছে।') },
      { name: 'Destination port', value: String(dport), bytes: u16(dport), note: t('Which program on the destination machine should get this datagram.', 'গন্তব্য মেশিনের কোন program এই datagram পাবে।') },
      { name: 'Length', value: `${len} bytes`, bytes: u16(len), note: t('UDP header (8 bytes) plus the data.', 'UDP header (8 bytes) আর data মিলিয়ে মোট।') },
      { name: 'Checksum', value: hex0x(sum), bytes: u16(sum), note: t('Error check over the UDP header, the data, and the IP addresses. That is all the protection UDP gives — no retries, no ordering.', 'UDP header, data আর IP address-গুলোর error check। UDP এটুকু সুরক্ষাই দেয় — কোনো retry নেই, ক্রম ঠিক রাখা নেই।') },
    ],
  }
}

// ── TCP ─────────────────────────────────────────────────────────────────
export const FLAG = { FIN: 0x01, SYN: 0x02, PSH: 0x08, ACK: 0x10 }
const flagNames = (f: number) => (['SYN', 'ACK', 'PSH', 'FIN'] as const).filter((n) => f & FLAG[n]).join(', ')

export function tcp(src: string, dst: string, sport: number, dport: number, seq: number, ack: number, flags: number, payload: number[] = []): Layer {
  const len = 20 + payload.length
  const head = [...u16(sport), ...u16(dport), ...u32(seq), ...u32(ack), ...u8(0x50), ...u8(flags), ...u16(64240)]
  const sum = checksum([...pseudoHeader(src, dst, 6, len), ...head, 0, 0, 0, 0, ...payload])
  const hasAck = Boolean(flags & FLAG.ACK)
  return {
    kind: 'transport',
    name: 'TCP',
    fields: [
      { name: 'Source port', value: String(sport), bytes: u16(sport), note: t('The port of the sending program. With the IP address it identifies one end of the connection.', 'পাঠানো program-এর port। IP address-এর সঙ্গে মিলে এটা connection-এর একটা প্রান্ত চিহ্নিত করে।') },
      { name: 'Destination port', value: String(dport), bytes: u16(dport), note: t('The port of the receiving program — 80 for HTTP, 443 for HTTPS.', 'গ্রহণকারী program-এর port — HTTP-র জন্য 80, HTTPS-এর জন্য 443।') },
      { name: 'Sequence number', value: String(seq), bytes: u32(seq), note: t('The position of this segment’s first data byte in the sender’s stream. It is how the receiver puts bytes back in order.', 'পাঠানো পক্ষের stream-এ এই segment-এর প্রথম data byte-এর অবস্থান। এটা দিয়েই গ্রহণকারী byte-গুলো ঠিক ক্রমে সাজায়।') },
      { name: 'Acknowledgment number', value: hasAck ? String(ack) : '0 (unused)', bytes: u32(ack), note: hasAck ? t('"I have received everything before this byte — send this one next."', '"এই byte-এর আগের সবকিছু পেয়েছি — এরপর এটা পাঠাও।"') : t('Nothing to acknowledge yet, so this is zero and the ACK flag is off.', 'এখনও acknowledge করার কিছু নেই, তাই এটা শূন্য আর ACK flag বন্ধ।') },
      { name: 'Header length', value: '20 bytes', bytes: u8(0x50), note: t('TCP header size in 4-byte words (5 × 4 = 20). Real SYN segments usually add options such as maximum segment size; they are left out here to keep the header short.', 'TCP header-এর মাপ 4-byte word-এ (5 × 4 = 20)। আসল SYN segment-এ সাধারণত maximum segment size-এর মতো option থাকে; header ছোট রাখতে এখানে বাদ দেওয়া হয়েছে।') },
      { name: 'Flags', value: flagNames(flags), bytes: u8(flags), note: t('One bit per signal. SYN opens a connection, ACK confirms receipt, PSH says "hand this to the app now", FIN closes one direction.', 'প্রতিটা সংকেতের জন্য এক bit। SYN connection খোলে, ACK প্রাপ্তি নিশ্চিত করে, PSH বলে "এখনই app-কে দাও", FIN একটা দিক বন্ধ করে।') },
      { name: 'Window size', value: '64240 bytes', bytes: u16(64240), note: t('How much more data the sender of this segment is ready to receive. This is TCP’s flow control.', 'এই segment-এর প্রেরক আর কতটা data নিতে প্রস্তুত। এটাই TCP-র flow control।') },
      { name: 'Checksum', value: hex0x(sum), bytes: u16(sum), note: t('Error check over the TCP header, the data, and the IP addresses. A segment that fails it is silently dropped and later resent.', 'TCP header, data আর IP address-গুলোর error check। এতে ফেল করা segment চুপচাপ ফেলে দেওয়া হয় আর পরে আবার পাঠানো হয়।') },
      { name: 'Urgent pointer', value: '0', bytes: u16(0), note: t('A rarely used feature. Almost always zero.', 'খুব কম ব্যবহৃত একটা feature। প্রায় সবসময় শূন্য।') },
    ],
  }
}

// ── packet assembly ─────────────────────────────────────────────────────
export interface Endpoint { ip: string; mac: string }

export const LAPTOP: Endpoint = { ip: ADDR.laptopIp, mac: ADDR.laptopMac }
// Everything beyond the router reaches the laptop's link with the router's
// MAC, so remote hosts share it.
export const DNS: Endpoint = { ip: ADDR.dnsIp, mac: ADDR.routerMac }
export const SERVER: Endpoint = { ip: ADDR.serverIp, mac: ADDR.routerMac }
export const ROUTER: Endpoint = { ip: ADDR.routerIp, mac: ADDR.routerMac }

let ipId = 0x1c40
const nextId = () => (ipId = (ipId + 0x0111) & 0xffff)

export function udpPacket(from: Endpoint, to: Endpoint, sport: number, dport: number, app: Layer, opts: { dstMac?: string; ttl?: number } = {}): Layer[] {
  const payload = flat(app.fields)
  return [
    ethernet(from.mac, opts.dstMac ?? (from === LAPTOP ? ADDR.routerMac : ADDR.laptopMac)),
    ipv4(from.ip, to.ip, 17, 8 + payload.length, nextId(), opts.ttl ?? (from === LAPTOP ? 64 : 57)),
    udp(from.ip, to.ip, sport, dport, payload),
    app,
  ]
}

export function tcpPacket(from: Endpoint, to: Endpoint, sport: number, dport: number, seq: number, ack: number, flags: number, app?: Layer): Layer[] {
  const payload = app ? flat(app.fields) : []
  const layers: Layer[] = [
    ethernet(from.mac, from === LAPTOP ? ADDR.routerMac : ADDR.laptopMac),
    ipv4(from.ip, to.ip, 6, 20 + payload.length, nextId(), from === LAPTOP ? 64 : 57),
    tcp(from.ip, to.ip, sport, dport, seq, ack, flags, payload),
  ]
  if (app) layers.push(app)
  return layers
}
