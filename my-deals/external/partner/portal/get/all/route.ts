import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { user } = await getServerUser()
    if (!user?.uid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status') || 'PENDING'
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '10'
    const vendorOrgId = searchParams.get('vendorOrgId')

    if (!vendorOrgId) {
      return NextResponse.json(
        { message: 'vendorOrgId is required' },
        { status: 400 }
      )
    }

    const path = `/my-deals/external/partner/portal/get/all/deals/${user.uid}/organization/${vendorOrgId}?status=${status}&page=${page}&size=${size}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { accept: 'application/hal+json' }
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
