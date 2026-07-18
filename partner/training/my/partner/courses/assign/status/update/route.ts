import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { courseId, assignedOrgId, status } = body

    if (!courseId || !assignedOrgId || !status) {
      return NextResponse.json(
        { message: 'courseId, assignedOrgId, and status are required.' },
        { status: 400 }
      )
    }

    if (status !== 'IN_PROGRESS' && status !== 'COMPLETED') {
      return NextResponse.json(
        { message: 'Status must be either IN_PROGRESS or COMPLETED.' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      '/partner/training/my/partner/courses/assign/status/update',
      {
        method: 'POST',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
        },
        data: {
          courseId: Number(courseId),
          assignedOrgId: Number(assignedOrgId),
          status
        }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message:
          details?.message || 'Failed to update course assignment status.',
        details
      },
      { status }
    )
  }
}
