import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/organization/partner-program/status?isActive=true|false
 * Proxies partner-program activation toggle to the authenticated backend endpoint.
 */
export async function PATCH(request: NextRequest) {
  try {
    const isActive = request.nextUrl.searchParams.get('isActive')

    if (isActive !== 'true' && isActive !== 'false') {
      return NextResponse.json(
        { message: 'Query parameter isActive must be true or false' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/api/v1/org-partner-program/status?isActive=${isActive}`,
      {
        method: 'PATCH',
        headers: { accept: 'application/hal+json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to toggle partner program', details },
      { status }
    )
  }
}
