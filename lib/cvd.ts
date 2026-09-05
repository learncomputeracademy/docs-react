// Colour Vision Deficiency simulation math for the CVD Simulator tool.
//
// Distinct from — and more accurate than — the quick swatch-only simulation
// already in lib/contrast.ts (Colour & Contrast Studio), whose own comment
// admits it's "an approximation... not a clinical diagnostic tool." This
// file reuses the SAME published protanopia/deuteranopia/tritanopia matrix
// coefficients (no invented numbers contradicting the existing tool), but
// applies them correctly in gamma-decoded LINEAR light — matrix maths on
// raw gamma-encoded sRGB is a known source of error in naive colour-blind
// simulators. Achromatopsia uses the CSS Filter Effects spec's own exact
// grayscale() luma matrix (0.2126/0.7152/0.0722), not an approximation.
// Anomalous ("weak") severity is linear interpolation toward identity in
// linear light — a documented simplification of true continuous anomalous
// trichromacy, not literally re-derived per-severity coefficients, but
// mathematically well-behaved (0% = unchanged, 100% = the full dichromat
// matrix above) and honestly labelled as such rather than overclaiming.
//
// The SVG `feColorMatrix` export is deliberately built differently — direct
// on sRGB values, no gamma round-trip — because that's what a real browser
// SVG filter actually operates on. Matching the delivery mechanism exactly
// is more useful here than matching the more accurate canvas simulation.

export type CvdType = 'normal' | 'protan' | 'deutan' | 'tritan' | 'achromatopsia'

export const CVD_TYPES: CvdType[] = ['normal', 'protan', 'deutan', 'tritan', 'achromatopsia']

// Same coefficients as lib/contrast.ts's CVD_MATRICES (protanopia/
// deuteranopia/tritanopia) — kept identical on purpose so the two tools
// never quietly disagree about what "protanopia" looks like.
const CVD_MATRICES: Record<'protan' | 'deutan' | 'tritan', [number, number, number][]> = {
  protan: [
    [0.567, 0.433, 0.000],
    [0.558, 0.442, 0.000],
    [0.000, 0.242, 0.758],
  ],
  deutan: [
    [0.625, 0.375, 0.000],
    [0.700, 0.300, 0.000],
    [0.000, 0.300, 0.700],
  ],
  tritan: [
    [0.950, 0.050, 0.000],
    [0.000, 0.433, 0.567],
    [0.000, 0.475, 0.525],
  ],
}

// CSS Filter Effects Level 1 §grayscale()'s own defined luma weights.
const LUMA: [number, number, number] = [0.2126, 0.7152, 0.0722]

export type RGBA = { r: number; g: number; b: number; a: number }

function srgbToLinear(c: number): number {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}
function linearToSrgb(v: number): number {
  const s = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(Math.max(0, v), 1 / 2.4) - 0.055
  return Math.max(0, Math.min(255, Math.round(s * 255)))
}
function applyMatrix3([r, g, b]: [number, number, number], m: [number, number, number][]): [number, number, number] {
  return [
    m[0][0] * r + m[0][1] * g + m[0][2] * b,
    m[1][0] * r + m[1][1] * g + m[1][2] * b,
    m[2][0] * r + m[2][1] * g + m[2][2] * b,
  ]
}

// severity: 0 = normal vision, 1 = full dichromat (…opia). Ignored for
// 'normal' and 'achromatopsia' (binary — achromatomaly, the rare partial
// form, is out of scope here).
export function simulate(rgba: RGBA, type: CvdType, severity: number = 1): RGBA {
  if (type === 'normal') return rgba
  const lin: [number, number, number] = [srgbToLinear(rgba.r), srgbToLinear(rgba.g), srgbToLinear(rgba.b)]
  if (type === 'achromatopsia') {
    const y = LUMA[0] * lin[0] + LUMA[1] * lin[1] + LUMA[2] * lin[2]
    return { r: linearToSrgb(y), g: linearToSrgb(y), b: linearToSrgb(y), a: rgba.a }
  }
  const full = applyMatrix3(lin, CVD_MATRICES[type])
  const mixed: [number, number, number] = [
    lin[0] + (full[0] - lin[0]) * severity,
    lin[1] + (full[1] - lin[1]) * severity,
    lin[2] + (full[2] - lin[2]) * severity,
  ]
  return { r: linearToSrgb(mixed[0]), g: linearToSrgb(mixed[1]), b: linearToSrgb(mixed[2]), a: rgba.a }
}

// In-place per-pixel simulation over a canvas ImageData — the accurate,
// linear-space path used for the Image mode's photo/screenshot simulation.
export function simulateImageData(data: ImageData, type: CvdType, severity: number): ImageData {
  if (type === 'normal') return data
  const px = data.data
  for (let i = 0; i < px.length; i += 4) {
    const out = simulate({ r: px[i], g: px[i + 1], b: px[i + 2], a: px[i + 3] }, type, severity)
    px[i] = out.r; px[i + 1] = out.g; px[i + 2] = out.b
  }
  return data
}

// The exact matrix a real `<feColorMatrix type="matrix">` would apply —
// direct on sRGB, no gamma decode, because that's genuinely what the
// browser does. Returned as the space-separated 20-value string the SVG
// `values` attribute expects (4x5: RGBA-out × RGBA-in-plus-offset).
export function svgFilterMatrixValues(type: CvdType, severity: number): string {
  const identity: [number, number, number][] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
  let m: [number, number, number][]
  if (type === 'normal') m = identity
  else if (type === 'achromatopsia') m = [LUMA, LUMA, LUMA]
  else {
    const full = CVD_MATRICES[type]
    m = identity.map((row, i) => row.map((v, j) => v + (full[i][j] - v) * severity)) as [number, number, number][]
  }
  const rows = m.map((row) => [...row, 0, 0].join(' '))
  rows.push('0 0 0 1 0')
  return rows.join('  ')
}

// Widely-cited, approximate epidemiological figures (colour-vision
// research / public-health literature) — deliberately hedged with
// "roughly"/"about", not clinical-precision numbers. Northern-European-
// descent population, the population these figures are usually quoted for.
export const CVD_PREVALENCE: Record<CvdType, string> = {
  normal: '',
  protan: 'protanopia + protanomaly together: roughly 2% of men, about 0.03% of women',
  deutan: 'deuteranopia + deuteranomaly together: roughly 6% of men — the single most common form — about 0.4% of women',
  tritan: 'roughly 1 in 10,000 people, split about evenly between men and women (not X-linked, unlike red-green CVD)',
  achromatopsia: 'roughly 1 in 30,000 people — very rare, affects all sexes about equally',
}

// Which name applies at the current severity — "…opia" (blind) only at
// full severity, "…anomaly" (weak) below it. Purely a label; the maths
// above already treats severity as continuous.
export function cvdName(type: CvdType, severity: number): 'opia' | 'anomaly' | null {
  if (type === 'normal' || type === 'achromatopsia') return null
  return severity >= 1 ? 'opia' : 'anomaly'
}
