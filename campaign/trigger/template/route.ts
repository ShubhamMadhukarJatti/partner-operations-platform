import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const triggers = await fetcher<unknown>('/campaign/trigger/template', {
      method: 'GET'
    })

    return NextResponse.json(
      { message: 'Fetched Booking Data', campaignTriggers: triggers ?? null },
      { status: 200 }
    )
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to get campaign templates',
        ...details
      },
      { status }
    )
  }
}
