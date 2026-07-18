import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/organization/crm-status/[orgId]
 * Proxies to backend to get the CRM connection status.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params

    const data = await fetcher<unknown>(
      `/api/v1/partner-organizations/${orgId}/crm-status`,
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
      { message: 'Failed to fetch CRM status', details },
      { status }
    )
  }
}
