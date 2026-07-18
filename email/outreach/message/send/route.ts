import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json()
    const { from, subject, body, partnerId } = requestBody

    if (!from || !subject || !body || !partnerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const data = await fetcher('/api/email/outreach/message/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { from, subject, body, partnerId }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      { error: details?.message || 'Failed to send email', ...details },
      { status }
    )
  }
}
