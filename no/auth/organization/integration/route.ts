import { NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/no/auth/organization/integration
 * Partner portal: save integration. Uses cookie auth via fetcher when no Authorization header.
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : null

    if (tokenFromHeader) {
      // Client provided token: keep existing fetch flow (backend call with that token)
      const { user } = await getServerUser()
      const apiUrl =
        process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
      if (!apiUrl) {
        return NextResponse.json(
          { message: 'API URL not configured' },
          { status: 500 }
        )
      }
      const body = await req.json()
      const userId = body.userId ?? user?.uid ?? ''
      const payload = {
        organizationId: body.organizationId ?? null,
        refreshToken: body.refreshToken ?? '',
        integrationType: body.integrationType ?? 'HUBSPOT',
        isConnected: body.isConnected ?? true,
        userId,
        connectedId: body.connectedId ?? '',
        publishableKey: body.publishableKey ?? ''
      }
      const res = await fetch(
        `${apiUrl.replace(/\/$/, '')}/api/no/auth/organization/integration`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenFromHeader}`
          },
          body: JSON.stringify(payload)
        }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        return NextResponse.json(
          {
            message:
              data?.message || res.statusText || 'Failed to save integration',
            ...data
          },
          { status: res.status }
        )
      }
      return NextResponse.json(data, { status: 200 })
    }

    const { user } = await getServerUser()
    const body = await req.json()
    const userId = body.userId ?? user?.uid ?? ''
    const payload = {
      organizationId: body.organizationId ?? null,
      refreshToken: body.refreshToken ?? '',
      integrationType: body.integrationType ?? 'HUBSPOT',
      isConnected: body.isConnected ?? true,
      userId,
      connectedId: body.connectedId ?? '',
      publishableKey: body.publishableKey ?? ''
    }

    const data = await fetcher<unknown>(
      '/api/no/auth/organization/integration',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: payload
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const msg =
      e?.response?.data?.message ?? e?.message ?? 'Failed to save integration'
    return NextResponse.json(
      typeof msg === 'string' ? { message: msg } : { ...e?.response?.data },
      { status }
    )
  }
}
