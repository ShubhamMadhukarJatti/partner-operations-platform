import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/linkedin/disconnect
 * Disconnects LinkedIn for the current user.
 * Proxies to backend POST /api/linkedin/disconnect with body { userId }.
 */
export async function POST() {
  try {
    const { user } = await getServerUser()
    if (!user?.uid) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const cookieStore = cookies()
    const linkedinAccountId = cookieStore.get('linkedin_account_id')?.value

    if (linkedinAccountId) {
      try {
        const azureUrl = `https://agentscoutingv3-eahkbbf8bzfrgafu.eastasia-01.azurewebsites.net/api/v1/linkedin/delete-account?account_id=${encodeURIComponent(linkedinAccountId)}`
        const deleteRes = await fetch(azureUrl, {
          method: 'DELETE'
        })
        if (!deleteRes.ok) {
          const errText = await deleteRes.text()
          console.error(
            'Failed to delete account on Azure backend:',
            deleteRes.status,
            errText
          )
        }
      } catch (err) {
        console.error('Failed to delete account on Azure backend:', err)
      }
    }

    cookieStore.delete('linkedin_oauth_connected')
    cookieStore.delete('linkedin_account_id')

    return NextResponse.json({
      success: true,
      message: 'LinkedIn disconnected',
      data: { status: 'disconnected' }
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
      'Failed to disconnect LinkedIn'
    return NextResponse.json(
      typeof msg === 'string'
        ? { message: msg }
        : { ...(err?.response?.data as object) },
      { status }
    )
  }
}
