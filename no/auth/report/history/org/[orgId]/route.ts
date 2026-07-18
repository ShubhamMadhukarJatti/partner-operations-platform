import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { orgId: string } }
) {
  try {
    const { orgId } = params
    if (!orgId) {
      return NextResponse.json(
        { message: 'orgId is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/api/no/auth/report/history/${encodeURIComponent(orgId)}`,
      { method: 'GET', headers: { accept: 'application/json' } }
    )
    return NextResponse.json(data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const msg = e?.response?.data?.message ?? 'Failed to fetch report history'
    return NextResponse.json(
      typeof msg === 'string' ? { message: msg } : { ...e?.response?.data },
      { status }
    )
  }
}
