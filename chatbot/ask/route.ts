import { NextRequest, NextResponse } from 'next/server'

import { fetcher, getValidToken, publicFetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      )
    }

    const token = await getValidToken()
    const data = token
      ? await fetcher<unknown>('/v1/users/chatbot/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: { message }
        })
      : await publicFetcher<unknown>('/v1/users/chatbot/ask', {
          method: 'POST',
          data: { message }
        })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to get chatbot response',
        ...details
      },
      { status }
    )
  }
}
