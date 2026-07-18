import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/partner-organizations/partner-program/{orgId}
 * Proxies to backend partner organization partner-program endpoint via authenticated fetcher.
 */
export async function GET(
  _request: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    if (!params.orgId) {
      return NextResponse.json(
        { message: 'Route parameter orgId is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/api/v1/partner-organizations/${encodeURIComponent(params.orgId)}/partner-program`,
      {
        method: 'GET',
        headers: { accept: 'application/hal+json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch partner program', details },
      { status }
    )
  }
}
