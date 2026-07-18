import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/partner-portal/hubspot/data?userId=&fields=
 * Partner portal: HubSpot data by userId. Proxies via fetcher.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const fields = request.nextUrl.searchParams.get('fields')
    if (!userId || !fields) {
      return NextResponse.json(
        { message: 'userId and fields are required' },
        { status: 400 }
      )
    }

    const path = `/integration/hubspot?userId=${encodeURIComponent(userId)}&fields=${encodeURIComponent(fields)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    return NextResponse.json(
      e?.response?.data ?? { message: 'Internal server error' },
      { status }
    )
  }
}
