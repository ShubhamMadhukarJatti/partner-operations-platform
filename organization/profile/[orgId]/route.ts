import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/organization/profile/[orgId]
 * Proxies to backend to get the organization profile including certifications, resources, partner program.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params

    const data = await fetcher<unknown>(
      `/api/v1/org-certifications/profile/${orgId}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch organization profile', details },
      { status }
    )
  }
}
