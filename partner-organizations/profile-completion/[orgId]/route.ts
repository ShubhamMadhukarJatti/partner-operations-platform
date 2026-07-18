import { NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/partner-organizations/profile-completion/{orgId}
 * Proxies to backend profile completion status for the current organization.
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

    const { token } = await getServerUser()

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const data = await fetcher<unknown>(
      `/api/v1/partner-organizations/${encodeURIComponent(params.orgId)}/profile-completion`,
      {
        method: 'GET',
        headers: { accept: 'application/hal+json' },
        noRedirectOn401: true
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    if ((error as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }

    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch profile completion status', details },
      { status }
    )
  }
}
