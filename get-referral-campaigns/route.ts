import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organizationId')

    const data = await fetcher<unknown>(
      `/referral/campaigns?organizationId=${Number(organizationId)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json-patch+json' }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      {
        message: error?.response?.statusText || 'Failed to fetch campaigns',
        details
      },
      { status }
    )
  }
}
