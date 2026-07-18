import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const data = await fetcher('/api/email/outreach/message/sends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // console.log("sends data: ",data)

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      { error: details?.message || 'Failed to fetch sent emails', ...details },
      { status }
    )
  }
}
