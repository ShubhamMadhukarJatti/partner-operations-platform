import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const data = await fetcher('/organizationCollaboration/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })

    return NextResponse.json(
      { message: 'Data fetched successfully', data },
      { status: 200 }
    )
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      { message: details?.message || 'Internal server error', ...details },
      { status }
    )
  }
}
