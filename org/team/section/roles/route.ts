import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

type CreateRolePayload = {
  name?: string
  description?: string
  permissionCodes?: string[]
}

export async function GET(_request: NextRequest) {
  try {
    const data = await fetcher<{
      success?: boolean
      message?: string
      data?: unknown[]
    }>('/api/org/team/section/roles', {
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
      'Failed to fetch organization roles'
    return NextResponse.json({ success: false, message, data: [] }, { status })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as CreateRolePayload
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const description =
      typeof body?.description === 'string' ? body.description : ''
    const permissionCodes = Array.isArray(body?.permissionCodes)
      ? body.permissionCodes.filter((p): p is string => typeof p === 'string')
      : []

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Role name is required.' },
        { status: 400 }
      )
    }

    if (permissionCodes.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one permission is required.' },
        { status: 400 }
      )
    }

    const result = await fetcher<unknown>('/api/org/team/section/roles', {
      method: 'POST',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: { name, description, permissionCodes }
    })
    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to create organization role'
    return NextResponse.json({ success: false, message }, { status })
  }
}
