import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/partner-organizations/pricing-tiers/{orgId}
 * Proxies to backend org-scoped pricing tiers endpoint via authenticated fetcher.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    if (!params.orgId) {
      return NextResponse.json(
        { message: 'Route parameter orgId is required' },
        { status: 400 }
      )
    }

    const search = request.nextUrl.searchParams.toString()
    const query = search ? `?${search}` : ''

    const data = await fetcher<unknown>(
      `/api/v1/partner-organizations/pricing-tiers/${encodeURIComponent(params.orgId)}${query}`,
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
      { message: 'Failed to fetch pricing tiers', details },
      { status }
    )
  }
}
