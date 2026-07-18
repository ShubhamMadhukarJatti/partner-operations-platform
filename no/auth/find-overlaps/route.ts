import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/no/auth/find-overlaps
 * Proxies to backend via fetcher. Body: { listA: any[], listB: any[] }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const data = await fetcher<unknown>('/api/no/auth/find-overlaps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/hal+json'
      },
      data: body
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const msg = e?.response?.data?.message ?? 'Failed to find overlaps'
    return NextResponse.json(
      typeof msg === 'string' ? { message: msg } : { ...e?.response?.data },
      { status }
    )
  }
}
