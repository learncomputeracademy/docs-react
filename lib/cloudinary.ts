const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export function cldUrl(publicId: string, transform = 'f_auto,q_auto') {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transform}/${publicId}`
}

export function cldVideoUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD}/video/upload/${publicId}.mp4`
}

// next/image loader — Cloudinary already does format/quality negotiation via
// f_auto,q_auto; this just adds the width Next asks for on top, capped to the
// lesson column so a 1600px master never ships to a 700px slot.
// Wired via next.config.ts images.loaderFile (not a per-<Image> prop) — a
// plain function can't cross the Server->Client Component boundary as a prop.
function cloudinaryLoader({ src, width }: { src: string; width: number }) {
  return cldUrl(src, `f_auto,q_auto,c_limit,w_${width}`)
}
export default cloudinaryLoader
