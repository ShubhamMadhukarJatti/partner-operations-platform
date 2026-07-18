import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/my-deals/internal/partner/portal/approve/[dealId]?isApproved=...&dealProtectionPeriod=...&integrationType=...
 * Proxies to backend via fetcher.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const { dealId } = await params
    if (!dealId) {
      return NextResponse.json(
        { message: 'dealId is required' },
        { status: 400 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const isApproved = searchParams.get('isApproved')
    const dealProtectionPeriod = searchParams.get('dealProtectionPeriod')
    const integrationType = searchParams.get('integrationType')

    if (isApproved === null || isApproved === undefined || isApproved === '') {
      return NextResponse.json(
        { message: 'isApproved is required (true/false)' },
        { status: 400 }
      )
    }
    if (!dealProtectionPeriod) {
      return NextResponse.json(
        { message: 'dealProtectionPeriod is required' },
        { status: 400 }
      )
    }
    if (!integrationType) {
      return NextResponse.json(
        { message: 'integrationType is required' },
        { status: 400 }
      )
    }

    const path = `/my-deals/internal/partner/portal/approve/${encodeURIComponent(dealId)}?isApproved=${encodeURIComponent(isApproved)}&dealProtectionPeriod=${encodeURIComponent(dealProtectionPeriod)}&integrationType=${encodeURIComponent(integrationType)}`
    const data = await fetcher<unknown>(path, {
      method: 'PATCH',
      headers: { Accept: 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to approve deal'
    return NextResponse.json({ message }, { status })
  }
}
