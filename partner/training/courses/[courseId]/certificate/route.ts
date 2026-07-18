import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = params.courseId

    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required.' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { certificateUrl } = body

    if (!certificateUrl) {
      return NextResponse.json(
        { message: 'Certificate URL is required.' },
        { status: 400 }
      )
    }

    const data = await fetcher(
      `/api/partner/training/courses/${courseId}/certificate`,
      {
        method: 'PATCH',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
        },
        data: { certificateUrl }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to update certificate.',
        ...details
      },
      { status }
    )
  }
}
