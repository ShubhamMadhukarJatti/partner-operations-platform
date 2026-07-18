import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const formId = searchParams.get('formId')
    const orgId = searchParams.get('orgId')

    if (!formId || !orgId) {
      return NextResponse.json(
        { error: 'Form ID and Organization ID are required' },
        { status: 400 }
      )
    }

    const responseData = await fetcher(
      `/ppi/getCounterByFormId?formId=${formId}&orgId=${orgId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Error fetching form counter stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form counter stats' },
      { status: 500 }
    )
  }
}
