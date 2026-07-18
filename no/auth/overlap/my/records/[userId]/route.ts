import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(req.url)
    const recordType = searchParams.get('recordType') ?? 'CUSTOMER'
    const path = `/api/no/auth/overlap/my/records/${encodeURIComponent(userId)}?recordType=${encodeURIComponent(recordType)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { accept: 'application/json' }
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const msg =
      e?.response?.data?.message ?? 'Failed to fetch overlap my records'
    return NextResponse.json(
      typeof msg === 'string' ? { message: msg } : { ...e?.response?.data },
      { status }
    )
  }
}
