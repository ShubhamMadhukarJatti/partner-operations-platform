import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params
    const body = await request.json()
    const type = body?.type

    if (!type) {
      return NextResponse.json(
        { message: 'Missing required parameter: type' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/api/v1/partner-organizations/${orgId}/profile-completion?type=${encodeURIComponent(type)}`,
      {
        method: 'POST'
      }
    )

    return NextResponse.json(data || { success: true }, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to update profile completion status', details },
      { status }
    )
  }
}
