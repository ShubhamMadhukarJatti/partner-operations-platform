import { NextResponse } from 'next/server'
import { fetchconnectedApps } from '@/services/organizations'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { getGoogleSheetMetadata } from '@/lib/db/sheets'
import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const spreadsheetId = searchParams.get('spreadsheetId')

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'spreadsheetId query parameter is required' },
        { status: 400 }
      )
    }

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

    const metadata = await getGoogleSheetMetadata(spreadsheetId, token)
    const sheetsList = metadata?.sheets || []

    const sheets = sheetsList.map((sh: any) => ({
      properties: {
        sheetId: sh.properties?.sheetId,
        title: sh.properties?.title
      }
    }))

    return NextResponse.json({ sheets })
  } catch (error: any) {
    console.error('Error in GET /api/integrations/google-sheets/tabs:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
