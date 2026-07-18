import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Debug: Check what cookies are available
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    console.log(
      'Available cookies:',
      allCookies.map((c) => c.name)
    )

    // Get authentication token
    const { token, user } = await getServerUser()
    console.log('getServerUser result:', { hasToken: !!token, hasUser: !!user })

    return NextResponse.json({
      authenticated: !!token,
      hasUser: !!user,
      cookies: allCookies.map((c) => c.name)
    })
  } catch (error) {
    console.error('Error in test auth route:', error)
    return NextResponse.json(
      {
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
