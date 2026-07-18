import { NextResponse } from 'next/server'

import { generateSecureRandomString } from '@/lib/utils'

export async function GET() {
  const mailchimpOAuthURL = new URL(
    'https://login.mailchimp.com/oauth2/authorize'
  )

  // Set required MailChimp OAuth parameters
  mailchimpOAuthURL.searchParams.set(
    'client_id',
    process.env.NEXT_PUBLIC_MAILCHIMP_CLIENT_ID || ''
  )
  mailchimpOAuthURL.searchParams.set('response_type', 'code')

  // Add redirect URI
  mailchimpOAuthURL.searchParams.set(
    'redirect_uri',
    process.env.NEXT_PUBLIC_MAILCHIMP_REDIRECT_URL || ''
  )

  // Generate and set state parameter for security
  mailchimpOAuthURL.searchParams.set('state', generateSecureRandomString())

  return NextResponse.redirect(mailchimpOAuthURL.toString(), 302)
}
