import { NextResponse } from 'next/server'

export async function GET() {
  const discordOAuthURL = new URL('https://discord.com/api/oauth2/authorize')
  const scopes = 'identify email guilds'

  discordOAuthURL.searchParams.set(
    'client_id',
    process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || ''
  )
  discordOAuthURL.searchParams.set('scope', scopes)
  discordOAuthURL.searchParams.set('response_type', 'code')
  discordOAuthURL.searchParams.set(
    'redirect_uri',
    process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URL || ''
  )

  return NextResponse.redirect(discordOAuthURL.toString(), 302)
}
