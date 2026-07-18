import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

interface ConnectMailboxRequest {
  userId?: string
  username: string
  password: string
  provider: 'GMAIL' | 'YAHOO' | 'OUTLOOK'
}

interface ConnectMailboxResponse {
  success: boolean
  message: string
  data: {
    id: number
    creationTimestamp: string
    lastUpdatedTimestamp: string
    mailboxId: string
    userId: string
    userName: string
    provider: string
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { user } = await getServerUser()
    const body: ConnectMailboxRequest = await request.json()
    const userId = body.userId ?? user?.uid

    if (!userId || !body.username || !body.password || !body.provider) {
      return NextResponse.json(
        {
          message:
            'Missing required fields: userId (or authenticated user), username, password, provider'
        },
        { status: 400 }
      )
    }

    const data = await fetcher<ConnectMailboxResponse>('/mailboxes/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { ...body, userId }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errData = error?.response?.data ?? {}
    const message =
      errData?.message ?? error?.message ?? 'An unexpected error occurred.'
    return NextResponse.json({ message, error: errData }, { status })
  }
}
