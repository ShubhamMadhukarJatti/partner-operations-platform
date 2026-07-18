import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/my-deals/external/partner/portal/getDealsCount/[vendorOrgId]?externalPartnerCode=...
 * Proxies to backend via fetcher.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vendorOrgId: string }> }
) {
  try {
    const { vendorOrgId } = await params
    if (!vendorOrgId) {
      return NextResponse.json(
        { message: 'vendorOrgId is required' },
        { status: 400 }
      )
    }

    const externalPartnerCode = req.nextUrl.searchParams.get(
      'externalPartnerCode'
    )
    if (!externalPartnerCode) {
      return NextResponse.json(
        { message: 'externalPartnerCode is required' },
        { status: 400 }
      )
    }

    const path = `/my-deals/external/partner/portal/getDealsCount/${vendorOrgId}?externalPartnerCode=${encodeURIComponent(externalPartnerCode)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch deals count', details },
      { status }
    )
  }
}
