import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    const result = await fetcher<{
      success: boolean
      message: string
      data: Array<{
        userId: string
        name: string
        email: string
        roles: string[]
        status: string
        requestSentAt: string
        expiresAt: string
        seatConsumed: boolean
      }> | null
    }>('/user/team/section/requests', {
      method: 'GET',
      headers: {
        accept: 'application/hal+json'
      }
    })

    // TEMP DEBUG
    try {
      require('fs').writeFileSync(
        '/tmp/debug_team_requests.json',
        JSON.stringify(result, null, 2)
      )
    } catch (e) {}

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching team requests:', error)

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to fetch team requests.'

    return NextResponse.json(
      { success: false, message: errorMessage, data: null },
      { status: error?.response?.status || 500 }
    )
  }
}
