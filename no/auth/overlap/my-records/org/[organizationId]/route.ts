import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { organizationId: string } }
) {
  try {
    const { organizationId } = params
    if (!organizationId) {
      return NextResponse.json(
        { message: 'organizationId is required' },
        { status: 400 }
      )
    }

    const path = `/persona/overlap/my-records/org/${encodeURIComponent(organizationId)}?recordType=CUSTOMER`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { accept: 'application/hal+json' }
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const msg =
      e?.response?.data?.message ?? 'Failed to fetch overlap org records'
    return NextResponse.json(
      typeof msg === 'string' ? { message: msg } : { ...e?.response?.data },
      { status }
    )
  }
}
