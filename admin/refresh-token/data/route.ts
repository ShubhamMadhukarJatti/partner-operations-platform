import { NextResponse } from 'next/server'

import { getValidToken } from '@/lib/server'

export const dynamic = 'force-dynamic'

export type RefreshTokenItem = {
  id: number
  token: string
  expiryDate: string
  userId: string
  userEmail: string
  generatedAt: string
}

export type RefreshTokenDataResponse = {
  success: boolean
  message: string
  data: RefreshTokenItem[]
}

export async function GET() {
  try {
    const token = await getValidToken()

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in again.' },
        { status: 401 }
      )
    }

    const apiUrl =
      process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL

    if (!apiUrl) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error.' },
        { status: 500 }
      )
    }

    const response = await fetch(`${apiUrl}/v1/users/admin/refreshToken/data`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    const data: RefreshTokenDataResponse = await response
      .json()
      .catch(() => ({ success: false, message: 'Invalid response', data: [] }))

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data?.message ?? 'Request failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[Admin refresh-token/data]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch refresh token data' },
      { status: 500 }
    )
  }
}
