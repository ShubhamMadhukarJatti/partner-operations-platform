import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/partner-portal/pipedrive/data?userId=&fields=
 * Partner portal: Pipedrive data by userId. Proxies via fetcher.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const fields = request.nextUrl.searchParams.get('fields')
    const page = request.nextUrl.searchParams.get('page') || '0'
    const size = request.nextUrl.searchParams.get('size') || '20'
    if (!userId || !fields) {
      return NextResponse.json(
        { success: false, error: 'userId and fields are required' },
        { status: 400 }
      )
    }

    const path = `/integration/pipedrive/data?userId=${encodeURIComponent(userId)}&fields=${encodeURIComponent(fields)}&page=${page}&size=${size}`
    const data = await fetcher<{ data?: unknown; results?: unknown }>(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    const results = data?.data ?? data?.results ?? data
    return NextResponse.json({
      success: true,
      data: Array.isArray(results) ? results : results
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
