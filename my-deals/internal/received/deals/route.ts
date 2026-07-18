import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/my-deals/internal/received/deals?externalPartnerCode=...&page=...&size=...
 * Proxies to backend via fetcher.
 */
export async function GET(req: NextRequest) {
  try {
    const externalPartnerCode = req.nextUrl.searchParams.get(
      'externalPartnerCode'
    )
    const page = req.nextUrl.searchParams.get('page') ?? '0'
    const size = req.nextUrl.searchParams.get('size') ?? '10'

    if (!externalPartnerCode) {
      return NextResponse.json(
        { message: 'externalPartnerCode is required' },
        { status: 400 }
      )
    }

    const path = `/my-deals/internal/received/deals?externalPartnerCode=${encodeURIComponent(externalPartnerCode)}&page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { Accept: 'application/hal+json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to fetch received deals'
    return NextResponse.json({ message }, { status })
  }
}
