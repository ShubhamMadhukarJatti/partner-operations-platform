import { NextResponse } from 'next/server'

import { generateSecureRandomString } from '@/lib/utils'

export async function GET() {
  const razorpayOAuthURL = new URL('https://auth.razorpay.com/authorize')

  razorpayOAuthURL.searchParams.set(
    'client_id',
    process.env.NEXT_PUBLIC_RAZORPAY_CLIENT_ID || ''
  )
  razorpayOAuthURL.searchParams.set('response_type', 'code')
  razorpayOAuthURL.searchParams.set('scope', 'read_only')

  razorpayOAuthURL.searchParams.set(
    'redirect_uri',
    process.env.NEXT_PUBLIC_RAZORPAY_REDIRECT_URL || ''
  )

  razorpayOAuthURL.searchParams.set('state', generateSecureRandomString())

  return NextResponse.redirect(razorpayOAuthURL.toString(), 302)
}
