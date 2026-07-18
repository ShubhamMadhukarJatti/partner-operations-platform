import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const formId = searchParams.get('formId')
    const formType = searchParams.get('formType')

    if (!formId || !formType) {
      return NextResponse.json(
        { error: 'Form ID and Form Type are required' },
        { status: 400 }
      )
    }

    const path = `/ppi/fetchQuestionByFormId?formId=${formId}&formType=${formType}`
    const data = await fetcher<unknown>(path, {
      method: 'GET',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to fetch questions', details },
      { status }
    )
  }
}
