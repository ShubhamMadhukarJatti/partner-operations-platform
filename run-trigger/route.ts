import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await fetcher<unknown>('/email/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: '*/*' },
      data: body
    })
    return NextResponse.json({ email_sent: true }, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    return NextResponse.json(
      { email_sent: false, error: error?.message ?? 'Failed to trigger email' },
      { status }
    )
  }
}
