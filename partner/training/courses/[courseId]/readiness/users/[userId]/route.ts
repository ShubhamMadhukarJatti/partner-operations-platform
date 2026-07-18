import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { courseId: string; userId: string } }
) {
  try {
    const courseId = params.courseId
    const userId = params.userId

    if (!courseId || !userId) {
      return NextResponse.json(
        { message: 'Course ID and User ID are required.' },
        { status: 400 }
      )
    }

    const data = await fetcher(
      `/api/partner/training/courses/${courseId}/readiness/users/${userId}`,
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
        message: details?.message || 'Failed to fetch course readiness.',
        ...details
      },
      { status }
    )
  }
}
