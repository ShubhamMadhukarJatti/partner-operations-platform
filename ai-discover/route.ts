import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const input = searchParams.get('input')

    if (!input) {
      return NextResponse.json(
        { message: 'Input parameter is required' },
        { status: 400 }
      )
    }

    const data = await fetcher(
      `/organization/discover/dweep?input=${encodeURIComponent(input)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    const errorMessage =
      details?.message ??
      details?.errorMessage ??
      details?.error ??
      'Failed to fetch recommendations'
    return NextResponse.json({ message: errorMessage, ...details }, { status })
  }
}
