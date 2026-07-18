import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { stageId: string } }
) {
  try {
    const { stageId } = params

    if (!stageId) {
      return NextResponse.json(
        { message: 'Stage ID is required.' },
        { status: 400 }
      )
    }

    // Use fetcher to call the external API
    const result = await fetcher<{
      success: boolean
      message: string
      data: null
    }>(`/partner/training/course/stages/${stageId}`, {
      method: 'DELETE',
      headers: {
        accept: 'application/hal+json'
      }
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting stage:', error)

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to delete stage.'

    return NextResponse.json(
      { success: false, message: errorMessage, data: null },
      { status: error?.response?.status || 500 }
    )
  }
}
