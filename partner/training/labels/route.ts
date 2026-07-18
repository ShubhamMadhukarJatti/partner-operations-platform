import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const data = await fetcher<unknown>('/api/partner/training/labels', {
      method: 'GET',
      headers: { accept: 'application/hal+json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      { message: details?.message || 'Failed to fetch labels.', details },
      { status }
    )
  }
}
