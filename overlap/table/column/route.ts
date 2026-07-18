import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await fetcher<unknown>(
      '/api/Overlap/Field/entity/table/column',
      {
        method: 'POST',
        headers: {
          Accept: 'application/hal+json',
          'Content-Type': 'application/json'
        },
        data: body
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create column'
    return NextResponse.json({ message }, { status: 500 })
  }
}
