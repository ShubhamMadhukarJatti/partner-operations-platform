import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/partner-portal/hubspot/fields?userId=
 * Partner portal: HubSpot fields by userId. Proxies via fetcher.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      )
    }

    const path = `/integration/hubspot/fields?userId=${encodeURIComponent(userId)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const arr = Array.isArray(data)
      ? data
      : ((data as any)?.data ??
        (data as any)?.fields ??
        (data as any)?.results ??
        data)
    return NextResponse.json(Array.isArray(arr) ? arr : [])
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    return NextResponse.json(
      e?.response?.data ?? { message: 'Internal server error' },
      { status }
    )
  }
}
