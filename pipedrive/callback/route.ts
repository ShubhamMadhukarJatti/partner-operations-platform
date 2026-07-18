import { NextResponse } from 'next/server'

import { getCurrentOrganization } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  console.log('🔍 Pipedrive OAuth callback started')

  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const state = url.searchParams.get('state')

  console.log('📋 URL parameters:', {
    code: code ? '***' : null,
    error,
    state: state ? '***' : null
  })
  console.log('⏰ Callback received at:', new Date().toISOString())

  // Check if there's a timestamp in the state parameter to track code age
  let codeTimestamp = null
  if (state) {
    try {
      const stateData = JSON.parse(decodeURIComponent(state))
      codeTimestamp = stateData.timestamp
      console.log('⏰ Code timestamp from state:', codeTimestamp)
    } catch (e) {
      console.log('⚠️ Could not parse state parameter for timestamp')
    }
  }

  const { token } = await getServerUser()
  const org = await getCurrentOrganization()

  console.log('👤 User token:', token ? '***' : null)
  console.log('🏢 Organization:', { id: org?.id, name: org?.name })

  if (error) {
    console.log('❌ OAuth error received:', error)
    // Handle errors if the user denies permissions
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?error=access_denied`
    )
  }

  if (!code) {
    console.log('❌ Missing authorization code')
    return NextResponse.json(
      { error: 'Missing code parameter' },
      { status: 400 }
    )
  }

  // Validate authorization code format
  if (code.length < 10) {
    console.log(
      '❌ Authorization code too short, likely malformed:',
      code.length
    )
    return NextResponse.json(
      { error: 'Invalid authorization code format' },
      { status: 400 }
    )
  }

  console.log(
    '✅ Authorization code received and validated, length:',
    code.length
  )

  // Check if authorization code is too old (OAuth codes typically expire in 10 minutes)
  if (codeTimestamp) {
    const codeAge = Date.now() - parseInt(codeTimestamp)
    const maxAge = 10 * 60 * 1000 // 10 minutes in milliseconds
    console.log(
      '⏰ Authorization code age:',
      Math.round(codeAge / 1000),
      'seconds'
    )

    if (codeAge > maxAge) {
      console.log(
        '⏰ Authorization code is too old, redirecting user to restart OAuth flow'
      )
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?error=code_expired&message=Authorization+code+expired.+Please+try+connecting+again.`
      )
    }
  }

  // Log environment variables (masked for security)
  console.log('🔧 Environment variables check:')
  console.log(
    '  - NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID:',
    process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID ? '***' : 'MISSING'
  )
  console.log(
    '  - NEXT_PUBLIC_PIPEDRIVE_CLIENT_SECRET:',
    process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_SECRET ? '***' : 'MISSING'
  )
  console.log(
    '  - NEXT_PUBLIC_PIPEDRIVE_REDIRECT_URL:',
    process.env.NEXT_PUBLIC_PIPEDRIVE_REDIRECT_URL ? '***' : 'MISSING'
  )
  console.log(
    '  - SHARKDOM_API_URL:',
    process.env.SHARKDOM_API_URL ? '***' : 'MISSING'
  )
  console.log(
    '  - NEXT_PUBLIC_BASE_URL:',
    process.env.NEXT_PUBLIC_BASE_URL ? '***' : 'MISSING'
  )

  // Validate required environment variables
  if (!process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID) {
    console.error('❌ NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID is missing')
    return NextResponse.json(
      { error: 'Pipedrive client ID not configured' },
      { status: 500 }
    )
  }

  if (!process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_SECRET) {
    console.error('❌ NEXT_PUBLIC_PIPEDRIVE_CLIENT_SECRET is missing')
    return NextResponse.json(
      { error: 'Pipedrive client secret not configured' },
      { status: 500 }
    )
  }

  if (!process.env.NEXT_PUBLIC_PIPEDRIVE_REDIRECT_URL) {
    console.error('❌ NEXT_PUBLIC_PIPEDRIVE_REDIRECT_URL is missing')
    return NextResponse.json(
      { error: 'Pipedrive redirect URL not configured' },
      { status: 500 }
    )
  }

  if (!process.env.SHARKDOM_API_URL) {
    console.error('❌ SHARKDOM_API_URL is missing')
    return NextResponse.json(
      { error: 'Backend API URL not configured' },
      { status: 500 }
    )
  }

  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.error('❌ NEXT_PUBLIC_BASE_URL is missing')
    return NextResponse.json(
      { error: 'Base URL not configured' },
      { status: 500 }
    )
  }

  const token_url = 'https://oauth.pipedrive.com/oauth/token'
  // Ensure redirect URI is exactly what Pipedrive expects
  const redirectUri = process.env.NEXT_PUBLIC_PIPEDRIVE_REDIRECT_URL ?? ''
  console.log('🔗 Redirect URI being used:', redirectUri)

  const data = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID ?? '',
    client_secret: process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_SECRET ?? '',
    redirect_uri: redirectUri,
    code
  })

  console.log('📤 Token exchange request data:', {
    grant_type: 'authorization_code',
    client_id: process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_ID ? '***' : 'MISSING',
    client_secret: process.env.NEXT_PUBLIC_PIPEDRIVE_CLIENT_SECRET
      ? '***'
      : 'MISSING',
    redirect_uri: process.env.NEXT_PUBLIC_PIPEDRIVE_REDIRECT_URL
      ? '***'
      : 'MISSING',
    code: code ? '***' : 'MISSING'
  })

  try {
    console.log('🚀 Making token exchange request to:', token_url)
    console.log('⏰ Token exchange started at:', new Date().toISOString())
    console.log(
      '⏰ Authorization code age check - code received and being used immediately'
    )

    // Exchange the code for an access token
    const response = await fetch(token_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data.toString()
    })

    console.log('📥 Token exchange response status:', response.status)
    console.log(
      '📥 Token exchange response headers:',
      Object.fromEntries(response.headers.entries())
    )

    const responseData = await response.json()
    console.log('📥 Token exchange response data:', responseData)

    if (!response.ok) {
      console.error('❌ Pipedrive API error:', response.status, responseData)

      // Handle specific OAuth errors with user-friendly redirects
      if (
        responseData.error === 'invalid_grant' &&
        responseData.message?.includes('expired')
      ) {
        console.log(
          '⏰ Authorization code expired, redirecting user to restart OAuth flow'
        )
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?error=code_expired&message=Authorization+code+expired.+Please+try+connecting+again.`
        )
      }

      if (responseData.error === 'invalid_grant') {
        console.log(
          '❌ Invalid grant error, redirecting user to restart OAuth flow'
        )
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?error=invalid_grant&message=Invalid+authorization.+Please+try+connecting+again.`
        )
      }

      throw new Error(
        `Pipedrive API error: ${response.status} - ${responseData.error || responseData.error_description || 'Unknown error'}`
      )
    }

    if (!responseData.access_token) {
      console.error('❌ No access token in response:', responseData)
      throw new Error(
        responseData.error ||
          responseData.error_description ||
          'Failed to fetch access token'
      )
    }

    const { access_token, refresh_token } = responseData
    console.log('✅ Access token received:', access_token ? '***' : 'MISSING')
    console.log('✅ Refresh token received:', refresh_token ? '***' : 'MISSING')

    const updatePayload = {
      organizationId: org.id,
      refreshToken: refresh_token,
      accessToken: access_token,
      integrationType: 'PIPEDRIVE'
    }

    console.log('📤 Backend integration payload:', {
      organizationId: updatePayload.organizationId,
      refreshToken: updatePayload.refreshToken ? '***' : 'MISSING',
      accessToken: updatePayload.accessToken ? '***' : 'MISSING',
      integrationType: updatePayload.integrationType
    })

    console.log(
      '🚀 Making backend integration request to:',
      `${process.env.SHARKDOM_API_URL}/organization/integration`
    )

    const backendResponse = await fetch(
      `${process.env.SHARKDOM_API_URL}/organization/integration`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(updatePayload)
      }
    )

    console.log('📥 Backend response status:', backendResponse.status)
    console.log(
      '📥 Backend response headers:',
      Object.fromEntries(backendResponse.headers.entries())
    )

    if (!backendResponse.ok && backendResponse.status !== 307) {
      const errorResponse = await backendResponse.json()
      console.error('❌ Backend integration failed:', errorResponse)
      return NextResponse.json({ errorResponse }, { status: 500 })
    }

    console.log('✅ Backend integration successful')

    // Save the integration details in your database
    // await saveIntegrationDetails(updatePayload)

    let redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?success=pipedrive_connected`
    if (state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state))
        if (stateData?.source === 'my-data-flow') {
          redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/my-data/connect-service/pipedrive`
        } else if (stateData?.source === 'partner-portal-flow') {
          redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/partner-portal/partner-mapping/connect-service/pipedrive`
        }
      } catch {
        // ignore state parse errors
      }
    }
    console.log('🔄 Redirecting to:', redirectUrl)

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('💥 Error during Pipedrive OAuth callback:', error)
    console.error(
      '💥 Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    )
    console.error(
      '💥 Error message:',
      error instanceof Error ? error.message : 'Unknown error'
    )

    return NextResponse.json(
      { error: 'Failed to connect to Pipedrive' },
      { status: 500 }
    )
  }
}
