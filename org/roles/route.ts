import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

type OrgRoleItem = {
  roleId?: number
  name?: string
  description?: string
}

export async function GET(_request: NextRequest) {
  try {
    const data = await fetcher<{
      success?: boolean
      message?: string
      data?: OrgRoleItem[]
    }>('/api/org/team/section/org/roles', {
      method: 'GET',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/json'
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: unknown) {
    const err = error as {
      response?: { status?: number; data?: { message?: string } }
      message?: string
    }
    const status = err?.response?.status ?? 500
    const message =
      err?.response?.data?.message ??
      err?.message ??
      'Failed to fetch organization roles'
    return NextResponse.json({ success: false, message, data: [] }, { status })
  }
}
