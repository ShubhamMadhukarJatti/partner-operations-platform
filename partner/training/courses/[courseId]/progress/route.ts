import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
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

    const data = await fetcher(
      `/api/partner/training/courses/${courseId}/progress/users/${user.uid}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
        }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to fetch course progress.',
        ...details
      },
      { status }
    )
  }
}
