import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, organizationId } = body

    const data = await fetcher<unknown>('/orgUserMapping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: {
        userId,
        organizationId,
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      {
        message:
          (typeof details === 'object' && details?.message) ||
          'Failed to map user to organization',
        details
      },
      { status }
    )
  }
}
