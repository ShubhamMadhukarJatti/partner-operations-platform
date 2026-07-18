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
      `/api/catalogues/partner/tiers/${params.id}/status`,
      {
        method: 'PUT',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
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
        message: details?.message || 'Failed to update partner tier status',
        details: error?.message,
        ...details
      },
      { status }
    )
  }
}
