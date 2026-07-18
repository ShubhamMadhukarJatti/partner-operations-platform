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

    let body
    try {
      body = await req.json()
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid request body.' },
        { status: 400 }
      )
    }

    const {
      status,
      userId: clientUserId,
      courseId: clientCourseId
    } = body || {}

    if (!status || (status !== 'IN_PROGRESS' && status !== 'COMPLETED')) {
      return NextResponse.json(
        { message: 'Status must be either IN_PROGRESS or COMPLETED.' },
        { status: 400 }
      )
    }

    const finalUserId = clientUserId || user.uid

    let finalCourseId: number
    if (clientCourseId !== undefined && clientCourseId !== null) {
      finalCourseId =
        typeof clientCourseId === 'number'
          ? Math.floor(clientCourseId)
          : parseInt(String(clientCourseId), 10)
    } else {
      finalCourseId = parseInt(courseId, 10)
    }

    if (
      isNaN(finalCourseId) ||
      finalCourseId <= 0 ||
      !Number.isInteger(finalCourseId)
    ) {
      return NextResponse.json(
        { message: 'Invalid course ID. Must be a positive integer.' },
        { status: 400 }
      )
    }

    if (finalUserId !== user.uid) {
      return NextResponse.json(
        { message: 'User ID mismatch.' },
        { status: 403 }
      )
    }

    const data = await fetcher('/api/partner/training/update/courses/status', {
      method: 'PUT',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: {
        userId: finalUserId,
        courseId: finalCourseId,
        status
      }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    const errorMessage =
      details?.message ||
      details?.error ||
      (details && JSON.stringify(details)) ||
      'Failed to update course status.'
    return NextResponse.json({ message: errorMessage, details }, { status })
  }
}
