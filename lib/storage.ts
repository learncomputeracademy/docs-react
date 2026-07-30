// Storage router — decides Cloudinary vs Cloudflare R2 per file.
// Server-only: both SDKs need secrets that must never reach the client.
//
// Rule (docs/ASSETS.md): anything ≥10 MB goes to R2 (Cloudinary's free-tier
// cap — applies to images and raw files alike). Everything else, Cloudinary,
// where images also get real-time transformation (f_auto, q_auto, resizing).
// R2 is plain object storage — no transformation — so oversized *images*
// should be compressed before upload, not routed here as an escape hatch.
// This module doesn't enforce that; the admin UI (Stage 7) will warn.

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v2 as cloudinary } from 'cloudinary'

export const CLOUDINARY_SIZE_LIMIT = 10 * 1024 * 1024 // 10 MB, free-tier cap

export function slugifyFilename(name: string) {
  const dot = name.lastIndexOf('.')
  const base = dot === -1 ? name : name.slice(0, dot)
  const ext = dot === -1 ? '' : name.slice(dot)
  return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + ext
}

export function pickBackend(sizeBytes: number): 'cloudinary' | 'r2' {
  return sizeBytes >= CLOUDINARY_SIZE_LIMIT ? 'r2' : 'cloudinary'
}

// ── R2 ───────────────────────────────────────────────────────────────────

function r2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
}

export async function uploadToR2(buffer: Buffer, key: string, contentType: string): Promise<string> {
  const client = r2Client()
  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }))
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`
}

// ── Cloudinary ───────────────────────────────────────────────────────────

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  })
  return cloudinary
}

export async function uploadToCloudinary(
  buffer: Buffer,
  publicId: string,
  resourceType: 'image' | 'raw' | 'video'
): Promise<string> {
  const cld = configureCloudinary()
  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      { public_id: publicId, resource_type: resourceType, overwrite: true },
      (err, result) => {
        if (err || !result) return reject(err)
        resolve(result.secure_url)
      }
    )
    stream.end(buffer)
  })
}

// ── Unified entry point ─────────────────────────────────────────────────

export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string,
  kind: 'image' | 'video' | 'raw'
): Promise<{ url: string; backend: 'cloudinary' | 'r2' }> {
  const backend = pickBackend(buffer.byteLength)
  if (backend === 'r2') {
    return { url: await uploadToR2(buffer, key, contentType), backend: 'r2' }
  }
  const url = await uploadToCloudinary(buffer, key.replace(/\.[^.]+$/, ''), kind)
  return { url, backend: 'cloudinary' }
}
