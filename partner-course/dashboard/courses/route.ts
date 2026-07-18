import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { user } = await getServerUser()

    if (!user?.uid) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      )
    }

    const body = (await req.json().catch(() => ({}))) || {}
    const { status, page = 0, size = 10 } = body

    const payload: Record<string, unknown> = {
      userId: user.uid,
      page: Math.max(0, page),
      size
    }
    if (status) {
      payload.status = status
    }

    const data = await fetcher(
      '/api/partner/training/partner/dashboard/courses',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
        data: payload
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message:
          details?.message || 'Failed to fetch partner dashboard courses.',
        ...details
      },
      { status }
    )
  }
}
