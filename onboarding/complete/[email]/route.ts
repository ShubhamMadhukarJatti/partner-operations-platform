import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const encodedEmail = encodeURIComponent(email)
    const data = await fetcher<unknown>(
      `/api/onboarding/complete/${encodedEmail}`,
      {
        method: 'POST',
        headers: { accept: 'application/hal+json' },
        data: {}
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const data = error?.response?.data ?? {}
    return NextResponse.json(
      {
        success: false,
        message: data?.message ?? 'Failed to complete onboarding',
        details: error?.message ?? 'Unknown error'
      },
      { status }
    )
  }
}
