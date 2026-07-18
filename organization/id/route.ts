import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/organization/id?id={organizationId}
 * Proxies to backend organization/id via fetcher.
 */
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { message: 'Query parameter id is required' },
        { status: 400 }
      )
    }

    const path = `/organization/id?id=${encodeURIComponent(id)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { accept: 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      {
        message: error?.response?.statusText ?? 'Failed to fetch organization',
        details
      },
      { status }
    )
  }
}
