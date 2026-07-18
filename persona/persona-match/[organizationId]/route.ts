import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string } }
) {
  try {
    const { organizationId } = params
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/persona/persona-match/${organizationId}`,
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
      { error: 'Failed to fetch persona match data', details },
      { status }
    )
  }
}
