import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await fetcher(
      `/api/catalogues/partner/tiers/details/${params.id}`,
      {
        method: 'GET',
        headers: {}
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to fetch partner tier details',
        details: error?.message,
        ...details
      },
      { status }
    )
  }
}
