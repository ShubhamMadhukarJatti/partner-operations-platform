import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/no/auth/organization/integration/[userId]
 * Fetches connected integrations. Uses cookie auth via fetcher when no Authorization header.
 */
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      )
    }

    const authHeader = req.headers.get('authorization')
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : null

    if (tokenFromHeader) {
      const apiUrl =
        process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
      if (!apiUrl) {
        return NextResponse.json(
          { message: 'API URL not configured' },
          { status: 500 }
        )
      }
      const res = await fetch(
        `${apiUrl.replace(/\/$/, '')}/api/no/auth/organization/integration/${encodeURIComponent(userId)}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tokenFromHeader}`
          }
        }
      )
      const data = await res.json().catch(() => [])
      if (!res.ok) {
        return NextResponse.json(
          {
            message:
              (data && (data.message || data.error)) ||
              res.statusText ||
              'Failed to fetch integrations',
            ...(typeof data === 'object' && data !== null ? data : {})
          },
          { status: res.status }
        )
      }
      return NextResponse.json(Array.isArray(data) ? data : data)
    }

    const data = await fetcher<unknown>(
      `/api/no/auth/organization/integration/${encodeURIComponent(userId)}`,
      { method: 'GET', headers: { accept: 'application/json' } }
    )
    return NextResponse.json(Array.isArray(data) ? data : data)
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const msg =
      e?.response?.data?.message ?? e?.message ?? 'Failed to fetch integrations'
    return NextResponse.json(
      typeof msg === 'string' ? { message: msg } : { ...e?.response?.data },
      { status }
    )
  }
}
