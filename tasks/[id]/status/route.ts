import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

const validStatuses = [
  'Not Started',
  'In Progress',
  'On Track',
  'At Risk',
  'Delayed',
  'Paused',
  'Blocked',
  'Completed',
  'Cancelled'
]

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      )
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      data: { status }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to update task status', details },
      { status }
    )
  }
}
