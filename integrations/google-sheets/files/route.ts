import { NextResponse } from 'next/server'
import { fetchconnectedApps } from '@/services/organizations'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { getGoogleSheetsFiles } from '@/lib/db/sheets'
import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const apps = await fetchconnectedApps()

    // Check if the user is connected to Google Sheets
    const googleSheetApp = apps.find(
      (app: any) =>
        app.integrationType === 'G_SHEET' ||
        app.integrationType === INTEGRATIONS.GOOGLE_SHEET
    )

    if (!googleSheetApp?.refreshToken) {
      return NextResponse.json(
        { error: 'Google Sheets is not connected or refresh token is missing' },
        { status: 401 }
      )
    }

    const { token } = await getServerUser()
    if (!token) {
      return NextResponse.json(
        { error: 'User token is missing' },
        { status: 401 }
      )
    }

    const result = await getGoogleSheetsFiles(token)
    const backendFiles = result?.files || []
    const files = backendFiles.map((f: any) => ({
      id: f.id,
      name: f.name
    }))

    return NextResponse.json({ files })
  } catch (error: any) {
    console.error('Error in GET /api/integrations/google-sheets/files:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
