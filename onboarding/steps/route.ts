import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { user } = await getServerUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { user_id, ...stepData } = body

    // Verify the user_id matches the authenticated user
    if (user.uid !== user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate that at least one step is being updated
    const stepFields = Object.keys(stepData).filter(
      (key) => key.startsWith('step_') && key.endsWith('_completed')
    )
    if (stepFields.length === 0) {
      return NextResponse.json(
        { error: 'No step data provided' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/onboarding/steps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { user_id, ...stepData }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to update onboarding steps', details },
      { status }
    )
  }
}
