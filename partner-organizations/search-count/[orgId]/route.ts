import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/partner-organizations/search-count/{orgId}
 * Proxies to backend to increment the profile visit count for the given org.
 */
export async function POST(
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
      `/api/v1/partner-organizations/${encodeURIComponent(params.orgId)}/search-count`,
      {
        method: 'POST',
        headers: { accept: 'application/hal+json' }
      }
    )

    console.log('Search count updated successfully', data)

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to update search count', details },
      { status }
    )
  }
}
