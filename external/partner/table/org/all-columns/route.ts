import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await fetcher<unknown>(
      '/api/external/partner/table/org/all-columns',
      {
        method: 'GET',
        headers: { Accept: 'application/json' }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to fetch org all columns.'
    return NextResponse.json({ message }, { status: 500 })
  }
}
