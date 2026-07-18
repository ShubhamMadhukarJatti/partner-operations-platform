import { NextResponse } from 'next/server'

import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { token, user } = await getServerUser()

    if (!token || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json({ token, user }, { status: 200 })
  } catch (error) {
    console.error('Error fetching auth data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch authentication data' },
      { status: 500 }
    )
  }
}
