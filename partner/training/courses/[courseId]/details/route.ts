import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> | { courseId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const { courseId } = resolvedParams

    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required.' },
        { status: 400 }
      )
    }

    // Backend: GET /api/partner/training/courses/{id} — there is no /details path in Swagger
    const data = await fetcher<unknown>(
      `/api/partner/training/courses/${courseId}`,
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
        message: details?.message || 'Failed to fetch course details.',
        details
      },
      { status }
    )
  }
}
