import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const recordType =
      req.nextUrl.searchParams.get('recordType') || 'CUSTOMER'
    const data = await fetcher<unknown>(
      `/api/Overlap/Field/entity/table/overlap/table?recordType=${encodeURIComponent(recordType)}`,
      {
        method: 'GET',
        headers: { Accept: 'application/hal+json' }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch overlap table'
    return NextResponse.json({ message }, { status: 500 })
  }
}
