import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const personaMode =
      req.nextUrl.searchParams.get('personaMode') || 'HUBSPOT'
    const data = await fetcher<unknown>(
      `/ppi/persona/versions?personaMode=${encodeURIComponent(personaMode)}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch persona versions'
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    )
  }
}
