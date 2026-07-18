import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/partner-portal/connected-apps
 * Fetches connected CRMs/integrations via fetcher (auth from cookie).
 */
export async function GET() {
  try {
    const data = await fetcher<unknown>('/organization/integration', {
      method: 'GET',
      headers: { accept: 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch connected apps', details },
      { status }
    )
  }
}
