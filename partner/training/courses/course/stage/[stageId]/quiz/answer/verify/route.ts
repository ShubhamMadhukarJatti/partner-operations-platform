import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ stageId: string }> | { stageId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const { stageId } = resolvedParams

    if (!stageId) {
      return NextResponse.json(
        { message: 'Stage ID is required.' },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(req.url)
    const answer = searchParams.get('answer')

    if (!answer) {
      return NextResponse.json(
        { message: 'Answer is required.' },
        { status: 400 }
      )
    }

    const data = await fetcher(
      `/api/partner/training/courses/course/stage/${stageId}/quiz/answer/verify?answer=${encodeURIComponent(answer)}`,
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
        message: details?.message || 'Failed to verify quiz answer.',
        ...details
      },
      { status }
    )
  }
}
