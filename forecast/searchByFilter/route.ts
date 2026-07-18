import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const subsectors = searchParams.get('subsectors') ?? ''
    const compliances = searchParams.get('compliances') ?? ''
    const page = searchParams.get('page') ?? '0'
    const size = searchParams.get('size') ?? '10'

    const params = new URLSearchParams()
    if (subsectors) params.set('subsectors', subsectors)
    if (compliances) params.set('compliances', compliances)
    params.set('page', page)
    params.set('size', size)

    const query = params.toString()
    const forecastPrefix =
      process.env.SHARKDOM_FORECAST_PATH_PREFIX ??
      process.env.NEXT_PUBLIC_SHARKDOM_FORECAST_PATH_PREFIX ??
      '/api/forecast'
    const endpoint = `${forecastPrefix.replace(/\/$/, '')}/searchByFilter${query ? `?${query}` : ''}`

    const data = await fetcher<unknown>(endpoint, {
      method: 'GET'
    })

    return NextResponse.json(data)
  } catch (e: unknown) {
    if ((e as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) throw e
    const err = e as {
      response?: { status?: number; data?: unknown }
      message?: string
    }
    const status = err?.response?.status ?? 500
    const msg =
      (err?.response?.data as { message?: string })?.message ??
      err?.message ??
      'Failed to search partners by filter'
    return NextResponse.json(
      typeof msg === 'string'
        ? { message: msg }
        : { ...(err?.response?.data as object) },
      { status }
    )
  }
}
