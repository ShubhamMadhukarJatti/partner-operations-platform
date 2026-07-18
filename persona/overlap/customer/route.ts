import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const data = await fetcher<unknown>('/persona/overlap/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    console.error('[/api/persona/overlap/customer] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: details?.message || 'Failed to save customer data',
        details
      },
      { status }
    )
  }
}
