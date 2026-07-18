import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { formId, formType } = body

    if (!formId || !formType) {
      return NextResponse.json(
        { error: 'Form ID and Form Type are required' },
        { status: 400 }
      )
    }

    const responseData = await fetcher('/ppi/formView', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { formId, formType }
    })

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Error fetching form view:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form view' },
      { status: 500 }
    )
  }
}
