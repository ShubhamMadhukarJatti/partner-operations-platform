import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const formId = searchParams.get('formId')
    const senderEmail = searchParams.get('senderEmail')

    if (!formId || !senderEmail) {
      return NextResponse.json(
        { error: 'Form ID and Sender Email are required' },
        { status: 400 }
      )
    }

    const responseData = await fetcher(
      `/ppi/form/status?formId=${formId}&senderEmail=${encodeURIComponent(senderEmail)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    return NextResponse.json(responseData, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching form status:', error)

    // Return the API error message if available
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to fetch form status'
    const errorData = error?.response?.data || { error: errorMessage }

    return NextResponse.json(errorData, {
      status: error?.response?.status || 500
    })
  }
}
