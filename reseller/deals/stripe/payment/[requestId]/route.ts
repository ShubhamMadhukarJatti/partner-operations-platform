import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const requestId = params.requestId

    if (!requestId) {
      return NextResponse.json(
        { message: 'Request ID is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<{
      success: boolean
      message: string
      data?: unknown
    }>(`/reseller/deals/stripe/payment/${requestId}`, {
      method: 'GET',
      headers: { accept: 'application/hal+json' }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      {
        message: 'Failed to fetch stripe payment',
        details
      },
      { status }
    )
  }
}
