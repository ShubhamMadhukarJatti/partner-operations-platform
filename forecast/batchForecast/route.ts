import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

/** Re-throw Next.js redirect so client gets 307 instead of 500 */
function rethrowRedirect(e: unknown): void {
  const err = e as { digest?: string }
  if (err?.digest?.startsWith('NEXT_REDIRECT')) throw e
}

/**
 * POST /api/forecast/batchForecast
 * Proxies to backend forecast-controller/batchForecast with auth.
 * Body: array of partner objects { ORGid, ORGname, about, partnership_type, sector, subsector, meetingSuccessRate, activePartnerships, average_revenue }
 */
export async function POST(request: NextRequest) {
  try {
    const apiUrl =
      process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
    if (!apiUrl) {
      console.error(
        '[forecast/batchForecast] SHARKDOM_API_URL is not configured'
      )
      return NextResponse.json(
        { message: 'Server configuration error: API URL not set' },
        { status: 503 }
      )
    }

    const { token } = await getServerUser()
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => [])
    const payload = Array.isArray(body) ? body : []

    const forecastPrefix =
      process.env.SHARKDOM_FORECAST_PATH_PREFIX ??
      process.env.NEXT_PUBLIC_SHARKDOM_FORECAST_PATH_PREFIX ??
      '/api/forecast'
    const path = `${forecastPrefix.replace(/\/$/, '')}/batch`

    const data = await fetcher<unknown>(path, {
      method: 'POST',
      data: payload,
      timeout: 30000
    })

    return NextResponse.json(data)
  } catch (e: unknown) {
    rethrowRedirect(e)
    const err = e as {
      response?: { status?: number; data?: unknown }
      message?: string
    }
    const status = err?.response?.status ?? 500
    const errData = err?.response?.data as Record<string, unknown> | undefined
    const msg =
      (errData?.message as string) ??
      (errData?.errorMessage as string) ??
      err?.message ??
      'Failed to batch forecast'
    return NextResponse.json(
      typeof msg === 'string'
        ? { message: msg }
        : { ...(err?.response?.data as object) },
      { status }
    )
  }
}
