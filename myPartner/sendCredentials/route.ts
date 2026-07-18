import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export type SendCredentialsBody = {
  url: string
  username: string
  password: string
  partnerId: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SendCredentialsBody

    if (!body?.url || !body?.username || !body?.password || !body?.partnerId) {
      return NextResponse.json(
        { message: 'url, username, password and orgId are required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/api/myPartner/sendCredentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to send credentials', details },
      { status }
    )
  }
}
