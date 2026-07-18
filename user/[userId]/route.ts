import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required.' },
        { status: 400 }
      )
    }

    const { user } = await getServerUser()

    if (!user?.uid) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      )
    }

    if (user.uid !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await fetcher<unknown>(`/user/userId?userId=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'An unexpected error occurred.'
    return NextResponse.json({ message }, { status })
  }
}
