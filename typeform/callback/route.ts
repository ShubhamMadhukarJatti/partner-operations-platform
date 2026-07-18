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
    // Exchange the code for an access token using Typeform's OAuth endpoint
    const response = await fetch('https://api.typeform.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_TYPEFORM_CLIENT_ID || '',
        client_secret: process.env.TYPEFORM_CLIENT_SECRET || '',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_TYPEFORM_REDIRECT_URL || ''
      })
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error_description || 'Failed to fetch access token')
    }

    const updatePayload = {
      organizationId: organization.id,

      refreshToken: data.access_token,
      integrationType: 'TYPEFORM'
    }

    // Update your backend with the Typeform credentials
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?app=TYPEFORM`
    )
  } catch (error: any) {
    console.log({ TypeformError: error })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
