import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function PUT(
  req: NextRequest,
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

    const body = await req.json()
    const { stageIds } = body

    if (!Array.isArray(stageIds) || stageIds.length === 0) {
      return NextResponse.json(
        { message: 'Stage IDs array is required and must not be empty.' },
        { status: 400 }
      )
    }

    if (!stageIds.every((id) => typeof id === 'number' && !isNaN(id))) {
      return NextResponse.json(
        { message: 'All stage IDs must be valid numbers.' },
        { status: 400 }
      )
    }

    const data = await fetcher(
      `/api/partner/training/courses/${courseId}/stages/reorder`,
      {
        method: 'PUT',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
        },
        data: { stageIds }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to reorder stages.',
        ...details
      },
      { status }
    )
  }
}
