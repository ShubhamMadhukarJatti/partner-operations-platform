import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const data = await fetcher<unknown>('/my-deals/external/partner/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errData = error?.response?.data ?? {}
    const message =
      errData?.message ??
      errData?.error ??
      error?.message ??
      'Failed to submit deal registration'
    return NextResponse.json(
      { message, details: errData?.errors ?? errData },
      { status }
    )
  }
}
