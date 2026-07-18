import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * PUT /api/organization/resources/{id}
 * Proxies resource updates to the authenticated backend endpoint.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { message: 'Route parameter id is required' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const data = await fetcher<unknown>(
      `/api/v1/org-resources/${encodeURIComponent(params.id)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/hal+json'
        },
        data: body
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to update resource', details },
      { status }
    )
  }
}

/**
 * DELETE /api/organization/resources/{id}
 * Proxies resource deletion to the authenticated backend endpoint.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { message: 'Route parameter id is required' },
        { status: 400 }
      )
    }

    await fetcher<unknown>(
      `/api/v1/org-resources/${encodeURIComponent(params.id)}`,
      {
        method: 'DELETE',
        headers: { accept: 'application/hal+json' }
      }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to delete resource', details },
      { status }
    )
  }
}
