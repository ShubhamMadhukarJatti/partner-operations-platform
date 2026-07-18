import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/partner-organizations/seniority-enquiry-counter
 * Proxies to backend to increment the enquiry counter.
 * No request body or parameters needed — the backend identifies the context from auth.
 */
export async function POST(_request: Request) {
  try {
    const data = await fetcher<{
      success: boolean
      message: string
      data: number
    }>('/api/v1/partner-organizations/seniority-enquery-counter', {
      method: 'POST',
      headers: { accept: 'application/hal+json' }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to update enquiry counter', details },
      { status }
    )
  }
}
