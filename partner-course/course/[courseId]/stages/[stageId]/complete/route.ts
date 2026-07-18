import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(
  _req: NextRequest,
  {
    params
  }: {
    params: { courseId: string; stageId: string }
  }
) {
  try {
    const { user } = await getServerUser()
    const courseId = params.courseId
    const stageId = params.stageId

    if (!user?.uid) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      )
    }

    if (!courseId || !stageId) {
      return NextResponse.json(
        { message: 'Course ID and Stage ID are required.' },
        { status: 400 }
      )
    }

    const data = await fetcher(
      `/partner/training/courses/${courseId}/stages/${stageId}/complete/users/${user.uid}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
        },
        data: {}
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to complete stage.',
        ...details
      },
      { status }
    )
  }
}
