import { NextRequest, NextResponse } from 'next/server'

import { publicFetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    const data = await publicFetcher<unknown>(
      `/email/subscribe?email=${encodeURIComponent(email)}`,
      {
        method: 'POST',
        headers: { accept: 'application/hal+json' }
      }
    )

    return NextResponse.json(data ?? {}, { status: 200 })
  } catch (error: unknown) {
    const err = error as { response?: { status: number; data?: unknown } }
    const status = err?.response?.status ?? 500
    const details = err?.response?.data
    const errorMessage =
      details?.message ?? details?.error ?? 'Something went wrong'
    return NextResponse.json({ message: errorMessage, ...details }, { status })
  }
}
