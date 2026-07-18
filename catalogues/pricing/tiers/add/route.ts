import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const data = await fetcher('/api/catalogues/pricing/tiers/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/hal+json'
      },
      data: body
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to save pricing tier',
        details: error?.message,
        ...details
      },
      { status }
    )
  }
}
