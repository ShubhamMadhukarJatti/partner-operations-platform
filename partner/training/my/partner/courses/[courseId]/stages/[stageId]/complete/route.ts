import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(
  _req: NextRequest,
  { params }: { params: { courseId: string; stageId: string } }
) {
  try {
    const { courseId, stageId } = params

    if (!courseId || !stageId) {
      return NextResponse.json(
        { message: 'Course ID and Stage ID are required.' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/partner/training/my/partner/courses/${courseId}/stages/${stageId}/complete`,
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
      { message: details?.message || 'Failed to complete stage.', details },
      { status }
    )
  }
}
