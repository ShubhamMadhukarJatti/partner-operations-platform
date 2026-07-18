import { NextResponse } from 'next/server'
import { parse } from 'querystring'

export async function POST(req: Request, res: Response) {
  const body = await req.text() // Read the raw text of the body
  const parsedBody = parse(body) // Parse the URL-encoded string into an object

  // Convert parsedBody to a format compatible with URLSearchParams.
  // Sanitize client_id: trim and remove '+' so URLSearchParams.toString() never encodes spaces as '+'.
  const searchParams = new URLSearchParams()
  for (const key in parsedBody) {
    let value = parsedBody[key]
    // URLSearchParams requires string values, so we convert arrays to strings
    if (Array.isArray(value)) {
      searchParams.append(key, value.join(','))
    } else {
      const str = (value as string) ?? ''
      if (key === 'client_id') {
        searchParams.append(key, str.trim().replace(/\+/g, ''))
      } else {
        searchParams.append(key, str)
      }
    }
  }

  try {
    // const zohoId = process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID as string
    // const zohoSecret = process.env.NEXT_PUBLIC_ZOHO_CLIENT_SECRET as string
    // const redirectUri = process.env.NEXT_PUBLIC_ZOHO_REDIRECTION_URL as string
    const url = `https://accounts.zoho.com/oauth/v2/token`
    // const response = await fetch(url, {
    //   method: 'POST',
    //   body: searchParams.toString() // Reconstruct the URL-encoded string
    // })
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: searchParams.toString() // Reconstruct the URL-encoded string
    })

    const data = await response.json()

    if (!response.ok) {
      // console.log({ response })
    }

    let resp
    if (data.access_token) {
      resp = NextResponse.json(data, { status: 200 })
    } else if (data?.status) {
      resp = NextResponse.json(data, { status: 404 })
    } else {
      console.log('DATAALLL::::::::', data)
      console.log('DATAALLL::::::::', searchParams.toString())
      return NextResponse.json(response, { status: 404 })
    }

    return resp
  } catch (error: any) {
    console.error('RESNED EMAIL ERROR:', error)
    return NextResponse.error()
  }
}
