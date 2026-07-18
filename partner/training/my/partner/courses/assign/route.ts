import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { courseId, assignedOrgId } = body

    if (!courseId || courseId === undefined || courseId === null) {
      return NextResponse.json(
        { message: 'courseId is required.' },
        { status: 400 }
      )
    }

    if (
      !assignedOrgId ||
      assignedOrgId === undefined ||
      assignedOrgId === null
    ) {
      return NextResponse.json(
        { message: 'assignedOrgId is required.' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      '/partner/training/my/partner/courses/assign',
      {
        method: 'POST',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
        },
        data: {
          courseId: Number(courseId),
          assignedOrgId: Number(assignedOrgId)
        }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to assign course to partner.',
        details
      },
      { status }
    )
  }
}
