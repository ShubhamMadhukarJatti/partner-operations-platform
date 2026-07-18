import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { code, transactionId, referralCode } = body

    if (!code || !transactionId) {
      return NextResponse.json(
        { message: 'parameters for email verification missing.' },
        { status: 400 }
      )
    }

    const query = new URLSearchParams({
      transactionId,
      code
    })
    if (referralCode) query.set('referralCode', referralCode)

    const data = await fetcher<{ status?: string }>(
      `/email/verify?${query.toString()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: body
      }
    )

    return NextResponse.json(
      {
        status: data?.status,
        message: 'Email Verified succesfully'
      },
      { status: 200 }
    )
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    if (status === 400) {
      return NextResponse.json(
        {
          status: 'VERIFICATION_SUCCESSFUL',
          message: 'Email already verified'
        },
        { status: 200 }
      )
    }
    return NextResponse.json(
      { message: details?.message || 'Failed to verify email', ...details },
      { status }
    )
  }
}
