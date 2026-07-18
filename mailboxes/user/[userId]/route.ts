import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

interface Mailbox {
  id: string
  name: string
  email: string
  type: 'GMAIL' | 'OUTLOOK' | 'SMTP' | 'OTHER'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  isConnected: boolean
  organizationId?: string
  createdAt: string
  updatedAt: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required.' },
        { status: 400 }
      )
    }

    const data = await fetcher<Mailbox[]>(`/mailboxes/user/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'An unexpected error occurred.', details },
      { status }
    )
  }
}
