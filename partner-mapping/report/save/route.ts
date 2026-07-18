import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (
      !body.organization_id ||
      !body.partner_id ||
      body.your_matrix === undefined ||
      body.partner_matrix === undefined ||
      body.overlap_count === undefined
    ) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: organization_id, partner_id, your_matrix, partner_matrix, overlap_count'
        },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/api/partner-mapping/report/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errMsg =
      error?.response?.data ?? error?.message ?? 'Internal server error'
    return NextResponse.json(
      {
        error:
          typeof errMsg === 'string'
            ? errMsg
            : 'Failed to save partner mapping report'
      },
      { status }
    )
  }
}
