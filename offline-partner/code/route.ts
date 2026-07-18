import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/offline-partner/code?email=...
 * Proxies to backend GET /v2/offline-partner/code via fetcher (token + refresh + retry).
 */
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email')
    if (!email) {
      return NextResponse.json(
        { message: 'email is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/v2/offline-partner/code?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: { Accept: 'application/hal+json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const data = error?.response?.data ?? {}
    const message =
      data?.message ||
      data?.errorMessage ||
      error?.message ||
      'Failed to fetch partner code'
    return NextResponse.json(
      {
        message:
          typeof message === 'string' ? message : 'Failed to fetch partner code'
      },
      { status }
    )
  }
}
