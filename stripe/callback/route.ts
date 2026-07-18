import { NextResponse } from 'next/server'

import { getCurrentOrganization } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const { user, token } = await getServerUser()

  console.log(url)

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
    const redirectUrls = {
      integrations: 'https://dev.sharkdom.com/integrations?app=STRIPE',
      'create-deals': 'https://dev.sharkdom.com/deals/create-deals'
    }

    // Exchange the code for an access token using Stripe's OAuth endpoint
    const response = await fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_secret: process.env.STRIPE_SECRET_KEY || '',
        code: code,
        grant_type: 'authorization_code'
      })
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error_description || 'Failed to fetch access token')
    }

    const updatePayload = {
      organizationId: organization.id,
      refreshToken: data.refresh_token,
      connectedId: data.stripe_user_id,
      publishableKey: data.stripe_publishable_key,
      userId: user?.uid
    }

    const backendResponse = await fetch(
      `${process.env.SHARKDOM_API_URL}/deals/connectStripe`,
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?app=STRIPE`
    )
  } catch (error: any) {
    console.log({ StripeError: error })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
