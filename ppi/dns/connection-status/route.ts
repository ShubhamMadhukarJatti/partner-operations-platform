import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const data = await fetcher<unknown>('/ppi/dns/connection-status', {
      method: 'GET',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      {
        error: 'Failed to fetch DNS connection status',
        success: false,
        details
      },
      { status }
    )
  }
}
