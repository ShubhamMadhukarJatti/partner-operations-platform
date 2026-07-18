import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * PUT /api/partner-organizations/cover-image
 * Proxies cover image update to authenticated backend endpoint.
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const coverImageUrl =
      typeof body?.coverImageUrl === 'string' ? body.coverImageUrl.trim() : ''

    if (!coverImageUrl) {
      return NextResponse.json(
        { message: 'Field "coverImageUrl" is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      '/api/v1/partner-organizations/cover-image',
      {
        method: 'PUT',
        data: { coverImageUrl },
        headers: { accept: 'application/hal+json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to update cover image', details },
      { status }
    )
  }
}
