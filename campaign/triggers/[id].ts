import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ message: 'id is required' }, { status: 400 })
    }

    const campaignTriggers = await fetcher<unknown>(
      `/campaign/triggers/${id}`,
      { method: 'GET' }
    )

    return NextResponse.json(
      {
        message: 'Fetched Booking Data',
        campaignTriggers: campaignTriggers ?? null
      },
      { status: 200 }
    )
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to get campaign trigger',
        ...details
      },
      { status }
    )
  }
}
