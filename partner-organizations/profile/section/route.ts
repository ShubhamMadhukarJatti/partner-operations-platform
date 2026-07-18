import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/partner-organizations/profile/section
 * Proxies authenticated organization profile-section lookup for profile-beta basic info.
 */
export async function GET() {
  try {
    const data = await fetcher<unknown>(
      '/api/v1/partner-organizations/profile/section',
      {
        method: 'GET',
        headers: { accept: 'application/hal+json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch organization profile section', details },
      { status }
    )
  }
}
