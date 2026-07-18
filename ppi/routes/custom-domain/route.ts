import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest) {
  try {
    const customDomainName = req.nextUrl.searchParams.get('customDomainName')
    if (!customDomainName) {
      return NextResponse.json(
        { error: 'customDomainName query parameter is required' },
        { status: 400 }
      )
    }

    const path = `/ppi/routes/custom-domain?customDomainName=${encodeURIComponent(customDomainName)}`
    const data = await fetcher<unknown>(path, {
      method: 'PUT',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      {
        error: 'Failed to update custom domain route',
        success: false,
        details
      },
      { status }
    )
  }
}
