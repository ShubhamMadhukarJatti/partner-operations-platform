import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export type StripePaymentLinkGenerationBody = {
  customerEmail: string
  productName: string
  unitAmount: number
  currency: string
  quantity: number
  successUrl: string
  cancelUrl: string
  resellerId: number
  dealRequestedId: number
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as StripePaymentLinkGenerationBody

    const data = await fetcher<{
      success: boolean
      message: string
      data?: string
    }>('/reseller/deals/stripe/payment/link/generation', {
      method: 'POST',
      headers: { accept: 'application/hal+json' },
      data: body
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      {
        message: 'Failed to generate stripe payment link',
        details
      },
      { status }
    )
  }
}
