import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const data = await fetcher<unknown>('/meetings/google-meet/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })

    if (!data) {
      return NextResponse.json(
        { message: 'Unexpected response from backend' },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        meeting: data,
        message: 'Google Meet created successfully'
      },
      { status: 200 }
    )
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      { message: details?.message || 'Unexpected server error', ...details },
      { status }
    )
  }
}
