import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

type UpdatePermissionsPayload = {
  permissionCodes?: string[]
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> }
) {
  try {
    const { roleId } = await params
    if (!roleId) {
      return NextResponse.json(
        { success: false, message: 'Role ID is required.' },
        { status: 400 }
      )
    }

    const body = (await request
      .json()
      .catch(() => ({}))) as UpdatePermissionsPayload
    const permissionCodes = Array.isArray(body?.permissionCodes)
      ? body.permissionCodes.filter((p): p is string => typeof p === 'string')
      : []

    const result = await fetcher<unknown>(
      `/api/org/team/section/roles/${roleId}/permissions`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/hal+json',
          'Content-Type': 'application/json'
        },
        data: { permissionCodes }
      }
    )
    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to update role permissions'
    return NextResponse.json({ success: false, message }, { status })
  }
}
