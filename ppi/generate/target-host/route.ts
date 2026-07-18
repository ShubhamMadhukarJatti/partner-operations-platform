import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { domainName } = body

    if (!domainName) {
      return NextResponse.json(
        { error: 'Domain name is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/ppi/generate/target-host', {
      method: 'POST',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: { domainName }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to generate target host', success: false, details },
      { status }
    )
  }
}
