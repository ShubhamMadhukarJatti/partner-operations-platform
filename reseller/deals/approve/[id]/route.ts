import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id
    if (!dealId) {
      return NextResponse.json(
        { message: 'Deal ID is required' },
        { status: 400 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const integrationType = searchParams.get('integrationType')
    const isApproved = searchParams.get('isApproved')

    if (!integrationType) {
      return NextResponse.json(
        { message: 'integrationType query parameter is required' },
        { status: 400 }
      )
    }

    if (!isApproved) {
      return NextResponse.json(
        { message: 'isApproved query parameter is required' },
        { status: 400 }
      )
    }

    const path = `/api/reseller/deals/approve/${dealId}?integrationType=${encodeURIComponent(integrationType)}&isApproved=${encodeURIComponent(isApproved)}`
    const data = await fetcher<unknown>(path, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/hal+json'
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to approve reseller deal', details },
      { status }
    )
  }
}
