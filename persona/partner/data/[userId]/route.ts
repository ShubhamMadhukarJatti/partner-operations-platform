import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get('partnerId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!partnerId) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      )
    }

    const path = `/persona/partner/data/${encodeURIComponent(userId)}?partnerId=${encodeURIComponent(partnerId)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { Accept: 'application/hal+json' }
    })
    return NextResponse.json(data)
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    return NextResponse.json(
      {
        error: 'Failed to fetch partner data',
        details:
          error?.response?.data ??
          (error instanceof Error ? error.message : 'Unknown error')
      },
      { status }
    )
  }
}
