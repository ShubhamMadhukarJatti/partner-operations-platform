import { NextResponse } from 'next/server'

import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  console.log('🔍 External Salesforce OAuth callback started')

  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const state = url.searchParams.get('state')

  console.log('📋 URL parameters (external callback):', {
    code: code ? '***' : null,
    error,
    state: state ? '***' : null
  })

  if (error) {
    console.log('❌ OAuth error received (external):', error)
    const base = process.env.NEXT_PUBLIC_BASE_URL || ''
    const redirectUrl = `${base}/integrations?error=${encodeURIComponent(error)}`
    return NextResponse.redirect(redirectUrl)
  }

  if (!code) {
    console.log('❌ Missing authorization code (external)')
    return NextResponse.json(
      { error: 'Missing code parameter' },
      { status: 400 }
    )
  }

  // Validate required env vars for external Salesforce app
  const clientId = process.env.NEXT_PUBLIC_EXTERNAL_SALESFORCE_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_EXTERNAL_SALESFORCE_CLIENT_SECRET
  const redirectUri =
    process.env.NEXT_PUBLIC_EXTERNAL_SALESFORCE_REDIRECT_URL ?? ''
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  console.log('🔧 External Salesforce env check:', {
    clientId: clientId ? '***' : 'MISSING',
    clientSecret: clientSecret ? '***' : 'MISSING',
    redirectUri: redirectUri ? '***' : 'MISSING',
    baseUrl: baseUrl ? '***' : 'MISSING'
  })

  if (!clientId || !clientSecret || !redirectUri || !baseUrl) {
    return NextResponse.json(
      { error: 'External Salesforce env not configured correctly' },
      { status: 500 }
    )
  }

  const { token, user } = await getServerUser()
  const userId = (user as any)?.uid

  if (!token || !userId) {
    console.error(
      '❌ Missing user/token in external Salesforce callback',
      !!token,
      !!userId
    )
    return NextResponse.json(
      { error: 'User session not found' },
      { status: 401 }
    )
  }

  const tokenUrl = 'https://login.salesforce.com/services/oauth2/token'

  const data = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code
  })

  try {
    console.log('🚀 Exchanging Salesforce auth code for tokens (external)')
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data.toString()
    })

    const responseData = await response.json()
    console.log(
      '📥 External Salesforce token exchange status:',
      response.status,
      'data:',
      responseData
    )

    if (!response.ok) {
      console.error(
        '❌ External Salesforce token exchange failed:',
        response.status,
        responseData
      )
      return NextResponse.json(
        {
          error:
            responseData.error ||
            responseData.error_description ||
            'Failed to fetch Salesforce tokens'
        },
        { status: 500 }
      )
    }

    const { access_token, refresh_token } = responseData

    if (!refresh_token) {
      console.error(
        '❌ External Salesforce response missing refresh_token:',
        responseData
      )
      return NextResponse.json(
        { error: 'Missing Salesforce refresh token' },
        { status: 500 }
      )
    }

    console.log('✅ External Salesforce tokens received:', {
      accessToken: access_token ? '***' : 'MISSING',
      refreshToken: refresh_token ? '***' : 'MISSING'
    })

    // Use the new no-auth integration API to save the integration
    const integrationPayload = {
      organizationId: null,
      refreshToken: refresh_token,
      integrationType: 'SALESFORCE',
      isConnected: true,
      userId,
      connectedId: '',
      publishableKey: ''
    }

    const integrationsUrl = new URL(
      '/api/no/auth/organization/integration',
      baseUrl
    )

    console.log('📤 Saving external Salesforce integration via:', {
      url: integrationsUrl.toString(),
      payload: {
        ...integrationPayload,
        refreshToken: integrationPayload.refreshToken ? '***' : 'MISSING'
      }
    })

    const saveRes = await fetch(integrationsUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(integrationPayload)
    })

    const saveData = await saveRes.json().catch(() => ({}))
    console.log(
      '📥 External Salesforce integration save status:',
      saveRes.status,
      'data:',
      saveData
    )

    if (!saveRes.ok) {
      console.error(
        '❌ Failed to save external Salesforce integration',
        saveData
      )
      return NextResponse.json(
        {
          error:
            (saveData && (saveData.message || saveData.error)) ||
            'Failed to save integration'
        },
        { status: 500 }
      )
    }

    // Redirect back to the appropriate UI based on state
    let redirectUrl = `${baseUrl}/integrations?success=salesforce_connected`
    if (state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state))
        if (stateData?.source === 'my-data-flow') {
          redirectUrl = `${baseUrl}/my-data/connect-service/salesforce`
        } else if (stateData?.source === 'partner-portal-flow') {
          redirectUrl = `${baseUrl}/partner-portal/partner-mapping/connect-service/salesforce`
        }
      } catch (e) {
        console.warn(
          '⚠️ Failed to parse state in external Salesforce callback',
          e
        )
      }
    }

    console.log(
      '🔄 Redirecting after external Salesforce connect to:',
      redirectUrl
    )
    return NextResponse.redirect(redirectUrl)
  } catch (e) {
    console.error('💥 Error during external Salesforce OAuth callback:', e)
    return NextResponse.json(
      { error: 'Failed to connect to Salesforce (external)' },
      { status: 500 }
    )
  }
}
