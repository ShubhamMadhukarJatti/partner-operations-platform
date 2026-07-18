import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/my-deals/external/partner/portal/deal/exist?externalPartnerCode=...&website=...
 * Proxies to backend via fetcher.
 */
export async function GET(req: NextRequest) {
  try {
    const externalPartnerCode = req.nextUrl.searchParams.get(
      'externalPartnerCode'
    )
    const website = req.nextUrl.searchParams.get('website')

    if (!externalPartnerCode || !website) {
      return NextResponse.json(
        { message: 'externalPartnerCode and website are required' },
        { status: 400 }
      )
    }

    const path = `/my-deals/external/partner/portal/deal/exist?externalPartnerCode=${encodeURIComponent(externalPartnerCode)}&website=${encodeURIComponent(website)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errData = error?.response?.data ?? {}
    const message =
      errData?.errorMessage ??
      errData?.message ??
      error?.message ??
      'Failed to check deal existence'
    return NextResponse.json({ ...errData, message }, { status })
  }
}
