import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await fetcher<unknown>('/suggestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: '*/*' },
      data: body
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const msg = error?.response?.data?.message ?? 'suggestion failed'
    return NextResponse.json({ error: msg }, { status })
  }
}
