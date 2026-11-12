// Lesson scripts for the Network Protocol Visualizer (/tools/protocols).
// Each lesson is a list of steps; a step is either a packet travelling
// between two nodes (with its real bytes, built in ./packet) or a local
// event at one node. Written from the public protocol specifications
// (RFC 768, 791, 1035, 2131, 8446, 9110, 9293).
import {
  ADDR, DNS, FLAG, LAPTOP, ROUTER, SERVER, ascii, hex0x, ipBytes, macBytes, noise, size, t,
  tcpPacket, u8, u16, u24, u32, udpPacket, zeros,
  type Field, type L, type Layer,
} from './packet'

export type NodeId = 'laptop' | 'router' | 'internet' | 'dns' | 'server'

export interface Step {
  from: NodeId
  /** Omitted = something happening inside `from`, no packet on the wire. */
  to?: NodeId
  /** Local-network broadcast (DHCP) — drawn with ripples. */
  broadcast?: boolean
  /** The packet never arrives (UDP loss demo). */
  lost?: boolean
  label?: string
  title: L
  body: L
  layers?: Layer[]
}

export interface Lesson {
  id: string
  name: string
  tagline: L
  intro: L
  nodes: NodeId[]
  steps: Step[]
}

const f = (name: string, value: string, bytes: number[], note: L): Field => ({ name, value, bytes, note })
const app = (name: string, fields: Field[]): Layer => ({ kind: 'app', name, fields })

// ═══ DNS ════════════════════════════════════════════════════════════════
const DNS_ID = 0x1a2b
const qname = [7, ...ascii('example'), 3, ...ascii('com'), 0]

function dnsQuestion(): Field[] {
  return [
    f('Name', 'example.com', qname, t('The name being asked about, stored as length-prefixed labels: 7 "example", 3 "com", then 0 to end.', 'যে নামটা জানতে চাওয়া হচ্ছে, দৈর্ঘ্য-সহ label আকারে রাখা: 7 "example", 3 "com", শেষে 0।')),
    f('Type', 'A (1)', u16(1), t('Which kind of record is wanted. A = an IPv4 address.', 'কোন ধরনের record চাই। A = একটা IPv4 address।')),
    f('Class', 'IN (1)', u16(1), t('IN = Internet. In practice it is always this.', 'IN = Internet। বাস্তবে সবসময় এটাই থাকে।')),
  ]
}

function dnsHeader(flags: number, flagText: string, answers: number, flagNote: L): Field[] {
  return [
    f('Transaction ID', hex0x(DNS_ID), u16(DNS_ID), t('A random number chosen by the asker. The reply must carry the same ID, so the laptop can match answer to question.', 'প্রশ্নকারীর বেছে নেওয়া একটা random সংখ্যা। উত্তরে একই ID থাকতে হবে, যাতে ল্যাপটপ প্রশ্নের সঙ্গে উত্তর মেলাতে পারে।')),
    f('Flags', flagText, u16(flags), flagNote),
    f('Questions', '1', u16(1), t('How many questions this message carries.', 'এই message-এ কটা প্রশ্ন আছে।')),
    f('Answers', String(answers), u16(answers), t('How many answer records follow.', 'এরপর কটা answer record আছে।')),
    f('Authority records', '0', u16(0), t('Records pointing at the authoritative name servers. None here.', 'authoritative name server-এর দিকে নির্দেশ করা record। এখানে নেই।')),
    f('Additional records', '0', u16(0), t('Extra helpful records. None here.', 'বাড়তি সহায়ক record। এখানে নেই।')),
  ]
}

const dnsQuery = app('DNS query', [
  ...dnsHeader(0x0100, 'query, recursion desired', 0, t('Bit 15 is 0, so this is a question. The "recursion desired" bit asks the resolver to do all the lookups itself and return the final answer.', 'Bit 15 হল 0, তাই এটা প্রশ্ন। "recursion desired" bit resolver-কে বলে সব খোঁজাখুঁজি নিজে করে চূড়ান্ত উত্তরটা দিতে।')),
  ...dnsQuestion(),
])

const dnsAnswer = app('DNS response', [
  ...dnsHeader(0x8180, 'response, no error', 1, t('Bit 15 is 1, so this is an answer. "Recursion available" is set and the error code is 0 — success.', 'Bit 15 হল 1, তাই এটা উত্তর। "recursion available" সেট করা আর error code 0 — সফল।')),
  ...dnsQuestion(),
  f('Answer name', 'pointer → example.com', u16(0xc00c), t('Instead of repeating the name, two bytes point back to offset 12 of this message, where example.com is already written. This is DNS name compression.', 'নামটা আবার না লিখে, দুটো byte এই message-এর 12 নম্বর offset-এ ফেরত নির্দেশ করে, যেখানে example.com আগেই লেখা আছে। এটাই DNS name compression।')),
  f('Answer type', 'A (1)', u16(1), t('This record is an IPv4 address.', 'এই record একটা IPv4 address।')),
  f('Answer class', 'IN (1)', u16(1), t('Internet class.', 'Internet class।')),
  f('TTL', '3600 seconds', u32(3600), t('How long this answer may be cached — one hour. Until then the laptop will not ask again.', 'এই উত্তর কতক্ষণ cache-এ রাখা যাবে — এক ঘণ্টা। ততক্ষণ ল্যাপটপ আর জিজ্ঞেস করবে না।')),
  f('Data length', '4 bytes', u16(4), t('Size of the address that follows. IPv4 addresses are 4 bytes.', 'পরের address-টার মাপ। IPv4 address 4 bytes।')),
  f('Address', ADDR.serverIp, ipBytes(ADDR.serverIp), t('The answer: the IP address of example.com.', 'উত্তর: example.com-এর IP address।')),
])

const dns: Lesson = {
  id: 'dns',
  name: 'DNS',
  tagline: t('Turns a name into an address', 'নামকে address-এ বদলায়'),
  intro: t('Computers find each other by number, people remember names. DNS is the lookup in between — and it happens before almost everything else you do online.', 'কম্পিউটার একে অপরকে খোঁজে সংখ্যা দিয়ে, মানুষ মনে রাখে নাম। DNS হল মাঝখানের খোঁজ — আর online-এ প্রায় সবকিছুর আগে এটাই ঘটে।'),
  nodes: ['laptop', 'router', 'internet', 'dns'],
  steps: [
    { from: 'laptop', title: t('You type example.com', 'আপনি example.com টাইপ করলেন'), body: t('The browser needs an IP address before it can connect. It checks its own cache, then the operating system’s. Nothing there — so it has to ask.', 'connect করার আগে browser-এর একটা IP address দরকার। সে নিজের cache দেখে, তারপর operating system-এর। কোথাও নেই — তাই জিজ্ঞেস করতে হবে।') },
    { from: 'laptop', to: 'dns', label: 'DNS query', title: t('The question goes out', 'প্রশ্ন বেরিয়ে গেল'), body: t('One small UDP datagram to port 53 of the DNS resolver: "What is the A record for example.com?" No connection is set up first — DNS wants speed.', 'DNS resolver-এর 53 নম্বর port-এ একটা ছোট UDP datagram: "example.com-এর A record কী?" আগে কোনো connection তৈরি হয় না — DNS গতি চায়।'), layers: udpPacket(LAPTOP, DNS, 53124, 53, dnsQuery) },
    { from: 'dns', title: t('The resolver does the legwork', 'resolver খোঁজাখুঁজি করে'), body: t('If the answer is not in its cache, the resolver asks a root server, then the .com servers, then example.com’s own name server. You only see the final result.', 'উত্তর নিজের cache-এ না থাকলে resolver প্রথমে root server, তারপর .com server, তারপর example.com-এর নিজের name server-কে জিজ্ঞেস করে। আপনি শুধু শেষ ফলটা দেখেন।') },
    { from: 'dns', to: 'laptop', label: 'DNS response', title: t('The answer comes back', 'উত্তর ফিরে এল'), body: t('Same transaction ID, the question repeated, and one answer: 93.184.216.34, valid for 3600 seconds.', 'একই transaction ID, প্রশ্নটা আবার লেখা, আর একটা উত্তর: 93.184.216.34, 3600 সেকেন্ডের জন্য বৈধ।'), layers: udpPacket(DNS, LAPTOP, 53, 53124, dnsAnswer) },
    { from: 'laptop', title: t('Cached and ready', 'cache-এ রাখা, প্রস্তুত'), body: t('The laptop stores the answer for an hour and hands the address to the browser, which can now open a connection to the web server.', 'ল্যাপটপ উত্তরটা এক ঘণ্টার জন্য রেখে দেয় আর address-টা browser-কে দেয়, যে এবার web server-এ connection খুলতে পারে।') },
  ],
}

// ═══ UDP ════════════════════════════════════════════════════════════════
function voice(n: number): Layer {
  return app('Voice data', [
    f('Sequence', `packet ${n}`, u16(n), t('The app’s own counter. UDP does not number anything, so apps that care about order add their own.', 'app-এর নিজের counter। UDP কিছুই নম্বর দেয় না, তাই ক্রম দরকার হলে app নিজেই যোগ করে।')),
    f('Audio', '20 ms of sound', noise(24, 40 + n), t('A tiny slice of compressed audio. Shortened here — a real slice is about 160 bytes.', 'compressed audio-র একটা ছোট্ট টুকরো। এখানে ছোট করা — আসল টুকরো প্রায় 160 bytes।')),
  ])
}

const udpLesson: Lesson = {
  id: 'udp',
  name: 'UDP',
  tagline: t('Send it and hope', 'পাঠিয়ে দাও, বাকিটা ভাগ্য'),
  intro: t('UDP adds almost nothing on top of IP: two port numbers, a length and a checksum. No handshake, no acknowledgments, no resending. That makes it fast — and the right choice for live voice, video and games.', 'UDP IP-র ওপরে প্রায় কিছুই যোগ করে না: দুটো port নম্বর, একটা length আর একটা checksum। handshake নেই, acknowledgment নেই, আবার পাঠানো নেই। তাই এটা দ্রুত — live voice, video আর game-এর জন্য ঠিক পছন্দ।'),
  nodes: ['laptop', 'router', 'internet', 'server'],
  steps: [
    { from: 'laptop', title: t('A voice call is running', 'একটা voice call চলছে'), body: t('Every 20 milliseconds the app has a new slice of sound to send. It does not open a connection — it just starts sending.', 'প্রতি 20 মিলিসেকেন্ডে app-এর কাছে পাঠানোর জন্য শব্দের নতুন টুকরো আসে। সে কোনো connection খোলে না — সোজা পাঠাতে শুরু করে।') },
    { from: 'laptop', to: 'server', label: 'Datagram 1', title: t('Datagram 1 arrives', 'Datagram 1 পৌঁছল'), body: t('An 8-byte UDP header and the audio. The server plays it straight away. It sends nothing back to say it arrived.', '8-byte-এর UDP header আর audio। server সঙ্গে সঙ্গে সেটা বাজায়। পৌঁছেছে বলে কিছু ফেরত পাঠায় না।'), layers: udpPacket(LAPTOP, SERVER, 50000, 5004, voice(1)) },
    { from: 'laptop', to: 'server', lost: true, label: 'Datagram 2', title: t('Datagram 2 is lost', 'Datagram 2 হারিয়ে গেল'), body: t('A busy router somewhere on the internet drops it. Nobody is told. UDP has no acknowledgments, so the laptop never finds out.', 'internet-এর কোথাও একটা ব্যস্ত router সেটা ফেলে দেয়। কাউকে জানানো হয় না। UDP-তে acknowledgment নেই, তাই ল্যাপটপ কখনও জানতে পারে না।'), layers: udpPacket(LAPTOP, SERVER, 50000, 5004, voice(2)) },
    { from: 'laptop', to: 'server', label: 'Datagram 3', title: t('Datagram 3 arrives anyway', 'Datagram 3 তবুও পৌঁছল'), body: t('The next slice goes out on schedule. There is no waiting for the missing one — by the time it could be resent, that moment of the call has already passed.', 'পরের টুকরো সময়মতো বেরোয়। হারানোটার জন্য অপেক্ষা নেই — আবার পাঠাতে পাঠাতে call-এর সেই মুহূর্ত পেরিয়ে যেত।'), layers: udpPacket(LAPTOP, SERVER, 50000, 5004, voice(3)) },
    { from: 'server', title: t('A tiny gap, and the call goes on', 'সামান্য ফাঁক, call চলতে থাকে'), body: t('The server sees sequence 1, then 3. It covers the 20 ms hole with a guess and keeps playing. For live sound, a small glitch beats a long pause — that is the trade UDP makes.', 'server দেখে sequence 1, তারপর 3। সে 20 ms-এর ফাঁকটা আন্দাজে ভরে বাজাতে থাকে। live শব্দে লম্বা বিরতির চেয়ে ছোট ত্রুটি ভালো — UDP এই আপসটাই করে।') },
  ],
}

// ═══ TCP ════════════════════════════════════════════════════════════════
const C0 = 1000 // client initial sequence number
const S0 = 5000 // server initial sequence number
const hello = app('Data', [f('Payload', '"hello"', ascii('hello'), t('Five bytes of application data. TCP does not care what they mean — it only promises they arrive, in order, exactly once.', 'application data-র পাঁচ byte। এর মানে কী তা নিয়ে TCP-র মাথাব্যথা নেই — সে শুধু কথা দেয় এগুলো ঠিক ক্রমে, ঠিক একবার পৌঁছবে।'))])

const tcpLesson: Lesson = {
  id: 'tcp',
  name: 'TCP',
  tagline: t('Reliable, ordered delivery', 'নির্ভরযোগ্য, ক্রম-মানা ডেলিভারি'),
  intro: t('TCP turns an unreliable network into a dependable stream of bytes. It does that with three ideas: a handshake to agree on starting numbers, a number on every byte, and an acknowledgment for everything received.', 'TCP একটা অনির্ভরযোগ্য নেটওয়ার্ককে ভরসাযোগ্য byte-এর স্রোতে বদলে দেয়। তিনটে ধারণা দিয়ে: শুরুর সংখ্যা ঠিক করতে handshake, প্রতিটা byte-এ একটা নম্বর, আর যা পাওয়া গেল তার acknowledgment।'),
  nodes: ['laptop', 'router', 'internet', 'server'],
  steps: [
    { from: 'laptop', to: 'server', label: 'SYN', title: t('Handshake 1 of 3 — SYN', 'Handshake 3-এর 1 — SYN'), body: t('"I want to talk. My byte numbering starts at 1000." Only the SYN flag is set; no data yet.', '"আমি কথা বলতে চাই। আমার byte-এর নম্বর 1000 থেকে শুরু।" শুধু SYN flag সেট; এখনও কোনো data নেই।'), layers: tcpPacket(LAPTOP, SERVER, 51000, 80, C0, 0, FLAG.SYN) },
    { from: 'server', to: 'laptop', label: 'SYN, ACK', title: t('Handshake 2 of 3 — SYN, ACK', 'Handshake 3-এর 2 — SYN, ACK'), body: t('"Got it — I expect your byte 1001 next. My own numbering starts at 5000." One segment both acknowledges and opens the return direction.', '"পেয়েছি — এরপর তোমার 1001 নম্বর byte চাই। আমার নিজের নম্বর 5000 থেকে শুরু।" একটাই segment acknowledge-ও করে, ফেরার দিকও খোলে।'), layers: tcpPacket(SERVER, LAPTOP, 80, 51000, S0, C0 + 1, FLAG.SYN | FLAG.ACK) },
    { from: 'laptop', to: 'server', label: 'ACK', title: t('Handshake 3 of 3 — ACK', 'Handshake 3-এর 3 — ACK'), body: t('"And I expect your byte 5001." Both sides now know the other can send and receive. The connection is open.', '"আর আমি তোমার 5001 নম্বর byte চাই।" দুপক্ষই এখন জানে অন্যজন পাঠাতে ও নিতে পারে। connection খোলা।'), layers: tcpPacket(LAPTOP, SERVER, 51000, 80, C0 + 1, S0 + 1, FLAG.ACK) },
    { from: 'laptop', to: 'server', label: 'PSH, ACK · "hello"', title: t('Sending data', 'data পাঠানো'), body: t('Five bytes, "hello", numbered 1001 to 1005. The laptop keeps a copy and starts a timer in case no acknowledgment comes.', 'পাঁচ byte, "hello", নম্বর 1001 থেকে 1005। ল্যাপটপ একটা copy রেখে timer চালু করে, যদি acknowledgment না আসে।'), layers: tcpPacket(LAPTOP, SERVER, 51000, 80, C0 + 1, S0 + 1, FLAG.PSH | FLAG.ACK, hello) },
    { from: 'server', to: 'laptop', label: 'ACK', title: t('The server acknowledges', 'server acknowledge করল'), body: t('Acknowledgment number 1006: "everything up to byte 1005 arrived." The laptop cancels its timer and throws away its copy. Had this not come, it would have sent "hello" again.', 'Acknowledgment number 1006: "1005 নম্বর byte পর্যন্ত সব পৌঁছেছে।" ল্যাপটপ timer বন্ধ করে copy ফেলে দেয়। এটা না এলে সে "hello" আবার পাঠাত।'), layers: tcpPacket(SERVER, LAPTOP, 80, 51000, S0 + 1, C0 + 6, FLAG.ACK) },
    { from: 'laptop', to: 'server', label: 'FIN, ACK', title: t('Closing — the laptop is done', 'বন্ধ করা — ল্যাপটপের কাজ শেষ'), body: t('FIN means "I have nothing more to send." It closes only this direction; the server may still send.', 'FIN মানে "আমার আর পাঠানোর কিছু নেই।" এটা শুধু এই দিকটা বন্ধ করে; server তখনও পাঠাতে পারে।'), layers: tcpPacket(LAPTOP, SERVER, 51000, 80, C0 + 6, S0 + 1, FLAG.FIN | FLAG.ACK) },
    { from: 'server', to: 'laptop', label: 'FIN, ACK', title: t('The server closes too', 'server-ও বন্ধ করল'), body: t('The server acknowledges the FIN (which counts as one byte, so 1007) and sends its own FIN in the same segment.', 'server FIN-টা acknowledge করে (এটা এক byte হিসেবে গোনা হয়, তাই 1007) আর একই segment-এ নিজের FIN পাঠায়।'), layers: tcpPacket(SERVER, LAPTOP, 80, 51000, S0 + 1, C0 + 7, FLAG.FIN | FLAG.ACK) },
    { from: 'laptop', to: 'server', label: 'ACK', title: t('Final ACK', 'শেষ ACK'), body: t('The laptop acknowledges the server’s FIN. Both directions are closed and the connection is gone.', 'ল্যাপটপ server-এর FIN acknowledge করে। দুটো দিকই বন্ধ, connection শেষ।'), layers: tcpPacket(LAPTOP, SERVER, 51000, 80, C0 + 7, S0 + 2, FLAG.ACK) },
  ],
}

// ═══ HTTP ═══════════════════════════════════════════════════════════════
const line = (name: string, text: string, note: L): Field => f(name, text, ascii(`${text}\r\n`), note)
const blank = f('Blank line', '(end of headers)', ascii('\r\n'), t('An empty line marks the end of the headers. Anything after it is the body.', 'একটা ফাঁকা লাইন header-এর শেষ বোঝায়। এর পরের সবকিছু body।'))

const hostNote = t('Which website is wanted. One server can host many sites on one IP address, so this header is required.', 'কোন website চাই। একটা server একই IP address-এ অনেক site রাখতে পারে, তাই এই header বাধ্যতামূলক।')
const uaNote = t('Identifies the browser, so the server can adapt its response.', 'browser-এর পরিচয় দেয়, যাতে server উত্তর মানিয়ে নিতে পারে।')

const htmlBody = '<h1>Hello</h1><link rel="stylesheet" href="/style.css">'
const cssBody = 'h1 { color: teal; }'

const httpGet = (path: string, accept: string) => app('HTTP request', [
  line('Request line', `GET ${path} HTTP/1.1`, t('Method, path, version. GET means "send me this resource".', 'Method, path, version। GET মানে "এই resource-টা আমাকে পাঠাও"।')),
  line('Host', 'Host: example.com', hostNote),
  line('User-Agent', 'User-Agent: ExampleBrowser/1.0', uaNote),
  line('Accept', `Accept: ${accept}`, t('The formats the browser would like back.', 'browser যে format-গুলো ফেরত পেতে চায়।')),
  blank,
])

const httpOk = (type: string, body: string) => app('HTTP response', [
  line('Status line', 'HTTP/1.1 200 OK', t('Version, status code, reason. 200 = success. 404 would mean not found, 500 a server error.', 'Version, status code, কারণ। 200 = সফল। 404 মানে পাওয়া যায়নি, 500 মানে server error।')),
  line('Content-Type', `Content-Type: ${type}`, t('What kind of data the body is, so the browser knows how to treat it.', 'body কী ধরনের data, যাতে browser বোঝে সেটা নিয়ে কী করতে হবে।')),
  line('Content-Length', `Content-Length: ${body.length}`, t('Size of the body in bytes. It tells the browser exactly where this response ends, so the connection can be reused.', 'body-র মাপ byte-এ। এটা browser-কে ঠিক বলে দেয় এই response কোথায় শেষ, যাতে connection আবার ব্যবহার করা যায়।')),
  blank,
  f('Body', body, ascii(body), t('The resource itself.', 'আসল resource-টা।')),
])

const req1 = httpGet('/', 'text/html')
const res1 = httpOk('text/html', htmlBody)
const req2 = httpGet('/style.css', 'text/css')
const res2 = httpOk('text/css', cssBody)
const [nReq1, nRes1, nReq2] = [size(req1.fields), size(res1.fields), size(req2.fields)]

const httpLesson: Lesson = {
  id: 'http',
  name: 'HTTP',
  tagline: t('Ask for a page, get a page', 'page চাও, page পাও'),
  intro: t('HTTP is a plain-text conversation: the browser sends a request, the server sends a response. Every web page starts this way.', 'HTTP একটা plain-text কথোপকথন: browser একটা request পাঠায়, server একটা response পাঠায়। প্রতিটা web page এভাবেই শুরু হয়।'),
  nodes: ['laptop', 'router', 'internet', 'server'],
  steps: [
    { from: 'laptop', title: t('A TCP connection is already open', 'একটা TCP connection আগে থেকেই খোলা'), body: t('DNS gave the address and the three-way handshake to port 80 is done (see the DNS and TCP lessons). HTTP rides on top of that connection.', 'DNS address দিয়েছে আর port 80-তে three-way handshake হয়ে গেছে (DNS ও TCP lesson দেখুন)। HTTP সেই connection-এর ওপরে চলে।') },
    { from: 'laptop', to: 'server', label: 'GET /', title: t('The request', 'request'), body: t('A few lines of readable text: the method and path, then headers, then a blank line. Nothing here is encrypted — anyone on the path can read it.', 'কয়েক লাইন পড়া-যায়-এমন text: method আর path, তারপর header, তারপর ফাঁকা লাইন। এখানে কিছুই encrypt করা নয় — পথের যে কেউ পড়তে পারে।'), layers: tcpPacket(LAPTOP, SERVER, 51000, 80, C0 + 1, S0 + 1, FLAG.PSH | FLAG.ACK, req1) },
    { from: 'server', to: 'laptop', label: '200 OK · HTML', title: t('The response', 'response'), body: t('A status line, headers describing the body, a blank line, then the HTML itself.', 'একটা status line, body-র বর্ণনা দেওয়া header, ফাঁকা লাইন, তারপর আসল HTML।'), layers: tcpPacket(SERVER, LAPTOP, 80, 51000, S0 + 1, C0 + 1 + nReq1, FLAG.PSH | FLAG.ACK, res1) },
    { from: 'laptop', title: t('The browser reads the HTML', 'browser HTML পড়ে'), body: t('It finds a link to /style.css. A page is rarely one file — each stylesheet, script and image is another request.', 'সে /style.css-এর একটা link পায়। একটা page কদাচিৎ একটাই file — প্রতিটা stylesheet, script আর ছবি আলাদা request।') },
    { from: 'laptop', to: 'server', label: 'GET /style.css', title: t('A second request, same connection', 'দ্বিতীয় request, একই connection'), body: t('HTTP/1.1 keeps the connection open, so there is no new handshake. Notice the TCP sequence number has moved on by exactly the size of the first request.', 'HTTP/1.1 connection খোলা রাখে, তাই নতুন handshake নেই। লক্ষ করুন TCP sequence number ঠিক প্রথম request-এর মাপ অনুযায়ী এগিয়েছে।'), layers: tcpPacket(LAPTOP, SERVER, 51000, 80, C0 + 1 + nReq1, S0 + 1 + nRes1, FLAG.PSH | FLAG.ACK, req2) },
    { from: 'server', to: 'laptop', label: '200 OK · CSS', title: t('The stylesheet arrives', 'stylesheet পৌঁছল'), body: t('Same shape as before, different Content-Type.', 'আগের মতোই গড়ন, শুধু Content-Type আলাদা।'), layers: tcpPacket(SERVER, LAPTOP, 80, 51000, S0 + 1 + nRes1, C0 + 1 + nReq1 + nReq2, FLAG.PSH | FLAG.ACK, res2) },
    { from: 'laptop', title: t('The page is drawn', 'page আঁকা হল'), body: t('With the HTML and CSS in hand the browser paints a teal heading. Two requests, two responses, one connection.', 'HTML আর CSS হাতে পেয়ে browser একটা teal রঙের heading আঁকে। দুটো request, দুটো response, একটা connection।') },
  ],
}

// ═══ HTTPS (TLS 1.3) ════════════════════════════════════════════════════
const ext = (type: number, name: string, value: string, body: number[], note: L): Field =>
  f(`Extension: ${name}`, value, [...u16(type), ...u16(body.length), ...body], note)

function tlsHello(isClient: boolean): Layer {
  const sni = ascii('example.com')
  const key = noise(32, isClient ? 7 : 11)
  const keyShare = [...u16(0x001d), ...u16(32), ...key]
  const keyNote = t('The sender’s half of an X25519 key exchange. Each side combines its own secret with the other’s half and reaches the same shared key — without that key ever crossing the network.', 'X25519 key exchange-এ প্রেরকের অর্ধেক। প্রতিটা পক্ষ নিজের secret-এর সঙ্গে অন্যের অর্ধেক মিলিয়ে একই shared key-তে পৌঁছয় — সেই key কখনও নেটওয়ার্ক পেরোয় না।')
  const extensions: Field[] = isClient
    ? [
        ext(0x0000, 'server_name', 'example.com', [...u16(sni.length + 3), 0, ...u16(sni.length), ...sni], t('The site name, sent in the clear so the server can pick the right certificate. This is the one thing an observer can still read.', 'site-এর নাম, খোলাখুলি পাঠানো যাতে server ঠিক certificate বেছে নিতে পারে। পর্যবেক্ষক এখনও এই একটা জিনিসই পড়তে পারে।')),
        ext(0x000a, 'supported_groups', 'x25519', [...u16(2), ...u16(0x001d)], t('The key-exchange curves the client can use.', 'client যে key-exchange curve ব্যবহার করতে পারে।')),
        ext(0x000d, 'signature_algorithms', 'ecdsa_secp256r1_sha256, rsa_pss_rsae_sha256', [...u16(4), ...u16(0x0403), ...u16(0x0804)], t('The signature types the client will accept on the server’s certificate.', 'server-এর certificate-এ client যে ধরনের signature মেনে নেবে।')),
        ext(0x002b, 'supported_versions', 'TLS 1.3', [2, ...u16(0x0304)], t('The real version negotiation. 0x0304 = TLS 1.3.', 'আসল version ঠিক করা। 0x0304 = TLS 1.3।')),
        ext(0x0033, 'key_share', 'x25519, 32-byte public key', [...u16(keyShare.length), ...keyShare], keyNote),
      ]
    : [
        ext(0x002b, 'supported_versions', 'TLS 1.3', u16(0x0304), t('The server confirms TLS 1.3.', 'server TLS 1.3 নিশ্চিত করে।')),
        ext(0x0033, 'key_share', 'x25519, 32-byte public key', keyShare, keyNote),
      ]
  const body: Field[] = [
    f('Legacy version', '0x0303', u16(0x0303), t('Says "TLS 1.2" for compatibility with old network equipment. The real version is in the supported_versions extension.', 'পুরনো network যন্ত্রের সঙ্গে মানিয়ে চলতে "TLS 1.2" বলে। আসল version আছে supported_versions extension-এ।')),
    f('Random', '32 random bytes', noise(32, isClient ? 3 : 5), t('Fresh random bytes mixed into the keys, so no two connections ever share keys.', 'key-তে মেশানো টাটকা random byte, যাতে দুটো connection-এর key কখনও এক না হয়।')),
    f('Session ID', 'empty', u8(0), t('A leftover from older TLS versions. Empty here.', 'পুরনো TLS version-এর অবশেষ। এখানে ফাঁকা।')),
    ...(isClient
      ? [
          f('Cipher suites', 'AES-128-GCM, AES-256-GCM, ChaCha20-Poly1305', [...u16(6), ...u16(0x1301), ...u16(0x1302), ...u16(0x1303)], t('The encryption methods the client supports, in order of preference.', 'client যে encryption পদ্ধতিগুলো জানে, পছন্দের ক্রমে।')),
          f('Compression', 'none', [1, 0], t('TLS 1.3 never compresses. Always "none".', 'TLS 1.3 কখনও compress করে না। সবসময় "none"।')),
        ]
      : [
          f('Cipher suite', 'TLS_AES_128_GCM_SHA256', u16(0x1301), t('The server picks one method from the client’s list.', 'server client-এর তালিকা থেকে একটা পদ্ধতি বেছে নেয়।')),
          f('Compression', 'none', u8(0), t('Always "none" in TLS 1.3.', 'TLS 1.3-এ সবসময় "none"।')),
        ]),
    f('Extensions length', `${size(extensions)} bytes`, u16(size(extensions)), t('Total size of the extensions that follow.', 'পরের extension-গুলোর মোট মাপ।')),
    ...extensions,
  ]
  const n = size(body)
  return app(isClient ? 'TLS ClientHello' : 'TLS ServerHello', [
    f('Record header', `handshake, ${n + 4} bytes`, [0x16, ...u16(isClient ? 0x0301 : 0x0303), ...u16(n + 4)], t('Every TLS message travels in a record: one byte of type (0x16 = handshake), a version, and a length.', 'প্রতিটা TLS message একটা record-এ যায়: এক byte type (0x16 = handshake), একটা version, আর একটা length।')),
    f('Handshake type', isClient ? 'ClientHello (1)' : 'ServerHello (2)', [isClient ? 1 : 2, ...u24(n)], t('Which handshake message this is, plus its length.', 'এটা কোন handshake message, সঙ্গে তার length।')),
    ...body,
  ])
}

function tlsEncrypted(name: string, what: string, n: number, seed: number, note: L): Layer {
  return app(name, [
    f('Record header', `application data, ${n} bytes`, [0x17, ...u16(0x0303), ...u16(n)], t('Type 0x17 = application data. Once encryption starts, every record wears this label, so an observer cannot tell handshake from web traffic.', 'Type 0x17 = application data। encryption শুরু হলে প্রতিটা record-এ এই label থাকে, তাই পর্যবেক্ষক handshake আর web traffic আলাদা করতে পারে না।')),
    f('Encrypted', what, noise(n, seed), note),
  ])
}

const clientHello = tlsHello(true)
const serverHello = tlsHello(false)
const serverFlight = tlsEncrypted('TLS encrypted handshake', 'certificate, signature, Finished', 64, 21, t('Encrypted with the new keys: the server’s certificate, a signature proving it holds the matching private key, and a Finished check. Shortened here — the real one is 2–4 KB.', 'নতুন key দিয়ে encrypt করা: server-এর certificate, একটা signature যা প্রমাণ করে তার কাছে মিলে যাওয়া private key আছে, আর একটা Finished check। এখানে ছোট করা — আসলটা 2–4 KB।'))
const clientFinished = tlsEncrypted('TLS encrypted handshake', 'Finished', 53, 23, t('A keyed hash of the whole handshake. If anyone had altered a single byte of it in transit, this would not match and the connection would be dropped.', 'পুরো handshake-এর একটা keyed hash। পথে কেউ এর একটা byte-ও বদলালে এটা মিলত না আর connection ফেলে দেওয়া হত।'))
const encRequest = tlsEncrypted('TLS application data', 'GET / HTTP/1.1 …', 96, 27, t('The very same HTTP request as in the HTTP lesson — but all an observer sees is this. The last 16 bytes are an authentication tag that detects tampering.', 'HTTP lesson-এর সেই একই HTTP request — কিন্তু পর্যবেক্ষক শুধু এটুকুই দেখে। শেষ 16 byte একটা authentication tag, যা কারচুপি ধরে।'))
const encResponse = tlsEncrypted('TLS application data', 'HTTP/1.1 200 OK …', 128, 29, t('The HTTP response, encrypted. Only the laptop holds the key to open it.', 'HTTP response, encrypt করা। এটা খোলার key শুধু ল্যাপটপের কাছেই আছে।'))

// running TCP sequence numbers for the TLS exchange
const tlsC = [size(clientHello.fields), size(clientFinished.fields), size(encRequest.fields)]
const tlsS = [size(serverHello.fields), size(serverFlight.fields), size(encResponse.fields)]
const cAt = (i: number) => C0 + 1 + tlsC.slice(0, i).reduce((a, b) => a + b, 0)
const sAt = (i: number) => S0 + 1 + tlsS.slice(0, i).reduce((a, b) => a + b, 0)
const PA = FLAG.PSH | FLAG.ACK

const httpsLesson: Lesson = {
  id: 'https',
  name: 'HTTPS',
  tagline: t('HTTP inside an encrypted tunnel', 'encrypted সুড়ঙ্গের ভেতরে HTTP'),
  intro: t('HTTPS is ordinary HTTP wrapped in TLS. Before any page data moves, the two sides agree on secret keys and the server proves who it is. This lesson shows TLS 1.3.', 'HTTPS হল TLS-এ মোড়া সাধারণ HTTP। page-এর কোনো data যাওয়ার আগে দুপক্ষ গোপন key ঠিক করে আর server প্রমাণ দেয় সে কে। এই lesson-এ TLS 1.3 দেখানো হয়েছে।'),
  nodes: ['laptop', 'router', 'internet', 'server'],
  steps: [
    { from: 'laptop', title: t('TCP is connected to port 443', 'TCP port 443-এ connected'), body: t('Same three-way handshake as always, but to port 443. Nothing is encrypted yet.', 'সেই একই three-way handshake, তবে port 443-এ। এখনও কিছু encrypt করা নয়।') },
    { from: 'laptop', to: 'server', label: 'ClientHello', title: t('ClientHello', 'ClientHello'), body: t('"Here are the encryption methods I know, the site I want, and my half of a key exchange." Sent in the clear.', '"এই হল আমার জানা encryption পদ্ধতি, যে site চাই তার নাম, আর key exchange-এ আমার অর্ধেক।" খোলাখুলি পাঠানো।'), layers: tcpPacket(LAPTOP, SERVER, 51000, 443, cAt(0), sAt(0), PA, clientHello) },
    { from: 'server', to: 'laptop', label: 'ServerHello', title: t('ServerHello', 'ServerHello'), body: t('The server picks one method and sends its own half of the key exchange. From this moment both sides can compute the same keys — and nobody watching can.', 'server একটা পদ্ধতি বেছে নিয়ে key exchange-এ নিজের অর্ধেক পাঠায়। এই মুহূর্ত থেকে দুপক্ষই একই key বের করতে পারে — নজর রাখা কেউ পারে না।'), layers: tcpPacket(SERVER, LAPTOP, 443, 51000, sAt(0), cAt(1), PA, serverHello) },
    { from: 'server', to: 'laptop', label: 'Encrypted: certificate', title: t('The server proves its identity', 'server নিজের পরিচয় প্রমাণ করে'), body: t('Already encrypted: the certificate for example.com, a signature made with its private key, and a Finished message.', 'এর মধ্যেই encrypt করা: example.com-এর certificate, তার private key দিয়ে করা একটা signature, আর একটা Finished message।'), layers: tcpPacket(SERVER, LAPTOP, 443, 51000, sAt(1), cAt(1), PA, serverFlight) },
    { from: 'laptop', title: t('The laptop checks everything', 'ল্যাপটপ সব যাচাই করে'), body: t('Is the certificate for example.com? Is it in date? Is it signed by an authority this device trusts? Does the signature match? If any answer is no, you get the browser’s warning page.', 'certificate-টা কি example.com-এর? মেয়াদ আছে? এই ডিভাইস বিশ্বাস করে এমন authority-র সই করা? signature মিলছে? একটাও "না" হলে browser-এর সতর্কবার্তার page আসে।') },
    { from: 'laptop', to: 'server', label: 'Encrypted: Finished', title: t('Client Finished', 'Client Finished'), body: t('The laptop confirms it saw the same handshake the server did. The tunnel is ready — after one round trip.', 'ল্যাপটপ নিশ্চিত করে server যে handshake দেখেছে সে-ও তাই দেখেছে। সুড়ঙ্গ তৈরি — মাত্র এক round trip-এ।'), layers: tcpPacket(LAPTOP, SERVER, 51000, 443, cAt(1), sAt(2), PA, clientFinished) },
    { from: 'laptop', to: 'server', label: 'Encrypted request', title: t('The HTTP request, encrypted', 'HTTP request, encrypt করা'), body: t('Inside is a normal "GET / HTTP/1.1". On the wire it is unreadable bytes. An observer learns the server’s IP address and roughly how much data moved — not the page, not the path, not your password.', 'ভেতরে একটা সাধারণ "GET / HTTP/1.1"। তারের ওপরে সেটা অপাঠ্য byte। পর্যবেক্ষক জানে server-এর IP address আর মোটামুটি কতটা data গেল — page নয়, path নয়, আপনার password নয়।'), layers: tcpPacket(LAPTOP, SERVER, 51000, 443, cAt(2), sAt(2), PA, encRequest) },
    { from: 'server', to: 'laptop', label: 'Encrypted response', title: t('The response, encrypted', 'response, encrypt করা'), body: t('The laptop decrypts it and checks the authentication tag. The browser gets its HTML exactly as in the HTTP lesson — only the journey was private.', 'ল্যাপটপ সেটা decrypt করে authentication tag যাচাই করে। browser HTTP lesson-এর মতোই HTML পায় — শুধু যাত্রাটা ছিল গোপন।'), layers: tcpPacket(SERVER, LAPTOP, 443, 51000, sAt(2), cAt(3), PA, encResponse) },
  ],
}

// ═══ DHCP ═══════════════════════════════════════════════════════════════
const XID = 0x3903f326
const LEASE = 86400
const MSG = ['', 'Discover', 'Offer', 'Request', '', 'ACK']

const opt = (code: number, name: string, value: string, body: number[], note: L): Field =>
  f(`Option ${code}: ${name}`, value, [code, body.length, ...body], note)

function dhcp(type: 1 | 2 | 3 | 5): Layer {
  const fromServer = type === 2 || type === 5
  const yours = fromServer ? ADDR.laptopIp : ADDR.noIp
  const offerOpts: Field[] = [
    opt(54, 'Server identifier', ADDR.routerIp, ipBytes(ADDR.routerIp), t('Which DHCP server this is. If several servers answer, the client names the one it chose.', 'এটা কোন DHCP server। একাধিক server উত্তর দিলে client যাকে বেছেছে তার নাম বলে।')),
    opt(51, 'Lease time', `${LEASE} seconds (1 day)`, u32(LEASE), t('How long the address is yours. Halfway through, the laptop quietly asks to renew.', 'address-টা কতক্ষণ আপনার। অর্ধেক সময় পেরোলে ল্যাপটপ চুপচাপ renew করতে চায়।')),
    opt(1, 'Subnet mask', '255.255.255.0', [255, 255, 255, 0], t('Which addresses are on the local network (192.168.1.x) and which must go through the router.', 'কোন address-গুলো লোকাল নেটওয়ার্কে (192.168.1.x) আর কোনগুলো router দিয়ে যেতে হবে।')),
    opt(3, 'Router', ADDR.routerIp, ipBytes(ADDR.routerIp), t('The default gateway — where to send everything that is not local.', 'default gateway — লোকাল নয় এমন সবকিছু যেখানে পাঠাতে হবে।')),
    opt(6, 'DNS server', ADDR.dnsIp, ipBytes(ADDR.dnsIp), t('Where to send DNS questions. This is how the laptop in the DNS lesson knew whom to ask.', 'DNS প্রশ্ন কোথায় পাঠাতে হবে। DNS lesson-এর ল্যাপটপ এভাবেই জেনেছিল কাকে জিজ্ঞেস করবে।')),
  ]
  const options: Field[] = [
    opt(53, 'Message type', `${MSG[type]} (${type})`, [type], t('Which of the four DHCP steps this is: Discover, Offer, Request or ACK.', 'এটা DHCP-র চার ধাপের কোনটা: Discover, Offer, Request না ACK।')),
    ...(type === 1 ? [opt(55, 'Parameter request list', 'subnet mask, router, DNS, lease time', [1, 3, 6, 51], t('The settings the laptop would like to be told.', 'ল্যাপটপ যে setting-গুলো জানতে চায়।'))] : []),
    ...(type === 3
      ? [
          opt(50, 'Requested IP address', ADDR.laptopIp, ipBytes(ADDR.laptopIp), t('"I would like the address you offered."', '"তুমি যে address-টা দিতে চেয়েছ, সেটাই চাই।"')),
          offerOpts[0],
        ]
      : []),
    ...(fromServer ? offerOpts : []),
    f('End', '255', [255], t('Marks the end of the options.', 'option-এর শেষ বোঝায়।')),
  ]
  return app(`DHCP ${MSG[type]}`, [
    f('Operation', fromServer ? 'reply (2)' : 'request (1)', [fromServer ? 2 : 1], t('1 = from a client, 2 = from a server.', '1 = client থেকে, 2 = server থেকে।')),
    f('Hardware type + length', 'Ethernet, 6-byte address', [1, 6], t('The kind of hardware address used below: Ethernet MAC, 6 bytes.', 'নিচে কোন ধরনের hardware address ব্যবহৃত: Ethernet MAC, 6 bytes।')),
    f('Hops', '0', [0], t('Counts relay agents passed through. Zero on a home network.', 'কটা relay agent পেরিয়েছে তার গোনা। বাড়ির নেটওয়ার্কে শূন্য।')),
    f('Transaction ID', hex0x(XID, 8), u32(XID), t('A random number chosen by the laptop. All four messages carry it, so replies can be matched even before the laptop has an address.', 'ল্যাপটপের বেছে নেওয়া random সংখ্যা। চারটে message-এই এটা থাকে, তাই ল্যাপটপের address হওয়ার আগেই উত্তর মেলানো যায়।')),
    f('Seconds + flags', '0, 0', zeros(4), t('Time since the laptop started asking, and a flag for clients that can only hear broadcasts. Both zero here.', 'ল্যাপটপ কতক্ষণ ধরে জিজ্ঞেস করছে, আর শুধু broadcast শুনতে পারে এমন client-এর জন্য একটা flag। এখানে দুটোই শূন্য।')),
    f('Client IP', ADDR.noIp, ipBytes(ADDR.noIp), t('The laptop’s current address. It has none yet, so zero.', 'ল্যাপটপের বর্তমান address। এখনও নেই, তাই শূন্য।')),
    f('Your IP', yours, ipBytes(yours), fromServer ? t('The address the server is handing out.', 'server যে address-টা দিচ্ছে।') : t('Filled in by the server. Empty in messages from the client.', 'server ভরে দেয়। client-এর message-এ ফাঁকা।')),
    f('Server IP + relay IP', '0.0.0.0, 0.0.0.0', zeros(8), t('Used for network booting and relays. Unused here.', 'network booting আর relay-র জন্য। এখানে অব্যবহৃত।')),
    f('Client hardware address', ADDR.laptopMac, [...macBytes(ADDR.laptopMac), ...zeros(10)], t('The laptop’s MAC address, padded to 16 bytes. With no IP address yet, this is how the laptop is identified.', 'ল্যাপটপের MAC address, 16 bytes পর্যন্ত ভরাট করা। এখনও IP address নেই বলে এটা দিয়েই ল্যাপটপকে চেনা হয়।')),
    f('Server name + boot file', 'unused (192 zero bytes)', zeros(192), t('Left over from BOOTP, the protocol DHCP grew out of. Almost always empty — 192 bytes of zeros in every message.', 'BOOTP-র অবশেষ, যে protocol থেকে DHCP এসেছে। প্রায় সবসময় ফাঁকা — প্রতিটা message-এ 192 byte শূন্য।')),
    f('Magic cookie', '0x63825363', u32(0x63825363), t('A fixed value that says "DHCP options follow".', 'একটা নির্দিষ্ট মান যা বলে "এরপর DHCP option আছে"।')),
    ...options,
  ])
}

const NOBODY = { ip: ADDR.noIp, mac: ADDR.laptopMac }
const EVERYONE = { ip: ADDR.broadcastIp, mac: ADDR.broadcastMac }
const bcast = { dstMac: ADDR.broadcastMac, ttl: 64 }

const dhcpLesson: Lesson = {
  id: 'dhcp',
  name: 'DHCP',
  tagline: t('How a device gets its address', 'ডিভাইস কীভাবে address পায়'),
  intro: t('When you join a network your laptop knows nothing: no address, no router, no DNS server. DHCP hands all of that over in four messages, often remembered as DORA — Discover, Offer, Request, Acknowledge.', 'নেটওয়ার্কে যোগ দেওয়ার সময় আপনার ল্যাপটপ কিছুই জানে না: address নেই, router নেই, DNS server নেই। DHCP চারটে message-এ এ সবই দিয়ে দেয়, যাকে প্রায়ই DORA বলে মনে রাখা হয় — Discover, Offer, Request, Acknowledge।'),
  nodes: ['laptop', 'router'],
  steps: [
    { from: 'laptop', title: t('You join the Wi-Fi', 'আপনি Wi-Fi-এ যোগ দিলেন'), body: t('The laptop is connected but has no IP address, and does not know who could give it one.', 'ল্যাপটপ connected, কিন্তু IP address নেই, আর কে দিতে পারে তাও জানে না।') },
    { from: 'laptop', to: 'router', broadcast: true, label: 'DHCP Discover', title: t('Discover — "Is anyone there?"', 'Discover — "কেউ আছ?"'), body: t('With nobody to address it to, the laptop shouts to everyone: from 0.0.0.0 to 255.255.255.255, with a broadcast MAC address.', 'কাকে পাঠাবে জানা নেই বলে ল্যাপটপ সবাইকে ডাক দেয়: 0.0.0.0 থেকে 255.255.255.255-এ, broadcast MAC address দিয়ে।'), layers: udpPacket(NOBODY, EVERYONE, 68, 67, dhcp(1), bcast) },
    { from: 'router', to: 'laptop', label: 'DHCP Offer', title: t('Offer — "You can have this one"', 'Offer — "এটা নিতে পার"'), body: t('The router’s DHCP server picks a free address, 192.168.1.10, and offers it together with the mask, gateway, DNS server and lease time.', 'router-এর DHCP server একটা ফাঁকা address, 192.168.1.10, বেছে নিয়ে mask, gateway, DNS server আর lease time-সহ দিতে চায়।'), layers: udpPacket(ROUTER, LAPTOP, 67, 68, dhcp(2), { ttl: 64 }) },
    { from: 'laptop', to: 'router', broadcast: true, label: 'DHCP Request', title: t('Request — "Yes please"', 'Request — "হ্যাঁ, ওটাই চাই"'), body: t('Still a broadcast, on purpose: if other DHCP servers also made offers, they hear this and take theirs back.', 'ইচ্ছে করেই এখনও broadcast: অন্য DHCP server-ও offer দিয়ে থাকলে তারা এটা শুনে নিজেদেরটা ফিরিয়ে নেয়।'), layers: udpPacket(NOBODY, EVERYONE, 68, 67, dhcp(3), bcast) },
    { from: 'router', to: 'laptop', label: 'DHCP ACK', title: t('ACK — "It is yours"', 'ACK — "এটা তোমার"'), body: t('The server confirms and records the lease. Only now may the laptop use the address.', 'server নিশ্চিত করে lease-টা লিখে রাখে। শুধু এবারই ল্যাপটপ address-টা ব্যবহার করতে পারে।'), layers: udpPacket(ROUTER, LAPTOP, 67, 68, dhcp(5), { ttl: 64 }) },
    { from: 'laptop', title: t('Configured', 'configure হয়ে গেল'), body: t('Address 192.168.1.10, gateway 192.168.1.1, DNS 1.1.1.1, good for one day. The laptop is on the internet — and every other lesson here can begin.', 'Address 192.168.1.10, gateway 192.168.1.1, DNS 1.1.1.1, এক দিনের জন্য। ল্যাপটপ internet-এ — আর এখানের বাকি সব lesson শুরু হতে পারে।') },
  ],
}

// Order follows what really happens when you open a page on a new network.
export const LESSONS: Lesson[] = [dhcpLesson, dns, tcpLesson, httpLesson, httpsLesson, udpLesson]

// ── flatten a packet for the hex view ───────────────────────────────────
export interface FlatField { layer: number; field: number; offset: number; length: number }

export function flatten(layers: Layer[]): { bytes: number[]; fields: FlatField[] } {
  const bytes: number[] = []
  const fields: FlatField[] = []
  layers.forEach((layer, li) =>
    layer.fields.forEach((fd, fi) => {
      fields.push({ layer: li, field: fi, offset: bytes.length, length: fd.bytes.length })
      bytes.push(...fd.bytes)
    })
  )
  return { bytes, fields }
}

