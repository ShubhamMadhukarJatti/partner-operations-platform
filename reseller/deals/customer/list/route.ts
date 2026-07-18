import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const dealId = searchParams.get('dealId')
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'

    if (!dealId) {
      return NextResponse.json(
        { message: 'dealId parameter is required' },
        { status: 400 }
      )
    }

    const path = `/api/reseller/deals/customer/list?dealId=${encodeURIComponent(dealId)}&page=${page}&size=${size}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/hal+json'
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch customer list', details },
      { status }
    )
  }
}
