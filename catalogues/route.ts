import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.toString()
    const query = search ? `?${search}` : ''

    const data = await fetcher(`/api/catalogues${query}`, {
      method: 'GET',
      headers: {}
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to fetch catalogues',
        details: error?.message,
        ...details
      },
      { status }
    )
  }
}
