import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

const normalizeSalesforceRecordsResponse = (response: any) => {
  const records = Array.isArray(response?.records)
    ? response.records
    : Array.isArray(response)
      ? response
      : Array.isArray(response?.data?.records)
        ? response.data.records
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.results)
            ? response.results
            : []

  return { ...response, records }
}

/**
 * GET /api/partner-portal/salesforce/opportunities?userId=&fields=Name,Amount...
 * Partner portal: Salesforce opportunities by userId. Proxies via fetcher.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const queryString =
      request.nextUrl.search || `?userId=${encodeURIComponent(userId)}`
    const path = `/integration/salesforce/opportunities${queryString}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return NextResponse.json(normalizeSalesforceRecordsResponse(data))
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    return NextResponse.json(
      e?.response?.data ?? { message: 'Internal server error' },
      { status }
    )
  }
}
