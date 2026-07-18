import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ columnId: string }> }
) {
  try {
    const { columnId } = await params
    const data = await fetcher<unknown>(
      `/api/Overlap/Field/entity/table/column/${columnId}`,
      {
        method: 'DELETE',
        headers: { Accept: 'application/hal+json' }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to delete column'
    return NextResponse.json({ message }, { status: 500 })
  }
}
