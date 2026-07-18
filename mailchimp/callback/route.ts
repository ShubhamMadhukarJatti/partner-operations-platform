import { NextResponse } from 'next/server'

import { getCurrentOrganization } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const { user, token } = await getServerUser()

  const organization = await getCurrentOrganization()

  if (error) {
    // Handle errors if the user denies permissions
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?error=access_denied`
    )
  }

  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code' },
      { status: 400 }
    )
  }

  try {
    // Exchange the code for an access token using MailChimp's OAuth endpoint
    const response = await fetch('https://login.mailchimp.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_MAILCHIMP_CLIENT_ID || '',
        client_secret: process.env.MAILCHIMP_CLIENT_SECRET || '',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_MAILCHIMP_REDIRECT_URL || ''
      })
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error_description || 'Failed to fetch access token')
    }

    // After getting the access token, get the MailChimp API endpoint for this user
    const metadataResponse = await fetch(
      'https://login.mailchimp.com/oauth2/metadata',
      {
        headers: {
          Authorization: `OAuth ${data.access_token}`
        }
      }
    )

    const metadata = await metadataResponse.json()

    const updatePayload = {
      organizationId: organization.id,
      refreshToken: data.access_token,
      integrationType: 'MAILCHIMP'
      //   metadata: {
      //     dc: metadata.dc, // Save the data center prefix for API calls
      //     api_endpoint: metadata.api_endpoint,
      //     login_url: metadata.login_url
      //   }
    }

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

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?app=MAILCHIMP`
    )
  } catch (error: any) {
    console.log({ MailChimpError: error })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
