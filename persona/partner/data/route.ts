import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const partnerId = request.nextUrl.searchParams.get('partnerId')
    if (!partnerId) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/persona/partner/data?partnerId=${encodeURIComponent(partnerId)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    return NextResponse.json(data)
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to fetch partner data', details },
      { status }
    )
  }
}
