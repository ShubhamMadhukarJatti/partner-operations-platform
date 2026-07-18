import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

type CreateSectionPayload = {
  name?: string
  description?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request
      .json()
      .catch(() => ({}))) as CreateSectionPayload
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const description =
      typeof body?.description === 'string' ? body.description : ''

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Role name is required.' },
        { status: 400 }
      )
    }

    const result = await fetcher<unknown>('/api/org/team/section/create', {
      method: 'POST',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: { name, description }
    })
    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to create role'
    return NextResponse.json({ success: false, message }, { status })
  }
}
