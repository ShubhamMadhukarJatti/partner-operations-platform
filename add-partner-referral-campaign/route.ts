import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function PATCH(req: Request) {
  if (req.method !== 'PATCH') {
    return NextResponse.json({ message: 'METHOD NOT ALLOWED' }, { status: 405 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const referralId = searchParams.get('id') || ''
    const body = await req.json()

    if (!body?.partnerId) {
      return NextResponse.json(
        { message: 'no partner org id and name found' },
        { status: 400 }
      )
    }

    const data = await fetcher(`/referral/campaign?id=${referralId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json-patch+json'
      },
      data: [
        {
          op: 'replace',
          path: '/partnerOrganizationName',
          value: body?.partnerOrganizationName ?? null
        },
        {
          op: 'replace',
          path: '/partnerId',
          value: body?.partnerId ?? null
        }
      ]
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 404
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to update referral campaign',
        ...details
      },
      { status }
    )
  }
}
