import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

const normalizeSalesforceFieldsResponse = (response: any) => {
  const fields = Array.isArray(response?.fields)
    ? response.fields
    : Array.isArray(response)
      ? response
      : Array.isArray(response?.data?.fields)
        ? response.data.fields
        : Array.isArray(response?.data)
          ? response.data
          : []

  return { ...response, fields }
}

/**
 * GET /api/partner-portal/salesforce/accounts/describe?userId=
 * Partner portal: Salesforce Account describe (fields) by userId. Proxies via fetcher.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const path = `/integration/salesforce/accounts/describe?userId=${encodeURIComponent(userId)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return NextResponse.json(normalizeSalesforceFieldsResponse(data))
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    return NextResponse.json(
      e?.response?.data ?? { message: 'Internal server error' },
      { status }
    )
  }
}
