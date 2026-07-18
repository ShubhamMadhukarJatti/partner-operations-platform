import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/partner-organizations/upload
 * Proxies banner upload to backend S3 upload endpoint via authenticated fetcher.
 */
export async function POST(request: Request) {
  try {
    const incoming = await request.formData()
    const file = incoming.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { message: 'Multipart field "file" is required' },
        { status: 400 }
      )
    }

    const formData = new FormData()
    formData.append('file', file)

    const data = await fetcher<unknown>(
      '/api/v1/partner-organizations/upload',
      {
        method: 'POST',
        data: formData,
        headers: { accept: 'application/hal+json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to upload banner image', details },
      { status }
    )
  }
}
