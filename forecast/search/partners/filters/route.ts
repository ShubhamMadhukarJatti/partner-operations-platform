import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

function rethrowRedirect(e: unknown): void {
  const err = e as { digest?: string }
  if (err?.digest?.startsWith('NEXT_REDIRECT')) throw e
}

export async function POST(request: NextRequest) {
  try {
    const apiUrl =
      process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
    if (!apiUrl) {
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

    const body = await request.json().catch(() => ({}))
    const sector = body?.sector ?? ''
    const input = typeof body?.input === 'string' ? body.input : ''

    const forecastPrefix =
      process.env.SHARKDOM_FORECAST_PATH_PREFIX ??
      process.env.NEXT_PUBLIC_SHARKDOM_FORECAST_PATH_PREFIX ??
      '/api/forecast'
    const path = `${forecastPrefix.replace(/\/$/, '')}/search/partners/filters`

    const data = await fetcher<unknown>(path, {
      method: 'POST',
      data: { sector, input },
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
      'Failed to search partners'
    return NextResponse.json(
      typeof msg === 'string'
        ? { message: msg }
        : { ...(err?.response?.data as object) },
      { status }
    )
  }
}
