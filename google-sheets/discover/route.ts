import { NextRequest, NextResponse } from 'next/server'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { fetchconnectedApps } from '@/lib/db/organization'
import { getGoogleSheetsFiles } from '@/lib/db/sheets'
import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const connectedApps = await fetchconnectedApps()
    const refreshToken = connectedApps.find(
      (app: any) => app?.integrationType === INTEGRATIONS.GOOGLE_SHEET
    )?.refreshToken

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token is missing' },
        { status: 400 }
      )
    }

    const { token } = await getServerUser()
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'User token is missing' },
        { status: 401 }
      )
    }

    const result = await getGoogleSheetsFiles(token)
    const files = result?.files || []
    const spreadsheets = files.map((f: any) => ({
      id: f.id,
      name: f.name
    }))

    return NextResponse.json(
      { success: true, data: { spreadsheets } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in GET /api/google-sheets/discover:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
