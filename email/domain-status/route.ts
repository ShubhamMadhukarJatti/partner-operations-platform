import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const domain = searchParams.get('domain')

    if (!domain) {
      return NextResponse.json(
        { message: 'domain is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/email/domain/status?domain=${encodeURIComponent(domain)}`,
      { method: 'GET' }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to get domain status',
        ...details
      },
      { status }
    )
  }
}
