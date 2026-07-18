import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/organization/certifications/by-org/verified/{orgId}
 * Proxies verified organization certifications for public explore-beta display.
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
      `/api/v1/org-certifications/by-org/verified/${encodeURIComponent(params.orgId)}`,
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
      { message: 'Failed to fetch verified certifications', details },
      { status }
    )
  }
}
