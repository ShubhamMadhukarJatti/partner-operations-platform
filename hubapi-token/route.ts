import { NextResponse } from 'next/server'
import { parse } from 'querystring'

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.text() // Read the raw text of the body
    console.log('HubSpot token request body:', body)

    const parsedBody = parse(body) // Parse the URL-encoded string into an object
    console.log('Parsed body:', { ...parsedBody, client_secret: '[HIDDEN]' })

    // Convert parsedBody to a format compatible with URLSearchParams
    const searchParams = new URLSearchParams()
    for (const key in parsedBody) {
      const value = parsedBody[key]
      // URLSearchParams requires string values, so we convert arrays to strings
      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','))
      } else {
        searchParams.append(key, value as string)
      }
    }

    console.log('Making request to HubSpot API...')

    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: searchParams.toString() // Reconstruct the URL-encoded string
    })

    const data = await response.json()
    console.log('HubSpot API response status:', response.status)
    console.log('HubSpot API response data:', data)

    let resp
    if (data.access_token) {
      resp = NextResponse.json(data, { status: 200 })
    } else if (data.error) {
      // Handle OAuth errors properly
      resp = NextResponse.json(data, { status: 400 })
    } else if (data?.status) {
      resp = NextResponse.json(data, { status: 404 })
    } else {
      resp = NextResponse.json(
        { error: 'Unknown error', details: data },
        { status: 500 }
      )
    }

    return resp
  } catch (error: any) {
    console.error('HubSpot token API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
