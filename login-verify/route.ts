import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7 * 100
}

export async function POST(req: Request, res: Response) {
  const body = await req.json()
  const url = `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL}/v1/users/verify`

  console.log(url)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Couldnt verify email' },
        { status: response.status }
      )
    }

    console.log(body.email)

    const accessToken = data.accessToken
    const refreshToken = data.refreshToken
    const user = {
      uid: data.userId,
      email: body.email
    }

    if (accessToken && refreshToken) {
      const cookieStore = cookies()
      cookieStore.set('accessToken', accessToken, COOKIE_OPTIONS)
      cookieStore.set('refreshToken', refreshToken, COOKIE_OPTIONS)
      cookieStore.set('user', JSON.stringify(user), COOKIE_OPTIONS)
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.error()
  }
}
