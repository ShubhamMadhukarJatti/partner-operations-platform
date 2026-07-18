import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const typeCombination = searchParams.get('typeCombination')

    if (!typeCombination) {
      return NextResponse.json(
        { error: 'typeCombination parameter is required' },
        { status: 400 }
      )
    }

    const path = `/api/partner-mapping/comparison?typeCombination=${encodeURIComponent(typeCombination)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
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
            : 'Failed to fetch partner mapping comparison'
      },
      { status }
    )
  }
}
