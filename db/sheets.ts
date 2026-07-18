import { getCurrentOrganization, Postintegrationdata } from './organization'

export const getSheetsAccessToken = async (refresh_token: string) => {
  try {
    console.log('Getting Google Sheets access token...')

    const payloadData = {
      grant_type: 'refresh_token',
      client_id:
        process.env.GOOGLE_CLIENT_ID ||
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        '',
      client_secret:
        process.env.GOOGLE_CLIENT_SECRET ||
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ||
        '',
      refresh_token
    }

    const response = await fetch(`https://oauth2.googleapis.com/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(payloadData).toString()
    })

    const tokenResponse = await response.json()
    console.log('Google Sheets token response:', {
      hasAccessToken: !!tokenResponse.access_token,
      hasRefreshToken: !!tokenResponse.refresh_token,
      error: tokenResponse.error
    })

    if (tokenResponse.error) {
      throw new Error(`Google OAuth error: ${tokenResponse.error}`)
    }

    const accessToken = tokenResponse.access_token
    if (!accessToken) {
      throw new Error('No access token received from Google')
    }

    // Store new refresh token if provided
    if (tokenResponse?.refresh_token) {
      console.log('-----Google Sheets: New Token Received---')

      const { id } = await getCurrentOrganization()

      const updatePayload = {
        organizationId: id,
        refreshToken: tokenResponse?.refresh_token,
        integrationType: 'G_SHEET'
      }

      console.log('Storing Google Sheets refresh token:', {
        organizationId: id,
        integrationType: 'G_SHEET'
      })

      const res = await Postintegrationdata(JSON.stringify(updatePayload))
      console.log('-----Google Sheets: Updated Postintegrationdata---', res)
    }

    return accessToken
  } catch (error) {
    console.error('Error getting Google Sheets access token:', error)
    throw error
  }
}

export const getGoogleSheetsDiscoverData = async (
  refreshToken: string,
  userToken: string
) => {
  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/api/partner-mapping/google-sheets/discover`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({ refreshToken })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error fetching Google Sheets discover data:', errorText)
      throw new Error(`Discover API error: ${errorText}`)
    }

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch discover data')
    }

    return data.data
  } catch (error) {
    console.error('Error in getGoogleSheetsDiscoverData:', error)
    throw error
  }
}

export const getGoogleSheetsFiles = async (userToken: string) => {
  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/api/v1/integration/google-sheets/files`,
      {
        method: 'GET',
        headers: {
          accept: 'application/hal+json',
          Authorization: `Bearer ${userToken}`
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error fetching Google Sheets files:', errorText)
      throw new Error(`Google Sheets files API error: ${errorText}`)
    }

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch Google Sheets files')
    }

    return data.data
  } catch (error) {
    console.error('Error in getGoogleSheetsFiles:', error)
    throw error
  }
}

export const getGoogleSheetMetadata = async (
  spreadsheetId: string,
  userToken: string
) => {
  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/api/v1/integration/google-sheets/files/${spreadsheetId}/sheets`,
      {
        method: 'GET',
        headers: {
          accept: 'application/hal+json',
          Authorization: `Bearer ${userToken}`
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `Error fetching Google Sheets metadata for ${spreadsheetId}:`,
        errorText
      )
      throw new Error(`Google Sheets metadata API error: ${errorText}`)
    }

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch spreadsheet metadata')
    }

    return data.data
  } catch (error) {
    console.error('Error in getGoogleSheetMetadata:', error)
    throw error
  }
}

export const getGoogleSheetColumns = async (
  spreadsheetId: string,
  sheetName: string,
  userToken: string
) => {
  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/api/v1/integration/google-sheets/files/${spreadsheetId}/sheets/${encodeURIComponent(sheetName)}/columns`,
      {
        method: 'GET',
        headers: {
          accept: 'application/hal+json',
          Authorization: `Bearer ${userToken}`
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `Error fetching Google Sheets columns for ${spreadsheetId} tab ${sheetName}:`,
        errorText
      )
      throw new Error(`Google Sheets columns API error: ${errorText}`)
    }

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch sheet columns')
    }

    return data.data
  } catch (error) {
    console.error('Error in getGoogleSheetColumns:', error)
    throw error
  }
}

export const getGoogleSheetData = async (
  spreadsheetId: string,
  sheetName: string,
  userToken: string
) => {
  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/api/v1/integration/google-sheets/files/${spreadsheetId}/sheets/${encodeURIComponent(sheetName)}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/hal+json',
          Authorization: `Bearer ${userToken}`
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `Error fetching Google Sheets data for ${spreadsheetId} tab ${sheetName}:`,
        errorText
      )
      throw new Error(`Google Sheets data API error: ${errorText}`)
    }

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch sheet data')
    }

    return data.data
  } catch (error) {
    console.error('Error in getGoogleSheetData:', error)
    throw error
  }
}
