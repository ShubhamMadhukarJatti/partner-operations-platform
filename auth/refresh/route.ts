import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import axios from 'axios'

export const dynamic = 'force-dynamic'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7 * 100 // 700 days
}

const REFRESH_RETRY_DELAY_MS = 500

export async function POST(req: Request) {
  const cookieStore = cookies()
  try {
    const refreshToken = cookieStore.get('refreshToken')?.value

    if (!refreshToken) {
      cookieStore.delete('accessToken')
      cookieStore.delete('refreshToken')
      cookieStore.delete('user')
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      )
    }

    const apiUrl =
      process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
    if (!apiUrl) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const callBackend = () =>
      axios.post(
        `${apiUrl}/v1/users/refresh-token`,
        { token: refreshToken },
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        }
      )

    let refreshResponse
    try {
      refreshResponse = await callBackend()
    } catch (firstError: any) {
      const status = firstError?.response?.status
      if (status >= 500 || status === undefined) {
        await new Promise((r) => setTimeout(r, REFRESH_RETRY_DELAY_MS))
        try {
          refreshResponse = await callBackend()
        } catch (retryError: any) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Token refresh retry error:', retryError?.message)
          }
          return NextResponse.json(
            { error: 'Failed to refresh token. Please try again.' },
            { status: 500 }
          )
        }
      } else {
        throw firstError
      }
    }

    if (!refreshResponse) {
      return NextResponse.json(
        { error: 'Failed to refresh token. Please try again.' },
        { status: 500 }
      )
    }

    const newAccessToken = refreshResponse.data.accessToken
    const newRefreshToken = refreshResponse.data.refreshToken

    if (!newAccessToken || !newRefreshToken) {
      return NextResponse.json(
        { error: 'Invalid refresh response' },
        { status: 500 }
      )
    }

    cookieStore.set('accessToken', newAccessToken, COOKIE_OPTIONS)
    cookieStore.set('refreshToken', newRefreshToken, COOKIE_OPTIONS)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403 ||
      error.response?.status === 400
    ) {
      // Clear invalid auth cookies so middleware won't redirect /login → /dashboard
      cookieStore.delete('accessToken')
      cookieStore.delete('refreshToken')
      cookieStore.delete('user')
      return NextResponse.json(
        { error: 'Session expired. Please log in again.' },
        { status: 401 }
      )
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Token refresh error:', error.message)
    }

    return NextResponse.json(
      { error: 'Failed to refresh token. Please try again.' },
      { status: 500 }
    )
  }
}
