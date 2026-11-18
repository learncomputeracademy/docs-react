// Hosts, packet assembly and the scene model for the Network Protocol
// Visualizer. Header builders live in ./packet; lessons in ./lessons/*.
import {
  ADDR, FLAG, ascii, checksum, ethernet, flat, ipBytes, ipv4, size, t, tcp, u8, u16, u32, udp,
  type Field, type L, type Layer, type LayerKind,
} from './packet'

// ── endpoints ───────────────────────────────────────────────────────────
// `lan` = on the home network 192.168.1.0/24. A frame between a LAN host and
// a remote one is shown as it appears on the home link (laptop MAC ↔ router
// MAC); a frame between two remote hosts is shown with their own MACs.
export interface Endpoint { ip: string; mac: string; lan?: boolean }

const remote = (ip: string, n: number): Endpoint => ({ ip, mac: `02:00:00:00:01:${n.toString(16).padStart(2, '0')}` })
const local = (ip: string, mac: string): Endpoint => ({ ip, mac, lan: true })

export const LAPTOP = local(ADDR.laptopIp, ADDR.laptopMac)
export const ROUTER = local(ADDR.routerIp, ADDR.routerMac)
export const PC2 = local('192.168.1.20', '5c:f9:38:0a:0b:02')
export const PHONE = local('192.168.1.30', '8c:85:90:0a:0b:03')
export const NAS = local('192.168.1.40', '00:11:32:0a:0b:04')
export const RADIUS_SRV = local('192.168.1.5', '00:50:56:0a:0b:05')
export const CAMERA = local('192.168.1.60', 'b0:c5:54:0a:0b:06')
export const PLC = local('192.168.1.70', '00:80:f4:0a:0b:07')
export const TV = local('192.168.1.80', '64:16:66:0a:0b:08')
export const DNS = remote(ADDR.dnsIp, 1)
export const SERVER = remote(ADDR.serverIp, 2)
export const MAIL = remote('198.51.100.25', 3)
export const MAIL2 = remote('203.0.113.25', 4)
export const PROXY = remote('198.51.100.80', 5)
export const STUN = remote('198.51.100.3', 6)
export const PEER = remote('203.0.113.50', 7)
export const NTP_SRV = remote('198.51.100.123', 8)
export const VPN = remote('203.0.113.200', 9)
export const MEDIA = remote('198.51.100.60', 10)
export const R1 = remote('198.51.100.1', 11)
export const R2 = remote('203.0.113.1', 12)
export const NOBODY = local(ADDR.noIp, ADDR.laptopMac)
export const EVERYONE = local(ADDR.broadcastIp, ADDR.broadcastMac)

const srcMac = (from: Endpoint, to: Endpoint) => (from.lan || !to.lan ? from.mac : ADDR.routerMac)
const dstMac = (from: Endpoint, to: Endpoint) => (to.lan || !from.lan ? to.mac : ADDR.routerMac)
const ttlFor = (from: Endpoint, to: Endpoint) => (from.lan || !to.lan ? 64 : 57)

let ipId = 0x1c40
const nextId = () => (ipId = (ipId + 0x0111) & 0xffff)

export const layer = (kind: LayerKind, name: string, fields: Field[]): Layer => ({ kind, name, fields })
export const f = (name: string, value: string, bytes: number[], note: L): Field => ({ name, value, bytes, note })
export const app = (name: string, fields: Field[]): Layer => layer('app', name, fields)

type PacketOpts = { dstMac?: string; ttl?: number }

/** Ethernet + IPv4 around any payload layers (ICMP, IGMP, ESP, …). */
export function ipPacket(from: Endpoint, to: Endpoint, proto: number, payload: Layer[], opts: PacketOpts = {}): Layer[] {
  const n = payload.reduce((a, l) => a + size(l.fields), 0)
  return [
    ethernet(srcMac(from, to), opts.dstMac ?? dstMac(from, to)),
    ipv4(from.ip, to.ip, proto, n, nextId(), opts.ttl ?? ttlFor(from, to)),
    ...payload,
  ]
}

export function udpPacket(from: Endpoint, to: Endpoint, sport: number, dport: number, appLayer: Layer, opts: PacketOpts = {}): Layer[] {
  const payload = flat(appLayer.fields)
  return ipPacket(from, to, 17, [udp(from.ip, to.ip, sport, dport, payload), appLayer], opts)
}

export function tcpPacket(from: Endpoint, to: Endpoint, sport: number, dport: number, seq: number, ack: number, flags: number, appLayer?: Layer): Layer[] {
  const payload = appLayer ? flat(appLayer.fields) : []
  return ipPacket(from, to, 6, [tcp(from.ip, to.ip, sport, dport, seq, ack, flags, payload), ...(appLayer ? [appLayer] : [])])
}

/**
 * An already-open TCP connection between a client and a server. Keeps the
 * running sequence numbers so every segment's seq/ack is consistent with the
 * bytes actually sent before it.
 */
export function conversation(client: Endpoint, server: Endpoint, dport: number, sport = 51000) {
  let c = 1001
  let s = 5001
  return {
    /** client → server */
    send(appLayer: Layer): Layer[] {
      const p = tcpPacket(client, server, sport, dport, c, s, FLAG.PSH | FLAG.ACK, appLayer)
      c += size(appLayer.fields)
      return p
    },
    /** server → client */
    reply(appLayer: Layer): Layer[] {
      const p = tcpPacket(server, client, dport, sport, s, c, FLAG.PSH | FLAG.ACK, appLayer)
      s += size(appLayer.fields)
      return p
    },
  }
}

// ── text protocols (HTTP, SMTP, FTP, SIP, …) ────────────────────────────
export const line = (name: string, text: string, note: L): Field => f(name, text, ascii(`${text}\r\n`), note)
export const blankLine = (): Field =>
  f('Blank line', '(end of headers)', ascii('\r\n'), t('An empty line marks the end of the headers. Anything after it is the body.', 'একটা ফাঁকা লাইন header-এর শেষ বোঝায়। এর পরের সবকিছু body।'))

// ── IPv6 ────────────────────────────────────────────────────────────────
export function ip6Bytes(addr: string): number[] {
  const [head, tail = ''] = addr.split('::')
  const h = head ? head.split(':') : []
  const tl = tail ? tail.split(':') : []
  const groups = addr.includes('::') ? [...h, ...new Array<string>(8 - h.length - tl.length).fill('0'), ...tl] : h
  return groups.flatMap((g) => u16(parseInt(g, 16)))
}

export function ipv6(src: string, dst: string, next: number, nextName: string, payloadLen: number, hop = 64): Layer {
  return layer('ip', 'IPv6', [
    f('Version, traffic class, flow label', '6, 0, 0', u32(0x60000000), t('First 4 bits: version 6. Then 8 bits of priority and a 20-bit flow label that lets routers keep one conversation on one path.', 'প্রথম 4 bit: version 6। তারপর 8 bit priority আর 20-bit flow label, যা দিয়ে router একটা কথোপকথনকে একই পথে রাখতে পারে।')),
    f('Payload length', `${payloadLen} bytes`, u16(payloadLen), t('Size of everything after this fixed 40-byte header.', 'এই নির্দিষ্ট 40-byte header-এর পরের সবকিছুর মাপ।')),
    f('Next header', `${next} (${nextName})`, u8(next), t('What follows the IPv6 header — the same job as IPv4’s Protocol field.', 'IPv6 header-এর পরে কী আছে — IPv4-এর Protocol field-এর মতোই কাজ।')),
    f('Hop limit', String(hop), u8(hop), t('IPv6’s name for TTL. Each router subtracts 1; at 0 the packet is dropped.', 'TTL-এর IPv6 নাম। প্রতিটা router 1 কমায়; 0 হলে packet ফেলে দেওয়া হয়।')),
    f('Source address', src, ip6Bytes(src), t('128 bits — 16 bytes — instead of IPv4’s 4. Written as hex groups, with :: standing for a run of zeros.', '128 bit — 16 bytes — IPv4-এর 4-এর বদলে। hex group আকারে লেখা, :: মানে পরপর অনেক শূন্য।')),
    f('Destination address', dst, ip6Bytes(dst), t('Where the packet is going. IPv6 has no header checksum — the layers above and below already check for errors.', 'packet কোথায় যাচ্ছে। IPv6-এ header checksum নেই — ওপরের ও নিচের layer আগেই error দেখে নেয়।')),
  ])
}

export function ethernet6(src: string, dst: string): Layer {
  const e = ethernet(src, dst)
  e.fields[2] = f('EtherType', '0x86dd (IPv6)', u16(0x86dd), t('0x86dd means an IPv6 packet follows.', '0x86dd মানে এরপর একটা IPv6 packet আছে।'))
  return e
}

/** Upper-layer checksum over an IPv6 pseudo-header (ICMPv6). */
export const sum6 = (src: string, dst: string, next: number, body: number[]) =>
  checksum([...ip6Bytes(src), ...ip6Bytes(dst), ...u32(body.length), 0, 0, 0, next, ...body])

export { ipBytes, u8 }

// ── scene model ─────────────────────────────────────────────────────────
export type DeviceKind = 'laptop' | 'phone' | 'router' | 'switch' | 'ap' | 'server' | 'cloud' | 'box'
export type Badge = 'dns' | 'web' | 'mail' | 'proxy' | 'lock' | 'camera' | 'call' | 'key' | 'chip' | 'clock' | 'tv' | 'files' | 'user' | 'video' | 'isp'

export interface NodeDef {
  kind: DeviceKind
  label: L
  sub?: string
  /** Position on the isometric floor grid: [across, down]. */
  at: [number, number]
  badge?: Badge
}

export interface Topology {
  nodes: Record<string, NodeDef>
  links: [string, string, 'wireless'?][]
}

export interface Step {
  from: string
  /** Omitted = something happening inside `from`, no packet on the wire. */
  to?: string
  /** Local-network broadcast — drawn with ripples. */
  broadcast?: boolean
  /** The packet never arrives. */
  lost?: boolean
  label?: string
  title: L
  body: L
  layers?: Layer[]
}

export type CategoryId = 'core' | 'web' | 'files' | 'security'

export interface Lesson {
  id: string
  name: string
  category: CategoryId
  tagline: L
  intro: L
  topo: Topology
  steps: Step[]
}

/** A step where something happens inside one device. */
export const at = (from: string, title: L, body: L): Step => ({ from, title, body })
/** A step where a packet travels. */
export const send = (from: string, to: string, label: string, title: L, body: L, layers?: Layer[], extra: Partial<Step> = {}): Step =>
  ({ from, to, label, title, body, layers, ...extra })

// ── shared topologies ───────────────────────────────────────────────────
const N = {
  laptop: (x: number, y: number): NodeDef => ({ kind: 'laptop', label: t('Laptop', 'ল্যাপটপ'), sub: ADDR.laptopIp, at: [x, y] }),
  router: (x: number, y: number): NodeDef => ({ kind: 'router', label: t('Home router', 'বাড়ির router'), sub: ADDR.routerIp, at: [x, y] }),
  internet: (x: number, y: number): NodeDef => ({ kind: 'cloud', label: t('Internet', 'Internet'), at: [x, y] }),
}

/** laptop — router — internet — one or two far-end servers. */
export function homeTopo(far: Record<string, NodeDef>): Topology {
  const ids = Object.keys(far)
  return {
    nodes: { laptop: N.laptop(0, 3), router: N.router(2, 3), internet: N.internet(4.4, 3), ...far },
    links: [['laptop', 'router', 'wireless'], ['router', 'internet'], ...ids.map((id): [string, string] => ['internet', id])],
  }
}

export const far = (label: L, sub: string, badge: Badge, pos: 'up' | 'right' = 'right', kind: DeviceKind = 'server'): NodeDef =>
  ({ kind, label, sub, badge, at: pos === 'up' ? [4.4, 0.6] : [6.8, 3] })

export const WEB = far(t('Web server', 'Web server'), 'example.com', 'web')
export const RESOLVER = far(t('DNS resolver', 'DNS resolver'), ADDR.dnsIp, 'dns', 'up')

/** Route between two nodes along the topology's links (breadth-first). */
export function route(topo: Topology, from: string, to: string): string[] {
  const prev = new Map<string, string | null>([[from, null]])
  const queue = [from]
  while (queue.length) {
    const cur = queue.shift()!
    if (cur === to) break
    for (const [a, b] of topo.links) {
      const next = a === cur ? b : b === cur ? a : null
      if (next && !prev.has(next)) { prev.set(next, cur); queue.push(next) }
    }
  }
  if (!prev.has(to)) return [from, to]
  const path: string[] = []
  for (let n: string | null = to; n; n = prev.get(n) ?? null) path.unshift(n)
  return path
}

// ── flatten a packet for the hex view ───────────────────────────────────
export interface FlatField { layer: number; field: number; offset: number; length: number }

export function flatten(layers: Layer[]): { bytes: number[]; fields: FlatField[] } {
  const bytes: number[] = []
  const fields: FlatField[] = []
  layers.forEach((l, li) =>
    l.fields.forEach((fd, fi) => {
      fields.push({ layer: li, field: fi, offset: bytes.length, length: fd.bytes.length })
      bytes.push(...fd.bytes)
    })
  )
  return { bytes, fields }
}
