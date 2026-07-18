import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const zoomOAuthURL = new URL('https://zoom.us/oauth/authorize')
  zoomOAuthURL.searchParams.set(
    'client_id',
    process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID || ''
  )
  zoomOAuthURL.searchParams.set('response_type', 'code')
  zoomOAuthURL.searchParams.set(
    'redirect_uri',
    process.env.NEXT_PUBLIC_ZOOM_REDIRECT_URL || ''
  )

  return NextResponse.redirect(zoomOAuthURL.toString(), 302)
}
