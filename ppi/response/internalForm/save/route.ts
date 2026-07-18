import { NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { user } = await getServerUser()
    const body = await req.json()
    const { formId, orgId, responses } = body
    const userId = body.userId ?? user?.uid

    if (!formId || !responses) {
      return NextResponse.json(
        { error: 'Form ID and responses are required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/ppi/response/internalForm/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { formId, userId, orgId, responses }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      {
        error: 'Failed to save form response',
        details
      },
      { status }
    )
  }
}
