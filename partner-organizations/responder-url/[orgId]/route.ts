import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/partner-organizations/responder-url/{orgId}
 * Proxies to backend to fetch the responder URL for a partner program.
 * Returns the URL string in `data`, or null if no program exists.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    if (!params.orgId) {
      return NextResponse.json(
        { message: 'Route parameter orgId is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<{
      success: boolean
      message: string
      data: string | null
    }>(
      `/api/v1/partner-organizations/${encodeURIComponent(params.orgId)}/responder-url`,
      {
        method: 'GET',
        headers: { accept: 'application/hal+json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    // Return a safe null-data response so the client can gracefully fall back
    // to "Send Enquiry" without showing an error.
    if (status === 404) {
      return NextResponse.json(
        { success: true, message: 'No partner program found', data: null },
        { status: 200 }
      )
    }
    return NextResponse.json(
      { message: 'Failed to fetch responder URL', details },
      { status }
    )
  }
}
