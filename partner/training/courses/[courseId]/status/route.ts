import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { user } = await getServerUser()
    const courseId = params.courseId

    if (!user?.uid) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      )
    }

    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required.' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { status } = body

    if (!status || (status !== 'INPROGRESS' && status !== 'COMPLETED')) {
      return NextResponse.json(
        { message: 'Status must be either INPROGRESS or COMPLETED.' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      '/partner/training/update/courses/status',
      {
        method: 'PUT',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
        },
        data: {
          userId: user.uid,
          courseId: parseInt(courseId),
          status
        }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to update course status.',
        details
      },
      { status }
    )
  }
}
