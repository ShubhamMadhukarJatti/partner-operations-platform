import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status') || 'ALL'
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '200'

    const path = `/organizationCollaboration/my-partners?status=${status}&page=${page}&size=${size}`
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
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to fetch partners'
    return NextResponse.json({ message }, { status })
  }
}
