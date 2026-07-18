import { NextResponse } from 'next/server'

import { generateSecureRandomString } from '@/lib/utils'

export async function GET() {
  const typeformOAuthURL = new URL('https://api.typeform.com/oauth/authorize')

  // Set required Typeform OAuth parameters
  typeformOAuthURL.searchParams.set(
    'client_id',
    process.env.NEXT_PUBLIC_TYPEFORM_CLIENT_ID || ''
  )
  typeformOAuthURL.searchParams.set('response_type', 'code')
  typeformOAuthURL.searchParams.set(
    'scope',
    'forms:write forms:read responses:read'
  )

  // Add redirect URI
  typeformOAuthURL.searchParams.set(
    'redirect_uri',
    process.env.NEXT_PUBLIC_TYPEFORM_REDIRECT_URL || ''
  )

  // Generate and set state parameter for security
  typeformOAuthURL.searchParams.set('state', generateSecureRandomString())

  return NextResponse.redirect(typeformOAuthURL.toString(), 302)
}
