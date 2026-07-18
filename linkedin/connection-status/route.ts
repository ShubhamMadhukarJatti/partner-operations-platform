import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/linkedin/connection-status
 * Returns LinkedIn connection status for the current user.
 * Proxies to backend GET /api/linkedin/connection-status/{userId} with session auth.
 */
export async function GET() {
  try {
    const { user } = await getServerUser()
    if (!user?.uid) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Call the Azure accounts API to check if any accounts are connected
    const azureUrl =
      'https://agentscoutingv3-eahkbbf8bzfrgafu.eastasia-01.azurewebsites.net/api/v1/linkedin/list-accounts'
    const res = await fetch(azureUrl, { cache: 'no-store' })
    let connected = false
    let accountId = null

    if (res.ok) {
      const data = await res.json()
      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        // Assume the first account is the connected one
        connected = true
        accountId = data.data[0].id || data.data[0].account_id
      }
    }

    const cookieStore = cookies()
    const linkedinAccountIdCookie = cookieStore.get(
      'linkedin_account_id'
    )?.value

    if (connected && accountId) {
      if (accountId !== linkedinAccountIdCookie) {
        // Synchronize cookie if Azure returns an account but cookie is missing/different
        cookieStore.set('linkedin_account_id', accountId, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30
        })
        cookieStore.set('linkedin_oauth_connected', user.uid, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30
        })
      }
    } else {
      // Clear cookies if not connected
      cookieStore.delete('linkedin_account_id')
      cookieStore.delete('linkedin_oauth_connected')
    }

    return NextResponse.json({
      success: true,
      message: connected ? 'Connected' : 'Not connected',
      data: {
        connected,
        account_id: accountId || linkedinAccountIdCookie || user.uid
      }
    })
  } catch (e: unknown) {
    const err = e as {
      response?: { status?: number; data?: unknown }
      message?: string
    }
    const status = err?.response?.status ?? 500
    const msg =
      (err?.response?.data as { message?: string })?.message ??
      err?.message ??
      'Failed to fetch LinkedIn connection status'
    return NextResponse.json(
      typeof msg === 'string'
        ? { message: msg }
        : { ...(err?.response?.data as object) },
      { status }
    )
  }
}
