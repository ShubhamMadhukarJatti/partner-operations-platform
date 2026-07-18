import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const responseData = await fetcher('/ppi/getCounter', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Error fetching counter stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch counter stats' },
      { status: 500 }
    )
  }
}
