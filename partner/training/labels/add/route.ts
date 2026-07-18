import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { message: 'Label name is required.' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/api/partner/training/labels/add', {
      method: 'POST',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: { name: name.trim() }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message:
          details?.message || error?.message || 'Failed to create label.',
        details
      },
      { status }
    )
  }
}
