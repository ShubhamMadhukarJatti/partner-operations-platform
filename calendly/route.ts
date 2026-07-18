import { NextResponse } from 'next/server'

export async function GET() {
  const calendlyOAuthURL = new URL('https://auth.calendly.com/oauth/authorize')
  const scopes = 'default'

  calendlyOAuthURL.searchParams.set(
    'client_id',
    process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID || ''
  )
  calendlyOAuthURL.searchParams.set('scope', scopes)
  calendlyOAuthURL.searchParams.set('response_type', 'code')
  calendlyOAuthURL.searchParams.set(
    'redirect_uri',
    process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URL || ''
  )

  return NextResponse.redirect(calendlyOAuthURL.toString(), 302)
}
