import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/partner-organizations/recommendations
 * Proxies recommendations lookup to the authenticated backend endpoint.
 */
export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.toString()
    const query = search ? `?${search}` : ''

    const data = await fetcher<unknown>(
      `/api/v1/partner-organizations/recommendations${query}`,
      {
        method: 'GET',
        headers: { accept: 'application/hal+json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch recommendations', details },
      { status }
    )
  }
}
