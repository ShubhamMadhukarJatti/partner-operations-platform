import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const recordType = searchParams.get('recordType') || 'CUSTOMER'
    const versionId = searchParams.get('versionId')

    if (!versionId) {
      return NextResponse.json(
        { success: false, message: 'versionId is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/persona/overlap/v2/my-records?recordType=${encodeURIComponent(recordType)}&versionId=${encodeURIComponent(versionId)}`,
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
        : 'Failed to fetch versioned overlap records'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
