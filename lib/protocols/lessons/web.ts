// Web and real-time media lessons: WebSocket, WebRTC, QUIC, SIP, RTSP, RTMP,
// DNS over HTTPS, HTTP proxies, SOCKS5, captive portals. Written from the
// public specifications (RFC 6455, 8489, 3550, 9000, 3261, 2326, 8484, 9110,
// 1928, 8910; Adobe's public RTMP specification).
import { ADDR, ascii, hex0x, ipBytes, noise, size, t, u16, u24, u32, type Field, type L, type Layer } from '../packet'
import {
  CAMERA, LAPTOP, MEDIA, PEER, PROXY, SERVER, STUN, WEB, app, at, blankLine, conversation, f, far, homeTopo, line, send, udpPacket,
  type Endpoint, type Lesson, type NodeDef,
} from '../net'
import { tlsEncrypted, tlsHello } from './core'

const hdr = (text: string, note: L): Field => line(text.slice(0, text.indexOf(':')), text, note)
const hostNote = t('Which site is wanted.', 'কোন site চাই।')
const lenNote = t('Size of the body in bytes.', 'body-র মাপ byte-এ।')
const typeNote = t('What kind of data the body is.', 'body কী ধরনের data।')
const bodyField = (text: string, note: L): Field => f('Body', text.replace(/\r\n/g, ' ⏎ '), ascii(text), note)
const laptopNode = (x: number, y: number): NodeDef => ({ kind: 'laptop', label: t('Laptop', 'ল্যাপটপ'), sub: ADDR.laptopIp, at: [x, y] })
const routerNode = (x: number, y: number): NodeDef => ({ kind: 'router', label: t('Home router', 'বাড়ির router'), sub: ADDR.routerIp, at: [x, y] })

// ═══ WebSocket ══════════════════════════════════════════════════════════
const MASK = [0x37, 0xfa, 0x21, 0x3d]
const ws = conversation(LAPTOP, SERVER, 80)

const websocket: Lesson = {
  id: 'websocket',
  name: 'WebSocket',
  category: 'web',
  tagline: t('Two-way messages over one connection', 'একটা connection-এ দুমুখো বার্তা'),
  intro: t('In plain HTTP only the browser can start a conversation. WebSocket begins as an HTTP request, then turns that same connection into a channel where either side can send at any time — the basis of chat, live scores and multiplayer games.', 'সাধারণ HTTP-তে শুধু browser-ই কথা শুরু করতে পারে। WebSocket শুরু হয় একটা HTTP request হিসেবে, তারপর সেই একই connection-কে এমন channel বানায় যেখানে যেকোনো পক্ষ যখন খুশি পাঠাতে পারে — chat, live score আর multiplayer game-এর ভিত্তি।'),
  topo: homeTopo({ server: WEB }),
  steps: [
    at('laptop', t('A chat page opens', 'একটা chat page খুলল'), t('The page needs messages the moment they are sent. Asking the server "anything new?" every second would be slow and wasteful.', 'page-এর দরকার বার্তা পাঠানোর মুহূর্তেই পাওয়া। প্রতি সেকেন্ডে server-কে "নতুন কিছু?" জিজ্ঞেস করা ধীর আর অপচয়।')),
    send('laptop', 'server', 'GET /chat · Upgrade', t('The upgrade request', 'upgrade request'), t('An ordinary HTTP GET with two special headers asking to switch protocols.', 'একটা সাধারণ HTTP GET, সঙ্গে protocol বদলাতে চাওয়া দুটো বিশেষ header।'), ws.send(app('HTTP upgrade request', [
      line('Request line', 'GET /chat HTTP/1.1', t('Looks like any page request.', 'যেকোনো page request-এর মতোই দেখতে।')),
      hdr('Host: example.com', hostNote),
      hdr('Upgrade: websocket', t('"I would like to speak WebSocket instead."', '"আমি এর বদলে WebSocket বলতে চাই।"')),
      hdr('Connection: Upgrade', t('Marks Upgrade as applying to this connection.', 'জানায় Upgrade এই connection-এর জন্যই।')),
      hdr('Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==', t('A random value. The server must transform it in a fixed way to prove it really understands WebSocket.', 'একটা random মান। server-কে এটা নির্দিষ্ট নিয়মে বদলে প্রমাণ দিতে হয় যে সে সত্যিই WebSocket বোঝে।')),
      hdr('Sec-WebSocket-Version: 13', t('The protocol version. 13 is the only one in use.', 'protocol version। শুধু 13-ই চালু।')),
      blankLine(),
    ]))),
    send('server', 'laptop', '101 Switching Protocols', t('The server agrees', 'server রাজি'), t('Status 101. From the next byte onwards this connection is no longer HTTP.', 'Status 101। পরের byte থেকে এই connection আর HTTP নয়।'), ws.reply(app('HTTP upgrade response', [
      line('Status line', 'HTTP/1.1 101 Switching Protocols', t('101 = protocol change accepted.', '101 = protocol বদল গৃহীত।')),
      hdr('Upgrade: websocket', t('Confirms the new protocol.', 'নতুন protocol নিশ্চিত করে।')),
      hdr('Connection: Upgrade', t('Confirms the switch.', 'বদলটা নিশ্চিত করে।')),
      hdr('Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=', t('The key plus a fixed text, hashed with SHA-1 and base64-encoded. The browser checks it matches.', 'key-এর সঙ্গে একটা নির্দিষ্ট লেখা জুড়ে SHA-1 hash করে base64 করা। browser মিলিয়ে দেখে।')),
      blankLine(),
    ]))),
    send('laptop', 'server', 'Text frame: "hi"', t('A message from the browser', 'browser থেকে একটা বার্তা'), t('Messages now travel in small binary frames. A two-byte header is enough for a short message.', 'বার্তা এখন ছোট binary frame-এ যায়। ছোট বার্তার জন্য দু-byte header-ই যথেষ্ট।'), ws.send(app('WebSocket frame', [
      f('FIN + opcode', 'final, text', [0x81], t('FIN bit set: this frame is the whole message. Opcode 1: text.', 'FIN bit সেট: এই frame-ই পুরো বার্তা। Opcode 1: text।')),
      f('Mask bit + length', 'masked, 2 bytes', [0x82], t('Frames from a browser are always masked. The low 7 bits give the payload length.', 'browser-এর frame সবসময় masked। নিচের 7 bit payload-এর দৈর্ঘ্য দেয়।')),
      f('Masking key', '0x37fa213d', MASK, t('Four random bytes. The payload is XORed with them so that a web page cannot craft bytes that confuse old proxies. It is not encryption.', 'চারটে random byte। payload এগুলোর সঙ্গে XOR করা হয়, যাতে কোনো web page পুরনো proxy-কে বিভ্রান্ত করার মতো byte বানাতে না পারে। এটা encryption নয়।')),
      f('Payload', '"hi" (masked)', ascii('hi').map((b, i) => b ^ MASK[i % 4]), t('"hi" XORed with the key: 0x68 ^ 0x37 = 0x5f, 0x69 ^ 0xfa = 0x93.', '"hi" key-এর সঙ্গে XOR করা: 0x68 ^ 0x37 = 0x5f, 0x69 ^ 0xfa = 0x93।')),
    ]))),
    send('server', 'laptop', 'Text frame: "hello"', t('A message nobody asked for', 'কেউ না চাওয়া একটা বার্তা'), t('The server sends whenever it likes — this is the whole point. Server frames are not masked.', 'server যখন খুশি পাঠায় — এটাই আসল কথা। server-এর frame masked নয়।'), ws.reply(app('WebSocket frame', [
      f('FIN + opcode', 'final, text', [0x81], t('Whole message, text.', 'পুরো বার্তা, text।')),
      f('Mask bit + length', 'unmasked, 5 bytes', [0x05], t('Mask bit clear, length 5.', 'Mask bit বন্ধ, দৈর্ঘ্য 5।')),
      f('Payload', '"hello"', ascii('hello'), t('Plain UTF-8 text.', 'সাদা UTF-8 text।')),
    ]))),
    send('laptop', 'server', 'Close frame', t('Closing politely', 'ভদ্রভাবে বন্ধ করা'), t('Either side sends a close frame with a status code; the other echoes it and the TCP connection ends. Ping and pong frames keep an idle connection alive in between.', 'যেকোনো পক্ষ একটা status code-সহ close frame পাঠায়; অন্যজন সেটা ফেরত দেয় আর TCP connection শেষ হয়। মাঝে ping আর pong frame অলস connection-কে চালু রাখে।'), ws.send(app('WebSocket frame', [
      f('FIN + opcode', 'final, close', [0x88], t('Opcode 8: close.', 'Opcode 8: close।')),
      f('Mask bit + length', 'masked, 2 bytes', [0x82], t('Masked, 2 bytes of payload.', 'Masked, 2 byte payload।')),
      f('Masking key', '0x37fa213d', MASK, t('The masking key.', 'masking key।')),
      f('Status code', '1000 (normal), masked', u16(1000).map((b, i) => b ^ MASK[i]), t('1000 = normal closure.', '1000 = স্বাভাবিক বন্ধ।')),
    ]))),
  ],
}

// ═══ WebRTC ═════════════════════════════════════════════════════════════
const COOKIE = 0x2112a442
const TXN = noise(12, 61)
const PUBLIC = { ip: '203.0.113.7', port: 61000 }
const SIGNAL: Endpoint = { ip: '198.51.100.90', mac: '02:00:00:00:01:30' }

const stunHead = (type: number, typeName: string, len: number): Field[] => [
  f('Message type', `${hex0x(type)} (${typeName})`, u16(type), t('0x0001 = binding request, 0x0101 = success response.', '0x0001 = binding request, 0x0101 = সফল উত্তর।')),
  f('Message length', `${len} bytes`, u16(len), t('Size of the attributes after this 20-byte header.', 'এই 20-byte header-এর পরের attribute-গুলোর মাপ।')),
  f('Magic cookie', '0x2112a442', u32(COOKIE), t('A fixed value that marks this as STUN.', 'একটা নির্দিষ্ট মান যা একে STUN বলে চিহ্নিত করে।')),
  f('Transaction ID', '12 random bytes', TXN, t('Matches the response to the request.', 'request-এর সঙ্গে উত্তর মেলায়।')),
]
const stunReq = app('STUN binding request', stunHead(0x0001, 'binding request', 0))
const stunRes = app('STUN binding response', [
  ...stunHead(0x0101, 'binding success', 12),
  f('XOR-MAPPED-ADDRESS', `${PUBLIC.ip}:${PUBLIC.port}`, [...u16(0x0020), ...u16(8), 0, 1, ...u16(PUBLIC.port ^ 0x2112), ...u32((ipBytes(PUBLIC.ip).reduce((a, b) => a * 256 + b, 0) ^ COOKIE) >>> 0)], t('"This is the address I saw your packet come from" — your router’s public address and port. It is XORed with the magic cookie so that routers which rewrite addresses inside packets leave it alone.', '"তোমার packet এই address থেকে আসতে দেখেছি" — আপনার router-এর public address আর port। magic cookie-র সঙ্গে XOR করা, যাতে packet-এর ভেতরের address বদলানো router এটা না ছোঁয়।')),
])
const rtp = (what: string, pt: number, seq: number, n: number, seed: number, encrypted: boolean): Layer => app(encrypted ? 'SRTP' : 'RTP', [
  f('Version + flags', 'version 2', [0x80], t('RTP version 2, no padding or extensions.', 'RTP version 2, padding বা extension নেই।')),
  f('Payload type', String(pt), [pt], t('Which codec the media uses. The number’s meaning was agreed in the offer and answer.', 'media কোন codec ব্যবহার করছে। সংখ্যার মানে offer আর answer-এ ঠিক হয়েছিল।')),
  f('Sequence number', String(seq), u16(seq), t('Goes up by one per packet, so the receiver can spot loss and reorder.', 'প্রতি packet-এ এক বাড়ে, যাতে গ্রহণকারী হারানো ধরতে আর ক্রম ঠিক করতে পারে।')),
  f('Timestamp', String(seq * 960), u32(seq * 960), t('When this media was captured, in sample units. Used to play it back at the right moment.', 'এই media কখন ধরা হয়েছিল, sample-এর এককে। ঠিক সময়ে বাজাতে ব্যবহৃত।')),
  f('SSRC', '0x5a3c91e7', u32(0x5a3c91e7), t('A random ID for this stream, so audio and video can share one port.', 'এই stream-এর random ID, যাতে audio আর video একই port ভাগ করতে পারে।')),
  f('Payload', what, noise(n, seed), encrypted ? t('The media, encrypted. Shortened here. Even the server that set up the call cannot decrypt it.', 'media, encrypt করা। এখানে ছোট করা। call তৈরি করা server-ও এটা decrypt করতে পারে না।') : t('The media itself. Shortened here.', 'আসল media। এখানে ছোট করা।')),
])
const sig = conversation(LAPTOP, SIGNAL, 443)
const sig2 = conversation(SIGNAL, PEER, 443, 443)

const webrtc: Lesson = {
  id: 'webrtc',
  name: 'WebRTC',
  category: 'web',
  tagline: t('Video calls, browser to browser', 'video call, browser থেকে browser'),
  intro: t('A video call works best when the two browsers talk directly. The hard part is that both sit behind home routers. WebRTC combines several protocols to find a path, agree on keys and then stream encrypted media.', 'দুটো browser সরাসরি কথা বললে video call সবচেয়ে ভালো চলে। মুশকিল হল দুটোই বাড়ির router-এর পেছনে। WebRTC কয়েকটা protocol মিলিয়ে পথ খোঁজে, key ঠিক করে, তারপর encrypted media পাঠায়।'),
  topo: homeTopo({
    stun: far(t('STUN server', 'STUN server'), STUN.ip, 'dns', 'up'),
    peer: { kind: 'phone', label: t('Friend’s phone', 'বন্ধুর phone'), sub: PEER.ip, at: [6.8, 3] },
    signal: { kind: 'server', label: t('Call website', 'call-এর website'), sub: SIGNAL.ip, at: [6.8, 5.6], badge: 'web' },
  }),
  steps: [
    at('laptop', t('You press Call', 'আপনি Call টিপলেন'), t('The browser knows only its private address, 192.168.1.10 — useless to anyone outside. First it must learn how it looks from the internet.', 'browser শুধু নিজের private address জানে, 192.168.1.10 — বাইরের কারও কাজে লাগে না। আগে জানতে হবে internet থেকে তাকে কেমন দেখায়।')),
    send('laptop', 'stun', 'STUN request', t('"What is my public address?"', '"আমার public address কী?"'), t('A 20-byte question sent over UDP to a STUN server.', 'একটা 20-byte প্রশ্ন, UDP দিয়ে STUN server-এ।'), udpPacket(LAPTOP, STUN, 50000, 3478, stunReq)),
    send('stun', 'laptop', 'STUN response', t('The server holds up a mirror', 'server আয়না ধরল'), t('It reports the address and port the request arrived from. That mapping in the router stays open for a while — a door someone else can now knock on.', 'request যে address আর port থেকে এসেছিল সেটা জানায়। router-এ ওই mapping কিছুক্ষণ খোলা থাকে — একটা দরজা যাতে এখন অন্য কেউ টোকা দিতে পারে।'), udpPacket(STUN, LAPTOP, 3478, 50000, stunRes)),
    send('laptop', 'signal', 'Offer (encrypted)', t('The offer goes through the website', 'offer যায় website দিয়ে'), t('The browser writes an offer: its codecs, the addresses it found, and a fingerprint of its encryption key. It reaches the other person through the call website, over HTTPS.', 'browser একটা offer লেখে: তার codec, খুঁজে পাওয়া address, আর encryption key-র fingerprint। এটা call-এর website দিয়ে, HTTPS-এ, অন্যজনের কাছে পৌঁছয়।'), sig.send(tlsEncrypted('TLS application data', 'the offer (SDP text)', 96, 63, t('The offer, encrypted like any HTTPS traffic. Shortened here.', 'offer, যেকোনো HTTPS traffic-এর মতো encrypt করা। এখানে ছোট করা।')))),
    send('signal', 'peer', 'Offer (encrypted)', t('…and on to your friend', '…আর আপনার বন্ধুর কাছে'), t('The website only passes notes. The friend’s browser replies with an answer the same way, listing its own addresses.', 'website শুধু চিরকুট পৌঁছে দেয়। বন্ধুর browser একইভাবে একটা answer পাঠায়, নিজের address-এর তালিকাসহ।'), sig2.send(tlsEncrypted('TLS application data', 'the offer (SDP text)', 96, 64, t('The same offer, forwarded.', 'একই offer, এগিয়ে দেওয়া।')))),
    send('laptop', 'peer', 'Connectivity check', t('Knocking on each other’s doors', 'একে অপরের দরজায় টোকা'), t('Both browsers send STUN checks to every address the other listed. When a pair gets through in both directions, that is the path. If none does, the media is relayed through a TURN server instead.', 'দুটো browser-ই অন্যের দেওয়া প্রতিটা address-এ STUN check পাঠায়। কোনো জোড়া দুদিকেই পৌঁছলে সেটাই পথ। কোনোটাই না পারলে media একটা TURN server দিয়ে relay হয়।'), udpPacket(LAPTOP, PEER, 50000, 62000, stunReq)),
    send('laptop', 'peer', 'Encrypted video', t('Media, directly', 'media, সরাসরি'), t('After a DTLS handshake on that path sets the keys, audio and video flow as SRTP — straight between the two devices.', 'ওই পথে DTLS handshake key ঠিক করার পর audio আর video SRTP হিসেবে চলে — সোজা দুটো ডিভাইসের মধ্যে।'), udpPacket(LAPTOP, PEER, 50000, 62000, rtp('encrypted video', 96, 4211, 40, 65, true))),
  ],
}

// ═══ QUIC ═══════════════════════════════════════════════════════════════
const DCID = noise(8, 71)
const SCID = noise(8, 72)
const varint2 = (n: number) => u16(0x4000 | n)

function quicLong(name: string, type: 'Initial' | 'Handshake', fromClient: boolean, pn: number, what: string, n: number, seed: number, note: L): Layer {
  const [dst, src] = fromClient ? [DCID, SCID] : [SCID, DCID]
  return app(name, [
    f('Header form + type', `long header, ${type}`, [type === 'Initial' ? 0xc0 : 0xe0], t('Top bit 1 = long header, used during the handshake. The next bits give the packet type.', 'সবচেয়ে ওপরের bit 1 = long header, handshake-এ ব্যবহৃত। পরের bit-গুলো packet-এর ধরন দেয়।')),
    f('Version', '1', u32(1), t('QUIC version 1.', 'QUIC version 1।')),
    f('Destination connection ID', '8 bytes', [8, ...dst], t('The receiver’s name for this connection. QUIC identifies a connection by this ID, not by IP address and port.', 'এই connection-এর জন্য গ্রহণকারীর দেওয়া নাম। QUIC connection চেনে এই ID দিয়ে, IP address আর port দিয়ে নয়।')),
    f('Source connection ID', '8 bytes', [8, ...src], t('The sender’s ID for the same connection.', 'একই connection-এর জন্য প্রেরকের ID।')),
    ...(type === 'Initial' ? [f('Token length', '0', [0], t('A token from an earlier visit could go here. None this time.', 'আগের কোনো সফরের token এখানে থাকতে পারত। এবার নেই।'))] : []),
    f('Length', `${n + 1} bytes`, varint2(n + 1), t('Size of the rest of the packet, as a variable-length integer.', 'packet-এর বাকি অংশের মাপ, variable-length integer হিসেবে।')),
    f('Packet number', String(pn), [pn], t('Never reused, even for a resend — which removes the ambiguity that makes TCP’s timing estimates fuzzy.', 'কখনও আবার ব্যবহার হয় না, আবার পাঠালেও না — এতে TCP-র সময় মাপার অস্পষ্টতা দূর হয়।')),
    f('Payload', what, noise(n, seed), note),
  ])
}
const quicShort = (name: string, fromClient: boolean, pn: number, what: string, n: number, seed: number): Layer => app(name, [
  f('Header form', 'short header', [0x40], t('Top bit 0 = short header, used for everything after the handshake.', 'সবচেয়ে ওপরের bit 0 = short header, handshake-এর পরের সবকিছুতে ব্যবহৃত।')),
  f('Destination connection ID', '8 bytes', fromClient ? DCID : SCID, t('Just the ID — no length, no version. The header is as small as possible.', 'শুধু ID — length নেই, version নেই। header যতটা সম্ভব ছোট।')),
  f('Packet number', String(pn), [pn], t('The packet’s number.', 'packet-এর নম্বর।')),
  f('Payload', what, noise(n, seed), t('Encrypted. Inside are HTTP/3 frames on numbered streams. Shortened here.', 'Encrypt করা। ভেতরে নম্বর দেওয়া stream-এ HTTP/3 frame। এখানে ছোট করা।')),
])

const quic: Lesson = {
  id: 'quic',
  name: 'QUIC',
  category: 'web',
  tagline: t('HTTP/3: faster setup, over UDP', 'HTTP/3: দ্রুত শুরু, UDP-র ওপরে'),
  intro: t('HTTPS over TCP needs two round trips before any page data moves: one for TCP, one for TLS. QUIC folds both into one, runs over UDP, and encrypts almost everything. HTTP/3 is HTTP carried on QUIC.', 'TCP-র ওপর HTTPS-এ page-এর data যাওয়ার আগে দুটো round trip লাগে: একটা TCP-র, একটা TLS-এর। QUIC দুটোকে এক করে, UDP-র ওপর চলে, আর প্রায় সবকিছু encrypt করে। HTTP/3 হল QUIC-এ বহন করা HTTP।'),
  topo: homeTopo({ server: WEB }),
  steps: [
    send('laptop', 'server', 'Initial', t('Initial — hello and keys together', 'Initial — সম্ভাষণ আর key একসঙ্গে'), t('The very first packet already carries the TLS ClientHello. There is no separate connection handshake.', 'একদম প্রথম packet-এই TLS ClientHello থাকে। আলাদা connection handshake নেই।'), udpPacket(LAPTOP, SERVER, 52000, 443, quicLong('QUIC Initial', 'Initial', true, 0, 'TLS ClientHello', 64, 73, t('The TLS ClientHello, wrapped in a CRYPTO frame. Shortened here — real Initial packets are padded to at least 1,200 bytes so the server cannot be tricked into flooding a victim.', 'TLS ClientHello, একটা CRYPTO frame-এ মোড়া। এখানে ছোট করা — আসল Initial packet কমপক্ষে 1,200 bytes পর্যন্ত ভরাট করা হয়, যাতে server-কে দিয়ে কাউকে flood করানো না যায়।')))),
    send('server', 'laptop', 'Initial + Handshake', t('The server replies with everything', 'server সব নিয়ে উত্তর দেয়'), t('ServerHello, then the certificate and Finished, already encrypted. One round trip and both sides hold the keys.', 'ServerHello, তারপর certificate আর Finished, এর মধ্যেই encrypt করা। এক round trip-এই দুপক্ষের হাতে key।'), udpPacket(SERVER, LAPTOP, 443, 52000, quicLong('QUIC Handshake', 'Handshake', false, 0, 'certificate, Finished', 80, 74, t('The server’s certificate and proof of identity, encrypted. Shortened here.', 'server-এর certificate আর পরিচয়ের প্রমাণ, encrypt করা। এখানে ছোট করা।')))),
    send('laptop', 'server', 'Request (1-RTT)', t('The request, right away', 'request, সঙ্গে সঙ্গে'), t('The browser finishes the handshake and sends its HTTP/3 request in the same flight. Headers are now tiny.', 'browser handshake শেষ করে একই দফায় HTTP/3 request পাঠায়। header এখন খুব ছোট।'), udpPacket(LAPTOP, SERVER, 52000, 443, quicShort('QUIC 1-RTT packet', true, 1, 'GET / on stream 0', 48, 75))),
    send('server', 'laptop', 'Response (1-RTT)', t('The page comes back', 'page ফিরে এল'), t('Each file travels on its own stream. A lost packet stalls only the stream it belonged to — with TCP, everything behind it would have to wait.', 'প্রতিটা file নিজের stream-এ যায়। হারানো packet শুধু নিজের stream-টাই আটকায় — TCP হলে পেছনের সবকিছু অপেক্ষা করত।'), udpPacket(SERVER, LAPTOP, 443, 52000, quicShort('QUIC 1-RTT packet', false, 1, 'HTML on stream 0', 96, 76))),
    at('laptop', t('You walk out of Wi-Fi range', 'আপনি Wi-Fi-র নাগালের বাইরে গেলেন'), t('The phone switches to mobile data and its IP address changes. A TCP connection would die. QUIC packets still carry the same connection ID, so the server recognises them and the download simply continues.', 'phone mobile data-তে চলে যায় আর তার IP address বদলায়। TCP connection হলে মরে যেত। QUIC packet-এ একই connection ID থাকে, তাই server চিনতে পারে আর download চলতেই থাকে।')),
  ],
}

// ═══ SIP ════════════════════════════════════════════════════════════════
const SIPSRV: Endpoint = { ip: '198.51.100.5', mac: '02:00:00:00:01:31' }
const sdp = (ip: string, port: number) => `v=0\r\no=alice 1 1 IN IP4 ${ip}\r\ns=call\r\nc=IN IP4 ${ip}\r\nt=0 0\r\nm=audio ${port} RTP/AVP 0\r\n`
const sdpNote = t('The media offer, in SDP: "send audio to this address and port, codec 0 (G.711)". The call setup and the audio are separate — SIP only arranges where the audio should go.', 'SDP-তে media-র প্রস্তাব: "audio এই address আর port-এ পাঠাও, codec 0 (G.711)"। call তৈরি আর audio আলাদা — SIP শুধু ঠিক করে audio কোথায় যাবে।')
const sipCommon = (cseq: string): Field[] => [
  hdr('Via: SIP/2.0/UDP 192.168.1.10:5060;branch=z9hG4bK776asdhds', t('The path the request took, so the response can retrace it.', 'request যে পথে গেছে, যাতে উত্তর সেই পথেই ফিরতে পারে।')),
  hdr('From: <sip:alice@example.org>;tag=1928301774', t('Who is calling.', 'কে call করছে।')),
  hdr('To: <sip:bob@example.com>', t('Who is being called.', 'কাকে call করা হচ্ছে।')),
  hdr('Call-ID: a84b4c76e66710@192.168.1.10', t('One ID shared by every message of this call.', 'এই call-এর প্রতিটা message-এর একটাই ID।')),
  hdr(`CSeq: ${cseq}`, t('A counter and the method, to keep requests in order.', 'একটা counter আর method, request-গুলো ক্রমে রাখতে।')),
]
const invite = (() => {
  const body = sdp('192.168.1.10', 4000)
  return app('SIP INVITE', [
    line('Request line', 'INVITE sip:bob@example.com SIP/2.0', t('SIP looks like HTTP on purpose: a method, an address, a version.', 'SIP ইচ্ছে করেই HTTP-র মতো দেখতে: একটা method, একটা address, একটা version।')),
    ...sipCommon('1 INVITE'),
    hdr('Contact: <sip:alice@192.168.1.10:5060>', t('Where to reach the caller directly from now on.', 'এখন থেকে caller-কে সরাসরি কোথায় পাওয়া যাবে।')),
    hdr('Content-Type: application/sdp', typeNote),
    hdr(`Content-Length: ${body.length}`, lenNote),
    blankLine(),
    bodyField(body, sdpNote),
  ])
})()
const sipReply = (status: string, cseq: string, note: L, withSdp = false): Layer => {
  const body = withSdp ? sdp(PEER.ip, 6000) : ''
  return app(`SIP ${status}`, [
    line('Status line', `SIP/2.0 ${status}`, note),
    ...sipCommon(cseq),
    ...(withSdp ? [hdr('Content-Type: application/sdp', typeNote)] : []),
    hdr(`Content-Length: ${body.length}`, lenNote),
    blankLine(),
    ...(withSdp ? [bodyField(body, t('The answer: where the other phone wants its audio sent.', 'answer: অন্য phone কোথায় audio পেতে চায়।'))] : []),
  ])
}
const sipReq = (method: string, cseq: string, note: L): Layer => app(`SIP ${method}`, [
  line('Request line', `${method} sip:bob@${PEER.ip}:5060 SIP/2.0`, note),
  ...sipCommon(cseq),
  hdr('Content-Length: 0', lenNote),
  blankLine(),
])

const sip: Lesson = {
  id: 'sip',
  name: 'SIP',
  category: 'web',
  tagline: t('How internet phone calls are set up', 'internet phone call যেভাবে তৈরি হয়'),
  intro: t('SIP does for phone calls what HTTP does for pages: it finds the other party, rings them and agrees the details. The voice itself then travels separately, as RTP.', 'page-এর জন্য HTTP যা করে, phone call-এর জন্য SIP তাই করে: অন্য পক্ষকে খোঁজে, ring করায় আর খুঁটিনাটি ঠিক করে। কণ্ঠস্বর তারপর আলাদাভাবে যায়, RTP হিসেবে।'),
  topo: homeTopo({
    sip: far(t('SIP server', 'SIP server'), 'example.com', 'call', 'up'),
    callee: { kind: 'phone', label: t('Bob’s phone', 'Bob-এর phone'), sub: PEER.ip, at: [6.8, 3] },
  }),
  steps: [
    at('laptop', t('Alice dials bob@example.com', 'Alice bob@example.com-এ dial করল'), t('A SIP address looks like an email address. Alice’s softphone does not know where Bob is — only which server looks after example.com.', 'SIP address দেখতে email address-এর মতো। Alice-এর softphone জানে না Bob কোথায় — শুধু জানে example.com কোন server দেখে।')),
    send('laptop', 'sip', 'INVITE', t('INVITE', 'INVITE'), t('"I would like to call Bob, and here is where to send my audio."', '"আমি Bob-কে call করতে চাই, আর আমার audio এখানে পাঠাও।"'), udpPacket(LAPTOP, SIPSRV, 5060, 5060, invite)),
    send('sip', 'callee', 'INVITE', t('The server finds Bob', 'server Bob-কে খুঁজে পেল'), t('Bob’s phone registered its current address with the server earlier. The server forwards the INVITE there.', 'Bob-এর phone আগেই server-এ নিজের বর্তমান address নথিভুক্ত করেছিল। server INVITE-টা সেখানে এগিয়ে দেয়।'), udpPacket(SIPSRV, PEER, 5060, 5060, invite)),
    send('callee', 'laptop', '180 Ringing', t('180 Ringing', '180 Ringing'), t('Bob’s phone is ringing. Alice hears the ringback tone. (Responses travel back through the server; shown direct here.)', 'Bob-এর phone বাজছে। Alice ringback tone শোনে। (উত্তর server দিয়েই ফেরে; এখানে সরাসরি দেখানো।)'), udpPacket(PEER, LAPTOP, 5060, 5060, sipReply('180 Ringing', '1 INVITE', t('1xx = progress report, not a final answer.', '1xx = অগ্রগতির খবর, চূড়ান্ত উত্তর নয়।')))),
    send('callee', 'laptop', '200 OK', t('200 OK — Bob answers', '200 OK — Bob ধরল'), t('The response carries Bob’s own SDP: the address and port for his audio.', 'উত্তরে Bob-এর নিজের SDP থাকে: তার audio-র address আর port।'), udpPacket(PEER, LAPTOP, 5060, 5060, sipReply('200 OK', '1 INVITE', t('200 = accepted.', '200 = গৃহীত।'), true))),
    send('laptop', 'callee', 'ACK', t('ACK', 'ACK'), t('Alice confirms she got the answer. Three messages — INVITE, 200, ACK — and the call is set up.', 'Alice নিশ্চিত করে উত্তর পেয়েছে। তিনটে message — INVITE, 200, ACK — আর call তৈরি।'), udpPacket(LAPTOP, PEER, 5060, 5060, sipReq('ACK', '1 ACK', t('Confirms the final response to an INVITE.', 'INVITE-এর চূড়ান্ত উত্তর নিশ্চিত করে।')))),
    send('laptop', 'callee', 'RTP audio', t('The voice goes direct', 'কণ্ঠস্বর সরাসরি যায়'), t('Fifty small packets a second, each 20 ms of sound, phone to phone. The SIP server is no longer involved.', 'সেকেন্ডে পঞ্চাশটা ছোট packet, প্রতিটায় 20 ms শব্দ, phone থেকে phone। SIP server আর জড়িত নয়।'), udpPacket(LAPTOP, PEER, 4000, 6000, rtp('20 ms of G.711 audio', 0, 1, 32, 81, false))),
    send('laptop', 'callee', 'BYE', t('BYE — hanging up', 'BYE — ফোন রাখা'), t('Either side ends the call with BYE; the other answers 200 OK.', 'যেকোনো পক্ষ BYE দিয়ে call শেষ করে; অন্যজন 200 OK উত্তর দেয়।'), udpPacket(LAPTOP, PEER, 5060, 5060, sipReq('BYE', '2 BYE', t('Ends the call.', 'call শেষ করে।')))),
  ],
}

// ═══ RTSP ═══════════════════════════════════════════════════════════════
const rtsp = conversation(LAPTOP, CAMERA, 554)
const URL = 'rtsp://192.168.1.60/stream'
const cseqNote = t('Numbers the request; the response repeats it.', 'request-কে নম্বর দেয়; উত্তরে সেটা ফেরে।')
const camSdp = 'v=0\r\nm=video 0 RTP/AVP 96\r\na=rtpmap:96 H264/90000\r\na=control:track1\r\n'

const rtspLesson: Lesson = {
  id: 'rtsp',
  name: 'RTSP',
  category: 'web',
  tagline: t('The remote control for camera streams', 'camera stream-এর remote control'),
  intro: t('RTSP is how you tell an IP camera to start, pause or stop. Like a TV remote, it carries commands — the video itself arrives separately as RTP.', 'RTSP দিয়ে আপনি একটা IP camera-কে চালু, pause বা বন্ধ করতে বলেন। TV remote-এর মতো এটা শুধু নির্দেশ বহন করে — video আলাদাভাবে RTP হিসেবে আসে।'),
  topo: {
    nodes: {
      laptop: laptopNode(0, 2.4), router: routerNode(2.4, 2.4),
      camera: { kind: 'box', label: t('IP camera', 'IP camera'), sub: CAMERA.ip, at: [4.8, 2.4], badge: 'camera' },
    },
    links: [['laptop', 'router', 'wireless'], ['router', 'camera']],
  },
  steps: [
    send('laptop', 'camera', 'DESCRIBE', t('DESCRIBE — "What do you have?"', 'DESCRIBE — "তোমার কাছে কী আছে?"'), t('The player asks the camera to describe its stream.', 'player camera-কে তার stream-এর বর্ণনা দিতে বলে।'), rtsp.send(app('RTSP DESCRIBE', [
      line('Request line', `DESCRIBE ${URL} RTSP/1.0`, t('Method, the stream’s address, version. The shape is borrowed from HTTP.', 'Method, stream-এর address, version। গড়নটা HTTP থেকে নেওয়া।')),
      hdr('CSeq: 1', cseqNote),
      hdr('Accept: application/sdp', t('The description format wanted.', 'কোন format-এ বর্ণনা চাই।')),
      blankLine(),
    ]))),
    send('camera', 'laptop', '200 OK · SDP', t('The camera describes its stream', 'camera তার stream-এর বর্ণনা দিল'), t('One H.264 video track.', 'একটা H.264 video track।'), rtsp.reply(app('RTSP response', [
      line('Status line', 'RTSP/1.0 200 OK', t('Same status codes as HTTP.', 'HTTP-র মতোই status code।')),
      hdr('CSeq: 1', cseqNote),
      hdr('Content-Type: application/sdp', typeNote),
      hdr(`Content-Length: ${camSdp.length}`, lenNote),
      blankLine(),
      bodyField(camSdp, t('The stream description: video, payload type 96, H.264, 90 kHz clock.', 'stream-এর বর্ণনা: video, payload type 96, H.264, 90 kHz clock।')),
    ]))),
    send('laptop', 'camera', 'SETUP', t('SETUP — "Send it to these ports"', 'SETUP — "এই port-গুলোয় পাঠাও"'), t('The player says where it will listen for video.', 'player জানায় সে কোথায় video-র জন্য শুনবে।'), rtsp.send(app('RTSP SETUP', [
      line('Request line', `SETUP ${URL}/track1 RTSP/1.0`, t('Sets up one track.', 'একটা track তৈরি করে।')),
      hdr('CSeq: 2', cseqNote),
      hdr('Transport: RTP/AVP;unicast;client_port=5000-5001', t('RTP over UDP, to one receiver, on port 5000 (and 5001 for control reports).', 'UDP-র ওপর RTP, একজন গ্রহণকারীর কাছে, port 5000-এ (আর control report-এর জন্য 5001)।')),
      blankLine(),
    ]))),
    send('camera', 'laptop', '200 OK · Session', t('A session is created', 'একটা session তৈরি হল'), t('Unlike HTTP, RTSP remembers you. Every later command must carry this session ID.', 'HTTP-র মতো নয়, RTSP আপনাকে মনে রাখে। পরের প্রতিটা নির্দেশে এই session ID থাকতে হবে।'), rtsp.reply(app('RTSP response', [
      line('Status line', 'RTSP/1.0 200 OK', t('Accepted.', 'গৃহীত।')),
      hdr('CSeq: 2', cseqNote),
      hdr('Transport: RTP/AVP;unicast;client_port=5000-5001;server_port=6970-6971', t('The camera adds the ports it will send from.', 'camera যে port থেকে পাঠাবে সেগুলো যোগ করে।')),
      hdr('Session: 12345678', t('The session ID.', 'session ID।')),
      blankLine(),
    ]))),
    send('laptop', 'camera', 'PLAY', t('PLAY', 'PLAY'), t('The play button.', 'play বোতাম।'), rtsp.send(app('RTSP PLAY', [
      line('Request line', `PLAY ${URL} RTSP/1.0`, t('Start sending.', 'পাঠানো শুরু করো।')),
      hdr('CSeq: 3', cseqNote),
      hdr('Session: 12345678', t('Which session to start.', 'কোন session চালু করতে হবে।')),
      hdr('Range: npt=0.000-', t('Play from the beginning, with no end time — a live stream.', 'শুরু থেকে চালাও, শেষ সময় নেই — live stream।')),
      blankLine(),
    ]))),
    send('camera', 'laptop', 'RTP video', t('Video arrives on a different channel', 'video আসে অন্য channel-এ'), t('The pictures travel as RTP over UDP to port 5000, not on the RTSP connection. A late frame is useless, so nothing is ever resent.', 'ছবি যায় UDP-র ওপর RTP হিসেবে port 5000-এ, RTSP connection-এ নয়। দেরিতে আসা frame কাজের নয়, তাই কিছুই আবার পাঠানো হয় না।'), udpPacket(CAMERA, LAPTOP, 6970, 5000, rtp('part of an H.264 frame', 96, 1, 40, 83, false))),
    send('laptop', 'camera', 'TEARDOWN', t('TEARDOWN', 'TEARDOWN'), t('The stop button. The camera frees the session and stops sending.', 'stop বোতাম। camera session ছেড়ে দিয়ে পাঠানো বন্ধ করে।'), rtsp.send(app('RTSP TEARDOWN', [
      line('Request line', `TEARDOWN ${URL} RTSP/1.0`, t('End the session.', 'session শেষ করো।')),
      hdr('CSeq: 4', cseqNote),
      hdr('Session: 12345678', t('Which session to end.', 'কোন session শেষ করতে হবে।')),
      blankLine(),
    ]))),
  ],
}

// ═══ RTMP ═══════════════════════════════════════════════════════════════
const rtmp = conversation(LAPTOP, MEDIA, 1935)
const amfStr = (s: string) => [0x02, ...u16(s.length), ...ascii(s)]
const amfNum = (n: number) => [0x00, ...Array.from(new Uint8Array(new Float64Array([n]).buffer)).reverse()]
const chunk = (name: string, csid: number, typeId: number, typeName: string, streamId: number, body: Field[]): Layer => app(name, [
  f('Chunk header', `format 0, chunk stream ${csid}`, [csid], t('Top 2 bits: header format (0 = full header). Low 6 bits: which chunk stream this belongs to.', 'ওপরের 2 bit: header-এর ধরন (0 = পুরো header)। নিচের 6 bit: এটা কোন chunk stream-এর।')),
  f('Timestamp', '0', u24(0), t('Milliseconds since the stream started.', 'stream শুরু থেকে millisecond।')),
  f('Message length', `${size(body)} bytes`, u24(size(body)), t('Size of the message body.', 'message body-র মাপ।')),
  f('Message type', `${typeId} (${typeName})`, [typeId], t('20 = a command, 8 = audio, 9 = video.', '20 = একটা command, 8 = audio, 9 = video।')),
  f('Message stream ID', String(streamId), [streamId, 0, 0, 0], t('Which logical stream. One of the few little-endian fields in RTMP.', 'কোন logical stream। RTMP-র অল্প কয়েকটা little-endian field-এর একটা।')),
  ...body,
])

const rtmpLesson: Lesson = {
  id: 'rtmp',
  name: 'RTMP',
  category: 'web',
  tagline: t('How a live stream is uploaded', 'live stream যেভাবে upload হয়'),
  intro: t('When someone goes live from OBS or a phone, the video usually reaches the platform over RTMP. Viewers get it by other means — RTMP today is the upload leg.', 'কেউ OBS বা phone থেকে live হলে video সাধারণত RTMP দিয়ে platform-এ পৌঁছয়। দর্শকরা পায় অন্য উপায়ে — আজ RTMP হল upload-এর অংশ।'),
  topo: homeTopo({ media: far(t('Streaming platform', 'Streaming platform'), 'live.example.com', 'video') }),
  steps: [
    at('laptop', t('You click Go Live', 'আপনি Go Live টিপলেন'), t('The streaming app has a server address and a secret stream key from the platform. It opens a TCP connection to port 1935.', 'streaming app-এর কাছে platform-এর দেওয়া একটা server address আর গোপন stream key আছে। সে port 1935-এ একটা TCP connection খোলে।')),
    send('laptop', 'media', 'C0 + C1', t('Handshake: client hello', 'Handshake: client-এর সম্ভাষণ'), t('One version byte, then a block of time and random data.', 'এক byte version, তারপর সময় আর random data-র একটা block।'), rtmp.send(app('RTMP handshake C0 + C1', [
      f('C0: version', '3', [3], t('RTMP version 3.', 'RTMP version 3।')),
      f('C1: time', '0', u32(0), t('The client’s clock.', 'client-এর ঘড়ি।')),
      f('C1: zero', '0', u32(0), t('Four zero bytes.', 'চারটে শূন্য byte।')),
      f('C1: random data', 'random bytes', noise(32, 91), t('Random filler the server must echo back. Shortened here — the real block is 1,528 bytes.', 'random ভরাট data যা server-কে ফেরত পাঠাতে হয়। এখানে ছোট করা — আসল block 1,528 bytes।')),
    ]))),
    send('media', 'laptop', 'S0 + S1 + S2', t('Handshake: server replies', 'Handshake: server-এর উত্তর'), t('The server sends its own block and echoes the client’s. The client echoes back in turn, and the handshake is done. Nothing here is secret — it only checks both ends are alive.', 'server নিজের block পাঠায় আর client-এরটা ফেরত দেয়। client-ও পাল্টা ফেরত দেয়, handshake শেষ। এখানে কিছুই গোপন নয় — শুধু দেখা হয় দুই প্রান্ত সচল কিনা।'), rtmp.reply(app('RTMP handshake S0 + S1 + S2', [
      f('S0: version', '3', [3], t('The server agrees on version 3.', 'server version 3-এ রাজি।')),
      f('S1: time + zero', '0, 0', [...u32(0), ...u32(0)], t('The server’s clock.', 'server-এর ঘড়ি।')),
      f('S1: random data', 'random bytes', noise(32, 92), t('The server’s own random block. Shortened.', 'server-এর নিজের random block। ছোট করা।')),
      f('S2: echo of C1', 'the client’s bytes', [...u32(0), ...u32(0), ...noise(32, 91)], t('The client’s block sent straight back.', 'client-এর block সোজা ফেরত।')),
    ]))),
    send('laptop', 'media', 'connect("live")', t('connect — which app', 'connect — কোন app'), t('The first command names the application on the server. Commands are encoded in AMF, a compact format from the Flash era.', 'প্রথম command server-এর application-এর নাম বলে। command-গুলো AMF-এ encode করা, Flash যুগের একটা ছোট format।'), rtmp.send(chunk('RTMP command: connect', 3, 20, 'AMF0 command', 0, [
      f('Command name', '"connect"', amfStr('connect'), t('An AMF string: type byte 2, a 2-byte length, then the text.', 'একটা AMF string: type byte 2, 2-byte দৈর্ঘ্য, তারপর লেখা।')),
      f('Transaction ID', '1', amfNum(1), t('An AMF number: type byte 0, then an 8-byte floating-point value. The reply carries the same number.', 'একটা AMF number: type byte 0, তারপর 8-byte floating-point মান। উত্তরে একই সংখ্যা থাকে।')),
      f('Command object', '{ app: "live" }', [0x03, ...u16(3), ...ascii('app'), ...amfStr('live'), 0, 0, 9], t('An AMF object: a list of name–value pairs, ended by 00 00 09.', 'একটা AMF object: নাম–মান জোড়ার তালিকা, 00 00 09 দিয়ে শেষ।')),
    ]))),
    send('laptop', 'media', 'publish(stream key)', t('publish — the stream key', 'publish — stream key'), t('The stream key is the password for your channel. Plain RTMP sends it unencrypted, which is why platforms now use RTMPS — the same thing inside TLS.', 'stream key হল আপনার channel-এর password। সাদা RTMP এটা encrypt না করেই পাঠায়, তাই platform-গুলো এখন RTMPS ব্যবহার করে — একই জিনিস TLS-এর ভেতরে।'), rtmp.send(chunk('RTMP command: publish', 3, 20, 'AMF0 command', 1, [
      f('Command name', '"publish"', amfStr('publish'), t('Start sending a stream.', 'একটা stream পাঠানো শুরু করো।')),
      f('Transaction ID', '0', amfNum(0), t('Zero: no reply is expected to this number.', 'শূন্য: এই নম্বরে উত্তর আশা করা হচ্ছে না।')),
      f('Null', 'null', [0x05], t('An empty command object.', 'একটা ফাঁকা command object।')),
      f('Stream key', '"abcd-1234-efgh"', amfStr('abcd-1234-efgh'), t('The secret that ties this upload to your channel.', 'যে গোপন মান এই upload-কে আপনার channel-এর সঙ্গে জোড়ে।')),
      f('Publish type', '"live"', amfStr('live'), t('A live stream, not a recording.', 'live stream, recording নয়।')),
    ]))),
    send('laptop', 'media', 'Video chunk', t('Video and audio flow', 'video আর audio চলছে'), t('Each frame is cut into chunks so that a big video frame cannot hold up the audio. This goes on for as long as you are live.', 'প্রতিটা frame টুকরো (chunk) করা হয়, যাতে বড় video frame audio-কে আটকে না রাখে। আপনি যতক্ষণ live, এটা চলতে থাকে।'), rtmp.send(chunk('RTMP video message', 6, 9, 'video', 1, [
      f('Video header', 'keyframe, H.264', [0x17, 1, 0, 0, 0], t('Frame type and codec in one byte, then the packet type and timing offset.', 'এক byte-এ frame-এর ধরন আর codec, তারপর packet-এর ধরন আর সময়ের offset।')),
      f('Video data', 'part of a frame', noise(40, 93), t('Compressed H.264 video. Shortened here.', 'compress করা H.264 video। এখানে ছোট করা।')),
    ]))),
    at('media', t('The platform takes it from here', 'এরপর platform-এর কাজ'), t('The server re-encodes the stream into several qualities and delivers it to viewers as short HTTP downloads (HLS or DASH), which scale to millions far better than RTMP could.', 'server stream-টাকে কয়েকটা quality-তে আবার encode করে দর্শকদের কাছে ছোট ছোট HTTP download (HLS বা DASH) হিসেবে পাঠায়, যা লাখ লাখ দর্শকের জন্য RTMP-র চেয়ে অনেক ভালো চলে।')),
  ],
}

// ═══ DNS over HTTPS ═════════════════════════════════════════════════════
const DOH: Endpoint = { ip: ADDR.dnsIp, mac: '02:00:00:00:01:01' }
const dohTalk = conversation(LAPTOP, DOH, 443)

const doh: Lesson = {
  id: 'doh',
  name: 'DoH',
  category: 'web',
  tagline: t('DNS lookups hidden inside HTTPS', 'HTTPS-এর ভেতরে লুকোনো DNS lookup'),
  intro: t('Ordinary DNS is sent in plain text. Anyone on the path — the café Wi-Fi, your ISP — can read which sites you look up, or change the answer. DNS over HTTPS puts the same question inside an encrypted web request.', 'সাধারণ DNS সাদা text-এ যায়। পথের যে কেউ — café-র Wi-Fi, আপনার ISP — পড়তে পারে আপনি কোন site খুঁজছেন, বা উত্তর বদলে দিতে পারে। DNS over HTTPS সেই একই প্রশ্ন একটা encrypted web request-এর ভেতরে রাখে।'),
  topo: homeTopo({ doh: far(t('DoH resolver', 'DoH resolver'), ADDR.dnsIp, 'dns') }),
  steps: [
    at('laptop', t('The browser needs an address', 'browser-এর একটা address দরকার'), t('Instead of a UDP datagram to port 53, the browser uses an HTTPS connection it already has open to the resolver.', 'port 53-এ UDP datagram-এর বদলে browser resolver-এর সঙ্গে আগে থেকে খোলা একটা HTTPS connection ব্যবহার করে।')),
    send('laptop', 'doh', 'Encrypted query', t('The question, encrypted', 'প্রশ্ন, encrypt করা'), t('Inside is "POST /dns-query" with the very same DNS message bytes as in the DNS lesson. On the wire it is indistinguishable from any other HTTPS traffic to port 443.', 'ভেতরে "POST /dns-query", সঙ্গে DNS lesson-এর সেই একই DNS message-এর byte। তারের ওপরে এটা port 443-এর অন্য যেকোনো HTTPS traffic থেকে আলাদা করা যায় না।'), dohTalk.send(tlsEncrypted('TLS application data', 'POST /dns-query + DNS question', 72, 101, t('An HTTP/2 request whose body is a binary DNS query, all encrypted. Shortened here.', 'একটা HTTP/2 request যার body একটা binary DNS query, সবটাই encrypt করা। এখানে ছোট করা।')))),
    at('doh', t('The resolver does the usual work', 'resolver সাধারণ কাজটাই করে'), t('It decrypts the request and resolves the name exactly as any DNS resolver would.', 'সে request decrypt করে আর যেকোনো DNS resolver-এর মতোই নামটা resolve করে।')),
    send('doh', 'laptop', 'Encrypted answer', t('The answer, encrypted', 'উত্তর, encrypt করা'), t('An HTTP response with content type application/dns-message. TLS also proves the answer came from the real resolver and was not altered.', 'application/dns-message content type-এর একটা HTTP response। TLS এটাও প্রমাণ করে যে উত্তর আসল resolver থেকেই এসেছে আর বদলানো হয়নি।'), dohTalk.reply(tlsEncrypted('TLS application data', '200 OK + DNS answer', 88, 102, t('The DNS answer inside an HTTP response, encrypted. Shortened here.', 'HTTP response-এর ভেতরে DNS উত্তর, encrypt করা। এখানে ছোট করা।')))),
    at('laptop', t('What an observer learned', 'পর্যবেক্ষক কী জানল'), t('Only that the laptop talked to 1.1.1.1 over HTTPS. Not the name. The trade-off: the resolver’s operator now sees your lookups instead of your ISP.', 'শুধু এটুকু যে ল্যাপটপ 1.1.1.1-এর সঙ্গে HTTPS-এ কথা বলেছে। নামটা নয়। বিনিময়ে: আপনার ISP-র বদলে এখন resolver-এর মালিক আপনার lookup দেখে।')),
  ],
}

// ═══ HTTP proxies ═══════════════════════════════════════════════════════
const viaLaptop = conversation(LAPTOP, PROXY, 3128)
const viaProxy = conversation(PROXY, SERVER, 80, 40001)
const page = '<h1>Hello</h1>'
const proxyTopo = (label: L, sub: string) => homeTopo({ proxy: far(label, sub, 'proxy', 'up'), server: WEB })

const proxies: Lesson = {
  id: 'proxy',
  name: 'Proxies',
  category: 'web',
  tagline: t('A middleman for web requests', 'web request-এর মধ্যস্থ'),
  intro: t('A proxy makes requests on your behalf. Offices and schools use them to filter and cache; others use them to hide their address. The website sees the proxy, not you.', 'proxy আপনার হয়ে request করে। অফিস আর স্কুল এগুলো filter আর cache করতে ব্যবহার করে; অন্যরা নিজের address লুকোতে। website দেখে proxy-কে, আপনাকে নয়।'),
  topo: proxyTopo(t('HTTP proxy', 'HTTP proxy'), `${PROXY.ip}:3128`),
  steps: [
    send('laptop', 'proxy', 'GET http://example.com/', t('The request goes to the proxy', 'request যায় proxy-র কাছে'), t('The browser connects to the proxy, not the website, and writes the full address in the request line so the proxy knows where to go.', 'browser website-এ নয়, proxy-তে connect করে, আর request line-এ পুরো address লেখে যাতে proxy জানে কোথায় যেতে হবে।'), viaLaptop.send(app('HTTP request', [
      line('Request line', 'GET http://example.com/ HTTP/1.1', t('The complete URL, not just the path — the mark of a request to a proxy.', 'শুধু path নয়, পুরো URL — proxy-র কাছে পাঠানো request-এর চিহ্ন।')),
      hdr('Host: example.com', hostNote),
      blankLine(),
    ]))),
    at('proxy', t('Allowed? Cached?', 'অনুমতি আছে? cache-এ আছে?'), t('The proxy checks its rules — blocked sites stop here — and whether it already holds a fresh copy of the page.', 'proxy নিজের নিয়ম দেখে — নিষিদ্ধ site এখানেই আটকায় — আর দেখে page-এর টাটকা copy আগে থেকেই আছে কিনা।')),
    send('proxy', 'server', 'GET /', t('The proxy asks on your behalf', 'proxy আপনার হয়ে চায়'), t('A new connection, from the proxy’s address. The proxy adds headers saying a proxy was involved.', 'একটা নতুন connection, proxy-র address থেকে। proxy এমন header যোগ করে যা জানায় মাঝে একটা proxy ছিল।'), viaProxy.send(app('HTTP request', [
      line('Request line', 'GET / HTTP/1.1', t('An ordinary request with just the path.', 'শুধু path-সহ একটা সাধারণ request।')),
      hdr('Host: example.com', hostNote),
      hdr('Via: 1.1 proxy.example.net', t('Added by the proxy: "this passed through me".', 'proxy-র যোগ করা: "এটা আমার মধ্য দিয়ে গেছে"।')),
      hdr('X-Forwarded-For: 203.0.113.7', t('The original client’s address, if the proxy chooses to reveal it. Anonymising proxies leave this out.', 'আসল client-এর address, যদি proxy জানাতে চায়। পরিচয় গোপন রাখা proxy এটা বাদ দেয়।')),
      blankLine(),
    ]))),
    send('server', 'proxy', '200 OK', t('The website answers the proxy', 'website proxy-কে উত্তর দেয়'), t('As far as the server can tell, the proxy is the visitor.', 'server-এর জানা মতে proxy-ই হল দর্শক।'), viaProxy.reply(app('HTTP response', [
      line('Status line', 'HTTP/1.1 200 OK', t('Success.', 'সফল।')),
      hdr('Content-Type: text/html', typeNote),
      hdr(`Content-Length: ${page.length}`, lenNote),
      hdr('Cache-Control: max-age=3600', t('"You may reuse this for an hour." The proxy can now answer other users without asking again.', '"এটা এক ঘণ্টা আবার ব্যবহার করতে পার।" proxy এখন আবার না জিজ্ঞেস করেই অন্য ব্যবহারকারীদের উত্তর দিতে পারে।')),
      blankLine(),
      bodyField(page, t('The page.', 'page-টা।')),
    ]))),
    send('proxy', 'laptop', '200 OK', t('…and passes it back', '…আর ফেরত পাঠায়'), t('The proxy keeps a copy and relays the response.', 'proxy একটা copy রেখে উত্তরটা এগিয়ে দেয়।'), viaLaptop.reply(app('HTTP response', [
      line('Status line', 'HTTP/1.1 200 OK', t('Success.', 'সফল।')),
      hdr('Content-Type: text/html', typeNote),
      hdr(`Content-Length: ${page.length}`, lenNote),
      hdr('Via: 1.1 proxy.example.net', t('Marks the response as having come through the proxy.', 'জানায় উত্তরটা proxy হয়ে এসেছে।')),
      blankLine(),
      bodyField(page, t('The page.', 'page-টা।')),
    ]))),
    send('laptop', 'proxy', 'CONNECT example.com:443', t('HTTPS: asking for a tunnel', 'HTTPS: একটা সুড়ঙ্গ চাওয়া'), t('For an HTTPS site the browser asks the proxy to open a raw connection and step aside.', 'HTTPS site-এর জন্য browser proxy-কে বলে একটা কাঁচা connection খুলে সরে দাঁড়াতে।'), viaLaptop.send(app('HTTP request', [
      line('Request line', 'CONNECT example.com:443 HTTP/1.1', t('CONNECT = "open a tunnel to this host and port".', 'CONNECT = "এই host আর port-এ একটা সুড়ঙ্গ খোলো"।')),
      hdr('Host: example.com:443', hostNote),
      blankLine(),
    ]))),
    send('proxy', 'laptop', '200 Connection established', t('The tunnel is open', 'সুড়ঙ্গ খোলা'), t('From here the proxy just copies bytes both ways. It sees which site you chose but, because of TLS, nothing you send or read there.', 'এখান থেকে proxy শুধু দুদিকে byte copy করে। আপনি কোন site বেছেছেন সে দেখে, কিন্তু TLS-এর জন্য সেখানে আপনি কী পাঠান বা পড়েন তা নয়।'), viaLaptop.reply(app('HTTP response', [
      line('Status line', 'HTTP/1.1 200 Connection established', t('The tunnel is ready.', 'সুড়ঙ্গ তৈরি।')),
      blankLine(),
    ]))),
  ],
}

// ═══ SOCKS5 ═════════════════════════════════════════════════════════════
const socksTalk = conversation(LAPTOP, PROXY, 1080)
const verNote = t('SOCKS version 5.', 'SOCKS version 5।')

const socks5: Lesson = {
  id: 'socks5',
  name: 'SOCKS5',
  category: 'web',
  tagline: t('A proxy for any kind of connection', 'যেকোনো connection-এর proxy'),
  intro: t('An HTTP proxy understands only web requests. SOCKS5 works lower down: it relays any TCP connection without caring what is inside — web, mail, SSH or a game. A few tiny binary messages set it up.', 'HTTP proxy শুধু web request বোঝে। SOCKS5 আরও নিচে কাজ করে: ভেতরে কী আছে না দেখেই যেকোনো TCP connection relay করে — web, mail, SSH বা game। কয়েকটা ছোট binary message-এই এটা তৈরি হয়।'),
  topo: proxyTopo(t('SOCKS5 proxy', 'SOCKS5 proxy'), `${PROXY.ip}:1080`),
  steps: [
    send('laptop', 'proxy', 'Greeting', t('Greeting — "How may I log in?"', 'সম্ভাষণ — "কীভাবে login করব?"'), t('Three bytes.', 'তিনটে byte।'), socksTalk.send(app('SOCKS5 greeting', [
      f('Version', '5', [5], verNote),
      f('Number of methods', '1', [1], t('How many login methods the client offers.', 'client কটা login পদ্ধতি দিচ্ছে।')),
      f('Methods', 'no authentication (0)', [0], t('0 = no login. 2 would mean username and password.', '0 = login নেই। 2 মানে username আর password।')),
    ]))),
    send('proxy', 'laptop', 'Method chosen', t('The proxy picks a method', 'proxy একটা পদ্ধতি বেছে নেয়'), t('Two bytes.', 'দুটো byte।'), socksTalk.reply(app('SOCKS5 method selection', [
      f('Version', '5', [5], verNote),
      f('Method', 'no authentication (0)', [0], t('The chosen method. 0xff would mean "none of yours are acceptable".', 'বেছে নেওয়া পদ্ধতি। 0xff মানে "তোমার কোনোটাই চলবে না"।')),
    ]))),
    send('laptop', 'proxy', 'Connect request', t('"Connect me to example.com:443"', '"আমাকে example.com:443-এ connect করো"'), t('The client can send a name instead of an IP address, so even the DNS lookup happens at the proxy.', 'client IP address-এর বদলে নাম পাঠাতে পারে, তাই DNS lookup-ও proxy-তেই ঘটে।'), socksTalk.send(app('SOCKS5 request', [
      f('Version', '5', [5], verNote),
      f('Command', 'connect (1)', [1], t('1 = open a TCP connection.', '1 = একটা TCP connection খোলো।')),
      f('Reserved', '0', [0], t('Always zero.', 'সবসময় শূন্য।')),
      f('Address type', 'domain name (3)', [3], t('1 = IPv4 address, 3 = domain name, 4 = IPv6 address.', '1 = IPv4 address, 3 = domain name, 4 = IPv6 address।')),
      f('Destination', 'example.com', [11, ...ascii('example.com')], t('One length byte, then the name.', 'এক byte দৈর্ঘ্য, তারপর নাম।')),
      f('Port', '443', u16(443), t('The destination port.', 'গন্তব্যের port।')),
    ]))),
    at('proxy', t('The proxy connects out', 'proxy বাইরে connect করে'), t('It looks up example.com and opens its own TCP connection to port 443.', 'সে example.com খুঁজে port 443-এ নিজের একটা TCP connection খোলে।')),
    send('proxy', 'laptop', 'Succeeded', t('Reply — "You are connected"', 'উত্তর — "তুমি connected"'), t('After this the SOCKS conversation is over.', 'এর পরে SOCKS-এর কথোপকথন শেষ।'), socksTalk.reply(app('SOCKS5 reply', [
      f('Version', '5', [5], verNote),
      f('Reply', 'succeeded (0)', [0], t('0 = success. Other values report refused, unreachable and so on.', '0 = সফল। অন্য মান refused, unreachable ইত্যাদি জানায়।')),
      f('Reserved', '0', [0], t('Always zero.', 'সবসময় শূন্য।')),
      f('Address type', 'IPv4 (1)', [1], t('The format of the address below.', 'নিচের address-এর format।')),
      f('Bound address', PROXY.ip, ipBytes(PROXY.ip), t('The proxy’s own address on the outgoing connection.', 'বাইরে যাওয়া connection-এ proxy-র নিজের address।')),
      f('Bound port', '40001', u16(40001), t('The proxy’s port on that connection.', 'ওই connection-এ proxy-র port।')),
    ]))),
    send('laptop', 'server', 'Anything at all', t('Now it is a plain pipe', 'এখন এটা একটা সাদা নল'), t('Every byte the client sends is passed on untouched. Here it is a TLS ClientHello, but it could be any protocol — that is what makes SOCKS general-purpose.', 'client যে byte-ই পাঠায়, অবিকল এগিয়ে দেওয়া হয়। এখানে এটা একটা TLS ClientHello, কিন্তু যেকোনো protocol হতে পারত — এতেই SOCKS সর্বজনীন।'), socksTalk.send(tlsHello(true))),
  ],
}

// ═══ Captive portal ═════════════════════════════════════════════════════
const PORTAL: Endpoint = { ip: '192.168.1.2', mac: '00:50:56:0a:0b:22', lan: true }
const probe = conversation(LAPTOP, SERVER, 80)
const portal = conversation(LAPTOP, PORTAL, 80, 51002)
const probe2 = conversation(LAPTOP, SERVER, 80, 51004)
const probeReq = () => app('HTTP request', [
  line('Request line', 'GET /generate_204 HTTP/1.1', t('A test page that should return an empty "204" answer and nothing else.', 'একটা পরীক্ষার page, যার একটা ফাঁকা "204" উত্তর ছাড়া আর কিছু দেওয়ার কথা নয়।')),
  hdr('Host: connectivity-check.example.com', hostNote),
  blankLine(),
])
const form = 'room=204&name=Dey'

const captive: Lesson = {
  id: 'captive',
  name: 'Captive portal',
  category: 'web',
  tagline: t('The Wi-Fi sign-in page', 'Wi-Fi-র sign-in page'),
  intro: t('Hotel and airport Wi-Fi lets you connect but shows a sign-in page before anything works. There is no special protocol behind it — the network intercepts your first web request and answers it itself.', 'hotel আর airport-এর Wi-Fi-তে connect করা যায়, কিন্তু কিছু চলার আগে একটা sign-in page আসে। এর পেছনে বিশেষ কোনো protocol নেই — নেটওয়ার্ক আপনার প্রথম web request আটকে নিজেই তার উত্তর দেয়।'),
  topo: {
    nodes: {
      laptop: laptopNode(0, 3),
      gateway: { kind: 'router', label: t('Hotel gateway', 'hotel-এর gateway'), sub: ADDR.routerIp, at: [2.4, 3] },
      portal: { kind: 'box', label: t('Sign-in page', 'Sign-in page'), sub: PORTAL.ip, at: [2.4, 0.6], badge: 'user' },
      internet: { kind: 'cloud', label: t('Internet', 'Internet'), at: [4.8, 3] },
      server: { ...WEB, label: t('Test server', 'পরীক্ষার server'), sub: 'connectivity-check', at: [7.2, 3] },
    },
    links: [['laptop', 'gateway', 'wireless'], ['gateway', 'portal'], ['gateway', 'internet'], ['internet', 'server']],
  },
  steps: [
    at('laptop', t('Connected — but is there internet?', 'connected — কিন্তু internet আছে?'), t('Right after joining any Wi-Fi, the operating system quietly fetches a known test page to find out.', 'যেকোনো Wi-Fi-তে যোগ দিয়েই operating system চুপচাপ একটা চেনা পরীক্ষার page আনে, জানতে।')),
    send('laptop', 'gateway', 'GET /generate_204', t('The test request is intercepted', 'পরীক্ষার request আটকানো হল'), t('The request is addressed to the test server, but the gateway does not forward traffic from devices that have not signed in.', 'request-টা পরীক্ষার server-এর উদ্দেশে, কিন্তু sign in না করা ডিভাইসের traffic gateway এগিয়ে দেয় না।'), probe.send(probeReq())),
    send('gateway', 'laptop', '302 → sign-in page', t('The gateway answers in the server’s name', 'gateway server-এর নামে উত্তর দেয়'), t('Look at the source IP: it claims to be the test server. This forgery only works on unencrypted HTTP — which is exactly why the test page is plain HTTP.', 'source IP দেখুন: সে নিজেকে পরীক্ষার server বলে দাবি করছে। এই জালিয়াতি শুধু encrypt-না-করা HTTP-তে চলে — ঠিক এ কারণেই পরীক্ষার page সাদা HTTP।'), probe.reply(app('HTTP response', [
      line('Status line', 'HTTP/1.1 302 Found', t('A redirect, where a 204 was expected.', 'একটা redirect, যেখানে 204 আশা করা হয়েছিল।')),
      hdr('Location: http://192.168.1.2/login', t('Where the sign-in page is.', 'sign-in page কোথায়।')),
      hdr('Content-Length: 0', lenNote),
      blankLine(),
    ]))),
    at('laptop', t('"Sign in to network"', '"নেটওয়ার্কে sign in করুন"'), t('The system expected 204 and got a redirect, so it concludes there is a captive portal and pops up a small browser window.', 'system 204 আশা করেছিল, পেল redirect, তাই ধরে নেয় একটা captive portal আছে আর একটা ছোট browser window খোলে।')),
    send('laptop', 'portal', 'POST /login', t('You fill in the form', 'আপনি form পূরণ করলেন'), t('Room number, a voucher code, or just a tick box.', 'ঘরের নম্বর, voucher code, বা শুধু একটা tick box।'), portal.send(app('HTTP request', [
      line('Request line', 'POST /login HTTP/1.1', t('POST sends data to the server.', 'POST server-এ data পাঠায়।')),
      hdr('Host: 192.168.1.2', hostNote),
      hdr('Content-Type: application/x-www-form-urlencoded', typeNote),
      hdr(`Content-Length: ${form.length}`, lenNote),
      blankLine(),
      bodyField(form, t('The form fields. A real portal should use HTTPS for this page.', 'form-এর field। আসল portal-এর এই page-এ HTTPS ব্যবহার করা উচিত।')),
    ]))),
    at('gateway', t('The gateway opens the gate', 'gateway দরজা খুলে দেয়'), t('The portal tells the gateway to allow this laptop, identified by its MAC address. Nothing changes on the laptop itself.', 'portal gateway-কে বলে এই ল্যাপটপকে যেতে দিতে, MAC address দিয়ে চিনে। ল্যাপটপে কিছুই বদলায় না।')),
    send('laptop', 'server', 'GET /generate_204', t('The test again', 'আবার পরীক্ষা'), t('This time the request really reaches the internet.', 'এবার request সত্যিই internet-এ পৌঁছয়।'), probe2.send(probeReq())),
    send('server', 'laptop', '204 No Content', t('Online', 'online'), t('The expected empty answer arrives. The sign-in window closes and everything else starts working.', 'প্রত্যাশিত ফাঁকা উত্তর এল। sign-in window বন্ধ হয় আর বাকি সবকিছু চলতে শুরু করে।'), probe2.reply(app('HTTP response', [
      line('Status line', 'HTTP/1.1 204 No Content', t('204 = success, with no body. Exactly what the system was waiting for.', '204 = সফল, কোনো body নেই। system ঠিক এটারই অপেক্ষায় ছিল।')),
      blankLine(),
    ]))),
  ],
}

export const WEB_LESSONS: Lesson[] = [websocket, quic, doh, proxies, socks5, captive, webrtc, sip, rtspLesson, rtmpLesson]

export { hdr }
