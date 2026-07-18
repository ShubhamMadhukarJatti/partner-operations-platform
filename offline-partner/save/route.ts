import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { organizationId, partnerInviteDetails } = body

    if (!partnerInviteDetails || !Array.isArray(partnerInviteDetails)) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: 'Invalid request: partner details required.'
        },
        { status: 200 }
      )
    }

    const data = await fetcher<{
      success?: boolean
      errorMessage?: string
      message?: string
    }>('/v2/offline-partner/save', {
      method: 'POST',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: {
        organizationId: organizationId ?? null,
        partnerInviteDetails
      }
    })

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: any) {
    const errData = error?.response?.data ?? {}
    const message =
      errData?.errorMessage ??
      errData?.message ??
      (error instanceof Error ? error.message : 'Failed to import partners.')
    return NextResponse.json(
      { success: false, errorMessage: message },
      { status: 200 }
    )
  }
}
