// Network-layer and local-network lessons: IP, IPv6, ICMP, NTP, BGP,
// Ethernet + ARP, Wi-Fi, PPPoE, IGMP. Written from the public specifications
// (RFC 791, 8200, 4861, 792, 5905, 4271, 826, 2516, 2236; IEEE 802.3/802.11).
import { ADDR, FLAG, ascii, checksum, ethernet, flat, hex0x, ipBytes, macBytes, size, t, u16, u32, type Field, type L, type Layer } from '../packet'
import {
  LAPTOP, NTP_SRV, PC2, R1, R2, ROUTER, SERVER, TV, WEB, app, at, conversation, ethernet6, f, homeTopo, ip6Bytes, ipPacket, ipv6, layer, send, sum6,
  tcpPacket, udpPacket, far, type Endpoint, type Lesson, type NodeDef,
} from '../net'

const laptopNode = (x: number, y: number, sub = ADDR.laptopIp): NodeDef => ({ kind: 'laptop', label: t('Laptop', 'ল্যাপটপ'), sub, at: [x, y] })
const routerNode = (x: number, y: number, sub = ADDR.routerIp): NodeDef => ({ kind: 'router', label: t('Home router', 'বাড়ির router'), sub, at: [x, y] })

/** Ethernet header with a different EtherType. */
function eth(src: string, dst: string, type: number, what: string, note: L): Layer {
  const e = ethernet(src, dst)
  e.fields[2] = f('EtherType', `${hex0x(type)} (${what})`, u16(type), note)
  return e
}

/** ICMP message: type, code, checksum (really computed), then the rest. */
function icmp(name: string, type: number, typeName: string, typeNote: L, rest: Field[]): Layer {
  const sum = checksum([type, 0, 0, 0, ...flat(rest)])
  return layer('transport', name, [
    f('Type', `${type} (${typeName})`, [type], typeNote),
    f('Code', '0', [0], t('A sub-type. Zero here.', 'একটা উপ-ধরন। এখানে শূন্য।')),
    f('Checksum', hex0x(sum), u16(sum), t('Error check over the whole ICMP message.', 'পুরো ICMP message-এর error check।')),
    ...rest,
  ])
}

const echoRest = (seq: number): Field[] => [
  f('Identifier', '0x0001', u16(1), t('Lets the laptop tell its own ping apart from another program’s.', 'ল্যাপটপকে নিজের ping অন্য program-এর ping থেকে আলাদা করতে দেয়।')),
  f('Sequence number', String(seq), u16(seq), t('Goes up by one with each ping, so replies can be matched and losses counted.', 'প্রতি ping-এ এক বাড়ে, যাতে উত্তর মেলানো আর হারানো গোনা যায়।')),
  f('Data', '"abcdefghijklmnop"', ascii('abcdefghijklmnop'), t('Filler bytes. The reply must carry them back unchanged.', 'ভরাট byte। উত্তরে এগুলো অবিকল ফেরত আসতে হবে।')),
]
const echoReq = (seq = 1) => icmp('ICMP echo request', 8, 'echo request', t('8 = "are you there?" — what ping sends.', '8 = "তুমি আছ?" — ping যা পাঠায়।'), echoRest(seq))
const echoRep = (seq = 1) => icmp('ICMP echo reply', 0, 'echo reply', t('0 = "yes, I am here."', '0 = "হ্যাঁ, আছি।"'), echoRest(seq))

// ═══ IP ═════════════════════════════════════════════════════════════════
const WAN: Endpoint = { ip: '203.0.113.7', mac: '02:00:00:00:03:01' }
const ISP: Endpoint = { ip: '100.64.0.1', mac: '02:00:00:00:03:02' }

const ip: Lesson = {
  id: 'ip',
  name: 'IP',
  category: 'core',
  tagline: t('Addresses and hop-by-hop routing', 'address আর ধাপে ধাপে routing'),
  intro: t('IP has one job: get a packet from one address to another, one router at a time. No router knows the whole route — each only knows the next hop. IP makes no promise the packet arrives; that is left to TCP.', 'IP-র একটাই কাজ: একটা packet-কে এক address থেকে অন্য address-এ পৌঁছে দেওয়া, একটা একটা router ধরে। কোনো router পুরো পথ জানে না — প্রত্যেকে শুধু পরের ধাপটা জানে। packet পৌঁছবেই এমন কথা IP দেয় না; সেটা TCP-র দায়িত্ব।'),
  topo: {
    nodes: {
      laptop: laptopNode(0, 3), router: routerNode(2, 3),
      isp: { kind: 'router', label: t('ISP router', 'ISP router'), sub: ISP.ip, at: [4, 3], badge: 'isp' },
      internet: { kind: 'cloud', label: t('Internet', 'Internet'), at: [6.2, 3] },
      server: { ...WEB, at: [8.4, 3] },
    },
    links: [['laptop', 'router', 'wireless'], ['router', 'isp'], ['isp', 'internet'], ['internet', 'server']],
  },
  steps: [
    at('laptop', t('Local or far away?', 'কাছের না দূরের?'), t('The laptop compares the destination 93.184.216.34 with its own network 192.168.1.0/24. It does not match, so the packet goes to the default gateway — the router.', 'ল্যাপটপ গন্তব্য 93.184.216.34-কে নিজের নেটওয়ার্ক 192.168.1.0/24-এর সঙ্গে মেলায়। মিলছে না, তাই packet যাবে default gateway — router-এর কাছে।')),
    send('laptop', 'router', 'TTL 64', t('First hop', 'প্রথম ধাপ'), t('The IP header names the final destination, but the Ethernet frame is addressed only to the router. TTL starts at 64.', 'IP header-এ চূড়ান্ত গন্তব্য লেখা, কিন্তু Ethernet frame-টা শুধু router-এর উদ্দেশে। TTL শুরু হয় 64 থেকে।'), tcpPacket(LAPTOP, SERVER, 51000, 80, 1000, 0, FLAG.SYN)),
    at('router', t('Look up, rewrite, forward', 'খোঁজো, বদলাও, এগিয়ে দাও'), t('The router finds the best match in its routing table, swaps the private source address for its public one (NAT), subtracts 1 from TTL and recalculates the header checksum.', 'router তার routing table-এ সবচেয়ে ভালো মিল খোঁজে, private source address বদলে নিজের public address বসায় (NAT), TTL থেকে 1 কমায় আর header checksum আবার হিসেব করে।')),
    send('router', 'isp', 'TTL 63', t('Second hop', 'দ্বিতীয় ধাপ'), t('Same packet, new source address 203.0.113.7, TTL 63, and a brand-new Ethernet frame for this link. Compare the checksum with the previous step — it changed because the header changed.', 'একই packet, নতুন source address 203.0.113.7, TTL 63, আর এই link-এর জন্য একদম নতুন Ethernet frame। আগের ধাপের checksum-এর সঙ্গে মেলান — header বদলেছে বলে সেটাও বদলেছে।'), ipPacket(WAN, SERVER, 6, tcpPacket(WAN, SERVER, 51000, 80, 1000, 0, FLAG.SYN).slice(2), { dstMac: ISP.mac, ttl: 63 })),
    send('isp', 'server', 'TTL 62 …', t('Across the internet', 'internet পেরিয়ে'), t('Router after router repeats the same three steps: look up, subtract 1, forward. Typically 10 to 20 hops. If TTL ever reaches 0 the packet is dropped, so a routing loop cannot run forever.', 'একের পর এক router একই তিন কাজ করে: খোঁজো, 1 কমাও, এগিয়ে দাও। সাধারণত 10 থেকে 20 ধাপ। TTL 0 হলে packet ফেলে দেওয়া হয়, তাই routing loop চিরকাল চলতে পারে না।'), ipPacket(WAN, SERVER, 6, tcpPacket(WAN, SERVER, 51000, 80, 1000, 0, FLAG.SYN).slice(2), { ttl: 62 })),
    at('server', t('It is for me', 'এটা আমার'), t('The destination address matches the server’s own. It strips the IP header and hands what is inside to TCP, as the Protocol field says.', 'destination address server-এর নিজের সঙ্গে মেলে। সে IP header খুলে ভেতরের জিনিস TCP-কে দেয়, যেমন Protocol field বলছে।')),
  ],
}

// ═══ IPv6 ═══════════════════════════════════════════════════════════════
const LL = 'fe80::3e22:fbff:fe10:2030' // laptop link-local
const RLL = 'fe80::1'
const G6 = '2001:db8:1::3e22:fbff:fe10:2030'
const S6 = '2001:db8:ffff::34'

function icmp6(name: string, src: string, dst: string, type: number, typeName: string, typeNote: L, rest: Field[]): Layer[] {
  const body = [type, 0, 0, 0, ...flat(rest)]
  const sum = sum6(src, dst, 58, body)
  const msg = layer('transport', name, [
    f('Type', `${type} (${typeName})`, [type], typeNote),
    f('Code', '0', [0], t('A sub-type. Zero here.', 'একটা উপ-ধরন। এখানে শূন্য।')),
    f('Checksum', hex0x(sum), u16(sum), t('Covers the message and the IPv6 addresses.', 'message আর IPv6 address-গুলো মিলিয়ে হিসেব।')),
    ...rest,
  ])
  const multicast = dst.startsWith('ff02')
  const fromLaptop = src === LL || src === G6
  return [
    ethernet6(fromLaptop ? ADDR.laptopMac : ADDR.routerMac, multicast ? `33:33:00:00:00:0${dst.slice(-1)}` : fromLaptop ? ADDR.routerMac : ADDR.laptopMac),
    ipv6(src, dst, 58, 'ICMPv6', body.length, multicast || src === RLL ? 255 : 64),
    msg,
  ]
}

const ipv6Lesson: Lesson = {
  id: 'ipv6',
  name: 'IPv6',
  category: 'core',
  tagline: t('Enough addresses for everything', 'সবকিছুর জন্য যথেষ্ট address'),
  intro: t('IPv4 has about 4 billion addresses and ran out. IPv6 addresses are 128 bits long — enough for every device to have a public one, with no NAT. A device can even build its own address without asking a server.', 'IPv4-এ প্রায় 400 কোটি address, যা ফুরিয়ে গেছে। IPv6 address 128 bit লম্বা — প্রতিটা ডিভাইসের নিজস্ব public address হওয়ার মতো যথেষ্ট, NAT ছাড়াই। ডিভাইস কোনো server-কে না জিজ্ঞেস করেই নিজের address বানিয়ে নিতে পারে।'),
  topo: homeTopo({ server: { ...WEB, sub: S6 } }),
  steps: [
    at('laptop', t('A link-local address, self-made', 'নিজের বানানো link-local address'), t('On joining the network the laptop builds fe80::… from its own MAC address. It works only on this link, but that is enough to talk to the router.', 'নেটওয়ার্কে যোগ দিয়ে ল্যাপটপ নিজের MAC address থেকে fe80::… বানায়। এটা শুধু এই link-এ চলে, কিন্তু router-এর সঙ্গে কথা বলার জন্য যথেষ্ট।')),
    send('laptop', 'router', 'Router Solicitation', t('"Any routers here?"', '"এখানে কোনো router আছে?"'), t('Sent to ff02::2, the "all routers" multicast group. IPv6 has no broadcast.', 'পাঠানো হয় ff02::2-এ, "সব router" multicast group। IPv6-এ broadcast নেই।'), icmp6('ICMPv6 Router Solicitation', LL, 'ff02::2', 133, 'Router Solicitation', t('133 asks routers to announce themselves now.', '133 router-দের এখনই নিজেদের ঘোষণা করতে বলে।'), [
      f('Reserved', '0', u32(0), t('Unused.', 'অব্যবহৃত।')),
      f('Option: source link-layer address', ADDR.laptopMac, [1, 1, ...macBytes(ADDR.laptopMac)], t('The laptop’s MAC, so the router can answer without looking it up.', 'ল্যাপটপের MAC, যাতে router না খুঁজেই উত্তর দিতে পারে।')),
    ])),
    send('router', 'laptop', 'Router Advertisement', t('"Use this prefix"', '"এই prefix ব্যবহার করো"'), t('The router announces the network prefix 2001:db8:1::/64 and that it is the default gateway.', 'router নেটওয়ার্ক prefix 2001:db8:1::/64 ঘোষণা করে আর জানায় সে-ই default gateway।'), icmp6('ICMPv6 Router Advertisement', RLL, LL, 134, 'Router Advertisement', t('134 = a router announcing itself and the network’s settings.', '134 = একটা router নিজেকে আর নেটওয়ার্কের setting ঘোষণা করছে।'), [
      f('Hop limit + flags', '64, none', [64, 0], t('The hop limit hosts should use, and flags that would say "also use DHCPv6". None are set.', 'host-দের যে hop limit ব্যবহার করা উচিত, আর "DHCPv6-ও ব্যবহার করো" বলার flag। কোনোটাই সেট নয়।')),
      f('Router lifetime', '1800 seconds', u16(1800), t('How long this router may be used as the default gateway.', 'এই router-কে কতক্ষণ default gateway হিসেবে ব্যবহার করা যাবে।')),
      f('Reachable time + retransmit timer', '0, 0', [...u32(0), ...u32(0)], t('Timing hints for neighbour discovery. Zero means "use your defaults".', 'neighbour discovery-র সময়ের ইঙ্গিত। শূন্য মানে "নিজের default ব্যবহার করো"।')),
      f('Option: prefix', '2001:db8:1::/64', [3, 4, 64, 0xc0, ...u32(86400), ...u32(14400), ...u32(0), ...ip6Bytes('2001:db8:1::')], t('The network half of the address, 64 bits long, valid for a day. The flags say "build your own address from this".', 'address-এর নেটওয়ার্ক অর্ধেক, 64 bit লম্বা, এক দিনের জন্য বৈধ। flag বলছে "এটা থেকে নিজের address বানাও"।')),
    ])),
    at('laptop', t('A global address, no server needed', 'global address, server ছাড়াই'), t('Prefix + its own 64-bit interface ID = 2001:db8:1::3e22:fbff:fe10:2030. This is a real public address. (Real devices randomise the second half for privacy.)', 'Prefix + নিজের 64-bit interface ID = 2001:db8:1::3e22:fbff:fe10:2030। এটা একটা আসল public address। (আসল ডিভাইস গোপনীয়তার জন্য দ্বিতীয় অর্ধেক random করে।)')),
    send('laptop', 'server', 'Echo request', t('Straight to the server', 'সোজা server-এ'), t('A ping over IPv6. Notice the fixed 40-byte header, the two 16-byte addresses and that the source is the laptop’s own address all the way — no NAT.', 'IPv6-এ একটা ping। লক্ষ করুন নির্দিষ্ট 40-byte header, দুটো 16-byte address, আর source সারা পথ ল্যাপটপের নিজের address — NAT নেই।'), icmp6('ICMPv6 echo request', G6, S6, 128, 'echo request', t('128 = ping, the IPv6 version.', '128 = ping, IPv6 সংস্করণ।'), echoRest(1))),
    send('server', 'laptop', 'Echo reply', t('The reply', 'উত্তর'), t('The server answers the laptop’s global address directly.', 'server সরাসরি ল্যাপটপের global address-এ উত্তর দেয়।'), icmp6('ICMPv6 echo reply', S6, G6, 129, 'echo reply', t('129 = ping reply.', '129 = ping-এর উত্তর।'), echoRest(1))),
  ],
}

// ═══ ICMP ═══════════════════════════════════════════════════════════════
const dying = ipPacket(LAPTOP, SERVER, 1, [echoReq(2)], { ttl: 1 })
const quoted = [...flat(dying[1].fields), ...flat(dying[2].fields).slice(0, 8)]

const icmpLesson: Lesson = {
  id: 'icmp',
  name: 'ICMP',
  category: 'core',
  tagline: t('The network’s error and test messages', 'নেটওয়ার্কের error আর পরীক্ষার বার্তা'),
  intro: t('ICMP carries no user data. It is how the network reports problems and answers simple tests — the protocol behind ping and traceroute.', 'ICMP কোনো ব্যবহারকারীর data বহন করে না। নেটওয়ার্ক এটা দিয়েই সমস্যার খবর দেয় আর সহজ পরীক্ষার উত্তর দেয় — ping আর traceroute-এর পেছনের protocol।'),
  topo: homeTopo({ server: WEB }),
  steps: [
    at('laptop', t('You run ping example.com', 'আপনি ping example.com চালালেন'), t('Ping sends a small ICMP message and times how long the reply takes.', 'ping একটা ছোট ICMP message পাঠায় আর উত্তর আসতে কত সময় লাগে মাপে।')),
    send('laptop', 'server', 'Echo request', t('Echo request', 'Echo request'), t('ICMP sits directly on IP — there are no ports. The message is just a type, a checksum and some filler.', 'ICMP সরাসরি IP-র ওপরে বসে — কোনো port নেই। message-এ শুধু একটা type, একটা checksum আর কিছু ভরাট data।'), ipPacket(LAPTOP, SERVER, 1, [echoReq()])),
    send('server', 'laptop', 'Echo reply', t('Echo reply', 'Echo reply'), t('Same identifier, same sequence number, same data. The laptop reports the round-trip time, say 24 ms.', 'একই identifier, একই sequence number, একই data। ল্যাপটপ round-trip সময় জানায়, ধরুন 24 ms।'), ipPacket(SERVER, LAPTOP, 1, [echoRep()])),
    send('laptop', 'router', 'Echo, TTL 1', t('Traceroute: a packet meant to die', 'Traceroute: মরার জন্যই পাঠানো packet'), t('Traceroute sends the same request with TTL set to 1. The first router must subtract 1, reaches 0, and has to drop it.', 'Traceroute একই request পাঠায় TTL 1 করে। প্রথম router-কে 1 কমাতে হয়, 0 হয়ে যায়, আর সেটা ফেলে দিতে হয়।'), dying),
    send('router', 'laptop', 'Time exceeded', t('The router reports back', 'router খবর পাঠাল'), t('"Your packet expired here." The message quotes the start of the dropped packet, and its source address reveals the router. Repeat with TTL 2, 3, 4… and each router on the path names itself.', '"তোমার packet এখানে মেয়াদ হারিয়েছে।" message-এ ফেলে দেওয়া packet-এর শুরুটা উদ্ধৃত থাকে, আর এর source address থেকে router-টা চেনা যায়। TTL 2, 3, 4… দিয়ে আবার করলে পথের প্রতিটা router নিজের নাম জানায়।'), ipPacket(ROUTER, LAPTOP, 1, [icmp('ICMP time exceeded', 11, 'time exceeded', t('11 = TTL reached zero in transit.', '11 = পথে TTL শূন্য হয়ে গেছে।'), [
      f('Unused', '0', u32(0), t('Always zero in this message.', 'এই message-এ সবসময় শূন্য।')),
      f('Original packet', 'IP header + first 8 bytes', quoted, t('A copy of the dropped packet’s IP header and the first 8 bytes after it — enough for the laptop to know which of its packets this is about.', 'ফেলে দেওয়া packet-এর IP header আর তার পরের প্রথম 8 byte-এর copy — ল্যাপটপ যাতে বোঝে এটা তার কোন packet-এর কথা।')),
    ])])),
  ],
}

// ═══ NTP ════════════════════════════════════════════════════════════════
const NTP0 = 1767225600 + 2208988800 // 2026-01-01 00:00:00 UTC, counted from 1900
const stamp = (sec: number, frac: number) => [...u32(sec), ...u32(frac)]

function ntp(server: boolean): Layer {
  const zero = stamp(0, 0)
  return app(server ? 'NTP response' : 'NTP request', [
    f('Leap, version, mode', server ? 'v4, server' : 'v4, client', [server ? 0x24 : 0x23], t('Three small fields in one byte: leap-second warning, protocol version 4, and who is speaking (3 = client, 4 = server).', 'এক byte-এ তিনটে ছোট field: leap-second সতর্কতা, protocol version 4, আর কে বলছে (3 = client, 4 = server)।')),
    f('Stratum', server ? '2' : '0', [server ? 2 : 0], t('Distance from an atomic clock. 1 is wired to one; 2 syncs from a stratum-1 server.', 'atomic clock থেকে দূরত্ব। 1 সরাসরি তার সঙ্গে যুক্ত; 2 একটা stratum-1 server থেকে সময় নেয়।')),
    f('Poll + precision', server ? '64 s, ~1 µs' : '64 s, unknown', [6, server ? 0xec : 0], t('How often the client intends to ask, and how fine the clock’s resolution is.', 'client কত ঘনঘন জিজ্ঞেস করবে, আর ঘড়ির সূক্ষ্মতা কতটা।')),
    f('Root delay + dispersion', server ? 'about 15 ms, 30 ms' : '0', server ? [...u32(0x000003d7), ...u32(0x000007ae)] : [...zero], t('How far, in time, this server is from the reference clock and how uncertain that is.', 'সময়ের হিসেবে এই server reference clock থেকে কত দূরে, আর তাতে কতটা অনিশ্চয়তা।')),
    f('Reference ID', server ? '198.51.100.1' : '0', server ? ipBytes('198.51.100.1') : u32(0), t('Which upstream server this one syncs from.', 'এই server কোন upstream server থেকে সময় নেয়।')),
    f('Reference timestamp', server ? 'last synced' : '0', server ? stamp(NTP0 - 40, 0) : zero, t('When the server’s own clock was last corrected.', 'server-এর নিজের ঘড়ি শেষ কখন ঠিক করা হয়েছিল।')),
    f('Origin timestamp (T1)', server ? 'client’s send time' : '0', server ? stamp(NTP0 + 5, 0x1999999a) : zero, t('T1: when the client sent its request, copied back by the server.', 'T1: client কখন request পাঠিয়েছিল, server সেটা ফেরত copy করে।')),
    f('Receive timestamp (T2)', server ? 'server got it' : '0', server ? stamp(NTP0, 0x1eb851ec) : zero, t('T2: when the request reached the server, by the server’s clock.', 'T2: request কখন server-এ পৌঁছল, server-এর ঘড়ি অনুযায়ী।')),
    f('Transmit timestamp', server ? 'T3: server sent reply' : 'T1: client’s clock now', server ? stamp(NTP0, 0x1eb9bfb1) : stamp(NTP0 + 5, 0x1999999a), t('The sender’s clock at the moment of sending. Seconds since 1900 in the first 4 bytes, fractions of a second in the last 4.', 'পাঠানোর মুহূর্তে প্রেরকের ঘড়ি। প্রথম 4 byte-এ 1900 সাল থেকে সেকেন্ড, শেষ 4 byte-এ সেকেন্ডের ভগ্নাংশ।')),
  ])
}

const ntpLesson: Lesson = {
  id: 'ntp',
  name: 'NTP',
  category: 'core',
  tagline: t('Keeps every clock in step', 'সব ঘড়ি মিলিয়ে রাখে'),
  intro: t('Certificates, logs and logins all depend on clocks agreeing. NTP sets a clock over the network to within milliseconds — by measuring the network delay and cancelling it out.', 'certificate, log আর login সবই ঘড়ি মিলে থাকার ওপর নির্ভর করে। NTP নেটওয়ার্ক দিয়ে ঘড়ি মিলিসেকেন্ডের মধ্যে ঠিক করে — নেটওয়ার্কের দেরি মেপে সেটা বাদ দিয়ে।'),
  topo: homeTopo({ ntp: far(t('Time server', 'Time server'), NTP_SRV.ip, 'clock') }),
  steps: [
    at('laptop', t('The clock has drifted', 'ঘড়ি সরে গেছে'), t('Computer clocks gain or lose a few seconds a week. Here the laptop is 5 seconds fast and does not know it.', 'কম্পিউটারের ঘড়ি সপ্তাহে কয়েক সেকেন্ড এগোয় বা পিছোয়। এখানে ল্যাপটপ 5 সেকেন্ড এগিয়ে, আর সে তা জানে না।')),
    send('laptop', 'ntp', 'NTP request', t('"What time is it?"', '"কটা বাজে?"'), t('A 48-byte UDP datagram to port 123. Almost empty — the one thing that matters is the laptop’s own send time, T1.', 'port 123-এ একটা 48-byte UDP datagram। প্রায় ফাঁকা — গুরুত্বপূর্ণ শুধু ল্যাপটপের নিজের পাঠানোর সময়, T1।'), udpPacket(LAPTOP, NTP_SRV, 123, 123, ntp(false))),
    at('ntp', t('Two more timestamps', 'আরও দুটো timestamp'), t('The server notes when the request arrived (T2) and when its reply leaves (T3), both by its own accurate clock.', 'server লিখে রাখে request কখন এল (T2) আর উত্তর কখন বেরোচ্ছে (T3), দুটোই নিজের নির্ভুল ঘড়ি অনুযায়ী।')),
    send('ntp', 'laptop', 'NTP response', t('The answer', 'উত্তর'), t('It carries T1, T2 and T3. The laptop adds T4, the moment the reply lands.', 'এতে T1, T2 আর T3 থাকে। ল্যাপটপ T4 যোগ করে, যে মুহূর্তে উত্তর পৌঁছয়।'), udpPacket(NTP_SRV, LAPTOP, 123, 123, ntp(true))),
    at('laptop', t('Four numbers, one correction', 'চারটে সংখ্যা, একটা সংশোধন'), t('Round trip = (T4 − T1) − (T3 − T2). Assuming each direction took half of that, the laptop works out its clock is 5 seconds ahead and gently slows it until it matches.', 'Round trip = (T4 − T1) − (T3 − T2)। দুদিকেই অর্ধেক সময় লেগেছে ধরে নিয়ে ল্যাপটপ বোঝে তার ঘড়ি 5 সেকেন্ড এগিয়ে, আর মিলে না যাওয়া পর্যন্ত ধীরে ধীরে সেটা কমায়।')),
  ],
}

// ═══ BGP ════════════════════════════════════════════════════════════════
function bgp(name: string, type: number, typeName: string, body: Field[]): Layer {
  return app(name, [
    f('Marker', '16 × 0xff', new Array<number>(16).fill(0xff), t('Sixteen bytes of all ones mark the start of every BGP message.', 'ষোলো byte সব bit 1 — প্রতিটা BGP message-এর শুরু বোঝায়।')),
    f('Length', `${19 + size(body)} bytes`, u16(19 + size(body)), t('Size of the whole message, including this 19-byte header.', 'পুরো message-এর মাপ, এই 19-byte header-সহ।')),
    f('Type', `${type} (${typeName})`, [type], t('1 = OPEN, 2 = UPDATE, 3 = NOTIFICATION, 4 = KEEPALIVE.', '1 = OPEN, 2 = UPDATE, 3 = NOTIFICATION, 4 = KEEPALIVE।')),
    ...body,
  ])
}
const bgpOpen = (asn: number, id: string) => bgp('BGP OPEN', 1, 'OPEN', [
  f('Version', '4', [4], t('BGP version 4, in use since 1994.', 'BGP version 4, 1994 থেকে চালু।')),
  f('My AS', String(asn), u16(asn), t('The sender’s autonomous system number — the ID of the network it belongs to.', 'প্রেরকের autonomous system number — সে যে নেটওয়ার্কের অংশ তার ID।')),
  f('Hold time', '90 seconds', u16(90), t('If nothing is heard for this long, the neighbour is declared dead and all its routes are removed.', 'এতক্ষণ কিছু না শোনা গেলে প্রতিবেশীকে মৃত ধরে তার সব route মুছে ফেলা হয়।')),
  f('BGP identifier', id, ipBytes(id), t('A unique ID for this router, written like an IP address.', 'এই router-এর একটা অনন্য ID, IP address-এর মতো লেখা।')),
  f('Optional parameters', 'none', [0], t('Extra capabilities would be listed here. Left empty to keep the example short.', 'বাড়তি ক্ষমতা এখানে লেখা থাকত। উদাহরণ ছোট রাখতে ফাঁকা।')),
])
const pathAttrs = (path: number[], hop: string): Field[] => [
  f('ORIGIN', 'IGP', [0x40, 1, 1, 0], t('How the route was learned at its source. IGP = from inside that network.', 'উৎসে route-টা কীভাবে জানা গিয়েছিল। IGP = সেই নেটওয়ার্কের ভেতর থেকে।')),
  f('AS_PATH', path.join(' '), [0x40, 2, 2 + path.length * 2, 2, path.length, ...path.flatMap((n) => u16(n))], t('The list of networks this announcement has passed through. Each network adds its own number. Shorter paths are preferred, and a router rejects any path containing its own number — that prevents loops.', 'এই ঘোষণা যে নেটওয়ার্কগুলো পেরিয়ে এসেছে তার তালিকা। প্রতিটা নেটওয়ার্ক নিজের নম্বর যোগ করে। ছোট পথ বেশি পছন্দ, আর নিজের নম্বর থাকা পথ router বাতিল করে — এতে loop আটকায়।')),
  f('NEXT_HOP', hop, [0x40, 3, 4, ...ipBytes(hop)], t('Where to send packets for this destination.', 'এই গন্তব্যের packet কোথায় পাঠাতে হবে।')),
]
const bgpUpdate = (path: number[], hop: string) => bgp('BGP UPDATE', 2, 'UPDATE', [
  f('Withdrawn routes length', '0', u16(0), t('No routes are being taken back in this message.', 'এই message-এ কোনো route ফিরিয়ে নেওয়া হচ্ছে না।')),
  f('Path attributes length', `${size(pathAttrs(path, hop))} bytes`, u16(size(pathAttrs(path, hop))), t('Size of the attributes that follow.', 'পরের attribute-গুলোর মাপ।')),
  ...pathAttrs(path, hop),
  f('Announced prefix', '198.51.100.0/24', [24, 198, 51, 100], t('"I can reach these addresses." One byte for the prefix length, then only as many address bytes as needed.', '"এই address-গুলোয় আমি পৌঁছতে পারি।" এক byte prefix-এর দৈর্ঘ্য, তারপর যতটুকু দরকার ততটুকু address byte।')),
])
const R3: Endpoint = { ip: '192.0.2.1', mac: '02:00:00:00:02:03' }
const bgpTalk = conversation(R1, R2, 179)
const bgpTalk2 = conversation(R2, R3, 179)

const bgpLesson: Lesson = {
  id: 'bgp',
  name: 'BGP',
  category: 'core',
  tagline: t('How networks tell each other the way', 'নেটওয়ার্করা একে অপরকে পথ জানায় যেভাবে'),
  intro: t('The internet is about 75,000 separate networks — ISPs, companies, universities. BGP is how they tell each other which addresses they can reach. It runs on trust between neighbours, which is why one bad announcement can take part of the internet offline.', 'internet হল প্রায় 75,000 আলাদা নেটওয়ার্ক — ISP, কোম্পানি, বিশ্ববিদ্যালয়। BGP দিয়েই তারা একে অপরকে জানায় কোন address-এ তারা পৌঁছতে পারে। এটা প্রতিবেশীদের পারস্পরিক বিশ্বাসে চলে, তাই একটা ভুল ঘোষণা internet-এর একাংশ বন্ধ করে দিতে পারে।'),
  topo: {
    nodes: {
      r1: { kind: 'router', label: t('Network A', 'নেটওয়ার্ক A'), sub: 'AS 64500', at: [0, 2], badge: 'isp' },
      r2: { kind: 'router', label: t('Network B', 'নেটওয়ার্ক B'), sub: 'AS 64501', at: [3, 2], badge: 'isp' },
      r3: { kind: 'router', label: t('Network C', 'নেটওয়ার্ক C'), sub: 'AS 64502', at: [6, 2], badge: 'isp' },
    },
    links: [['r1', 'r2'], ['r2', 'r3']],
  },
  steps: [
    at('r1', t('Neighbours are set up by hand', 'প্রতিবেশী হাতে ঠিক করা'), t('Two networks agree to connect, and each engineer types in the other’s address and AS number. The routers then open a TCP connection on port 179.', 'দুটো নেটওয়ার্ক যুক্ত হতে রাজি হয়, আর দুপক্ষের engineer অন্যের address আর AS number লিখে দেয়। router-রা তারপর port 179-এ একটা TCP connection খোলে।')),
    send('r1', 'r2', 'OPEN', t('OPEN — introductions', 'OPEN — পরিচয়'), t('"I am AS 64500, speaking BGP 4, and I expect to hear from you every 90 seconds."', '"আমি AS 64500, BGP 4 বলছি, আর প্রতি 90 সেকেন্ডে তোমার কাছ থেকে শুনতে চাই।"'), bgpTalk.send(bgpOpen(64500, R1.ip))),
    send('r2', 'r1', 'OPEN', t('OPEN — the reply', 'OPEN — উত্তর'), t('Network B introduces itself the same way. Both confirm with a KEEPALIVE and the session is up.', 'নেটওয়ার্ক B একইভাবে নিজের পরিচয় দেয়। দুপক্ষ একটা KEEPALIVE দিয়ে নিশ্চিত করে, session চালু হয়।'), bgpTalk.reply(bgpOpen(64501, R2.ip))),
    send('r1', 'r2', 'UPDATE', t('UPDATE — "I can reach these"', 'UPDATE — "এগুলোয় আমি পৌঁছতে পারি"'), t('Network A announces its block 198.51.100.0/24, with the path so far: just itself.', 'নেটওয়ার্ক A নিজের block 198.51.100.0/24 ঘোষণা করে, এ পর্যন্ত পথ-সহ: শুধু সে নিজে।'), bgpTalk.send(bgpUpdate([64500], R1.ip))),
    at('r2', t('Record it, then pass it on', 'লিখে রাখো, তারপর এগিয়ে দাও'), t('Network B adds the route to its table and tells its own neighbours — after putting its own number in front of the path: 64501 64500.', 'নেটওয়ার্ক B route-টা নিজের table-এ যোগ করে আর নিজের প্রতিবেশীদের জানায় — পথের সামনে নিজের নম্বর বসিয়ে: 64501 64500।')),
    send('r2', 'r3', 'UPDATE', t('The announcement spreads', 'ঘোষণা ছড়িয়ে পড়ে'), t('Network C now knows: to reach 198.51.100.0/24, send to B, which sends to A. Within a few minutes every network on the internet has a path.', 'নেটওয়ার্ক C এখন জানে: 198.51.100.0/24-এ পৌঁছতে B-কে পাঠাও, সে A-কে পাঠাবে। কয়েক মিনিটের মধ্যে internet-এর প্রতিটা নেটওয়ার্কের কাছে একটা পথ থাকে।'), bgpTalk2.send(bgpUpdate([64501, 64500], R2.ip))),
    send('r1', 'r2', 'KEEPALIVE', t('KEEPALIVE — "still here"', 'KEEPALIVE — "এখনও আছি"'), t('Nineteen bytes, sent every 30 seconds. If they stop, the neighbour withdraws every route it learned — and traffic finds another way.', 'উনিশ byte, প্রতি 30 সেকেন্ডে পাঠানো। এগুলো থেমে গেলে প্রতিবেশী শেখা সব route ফিরিয়ে নেয় — আর traffic অন্য পথ খোঁজে।'), bgpTalk.send(bgp('BGP KEEPALIVE', 4, 'KEEPALIVE', []))),
  ],
}

// ═══ Ethernet + ARP ═════════════════════════════════════════════════════
function arp(reply: boolean): Layer[] {
  const [from, to] = reply ? [PC2, LAPTOP] : [LAPTOP, PC2]
  return [
    eth(from.mac, reply ? to.mac : ADDR.broadcastMac, 0x0806, 'ARP', t('0x0806 means an ARP message follows, not an IP packet.', '0x0806 মানে এরপর একটা ARP message আছে, IP packet নয়।')),
    layer('ip', reply ? 'ARP reply' : 'ARP request', [
      f('Hardware type', 'Ethernet (1)', u16(1), t('The kind of link this is about.', 'কোন ধরনের link নিয়ে কথা।')),
      f('Protocol type', 'IPv4 (0x0800)', u16(0x0800), t('The kind of address being looked up.', 'কোন ধরনের address খোঁজা হচ্ছে।')),
      f('Address lengths', '6 and 4 bytes', [6, 4], t('MAC addresses are 6 bytes, IPv4 addresses 4.', 'MAC address 6 bytes, IPv4 address 4।')),
      f('Operation', reply ? 'reply (2)' : 'request (1)', u16(reply ? 2 : 1), t('1 = "who has this IP?", 2 = "I do".', '1 = "এই IP কার?", 2 = "আমার"।')),
      f('Sender MAC', from.mac, macBytes(from.mac), t('The MAC address of whoever sent this message.', 'যে এই message পাঠিয়েছে তার MAC address।')),
      f('Sender IP', from.ip, ipBytes(from.ip), t('The sender’s IP. Everyone who hears this can learn the pair for free.', 'প্রেরকের IP। যে-ই এটা শোনে, জোড়াটা বিনা খরচে শিখে নিতে পারে।')),
      f('Target MAC', reply ? to.mac : '00:00:00:00:00:00', reply ? macBytes(to.mac) : new Array<number>(6).fill(0), reply ? t('The laptop that asked.', 'যে ল্যাপটপ জিজ্ঞেস করেছিল।') : t('Unknown — this is the very thing being asked for.', 'অজানা — এটাই তো জানতে চাওয়া হচ্ছে।')),
      f('Target IP', to.ip, ipBytes(to.ip), t('The IP address the question is about.', 'যে IP address নিয়ে প্রশ্ন।')),
    ]),
  ]
}

const ethernetLesson: Lesson = {
  id: 'ethernet',
  name: 'Ethernet',
  category: 'core',
  tagline: t('Frames, switches and ARP', 'frame, switch আর ARP'),
  intro: t('On a local network, devices are reached by MAC address, not IP. A switch learns which MAC is on which port, and ARP is how a device finds the MAC that goes with an IP.', 'লোকাল নেটওয়ার্কে ডিভাইসে পৌঁছনো হয় MAC address দিয়ে, IP দিয়ে নয়। switch শিখে নেয় কোন MAC কোন port-এ, আর ARP দিয়ে একটা ডিভাইস কোনো IP-র MAC খুঁজে পায়।'),
  topo: {
    nodes: {
      laptop: laptopNode(0, 2.6),
      switch: { kind: 'switch', label: t('Switch', 'Switch'), at: [2.4, 2.6] },
      pc2: { kind: 'laptop', label: t('Second PC', 'দ্বিতীয় PC'), sub: PC2.ip, at: [4.8, 2.6] },
      printer: { kind: 'box', label: t('Printer', 'Printer'), sub: '192.168.1.90', at: [2.4, 0.4] },
    },
    links: [['laptop', 'switch'], ['switch', 'pc2'], ['switch', 'printer']],
  },
  steps: [
    at('laptop', t('I know the IP, not the MAC', 'IP জানি, MAC জানি না'), t('The laptop wants to send to 192.168.1.20. That is on its own network, so it must deliver the frame itself — and for that it needs a MAC address.', 'ল্যাপটপ 192.168.1.20-এ পাঠাতে চায়। সেটা নিজের নেটওয়ার্কেই, তাই frame-টা নিজেকেই পৌঁছে দিতে হবে — আর তার জন্য একটা MAC address দরকার।')),
    send('laptop', 'pc2', 'ARP: who has .20?', t('ARP request, to everyone', 'ARP request, সবার কাছে'), t('The destination MAC is all ones — broadcast. The switch has no choice but to send it out of every port. The printer hears it too, and ignores it.', 'destination MAC সব bit 1 — broadcast। switch-এর উপায় নেই, সব port দিয়ে পাঠাতে হয়। printer-ও শোনে, আর উপেক্ষা করে।'), arp(false), { broadcast: true }),
    at('switch', t('The switch is learning', 'switch শিখছে'), t('The switch read the source MAC of that frame and noted "3c:22:fb:10:20:30 is on port 1". It builds its table from traffic alone — nobody configures it.', 'switch ওই frame-এর source MAC পড়ে লিখে রাখল "3c:22:fb:10:20:30 আছে port 1-এ"। সে শুধু traffic দেখেই table বানায় — কেউ configure করে না।')),
    send('pc2', 'laptop', 'ARP: .20 is 5c:f9…', t('ARP reply, to one device', 'ARP reply, একটা ডিভাইসে'), t('The second PC answers directly. The switch already knows where the laptop is, so only that port gets the frame — and now it learns the PC’s port as well.', 'দ্বিতীয় PC সরাসরি উত্তর দেয়। switch আগেই জানে ল্যাপটপ কোথায়, তাই শুধু সেই port-ই frame পায় — আর এবার সে PC-র port-ও শিখে নেয়।'), arp(true)),
    at('laptop', t('Cached', 'cache-এ রাখা'), t('The laptop stores the pair in its ARP table for a few minutes, so it does not have to ask before every packet.', 'ল্যাপটপ জোড়াটা কয়েক মিনিটের জন্য নিজের ARP table-এ রাখে, যাতে প্রতিটা packet-এর আগে জিজ্ঞেস করতে না হয়।')),
    send('laptop', 'pc2', 'Ping', t('The real frame', 'আসল frame'), t('Now the data can go: an IP packet inside an Ethernet frame addressed to the PC’s MAC. The switch forwards it out of exactly one port. The printer sees nothing.', 'এবার data যেতে পারে: PC-র MAC-এর উদ্দেশে Ethernet frame-এর ভেতরে একটা IP packet। switch সেটা ঠিক একটা port দিয়ে পাঠায়। printer কিছুই দেখে না।'), ipPacket(LAPTOP, PC2, 1, [echoReq()])),
  ],
}

// ═══ Wi-Fi ══════════════════════════════════════════════════════════════
const BSSID = 'a4:91:b1:00:00:02'
const le16 = (n: number) => [n & 0xff, (n >> 8) & 0xff]
const ssid = f('SSID', 'HomeWiFi', [0, 8, ...ascii('HomeWiFi')], t('The network’s name, as an element: ID 0, length 8, then the text.', 'নেটওয়ার্কের নাম, একটা element আকারে: ID 0, দৈর্ঘ্য 8, তারপর লেখাটা।'))
const rates = f('Supported rates', '1 – 54 Mbit/s', [1, 8, 0x82, 0x84, 0x8b, 0x96, 0x0c, 0x12, 0x18, 0x24], t('The basic speeds both sides must support. Modern speeds are advertised in further elements, left out here.', 'দুপক্ষকেই যে মৌলিক গতি সমর্থন করতে হবে। আধুনিক গতি আরও element-এ ঘোষণা হয়, এখানে বাদ দেওয়া।'))
const capability = f('Capabilities', 'infrastructure, privacy', le16(0x0411), t('Flags: this is an access point network, and encryption is required.', 'Flag: এটা access point নেটওয়ার্ক, আর encryption বাধ্যতামূলক।'))

function wifi(name: string, subtype: number, toAp: boolean | 'all', seq: number, body: Field[]): Layer[] {
  const [rx, tx] = toAp === 'all' ? [ADDR.broadcastMac, BSSID] : toAp ? [BSSID, ADDR.laptopMac] : [ADDR.laptopMac, BSSID]
  return [
    layer('link', '802.11', [
      f('Frame control', `management, ${name}`, [subtype << 4, 0], t('What kind of frame this is. Wi-Fi has three families: management (joining and leaving), control (acknowledgments) and data.', 'এটা কী ধরনের frame। Wi-Fi-তে তিন পরিবার: management (যোগ দেওয়া ও ছাড়া), control (acknowledgment) আর data।')),
      f('Duration', toAp === 'all' ? '0' : '314 µs', le16(toAp === 'all' ? 0 : 314), t('How long the air will be busy with this exchange. Every other device stays quiet for that long — Wi-Fi is a shared channel.', 'এই আদানপ্রদানে বাতাস কতক্ষণ ব্যস্ত থাকবে। অন্য সব ডিভাইস ততক্ষণ চুপ থাকে — Wi-Fi একটা ভাগ করা channel।')),
      f('Receiver address', rx, macBytes(rx), t('Who this frame is for.', 'এই frame কার জন্য।')),
      f('Transmitter address', tx, macBytes(tx), t('Who is transmitting.', 'কে পাঠাচ্ছে।')),
      f('BSSID', BSSID, macBytes(BSSID), t('The access point’s radio address, which identifies this Wi-Fi network. Wi-Fi headers carry three addresses, not Ethernet’s two.', 'access point-এর radio address, যা এই Wi-Fi নেটওয়ার্ককে চিহ্নিত করে। Wi-Fi header-এ তিনটে address থাকে, Ethernet-এর দুটোর বদলে।')),
      f('Sequence control', String(seq), le16(seq << 4), t('A frame counter, used to spot duplicates when a frame is resent. Wi-Fi fields are little-endian — low byte first.', 'একটা frame counter, frame আবার পাঠানো হলে নকল ধরতে ব্যবহৃত। Wi-Fi field little-endian — ছোট byte আগে।')),
    ]),
    layer('app', name, body),
  ]
}
const status = f('Status', 'success (0)', le16(0), t('Zero means accepted.', 'শূন্য মানে গৃহীত।'))

const wifiLesson: Lesson = {
  id: 'wifi',
  name: 'Wi-Fi',
  category: 'core',
  tagline: t('Joining a wireless network', 'wireless নেটওয়ার্কে যোগ দেওয়া'),
  intro: t('Before a single byte of your data moves, a laptop and an access point exchange a handful of management frames over the air. This lesson shows that join, frame by frame.', 'আপনার data-র একটা byte যাওয়ার আগেই ল্যাপটপ আর access point বাতাসে কয়েকটা management frame আদানপ্রদান করে। এই lesson-এ সেই যোগ দেওয়াটা frame ধরে ধরে দেখানো হয়েছে।'),
  topo: {
    nodes: {
      laptop: laptopNode(0, 2, 'no address yet'),
      ap: { kind: 'ap', label: t('Access point', 'Access point'), sub: 'HomeWiFi', at: [3, 2] },
    },
    links: [['laptop', 'ap', 'wireless']],
  },
  steps: [
    send('ap', 'laptop', 'Beacon', t('Beacon — "HomeWiFi is here"', 'Beacon — "HomeWiFi এখানে আছে"'), t('About ten times a second the access point announces itself to everyone in range. This is what fills the list of networks on your screen.', 'সেকেন্ডে প্রায় দশবার access point নাগালের সবাইকে নিজের কথা জানায়। আপনার screen-এর নেটওয়ার্ক তালিকা এ থেকেই ভরে।'), wifi('beacon', 8, 'all', 1201, [
      f('Timestamp', 'AP clock', [0x80, 0x1d, 0x2c, 0x04, 0, 0, 0, 0], t('The access point’s clock in microseconds. Devices sync to it so they can sleep between beacons.', 'access point-এর ঘড়ি microsecond-এ। ডিভাইস এর সঙ্গে মিলিয়ে নেয়, যাতে দুটো beacon-এর মাঝে ঘুমোতে পারে।')),
      f('Beacon interval', '100 time units (~102 ms)', le16(100), t('How often beacons are sent.', 'কত ঘনঘন beacon পাঠানো হয়।')),
      capability, ssid, rates,
      f('Channel', '6', [3, 1, 6], t('Which radio channel this network is on.', 'এই নেটওয়ার্ক কোন radio channel-এ।')),
    ]), { broadcast: true }),
    at('laptop', t('You pick the network', 'আপনি নেটওয়ার্ক বেছে নিলেন'), t('You click HomeWiFi and type the password. The password itself is never sent.', 'আপনি HomeWiFi-তে click করে password লিখলেন। password নিজে কখনও পাঠানো হয় না।')),
    send('laptop', 'ap', 'Authentication', t('Authentication request', 'Authentication request'), t('A leftover from early Wi-Fi: "open system" authentication simply says "I would like to join". The real proof of the password comes later, in the WPA handshake.', 'গোড়ার Wi-Fi-র অবশেষ: "open system" authentication শুধু বলে "আমি যোগ দিতে চাই"। password-এর আসল প্রমাণ আসে পরে, WPA handshake-এ।'), wifi('authentication', 11, true, 12, [
      f('Algorithm', 'open system (0)', le16(0), t('0 = open system. WPA3 networks use 3 (SAE) here instead — see the WPA3 lesson.', '0 = open system। WPA3 নেটওয়ার্ক এখানে 3 (SAE) ব্যবহার করে — WPA3 lesson দেখুন।')),
      f('Sequence', '1', le16(1), t('First message of the exchange.', 'আদানপ্রদানের প্রথম message।')),
      status,
    ])),
    send('ap', 'laptop', 'Authentication OK', t('Authentication response', 'Authentication response'), t('The access point agrees.', 'access point রাজি হয়।'), wifi('authentication', 11, false, 1202, [
      f('Algorithm', 'open system (0)', le16(0), t('Echoes the algorithm asked for.', 'যে algorithm চাওয়া হয়েছিল সেটাই ফেরত।')),
      f('Sequence', '2', le16(2), t('Second message.', 'দ্বিতীয় message।')),
      status,
    ])),
    send('laptop', 'ap', 'Association request', t('Association request', 'Association request'), t('"Here is what my radio can do. Let me in." The laptop lists its speeds and features.', '"আমার radio এগুলো পারে। আমাকে ঢুকতে দাও।" ল্যাপটপ নিজের গতি আর feature-এর তালিকা দেয়।'), wifi('association request', 0, true, 13, [
      capability,
      f('Listen interval', '10 beacons', le16(10), t('How many beacons the laptop may sleep through. The access point holds its frames meanwhile.', 'ল্যাপটপ কটা beacon ঘুমিয়ে কাটাতে পারে। ততক্ষণ access point তার frame ধরে রাখে।')),
      ssid, rates,
    ])),
    send('ap', 'laptop', 'Association response', t('Association response', 'Association response'), t('Accepted. The laptop gets an association ID — its seat number on this access point.', 'গৃহীত। ল্যাপটপ একটা association ID পায় — এই access point-এ তার আসন নম্বর।'), wifi('association response', 1, false, 1203, [
      capability, status,
      f('Association ID', '1', le16(0xc001), t('The laptop’s number on this access point, used in power-saving.', 'এই access point-এ ল্যাপটপের নম্বর, power-saving-এ ব্যবহৃত।')),
      rates,
    ])),
    at('laptop', t('Linked — but not online yet', 'যুক্ত — কিন্তু এখনও online নয়'), t('The radio link is up. Next come the WPA key handshake (see WPA3) and then DHCP, and only then can real traffic flow.', 'radio link চালু। এরপর আসে WPA key handshake (WPA3 দেখুন), তারপর DHCP, আর তবেই আসল traffic চলতে পারে।')),
  ],
}

// ═══ PPPoE ══════════════════════════════════════════════════════════════
const AC_MAC = '02:00:00:00:03:10'
const WAN_MAC = 'a4:91:b1:00:00:03'
const tag = (type: number, name: string, value: string, body: number[], note: L): Field => f(`Tag: ${name}`, value, [...u16(type), ...u16(body.length), ...body], note)
const serviceTag = tag(0x0101, 'Service-Name', 'any', [], t('Which service is wanted. Empty means "any".', 'কোন service চাই। ফাঁকা মানে "যেকোনো"।'))
const uniqTag = tag(0x0103, 'Host-Uniq', '0x00000a01', u32(0x0a01), t('A number chosen by the router so it can match replies to its own request.', 'router-এর বেছে নেওয়া সংখ্যা, যাতে নিজের request-এর সঙ্গে উত্তর মেলাতে পারে।'))
const acTag = tag(0x0102, 'AC-Name', 'isp-ac1', ascii('isp-ac1'), t('The name of the ISP’s access concentrator that answered.', 'যে ISP access concentrator উত্তর দিয়েছে তার নাম।'))

function pppoe(name: string, code: number, toIsp: boolean, session: number, tags: Field[], discovery = true): Layer[] {
  const dst = code === 0x09 ? ADDR.broadcastMac : toIsp ? AC_MAC : WAN_MAC
  return [
    eth(toIsp ? WAN_MAC : AC_MAC, dst, discovery ? 0x8863 : 0x8864, discovery ? 'PPPoE discovery' : 'PPPoE session', t('0x8863 = finding an access concentrator. 0x8864 = an established session carrying data.', '0x8863 = access concentrator খোঁজা। 0x8864 = চালু session, data বহন করছে।')),
    layer('ip', name, [
      f('Version + type', '1, 1', [0x11], t('Always 1 and 1.', 'সবসময় 1 আর 1।')),
      f('Code', hex0x(code, 2), [code], t('Which step this is: 0x09 PADI, 0x07 PADO, 0x19 PADR, 0x65 PADS, 0x00 session data.', 'এটা কোন ধাপ: 0x09 PADI, 0x07 PADO, 0x19 PADR, 0x65 PADS, 0x00 session data।')),
      f('Session ID', hex0x(session), u16(session), t('Zero until the ISP assigns one. Afterwards every frame carries it.', 'ISP একটা না দেওয়া পর্যন্ত শূন্য। এরপর প্রতিটা frame-এ এটা থাকে।')),
      f('Length', `${size(tags)} bytes`, u16(size(tags)), t('Size of what follows.', 'পরের অংশের মাপ।')),
      ...tags,
    ]),
  ]
}
const pppData = (() => {
  const inner = ipPacket(WAN, SERVER, 1, [echoReq()]).slice(1)
  const n = inner.reduce((a, l) => a + size(l.fields), 0) + 2
  const head = pppoe('PPPoE session', 0x00, true, 0x0011, [], false)
  head[1].fields[3] = f('Length', `${n} bytes`, u16(n), t('Size of the PPP frame that follows.', 'পরের PPP frame-এর মাপ।'))
  head[1].fields.push(f('PPP protocol', '0x0021 (IPv4)', u16(0x0021), t('What the PPP frame carries. 0x0021 is an ordinary IPv4 packet.', 'PPP frame কী বহন করছে। 0x0021 একটা সাধারণ IPv4 packet।')))
  return [...head, ...inner]
})()

const pppoeLesson: Lesson = {
  id: 'pppoe',
  name: 'PPPoE',
  category: 'core',
  tagline: t('How a broadband router logs in', 'broadband router যেভাবে login করে'),
  intro: t('Many fibre and DSL lines need the router to log in with a username and password before it gets an internet address. PPPoE runs that login directly over Ethernet, before IP exists on the link.', 'অনেক fibre আর DSL লাইনে router-কে internet address পাওয়ার আগে username আর password দিয়ে login করতে হয়। PPPoE সেই login সরাসরি Ethernet-এর ওপর চালায়, link-এ IP আসার আগেই।'),
  topo: {
    nodes: {
      router: routerNode(0, 2, 'WAN port'),
      isp: { kind: 'server', label: t('ISP access server', 'ISP access server'), sub: 'isp-ac1', at: [3.2, 2], badge: 'isp' },
      internet: { kind: 'cloud', label: t('Internet', 'Internet'), at: [5.8, 2] },
    },
    links: [['router', 'isp'], ['isp', 'internet']],
  },
  steps: [
    send('router', 'isp', 'PADI', t('PADI — "Any ISP out there?"', 'PADI — "কোনো ISP আছ?"'), t('The router has no address at all yet, so it broadcasts on the line.', 'router-এর এখনও কোনো address-ই নেই, তাই সে লাইনে broadcast করে।'), pppoe('PPPoE PADI', 0x09, true, 0, [serviceTag, uniqTag]), { broadcast: true }),
    send('isp', 'router', 'PADO', t('PADO — an offer', 'PADO — একটা প্রস্তাব'), t('The ISP’s access concentrator answers with its name.', 'ISP-র access concentrator নিজের নাম দিয়ে উত্তর দেয়।'), pppoe('PPPoE PADO', 0x07, false, 0, [serviceTag, uniqTag, acTag])),
    send('router', 'isp', 'PADR', t('PADR — "I choose you"', 'PADR — "তোমাকেই বেছে নিলাম"'), t('Now addressed to that one concentrator.', 'এবার শুধু সেই concentrator-এর উদ্দেশে।'), pppoe('PPPoE PADR', 0x19, true, 0, [serviceTag, uniqTag])),
    send('isp', 'router', 'PADS', t('PADS — session granted', 'PADS — session দেওয়া হল'), t('The ISP assigns session ID 0x0011. From here on the two ends have a private point-to-point link.', 'ISP session ID 0x0011 দেয়। এখান থেকে দুই প্রান্তের মধ্যে একটা নিজস্ব point-to-point link তৈরি হয়।'), pppoe('PPPoE PADS', 0x65, false, 0x0011, [serviceTag, uniqTag])),
    at('router', t('Log in, then get an address', 'login, তারপর address'), t('Inside the session, PPP takes over: the two sides agree on link settings, the router proves its username and password (CHAP), and the ISP hands it a public IP address.', 'session-এর ভেতরে PPP দায়িত্ব নেয়: দুপক্ষ link-এর setting ঠিক করে, router নিজের username আর password প্রমাণ করে (CHAP), আর ISP তাকে একটা public IP address দেয়।')),
    send('router', 'internet', 'IP inside PPPoE', t('Data flows', 'data চলছে'), t('Every packet now travels wrapped: Ethernet, then 6 bytes of PPPoE, 2 of PPP, then the IP packet. Those 8 extra bytes are why PPPoE lines use an MTU of 1492 instead of 1500.', 'এখন প্রতিটা packet মোড়া অবস্থায় যায়: Ethernet, তারপর 6 byte PPPoE, 2 byte PPP, তারপর IP packet। ওই বাড়তি 8 byte-এর জন্যই PPPoE লাইনে MTU 1500-র বদলে 1492।'), pppData),
  ],
}

// ═══ IGMP + multicast ═══════════════════════════════════════════════════
const GROUP: Endpoint = { ip: '239.1.1.1', mac: '01:00:5e:01:01:01', lan: true }
const ALL_HOSTS: Endpoint = { ip: '224.0.0.1', mac: '01:00:5e:00:00:01', lan: true }
const ALL_ROUTERS: Endpoint = { ip: '224.0.0.2', mac: '01:00:5e:00:00:02', lan: true }
const STREAM: Endpoint = { ip: '198.51.100.60', mac: ADDR.routerMac, lan: true }

function igmp(name: string, type: number, typeName: string, group: string, note: L): Layer {
  const sum = checksum([type, type === 0x11 ? 100 : 0, 0, 0, ...ipBytes(group)])
  return layer('transport', name, [
    f('Type', `${hex0x(type, 2)} (${typeName})`, [type], note),
    f('Max response time', type === 0x11 ? '10 seconds' : '0', [type === 0x11 ? 100 : 0], t('In a query: how long listeners may wait before answering, so they do not all reply at once.', 'query-তে: শ্রোতারা উত্তর দেওয়ার আগে কতক্ষণ অপেক্ষা করতে পারে, যাতে সবাই একসঙ্গে উত্তর না দেয়।')),
    f('Checksum', hex0x(sum), u16(sum), t('Error check over the 8-byte message.', '8-byte message-এর error check।')),
    f('Group address', group, ipBytes(group), t('The multicast group this message is about. 0.0.0.0 in a general query means "any group".', 'এই message যে multicast group নিয়ে। general query-তে 0.0.0.0 মানে "যেকোনো group"।')),
  ])
}

const igmpLesson: Lesson = {
  id: 'igmp',
  name: 'IGMP',
  category: 'core',
  tagline: t('Multicast: one stream, many viewers', 'Multicast: একটা stream, অনেক দর্শক'),
  intro: t('Live TV over a network would be wasteful if every viewer got a separate copy. With multicast the stream is sent once to a group address, and IGMP is how a device says "I want that group".', 'প্রতিটা দর্শক আলাদা copy পেলে নেটওয়ার্কে live TV অপচয় হত। multicast-এ stream একবারই একটা group address-এ পাঠানো হয়, আর IGMP দিয়ে একটা ডিভাইস বলে "আমি ওই group চাই"।'),
  topo: {
    nodes: {
      tv: { kind: 'box', label: t('TV box', 'TV box'), sub: TV.ip, at: [0, 3.4], badge: 'tv' },
      laptop: laptopNode(0, 1),
      router: routerNode(2.6, 2.2),
      source: { kind: 'server', label: t('TV stream source', 'TV stream-এর উৎস'), sub: '239.1.1.1', at: [5.6, 2.2], badge: 'video' },
    },
    links: [['tv', 'router'], ['laptop', 'router', 'wireless'], ['router', 'source']],
  },
  steps: [
    at('tv', t('You choose a channel', 'আপনি একটা channel বাছলেন'), t('Each channel is a multicast group. This one is 239.1.1.1.', 'প্রতিটা channel একটা multicast group। এটা হল 239.1.1.1।')),
    send('tv', 'router', 'IGMP join', t('Membership report — "count me in"', 'Membership report — "আমাকে ধরো"'), t('Sent to the group address itself, with TTL 1 so it never leaves the local network.', 'পাঠানো হয় group address-এই, TTL 1 দিয়ে যাতে লোকাল নেটওয়ার্কের বাইরে না যায়।'), ipPacket(TV, GROUP, 2, [igmp('IGMP membership report', 0x16, 'membership report', '239.1.1.1', t('0x16 = "I want to receive this group".', '0x16 = "আমি এই group পেতে চাই"।'))], { ttl: 1 })),
    at('router', t('A listener on this side', 'এদিকে একজন শ্রোতা'), t('The router notes that someone on the home network wants 239.1.1.1 and asks upstream for the stream. A switch watching these messages forwards the stream only to the TV’s port.', 'router লিখে রাখে বাড়ির নেটওয়ার্কে কেউ 239.1.1.1 চায়, আর upstream-এর কাছে stream চায়। এই message-গুলো নজরে রাখা switch stream-টা শুধু TV-র port-এ পাঠায়।')),
    send('source', 'tv', 'Video → 239.1.1.1', t('The stream arrives', 'stream পৌঁছল'), t('The destination is the group, not the TV. The MAC address is built from the group address: 01:00:5e plus its last 23 bits. The laptop did not join, so it gets nothing.', 'গন্তব্য group, TV নয়। MAC address বানানো হয় group address থেকে: 01:00:5e আর তার শেষ 23 bit। ল্যাপটপ join করেনি, তাই কিছুই পায় না।'), udpPacket(STREAM, GROUP, 5000, 5004, app('Video', [f('Payload', 'part of a video frame', ascii('MPEG-TS video packet …'), t('A slice of the video. Shortened — real ones are about 1,300 bytes.', 'video-র একটা টুকরো। ছোট করা — আসলটা প্রায় 1,300 bytes।'))]), { ttl: 12 })),
    send('router', 'tv', 'IGMP query', t('"Anyone still watching?"', '"কেউ এখনও দেখছ?"'), t('Every couple of minutes the router asks all hosts. If no report comes back for a group, it stops the stream.', 'কয়েক মিনিট অন্তর router সব host-কে জিজ্ঞেস করে। কোনো group-এর জন্য report না এলে সে stream বন্ধ করে দেয়।'), ipPacket(ROUTER, ALL_HOSTS, 2, [igmp('IGMP general query', 0x11, 'membership query', '0.0.0.0', t('0x11 = the router asking who is listening.', '0x11 = router জিজ্ঞেস করছে কে শুনছে।'))], { ttl: 1 })),
    send('tv', 'router', 'IGMP leave', t('Changing channel', 'channel বদল'), t('The TV tells all routers it is leaving, so the old stream can stop at once — then joins the new channel’s group.', 'TV সব router-কে জানায় সে ছেড়ে যাচ্ছে, যাতে পুরনো stream সঙ্গে সঙ্গে থামতে পারে — তারপর নতুন channel-এর group-এ যোগ দেয়।'), ipPacket(TV, ALL_ROUTERS, 2, [igmp('IGMP leave group', 0x17, 'leave group', '239.1.1.1', t('0x17 = "I no longer want this group".', '0x17 = "এই group আর চাই না"।'))], { ttl: 1 })),
  ],
}

export const NETWORK_LESSONS: Lesson[] = [ip, ipv6Lesson, icmpLesson, ntpLesson, bgpLesson, ethernetLesson, wifiLesson, pppoeLesson, igmpLesson]

export { echoReq, eth, le16, wifi }
