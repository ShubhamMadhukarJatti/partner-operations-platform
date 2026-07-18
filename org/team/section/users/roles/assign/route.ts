import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

type AssignRolesPayload = {
  userId?: string
  roleNames?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as AssignRolesPayload
    const userId = typeof body?.userId === 'string' ? body.userId.trim() : ''
    const roleNames = Array.isArray(body?.roleNames)
      ? body.roleNames.filter((r): r is string => typeof r === 'string')
      : []

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId is required.' },
        { status: 400 }
      )
    }

    if (roleNames.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one role name is required.' },
        { status: 400 }
      )
    }

    const result = await fetcher<{
      success?: boolean
      message?: string
      data?: string
    }>('/api/org/team/section/users/roles/assign', {
      method: 'POST',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: { userId, roleNames }
    })
    return NextResponse.json(result, { status: 200 })
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: { message?: string } }
      message?: string
    }
    const status = err?.response?.status ?? 500
    const message =
      err?.response?.data?.message ?? err?.message ?? 'Failed to assign roles'
    return NextResponse.json({ success: false, message }, { status })
  }
}
