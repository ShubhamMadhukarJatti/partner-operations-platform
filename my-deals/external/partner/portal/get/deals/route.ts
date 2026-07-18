import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/my-deals/external/partner/portal/get/deals?externalPartnerCode=...&vendorOrgId=...&status=...&page=...&size=...
 * Proxies to backend via fetcher.
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const externalPartnerCode = searchParams.get('externalPartnerCode')
    const vendorOrgId = searchParams.get('vendorOrgId')
    const status = searchParams.get('status') || 'PENDING'
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'

    if (!externalPartnerCode || !vendorOrgId) {
      return NextResponse.json(
        { message: 'externalPartnerCode and vendorOrgId are required' },
        { status: 400 }
      )
    }

    const path = `/my-deals/external/partner/portal/get/deals/${encodeURIComponent(externalPartnerCode)}/organization/${vendorOrgId}?status=${status}&page=${page}&size=${size}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch deals', details },
      { status }
    )
  }
}
