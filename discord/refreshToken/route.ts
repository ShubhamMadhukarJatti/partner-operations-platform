import { NextResponse } from 'next/server'
import { parse } from 'querystring'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const parsedBody = parse(body)

    const searchParams = new URLSearchParams()
    for (const key in parsedBody) {
      const value = parsedBody[key]
      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','))
      } else {
        searchParams.append(key, value as string)
      }
    }

    const discordTokenUrl = 'https://discord.com/api/oauth2/token'

    const response = await fetch(discordTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: searchParams.toString()
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('DISCORD ERROR RESPONSE:', data)
    }

    let resp
    if (data.access_token) {
      resp = NextResponse.json(data, { status: 200 })
    } else if (data?.status) {
      resp = NextResponse.json(data, { status: 404 })
    } else {
      console.log('DATA:::::', data)
      console.log('BODY:::::', searchParams.toString())
      return NextResponse.json(response, { status: 404 })
    }

    return resp
  } catch (error: any) {
    console.error('DISCORD REFRESH ERROR:', error)
    return NextResponse.error()
  }
}
