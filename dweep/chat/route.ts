import { NextRequest, NextResponse } from 'next/server'

import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { user } = await getServerUser()

    // We strictly require authentication
    if (!user?.uid) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const { prompt, session_id, account_id, li_at } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Try to get LinkedIn account ID first from the explicit frontend payload, then fallback to cookies
    const linkedinAccountId = req.cookies.get('linkedin_account_id')?.value
    console.log(
      'DWEEP CHAT - extracted linkedinAccountId from cookies:',
      linkedinAccountId
    )
    // Default to the explicit payload account_id, then cookie, then Firebase user uid
    let finalAccountId = account_id || linkedinAccountId || user.uid

    // If li_at is provided, hit the Azure API to get the Unipile account ID
    if (li_at) {
      try {
        console.log(
          'DWEEP CHAT - hitting Azure API to authenticate li_at cookie'
        )
        const authRes = await fetch(
          'https://agentscoutingv3-eahkbbf8bzfrgafu.eastasia-01.azurewebsites.net/api/v1/linkedin/connect-cookie',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              li_at,
              user_agent:
                body.user_agent ||
                req.headers.get('user-agent') ||
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              country: body.country || 'US'
            })
          }
        )

        if (authRes.ok) {
          const authData = await authRes.json()
          console.log('DWEEP CHAT - Azure auth_cookie response:', authData)
          const newAccountId =
            authData?.account_id ||
            authData?.id ||
            authData?.data?.id ||
            authData?.data?.account_id

          if (newAccountId) {
            finalAccountId = newAccountId
          }
        } else {
          console.error(
            'Azure authenticate_cookie failed:',
            authRes.status,
            await authRes.text()
          )
        }
      } catch (err) {
        console.error('Failed to authenticate li_at on Azure', err)
      }
    }
    const dweepUrl =
      'https://agentscoutingv3-eahkbbf8bzfrgafu.eastasia-01.azurewebsites.net/dweep/chat'

    // We must pass the Authorization header explicitly since we're using raw fetch for the stream
    const { token } = await getServerUser()
    const response = await fetch(dweepUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        prompt,
        session_id,
        account_id: finalAccountId,
        ...(li_at ? { li_at } : {})
      })
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('Dweep API Error:', response.status, text)
      return NextResponse.json(
        { error: `Dweep API returned ${response.status}` },
        { status: response.status }
      )
    }

    // Return the readable stream directly to the client
    // This allows the frontend to consume Server-Sent Events seamlessly
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    })
  } catch (error) {
    console.error('Proxy Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
