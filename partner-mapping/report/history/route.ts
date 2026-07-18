import { NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { user } = await getServerUser()
    if (!user?.uid) {
      return NextResponse.json({ error: 'User ID is missing' }, { status: 401 })
    }

    const path = `/api/no/auth/report/history/${encodeURIComponent(user.uid)}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errMsg =
      error?.response?.data ?? error?.message ?? 'Internal server error'
    return NextResponse.json(
      {
        error:
          typeof errMsg === 'string' ? errMsg : 'Failed to fetch report history'
      },
      { status }
    )
  }
}
