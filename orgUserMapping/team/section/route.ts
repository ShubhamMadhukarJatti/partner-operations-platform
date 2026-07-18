import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/orgUserMapping/team/section?organizationId=${organizationId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    // TEMP DEBUG
    try {
      require('fs').writeFileSync(
        '/tmp/debug_team_section.json',
        JSON.stringify(data, null, 2)
      )
      require('fs').writeFileSync(
        '/tmp/debug_team_section_orgId.txt',
        `Requested orgId: ${organizationId}`
      )
    } catch (e) {}

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      {
        error:
          (typeof details === 'object' && details?.message) ||
          'Failed to fetch team section data',
        details
      },
      { status }
    )
  }
}
