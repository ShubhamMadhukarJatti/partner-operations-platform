import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function PUT(
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

    const { searchParams } = new URL(req.url)
    const published = searchParams.get('published')

    if (published === 'false') {
      return NextResponse.json(
        { message: 'Unpublish is not supported by backend publish API.' },
        { status: 400 }
      )
    }

    const data = await fetcher(
      `/api/partner/training/courses/${courseId}/publish`,
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
        message: details?.message || 'Failed to publish/unpublish course.',
        ...details
      },
      { status }
    )
  }
}
