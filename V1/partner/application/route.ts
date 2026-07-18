import { NextResponse } from 'next/server'

import { publicFetcher } from '@/lib/server'

export async function POST(req: Request) {
  const body = await req.json()

  try {
    const data = await publicFetcher<unknown>('/api/v1/partner/application', {
      method: 'POST',
      data: body,
      headers: { Accept: '*/*' }
    })

    return NextResponse.json(data ?? {}, { status: 200 })
  } catch (error: unknown) {
    const err = error as {
      message?: string
      response?: { status?: number; data?: unknown }
    }
    console.error('PARTNER APPLICATION ERROR:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    })
    const status =
      typeof err.response?.status === 'number' && err.response.status >= 400
        ? err.response.status
        : 500
    const errBody = err.response?.data as
      | { message?: string; error?: string }
      | undefined
    const message =
      errBody?.message || errBody?.error || err.message || 'Failed'

    return NextResponse.json({ message, success: false }, { status })
  }
}
