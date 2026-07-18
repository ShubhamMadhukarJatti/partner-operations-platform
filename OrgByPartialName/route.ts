import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const partialName = searchParams.get('partialName') || ''

    const res = await fetcher<{ content?: unknown[] }>(
      `/organization/searchByPartialName?partialName=${encodeURIComponent(partialName)}`,
      { method: 'GET' }
    )
    const orgs = res?.content ?? []

    return NextResponse.json(
      { message: 'Fetched Data', data: orgs },
      { status: 200 }
    )
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to fetch organizations',
        ...details
      },
      { status }
    )
  }
}
