import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

type ZohoRecordType = 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

const getZohoDataEndpoint = (recordType: ZohoRecordType) => {
  if (recordType === 'CUSTOMER') return '/integration/zoho/accounts/data'
  if (recordType === 'OPPORTUNITY') return '/integration/zoho/deals/data'
  return '/integration/zoho/contacts/data'
}

/**
 * GET — parity with `/api/salesforce-data` and `/api/hubspot-data`.
 * Proxies Zoho CRM records to customer-insights preview.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawRecordType = searchParams.get('recordType')
    const recordType: ZohoRecordType =
      rawRecordType === 'CUSTOMER' ||
      rawRecordType === 'OPPORTUNITY' ||
      rawRecordType === 'PROSPECT'
        ? rawRecordType
        : 'CUSTOMER'

    const endpoint = getZohoDataEndpoint(recordType)
    const data = await fetcher<unknown>(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    // Zoho returns a flat array of objects
    const records = Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.data)
        ? (data as any).data
        : []

    return NextResponse.json({
      success: true,
      data: records
    })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    const message =
      details?.message ?? error?.message ?? 'Failed to fetch Zoho data'
    return NextResponse.json(
      {
        success: false,
        error: message,
        details
      },
      { status }
    )
  }
}
