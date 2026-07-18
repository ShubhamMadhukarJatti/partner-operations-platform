import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { courseId, receiverUserEmail } = body

    if (!courseId || !receiverUserEmail) {
      return NextResponse.json(
        { message: 'Course ID and receiver email are required.' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/partner/training/courses/invite', {
      method: 'POST',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: { courseId, receiverUserEmail }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to send course invite'
    return NextResponse.json({ message }, { status })
  }
}
