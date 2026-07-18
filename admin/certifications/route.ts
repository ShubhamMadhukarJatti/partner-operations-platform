import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/certifications
 * Proxies admin certification options for profile-beta certification selection.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '100'

    const data = await fetcher<unknown>(
      `/api/admin/certifications?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`,
      {
        method: 'GET',
        headers: { accept: 'application/json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch certification options', details },
      { status }
    )
  }
}
