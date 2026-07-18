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

  const token_url = `https://auth.calendly.com/oauth/token`
  // const token_url = 'https://accounts.zoho.com/oauth/v2/token'

  const data = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID ?? '',
    client_secret: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_SECRET ?? '',
    redirect_uri: process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URL ?? '',
    code
  })

  try {
    // Exchange the code for an access token
    const response = await fetch(token_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    if (!responseData.access_token) {
      throw new Error(responseData.error || 'Failed to fetch access token')
    }

    const { access_token, refresh_token } = responseData

    console.log({ access_token, refresh_token })

    const userResponse = await fetch('https://api.calendly.com/users/me', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    const userData = await userResponse.json()

    if (!userData.resource?.uri) {
      throw new Error(userData.error || 'Failed to fetch user Data')
    }

    const user_uri = userData.resource.uri

    console.log({ user_uri })
    // Get event types
    const eventTypesResponse = await fetch(
      `https://api.calendly.com/event_types?user=${encodeURIComponent(user_uri)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )

    const eventTypes = await eventTypesResponse.json()

    if (!eventTypes.collection || eventTypes.collection.length === 0) {
      throw new Error(eventTypes.error || 'Failed to fetch events')
    }

    const firstEvent = eventTypes.collection[0]
    const booking_url = firstEvent.scheduling_url

    const updatePayload = {
      organizationId: org.id,
      refreshToken: refresh_token,
      integrationType: 'CALENDLY',
      publishableKey: booking_url
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

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}${'/integrations?app=CALENDLY'}`
    )
  } catch (error: any) {
    console.log({ error })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
