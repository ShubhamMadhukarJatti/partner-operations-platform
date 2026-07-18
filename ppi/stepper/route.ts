import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const payload = {
      stepOneCompleted: body.stepOneCompleted ?? false,
      stepTwoCompleted: body.stepTwoCompleted ?? false,
      stepThreeCompleted: body.stepThreeCompleted ?? false,
      stepFourCompleted: body.stepFourCompleted ?? false
    }
    const data = await fetcher<unknown>('/ppi/stepper', {
      method: 'PUT',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: payload
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to update stepper', details },
      { status }
    )
  }
}
