import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST body for creating a my-partner task — forwarded to the backend unchanged.
 *
 * @example
 * {
 *   "title": "string",
 *   "status": "Not Started",
 *   "stage": "Ideation",
 *   "targetType": "Revenue ($)",
 *   "startDate": "2026-04-02T06:01:51.988Z",
 *   "endDate": "2026-04-02T06:01:51.988Z",
 *   "ownerId": "string",
 *   "note": "string",
 *   "myPartnerId": 9007199254740991
 * }
 */
export type CreateMyPartnerTaskBody = {
  title: string
  status: string
  stage: string
  targetType: string
  startDate: string | null
  endDate: string | null
  ownerId: string
  note: string
  myPartnerId: number
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateMyPartnerTaskBody
    const data = await fetcher<unknown>(`/api/my-partner/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to create my-partner task', details },
      { status }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await fetcher<unknown>(`/my-partner/tasks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to update my-partner task', details },
      { status }
    )
  }
}
