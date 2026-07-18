import { NextResponse } from 'next/server'

import { getCurrentOrganization } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  console.log('🔍 Close CRM OAuth callback started')

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

  // State parameter is a simple hex string for security validation
  console.log('🔐 State parameter received:', state ? 'present' : 'missing')

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

  console.log('✅ Authorization code received, length:', code.length)

  // Log environment variables (masked for security)
  console.log('🔧 Environment variables check:')
  console.log(
    '  - NEXT_PUBLIC_CLOSE_CLIENT_ID:',
    process.env.NEXT_PUBLIC_CLOSE_CLIENT_ID ? '***' : 'MISSING'
  )
  console.log(
    '  - CLOSE_CLIENT_SECRET:',
    process.env.CLOSE_CLIENT_SECRET ? '***' : 'MISSING'
  )
  console.log(
    '  - NEXT_PUBLIC_CLOSE_REDIRECT_URI:',
    process.env.NEXT_PUBLIC_CLOSE_REDIRECT_URI ? '***' : 'MISSING'
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
  if (!process.env.NEXT_PUBLIC_CLOSE_CLIENT_ID) {
    console.error('❌ NEXT_PUBLIC_CLOSE_CLIENT_ID is missing')
    return NextResponse.json(
      { error: 'Close CRM client ID not configured' },
      { status: 500 }
    )
  }

  if (!process.env.CLOSE_CLIENT_SECRET) {
    console.error('❌ CLOSE_CLIENT_SECRET is missing')
    return NextResponse.json(
      { error: 'Close CRM client secret not configured' },
      { status: 500 }
    )
  }

  if (!process.env.NEXT_PUBLIC_CLOSE_REDIRECT_URI) {
    console.error('❌ NEXT_PUBLIC_CLOSE_REDIRECT_URI is missing')
    return NextResponse.json(
      { error: 'Close CRM redirect URI not configured' },
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

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.close.com/oauth2/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_CLOSE_CLIENT_ID as string,
        client_secret: process.env.CLOSE_CLIENT_SECRET as string,
        redirect_uri: process.env.NEXT_PUBLIC_CLOSE_REDIRECT_URI as string,
        code: code
      })
    })

    console.log('🔄 Token exchange response status:', tokenResponse.status)

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        body: errorText
      })
      throw new Error(`Token exchange failed: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    console.log('✅ Token exchange successful:', {
      access_token: tokenData.access_token ? '***' : null,
      refresh_token: tokenData.refresh_token ? '***' : null,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type
    })

    if (!tokenData.access_token) {
      console.error('❌ No access token in response')
      throw new Error('No access token received')
    }

    // Test the API connection with the access token
    const apiTestResponse = await fetch('https://api.close.com/api/v1/me/', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json'
      }
    })

    console.log('🧪 API test response status:', apiTestResponse.status)

    if (!apiTestResponse.ok) {
      const errorText = await apiTestResponse.text()
      console.error('❌ API test failed:', {
        status: apiTestResponse.status,
        statusText: apiTestResponse.statusText,
        body: errorText
      })
      throw new Error(`API test failed: ${apiTestResponse.status}`)
    }

    const userInfo = await apiTestResponse.json()
    console.log('✅ API test successful, user info:', {
      id: userInfo.id,
      email: userInfo.email,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name
    })

    const updatePayload = {
      organizationId: org.id,
      refreshToken: tokenData.refresh_token || tokenData.access_token,
      accessToken: tokenData.access_token,
      integrationType: 'CLOSE'
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

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?success=close_connected`
    console.log('🔄 Redirecting to:', redirectUrl)

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('💥 Error during Close CRM OAuth callback:', error)
    console.error(
      '💥 Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    )
    console.error(
      '💥 Error message:',
      error instanceof Error ? error.message : 'Unknown error'
    )

    return NextResponse.json(
      { error: 'Failed to connect to Close CRM' },
      { status: 500 }
    )
  }
}
