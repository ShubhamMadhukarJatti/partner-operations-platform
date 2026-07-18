import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const payload = body?.data ?? body

    await fetcher('/campaign/updateTrigger', {
      method: 'PATCH',
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
          details?.message || error?.response?.statusText || 'Update failed',
        ...details
      },
      { status }
    )
  }
}
