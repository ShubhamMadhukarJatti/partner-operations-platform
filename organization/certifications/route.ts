import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/organization/certifications
 * Proxies authenticated organization certification listing for profile-beta.
 */
export async function GET() {
  try {
    const data = await fetcher<unknown>(
      '/api/v1/org-certifications/by-org/all',
      {
        method: 'GET',
        headers: { accept: 'application/json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch certifications', details },
      { status }
    )
  }
}

/**
 * POST /api/organization/certifications
 * Proxies organization certification creation for profile-beta.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const data = await fetcher<unknown>('/api/v1/org-certifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      data: body
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to create certification', details },
      { status }
    )
  }
}
