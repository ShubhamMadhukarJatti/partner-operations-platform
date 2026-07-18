import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status')
    if (!status) {
      return NextResponse.json(
        { message: 'status parameter is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/api/reseller/deals/stage?status=${encodeURIComponent(status)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/hal+json'
        }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch reseller deals', details },
      { status }
    )
  }
}
