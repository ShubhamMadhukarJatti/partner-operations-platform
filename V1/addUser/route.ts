import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

type AddUserPayload = {
  name?: string
  email?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as AddUserPayload
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    const apiPath = `/user/v1/addUser?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&roles=USER`
    const data = await fetcher<{ signupUrl?: string; [k: string]: unknown }>(
      apiPath,
      {
        method: 'POST',
        headers: { Accept: 'application/json' },
        data: {}
      }
    )

    return NextResponse.json(
      {
        signupUrl: data?.signupUrl,
        message: 'Team member added successfully',
        ...data
      },
      { status: 200 }
    )
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errData = error?.response?.data ?? {}
    const message =
      errData?.errorMessage ??
      errData?.message ??
      error?.message ??
      'Internal server error'
    return NextResponse.json(
      {
        message,
        errorCode: errData?.errorCode,
        errorMessage: errData?.errorMessage
      },
      { status }
    )
  }
}
