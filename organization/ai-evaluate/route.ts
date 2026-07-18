import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/organization/ai-evaluate
 * Proxies partnership evaluation requests using AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Assuming the backend accepts the sentence payload structure
    const data = await fetcher<unknown>(
      '/api/v1/partner-organizations/ai/evaluate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json'
        },
        data: body
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to evaluate partnership match', details },
      { status }
    )
  }
}
