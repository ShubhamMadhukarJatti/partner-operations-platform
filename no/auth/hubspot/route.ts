import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const fields = request.nextUrl.searchParams.get('fields')
    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      )
    }
    if (!fields) {
      return NextResponse.json(
        {
          message:
            'fields is required (from /api/no/auth/hubspot/fields/{userId})'
        },
        { status: 400 }
      )
    }

    const query = new URLSearchParams({ userId, fields })
    const data = await fetcher<unknown>(
      `/api/no/auth/hubspot?${query.toString()}`,
      {
        method: 'GET',
        headers: { accept: 'application/json' }
      }
    )
    return NextResponse.json(data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const msg = e?.response?.data?.message ?? 'Failed to fetch HubSpot data'
    return NextResponse.json(
      typeof msg === 'string' ? { message: msg } : { ...e?.response?.data },
      { status }
    )
  }
}
