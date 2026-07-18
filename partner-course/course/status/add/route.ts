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
    const { courseId, status = 'IN_PROGRESS' } = body

    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required.' },
        { status: 400 }
      )
    }

    const data = await fetcher('/api/partner/training/courses/status/add', {
      method: 'POST',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: {
        userId: user.uid,
        courseId,
        status
      }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to update course status.',
        ...details
      },
      { status }
    )
  }
}
