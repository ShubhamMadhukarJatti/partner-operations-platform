import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/my-deals/internal/external/partner
 * Proxies to backend via fetcher. Body: internal-to-external partner portal deal payload.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const data = await fetcher<unknown>('/my-deals/internal/external/partner', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: body
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to create deal'
    return NextResponse.json({ message }, { status })
  }
}
