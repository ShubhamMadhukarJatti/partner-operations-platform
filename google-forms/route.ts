import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

import { INTEGRATIONS } from '@/lib/constants/integrations'
import { getFormsAccessToken } from '@/lib/db/forms'
import { fetchconnectedApps } from '@/lib/db/organization'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.nextUrl)
    const formId = url.searchParams.get('formId')

    const connectedApps = await fetchconnectedApps()
    const refreshToken = connectedApps.find(
      (app: any) => app?.integrationType === INTEGRATIONS.GOOGLE_FORM
    )?.refreshToken

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Google Forms refresh token is missing' },
        { status: 400 }
      )
    }

    // Get access token using refresh token
    const accessToken = await getFormsAccessToken(refreshToken)

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Failed to obtain access token' },
        { status: 400 }
      )
    }

    // Create OAuth2 client with your Google credentials
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    // Set the access token to OAuth2 client
    oauth2Client.setCredentials({ access_token: accessToken })

    // Use the Google Forms API to fetch data
    const forms = google.forms({ version: 'v1', auth: oauth2Client })

    let response
    if (formId) {
      // Get specific form data
      response = await forms.forms.get({
        formId: formId
      })
    } else {
      // For listing forms, we need to use Google Drive API
      // Since we don't have Drive API scope, we'll return an error
      return NextResponse.json(
        {
          success: false,
          error:
            'Form ID is required. Google Forms API does not support listing all forms without Drive API access.'
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: response.data
    })
  } catch (error: any) {
    console.error('Google Forms API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch Google Forms data'
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { formId } = body

    if (!formId) {
      return NextResponse.json(
        { success: false, error: 'Form ID is required' },
        { status: 400 }
      )
    }

    const connectedApps = await fetchconnectedApps()
    const refreshToken = connectedApps.find(
      (app: any) => app?.integrationType === INTEGRATIONS.GOOGLE_FORM
    )?.refreshToken

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Google Forms refresh token is missing' },
        { status: 400 }
      )
    }

    // Get access token using refresh token
    const accessToken = await getFormsAccessToken(refreshToken)

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Failed to obtain access token' },
        { status: 400 }
      )
    }

    // Create OAuth2 client with your Google credentials
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    // Set the access token to OAuth2 client
    oauth2Client.setCredentials({ access_token: accessToken })

    // Use the Google Forms API to fetch form responses
    const forms = google.forms({ version: 'v1', auth: oauth2Client })

    const response = await forms.forms.responses.list({
      formId: formId
    })

    return NextResponse.json({
      success: true,
      data: response.data
    })
  } catch (error: any) {
    console.error('Google Forms API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch Google Forms responses'
      },
      { status: 500 }
    )
  }
}
