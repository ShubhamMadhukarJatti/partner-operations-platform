import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { user } = await getServerUser()
    const body = await request.json()
    const { partnerOrgId } = body
    const userId = body.userId ?? user?.uid ?? null

    if (!partnerOrgId) {
      return NextResponse.json(
        { error: 'Partner organization ID is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      '/organizationCollaboration/save/assignment',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { userId, partnerOrgId: Number(partnerOrgId) }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errMsg =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to save assignment'
    return NextResponse.json({ error: errMsg }, { status })
  }
}
