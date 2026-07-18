import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const vendorOrgId = searchParams.get('vendorOrgId')
    const website = searchParams.get('website')

    if (!vendorOrgId || !website) {
      return NextResponse.json(
        { message: 'vendorOrgId and website are required' },
        { status: 400 }
      )
    }

    const path = `/my-deals/dealExist?vendorOrgId=${vendorOrgId}&website=${encodeURIComponent(website)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
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
