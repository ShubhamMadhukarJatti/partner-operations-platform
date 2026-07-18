import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const responseData = await fetcher('/ppi/getTopTenForms', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Error fetching top ten forms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    )
  }
}
