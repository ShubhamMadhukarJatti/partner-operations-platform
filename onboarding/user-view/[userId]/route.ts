import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

import { getAuthenticatedSession } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const session = await getAuthenticatedSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (userId !== session.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { token } = session

    const apiUrl =
      process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
    if (!apiUrl) {
      return NextResponse.json(
        { success: false, message: 'API URL not configured' },
        { status: 500 }
      )
    }

    const baseUrl = apiUrl.replace(/\/$/, '')
    const url = `${baseUrl}/api/onboarding/user-view/${encodeURIComponent(userId)}`

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/hal+json',
        'x-middleware-bypass': '1'
      },
      timeout: 10000,
      validateStatus: (s) => s < 500
    })

    if (response.status === 404) {
      return NextResponse.json(
        { success: true, message: 'No user view yet', data: null },
        { status: 200 }
      )
    }

    if (response.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (response.status < 200 || response.status >= 300) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch user view',
          details: response.data
        },
        { status: response.status }
      )
    }

    return NextResponse.json(response.data, { status: 200 })
  } catch (error: any) {
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user view', details },
      { status: 500 }
    )
  }
}
