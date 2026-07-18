import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: taskId } = params

  try {
    const data = await fetcher<unknown>(`/api/my-partner/tasks/${taskId}`, {
      method: 'DELETE'
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message

    return NextResponse.json(
      { message: 'Failed to delete my-partner task', details },
      { status }
    )
  }
}
