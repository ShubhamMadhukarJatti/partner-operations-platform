import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/partner-portal/pipedrive/fields?userId=
 * Partner portal: Pipedrive fields by userId. Proxies via fetcher.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }

    const path = `/integration/pipedrive/fields?userId=${encodeURIComponent(userId)}`
    const data = await fetcher<{ data?: unknown; fields?: unknown }>(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const fields = data?.data ?? data?.fields ?? data
    return NextResponse.json({
      success: true,
      data: Array.isArray(fields) ? fields : fields
    })
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const error =
      e?.response?.data?.message ??
      e?.response?.data?.error ??
      'Internal server error'
    return NextResponse.json({ success: false, error }, { status })
  }
}
