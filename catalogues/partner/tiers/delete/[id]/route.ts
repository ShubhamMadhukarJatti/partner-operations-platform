import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await fetcher(
      `/api/catalogues/partner/tiers/delete/${params.id}`,
      {
        method: 'DELETE',
        headers: {
          accept: 'application/hal+json'
        }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to delete partner tier',
        details: error?.message,
        ...details
      },
      { status }
    )
  }
}
