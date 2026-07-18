import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params

    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required.' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/partner/training/my/partner/courses/${courseId}/readiness`,
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
        details
      },
      { status }
    )
  }
}
