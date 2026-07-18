import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const data = await fetcher(
      `/api/catalogues/pricing/tiers/${params.id}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/hal+json'
        },
        data: body
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to update pricing tier status',
        details: error?.message,
        ...details
      },
      { status }
    )
  }
}
