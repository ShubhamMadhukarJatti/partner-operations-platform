import { NextResponse } from 'next/server'

import { generateSecureRandomString } from '@/lib/utils'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const source = url.searchParams.get('source')
  const partnerId = url.searchParams.get('partnerId')

  const trelloOAuthURL = new URL('https://trello.com/1/authorize')
  const trelloScopes = 'read,write,account'

  // Build redirect URL with source and partnerId if provided
  let redirectUri = process.env.NEXT_PUBLIC_TRELLO_REDIRECT_URL || ''
  if (source && partnerId) {
    const redirectUrl = new URL(redirectUri)
    redirectUrl.searchParams.set('source', source)
    redirectUrl.searchParams.set('partnerId', partnerId)
    redirectUri = redirectUrl.toString()
  }

  trelloOAuthURL.searchParams.set(
    'key',
    process.env.NEXT_PUBLIC_TRELLO_API_KEY || ''
  )
  trelloOAuthURL.searchParams.set('scope', trelloScopes)
  trelloOAuthURL.searchParams.set('redirect_uri', redirectUri)
  trelloOAuthURL.searchParams.set('expiration', 'never')
  trelloOAuthURL.searchParams.set('name', 'Sharkdom Integration')
  trelloOAuthURL.searchParams.set('response_type', 'token')
  trelloOAuthURL.searchParams.set('callback_method', 'fragment')
  trelloOAuthURL.searchParams.set('state', generateSecureRandomString())

  return NextResponse.redirect(trelloOAuthURL.toString(), 302)
}
