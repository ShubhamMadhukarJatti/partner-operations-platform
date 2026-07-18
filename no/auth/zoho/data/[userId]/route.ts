import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/no/auth/zoho/data/[userId]
 * Proxies to backend via fetcher. Query params forwarded.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      )
    }

    const queryString = request.nextUrl.search || ''
    const data = await fetcher<unknown>(
      `/api/no/auth/zoho/data/${encodeURIComponent(userId)}${queryString}`,
      { method: 'GET', headers: { accept: 'application/json' } }
    )
    return NextResponse.json(data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const msg = e?.response?.data?.message ?? 'Failed to fetch Zoho data'
    return NextResponse.json(
      typeof msg === 'string' ? { message: msg } : { ...e?.response?.data },
      { status }
    )
  }
}
