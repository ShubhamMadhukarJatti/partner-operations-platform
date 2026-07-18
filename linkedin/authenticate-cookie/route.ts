import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/linkedin/authenticate-cookie
 * Accepts the LinkedIn cookie payload from the frontend and forwards it to the Azure API
 * to retrieve and securely store the Unipile account ID.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { li_at, user_agent, country } = body

    if (!li_at || !user_agent || !country) {
      return NextResponse.json(
        { error: 'li_at, user_agent, and country are required fields.' },
        { status: 400 }
      )
    }

    // Forward the payload to the Azure API as requested
    const azureUrl =
      'https://agentscoutingv3-eahkbbf8bzfrgafu.eastasia-01.azurewebsites.net/api/v1/linkedin/connect-cookie'

    const response = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        li_at,
        user_agent,
        country
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        'Azure Authenticate Cookie API Error:',
        response.status,
        errorText
      )
      return NextResponse.json(
        { error: 'Failed to authenticate LinkedIn cookie with Azure API' },
        { status: response.status }
      )
    }

    const data = await response.json()
    // The Azure API should return the Unipile account_id
    const accountId = data?.data?.account_id || data?.account_id || data?.id

    if (!accountId) {
      return NextResponse.json(
        { error: 'Azure API did not return an account ID.' },
        { status: 500 }
      )
    }

    // Securely save the account ID and connected state in the Next.js cookies
    // This allows /api/dweep/chat to automatically read it as the fallback account_id
    cookies().set('linkedin_account_id', accountId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })
    cookies().set('linkedin_oauth_connected', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })

    return NextResponse.json({ success: true, account_id: accountId })
  } catch (error) {
    console.error('Authenticate Cookie API Exception:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
