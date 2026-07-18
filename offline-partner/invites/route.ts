import { NextRequest, NextResponse } from 'next/server'
import { sendInvite } from '@/services/offline-partners'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { organizationId, email, name } = body as {
      organizationId: number
      email: string
      name: string
    }

    if (!organizationId || !email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          errorMessage: 'organizationId and email are required'
        },
        { status: 400 }
      )
    }

    await sendInvite({
      organizationId,
      email: email.trim(),
      name: (name || email || '').trim()
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to send invite'
    return NextResponse.json(
      { success: false, errorMessage: message },
      { status }
    )
  }
}
