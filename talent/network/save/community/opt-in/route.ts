import { NextRequest, NextResponse } from 'next/server'

import { publicFetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/talent/network/save/community/opt-in
 * Public endpoint – no auth. Proxies to backend POST /api/talent/network/save/community/opt-in
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const data = await publicFetcher(
      '/api/talent/network/save/community/opt-in',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/hal+json'
        },
        data: body
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    const message =
      details?.message ??
      (error instanceof Error ? error.message : 'Request failed')
    return NextResponse.json({ message, ...details }, { status })
  }
}
