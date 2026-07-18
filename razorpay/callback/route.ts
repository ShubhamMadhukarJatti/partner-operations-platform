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
    const response = await fetch('https://auth.razorpay.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_secret: process.env.RAZORPAY_SECRET_KEY || '',
        client_id: process.env.RAZORPAY_CLIENT_ID || '',
        code: code,
        redirect_uri: process.env.RAZORPAY_REDIRECT_URI || '',
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
      connectedId: data.razorpay_account_id,
      publishableKey: null,
      userId: user?.uid
    }

    const backendResponse = await fetch(
      `${process.env.SHARKDOM_API_URL}/deals/connectRazorpay`,
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/integrations?app=RAZORPAY`
    )
  } catch (error: any) {
    console.log({ RazorpayError: error })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
