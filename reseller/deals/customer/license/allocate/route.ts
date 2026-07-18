import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.customerId || !body.dealId || !body.validityInDays) {
      return NextResponse.json(
        { message: 'customerId, dealId, and validityInDays are required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      '/api/reseller/deals/customer/license/allocate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/hal+json'
        },
        data: body
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to allocate license', details },
      { status }
    )
  }
}
