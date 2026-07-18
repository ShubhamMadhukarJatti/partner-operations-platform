import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/organization/resources
 * Proxies resource creation to the authenticated backend endpoint.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const data = await fetcher<unknown>('/api/v1/org-resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/hal+json'
      },
      data: body
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to create resource', details },
      { status }
    )
  }
}
