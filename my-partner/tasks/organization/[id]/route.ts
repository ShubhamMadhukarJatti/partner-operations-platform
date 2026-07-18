import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: myPartnerId } = params

  console.log('resolved myPartnerId:', myPartnerId)

  if (!myPartnerId) {
    return NextResponse.json(
      { message: 'myPartnerId is missing in route params' },
      { status: 400 }
    )
  }

  try {
    const data = await fetcher<unknown>(
      `/api/my-partner/tasks/organization/${myPartnerId}`,
      { method: 'GET' }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message

    return NextResponse.json(
      { message: 'Failed to fetch my-partner tasks', details },
      { status }
    )
  }
}
