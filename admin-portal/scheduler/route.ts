import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await fetcher('/scheduler/scheduled-methods', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return NextResponse.json(data)
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to fetch scheduler data',
        ...details
      },
      { status }
    )
  }
}
