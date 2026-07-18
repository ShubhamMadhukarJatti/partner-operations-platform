import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const senderId = request.nextUrl.searchParams.get('senderId')
    const notifyId = request.nextUrl.searchParams.get('notifyId')

    if (!senderId || !notifyId) {
      return NextResponse.json(
        { error: 'senderId and notifyId are required' },
        { status: 400 }
      )
    }

    const path = `/persona/notify?senderId=${encodeURIComponent(senderId)}&notifyId=${encodeURIComponent(notifyId)}`
    const data = await fetcher<unknown>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    return NextResponse.json(data)
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to send notification', details },
      { status }
    )
  }
}
