import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const page = req.nextUrl.searchParams.get('page') || '0'
    const size = req.nextUrl.searchParams.get('size') || '20'

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'id (versionId) is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/persona/v1/details/${encodeURIComponent(id)}?page=${page}&size=${size}`,
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
        : 'Failed to fetch persona details by version'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
