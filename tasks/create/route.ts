import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const organizationId = body.organization_id ?? body.organizationId
    const externalPartnerId = body.external_partner_id ?? body.externalPartnerId

    const backendPayload = {
      ...body,
      organizationId,
      organization_id: organizationId,
      externalPartnerId,
      external_partner_id: externalPartnerId
    }

    const path = organizationId
      ? `/tasks?organizationId=${organizationId}`
      : '/tasks'
    const data = await fetcher<unknown>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: backendPayload
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to create task', details },
      { status }
    )
  }
}
