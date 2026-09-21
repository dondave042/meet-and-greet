import { put } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const chunks: Buffer[] = []
    for await (const chunk of request) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }

    const file = Buffer.concat(chunks)
    const filename = String(request.headers['x-file-name'] || 'upload')
    const contentType = String(request.headers['content-type'] || 'application/octet-stream')
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-180)
    const blob = await put(`admin-media/${Date.now()}-${safeName}`, file, {
      access: 'public',
      contentType,
      addRandomSuffix: false,
    })

    return response.status(200).json({ url: blob.url, pathname: blob.pathname, contentType })
  } catch (error) {
    console.error('[v0] Blob upload failed:', error)
    return response.status(500).json({ error: 'Media upload failed' })
  }
}
