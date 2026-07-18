import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

type PostBody = {
  userId: string
  orgId?: number
  isVendor: boolean
  isPartner: boolean
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await getServerUser()
    if (!user?.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as PostBody
    if (!body?.userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    if (body.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const payload: PostBody = {
      userId: body.userId,
      isVendor: Boolean(body.isVendor),
      isPartner: Boolean(body.isPartner)
    }
    if (body.orgId != null && Number.isFinite(Number(body.orgId))) {
      payload.orgId = Number(body.orgId)
    }

    const data = await fetcher<unknown>('/api/onboarding/user-view', {
      method: 'POST',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: payload
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to save onboarding user view',
        details
      },
      { status }
    )
  }
}
