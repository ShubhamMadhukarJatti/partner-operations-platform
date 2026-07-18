import { NextResponse } from 'next/server'

import { getCurrentOrganization } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const accountServer = url.searchParams.get('accounts-server')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  const { token } = await getServerUser()
  const org = await getCurrentOrganization()

  if (error) {
    // Handle errors if the user denies permissions
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?error=access_denied`
    )
  }

  if (!code) {
    return NextResponse.json(
      { error: 'Missing code parameter' },
      { status: 400 }
    )
  }

  const token_url = `${accountServer}/oauth/v2/token`
  // const token_url = 'https://accounts.zoho.com/oauth/v2/token'

  const data = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: (process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID ?? '')
      .trim()
      .replace(/\+/g, ''),
    client_secret: process.env.NEXT_PUBLIC_ZOHO_CLIENT_SECRET ?? '',
    redirect_uri: process.env.NEXT_PUBLIC_ZOHO_REDIRECTION_URL ?? '',
    code
  })

  try {
    // Exchange the code for an access token
    const response = await fetch(token_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data.toString()
    })

    const responseData = await response.json()

    if (!responseData.access_token) {
      throw new Error(responseData.error || 'Failed to fetch access token')
    }

    const { access_token, refresh_token, api_domain } = responseData

    const updatePayload = {
      organizationId: org.id,
      refreshToken: refresh_token,
      integrationType: 'ZOHO',
      publishableKey: accountServer
    }

    console.log(updatePayload)

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

    if (!backendResponse.ok && backendResponse.status !== 307) {
      const errorResponse = await backendResponse.json()
      return NextResponse.json({ errorResponse }, { status: 500 })
    }

    // Update Zoho Webhook Details
    const webhookPayload = {
      organizationId: org.id,
      apiDomain: api_domain || ''
    }

    console.log('[ZOHO WEBHOOK] Updating details:', webhookPayload)

    try {
      const webhookResponse = await fetch(
        `${process.env.SHARKDOM_API_URL}/organization/zoho/webhook-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(webhookPayload)
        }
      )

      if (!webhookResponse.ok) {
        console.error(
          '[ZOHO WEBHOOK] Failed to update webhook details:',
          await webhookResponse.text()
        )
      }
    } catch (webhookError) {
      console.error(
        '[ZOHO WEBHOOK] Exception updating webhook details:',
        webhookError
      )
    }

    let redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?app=ZOHO`
    if (state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state))
        if (stateData?.source === 'my-data-flow') {
          redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/my-data/connect-service/zoho`
        } else if (stateData?.source === 'partner-portal-flow') {
          redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/partner-portal/partner-mapping/connect-service/zoho`
        } else if (stateData?.source === 'customer-insights-flow') {
          redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/my-data/customer-insights`
        } else if (
          stateData?.source === 'integration-drawer' ||
          stateData?.source === 'integration-card'
        ) {
          redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?app=ZOHO`
        }
      } catch {
        // Keep default redirect if state parsing fails
      }
    }
    return NextResponse.redirect(redirectUrl)
  } catch (error: any) {
    console.log({ error })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
