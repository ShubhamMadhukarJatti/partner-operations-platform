import { NextRequest, NextResponse } from 'next/server'

import { getValidToken } from '@/lib/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/user/otp-success?email=...
 * Proxies to backend via fetch (not fetcher – must never redirect on 401).
 * Never blocks or surfaces errors to the client.
 */
export async function POST(request: NextRequest) {
  let message = 'OTP login handled successfully'
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ ok: true, message }, { status: 200 })
    }

    const apiUrl =
      process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
    if (!apiUrl) {
      return NextResponse.json({ ok: true, message }, { status: 200 })
    }

    const token = await getValidToken()

    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwarded
      ? forwarded.split(',')[0].trim()
      : (realIp ?? undefined)

    // User-Agent from the browser
    const userAgent = request.headers.get('user-agent')

    const res = await fetch(
      `${apiUrl}/v1/users/otp/success?email=${encodeURIComponent(email)}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/hal+json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(clientIp && { 'X-Forwarded-For': clientIp }),
          ...(userAgent && { 'User-Agent': userAgent })
        }
      }
    )
    const data = await res.json().catch(() => ({}))
    if (data?.message) message = data.message
    else if (data?.msg) message = data.msg
  } catch {
    // Do not surface any error; flow must not stop
  }

  return NextResponse.json({ ok: true, message }, { status: 200 })
}
