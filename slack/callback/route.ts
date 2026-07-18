import { NextResponse } from 'next/server'

import { getCurrentOrganization } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const { user, token } = await getServerUser()
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

  try {
    // Exchange the code for an access token
    const response = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID || '',
        client_secret: process.env.SLACK_CLIENT_SECRET || '',
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL || ''
      })
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.error || 'Failed to fetch access token')
    }

    console.log({ SlackData: data })
    const { access_token, team, authed_user } = data

    // Save the access token to your backend

    const updatePayload = {
      organizationId: org.id,
      refreshToken: access_token,
      integrationType: 'SLACK',
      userId: user?.uid
    }

    const backendResponse = await fetch(
      `${process.env.SHARKDOM_API_URL}/user/slack/token`,
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
      return NextResponse.json(
        { errorResponse, access_token, user },
        { status: 500 }
      )
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?app=SLACK`
    )
  } catch (error: any) {
    console.log({ SlackError: error })

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
