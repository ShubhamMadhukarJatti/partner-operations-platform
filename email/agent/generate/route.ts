import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    const data = await fetcher('/email/agent/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    const message =
      details?.error ?? details?.message ?? 'Failed to generate email drafts.'
    return NextResponse.json({ error: message, ...details }, { status })
  }
}
