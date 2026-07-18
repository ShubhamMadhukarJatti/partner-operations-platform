import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/organization/certifications/{id}
 * Proxies organization certification detail lookup.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { message: 'Route parameter id is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/api/v1/org-certifications/${encodeURIComponent(params.id)}`,
      {
        method: 'GET',
        headers: { accept: 'application/json' }
      }
    )

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch certification', details },
      { status }
    )
  }
}

/**
 * DELETE /api/organization/certifications/{id}
 * Proxies organization certification deletion.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { message: 'Route parameter id is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/api/v1/org-certifications/${encodeURIComponent(params.id)}`,
      {
        method: 'DELETE',
        headers: { accept: 'application/json' }
      }
    )

    return NextResponse.json(data ?? { success: true }, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to delete certification', details },
      { status }
    )
  }
}
