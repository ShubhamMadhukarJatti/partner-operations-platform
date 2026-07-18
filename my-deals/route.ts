import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const status = new URL(req.url).searchParams.get('status') || 'PENDING'
    const data = await fetcher<unknown>(
      `/my-deals/get/all?status=${encodeURIComponent(status)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to fetch deals'
    return NextResponse.json({ message }, { status })
  }
}
