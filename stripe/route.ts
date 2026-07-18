import { NextResponse } from 'next/server'

import { generateSecureRandomString } from '@/lib/utils'

export async function GET() {
  const stripeOAuthURL = new URL('https://connect.stripe.com/oauth/authorize')

  // Set required Stripe OAuth parameters
  stripeOAuthURL.searchParams.set(
    'client_id',
    process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID || ''
  )
  stripeOAuthURL.searchParams.set('response_type', 'code')
  stripeOAuthURL.searchParams.set('scope', 'read_write')

  // Add redirect URI if needed
  stripeOAuthURL.searchParams.set(
    'redirect_uri',
    process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URL || ''
  )

  // Generate and set state parameter for security
  stripeOAuthURL.searchParams.set('state', generateSecureRandomString())

  return NextResponse.redirect(stripeOAuthURL.toString(), 302)
}
