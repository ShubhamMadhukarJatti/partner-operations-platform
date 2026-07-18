import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  const state = searchParams.get('state') // This is the user.uid

  // Custom Cookie-based OAuth parameters
  const li_at = searchParams.get('li_at')
  const user_agent = searchParams.get('user_agent')
  const country = searchParams.get('country') || 'US'

  if (error) {
    return new NextResponse(
      `<html><body><h2>Error: ${error}</h2><p>${error_description}</p><script>window.close()</script></body></html>`,
      {
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }

  const host = (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')

  // 1. Check if this is the custom cookie-based OAuth flow
  if (li_at) {
    try {
      const azureUrl =
        'https://agentscoutingv3-eahkbbf8bzfrgafu.eastasia-01.azurewebsites.net/api/v1/linkedin/connect-cookie'
      const response = await fetch(azureUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          li_at,
          user_agent: user_agent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          country
        })
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error('Azure API Cookie Auth Failed:', response.status, errText)
        return new NextResponse(
          `<html><body><h2>Failed to authenticate with Azure</h2><p>${errText}</p><script>window.close()</script></body></html>`,
          { headers: { 'Content-Type': 'text/html' } }
        )
      }

      const data = await response.json()
      const accountId = data?.data?.account_id || data?.account_id || data?.id

      if (accountId) {
        cookies().set('linkedin_account_id', accountId, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
        cookies().set('linkedin_oauth_connected', state || 'true', {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
        return NextResponse.redirect(`${host}/dweep-ai`)
      }
    } catch (e) {
      console.error('Cookie OAuth Callback Error:', e)
    }
  }

  // 2. Standard LinkedIn OAuth Fallback
  if (!code) {
    return new NextResponse(
      `<html><body><h2>Error: No code provided</h2><script>window.close()</script></body></html>`,
      {
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return new NextResponse(
      `<html><body><h2>Error: Missing credentials on server</h2><script>window.close()</script></body></html>`,
      {
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }

  const redirectUri = `${host}/api/linkedin/callback`

  try {
    // 1. Exchange code for access token
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri
    })

    const tokenRes = await fetch(
      'https://www.linkedin.com/oauth/v2/accessToken',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenParams.toString()
      }
    )

    if (!tokenRes.ok) {
      const tokenError = await tokenRes.text()
      console.error('LinkedIn token exchange error:', tokenError)
      return new NextResponse(
        `<html><body><h2>Token Exchange Error</h2><p>${tokenRes.statusText}</p><script>window.close()</script></body></html>`,
        {
          headers: { 'Content-Type': 'text/html' }
        }
      )
    }

    const tokenData = await tokenRes.json()
    const accessToken = tokenData.access_token

    // 2. (Optional) Fetch user profile to verify or save data
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (profileRes.ok) {
      const profileData = await profileRes.json()
      const linkedInId = profileData.sub || profileData.id
      console.log(
        'Successfully authenticated LinkedIn User:',
        profileData.name || profileData.localizedFirstName || 'Unknown'
      )

      // Save the LinkedIn Account ID so Dweep API can use it for outreach
      if (linkedInId) {
        cookies().set('linkedin_account_id', linkedInId, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
      } else {
        console.error(
          'LinkedIn profileData did not contain a sub or id!',
          profileData
        )
      }
    } else {
      const errorText = await profileRes.text()
      console.error(
        'Failed to fetch LinkedIn profile. Status:',
        profileRes.status,
        errorText
      )
    }

    // 3. Set a cookie to remember that they connected (since we don't have Unipile anymore)
    // We set it for the user.uid to track their connection state.
    cookies().set('linkedin_oauth_connected', state || 'true', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    // 4. Redirect the user back to the Dweep AI dashboard
    return NextResponse.redirect(`${host}/dweep-ai`)
  } catch (error) {
    console.error('LinkedIn OAuth Callback Exception:', error)
    return new NextResponse(
      `<html><body><h2>Unexpected Error</h2><script>window.close()</script></body></html>`,
      {
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
}
