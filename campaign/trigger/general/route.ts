import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const payload = body?.data ?? body

    await fetcher('/campaign/trigger/general', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: payload
    })

    return NextResponse.json({ proposal_sent: true }, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message:
          details?.message || error?.response?.statusText || 'Request failed',
        ...details
      },
      { status }
    )
  }
}
