import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params
    const body = await req.json()

    const { isApproved, dealProtectionPeriod, integrationType } = body

    if (typeof isApproved !== 'boolean') {
      return NextResponse.json(
        { message: 'isApproved is required and must be a boolean' },
        { status: 400 }
      )
    }

    if (typeof dealProtectionPeriod !== 'number') {
      return NextResponse.json(
        { message: 'dealProtectionPeriod is required and must be a number' },
        { status: 400 }
      )
    }

    if (!integrationType || typeof integrationType !== 'string') {
      return NextResponse.json(
        { message: 'integrationType is required and must be a string' },
        { status: 400 }
      )
    }

    const queryParams = new URLSearchParams({
      isApproved: isApproved.toString(),
      dealProtectionPeriod: dealProtectionPeriod.toString(),
      integrationType: integrationType
    })

    const data = await fetcher<unknown>(
      `/my-deals/approve/${dealId}?${queryParams}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to approve/deny deal', details },
      { status }
    )
  }
}
