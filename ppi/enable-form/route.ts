import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { formId, isFormEnabled, operation, formType, responderUrl } = body

    if (!formId || operation === undefined) {
      return NextResponse.json(
        { error: 'Form ID and operation are required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/ppi/enable-form', {
      method: 'POST',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: { formId, isFormEnabled, operation, formType, responderUrl }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to enable form', success: false, details },
      { status }
    )
  }
}
