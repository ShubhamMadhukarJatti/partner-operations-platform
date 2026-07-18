import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const formId = searchParams.get('formId')

    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      )
    }

    const responseData = await fetcher(
      `/ppi/internalFormsView?formId=${formId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Error fetching internal forms view:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form responses' },
      { status: 500 }
    )
  }
}
