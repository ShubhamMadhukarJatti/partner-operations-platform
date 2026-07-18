import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const orgId = searchParams.get('orgId')
    const numberOfLicences = searchParams.get('numberOfLicences')

    if (!orgId || !numberOfLicences) {
      return NextResponse.json(
        { message: 'orgId and numberOfLicences are required' },
        { status: 400 }
      )
    }

    const path = `/api/reseller/deals/calculate/partner/tier?orgId=${encodeURIComponent(orgId)}&numberOfLicences=${encodeURIComponent(numberOfLicences)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/hal+json'
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to calculate partner tier', details },
      { status }
    )
  }
}
