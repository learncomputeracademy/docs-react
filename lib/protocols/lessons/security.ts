// Security lessons: TLS, SSH, DNSSEC, WPA3, RADIUS + 802.1X, WireGuard,
// IPsec. Written from the public specifications (RFC 8446, 4253, 4034/4035,
// 2865, 3748, 7296, 4303; IEEE 802.11 and 802.1X; the WireGuard paper).
// Keys, signatures and ciphertext are deterministic stand-in bytes of the
// right length — every such field says so.
import { ADDR, ascii, hex0x, ipBytes, noise, size, t, u16, u32, type Field, type L, type Layer } from '../packet'
import {
  DNS, LAPTOP, MAIL, RADIUS_SRV, RESOLVER, SERVER, VPN, WEB, app, at, conversation, f, far, homeTopo, ipPacket, layer, send, udpPacket,
  type Endpoint, type Lesson, type NodeDef,
} from '../net'
import { tlsEncrypted, tlsHello } from './core'
import { echoReq, eth, le16, wifi } from './network'

const laptopNode = (x: number, y: number, sub = ADDR.laptopIp): NodeDef => ({ kind: 'laptop', label: t('Laptop', 'ল্যাপটপ'), sub, at: [x, y] })
const standIn = (what: L): L => t(`${what.en} Stand-in bytes of the right length.`, `${what.bn} ঠিক দৈর্ঘ্যের বদলি byte।`)

// ═══ TLS ════════════════════════════════════════════════════════════════
const tlsTalk = conversation(LAPTOP, MAIL, 993)

const tls: Lesson = {
  id: 'tls',
  name: 'TLS',
  category: 'security',
  tagline: t('The lock under HTTPS — and much else', 'HTTPS-এর নিচের তালা — আরও অনেক কিছুরও'),
  intro: t('TLS is not only for the web. The same handshake protects mail, chat, VPNs and app traffic. It gives three things: nobody can read the data, nobody can change it unnoticed, and you know who you are talking to. Here a mail app connects to its server.', 'TLS শুধু web-এর জন্য নয়। একই handshake mail, chat, VPN আর app-এর traffic রক্ষা করে। এটা তিনটে জিনিস দেয়: কেউ data পড়তে পারে না, কেউ অলক্ষ্যে বদলাতে পারে না, আর আপনি জানেন কার সঙ্গে কথা বলছেন। এখানে একটা mail app তার server-এ connect করছে।'),
  topo: homeTopo({ mail: far(t('Mail server', 'Mail server'), 'mail.example.com:993', 'lock') }),
  steps: [
    send('laptop', 'mail', 'ClientHello', t('ClientHello', 'ClientHello'), t('The client offers its cipher suites and — already — its half of a key exchange.', 'client তার cipher suite দেয় আর — এখনই — key exchange-এ নিজের অর্ধেক।'), tlsTalk.send(tlsHello(true))),
    send('mail', 'laptop', 'ServerHello', t('ServerHello', 'ServerHello'), t('The server chooses a suite and sends its own half.', 'server একটা suite বেছে নিজের অর্ধেক পাঠায়।'), tlsTalk.reply(tlsHello(false))),
    at('laptop', t('Two halves, one secret', 'দুটো অর্ধেক, একটা গোপন মান'), t('Each side combines its own private value with the other’s public one and arrives at the same number. An eavesdropper saw both public halves and still cannot compute it. From that secret both derive the encryption keys.', 'প্রতিটা পক্ষ নিজের private মানের সঙ্গে অন্যের public মান মিলিয়ে একই সংখ্যায় পৌঁছয়। আড়ি পাতা কেউ দুটো public অর্ধেকই দেখেছে, তবু সেটা বের করতে পারে না। ওই গোপন মান থেকে দুপক্ষ encryption key বানায়।')),
    send('mail', 'laptop', 'Encrypted: certificate', t('The certificate, already encrypted', 'certificate, এর মধ্যেই encrypt করা'), t('The server sends its certificate chain, a signature over the whole handshake so far, and a Finished check.', 'server পাঠায় তার certificate chain, এ পর্যন্ত পুরো handshake-এর ওপর একটা signature, আর একটা Finished check।'), tlsTalk.reply(tlsEncrypted('TLS encrypted handshake', 'certificate chain, signature, Finished', 96, 131, t('Encrypted handshake messages. Shortened here — the real flight is 2–4 KB, mostly certificates.', 'encrypt করা handshake message। এখানে ছোট করা — আসলটা 2–4 KB, বেশিরভাগই certificate।')))),
    at('laptop', t('Is this really mail.example.com?', 'এটা কি সত্যিই mail.example.com?'), t('The client checks a chain of signatures: the server’s certificate was signed by an intermediate authority, which was signed by a root authority already trusted by this device. It also checks the name and the dates. Then it verifies the handshake signature — proof the server holds the private key.', 'client সইয়ের একটা শিকল যাচাই করে: server-এর certificate সই করেছে একটা intermediate authority, তাকে সই করেছে একটা root authority, যাকে এই ডিভাইস আগে থেকেই বিশ্বাস করে। নাম আর তারিখও দেখে। তারপর handshake signature যাচাই করে — প্রমাণ যে server-এর কাছে private key আছে।')),
    send('laptop', 'mail', 'Encrypted: Finished', t('Client Finished', 'Client Finished'), t('A keyed hash of everything exchanged. If an attacker had altered even the list of cipher suites, the two hashes would differ and the connection would be dropped.', 'আদানপ্রদান হওয়া সবকিছুর একটা keyed hash। আক্রমণকারী cipher suite-এর তালিকাটুকুও বদলালে দুটো hash মিলত না আর connection ফেলে দেওয়া হত।'), tlsTalk.send(tlsEncrypted('TLS encrypted handshake', 'Finished', 53, 132, t('The Finished message, encrypted.', 'Finished message, encrypt করা।')))),
    send('laptop', 'mail', 'Encrypted data', t('Application data', 'Application data'), t('Now the mail login travels inside the tunnel. Every record carries an authentication tag, so a single flipped bit is detected.', 'এবার mail-এর login সুড়ঙ্গের ভেতর দিয়ে যায়। প্রতিটা record-এ একটা authentication tag থাকে, তাই একটা bit বদলালেও ধরা পড়ে।'), tlsTalk.send(tlsEncrypted('TLS application data', 'a1 LOGIN bob ••••••', 48, 133, t('The IMAP login, encrypted. The last 16 bytes are the authentication tag.', 'IMAP login, encrypt করা। শেষ 16 byte হল authentication tag।')))),
    at('laptop', t('Keys that are thrown away', 'ফেলে দেওয়া key'), t('The key-exchange values were made up for this connection and are deleted afterwards. Someone who records the traffic today and steals the server’s private key next year still cannot decrypt it. This is forward secrecy.', 'key-exchange-এর মানগুলো এই connection-এর জন্যই বানানো আর পরে মুছে ফেলা হয়। কেউ আজ traffic record করে পরের বছর server-এর private key চুরি করলেও সেটা decrypt করতে পারবে না। এটাই forward secrecy।')),
  ],
}

// ═══ SSH ════════════════════════════════════════════════════════════════
const ssh = conversation(LAPTOP, SERVER, 22)
const str = (s: string) => [...u32(s.length), ...ascii(s)]
const blob = (n: number, seed: number) => [...u32(n), ...noise(n, seed)]

/** SSH binary packet: length, padding length, payload, padding to a multiple of 8. */
function sshPacket(name: string, payload: Field[]): Layer {
  const n = size(payload)
  let pad = 8 - ((5 + n) % 8)
  if (pad < 4) pad += 8
  return app(name, [
    f('Packet length', `${1 + n + pad} bytes`, u32(1 + n + pad), t('Size of the rest of the packet.', 'packet-এর বাকি অংশের মাপ।')),
    f('Padding length', `${pad} bytes`, [pad], t('How many padding bytes are at the end.', 'শেষে কটা padding byte আছে।')),
    ...payload,
    f('Padding', 'random', noise(pad, n), t('Random bytes that round the packet up to a multiple of 8.', 'random byte, যা packet-কে 8-এর গুণিতকে পূর্ণ করে।')),
  ])
}
const sshEncrypted = (what: string, n: number, seed: number): Layer => app('SSH encrypted packet', [
  f('Encrypted packet', what, noise(n, seed), t('The packet — including its length field — encrypted. An observer cannot even tell where one message ends. Shortened here.', 'packet — তার length field-সহ — encrypt করা। পর্যবেক্ষক এটুকুও বলতে পারে না কোথায় একটা message শেষ। এখানে ছোট করা।')),
  f('Authentication tag', '16 bytes', noise(16, seed + 1), t('Detects any change to the packet.', 'packet-এ যেকোনো বদল ধরে।')),
])

const sshLesson: Lesson = {
  id: 'ssh',
  name: 'SSH',
  category: 'security',
  tagline: t('A secure remote command line', 'নিরাপদ remote command line'),
  intro: t('SSH is how administrators and developers control servers from far away. It encrypts everything, and it handles trust differently from TLS: instead of certificate authorities, you remember each server’s key the first time you meet it.', 'SSH দিয়ে administrator আর developer-রা দূর থেকে server নিয়ন্ত্রণ করে। এটা সবকিছু encrypt করে, আর বিশ্বাসের ব্যাপারটা TLS থেকে আলাদাভাবে সামলায়: certificate authority-র বদলে আপনি প্রথম দেখাতেই প্রতিটা server-এর key মনে রাখেন।'),
  topo: homeTopo({ server: far(t('Linux server', 'Linux server'), 'server.example.com', 'lock') }),
  steps: [
    send('laptop', 'server', 'SSH-2.0-OpenSSH', t('Version banners', 'version banner'), t('Both sides start with one line of plain text naming the protocol and software. The server sends the same.', 'দুপক্ষই শুরু করে এক লাইন সাদা text দিয়ে, যাতে protocol আর software-এর নাম থাকে। server-ও তাই পাঠায়।'), ssh.send(app('SSH banner', [f('Identification', 'SSH-2.0-OpenSSH_9.6', ascii('SSH-2.0-OpenSSH_9.6\r\n'), t('Protocol version 2.0 and the software name. This is the last readable text in the whole session.', 'Protocol version 2.0 আর software-এর নাম। পুরো session-এ এটাই শেষ পড়া-যায়-এমন লেখা।'))]))),
    send('laptop', 'server', 'KEXINIT', t('KEXINIT — what each side supports', 'KEXINIT — কোন পক্ষ কী পারে'), t('Lists of algorithms for key exchange, host keys, encryption and integrity. The first one both sides share is used.', 'key exchange, host key, encryption আর integrity-র algorithm-এর তালিকা। দুপক্ষের তালিকায় প্রথম যেটা মেলে সেটাই ব্যবহার হয়।'), ssh.send(sshPacket('SSH KEXINIT', [
      f('Message type', '20 (KEXINIT)', [20], t('20 = start of key exchange.', '20 = key exchange-এর শুরু।')),
      f('Cookie', '16 random bytes', noise(16, 141), t('Random bytes that make every key exchange unique.', 'random byte, যা প্রতিটা key exchange-কে আলাদা করে।')),
      f('Key exchange algorithms', 'curve25519-sha256', str('curve25519-sha256'), t('A name list: a 4-byte length, then comma-separated names.', 'একটা নামের তালিকা: 4-byte দৈর্ঘ্য, তারপর কমা দিয়ে আলাদা নাম।')),
      f('Host key algorithms', 'ssh-ed25519', str('ssh-ed25519'), t('The kinds of server key the client can verify.', 'client কোন ধরনের server key যাচাই করতে পারে।')),
      f('Encryption algorithms', 'chacha20-poly1305@openssh.com', str('chacha20-poly1305@openssh.com'), t('Ciphers for the session. Simplified: the real message has ten lists, one per direction and purpose.', 'session-এর cipher। সরল করা: আসল message-এ দশটা তালিকা থাকে, প্রতি দিক আর উদ্দেশ্যে একটা।')),
    ]))),
    send('laptop', 'server', 'ECDH init', t('Key exchange — the client’s half', 'key exchange — client-এর অর্ধেক'), t('A freshly made public key, used once.', 'সদ্য বানানো একটা public key, একবারই ব্যবহার হয়।'), ssh.send(sshPacket('SSH key exchange init', [
      f('Message type', '30 (ECDH init)', [30], t('30 = the client’s key-exchange value.', '30 = client-এর key-exchange মান।')),
      f('Client public key', '32 bytes', blob(32, 142), standIn(t('The client’s one-time Curve25519 public key.', 'client-এর একবারের Curve25519 public key।'))),
    ]))),
    send('server', 'laptop', 'ECDH reply', t('The server’s half — and its identity', 'server-এর অর্ধেক — আর তার পরিচয়'), t('The reply carries the server’s permanent host key and a signature made with it over everything exchanged so far.', 'উত্তরে থাকে server-এর স্থায়ী host key আর এ পর্যন্ত আদানপ্রদান হওয়া সবকিছুর ওপর সেটা দিয়ে করা একটা signature।'), ssh.reply(sshPacket('SSH key exchange reply', [
      f('Message type', '31 (ECDH reply)', [31], t('31 = the server’s answer.', '31 = server-এর উত্তর।')),
      f('Host key', 'ssh-ed25519, 32 bytes', [...u32(51), ...str('ssh-ed25519'), ...blob(32, 143)], standIn(t('The server’s long-term public key — its identity.', 'server-এর দীর্ঘমেয়াদি public key — তার পরিচয়।'))),
      f('Server public key', '32 bytes', blob(32, 144), standIn(t('The server’s one-time key-exchange value.', 'server-এর একবারের key-exchange মান।'))),
      f('Signature', 'ed25519, 64 bytes', [...u32(83), ...str('ssh-ed25519'), ...blob(64, 145)], standIn(t('Proves the server holds the private half of the host key.', 'প্রমাণ করে server-এর কাছে host key-র private অর্ধেক আছে।'))),
    ]))),
    at('laptop', t('"Are you sure you want to continue?"', '"আপনি কি নিশ্চিত চালিয়ে যেতে চান?"'), t('The first time, SSH shows the host key’s fingerprint and asks you. Say yes and it is saved in known_hosts. On every later visit the key must match — if it ever changes, SSH refuses loudly, because someone may be impersonating the server.', 'প্রথমবার SSH host key-র fingerprint দেখিয়ে আপনাকে জিজ্ঞেস করে। হ্যাঁ বললে সেটা known_hosts-এ রাখা হয়। পরের প্রতিবার key মিলতে হবে — কখনও বদলালে SSH জোর গলায় অস্বীকার করে, কারণ কেউ হয়তো server সেজে আছে।')),
    send('laptop', 'server', 'NEWKEYS', t('NEWKEYS — switch on encryption', 'NEWKEYS — encryption চালু'), t('"Everything after this message uses the new keys." Both sides send it.', '"এই message-এর পরের সবকিছু নতুন key ব্যবহার করবে।" দুপক্ষই এটা পাঠায়।'), ssh.send(sshPacket('SSH NEWKEYS', [f('Message type', '21 (NEWKEYS)', [21], t('21 = start using the negotiated keys.', '21 = ঠিক হওয়া key ব্যবহার শুরু করো।'))]))),
    send('laptop', 'server', 'Encrypted: login', t('Logging in, inside the tunnel', 'সুড়ঙ্গের ভেতরে login'), t('With a key pair, the client signs a challenge with its private key; the server checks it against the public key in authorized_keys. No password crosses the network at all.', 'key pair থাকলে client নিজের private key দিয়ে একটা challenge সই করে; server সেটা authorized_keys-এর public key-র সঙ্গে মেলায়। কোনো password নেটওয়ার্ক পেরোয়ই না।'), ssh.send(sshEncrypted('public-key authentication', 96, 146))),
    send('laptop', 'server', 'Encrypted: "ls"', t('Your keystrokes', 'আপনার keystroke'), t('Each key you press travels as a tiny encrypted packet, and the server’s output comes back the same way. The same connection can also carry file transfers (SFTP) and forwarded ports.', 'আপনার টেপা প্রতিটা key একটা ছোট encrypted packet হিসেবে যায়, আর server-এর output একইভাবে ফেরে। একই connection file transfer (SFTP) আর forward করা port-ও বহন করতে পারে।'), ssh.send(sshEncrypted('channel data', 32, 148))),
  ],
}

// ═══ DNSSEC ═════════════════════════════════════════════════════════════
const AUTH: Endpoint = { ip: '199.43.135.53', mac: '02:00:00:00:01:40' }
const NAME = [7, ...ascii('example'), 3, ...ascii('com'), 0]
const SIGNED_AT = 1767225600 // 2026-01-01

const dnsHead = (id: number, flags: number, flagText: string, flagNote: L, answers: number): Field[] => [
  f('Transaction ID', hex0x(id), u16(id), t('Matches the answer to the question.', 'প্রশ্নের সঙ্গে উত্তর মেলায়।')),
  f('Flags', flagText, u16(flags), flagNote),
  f('Questions', '1', u16(1), t('One question.', 'একটা প্রশ্ন।')),
  f('Answers', String(answers), u16(answers), t('How many answer records follow.', 'এরপর কটা answer record আছে।')),
  f('Authority records', '0', u16(0), t('None.', 'নেই।')),
  f('Additional records', '1', u16(1), t('One: the OPT record at the end.', 'একটা: শেষের OPT record।')),
  f('Question', 'example.com, type A', [...NAME, ...u16(1), ...u16(1)], t('The name, the record type (A) and the class (IN).', 'নাম, record-এর ধরন (A) আর class (IN)।')),
]
const opt = f('OPT record', 'DNSSEC OK, 1232-byte replies', [0, ...u16(41), ...u16(1232), 0, 0, 0x80, 0, ...u16(0)], t('A pseudo-record that carries options. The bit set here is "DO" — DNSSEC OK — which asks for signatures to be included.', 'একটা ছদ্ম-record যা option বহন করে। এখানে সেট করা bit হল "DO" — DNSSEC OK — যা signature-ও পাঠাতে বলে।'))
const aRecord = f('Answer: A record', ADDR.serverIp, [0xc0, 0x0c, ...u16(1), ...u16(1), ...u32(3600), ...u16(4), ...ipBytes(ADDR.serverIp)], t('The address, exactly as in ordinary DNS.', 'address, সাধারণ DNS-এর মতোই।'))
const rrsig = (() => {
  const rdata = [...u16(1), 13, 2, ...u32(3600), ...u32(SIGNED_AT + 21 * 86400), ...u32(SIGNED_AT), ...u16(31406), ...NAME, ...noise(64, 151)]
  return f('Answer: RRSIG record', 'signature over the A record', [0xc0, 0x0c, ...u16(46), ...u16(1), ...u32(3600), ...u16(rdata.length), ...rdata], t('A digital signature over the A record, made with example.com’s private key. Inside: the type it covers, the algorithm (13 = ECDSA P-256), validity dates, the key’s ID, the signer’s name and 64 signature bytes (stand-in bytes here).', 'A record-এর ওপর একটা digital signature, example.com-এর private key দিয়ে করা। ভেতরে: কোন ধরন ঢাকছে, algorithm (13 = ECDSA P-256), বৈধতার তারিখ, key-র ID, সইকারীর নাম আর 64 byte signature (এখানে বদলি byte)।'))
})()
const dnssecMsg = (name: string, id: number, flags: number, flagText: string, flagNote: L, records: Field[]): Layer => app(name, [...dnsHead(id, flags, flagText, flagNote, records.length), ...records, opt])

const dnssec: Lesson = {
  id: 'dnssec',
  name: 'DNSSEC',
  category: 'security',
  tagline: t('Signed DNS answers', 'সই করা DNS উত্তর'),
  intro: t('Ordinary DNS trusts whatever answer arrives first, so a forged answer can send you to a fake site. DNSSEC adds digital signatures: the answer can be proved genuine. It does not hide anything — it only stops lies.', 'সাধারণ DNS প্রথমে যে উত্তর আসে তাকেই বিশ্বাস করে, তাই জাল উত্তর আপনাকে নকল site-এ পাঠাতে পারে। DNSSEC digital signature যোগ করে: উত্তর যে আসল তা প্রমাণ করা যায়। এটা কিছু লুকোয় না — শুধু মিথ্যে আটকায়।'),
  topo: homeTopo({ dns: RESOLVER, auth: far(t('example.com name server', 'example.com name server'), AUTH.ip, 'key') }),
  steps: [
    send('laptop', 'dns', 'Query', t('An ordinary question', 'একটা সাধারণ প্রশ্ন'), t('The laptop asks its resolver as usual. The checking is the resolver’s job.', 'ল্যাপটপ যথারীতি তার resolver-কে জিজ্ঞেস করে। যাচাইয়ের কাজ resolver-এর।'), udpPacket(LAPTOP, DNS, 53124, 53, dnssecMsg('DNS query', 0x1a2b, 0x0100, 'query, recursion desired', t('A normal recursive query.', 'একটা সাধারণ recursive query।'), []))),
    send('dns', 'auth', 'Query + DO bit', t('"Send the signatures too"', '"signature-ও পাঠাও"'), t('The resolver asks example.com’s own name server, with the DNSSEC OK bit set.', 'resolver example.com-এর নিজের name server-কে জিজ্ঞেস করে, DNSSEC OK bit সেট করে।'), udpPacket(DNS, AUTH, 40000, 53, dnssecMsg('DNS query', 0x7c11, 0x0000, 'query', t('A plain query to an authoritative server.', 'authoritative server-এর কাছে একটা সাদা query।'), []))),
    send('auth', 'dns', 'A + RRSIG', t('Answer and signature', 'উত্তর আর signature'), t('Two records: the address, and a signature over it. The private key that made the signature never leaves example.com’s operator.', 'দুটো record: address, আর তার ওপর একটা signature। যে private key signature বানিয়েছে তা example.com-এর পরিচালকের কাছ থেকে কখনও বেরোয় না।'), udpPacket(AUTH, DNS, 53, 40000, dnssecMsg('DNS response', 0x7c11, 0x8400, 'response, authoritative', t('An authoritative answer.', 'একটা authoritative উত্তর।'), [aRecord, rrsig]))),
    at('dns', t('Checking the chain of trust', 'বিশ্বাসের শিকল যাচাই'), t('The resolver fetches example.com’s public key and verifies the signature. But is that key genuine? The .com zone holds a signed fingerprint of it, and the root zone holds one for .com. The root’s key is built into the resolver. Every link must check out.', 'resolver example.com-এর public key এনে signature যাচাই করে। কিন্তু সেই key কি আসল? .com zone-এ তার একটা সই করা fingerprint আছে, আর root zone-এ আছে .com-এর। root-এর key resolver-এর ভেতরেই বসানো। প্রতিটা ধাপ মিলতে হবে।')),
    send('dns', 'laptop', 'Answer, AD flag', t('"Authenticated data"', '"Authenticated data"'), t('The answer reaches the laptop with the AD flag set: the resolver vouches that it verified the signatures. Had anything failed, the laptop would get an error instead of a forged address.', 'উত্তর ল্যাপটপে পৌঁছয় AD flag সেট করে: resolver নিশ্চয়তা দিচ্ছে সে signature যাচাই করেছে। কিছু ব্যর্থ হলে ল্যাপটপ জাল address-এর বদলে একটা error পেত।'), udpPacket(DNS, LAPTOP, 53, 53124, dnssecMsg('DNS response', 0x1a2b, 0x81a0, 'response, authenticated data', t('Bit 5 is the AD flag: "I validated this".', 'Bit 5 হল AD flag: "আমি এটা যাচাই করেছি"।'), [aRecord]))),
  ],
}

// ═══ WPA3 ═══════════════════════════════════════════════════════════════
const sae = (toAp: boolean, seqNo: number, frame: number, body: Field[]): Layer[] => wifi('authentication', 11, toAp, frame, [
  f('Algorithm', 'SAE (3)', le16(3), t('3 = Simultaneous Authentication of Equals, the WPA3 method.', '3 = Simultaneous Authentication of Equals, WPA3-র পদ্ধতি।')),
  f('Sequence', seqNo === 1 ? '1 (commit)' : '2 (confirm)', le16(seqNo), t('1 = commit, 2 = confirm.', '1 = commit, 2 = confirm।')),
  f('Status', 'success (0)', le16(0), t('Zero means no error.', 'শূন্য মানে error নেই।')),
  ...body,
])
const commit = (seed: number): Field[] => [
  f('Group', '19 (P-256 curve)', le16(19), t('Which elliptic curve the maths uses.', 'অঙ্কে কোন elliptic curve ব্যবহার হচ্ছে।')),
  f('Scalar', '32 bytes', noise(32, seed), standIn(t('A number derived from a fresh random secret.', 'একটা টাটকা random secret থেকে বানানো সংখ্যা।'))),
  f('Element', '64 bytes', noise(64, seed + 1), standIn(t('A point on the curve, built from the password and the same random secret. On its own it reveals nothing about the password.', 'curve-এর ওপর একটা বিন্দু, password আর একই random secret থেকে বানানো। একা এটা password সম্পর্কে কিছুই জানায় না।'))),
]
const confirm = (seed: number): Field[] => [
  f('Send-confirm counter', '1', le16(1), t('Counts confirm messages, to block replays.', 'confirm message গোনে, replay আটকাতে।')),
  f('Confirm', '32 bytes', noise(32, seed), standIn(t('A hash that only someone who derived the same key could produce.', 'একটা hash, যা শুধু একই key বের করতে পারা কেউই বানাতে পারে।'))),
]

const wpa3: Lesson = {
  id: 'wpa3',
  name: 'WPA3',
  category: 'security',
  tagline: t('Proving the Wi-Fi password without sending it', 'না পাঠিয়েই Wi-Fi password প্রমাণ'),
  intro: t('With older WPA2, someone who records one login can take the recording home and try billions of password guesses offline. WPA3 replaces that step with an exchange called SAE, where every guess requires a live conversation with the access point.', 'পুরনো WPA2-তে কেউ একটা login record করে বাড়ি নিয়ে গিয়ে offline-এ কোটি কোটি password আন্দাজ করে দেখতে পারে। WPA3 ওই ধাপের বদলে SAE নামের একটা আদানপ্রদান আনে, যেখানে প্রতিটা আন্দাজের জন্য access point-এর সঙ্গে সরাসরি কথা বলতে হয়।'),
  topo: {
    nodes: {
      laptop: laptopNode(0, 2, 'no address yet'),
      ap: { kind: 'ap', label: t('Access point', 'Access point'), sub: 'HomeWiFi', at: [3, 2], badge: 'lock' },
    },
    links: [['laptop', 'ap', 'wireless']],
  },
  steps: [
    at('laptop', t('The password becomes a point on a curve', 'password হয়ে যায় curve-এর একটা বিন্দু'), t('Both the laptop and the access point know the password. Each turns it, with the two MAC addresses, into the same secret point on an elliptic curve. The password is never transmitted in any form.', 'ল্যাপটপ আর access point দুজনেই password জানে। প্রত্যেকে সেটাকে, দুটো MAC address-সহ, elliptic curve-এর ওপর একই গোপন বিন্দুতে বদলায়। password কোনো রূপেই পাঠানো হয় না।')),
    send('laptop', 'ap', 'SAE commit', t('Commit — the laptop’s half', 'Commit — ল্যাপটপের অর্ধেক'), t('The laptop mixes that secret point with a fresh random number and sends the result.', 'ল্যাপটপ ওই গোপন বিন্দুকে একটা টাটকা random সংখ্যার সঙ্গে মিশিয়ে ফল পাঠায়।'), sae(true, 1, 21, commit(161))),
    send('ap', 'laptop', 'SAE commit', t('Commit — the access point’s half', 'Commit — access point-এর অর্ধেক'), t('The access point does the same with its own random number.', 'access point নিজের random সংখ্যা দিয়ে একই কাজ করে।'), sae(false, 1, 1301, commit(163))),
    at('laptop', t('The same key — only if the password matched', 'একই key — শুধু password মিললে'), t('Each side combines what it received with its own secret. If both started from the same password they reach the same key. An eavesdropper who recorded both commits cannot test password guesses against them.', 'প্রতিটা পক্ষ যা পেয়েছে তা নিজের secret-এর সঙ্গে মেলায়। দুজনে একই password থেকে শুরু করে থাকলে একই key-তে পৌঁছয়। দুটো commit record করা কেউ সেগুলোর ওপর password আন্দাজ পরীক্ষা করতে পারে না।')),
    send('laptop', 'ap', 'SAE confirm', t('Confirm — proof of the key', 'Confirm — key-র প্রমাণ'), t('The laptop sends a hash that depends on the key.', 'ল্যাপটপ key-র ওপর নির্ভরশীল একটা hash পাঠায়।'), sae(true, 2, 22, confirm(165))),
    send('ap', 'laptop', 'SAE confirm', t('Confirm — and the reverse', 'Confirm — আর উল্টো দিকে'), t('The access point proves the same. A wrong password fails here, and the attacker has used up one live attempt.', 'access point-ও একই প্রমাণ দেয়। ভুল password এখানেই ব্যর্থ হয়, আর আক্রমণকারীর একটা সরাসরি চেষ্টা খরচ হয়ে যায়।'), sae(false, 2, 1302, confirm(166))),
    at('ap', t('Fresh keys for this session', 'এই session-এর জন্য টাটকা key'), t('A four-message handshake then derives the actual encryption keys from that shared key and two new random numbers. Every session gets different keys, so learning the password later does not unlock traffic recorded earlier.', 'এরপর চার-message-এর একটা handshake ওই shared key আর দুটো নতুন random সংখ্যা থেকে আসল encryption key বের করে। প্রতিটা session আলাদা key পায়, তাই পরে password জানলেও আগে record করা traffic খোলা যায় না।')),
  ],
}

// ═══ RADIUS + 802.1X ════════════════════════════════════════════════════
const SWITCH: Endpoint = { ip: '192.168.1.3', mac: '00:1b:54:0a:0b:30', lan: true }
const PAE = '01:80:c2:00:00:03'
const eapId = (() => {
  const id = ascii('alice@example.org')
  return [2, 1, ...u16(5 + id.length), 1, ...id]
})()
const attr = (type: number, name: string, value: string, body: number[], note: L): Field => f(`Attribute ${type}: ${name}`, value, [type, body.length + 2, ...body], note)

function eapol(name: string, toSwitch: boolean, eap: number[], fields: Field[]): Layer[] {
  return [
    eth(toSwitch ? ADDR.laptopMac : SWITCH.mac, toSwitch ? PAE : ADDR.laptopMac, 0x888e, 'EAPOL', t('0x888e = EAP over LAN. Until login succeeds, this is the only kind of frame the switch port will accept.', '0x888e = EAP over LAN। login সফল না হওয়া পর্যন্ত switch-এর port শুধু এই ধরনের frame-ই নেয়।')),
    layer('app', name, [
      f('EAPOL version + type', 'version 2, EAP packet', [2, 0], t('Type 0 means an EAP message is inside.', 'Type 0 মানে ভেতরে একটা EAP message আছে।')),
      f('Length', `${eap.length} bytes`, u16(eap.length), t('Size of the EAP message.', 'EAP message-এর মাপ।')),
      ...fields,
    ]),
  ]
}
function radius(name: string, code: number, codeName: string, id: number, attrs: Field[]): Layer {
  return app(name, [
    f('Code', `${code} (${codeName})`, [code], t('1 = Access-Request, 2 = Access-Accept, 3 = Access-Reject, 11 = Access-Challenge.', '1 = Access-Request, 2 = Access-Accept, 3 = Access-Reject, 11 = Access-Challenge।')),
    f('Identifier', String(id), [id], t('Matches replies to requests.', 'request-এর সঙ্গে উত্তর মেলায়।')),
    f('Length', `${20 + size(attrs)} bytes`, u16(20 + size(attrs)), t('Size of the whole RADIUS message.', 'পুরো RADIUS message-এর মাপ।')),
    f('Authenticator', '16 bytes', noise(16, 170 + code), standIn(t('Random in a request; in a reply, a hash that proves it came from the real server.', 'request-এ random; উত্তরে একটা hash যা প্রমাণ করে এটা আসল server থেকে এসেছে।'))),
    ...attrs,
  ])
}
const msgAuth = attr(80, 'Message-Authenticator', '16 bytes', noise(16, 175), standIn(t('A keyed checksum of the message, made with a secret shared by the switch and the server.', 'message-এর একটা keyed checksum, switch আর server-এর ভাগ করা secret দিয়ে বানানো।')))

const radiusLesson: Lesson = {
  id: 'radius',
  name: 'RADIUS',
  category: 'security',
  tagline: t('Office network login (802.1X)', 'অফিস নেটওয়ার্কের login (802.1X)'),
  intro: t('In an office, everyone signs in to the network with their own account, not a shared password. Three parties are involved: your laptop, the switch or access point you plug into, and a RADIUS server that actually holds the accounts.', 'অফিসে সবাই নেটওয়ার্কে নিজের account দিয়ে sign in করে, ভাগ করা password দিয়ে নয়। তিন পক্ষ জড়িত: আপনার ল্যাপটপ, যে switch বা access point-এ আপনি যুক্ত হন, আর একটা RADIUS server যার কাছে account-গুলো আসলে থাকে।'),
  topo: {
    nodes: {
      laptop: laptopNode(0, 2.4, 'not signed in'),
      switch: { kind: 'switch', label: t('Office switch', 'অফিসের switch'), sub: SWITCH.ip, at: [2.4, 2.4] },
      radius: { kind: 'server', label: t('RADIUS server', 'RADIUS server'), sub: RADIUS_SRV.ip, at: [4.8, 2.4], badge: 'key' },
    },
    links: [['laptop', 'switch'], ['switch', 'radius']],
  },
  steps: [
    at('switch', t('The port is locked', 'port তালাবন্ধ'), t('You plug in. The switch blocks everything on that port except login frames, and asks who you are.', 'আপনি তার লাগালেন। switch ওই port-এ login frame ছাড়া সবকিছু আটকে রাখে, আর জিজ্ঞেস করে আপনি কে।')),
    send('laptop', 'switch', 'EAP identity', t('"I am alice@example.org"', '"আমি alice@example.org"'), t('The laptop answers with its identity — not yet a password.', 'ল্যাপটপ নিজের পরিচয় দিয়ে উত্তর দেয় — এখনও password নয়।'), eapol('EAP response', true, eapId, [
      f('EAP code + ID', 'response, 1', [2, 1], t('Code 2 = a response. The ID matches it to the request.', 'Code 2 = একটা উত্তর। ID সেটাকে request-এর সঙ্গে মেলায়।')),
      f('EAP length', `${eapId.length} bytes`, u16(eapId.length), t('Size of this EAP message.', 'এই EAP message-এর মাপ।')),
      f('EAP type', 'identity (1)', [1], t('1 = "who are you?" and its answer.', '1 = "তুমি কে?" আর তার উত্তর।')),
      f('Identity', 'alice@example.org', ascii('alice@example.org'), t('The username.', 'username।')),
    ])),
    send('switch', 'radius', 'Access-Request', t('The switch passes it on', 'switch সেটা এগিয়ে দেয়'), t('The switch does not judge the login. It wraps the EAP message in a RADIUS request and sends it to the server over UDP port 1812.', 'switch login-এর বিচার করে না। সে EAP message-টা একটা RADIUS request-এ মুড়ে UDP port 1812-এ server-এর কাছে পাঠায়।'), udpPacket(SWITCH, RADIUS_SRV, 49152, 1812, radius('RADIUS Access-Request', 1, 'Access-Request', 7, [
      attr(1, 'User-Name', 'alice@example.org', ascii('alice@example.org'), t('The identity the laptop gave.', 'ল্যাপটপের দেওয়া পরিচয়।')),
      attr(4, 'NAS-IP-Address', SWITCH.ip, ipBytes(SWITCH.ip), t('Which switch is asking.', 'কোন switch জিজ্ঞেস করছে।')),
      attr(31, 'Calling-Station-Id', ADDR.laptopMac, ascii(ADDR.laptopMac.toUpperCase().replace(/:/g, '-')), t('The laptop’s MAC address, as text.', 'ল্যাপটপের MAC address, লেখা আকারে।')),
      attr(79, 'EAP-Message', 'the EAP response', eapId, t('The laptop’s EAP message, carried untouched.', 'ল্যাপটপের EAP message, অবিকল বহন করা।')),
      msgAuth,
    ]))),
    send('radius', 'switch', 'Access-Challenge', t('"Prove it"', '"প্রমাণ দাও"'), t('The server replies with a challenge that starts a protected login method. The switch relays it to the laptop.', 'server একটা challenge দিয়ে উত্তর দেয়, যা একটা সুরক্ষিত login পদ্ধতি শুরু করে। switch সেটা ল্যাপটপে পৌঁছে দেয়।'), udpPacket(RADIUS_SRV, SWITCH, 1812, 49152, radius('RADIUS Access-Challenge', 11, 'Access-Challenge', 7, [
      attr(79, 'EAP-Message', 'start of PEAP', [1, 2, ...u16(6), 25, 0x20], t('An EAP request of type 25 (PEAP) with the "start" flag: "open an encrypted tunnel to me".', 'type 25 (PEAP)-এর একটা EAP request, "start" flag-সহ: "আমার সঙ্গে একটা encrypted সুড়ঙ্গ খোলো"।')),
      attr(24, 'State', '8 bytes', noise(8, 176), t('A token the switch must send back, so the server can find this conversation again.', 'একটা token যা switch-কে ফেরত পাঠাতে হয়, যাতে server এই কথোপকথন আবার খুঁজে পায়।')),
      msgAuth,
    ]))),
    at('laptop', t('The password travels in a tunnel', 'password সুড়ঙ্গ দিয়ে যায়'), t('Laptop and server set up TLS through the switch — several more round trips — and only then is the password checked. The switch carries the messages but cannot read them.', 'ল্যাপটপ আর server switch-এর মধ্য দিয়ে TLS তৈরি করে — আরও কয়েকটা round trip — আর তারপরই password যাচাই হয়। switch message-গুলো বহন করে কিন্তু পড়তে পারে না।')),
    send('radius', 'switch', 'Access-Accept', t('Accepted — with instructions', 'গৃহীত — নির্দেশসহ'), t('The server approves and can tell the switch how to treat this user, such as which VLAN to place them in.', 'server অনুমোদন দেয়, আর switch-কে বলে দিতে পারে এই ব্যবহারকারীকে কীভাবে রাখতে হবে, যেমন কোন VLAN-এ।'), udpPacket(RADIUS_SRV, SWITCH, 1812, 49152, radius('RADIUS Access-Accept', 2, 'Access-Accept', 12, [
      attr(79, 'EAP-Message', 'EAP success', [3, 9, ...u16(4)], t('EAP code 3 = success, to be passed on to the laptop.', 'EAP code 3 = সফল, ল্যাপটপে পৌঁছে দেওয়ার জন্য।')),
      attr(64, 'Tunnel-Type', 'VLAN (13)', u32(13), t('The next attributes describe a VLAN.', 'পরের attribute-গুলো একটা VLAN-এর বর্ণনা।')),
      attr(81, 'Tunnel-Private-Group-ID', 'VLAN 20', ascii('20'), t('Put this user in VLAN 20 — the staff network.', 'এই ব্যবহারকারীকে VLAN 20-তে রাখো — কর্মীদের নেটওয়ার্ক।')),
      msgAuth,
    ]))),
    send('switch', 'laptop', 'EAP success', t('The port opens', 'port খুলে গেল'), t('The switch relays the success and unlocks the port. Only now can the laptop ask for an address with DHCP.', 'switch সাফল্যের খবর পৌঁছে দিয়ে port খুলে দেয়। শুধু এবারই ল্যাপটপ DHCP দিয়ে address চাইতে পারে।'), eapol('EAP success', false, [3, 9, ...u16(4)], [
      f('EAP code + ID', 'success, 9', [3, 9], t('Code 3 = success.', 'Code 3 = সফল।')),
      f('EAP length', '4 bytes', u16(4), t('A success message has no data.', 'success message-এ কোনো data নেই।')),
    ])),
  ],
}

// ═══ WireGuard ══════════════════════════════════════════════════════════
const le32 = (n: number) => [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff]
const mac1 = (seed: number) => f('MAC1', '16 bytes', noise(16, seed), standIn(t('A checksum keyed with the receiver’s public key. A packet without a valid one gets no reply at all — to a port scanner, a WireGuard server looks like nothing is there.', 'গ্রহণকারীর public key দিয়ে বানানো একটা checksum। বৈধ MAC1 ছাড়া packet-এর কোনো উত্তরই আসে না — port scanner-এর কাছে WireGuard server-কে মনে হয় সেখানে কিছুই নেই।')))
const mac2 = f('MAC2', 'zero', new Array<number>(16).fill(0), t('Used only when the server is under load. Zero normally.', 'শুধু server চাপে থাকলে ব্যবহৃত। সাধারণত শূন্য।'))
const wgType = (n: number, name: string) => f('Message type', `${n} (${name})`, [n, 0, 0, 0], t('1 = handshake initiation, 2 = handshake response, 4 = data. Three reserved zero bytes follow.', '1 = handshake initiation, 2 = handshake response, 4 = data। এরপর তিনটে সংরক্ষিত শূন্য byte।'))
const VPN_OUT: Endpoint = { ip: VPN.ip, mac: VPN.mac }
const wgOut = conversation(VPN_OUT, SERVER, 443, 40443)

const wireguard: Lesson = {
  id: 'wireguard',
  name: 'WireGuard',
  category: 'security',
  tagline: t('A modern, minimal VPN', 'আধুনিক, ছিমছাম VPN'),
  intro: t('A VPN wraps your packets in encryption and sends them to a server you trust, which forwards them on. WireGuard does this with very little: one UDP port, a one-round-trip handshake and fixed, modern cryptography.', 'VPN আপনার packet-গুলো encryption-এ মুড়ে আপনার বিশ্বাস করা একটা server-এ পাঠায়, যে সেগুলো এগিয়ে দেয়। WireGuard এটা খুব অল্পে করে: একটা UDP port, এক round trip-এর handshake আর নির্দিষ্ট, আধুনিক cryptography।'),
  topo: homeTopo({ vpn: far(t('VPN server', 'VPN server'), VPN.ip, 'lock', 'up'), server: WEB }),
  steps: [
    at('laptop', t('Keys were exchanged beforehand', 'key আগেই আদানপ্রদান করা'), t('Like SSH keys, each side’s public key was put in the other’s configuration in advance. There are no certificates and nothing to negotiate.', 'SSH key-র মতো, প্রতিটা পক্ষের public key আগে থেকেই অন্যের configuration-এ বসানো। certificate নেই, দরকষাকষিরও কিছু নেই।')),
    send('laptop', 'vpn', 'Handshake initiation', t('Handshake initiation', 'Handshake initiation'), t('A single 148-byte UDP datagram. The laptop’s identity is inside, already encrypted.', 'একটাই 148-byte UDP datagram। ল্যাপটপের পরিচয় ভেতরে, এর মধ্যেই encrypt করা।'), udpPacket(LAPTOP, VPN, 51820, 51820, app('WireGuard handshake initiation', [
      wgType(1, 'handshake initiation'),
      f('Sender index', '0x0000a1b2', le32(0xa1b2), t('The laptop’s number for this session. WireGuard fields are little-endian.', 'এই session-এর জন্য ল্যাপটপের নম্বর। WireGuard field little-endian।')),
      f('Ephemeral public key', '32 bytes', noise(32, 181), standIn(t('A one-time key made for this handshake.', 'এই handshake-এর জন্য বানানো একবারের key।'))),
      f('Encrypted static key', '48 bytes', noise(48, 182), standIn(t('The laptop’s permanent public key, encrypted so that only the server can see who is connecting.', 'ল্যাপটপের স্থায়ী public key, encrypt করা যাতে শুধু server দেখতে পায় কে connect করছে।'))),
      f('Encrypted timestamp', '28 bytes', noise(28, 183), standIn(t('The current time, encrypted. The server rejects anything older than the last one it saw, so a recorded handshake cannot be replayed.', 'বর্তমান সময়, encrypt করা। server শেষ দেখা সময়ের চেয়ে পুরনো কিছু নেয় না, তাই record করা handshake আবার চালানো যায় না।'))),
      mac1(184), mac2,
    ]))),
    send('vpn', 'laptop', 'Handshake response', t('Handshake response', 'Handshake response'), t('92 bytes back, and both sides now hold fresh session keys. One round trip, total.', '92 byte ফেরত, আর দুপক্ষের হাতেই এখন টাটকা session key। সব মিলিয়ে এক round trip।'), udpPacket(VPN, LAPTOP, 51820, 51820, app('WireGuard handshake response', [
      wgType(2, 'handshake response'),
      f('Sender index', '0x0000c3d4', le32(0xc3d4), t('The server’s number for this session.', 'এই session-এর জন্য server-এর নম্বর।')),
      f('Receiver index', '0x0000a1b2', le32(0xa1b2), t('The laptop’s number, echoed.', 'ল্যাপটপের নম্বর, ফেরত।')),
      f('Ephemeral public key', '32 bytes', noise(32, 185), standIn(t('The server’s one-time key.', 'server-এর একবারের key।'))),
      f('Encrypted empty', '16 bytes', noise(16, 186), standIn(t('An encrypted nothing: just an authentication tag, proving the server derived the same keys.', 'encrypt করা শূন্য: শুধু একটা authentication tag, যা প্রমাণ করে server একই key বের করেছে।'))),
      mac1(187), mac2,
    ]))),
    send('laptop', 'vpn', 'Encrypted packet', t('Your traffic, wrapped', 'আপনার traffic, মোড়া'), t('Every packet the laptop sends — whatever its real destination — is encrypted whole and placed inside a UDP datagram addressed to the VPN server.', 'ল্যাপটপ যে packet-ই পাঠায় — আসল গন্তব্য যা-ই হোক — পুরোটা encrypt করে VPN server-এর উদ্দেশে একটা UDP datagram-এর ভেতরে রাখা হয়।'), udpPacket(LAPTOP, VPN, 51820, 51820, app('WireGuard data', [
      wgType(4, 'data'),
      f('Receiver index', '0x0000c3d4', le32(0xc3d4), t('Tells the server which session’s keys to use.', 'server-কে বলে কোন session-এর key ব্যবহার করতে হবে।')),
      f('Counter', '0', [...le32(0), ...le32(0)], t('Goes up with every packet. Used as the encryption nonce and to reject replays.', 'প্রতি packet-এ বাড়ে। encryption nonce হিসেবে আর replay বাতিল করতে ব্যবহৃত।')),
      f('Encrypted packet', 'an entire IP packet', noise(96, 188), t('The original packet — IP header and all — encrypted, plus a 16-byte tag. Shortened here.', 'আসল packet — IP header-সহ সবটা — encrypt করা, সঙ্গে 16-byte tag। এখানে ছোট করা।')),
    ]))),
    at('vpn', t('Unwrapped and sent on', 'খুলে এগিয়ে দেওয়া'), t('The server decrypts the packet, finds the inner one addressed to example.com, and forwards it with its own address as the source.', 'server packet decrypt করে, ভেতরে example.com-এর উদ্দেশে থাকা packet-টা পায়, আর নিজের address-কে source করে সেটা এগিয়ে দেয়।')),
    send('vpn', 'server', 'From the VPN’s address', t('The website sees the VPN', 'website দেখে VPN-কে'), t('To the web server, the visitor is 203.0.113.200. Your home address never appears.', 'web server-এর কাছে দর্শক হল 203.0.113.200। আপনার বাড়ির address কোথাও আসে না।'), wgOut.send(tlsHello(true))),
    at('laptop', t('What the local network saw', 'লোকাল নেটওয়ার্ক কী দেখল'), t('Only UDP datagrams to one address. Not the sites, not even which protocol is inside. The trust has moved: the VPN operator now sees what your ISP used to.', 'শুধু একটা address-এ UDP datagram। site নয়, ভেতরে কোন protocol তাও নয়। বিশ্বাসটা সরে গেছে: আপনার ISP আগে যা দেখত, এখন তা VPN পরিচালক দেখে।')),
  ],
}

// ═══ IPsec ══════════════════════════════════════════════════════════════
const GWA: Endpoint = { ip: '203.0.113.7', mac: '02:00:00:00:04:01' }
const GWB: Endpoint = { ip: '198.51.100.200', mac: '02:00:00:00:04:02' }
const BRANCH: Endpoint = { ip: '10.2.0.5', mac: '02:00:00:00:04:05' }
const INNER_SRC: Endpoint = { ip: ADDR.laptopIp, mac: '02:00:00:00:04:03' }
const SPI_I = noise(8, 191)
const SPI_R = noise(8, 192)

function ike(name: string, exchange: number, exchangeName: string, response: boolean, messageId: number, firstPayload: number, body: Field[]): Layer {
  return app(name, [
    f('Initiator SPI', '8 bytes', SPI_I, t('A random ID chosen by the side that started. Together the two SPIs name this negotiation.', 'যে পক্ষ শুরু করেছে তার বেছে নেওয়া random ID। দুটো SPI মিলে এই দরকষাকষিকে চিহ্নিত করে।')),
    f('Responder SPI', messageId === 0 && !response ? '0 (not chosen yet)' : '8 bytes', messageId === 0 && !response ? new Array<number>(8).fill(0) : SPI_R, t('The other side’s ID. Zero in the very first message.', 'অন্য পক্ষের ID। একদম প্রথম message-এ শূন্য।')),
    f('Next payload', String(firstPayload), [firstPayload], t('The type of the first payload: 33 = security association, 46 = encrypted.', 'প্রথম payload-এর ধরন: 33 = security association, 46 = encrypted।')),
    f('Version', '2.0', [0x20], t('IKE version 2.', 'IKE version 2।')),
    f('Exchange type', `${exchange} (${exchangeName})`, [exchange], t('34 = IKE_SA_INIT, 35 = IKE_AUTH.', '34 = IKE_SA_INIT, 35 = IKE_AUTH।')),
    f('Flags', response ? 'response' : 'initiator', [response ? 0x20 : 0x08], t('Who sent this and whether it is a reply.', 'এটা কে পাঠিয়েছে আর এটা উত্তর কিনা।')),
    f('Message ID', String(messageId), u32(messageId), t('Numbers each request–response pair.', 'প্রতিটা request–response জোড়াকে নম্বর দেয়।')),
    f('Length', `${28 + size(body)} bytes`, u32(28 + size(body)), t('Size of the whole message.', 'পুরো message-এর মাপ।')),
    ...body,
  ])
}
const initBody = (seed: number): Field[] => [
  f('Proposals, key exchange, nonce', 'AES-GCM, group 19, …', noise(88, seed), t('Three payloads: the algorithms on offer, a Diffie-Hellman public value and a random nonce. Shortened here to stand-in bytes.', 'তিনটে payload: প্রস্তাবিত algorithm, একটা Diffie-Hellman public মান আর একটা random nonce। এখানে ছোট করে বদলি byte দেওয়া।')),
]
const innerPing = ipPacket(LAPTOP, BRANCH, 1, [echoReq()])

const ipsec: Lesson = {
  id: 'ipsec',
  name: 'IPsec',
  category: 'security',
  tagline: t('Joining two offices over the internet', 'internet দিয়ে দুটো অফিস জোড়া'),
  intro: t('IPsec encrypts at the IP layer itself, so everything above it is protected without any program knowing. Its classic use is a site-to-site tunnel: two office networks linked as if by a private cable.', 'IPsec IP layer-এই encrypt করে, তাই ওপরের সবকিছু সুরক্ষিত হয়, কোনো program না জেনেই। এর চিরাচরিত ব্যবহার site-to-site সুড়ঙ্গ: দুটো অফিসের নেটওয়ার্ক যেন একটা নিজস্ব তার দিয়ে জোড়া।'),
  topo: {
    nodes: {
      laptop: laptopNode(0, 3),
      gwa: { kind: 'router', label: t('Office A gateway', 'অফিস A-র gateway'), sub: GWA.ip, at: [2.2, 3], badge: 'lock' },
      internet: { kind: 'cloud', label: t('Internet', 'Internet'), at: [4.6, 3] },
      gwb: { kind: 'router', label: t('Office B gateway', 'অফিস B-র gateway'), sub: GWB.ip, at: [7, 3], badge: 'lock' },
      server: { kind: 'server', label: t('File server', 'File server'), sub: BRANCH.ip, at: [9.2, 3], badge: 'files' },
    },
    links: [['laptop', 'gwa'], ['gwa', 'internet'], ['internet', 'gwb'], ['gwb', 'server']],
  },
  steps: [
    send('gwa', 'gwb', 'IKE_SA_INIT', t('IKE — agreeing how to protect things', 'IKE — সুরক্ষার উপায় ঠিক করা'), t('Before any data, the two gateways negotiate over UDP port 500: which algorithms, plus a key exchange.', 'data-র আগে দুটো gateway UDP port 500-এ দরকষাকষি করে: কোন algorithm, সঙ্গে একটা key exchange।'), udpPacket(GWA, GWB, 500, 500, ike('IKE_SA_INIT request', 34, 'IKE_SA_INIT', false, 0, 33, initBody(193)))),
    send('gwb', 'gwa', 'IKE_SA_INIT', t('The reply', 'উত্তর'), t('Office B picks one proposal and sends its own key-exchange value. Both sides can now encrypt the rest of the negotiation.', 'অফিস B একটা প্রস্তাব বেছে নিজের key-exchange মান পাঠায়। দুপক্ষই এখন বাকি দরকষাকষি encrypt করতে পারে।'), udpPacket(GWB, GWA, 500, 500, ike('IKE_SA_INIT response', 34, 'IKE_SA_INIT', true, 0, 33, initBody(194)))),
    send('gwa', 'gwb', 'IKE_AUTH (encrypted)', t('IKE_AUTH — proving identity', 'IKE_AUTH — পরিচয়ের প্রমাণ'), t('Inside encryption, each gateway proves who it is — with a certificate or a pre-shared key — and they agree which traffic the tunnel will carry.', 'encryption-এর ভেতরে প্রতিটা gateway প্রমাণ দেয় সে কে — certificate বা pre-shared key দিয়ে — আর ঠিক করে সুড়ঙ্গ কোন traffic বহন করবে।'), udpPacket(GWA, GWB, 500, 500, ike('IKE_AUTH request', 35, 'IKE_AUTH', false, 1, 46, [
      f('Encrypted payload', 'identity, proof, tunnel settings', noise(96, 195), t('Encrypted. Inside: the gateway’s identity, its proof, and the traffic selectors 192.168.1.0/24 ↔ 10.2.0.0/24. Shortened here.', 'Encrypt করা। ভেতরে: gateway-র পরিচয়, তার প্রমাণ, আর traffic selector 192.168.1.0/24 ↔ 10.2.0.0/24। এখানে ছোট করা।')),
    ]))),
    at('gwa', t('The tunnel is up', 'সুড়ঙ্গ চালু'), t('Each gateway now holds two security associations, one per direction, each with its own keys and an ID number called the SPI.', 'প্রতিটা gateway-র কাছে এখন দুটো security association, প্রতি দিকে একটা, প্রতিটার নিজের key আর SPI নামের একটা ID নম্বর।')),
    send('laptop', 'gwa', 'Ping 10.2.0.5', t('An ordinary packet', 'একটা সাধারণ packet'), t('A laptop in office A pings the file server in office B by its private address. The laptop knows nothing about IPsec.', 'অফিস A-র একটা ল্যাপটপ অফিস B-র file server-কে তার private address-এ ping করে। ল্যাপটপ IPsec সম্পর্কে কিছুই জানে না।'), innerPing),
    send('gwa', 'gwb', 'ESP', t('Wrapped in ESP', 'ESP-তে মোড়া'), t('The gateway encrypts the entire packet — private addresses included — and puts it in a new IP packet from gateway to gateway. Protocol number 50, no ports. On the internet, only the two gateways’ addresses are visible.', 'gateway পুরো packet-টা — private address-সহ — encrypt করে gateway থেকে gateway-র একটা নতুন IP packet-এ রাখে। Protocol number 50, কোনো port নেই। internet-এ শুধু দুটো gateway-র address দেখা যায়।'), ipPacket(GWA, GWB, 50, [layer('transport', 'ESP', [
      f('SPI', '0xc0ffee01', u32(0xc0ffee01), t('Tells the receiver which security association — which keys — to use.', 'গ্রহণকারীকে বলে কোন security association — কোন key — ব্যবহার করতে হবে।')),
      f('Sequence number', '1', u32(1), t('Goes up by one per packet. Duplicates are discarded, which defeats replay attacks.', 'প্রতি packet-এ এক বাড়ে। নকল ফেলে দেওয়া হয়, এতে replay attack ব্যর্থ হয়।')),
      f('Encrypted payload', 'the whole inner packet', noise(64, 196), t('The original IP packet plus padding, encrypted. Stand-in bytes here.', 'আসল IP packet আর padding, encrypt করা। এখানে বদলি byte।')),
      f('Integrity check value', '16 bytes', noise(16, 197), standIn(t('Detects any tampering.', 'যেকোনো কারচুপি ধরে।'))),
    ])])),
    send('gwb', 'server', 'Ping, unwrapped', t('Delivered as if on one network', 'যেন একই নেটওয়ার্কে পৌঁছনো'), t('Office B’s gateway checks, decrypts and forwards the original packet. The file server sees a ping from 192.168.1.10 and replies the same way back.', 'অফিস B-র gateway যাচাই করে, decrypt করে আসল packet এগিয়ে দেয়। file server 192.168.1.10 থেকে একটা ping দেখে আর একই পথে উত্তর পাঠায়।'), ipPacket(INNER_SRC, BRANCH, 1, [echoReq()], { ttl: 62 })),
  ],
}

export const SECURITY_LESSONS: Lesson[] = [tls, sshLesson, dnssec, wpa3, radiusLesson, wireguard, ipsec]

