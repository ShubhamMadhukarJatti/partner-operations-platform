import { NextRequest, NextResponse } from 'next/server'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { fetchconnectedApps } from '@/lib/db/organization'
import { getGoogleSheetColumns, getGoogleSheetMetadata } from '@/lib/db/sheets'
import { getServerUser } from '@/lib/server'
import { getGoogleSheetIdFromUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.nextUrl)
    console.log('!!-- Request received for /google-sheets/columns')

    const sheetUrl = url.searchParams.get('sheetUrl')
    if (!sheetUrl)
      return NextResponse.json(
        { success: false, error: 'Please provide sheetUrl' },
        { status: 400 }
      )

    const connectedApps = await fetchconnectedApps()
    const refreshToken = connectedApps.find(
      (app: any) => app?.integrationType === INTEGRATIONS.GOOGLE_SHEET
    )?.refreshToken

    const spreadsheetId = getGoogleSheetIdFromUrl(sheetUrl) as string

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token is missing!' },
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

    const metadata = await getGoogleSheetMetadata(spreadsheetId, token)
    const sheetsList = metadata?.sheets || []

    if (sheetsList.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No sheet tab found' },
        { status: 400 }
      )
    }

    const sheetTabName =
      url.searchParams.get('tabName') || url.searchParams.get('sheetTabName')

    let resolvedTabName = ''
    if (sheetTabName) {
      const match = sheetsList.find(
        (sh: any) =>
          sh.properties?.title?.toLowerCase() === sheetTabName.toLowerCase()
      )
      resolvedTabName = match
        ? match.properties.title
        : sheetsList[0].properties?.title
    } else {
      resolvedTabName = sheetsList[0].properties?.title
    }

    if (!resolvedTabName) {
      return NextResponse.json(
        { success: false, error: 'Could not resolve sheet tab name' },
        { status: 400 }
      )
    }

    const columnsData = await getGoogleSheetColumns(
      spreadsheetId,
      resolvedTabName,
      token
    )
    const data = columnsData?.values?.[0] || []

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
