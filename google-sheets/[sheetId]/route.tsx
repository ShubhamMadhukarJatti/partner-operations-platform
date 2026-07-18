import { NextRequest, NextResponse } from 'next/server'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { fetchconnectedApps } from '@/lib/db/organization'
import { getGoogleSheetData, getGoogleSheetMetadata } from '@/lib/db/sheets'
import { getServerUser } from '@/lib/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { sheetId: string } }
) {
  console.log('sahil sheet testing ')
  try {
    const url = new URL(req.nextUrl)

    const { sheetId } = params
    const columns = url.searchParams.get('selectedColumns')

    // Split selected columns into an array if provided
    const selectedColumns = columns
      ? columns.split(',').map((col) => col.trim())
      : []

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

    const metadata = await getGoogleSheetMetadata(sheetId, token)
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

    const sheetData = await getGoogleSheetData(sheetId, resolvedTabName, token)
    const rows = sheetData?.values || []

    if (rows.length === 0) {
      console.log('No data found in the sheet.')
      return NextResponse.json(
        { success: false, error: 'No columns found!' },
        { status: 400 }
      )
    }

    // Extract the header row (first row) which contains the column names
    const headerRow = rows[0]

    // Get the indices of the selected columns
    const selectedIndices = selectedColumns.map((column) =>
      headerRow.indexOf(column)
    )

    if (selectedIndices.includes(-1)) {
      throw new Error(
        'One or more selected columns not found in the sheet headers'
      )
    }

    // Extract the selected columns for all rows
    const selectedData = rows.slice(1).map((row) => {
      return selectedIndices.map((index) => row[index] || null)
    })

    return NextResponse.json(
      { success: true, data: selectedData },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
