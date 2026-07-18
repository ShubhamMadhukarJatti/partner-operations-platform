import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId')
    const personaMode =
      req.nextUrl.searchParams.get('personaMode') || 'HUBSPOT'
    const version = req.nextUrl.searchParams.get('version') || '1'

    if (!orgId) {
      return NextResponse.json(
        { error: 'orgId is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/ppi/persona/version/data?orgId=${encodeURIComponent(orgId)}&personaMode=${encodeURIComponent(personaMode)}&version=${encodeURIComponent(version)}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch persona version data'
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    )
  }
}
