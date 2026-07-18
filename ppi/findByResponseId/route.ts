import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const formType = searchParams.get('formType')

    if (!formType) {
      return NextResponse.json(
        { error: 'Form type is required' },
        { status: 400 }
      )
    }

    const queryString = searchParams.toString()
    const responseData = await fetcher(`/ppi/findByResponseId?${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Error fetching response details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch response details' },
      { status: 500 }
    )
  }
}
