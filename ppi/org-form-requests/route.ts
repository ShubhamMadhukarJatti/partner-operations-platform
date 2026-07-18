import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, formId, status, externalUser } = body

    if (!email || !formId || !status) {
      return NextResponse.json(
        { error: 'Email, Form ID, and Status are required' },
        { status: 400 }
      )
    }

    const responseData = await fetcher('/ppi/org-form-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { email, formId, status, externalUser: externalUser ?? true }
    })

    return NextResponse.json(responseData, { status: 200 })
  } catch (error: any) {
    console.error('Error updating form request:', error)

    // Return the API error message if available
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to update form request'
    const errorData = error?.response?.data || { error: errorMessage }

    return NextResponse.json(errorData, {
      status: error?.response?.status || 500
    })
  }
}
