import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { orgId } = params
    const recordType = req.nextUrl.searchParams.get('recordType') || 'CUSTOMER'

    if (!orgId) {
      return NextResponse.json(
        { success: false, message: 'orgId is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/persona/overlap-records/${encodeURIComponent(orgId)}/versions?recordType=${encodeURIComponent(recordType)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch overlap record versions'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
