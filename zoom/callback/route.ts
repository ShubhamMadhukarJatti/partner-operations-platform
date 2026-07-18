import { NextResponse } from 'next/server'

import { getCurrentOrganization } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const { token } = await getServerUser()
  const org = await getCurrentOrganization()
  const clientId = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_ZOOM_CLIENT_SECRET
  const redirectUri = process.env.NEXT_PUBLIC_ZOOM_REDIRECT_URL ?? ''

  if (error) {
    // Handle errors if the user denies permissions
    return NextResponse.redirect(
      'https://sharkdom.com/integrations?error=access_denied'
    )
  }

  if (!code) {
    return NextResponse.json(
      { error: 'Missing code parameter' },
      { status: 400 }
    )
  }

  try {
    // Exchange the code for an access token
    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    })

    const data = await response.json()

    console.log(data)

    if (!data.access_token) {
      throw new Error(data.error || 'Failed to fetch access token')
    }

    const { access_token, refresh_token } = data

    const updatePayload = {
      organizationId: org.id,
      refreshToken: refresh_token,
      integrationType: 'ZOOM'
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?app=ZOOM`
    )
  } catch (error: any) {
    console.log({ error })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
