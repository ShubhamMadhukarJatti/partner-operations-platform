import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/no/auth/save/overlap
 * Proxies to backend via fetcher. Body: { userId, organizationId, frequency, personaName, ... }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { message: 'Request body is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/api/no/auth/save/overlap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      data: body
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const msg = e?.response?.data?.message ?? 'Failed to save overlap'
    return NextResponse.json(
      typeof msg === 'string' ? { message: msg } : { ...e?.response?.data },
      { status }
    )
  }
}
