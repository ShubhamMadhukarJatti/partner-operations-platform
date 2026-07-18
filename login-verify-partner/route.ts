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
  const url = `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL}/v1/users/external/partner/verify`

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

    const resData = data.data || data
    const accessToken = resData.accessToken || data.accessToken
    const refreshToken = resData.refreshToken || data.refreshToken
    const userId = resData.userId || data.userId

    console.log('login-verify-partner: Retrieved token:', accessToken)

    const user = {
      uid: userId,
      email: body.email
    }

    if (accessToken && refreshToken) {
      const cookieStore = cookies()
      cookieStore.set('partnerAccessToken', accessToken, COOKIE_OPTIONS)
      cookieStore.set('partnerRefreshToken', refreshToken, COOKIE_OPTIONS)
      cookieStore.set('user', JSON.stringify(user), COOKIE_OPTIONS)
      console.log('login-verify-partner: Cookies set successfully.')
    } else {
      console.warn(
        'login-verify-partner: Missing token or refresh token. Cookies not set.'
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('Partner portal login error:', error)
    return NextResponse.error()
  }
}
