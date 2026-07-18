import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json(
        { message: 'organizationId is required' },
        { status: 400 }
      )
    }

    const campaignTriggers = await fetcher<unknown[]>(
      `/campaign/triggers?organizationId=${organizationId}`,
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
        message: details?.message || 'Failed to get campaign triggers',
        ...details
      },
      { status }
    )
  }
}
