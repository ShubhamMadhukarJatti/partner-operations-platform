import { NextRequest, NextResponse } from 'next/server'

import { fetchconnectedApps } from '@/lib/db/organization'
import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const organizationId = request.nextUrl.searchParams.get('organizationId')
    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Missing organizationId parameter' },
        { status: 400 }
      )
    }

    const connectedApps = await fetchconnectedApps()
    const pipedriveApp = connectedApps.find(
      (app: any) =>
        app.integrationType === 'PIPEDRIVE' &&
        app.organizationId === parseInt(organizationId)
    )

    if (!pipedriveApp || !pipedriveApp.accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Pipedrive integration not found or not connected'
        },
        { status: 400 }
      )
    }

    const data = await fetcher<{
      fields?: unknown
      data?: unknown
      totalFields?: number
    }>(
      `/integration/pipedrive/fields?organizationId=${encodeURIComponent(organizationId)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    return NextResponse.json({
      success: true,
      fields: data.fields ?? data.data ?? data,
      totalFields: data.totalFields ?? 0
    })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errMsg =
      error?.response?.data?.message ?? 'Failed to fetch Pipedrive fields'
    return NextResponse.json({ success: false, error: errMsg }, { status })
  }
}
