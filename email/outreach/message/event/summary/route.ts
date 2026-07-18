import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  // console.log('[DEBUG API ROUTE] POST /api/email/outreach/message/event/summary invoked')
  try {
    const requestBody = await req.json()
    // console.log('[DEBUG API ROUTE] POST /api/email/outreach/message/event/summary params:', requestBody)

    let payload: number[] = []
    if (Array.isArray(requestBody)) {
      payload = requestBody.map(Number)
    } else if (requestBody && typeof requestBody === 'object') {
      const { collaborationId } = requestBody
      if (collaborationId) {
        payload = [Number(collaborationId)]
      }
    }

    if (payload.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: collaborationId or array of IDs' },
        { status: 400 }
      )
    }

    const data = await fetcher('/api/email/outreach/message/event/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })
    // console.log('[DEBUG API ROUTE] POST /api/email/outreach/message/event/summary success:', data)

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    // console.error('[DEBUG API ROUTE ERROR] POST /api/email/outreach/message/event/summary failed:', error)
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        error: details?.message || 'Failed to fetch email event summary',
        ...details
      },
      { status }
    )
  }
}
