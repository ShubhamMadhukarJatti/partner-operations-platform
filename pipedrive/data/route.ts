import { NextRequest, NextResponse } from 'next/server'

import { fetchconnectedApps } from '@/lib/db/organization'
import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const organizationId = sp.get('organizationId')
    const fields = sp.get('fields')
    const page = sp.get('page') || '0'
    const size = sp.get('size') || '20'

    if (!organizationId || !fields) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
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

    const path = `/integration/pipedrive/data?organizationId=${encodeURIComponent(organizationId)}&fields=${encodeURIComponent(fields)}&page=${page}&size=${size}`
    const data = await fetcher<any>(path, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    return NextResponse.json({
      success: true,
      data: data.results ?? data.data ?? data,
      totalElements: data.totalElements ?? 0
    })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errMsg =
      error?.response?.data?.message ?? 'Failed to fetch Pipedrive data'
    return NextResponse.json({ success: false, error: errMsg }, { status })
  }
}
