import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/linkedin/check-connection
 * Proxies to backend /api/linkedin/check-connection. Body: { userId, profileUrl }
 * Returns whether the user can message the given LinkedIn profile.
 * Success → LinkedIn button enabled; failure → disabled.
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await getServerUser()
    if (!user?.uid) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const profileUrl =
      typeof body?.profileUrl === 'string' ? body.profileUrl.trim() : ''
    const userId =
      typeof body?.userId === 'string' ? body.userId.trim() : user.uid

    if (!profileUrl) {
      return NextResponse.json({
        success: false,
        connected: false,
        message: 'Profile URL is required',
        data: { connected: false }
      })
    }

    const cookieStore = cookies()
    const connectedCookie = cookieStore.get('linkedin_oauth_connected')
    const hasLinkedInAccount =
      connectedCookie?.value === user.uid || connectedCookie?.value === 'true'

    return NextResponse.json({
      success: hasLinkedInAccount,
      connected: hasLinkedInAccount,
      message: hasLinkedInAccount ? 'Connected' : 'Not connected',
      data: { connected: hasLinkedInAccount }
    })
  } catch (e: unknown) {
    if ((e as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) throw e
    const err = e as {
      response?: { status?: number; data?: unknown }
      message?: string
    }
    const status = err?.response?.status ?? 500
    // Backend may return 401 for "can't message this profile" - return connected: false
    if (status === 401) {
      return NextResponse.json({
        success: false,
        connected: false,
        message: 'LinkedIn connection check failed',
        data: { connected: false }
      })
    }
    const msg =
      (err?.response?.data as { message?: string })?.message ??
      err?.message ??
      'Failed to check LinkedIn connection'
    return NextResponse.json(
      typeof msg === 'string'
        ? { message: msg, success: false, connected: false }
        : {
            ...(err?.response?.data as object),
            success: false,
            connected: false
          },
      { status }
    )
  }
}
