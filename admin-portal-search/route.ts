import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const searchQuery = searchParams.get('searchQuery') || ''
    const page = parseInt(searchParams.get('page') || '0', 10)
    const size = parseInt(searchParams.get('size') || '20', 10)

    const query = new URLSearchParams({
      partialName: searchQuery,
      page: String(page),
      size: String(size)
    }).toString()

    const searchResponse = await fetcher(
      `/organization/searchByPartialName/v1?${query}`,
      {
        method: 'GET',
        headers: { accept: 'application/json' }
      }
    )

    return NextResponse.json(
      { message: 'Fetched Data', searchResponse: searchResponse ?? [] },
      { status: 200 }
    )
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to fetch search results',
        ...details
      },
      { status }
    )
  }
}
