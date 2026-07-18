import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/no/auth/zoho/fields/[userId]
 * Proxies to backend via fetcher.
 */
export async function GET(
  _req: Request,
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

    const data = await fetcher<unknown>(
      `/api/no/auth/zoho/fields/${encodeURIComponent(userId)}`,
      { method: 'GET', headers: { accept: 'application/json' } }
    )
    return NextResponse.json(data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const msg = e?.response?.data?.message ?? 'Failed to fetch Zoho fields'
    return NextResponse.json(
      typeof msg === 'string' ? { message: msg } : { ...e?.response?.data },
      { status }
    )
  }
}
