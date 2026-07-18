import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { isClick, isSubmit, formId, formType, orgId } = body

    if (!formId || formType === undefined) {
      return NextResponse.json(
        { error: 'Form ID and Form Type are required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/ppi/counter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: {
        isClick: isClick || false,
        isSubmit: isSubmit || false,
        formId,
        formType,
        orgId: orgId || null
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to update counter', details },
      { status }
    )
  }
}
