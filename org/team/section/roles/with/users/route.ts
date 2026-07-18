import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    const data = await fetcher<{
      success?: boolean
      message?: string
      data?: unknown[]
    }>('/api/org/team/section/roles/with/users', {
      method: 'GET',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/json'
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to fetch roles with users'
    return NextResponse.json({ success: false, message, data: [] }, { status })
  }
}
