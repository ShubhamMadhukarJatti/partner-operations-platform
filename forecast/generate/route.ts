import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

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

    const body = await request.json()

    const data = await fetcher<unknown>('/api/forecast/generate', {
      method: 'POST',
      data: body,
      timeout: 60000
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
      'Failed to generate forecast'
    return NextResponse.json(
      typeof msg === 'string'
        ? { message: msg }
        : { ...(err?.response?.data as object) },
      { status }
    )
  }
}
